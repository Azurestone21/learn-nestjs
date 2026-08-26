import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { ChatService } from './chat.service';
import { SocketMessageParser } from 'src/common/utils/socket-parser.util';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: 'chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server | undefined;

  private readonly logger = new Logger(ChatGateway.name);

  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket) {
    this.logger.log(`客户端连接: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    const user = this.chatService.removeUser(client.id);
    if (user) {
      // 通知用户所有房间的成员
      for (const roomId of user.rooms) {
        this.server?.to(roomId).emit('userLeft', {
          userId: user.userId,
          username: user.username,
          members: this.chatService.getRoomMembers(roomId),
        });
      }
      this.logger.log(`用户 ${user.username} 断开连接`);
    }
  }

  /**
   * 加入房间（支持多房间）
   */
  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userId: string; username: string; roomId: string },
  ) {
    const result = SocketMessageParser.parseAndValidate<{
      userId: string;
      username: string;
      roomId: string;
    }>(data, ['userId', 'username', 'roomId']);

    if (!result.success || !result.data) {
      SocketMessageParser.sendError(client, result.error || '数据解析失败');
      return;
    }

    const { userId, username, roomId } = result.data;

    // 直接加入房间
    client.join(roomId);
    this.chatService.addUserToRoom(client.id, userId, username, roomId);

    // 获取房间成员
    const members = this.chatService.getRoomMembers(roomId);
    const isPrivate = this.chatService.isPrivateRoom(roomId);

    // 如果是单聊且对方在线，通知对方
    if (isPrivate) {
      const [, userA, userB] = roomId.split('_');
      const targetUserId = userId === userA ? userB : userA;
      if (this.chatService.isUserOnline(targetUserId)) {
        const targetSocketId = this.chatService.getUserSocketId(targetUserId);
        if (targetSocketId) {
          this.server?.to(targetSocketId).emit('privateChatStarted', {
            fromUserId: userId,
            fromUsername: username,
            roomId,
          });
        }
      }
    }

    // 推送离线消息（如果有）
    if (this.chatService.hasOfflineMessages(userId)) {
      const offlineMessages = this.chatService.getOfflineMessages(userId);
      client.emit('offlineMessages', {
        count: offlineMessages.length,
        messages: offlineMessages,
      });
    }

    // 回复当前用户
    client.emit('roomJoined', {
      roomId,
      members,
      isPrivate,
      message: `${username} 加入了房间 ${roomId}`,
    });

    // 广播给房间其他人
    client.to(roomId).emit('userJoined', {
      userId,
      username,
      members,
    });

    this.logger.log(`用户 ${username} 加入房间 ${roomId}`);
  }

  /**
   * 发送消息（支持多房间）
   */
  @SubscribeMessage('sendMessage')
  handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      roomId: string;
      senderId: string;
      senderName: string;
      message: string;
      receiverId?: string;
    },
  ) {
    const result = SocketMessageParser.parseAndValidate<{
      roomId: string;
      senderId: string;
      senderName: string;
      message: string;
      receiverId?: string;
    }>(data, ['roomId', 'senderId', 'senderName', 'message']);

    if (!result.success || !result.data) {
      SocketMessageParser.sendError(client, result.error || '数据解析失败');
      return;
    }

    const { roomId, senderId, senderName, message, receiverId } = result.data;

    // 验证用户是否在房间内
    if (!this.chatService.isUserInRoom(client.id, roomId)) {
      client.emit('error', { message: '您不在该房间中' });
      return;
    }

    const isPrivate = this.chatService.isPrivateRoom(roomId);
    const msgData = {
      id: Date.now().toString(),
      senderId,
      senderName,
      content: message,
      timestamp: new Date().toISOString(),
      chatType: isPrivate ? 'private' : 'group',
    };

    // 单聊处理
    if (isPrivate && receiverId) {
      if (!this.chatService.isUserOnline(receiverId)) {
        // 对方不在线 → 存离线消息
        this.chatService.saveOfflineMessage({
          id: msgData.id,
          fromUserId: senderId,
          fromUsername: senderName,
          toUserId: receiverId,
          content: message,
          timestamp: new Date(),
          roomId,
          chatType: 'private',
        });
        client.emit('messageSaved', {
          messageId: msgData.id,
          status: 'offline',
          targetUserId: receiverId,
        });
        return;
      }

      // 对方在线 → 发送
      const targetSocketId = this.chatService.getUserSocketId(receiverId);
      if (targetSocketId) {
        this.server?.to(targetSocketId).emit('newMessage', msgData);
        this.server?.to(targetSocketId).emit('messageDelivered', {
          messageId: msgData.id,
          fromUserId: senderId,
        });
      }
    }

    // 群聊：广播给房间所有成员
    if (!isPrivate) {
      this.server?.to(roomId).emit('newMessage', msgData);
    }

    // 发送者也收到消息（回显）
    client.emit('newMessage', msgData);

    this.logger.log(`[${roomId}] ${senderName}: ${message}`);
  }

  /**
   * 发起单聊（请求对方的单聊房间）
   */
  @SubscribeMessage('startPrivateChat')
  handleStartPrivateChat(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { targetUserId: string; targetUserName: string },
  ) {
    const result = SocketMessageParser.parseAndValidate<{
      targetUserId: string;
      targetUserName: string;
    }>(data, ['targetUserId', 'targetUserName']);

    if (!result.success || !result.data) {
      SocketMessageParser.sendError(client, result.error || '数据解析失败');
      return;
    }

    const { targetUserId, targetUserName } = result.data;

    const user = this.chatService.getUser(client.id);

    if (!user) {
      client.emit('error', { message: '请先加入一个房间' });
      return;
    }

    const roomId = this.chatService.getPrivateRoomId(user.userId, targetUserId);

    // 即使对方不在线，也创建单聊房间
    // 并告知发起者：对方不在线，消息将保存为离线消息
    if (!this.chatService.isUserOnline(targetUserId)) {
      client.emit('privateChatCreated', {
        roomId,
        targetUserId,
        targetUserName,
        targetOnline: false,
        message: `${targetUserName} 当前不在线，消息将保存为离线消息`,
      });
      return;
    }

    // 对方在线 → 正常发送单聊请求
    const targetSocketId = this.chatService.getUserSocketId(targetUserId);
    if (targetSocketId) {
      this.server?.to(targetSocketId).emit('privateChatRequest', {
        fromUserId: user.userId,
        fromUsername: user.username,
        roomId,
      });
    }

    client.emit('privateChatCreated', {
      roomId,
      targetUserId,
      targetUserName,
      targetOnline: true,
      message: `已向 ${targetUserName} 发起单聊`,
    });

    this.logger.log(`用户 ${user.username} 请求与 ${targetUserName} 单聊`);
  }

  /**
   * 离开指定房间（不离开其他房间）
   */
  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string },
  ) {
    const { roomId } = data;
    const user = this.chatService.getUser(client.id);

    if (user && user.rooms.has(roomId)) {
      client.leave(roomId);
      this.chatService.removeUserFromRoom(client.id, roomId);

      this.server?.to(roomId).emit('userLeft', {
        userId: user.userId,
        username: user.username,
        members: this.chatService.getRoomMembers(roomId),
      });

      client.emit('roomLeft', {
        roomId,
        message: `${user.username} 离开了房间 ${roomId}`,
      });
    }
  }

  /**
   * 获取用户所有房间
   */
  @SubscribeMessage('getMyRooms')
  handleGetMyRooms(@ConnectedSocket() client: Socket) {
    const rooms = this.chatService.getUserRooms(client.id);
    client.emit('myRooms', { rooms });
  }
}

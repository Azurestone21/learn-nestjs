import { Injectable } from '@nestjs/common';

export interface ChatUser {
  userId: string;
  username: string;
  rooms: Set<string>; // 'single_[userId1]_[userId2]' 或 'group_[xxx]'
}
export interface OfflineMessage {
  id: string;
  fromUserId: string;
  fromUsername: string;
  toUserId: string;
  content: string;
  timestamp: Date;
  roomId: string;
  chatType: 'private' | 'group';
}

@Injectable()
export class ChatService {
  // socketId -> 用户信息
  private users: Map<string, ChatUser> = new Map();
  // roomId -> Set<socketId> 房间里面所有socketId
  private rooms: Map<string, Set<string>> = new Map();
  // userId -> socketId
  private userIdToSocket: Map<string, string> = new Map();
  // 离线消息：userId -> OfflineMessage[]
  private offlineMessages: Map<string, OfflineMessage[]> = new Map();

  /**
   * 生成单聊房间ID
   */
  getPrivateRoomId(userA: string, userB: string): string {
    const sorted = [userA, userB].sort();
    return `single_${sorted[0]}_${sorted[1]}`;
  }

  /**
   * 生成群聊房间ID
   */
  getGroupRoomId(groupId: string): string {
    return `group_${groupId}`;
  }

  /**
   * 判断是否是单聊房间
   */
  isPrivateRoom(roomId: string): boolean {
    return roomId.startsWith('single_');
  }

  /**
   * 添加用户到指定房间（支持多房间）
   */
  addUserToRoom(
    socketId: string,
    userId: string,
    username: string,
    roomId: string,
  ): void {
    // 如果用户不存在，创建新用户
    if (!this.users.has(socketId)) {
      this.users.set(socketId, {
        userId,
        username,
        rooms: new Set(),
      });
      this.userIdToSocket.set(userId, socketId);
    }

    const user = this.users.get(socketId);
    user?.rooms.add(roomId);

    // 更新房间成员列表
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, new Set());
    }
    this.rooms.get(roomId)?.add(socketId);
  }

  /**
   * 移除用户从指定房间
   */
  removeUserFromRoom(socketId: string, roomId: string): void {
    const user = this.users.get(socketId);
    if (!user) return;

    user.rooms.delete(roomId);

    const roomMembers = this.rooms.get(roomId);
    if (roomMembers) {
      roomMembers.delete(socketId);
      if (roomMembers.size === 0) {
        this.rooms.delete(roomId);
      }
    }

    // 如果用户不在任何房间了，清除用户
    if (user.rooms.size === 0) {
      this.users.delete(socketId);
      this.userIdToSocket.delete(user.userId);
    }
  }

  /**
   * 移除用户（从所有房间移除）
   */
  removeUser(socketId: string): ChatUser | null {
    const user = this.users.get(socketId);
    if (!user) return null;

    // 从所有房间中移除
    for (const roomId of user.rooms) {
      const roomMembers = this.rooms.get(roomId);
      if (roomMembers) {
        roomMembers.delete(socketId);
        if (roomMembers.size === 0) {
          this.rooms.delete(roomId);
        }
      }
    }

    this.users.delete(socketId);
    this.userIdToSocket.delete(user.userId);
    return user;
  }

  /**
   * 获取用户所有房间
   */
  getUserRooms(socketId: string): string[] {
    const user = this.users.get(socketId);
    return user ? Array.from(user.rooms) : [];
  }

  /**
   * 检查用户是否在指定房间
   */
  isUserInRoom(socketId: string, roomId: string): boolean {
    const user = this.users.get(socketId);
    return user ? user.rooms.has(roomId) : false;
  }

  /**
   * 获取房间成员列表
   */
  getRoomMembers(roomId: string): { userId: string; username: string }[] {
    const socketIds = this.rooms.get(roomId) || new Set();
    const members: { userId: string; username: string }[] = [];
    for (const socketId of socketIds) {
      const user = this.users.get(socketId);
      if (user) {
        members.push({ userId: user.userId, username: user.username });
      }
    }
    return members;
  }

  /**
   * 检查用户是否在线
   */
  isUserOnline(userId: string): boolean {
    return this.userIdToSocket.has(userId);
  }

  /**
   * 获取用户的 socketId
   */
  getUserSocketId(userId: string): string | undefined {
    return this.userIdToSocket.get(userId);
  }

  /**
   * 获取用户信息
   */
  getUser(socketId: string): ChatUser | undefined {
    return this.users.get(socketId);
  }

  // ==================== 离线消息相关 ====================

  saveOfflineMessage(message: OfflineMessage): void {
    const { toUserId } = message;
    if (!this.offlineMessages.has(toUserId)) {
      this.offlineMessages.set(toUserId, []);
    }
    this.offlineMessages.get(toUserId)?.push(message);
  }

  getOfflineMessages(userId: string): OfflineMessage[] {
    const messages = this.offlineMessages.get(userId) || [];
    this.offlineMessages.delete(userId);
    return messages;
  }

  hasOfflineMessages(userId: string): boolean {
    const messages = this.offlineMessages.get(userId);
    return !!messages && messages.length > 0;
  }
}

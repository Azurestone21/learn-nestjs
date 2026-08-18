import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { TaskService } from './task.service';
import { SkipAuth } from 'src/common/decorators/skipAuth.decorator';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post('/add-cron-job')
  @HttpCode(HttpStatus.OK)
  @SkipAuth(true)
  addCronJob() {
    this.taskService.addCronJob('test', 59);
  }

  @Post('/delete-cron-job')
  @HttpCode(HttpStatus.OK)
  @SkipAuth(true)
  deleteCronJob() {
    this.taskService.deleteCron('test');
  }
}

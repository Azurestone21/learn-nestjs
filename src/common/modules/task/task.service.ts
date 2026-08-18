import { Injectable } from '@nestjs/common';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
const { CronJob } = require('cron');

@Injectable()
export class TaskService {
  constructor(private schedulerRegistry: SchedulerRegistry) {}

  // @Cron('45 * * * * *')
  handleCron() {
    console.log('每分钟第45秒执行一次');
  }

  // @Cron('* * 0 * * *', {
  //   name: 'notifications',
  //   timeZone: 'Europe/Paris',
  // })
  triggerNotifications() {
    console.log('每天凌晨0点执行一次');
  }

  addCronJob(name: string, seconds: number) {
    const job = new CronJob(`${seconds} * * * * *`, () => {
      console.log(`${name}任务每${seconds}秒执行一次`);
    });

    this.schedulerRegistry.addCronJob(name, job);
    job.start();

    console.log(`${name}任务每${seconds}秒执行一次`);
  }

  deleteCron(name: string) {
    this.schedulerRegistry.deleteCronJob(name);
    console.log(`${name}任务删除成功`);
  }
}

import { Injectable, OnModuleInit } from '@nestjs/common';
import { CronJob } from 'cron';
import { SchedulerRegistry } from '@nestjs/schedule';
import { WebsiteEntity } from '../websites/websites.entity';
import { MonitoringStatus } from '../websites/websites.dto';
import { WebsitesService } from '../websites/websites.service';
import { exec } from 'child_process';
import { promisify } from 'util';
import { Subscription } from 'rxjs';

@Injectable()
export class MonitorService implements OnModuleInit {
  private websitesSubscription: Subscription;
  private sites: WebsiteEntity[];
  private nextTestTime: string;
  constructor(
    private readonly websiteService: WebsitesService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  async onModuleInit() {
    this.websitesSubscription = this.websiteService.websitesChanged.subscribe(
      (websites: WebsiteEntity[]) => {
        this.sites = websites;
        this.scheduleMonitoringTask();
      },
    );
  }

  private scheduleMonitoringTask() {
    this.updateNextTestTime();
    const name = 'monitorSites';
    const jobExists = this.schedulerRegistry.doesExist('cron', name);
    if (jobExists) {
      const job = this.schedulerRegistry.getCronJob(name);
      job.stop();
      this.schedulerRegistry.deleteCronJob(name);
    }

    const job = new CronJob(this.nextTestTime, async () => {
      await this.monitorSites();
    });
    this.schedulerRegistry.addCronJob(name, job);
    job.start();
  }

  async monitorSites() {
    console.log('Monitoring sites');
    for (const site of this.sites) {
      const { id, name, url, testFrequency, nextTestTime } = site;
      if (this.shouldMonitor(nextTestTime)) {
        try {
          const responseTime = await this.measureResponseTime(url);
          let monitoringStatus: MonitoringStatus;
          if (responseTime < 20) {
            monitoringStatus = MonitoringStatus.GOOD;
          } else if (responseTime >= 20 && responseTime <= 50) {
            monitoringStatus = MonitoringStatus.AVERAGE;
          } else {
            monitoringStatus = MonitoringStatus.POOR;
          }
          await this.websiteService.updateWebsiteById({
            id,
            testFrequency,
            monitoringStatus,
          });
          console.log(`Site ${name} monitored successfully`);
        } catch (error) {
          console.error(`Error monitoring site ${name}: ${error.message}`);
        }
      }
    }
  }

  private updateNextTestTime() {
    if (this.sites && this.sites.length > 0) {
      const earliestTime: Date = new Date(
        Math.min(...this.sites.map((site) => site.nextTestTime.getTime())),
      );
      this.nextTestTime = `0 ${earliestTime.getMinutes()} ${earliestTime.getHours()} * * *`;
      const now: Date = new Date();
      now.setSeconds(0, 0);
      if (earliestTime < now) {
        now.setMinutes(now.getMinutes() + 1);
        this.nextTestTime = `0 ${now.getMinutes()} ${now.getHours()} * * *`;
      }
    }
  }

  private shouldMonitor(monitoringTime: Date): boolean {
    return monitoringTime <= new Date();
  }

  private async measureResponseTime(url: string): Promise<number> {
    try {
      const executeCommand = promisify(exec);
      const { stdout } = await executeCommand(
        `curl -o /dev/null -s -w '%{time_total}' ${url}`,
      );
      const responseTimeInSeconds = parseFloat(stdout.trim());
      return responseTimeInSeconds * 1000;
    } catch (error) {
      throw new Error(`Error measuring response time: ${error.message}`);
    }
  }
}

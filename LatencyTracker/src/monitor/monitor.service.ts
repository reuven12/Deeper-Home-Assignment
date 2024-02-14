import { Injectable, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { WebsitesEntity } from '../websites/websites.entity';
import { MonitoringStatus } from '../websites/websites.dto';
import { WebsitesService } from '../websites/websites.service';
import { exec } from 'child_process';
import { promisify } from 'util';
import { Subscription } from 'rxjs';

@Injectable()
export class MonitorService implements OnModuleInit {
  private websitesSubscription: Subscription;
  private sites: WebsitesEntity[] = [];
  constructor(private readonly websiteService: WebsitesService) {}

  async onModuleInit() {
    this.websitesSubscription = this.websiteService.websitesChanged.subscribe(
      (websites: WebsitesEntity[]) => {
        this.sites = websites;
      },
    );
    }

  @Cron(CronExpression.EVERY_30_SECONDS)
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

  private shouldMonitor(monitoringTime: Date): boolean {
    return monitoringTime > new Date();
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

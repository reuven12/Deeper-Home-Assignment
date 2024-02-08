import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { WebsitesEntity } from '../websites/websites.entity';
import { MonitoringStatus } from '../websites/websites.dto';
import { exec } from 'child_process';
import { WebsitesService } from '../websites/websites.service';

@Injectable()
export class SiteMonitoringService {
  constructor(private readonly websiteService: WebsitesService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async monitorSites() {
    const sites: WebsitesEntity[] = await this.websiteService.getAllWebsites();
    for (const site of sites) {
      const { id, name, url, nextTestTime, testFrequency } = site;
      if (this.shouldMonitor(nextTestTime)) {
        try {
          const responseTime = await this.measureResponseTime(url);
          let monitoringStatus: MonitoringStatus;
          if (responseTime < 20) {
            monitoringStatus = MonitoringStatus.good;
          } else if (responseTime >= 20 && responseTime <= 50) {
            monitoringStatus = MonitoringStatus.average;
          } else {
            monitoringStatus = MonitoringStatus.poor;
          }
          await this.websiteService.updateWebsiteById(id, {
            monitoringStatus,
            nextTestTime: new Date(Date.now() + testFrequency * 60 * 1000),
          });
        } catch (error) {
          console.error(`Error monitoring site ${name}: ${error.message}`);
        }
      }
    }
  }

  private shouldMonitor(monitoringTime: Date): boolean {
    if (monitoringTime > new Date()) {
      return false;
    }
    return true;
  }

  private measureResponseTime(url: string): Promise<number> {
    return new Promise((resolve, reject) => {
      exec(
        `curl -o /dev/null -s -w "%{time_total}" ${url}`,
        (error, stdout) => {
          if (error) {
            reject(error);
            return;
          }
          const responseTime = parseFloat(stdout) * 1000;
          resolve(responseTime);
        },
      );
    });
  }
}

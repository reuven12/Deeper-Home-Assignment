import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { WebsitesEntity } from '../websites/websites.entity';
import { MonitoringStatus } from '../websites/websites.dto';
import { exec } from 'child_process';
import { WebsitesService } from '../websites/websites.service';

@Injectable()
export class MonitorService {
  constructor(private readonly websiteService: WebsitesService) {}

  @Cron('45 * * * * *')
  async monitorSites() {
    console.log('Monitoring sites');
    const sites: WebsitesEntity[] = await this.websiteService.getAllWebsites();
    for (const site of sites) {
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
          await this.websiteService.updateWebsiteById(id, {
            monitoringStatus,
            nextTestTime: new Date(
              new Date(Date.now() + testFrequency * 60 * 1000),
            ),
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

export class WebsiteDto {
  id?: number;
  name: string;
  url: string;
  testFrequency: number;
  monitoringStatus?: MonitoringStatus;
  nextTestTime?: Date;
}

export enum MonitoringStatus {
  GOOD = 'good',
  AVERAGE = 'average',
  POOR = 'poor',
  DEFAULT = 'default'
}

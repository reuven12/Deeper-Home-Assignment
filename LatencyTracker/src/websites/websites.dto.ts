export class WebsiteDto {
  id: number;
  name: string;
  url: string;
  monitoringStatus?: MonitoringStatus;
  testFrequency: number;
  nextTestTime: Date;
}

export enum MonitoringStatus {
  good = 'good',
  average = 'average',
  poor = 'poor',
}

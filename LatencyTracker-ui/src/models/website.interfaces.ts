export interface Website {
  id: number;
  name: string;
  url: string;
  testFrequency: number;
  monitoringStatus?: MonitoringStatus;
}

export enum MonitoringStatus {
  GOOD = 'good',
  AVERAGE = 'average',
  POOR = 'poor',
  DEFAULT = 'default'
}

export enum WebsiteActionTypes {
  CREATE = 'CREATE',
  DELETE = 'DELETE',
  UPDATE = 'UPDATE',
}

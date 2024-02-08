export interface Website {
  id: number;
  name: string;
  url: string;
  monitoringStatus?: MonitoringStatus;
  testFrequency: number;
}

export enum MonitoringStatus {
  good = 'good',
  average = 'average',
  poor = 'poor',
}

export enum WebsiteActionTypes {
  CREATE = 'CREATE',
  DELETE = 'DELETE',
  UPDATE = 'UPDATE',
}

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { MonitoringStatus } from './websites.dto';

@Entity('websites')
export class WebsitesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  url: string;

  @Column({ default: MonitoringStatus.DEFAULT })
  monitoringStatus?: MonitoringStatus;

  @Column()
  testFrequency: number;

  @Column()
  nextTestTime: Date;
}

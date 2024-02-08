import { Test, TestingModule } from '@nestjs/testing';
import { SiteMonitoringService } from './site-monitoring.service';

describe('SiteMonitoringService', () => {
  let service: SiteMonitoringService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SiteMonitoringService],
    }).compile();

    service = module.get<SiteMonitoringService>(SiteMonitoringService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

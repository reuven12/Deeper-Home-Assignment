import { Test, TestingModule } from '@nestjs/testing';
import { WebsitesController } from './websites.controller';

describe('PostsController', () => {
  let controller: WebsitesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WebsitesController],
    }).compile();

    controller = module.get<WebsitesController>(WebsitesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

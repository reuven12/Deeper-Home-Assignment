import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { WebsiteDto } from 'src/websites/websites.dto';

@WebSocketGateway(8001, { cors: '*' })
export class SocketGateway {
  @WebSocketServer()
  server: any;

  @SubscribeMessage('websiteCreated')
  emitWebsiteCreated(website: WebsiteDto) {
    this.server.emit('websiteCreated', website);
  }

  @SubscribeMessage('websiteUpdated')
  emitWebsiteUpdated(website: Partial<WebsiteDto>) {
    this.server.emit('websiteUpdated', website);
  }

  @SubscribeMessage('websiteDeleted')
  emitWebsiteDeleted(websiteId: number) {
    this.server.emit('websiteDeleted', websiteId);
  }
}

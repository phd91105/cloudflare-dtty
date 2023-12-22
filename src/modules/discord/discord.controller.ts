import {
  ApplyMiddleware,
  Body,
  Controller,
  Inject,
  Post,
} from 'cloudflare-dtty';
import { BadRequest } from 'core/exceptions';
import { InteractionType } from 'discord-interactions';
import { VerifyBotRequest } from './discord.middleware';
import type { BotRequest } from './discord.model';
import { DiscordService } from './discord.service';

@Controller('/v1/bot')
@ApplyMiddleware(VerifyBotRequest)
export class DiscordController {
  constructor(@Inject(DiscordService) private service: DiscordService) {}

  @Post('/interactions')
  healthCheck(@Body() body: BotRequest) {
    switch (body.type) {
      case InteractionType.PING:
        return this.service.pong();

      case InteractionType.APPLICATION_COMMAND:
        return this.service.handleCommands(body);

      default:
        throw new BadRequest();
    }
  }
}

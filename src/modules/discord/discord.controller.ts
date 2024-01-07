import { BadRequest } from 'core/exceptions';
import { InteractionType } from 'discord-interactions';
import { ApplyMiddleware, Body, Controller, Inject, Post } from 'dtty-extra';
import { VerifyBotRequest } from './discord.guard';
import { BotRequest } from './discord.model';
import { DiscordService } from './discord.service';

@Controller('/v1/bot')
@ApplyMiddleware(VerifyBotRequest)
export class DiscordBotController {
  constructor(@Inject(DiscordService) private service: DiscordService) {}

  @Post('/interactions')
  handleCommands(@Body(BotRequest) body: BotRequest) {
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

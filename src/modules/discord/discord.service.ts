import { InteractionResponseType } from 'discord-interactions';
import { Inject, Injectable } from 'dtty-extra';
import { SlashCommands } from './discord.command';
import { commands } from './discord.constant';
import type { BotRequest } from './discord.model';

@Injectable()
export class DiscordService {
  constructor(@Inject(SlashCommands) private command: SlashCommands) {}

  pong() {
    return {
      type: InteractionResponseType.PONG,
    };
  }

  handleCommands(body: BotRequest) {
    switch (body.data.name) {
      case commands.CHERRY_PICK.name:
        return this.command.cherryPick(body);

      default:
        throw new Error();
    }
  }
}

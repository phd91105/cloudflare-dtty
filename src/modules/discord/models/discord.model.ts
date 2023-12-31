import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import type { InteractionType } from 'discord-interactions';

export class BotRequest {
  @IsNotEmpty()
  @IsNumber()
  type: InteractionType;

  @IsOptional()
  data?: obj;
}

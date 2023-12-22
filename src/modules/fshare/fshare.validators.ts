import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { fshareLinkRegex } from './fshare.contants';

export class FshareFile {
  @IsNotEmpty()
  @IsString()
  @Matches(fshareLinkRegex)
  url: string;

  @IsOptional()
  @IsString()
  password?: string;
}

export class FshareFolder {
  @IsNotEmpty()
  @IsString()
  code: string;
}

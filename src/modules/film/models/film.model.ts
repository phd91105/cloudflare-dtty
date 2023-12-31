import { IsNotEmpty, IsString } from 'class-validator';

export class FilmSearchDto {
  @IsNotEmpty()
  @IsString()
  filmName: string;
}

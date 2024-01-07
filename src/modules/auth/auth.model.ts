import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  userName: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}

export class SignInDto {
  @IsOptional()
  @IsString()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(5)
  userName?: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}

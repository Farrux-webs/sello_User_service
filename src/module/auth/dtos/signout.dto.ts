import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import type { SignoutRequest } from '../interfaces';

export class SignOutDto implements SignoutRequest {
  @IsString()
  @IsNotEmpty()
  token: string;
}

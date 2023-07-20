import { IsString, IsNotEmpty, IsEmail } from "class-validator";
import type { SignInRequest } from "../interfaces";

export class SignInDto implements SignInRequest {
    @IsString()
    @IsNotEmpty()
    password: string

    @IsEmail()
    @IsNotEmpty()
    email: string
}

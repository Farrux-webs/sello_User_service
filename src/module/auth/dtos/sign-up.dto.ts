import { IsString, IsNotEmpty, IsStrongPassword, MaxLength, IsEmail } from "class-validator";
import type { SignUpRequest } from "../interfaces";

export class SignUpDto implements SignUpRequest {
    @MaxLength(200)
    @IsString()
    @IsNotEmpty()
    username: string

    
    @IsNotEmpty()
    password: string

    @IsEmail()
    @IsNotEmpty()
    email: string
}

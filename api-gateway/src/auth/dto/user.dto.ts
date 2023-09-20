import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UserDto{

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    displayName: string;

    @IsOptional()
    role?: string;
    
}
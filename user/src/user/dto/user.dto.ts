import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export class UserDto {

    @IsNotEmpty()
    @IsEmail()
    @IsString()
    email: string

    @IsNotEmpty()
    @IsString()
    displayName: string
    
}
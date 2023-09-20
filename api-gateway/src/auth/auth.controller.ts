import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Post, UseGuards } from '@nestjs/common';
import { GoogleAuthGuard } from './guard';
import { AuthService } from './auth.service';
import { GetUser } from './decorator';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {

    constructor(@Inject('AUTH_SERVICE') private authService: AuthService, private readonly config: ConfigService) { }


    @UseGuards(GoogleAuthGuard)
    @Get('google/login')
    handleLogin() {
        return { message: 'Logging in' }
    }

    @UseGuards(GoogleAuthGuard)
    @Get('google/redirect')
    handleRedirect() {
        return { message: 'Authenticated' }
    }

    @Get('user')
    getMyProfile(@GetUser() user: any){
        return this.authService.getMyProfile(user);
    }

    @Post('user/delete')
    @HttpCode(HttpStatus.NO_CONTENT)
    userDelete(@Body('email') email: string, @GetUser() user: any) {
        return this.authService.deleteUser(user, email);
    }

    @Get('admin/cleanup')
    @HttpCode(HttpStatus.NO_CONTENT)
    cleanDB(@GetUser() user: any){
        return this.authService.cleanDataBase(user); 
    }

}

import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-google-oauth20";
import { AuthService } from "../auth.service";
import { lastValueFrom } from "rxjs";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google'){
    constructor(private readonly config: ConfigService, @Inject('AUTH_SERVICE') private readonly authService: AuthService){
        super({
            clientID: config.get('CLIENT_ID'),
            clientSecret: config.get('CLIENT_SECRET'),
            callbackURL: config.get('CALLBACK_URL'),
            scope: config.get('SCOPE').split(' '),
        });
    }
    async validate(accessToken: string, refreshToken: string, profile: Profile){
        const user =  await lastValueFrom(this.authService.validateUser({
            email: profile.emails[0].value,
            displayName: profile.displayName
        }));
        if(user){
            return user;
        }
        return null;
    }
}
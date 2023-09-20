import { PassportSerializer } from "@nestjs/passport";
import { AuthService } from "../auth.service";
import { Inject, Injectable } from "@nestjs/common";
import { lastValueFrom } from "rxjs";

@Injectable() 
export class SessionSerializer extends PassportSerializer {
    
    constructor(@Inject('AUTH_SERVICE') private readonly authService: AuthService){
        super();
    }

    serializeUser(user: any, done: Function) {
        done(null, user);
    }

    async deserializeUser(payload: any, done: Function) {
        const user = await lastValueFrom(this.authService.findUserById(payload.id));
        return user?done(null, user):done(null,null);
    }

}
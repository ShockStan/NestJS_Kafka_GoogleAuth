import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export const GetUser = createParamDecorator(
    (
        data: string | undefined,
        ctx: ExecutionContext
    )=>{
        const request: Express.Request = ctx.switchToHttp().getRequest();
        const session = request.sessionStore;
        let user = JSON.parse(JSON.stringify(session));
        user = JSON.parse(JSON.stringify(user.sessions));
        for(let key in user){
                user = user[key];
        }
        user = JSON.parse(user);
        user = user.passport.user;
        if(data){
            return user[data];
        }
        return user;
    }
)
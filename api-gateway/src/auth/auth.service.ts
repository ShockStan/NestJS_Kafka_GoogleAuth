import { ForbiddenException, Inject, Injectable, OnModuleDestroy, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { UserDto } from './dto';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class AuthService implements OnModuleInit, OnModuleDestroy{

    constructor(@Inject('ShockEdges-auth') private readonly client: ClientKafka){}

    logInTopic: string = 'shockedge.user.logIn';
    findUserTopic: string = 'shockedge.user.find';

    deleteTopic: string = "shockedge.user.delete";
    cleanDbTopic: string = "shockedge.user.clean";

    async onModuleDestroy() {
        await this.client.close();
    }

    async onModuleInit() {
        [this.logInTopic, this.findUserTopic].forEach((topic)=>{
            this.client.subscribeToResponseOf(topic);
        });
        await this.client.connect();
    }


    validateUser(user: UserDto){
        return this.client.send(this.logInTopic,{
            value: { email: user.email, displayName: user.displayName }
        });
    }

    getMyProfile(user: any){
        if(!user){
            throw new UnauthorizedException('Login to use this route.');
        }
        const myProfile: UserDto = {
            email: user.email,
            displayName: user.displayName,
            role: user.role,
        }
        return {myProfile};
    }

    deleteUser(user:any, email:string){
        if(!user){
            throw new UnauthorizedException('Login to use this route.');
        }
        if(user.email!==email){
            throw new ForbiddenException('You can\'t perform this action.');
        }
        return this.client.emit(this.deleteTopic, {
            value: email,
        });
    }

    findUserById(id: number){
        return this.client.send(this.findUserTopic, {
            value: {id: id}
        })
    }

    cleanDataBase(user: any){
        if(!user){
            throw new UnauthorizedException('Login to use this route.');
        }
        if(user.role!=='ADMIN'){
            throw new ForbiddenException('You can\'t perform this action.');
        }
        return this.client.emit(this.cleanDbTopic, {
            value: {action: 'clean db'}
        });
    }

}

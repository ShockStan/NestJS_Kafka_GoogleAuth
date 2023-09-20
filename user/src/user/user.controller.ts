import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './user.service';
import { UserDto } from './dto';

@Controller()
export class UserController {

    constructor(private readonly userService: UserService){}
    
    @MessagePattern('shockedge.user.logIn')
    userValidation(@Payload() userDetails: UserDto){
        return this.userService.userExists(userDetails);
    }

    @MessagePattern('shockedge.user.delete')
    userDelete(@Payload() email: string){
        this.userService.deleteUser(email);
    }
 
    @MessagePattern('shockedge.user.find')
    findUserById(@Payload() user: any){
        const userId = user.id;
        return this.userService.findUserById(+userId);
    }

    @MessagePattern('shockedge.user.clean')
    cleanUpDb(@Payload() message: any){
        return this.userService.cleanDB();
    }


}

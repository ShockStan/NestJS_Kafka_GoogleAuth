import { Injectable } from '@nestjs/common';
import { UserDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {

    constructor(private readonly prisma: PrismaService){}

    async createUser(userDetails: UserDto){
        try{
            const user = await this.prisma.user.create({
                data:{
                    email: userDetails.email,
                    displayName: userDetails.displayName
                }
            });
            console.log('New User singed up - ',new Date().toLocaleString('en-US', {timeZone: 'Asia/Kolkata', hour12: false}));
            return user;
        }
        catch(err){
            console.log(err);
        }
    }

    async userExists(userDetails: UserDto){
        try{
            const user = await this.prisma.user.findUnique({
                where:{
                    email: userDetails.email,
                }
            });
            if(!user){
                return await this.createUser(userDetails);
            }
            if(user.displayName !== userDetails.displayName){
                return await this.editUser(userDetails);
            }
            console.log('User logged In - ',new Date().toLocaleString('en-US', {timeZone: 'Asia/Kolkata', hour12: false}));
            return user;
        }
        catch(err){
            console.log(err);
        }
    }

    async editUser(userDetails: UserDto){
        try{
            const updatedUser = await this.prisma.user.update({
                where: {
                    email: userDetails.email
                },
                data: {
                    displayName: userDetails.displayName
                }
            });
            console.log('User Name updated! - ',new Date().toLocaleString('en-US', {timeZone: 'Asia/Kolkata', hour12: false}));
            return updatedUser;
        }
        catch(err){
            console.log(err);
        }
    }

    async deleteUser(userEmail: string){
        try{
            await this.prisma.user.delete({
                where: {
                    email: userEmail
                },
            });
            console.log('User deleted - ', new Date().toLocaleString('en-US', {timeZone: 'Asia/Kolkata', hour12: false}));
        }
        catch(err){
            console.log(err);
        }
    }

    async findUserById(id: number){
        try{
            const user = await this.prisma.user.findFirst({
                where: {
                    id: id
                },
            });
            console.log('User details requested - ',new Date().toLocaleString('en-US', {timeZone: 'Asia/Kolkata', hour12: false}));
            return user;
        }
        catch(err){
            console.log(err);
        }
    }

    async cleanDB(){
        try{
            const db = await this.prisma.cleanDb();
            console.log('Database cleaned - ',new Date().toLocaleString('en-US', {timeZone: 'Asia/Kolkata', hour12: false}));
            return db;
        }
        catch(err){
            console.log(err);
        }
    }
}

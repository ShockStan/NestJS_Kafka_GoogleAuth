import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'ShockEdges',
        useFactory: (config: ConfigService)=>({
          transport: Transport.KAFKA,
          options: {
            client:{
              clientId: config.get('KAFKA_CLIENT_ID'),
              brokers: [config.get('BROKER_HOST')]
            },
            consumer: {
              groupId: config.get('KAFKA_GROUP_ID'), 
            }
          }
        }),
        inject: [ConfigService]
      }
    ])
  ],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PassportModule } from '@nestjs/passport';
import { Partitioners } from 'kafkajs';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
    }),
    PassportModule.register({ session: true }),
    AuthModule,
    ProductModule,
    ClientsModule.registerAsync({
      clients: [{
        name: 'ShockEdges-auth',
        useFactory: (config: ConfigService)=>({
          transport: Transport.KAFKA,
          options: {
            client:{
              clientId: 'auth-module',
              brokers: [config.get('BROKER_HOST')]
            },
            producer: {
              createPartitioner: Partitioners.DefaultPartitioner
            },
            consumer: {
              groupId: 'auth-module',
            },
            
          }
        }),
        inject: [ConfigService],
      },
    ],
    isGlobal: true,
    }),
  ],
  exports:[],
  controllers: [],
  providers: [],
})
export class AppModule {}

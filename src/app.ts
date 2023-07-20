import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from "@nestjs/microservices"
import { appConfig, dbConfig } from '@config';
import { AuthModule, OrderModule } from '@module';

  

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [dbConfig],
      isGlobal: true,
    }),
    AuthModule,
    OrderModule
  ],
})
export class App {}

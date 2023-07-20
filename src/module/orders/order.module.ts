import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { PrismaService } from '@prisma';
import { OrderController } from './order.controller';

@Module({
  providers: [OrderService, PrismaService],
  controllers: [OrderController],
})
export class OrderModule {}

import type { SubCategory } from '@prisma/client';
import * as jwt from 'jsonwebtoken';
import {
  ConflictException,
  Injectable,
  NotFoundException,
  Inject,
  BadRequestException,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PrismaService } from '@prisma';
import type {
  CreateOrderRequest,
  UpdateOrderRequest,
  CreateOrderResponse,
  UpdateOrderResponse,
  RetrieveOrderResponse,
} from './interfaces';



@Injectable()
export class OrderService {
  readonly #_prisma: PrismaService;

  constructor(prisma: PrismaService) {
    this.#_prisma = prisma;
  }
  async create(payload: CreateOrderRequest): Promise<CreateOrderResponse> {   
try {

  console.log(payload);

  const token = payload.userId;

  const VerifyToken = await jwt.verify(token, process.env.SECRET_KEY);
  const id = VerifyToken.id

  const newOrder = await this.#_prisma.order.create({
    data: {
      count: payload.count,
      userId: id,
      productId: payload.productId,
    },
    select: {
      id: true,
    },
  });

  return {
    message: 'Created',
  };
} catch (error) {
  console.log(error);
  
}
  }

  async retrieveAll(): Promise<RetrieveOrderResponse[]> {
    const AllOrders = await this.#_prisma.order.findMany({
      select: {
        id: true,
        count: true,
        productId: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return AllOrders;
  }

  async Put(payload: UpdateOrderRequest): Promise<UpdateOrderResponse> {
    
    const existingData = await this.#_prisma.order.findFirst();
    if (!existingData) {
      throw new Error('No data found.');
    }

    
    await this.#_prisma.order.update({
      where: { id: existingData.id },
      data: {
        count: payload.count,
        productId: payload.productId
      },
    });

    return { message: 'Updated' };
  }

  async delete(id: string): Promise<Object> {
    await this.#_prisma.order.delete({
      where: { id },
    });

    return { message: 'Deleted' };
  }
}

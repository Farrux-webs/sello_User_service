import { Controller, Param, Body, Query } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OrderService } from './order.service';
import { OCommands } from './enums';
import { CreateOrderDto, UpdateOrderDto } from './dtos';
import type {
  CreateOrderResponse,
  UpdateOrderResponse,
  RetrieveOrderResponse,
} from './interfaces';

@Controller()
export class OrderController {
  readonly #_service: OrderService;

  constructor(service: OrderService) {
    this.#_service = service;
  }

  @MessagePattern(OCommands.CREATE_ORDER)
  create(
    @Payload() payload: CreateOrderDto): Promise<CreateOrderResponse> {

      
      
    return this.#_service.create(payload);
  }
  @MessagePattern(OCommands.RETRIEVE_ORDER)
  retrieveAll(): Promise<RetrieveOrderResponse[]> {
    return this.#_service.retrieveAll();
  }
  @MessagePattern(OCommands.UPDATE_ORDER)
  update(@Payload() payload: UpdateOrderDto): Promise<UpdateOrderResponse> {
    return this.#_service.Put(payload);
  }
  @MessagePattern(OCommands.DELETE_ORDER)
  delete(id: string): Promise<Object> {
    return this.#_service.delete(id);
  }
}

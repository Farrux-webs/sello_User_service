import { IsInt, IsNotEmpty } from 'class-validator';
import type { CreateOrderRequest } from '../interfaces';

export class CreateOrderDto implements CreateOrderRequest {
  @IsInt()
  @IsNotEmpty()
  count: number;
}

import { IsInt, IsNotEmpty } from 'class-validator';
import type { UpdateOrderRequest } from '../interfaces';

export class UpdateOrderDto implements UpdateOrderRequest {
  @IsInt()
  @IsNotEmpty()
  count: number;
}

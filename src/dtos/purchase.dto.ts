import { IsNumber } from "class-validator";

export class PurchaseDto {
  @IsNumber()
  productId!: number;
}

import { IsString } from "class-validator";

export class ItemDto {
  @IsString()
  appId!: string;

  @IsString()
  currency!: string;
}

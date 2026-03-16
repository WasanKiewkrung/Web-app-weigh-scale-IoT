import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ReceiptItemDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  qty: number;

  @IsNumber()
  price: number;

  @IsNumber()
  total: number;
}

// DTO หลักสำหรับการสร้างใบเสร็จให้ตรงกับ Receipt schema
export class CreateReceiptDto {
  @IsString()
  @IsNotEmpty()
  sellerName: string;

  @IsString()
  @IsNotEmpty()
  sellerDetail: string;

  @IsString()
  @IsNotEmpty()
  customerName: string;

  @IsString()
  @IsOptional()
  customerAddress?: string;

  @IsString()
  @IsNotEmpty()
  shippingMethod: string;

  @IsNumber()
  shippingCost: number;

  @ValidateNested({ each: true })
  @Type(() => ReceiptItemDto)
  @ArrayMinSize(1)
  items: ReceiptItemDto[];

  @IsNumber()
  totalProduct: number;

  @IsNumber()
  totalAll: number;

  @IsString()
  @IsOptional()
  status?: string;

  // ✅ เพิ่ม orderId เพื่อเชื่อมกับ meatData
  @IsString()
  @IsNotEmpty()
  orderId: string;
}

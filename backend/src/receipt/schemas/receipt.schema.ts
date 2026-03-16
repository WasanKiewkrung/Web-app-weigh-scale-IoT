import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ReceiptDocument = Receipt & Document;

// ⭐️ Subschema for items (Best practice, readable)
export class ReceiptItem {
  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  qty: number;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  total: number;
}

@Schema({ timestamps: true })
export class Receipt {
  @Prop({ required: true, unique: true }) // Unique running no.
  receiptNo: string;

  // ✅ เพิ่มฟิลด์ orderId เพื่อเชื่อมกับ meatData
  @Prop({ required: true })
  orderId: string;

  @Prop({ required: true })
  sellerName: string;

  @Prop({ required: true })
  sellerDetail: string;

  @Prop({ required: true })
  customerName: string;

  @Prop()
  customerAddress?: string;

  @Prop({ required: true })
  shippingMethod: string;

  @Prop({ required: true })
  shippingCost: number;

  @Prop({ type: [Object], required: true }) // Array of ReceiptItem
  items: ReceiptItem[];

  @Prop({ required: true })
  totalProduct: number;

  @Prop({ required: true })
  totalAll: number;

  @Prop({ default: 'created' })
  status?: string;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const ReceiptSchema = SchemaFactory.createForClass(Receipt);

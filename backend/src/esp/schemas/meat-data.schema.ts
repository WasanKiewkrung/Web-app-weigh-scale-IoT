import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MeatDataDocument = MeatData & Document & {
  _id: Types.ObjectId;
};

@Schema()
export class MeatData {
  @Prop({ required: true })
  date: string; // 📅 วันที่เก็บข้อมูล เช่น "2025-05-15"

  @Prop({ required: true })
  time: string; // 🕒 เวลา เช่น "10:58:17"

  @Prop({ required: true })
  meatType: number; // 🐄 ทำเป็น number defined 

  @Prop({ required: true })
  weight: number; // ⚖️ น้ำหนักเนื้อหน่วยกิโลกรัม เช่น 0.438

  @Prop({ required: false, default: null })
  orderId: string; // 🧾 สำหรับ Group order

  @Prop()
  customerName?: string; // 👤 ใส่ชื่อหลัง confirm

  @Prop()
  shippingType?: string; // 🚚 ประเภทขนส่ง (LineMan, Grab)

  @Prop()
  shippingPrice?: number; // 💸 ราคาขนส่ง
}

export const MeatDataSchema = SchemaFactory.createForClass(MeatData);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// ✅ เพิ่ม type export สำหรับใช้กับ @InjectModel()
export type BeefDefinitionDocument = BeefDefinition & Document;

@Schema({ collection: 'meatprice' }) // Target to meatprice
export class BeefDefinition {
  @Prop({ required: true, unique: true })
  key: number;

  @Prop({ required: true })
  label: string;

  @Prop({ required: true })
  beefCode: string;

  @Prop({ required: true })
  unit: string;

  @Prop({ required: true })
  pricePerKg: number;
}

export const BeefDefinitionSchema = SchemaFactory.createForClass(BeefDefinition);

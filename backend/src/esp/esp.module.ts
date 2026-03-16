import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { EspController } from './esp.controller';
import { EspService } from './esp.service';

import { MeatData, MeatDataSchema } from './schemas/meat-data.schema';
import { BeefDefinition, BeefDefinitionSchema } from './schemas/beef-definition.schema'; // ✅ เพิ่ม


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MeatData.name, schema: MeatDataSchema },
      { name: BeefDefinition.name, schema: BeefDefinitionSchema }, // ✅ เพิ่มตรงนี้
    ]),
  ],
  controllers: [EspController],
  providers: [EspService],
})
export class EspModule { }

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BeefDefinitionController } from './beef-definition.controller';
import { BeefDefinitionService } from './beef-definition.service';

// ✅ แก้ path ให้ถูกตามตำแหน่งจริงของ schema
import { BeefDefinition, BeefDefinitionSchema } from '../esp/schemas/beef-definition.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BeefDefinition.name, schema: BeefDefinitionSchema },
    ]),
  ],
  controllers: [BeefDefinitionController],
  providers: [BeefDefinitionService],
  exports: [BeefDefinitionService],
})
export class BeefDefinitionModule { }

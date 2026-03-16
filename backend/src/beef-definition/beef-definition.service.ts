import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BeefDefinition, BeefDefinitionDocument } from '../esp/schemas/beef-definition.schema';


@Injectable()
export class BeefDefinitionService {
  constructor(
    @InjectModel(BeefDefinition.name)
    private beefModel: Model<BeefDefinitionDocument>,
  ) { }

  // ✅ ดึงราคาเนื้อทั้งหมด
  async getAllPrices(): Promise<BeefDefinition[]> {
    return this.beefModel.find().exec();
  }

  // ✅ ดึงราคาตาม beefCode
  async getPriceByCode(beefCode: string): Promise<BeefDefinition | null> {
    return this.beefModel.findOne({ beefCode }).exec();
  }
}

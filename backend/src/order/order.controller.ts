import { Controller, Get, Param, Body, Patch } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MeatData, MeatDataDocument } from '../esp/schemas/meat-data.schema';

@Controller('order')
export class OrderController {
  constructor(
    @InjectModel(MeatData.name)
    private meatModel: Model<MeatDataDocument>,
  ) { }

  // ✅ Step 3: ดึงออเดอร์ทั้งหมดที่ยังไม่ใส่ชื่อ
  @Get('unassigned')
  async getUnassignedOrders() {
    return this.meatModel.aggregate([
      { $match: { customerName: { $exists: false } } },
      {
        $group: {
          _id: '$orderId',
          count: { $sum: 1 },
          totalWeight: { $sum: '$weight' },
          date: { $first: '$date' },
          time: { $first: '$time' },
        },
      },
      { $sort: { date: -1, time: -1 } },
    ]);
  }

  // ✅ Step 4: ดึงรายการเนื้อในออเดอร์
  @Get(':orderId/meats')
  async getMeatsByOrder(@Param('orderId') orderId: string) {
    return this.meatModel.find({ orderId }).exec();
  }

  // ✅ Step 5: ใส่ชื่อและค่าส่งในออเดอร์
  @Patch(':orderId/assign')
  async assignCustomerAndShipping(
    @Param('orderId') orderId: string,
    @Body() body: {
      customerName: string;
      shippingType: string;
      shippingPrice: number;
    },
  ) {
    const updated = await this.meatModel.updateMany(
      { orderId },
      {
        $set: {
          customerName: body.customerName,
          shippingType: body.shippingType,
          shippingPrice: body.shippingPrice,
        },
      },
    );

    return { message: '✅ Order updated', modifiedCount: updated.modifiedCount };
  }
}

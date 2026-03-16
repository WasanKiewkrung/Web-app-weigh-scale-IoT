import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Receipt, ReceiptDocument } from './schemas/receipt.schema';
import { CreateReceiptDto } from './dto/create-receipt.dto';
import { UpdateReceiptDto } from './dto/update-receipt.dto';

@Injectable()
export class ReceiptService {
  constructor(
    @InjectModel(Receipt.name) private readonly receiptModel: Model<ReceiptDocument>,
  ) { }

  // ฟังก์ชันเก่าที่มีอยู่แล้ว...
  private async generateReceiptNo(): Promise<string> {
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const last = await this.receiptModel
      .find({ receiptNo: { $regex: `^RCP-${today}-` } })
      .sort({ receiptNo: -1 })
      .limit(1)
      .lean();

    let nextSeq = 1;
    if (last.length > 0) {
      const lastNo = last[0].receiptNo;
      const parts = lastNo.split('-');
      nextSeq = parseInt(parts[2], 10) + 1;
    }

    return `RCP-${today}-${nextSeq.toString().padStart(4, '0')}`;
  }

  // ฟังก์ชันสร้างใบเสร็จใหม่
  async create(dto: CreateReceiptDto): Promise<ReceiptDocument> {
    const receiptNo = await this.generateReceiptNo();
    const created = new this.receiptModel({ ...dto, receiptNo });
    return created.save();
  }

  // ฟังก์ชันค้นหาใบเสร็จจาก ID
  async findById(id: string): Promise<ReceiptDocument> {
    const receipt = await this.receiptModel.findById(id).exec();
    if (!receipt) throw new BadRequestException('Receipt not found');
    return receipt;
  }

  // ฟังก์ชันใหม่: ค้นหาใบเสร็จจาก orderId
  async findByOrderId(orderId: string): Promise<ReceiptDocument | null> {
    return this.receiptModel.findOne({ orderId }).exec();
  }

  // ฟังก์ชันอัปเดตใบเสร็จ
  async update(id: string, dto: UpdateReceiptDto): Promise<ReceiptDocument> {
    const updated = await this.receiptModel.findByIdAndUpdate(id, dto, {
      new: true,
    });
    if (!updated) throw new BadRequestException('Receipt not found');
    return updated;
  }

  // ค้นหาใบเสร็จที่ customerName
  async findByCustomerName(customerName: string): Promise<ReceiptDocument[]> {
    try { 
      const receipts = await this.receiptModel
        .find({ customerName: { $regex: customerName, $options: 'i' } }) // ใช้ regex เพื่อค้นหาแบบ case-insensitive
        .exec();

      if (!receipts.length) {
        throw new BadRequestException('ไม่พบใบเสร็จสำหรับชื่อลูกค้านี้');
      }

      return receipts;
    } catch (error) {
      throw new BadRequestException(error.message || 'เกิดข้อผิดพลาด');
    }
  }

  // ✅ เพิ่มฟังก์ชันZIPใบเสร็จตามช่วงวันที่
  async findByDateRange(from: string, to: string): Promise<ReceiptDocument[]> {
    const fromDate = new Date(`${from}T00:00:00.000Z`);
    const toDate = new Date(`${to}T23:59:59.999Z`);
    return this.receiptModel
      .find({
        createdAt: { $gte: fromDate, $lte: toDate },
      })
      .lean() 
      .exec();
  }

  // ✅ ฟังก์ชัน suggestCustomerNames สำหรับ Autocomplete ชื่อลูกค้า
  async suggestCustomerNames(keyword: string): Promise<string[]> {
    const pipeline: any[] = [
      {
        $match: {
          customerName: {
            $exists: true,
            $ne: '',
            ...(keyword ? { $regex: keyword.trim(), $options: 'i' } : {}),
          },
        },
      },
      {
        $group: {
          _id: '$customerName',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $project: { _id: 0, customerName: '$_id' } }
    ];

    const results = await this.receiptModel.aggregate(pipeline).exec();
    return results.map(r => r.customerName);
  }
}


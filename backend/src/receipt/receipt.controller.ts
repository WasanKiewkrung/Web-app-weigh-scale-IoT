import { Controller, Post, Get, Param, Body, Patch, NotFoundException, BadRequestException, Query } from '@nestjs/common';
import { ReceiptService } from './receipt.service';
import { CreateReceiptDto } from './dto/create-receipt.dto';
import { UpdateReceiptDto } from './dto/update-receipt.dto';

@Controller('receipt')
export class ReceiptController {
  constructor(private readonly receiptService: ReceiptService) { }

  // POST /api/receipt
  @Post()
  async create(@Body() dto: CreateReceiptDto) {
    const receipt = await this.receiptService.create(dto);
    return {
      receiptId: receipt._id,
      receiptNo: receipt.receiptNo,
      createdAt: receipt.createdAt,
    };
  }

  // ✅ GET /api/receipt/by-customer/:customerName (ต้องอยู่บน)
  @Get('by-customer/:customerName')
  async findByCustomerName(@Param('customerName') customerName: string) {
    try {
      const receipts = await this.receiptService.findByCustomerName(customerName);
      return receipts;
    } catch (error) {
      throw new BadRequestException(error.message || 'เกิดข้อผิดพลาด');
    }
  }

  // ✅ GET /api/receipt/by-order/:orderId (ต้องอยู่บน)
  @Get('by-order/:orderId')
  async findByOrderId(@Param('orderId') orderId: string) {
    const receipt = await this.receiptService.findByOrderId(orderId);
    if (!receipt) throw new NotFoundException('Receipt not found');
    return {
      _id: receipt._id,
      customerName: receipt.customerName,
      receiptNo: receipt.receiptNo,
    };
  }

  // GET /api/receipt/by-date?from=YYYY-MM-DD&to=YYYY-MM-DD
  @Get('by-date')
  async findByDate(
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    if (!from || !to) {
      throw new BadRequestException('Missing "from" or "to" query params');
    }
    return this.receiptService.findByDateRange(from, to);
  }

  @Get('customer-names')
  async getCustomerNames(@Query('keyword') keyword: string) {
    const result = await this.receiptService.suggestCustomerNames(keyword || '');
    return result;
  }

  // GET /api/receipt/:id (ต้องอยู่ล่างสุด)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    const receipt = await this.receiptService.findById(id);
    if (!receipt) throw new NotFoundException('Receipt not found');
    return {
      receiptId: receipt._id,
      receiptNo: receipt.receiptNo,
      sellerName: receipt.sellerName,
      sellerDetail: receipt.sellerDetail,
      customerName: receipt.customerName,
      customerAddress: receipt.customerAddress,
      shippingMethod: receipt.shippingMethod,
      shippingCost: receipt.shippingCost,
      items: receipt.items,
      totalProduct: receipt.totalProduct,
      totalAll: receipt.totalAll,
      createdAt: receipt.createdAt,
    };
  }

  // PATCH /api/receipt/:id
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateReceiptDto) {
    return this.receiptService.update(id, dto);
  }
}
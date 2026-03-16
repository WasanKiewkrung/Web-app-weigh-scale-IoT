import { Controller, Get, Query, Res, BadRequestException } from '@nestjs/common';
import { Response } from 'express';
import { SummaryExcelService } from './summary-excel.service';

@Controller('summary')
export class SummaryExcelController {
  constructor(private readonly summaryExcelService: SummaryExcelService) { }

  // GET /api/receipt/summary-excel?from=2025-06-01&to=2025-06-16
  @Get('summary-excel')
  async downloadSummaryExcel(
    @Query('from') from: string,
    @Query('to') to: string,
    @Res() res: Response,
  ) {
    if (!from || !to) {
      throw new BadRequestException('Missing "from" or "to" query params');
    }

    const buffer = await this.summaryExcelService.generateSummaryExcel(from, to);

    // 👇 เพิ่ม timestamp ลงในชื่อไฟล์เพื่อความไม่ซ้ำ
    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, '-'); // ทำให้ปลอดภัยบนทุก OS
    const filename = `Summary_${from}_to_${to}_${timestamp}.xlsx`;

    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${filename}"`,
    });

    // ✅ ใช้ .end แทน .send เพื่อรองรับ Buffer อย่างถูกต้อง
    res.end(buffer);
  }
}

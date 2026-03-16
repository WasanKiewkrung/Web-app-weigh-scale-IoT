import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as Excel from 'exceljs';
import { Receipt, ReceiptDocument } from '../receipt/schemas/receipt.schema';

@Injectable()
export class SummaryExcelService {
  constructor(
    @InjectModel(Receipt.name)
    private readonly receiptModel: Model<ReceiptDocument>
  ) { }

  async generateSummaryExcel(from: string, to: string): Promise<Buffer> {
    const fromDate = new Date(`${from}T00:00:00.000Z`);
    const toDate = new Date(`${to}T23:59:59.999Z`);

    const receipts = await this.receiptModel.find({
      createdAt: { $gte: fromDate, $lte: toDate },
    }).lean();

    const workbook = new Excel.Workbook();

    // Sheet 1 – รายการใบเสร็จ
    const sheet1 = workbook.addWorksheet('Receipt Logs');
    sheet1.addRow([
      'Time Date',
      'RCP_Number',
      'Name',
      'Meat',
      'Qty',
      'Total',
      'Ship_Method',
      'Ship_Cost',
    ]);

    for (const r of receipts) {
      for (const item of r.items) {
        sheet1.addRow([
          r.createdAt ? new Date(r.createdAt).toLocaleString('th-TH') : '',
          r.receiptNo,
          r.customerName,
          item.description,
          item.qty,
          
          item.total,
          r.shippingMethod,
          r.shippingCost,
        ]);
      }
    }

    /// === Sheet 2 (All_Summary) ===
    const sheet2 = workbook.addWorksheet('All_Summary');
    sheet2.addRow([
      'Meat', 'Number of Sales', 'Qty', 'TotalProduct', '', 'Shipping Method', 'Shipping Cost'
    ]);

    // ----- Meat Summary -----
    const meatSummaryMap = new Map<string, { count: number; qty: number; total: number }>();
    for (const r of receipts) {
      for (const item of r.items) {
        const key = item.description;
        const record = meatSummaryMap.get(key) || { count: 0, qty: 0, total: 0 };
        record.count++;
        record.qty += item.qty;
        record.total += item.total;
        meatSummaryMap.set(key, record);
      }
    }

    let grandTotalSale = 0;
    let meatRows = 0;
    for (const [meat, data] of meatSummaryMap.entries()) {
      sheet2.addRow([meat, data.count, data.qty, data.total]);
      grandTotalSale += data.total;
      meatRows++;
    }

    // ----- Shipping Summary -----
    // ดึง Shipping Method ทั้งหมดและเรียงตำแหน่ง (ให้ชิด Meat ไม่มีช่องว่าง)
    const shippingMap = new Map<string, number>();
    for (const r of receipts) {
      if (!r.shippingMethod) continue;
      const sum = shippingMap.get(r.shippingMethod) || 0;
      shippingMap.set(r.shippingMethod, sum + (r.shippingCost || 0));
    }
    const shippingEntries = Array.from(shippingMap.entries());
    let grandTotalShipping = 0;

    // จัด Shipping Method ให้อยู่แถวเดียวกับเนื้อ (E2, F2, G2 ...)
    let rowIndex = 2; // row 1 is header
    for (let i = 0; i < shippingEntries.length; i++) {
      const [method, cost] = shippingEntries[i];
      // ถ้ายังไม่มี row ให้เพิ่ม row ว่างให้ครบถึง shippingRows
      while (sheet2.rowCount < rowIndex + i) {
        sheet2.addRow([]);
      }
      // ใส่ค่า Shipping ลงคอลัมน์ E, F ของแต่ละแถว (ถัดจาก meatRows)
      const row = sheet2.getRow(rowIndex + i);
      row.getCell(6).value = method; 
      row.getCell(7).value = cost;   
      row.commit();
      grandTotalShipping += cost;
    }

    // ====== สรุป =======
    sheet2.addRow([]);
    sheet2.addRow(['', 'Total Sales', grandTotalSale, '', '', 'Total Shipping', grandTotalShipping]);
    sheet2.addRow(['', '', '', '', '', 'Grand Total (Sales + Shipping)', grandTotalSale + grandTotalShipping]);

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }
}

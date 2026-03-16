import JSZip from 'jszip';
import { pdf } from '@react-pdf/renderer';
import ReceiptPDF from '../app/components/pdf/receipt.pdf';
import { getLogoBase64 } from './getLogoBase64';

// ฟังก์ชันสร้าง Zip ที่รวม PDF ทุกใบ
export async function generateReceiptsZip(receipts) {
  const zip = new JSZip();
  const logoBase64 = await getLogoBase64();
  for (const receipt of receipts) {
    // Render PDF แต่ละใบ
    const blob = await pdf(
      <ReceiptPDF receipt={receipt} logoBase64={logoBase64} />
    ).toBlob();
    const filename = `${receipt.receiptNo || receipt._id || 'unknown'}.pdf`;
    zip.file(filename, blob);
  }
  return await zip.generateAsync({ type: 'blob' });
}
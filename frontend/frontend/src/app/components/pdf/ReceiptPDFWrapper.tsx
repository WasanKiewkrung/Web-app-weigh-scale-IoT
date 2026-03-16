'use client';

import { useEffect, useState } from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import ReceiptPDF from './receipt.pdf';
import type { Receipt } from '@/types/receipt';

export default function ReceiptPDFWrapper({ receipt }: { receipt: Receipt }) {
  const [logoBase64, setLogoBase64] = useState<string | null>(null);

  useEffect(() => {
    fetch('/logo/logo.jpg')
      .then(res => res.blob())
      .then(blob => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = (reader.result as string).split(',')[1];
          setLogoBase64(base64);
        };
        reader.readAsDataURL(blob);
      });
  }, []);

  if (!logoBase64) return <p>⏳ กำลังโหลดโลโก้...</p>;

  return (
    <PDFViewer width="100%" height="1000px">
      <ReceiptPDF receipt={receipt} logoBase64={logoBase64} />
    </PDFViewer>
  );
}

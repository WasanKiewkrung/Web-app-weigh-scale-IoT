'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  receipt: any; // หรือกำหนด ReceiptType ตาม schema จริง
  onDelete: (receiptId: string) => void;
}

export default function ReceiptCard({ receipt, onDelete }: Props) {
  const router = useRouter();

  // Helper แปลงวันที่
  function formatDate(dt: string) {
    if (!dt) return '';
    const date = new Date(dt);
    return date.toLocaleString('th-TH', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    });
  }

  const handleEdit = () => {
    // ไปหน้าอัปเดตใบเสร็จ (หรือปรับ URL ตามระบบ)
    router.push(`/receipt/confirm?edit=1&id=${receipt._id}`);
  };

  return (
    <div className="border rounded p-4 mb-4 bg-white shadow">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h4 className="font-bold text-xl">
            เลขที่ใบเสร็จ: <span className="tracking-wide">{receipt.receiptNo}</span>
          </h4>
          <div className="font-bold text-gray-600 mt-1 text-m">
            ลูกค้า: {receipt.customerName}
          </div>
          <div className="text-gray-500 text-sm">
            วันที่: {formatDate(receipt.createdAt)}
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <button
            onClick={handleEdit}
            className="px-3 py-1 rounded text-white bg-yellow-600 hover:bg-yellow-700"
          >
            อัปเดตใบเสร็จ
          </button>
          <button
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
            onClick={() => onDelete(receipt._id)}
          >
            ลบ
          </button>
        </div>
      </div>

      <table className="w-full border text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">#</th>
            <th className="p-2 border">รายการเนื้อ</th>
            <th className="p-2 border">จำนวน(kg,pc)</th>
            <th className="p-2 border">ราคา(บาท)</th>
          </tr>
        </thead>
        <tbody>
          {receipt.items?.map((item: any, idx: number) => (
            <tr key={idx}>
              <td className="p-2 border">{idx + 1}</td>
              <td className="p-2 border">{item.description}</td>
              <td className="p-2 border">{item.qty}</td>
              <td className="p-2 border">{Number(item.total).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

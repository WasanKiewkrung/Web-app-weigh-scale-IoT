'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  orderId: string;
}

const ReceiptActionButton: React.FC<Props> = ({ orderId }) => {
  const router = useRouter();
  const [customerName, setCustomerName] = useState('');
  const [receiptExists, setReceiptExists] = useState(false);

  const checkReceipt = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const res = await fetch(`${baseUrl}/api/receipt/by-order/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setCustomerName(data.customerName);
        setReceiptExists(true);
      } else {
        setReceiptExists(false);
      }
    } catch (err) {
      console.error('❌ Receipt check failed', err);
    }
  };

  useEffect(() => {
    if (orderId) checkReceipt();
  }, [orderId]);

  const handleClick = () => {
    if (!receiptExists) {
      // ✅ ดึง meatlogs ทั้งหมดจาก localStorage
      const logsRaw = localStorage.getItem('meatlogs');
      if (logsRaw) {
        try {
          const allLogs = JSON.parse(logsRaw);

          // ✅ filter เฉพาะรายการที่ตรงกับ orderId นี้
          const matchedItems = allLogs.filter((item: any) => item.orderId === orderId);

          // ✅ บันทึก matchedItems ลง localStorage
          localStorage.setItem('receiptMatchedItems', JSON.stringify(matchedItems));

          console.log('🧾 Matched items saved:', matchedItems);
        } catch (err) {
          console.error('❌ Failed to parse meatlogs', err);
        }
      }
    }

    const query = receiptExists ? `?edit=1&id=${orderId}` : `?orderId=${orderId}`;
    router.push(`/receipt/confirm${query}`);
  };  

  return (
    <div className="flex items-center gap-2 mb-2">
      <button
        className={`px-3 py-1 rounded ${receiptExists ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'
          } text-white`}
        onClick={handleClick}
      >
        {receiptExists ? 'อัปเดตใบเสร็จ' : 'สร้างใบเสร็จ'}
      </button>
      {receiptExists && (
        <span className="text-gray-600">ลูกค้า: {customerName}</span>
      )}
    </div>
  );
};

export default ReceiptActionButton;

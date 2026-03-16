'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  orderId: string;
  items: any[];
  onDelete: (orderId: string) => void;
}

export default function OrderCard({ orderId, items, onDelete }: Props) {
  const router = useRouter();
  const [customerName, setCustomerName] = useState('');
  const [receiptExists, setReceiptExists] = useState(false);
  const [receiptNo, setReceiptNo] = useState('');
  const [receiptId, setReceiptId] = useState(''); 

  useEffect(() => {
    // ตรวจสอบว่ามีใบเสร็จของ order นี้อยู่แล้วหรือยัง
    const fetchReceipt = async () => {
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
          setCustomerName(data.customerName || '');
          setReceiptNo(data.receiptNo || ''); 
          setReceiptExists(true);
          setReceiptId(data._id || '');
        } else {
          setReceiptExists(false);
          setCustomerName('');
          setReceiptNo('');
        }
      } catch (err) {
        console.error('❌ Error fetching receipt:', err);
        setReceiptExists(false);
        setCustomerName('');
        setReceiptNo('');
        setReceiptId('');
      }
    };

    if (orderId) fetchReceipt();
  }, [orderId]);

  /**
   * อัปเดต logic ปุ่ม "สร้างใบเสร็จ" ให้
   * - เซฟ meat log (items) เฉพาะ orderId นี้ลง localStorage
   * - ส่ง orderId ไปหน้า /receipt/create เสมอ (เป็น query string)
   * 
   * ส่วนอัปเดตใบเสร็จ (edit) คง logic เดิมไว้
   */
  const handleClick = () => {
    localStorage.setItem('selectedMeatItems', JSON.stringify(items));
    if (receiptExists) {
      // อัปเดตใบเสร็จ (กรณีมีอยู่แล้ว)
      router.push(`/receipt/confirm?edit=1&id=${receiptId}`);
    } else {
      // กรณีสร้างใบเสร็จใหม่ → ส่ง orderId ใน query string ด้วย
      router.push(`/receipt/create?orderId=${orderId}`);
    }
  };

  const handleDelete = () => {
    onDelete(orderId);
  };

  return (
    <div className="border rounded p-4 mb-4 bg-white shadow">
      <div className="flex justify-between items-center mb-2">
        <div>
          {receiptExists && receiptNo ? (
            <>
              <h4 className="font-bold text-xl">
                เลขที่ใบเสร็จ: <span className="tracking-wide">{receiptNo}</span>
              </h4>
              <div className="font-bold text-gray-600 mt-1 text-m">
                ลูกค้า: {customerName}
              </div>
            </>
          ) : (
            <>
                <h4 className="font-bold text-xl">Order ID: {orderId}</h4>
            </>
          )}
        </div>
        <div className="flex gap-2 items-center">
          <button
            onClick={handleClick}
            className={`px-3 py-1 rounded text-white ${receiptExists ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'}`}
          >
            {receiptExists ? 'อัปเดตใบเสร็จ' : 'สร้างใบเสร็จ'}
          </button>
          <button
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
            onClick={handleDelete}
          >
            ลบ
          </button>
        </div>
      </div>

      {/* ตารางเหมือนเดิม */}
      <table className="w-full border text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">เวลา</th>
            <th className="p-2 border">รหัสชนิดเนื้อ</th>
            <th className="p-2 border">ชื่อชนิดเนื้อ</th>
            <th className="p-2 border">น้ำหนัก (กก.)</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={item._id || idx}>
              <td className="p-2 border">{item.time}</td>
              <td className="p-2 border">{item.meatType}</td>
              <td className="p-2 border">{item.meatName || 'ไม่มีในฐานข้อมูล'}</td>
              <td className="p-2 border">{item.weight}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { pdf } from '@react-pdf/renderer';
import Navbar from '../../../components/Navbar';
import ReceiptPDF from '../../../components/pdf/receipt.pdf';

export default function ReceiptPreviewPage() {
  const { receiptId } = useParams();
  const [receipt, setReceipt] = useState(null); // ใช้ dynamic typing ไม่ต้องใช้ Receipt และ ReceiptItem
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    console.log('Fetching data for receiptId:', receiptId); // ตรวจสอบว่าเราได้ `receiptId` หรือยัง
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/Login');
      return;
    }
    setAuthorized(true);

    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
    fetch(`${apiBase}/api/receipt/${receiptId}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch receipt');
        return res.json();
      })
      .then(data => {
        console.log('API response data:', data); // ดูข้อมูลที่ได้รับจาก API
        setReceipt(data);  // ส่งข้อมูลมาให้ setReceipt
      })
      .catch(err => {
        console.error('Error fetching receipt:', err);
        setError('ไม่สามารถโหลดข้อมูลใบเสร็จได้');
      })
      .finally(() => setLoading(false));
  }, [receiptId, router]);

  if (!authorized || loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  if (error) {
    return <div className="min-h-screen flex items-center justify-center"><p className="text-red-500">{error}</p></div>;
  }

  const totalProduct = receipt?.items.reduce((sum, item) => sum + item.qty * item.price, 0) || 0;
  const grandTotal = totalProduct + (receipt?.shippingCost || 0);

  const handleDownload = async () => {
    if (!receipt) return;
    const blob = await pdf(<ReceiptPDF receipt={receipt} />).toBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${receipt.receiptNo}.pdf`;
    a.click();
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar title="CheQbeef+ Display" onTitleClick={() => router.push('/Report')} />
      <div className="p-6 max-w-4xl mx-auto flex-1">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <img src="/logo-backyard.jpg" alt="Backyard Logo" className="h-40 mb-0" />
        </div>

        {/* Header ขวา: ใบเสร็จรับเงิน + เลขที่/วันที่ */}
        <div className="flex flex-col items-end mb-4">
          <h1 className="text-3xl font-bold text-cyan-700">ใบเสร็จรับเงิน</h1>
          <div className="text-sm text-gray-600 mt-2">
            <div>เลขที่: {receipt?.receiptNo}</div>
            <div>วันที่: {new Date(receipt?.createdAt).toLocaleDateString('th-TH')}</div>
          </div>
        </div>

        {/* ข้อมูลผู้ขาย */}
        <div className="mb-4">
          <h2 className="font-semibold">ผู้ขาย</h2>
          <p>
            {receipt?.sellerName}<br />
            {receipt?.sellerDetail.split('\n').map((line, idx) => (
              <React.Fragment key={idx}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </p>
        </div>

        {/* ข้อมูลลูกค้า */}
        <div className="mt-4">
          <h2 className="font-semibold">ลูกค้า</h2>
          <p>
            {receipt?.customerName}
            {receipt?.customerAddress && <><br />{receipt?.customerAddress}</>}
          </p>
        </div>

        {/* รายการสินค้า */}
        <table className="w-full border border-gray-300 mb-4 text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">#</th>
              <th className="p-2 border">รายการ</th>
              <th className="p-2 border text-right">จำนวน</th>
              <th className="p-2 border text-right">ราคา/หน่วย</th>
              <th className="p-2 border text-right">รวม</th>
            </tr>
          </thead>
          <tbody>
            {receipt?.items.map((item, idx) => (
              <tr key={idx}>
                <td className="p-2 border">{idx + 1}</td>
                <td className="p-2 border">{item.description}</td>
                <td className="p-2 border text-right">{item.qty}</td>
                <td className="p-2 border text-right">{item.price.toFixed(2)}</td>
                <td className="p-2 border text-right">{(item.qty * item.price).toFixed(2)}</td>
              </tr>
            ))}
            {/* Shipping row */}
            <tr>
              <td className="p-2 border">{receipt?.items.length + 1}</td>
              <td className="p-2 border">{receipt?.shippingMethod === 'custom' ? receipt?.customShippingMethod : receipt?.shippingMethod}</td>
              <td className="p-2 border text-right">1</td>
              <td className="p-2 border text-right">{receipt?.shippingCost.toFixed(2)}</td>
              <td className="p-2 border text-right">{receipt?.shippingCost.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        {/* รวมทั้งสิ้น */}
        <div className="flex justify-end mt-2">
          <div className="font-bold text-lg text-red-700">
            จำนวนเงินรวมทั้งสิ้น {grandTotal.toLocaleString('th-TH', { minimumFractionDigits: 2 })} บาท
          </div>
        </div>

        {/* ช่องเซ็นชื่อ */}
        <div className="mt-12 text-sm text-gray-700">
          <div className="grid grid-cols-2 gap-12">
            {/* ฝั่งซ้าย */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-15">ในนาม {receipt?.customerName}</div>
              <div className="w-full flex justify-center gap-8 mb-1">
                <div className="w-32 border-t border-gray-400 pt-1">ผู้ชำระเงิน</div>
                <div className="w-24 border-t border-gray-400 pt-1">วันที่</div>
              </div>
            </div>

            {/* ฝั่งขวา */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-15">ในนาม Backyard Bangkok</div>
              <div className="w-full flex justify-center gap-8 mb-1">
                <div className="w-32 border-t border-gray-400 pt-1">ผู้รับเงิน</div>
                <div className="w-24 pt-1">
                  วันที่ {new Date(receipt?.createdAt).toLocaleDateString('th-TH')}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ ปุ่มดาวน์โหลด PDF */}
        <div className="flex justify-end space-x-3 mt-6">
          <button onClick={() => handleDownload('pdf')} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}

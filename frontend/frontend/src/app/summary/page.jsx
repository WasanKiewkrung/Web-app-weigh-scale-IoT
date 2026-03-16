'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import { generateReceiptsZip } from '../../utils/receiptZipDownloader';

function ReceiptSummaryPage() {
  const router = useRouter();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/Login');
    } else {
      setAuthorized(true);
    }
  }, [router]);

  if (!authorized) return null;

  // ปุ่มดาวน์โหลด Summary Excel
  const handleDownload = async () => {
    if (!from || !to) return alert('กรุณาเลือกช่วงวันที่');

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const res = await fetch(`${baseUrl}/api/summary/summary-excel?from=${from}&to=${to}`);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const now = new Date();
      const yyyyMMdd = now.toISOString().split('T')[0];
      const hhmm = now.toTimeString().slice(0, 5).replace(':', '');
      const timestamp = `${yyyyMMdd}_${hhmm}`;
      link.download = `Summary_${timestamp}.xlsx`;
      link.click();
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการดาวน์โหลด Excel');
    }
  };

  // ✅ Handler สำหรับดาวน์โหลด ZIP ใบเสร็จย้อนหลัง (แยกออกมา scope เดียวกับ component)
  const handleDownloadReceiptsZip = async () => {
    if (!from || !to) return alert('กรุณาเลือกช่วงวันที่');

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const res = await fetch(`${baseUrl}/api/receipt/by-date?from=${from}&to=${to}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!res.ok) throw new Error('เกิดข้อผิดพลาดในการดึงใบเสร็จ');
      const receipts = await res.json();
      if (!receipts || receipts.length === 0) {
        alert('ไม่พบใบเสร็จในช่วงเวลาที่เลือก');
        return;
      }
      const zipBlob = await generateReceiptsZip(receipts);

      const url = window.URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      const now = new Date();
      const yyyyMMdd = now.toISOString().split('T')[0];
      const hhmm = now.toTimeString().slice(0, 5).replace(':', '');
      const timestamp = `${yyyyMMdd}_${hhmm}`;
      link.href = url;
      link.download = `Receipts_${from}_to_${to}_${timestamp}.zip`;
      link.click();

    } catch (error) {
      alert('เกิดข้อผิดพลาดในการดาวน์โหลด ZIP: ' + (error?.message || error));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar title="CheQbeef+ Display" onTitleClick={() => router.push('/Report')} />
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Summary รายงานยอดขาย</h1>

        <div className="flex flex-wrap gap-4 mb-4 items-end">
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">From:</label>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="border px-3 py-1 rounded"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">To:</label>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="border px-3 py-1 rounded"
            />
          </div>

          {/* ปุ่มลัด */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                const today = new Date().toISOString().split('T')[0];
                setFrom(today);
                setTo(today);
              }}
              className="bg-indigo-700 hover:bg-indigo-600 text-white px-4 py-2 rounded"
            >
              วันนี้
            </button>
            <button
              onClick={() => {
                const now = new Date();
                const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
                const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
                setFrom(firstDay);
                setTo(lastDay);
              }}
              className="bg-indigo-700 hover:bg-indigo-600 text-white px-4 py-2 rounded"
            >
              เดือนนี้
            </button>
          </div>
        </div>

        <div className="flex flex-row gap-6 mt-4">
        <button
          onClick={handleDownload}
          disabled={!from || !to}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded disabled:opacity-50"
        >
          ดาวน์โหลด Summary Excel
        </button>

        <button
            onClick={handleDownloadReceiptsZip}
          disabled={!from || !to}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50"
        >
          ดาวน์โหลดใบเสร็จย้อนหลัง
        </button>
      </div>
      </div>
    </div>
  );
}

export default ReceiptSummaryPage;

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import Navbar from '../components/Navbar';
import Container from '../components/Container';
import OrderCard from '../components/report/OrderCard';
import ReceiptActionButton from '../components/report/ReceiptActionButton';


function Report() {
  const router = useRouter();
  const [meatData, setMeatData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [error, setError] = useState(null);
  const [authorized, setAuthorized] = useState(false);
  const formattedDate = format(selectedDate, 'yyyy-MM-dd');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setAuthorized(false);
      router.replace('/Login');
    } else {
      setAuthorized(true);
    }
  }, [router]);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const res = await fetch(`${baseUrl}/api/esp/data-by-date?date=${formattedDate}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
      const data = await res.json();
      setMeatData(data);
    } catch (err) {
      console.error('🚨 Fetch error:', err.message);
      setError('ไม่สามารถโหลดข้อมูลได้');
    }
  };

  useEffect(() => {
    if (authorized) fetchData();
  }, [authorized, formattedDate]);

  useEffect(() => {
    if (!authorized) return;
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [authorized, formattedDate]);

  const grouped = meatData.reduce((acc, item) => {
    const key = item.orderId || 'UNKNOWN';
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('ยืนยันการลบออเดอร์นี้ทั้งหมด?')) return;
    try {
      const token = localStorage.getItem('token');
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const res = await fetch(`${baseUrl}/api/esp/delete-order?orderId=${orderId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('ลบไม่สำเร็จ');
      fetchData();
    } catch (err) {
      alert('ลบไม่สำเร็จ: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar title="CheQbeef+ Display" onTitleClick={() => router.refresh()} />
      <Container>
        {authorized ? (
          <>
            <div className="flex justify-between items-center mt-4 mb-2">
              <h3 className="text-2xl font-semibold">รายงานน้ำหนักเนื้อ</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => router.push('/summary')}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
                >
                  Summary
                </button>
                <button
                  onClick={() => router.push('/receipt/edit')}
                  className="bg-red-800 hover:bg-yellow-600 text-white px-4 py-2 rounded"
                >
                  ค้นหาใบเสร็จ
                </button>
                <DatePicker
                  selected={selectedDate}
                  onChange={setSelectedDate}
                  dateFormat="yyyy-MM-dd"
                  className="border px-3 py-1 rounded"
                />
              </div>
            </div>

            <hr className="my-3" />
            {error && <p className="text-red-500">{error}</p>}

            {Object.entries(grouped).map(([orderId, items]) => (
              <div key={orderId}>
                <OrderCard
                  key={orderId}
                  orderId={orderId}
                  items={items}
                  onDelete={handleDeleteOrder}
                />
              </div>
            ))}
          </>
        ) : (
          <p>กำลังตรวจสอบการล็อกอิน...</p>
        )}
      </Container>
    </div>
  );
}

export default Report;

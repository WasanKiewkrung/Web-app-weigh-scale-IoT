'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Import ส่วนประกอบที่แยกออกมา
import Navbar from '../../components/Navbar';
import MeatLogTable from '../../components/create/MeatLogTable';
import ReceiptSummary from '../../components/create/ReceiptSummary';

export default function ReceiptCreatePage() {
  
  const router = useRouter();

  // State หลักของหน้านี้
  const [items, setItems] = useState([]);
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [authorized, setAuthorized] = useState(false);

  // ดึง orderId จาก query string ทันทีที่เข้าหน้า (สำคัญมาก!)
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const oid = query.get('orderId');
    if (!oid) {
      setErrorMsg('ไม่พบ orderId');
      setLoading(false);
      router.replace('/Report'); // redirect ถ้าไม่มี orderId
      return;
    }
    setOrderId(oid);

    // เช็ค token (login) เหมือนเดิม
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/Login');
      return;
    }
    setAuthorized(true);
  }, [router]);

  // ฟังก์ชันรวม meat log ตาม unit (เหมือนเดิม)
  const groupItems = (items) => {
    const grouped = [];
    const pcMap = new Map();
    for (const item of items) {
      const key = `${item.beefCode}_${item.unit}`;
      if (item.unit === 'Pc') {
        if (!pcMap.has(key)) {
          pcMap.set(key, {
            ...item,
            qty: 1,
            total: item.pricePerKg,
          });
        } else {
          const existing = pcMap.get(key);
          existing.qty += 1;
          existing.total = existing.qty * existing.pricePerKg;
          pcMap.set(key, existing);
        }
      } else {
        grouped.push({
          ...item,
          qty: item.weight,
          total: item.pricePerKg * item.weight,
        });
      }
    }
    grouped.push(...Array.from(pcMap.values()));
    return grouped;
  };

  // โหลด meat log จาก localStorage → enrich ด้วย match-prices → group → setItems
  useEffect(() => {
    if (!orderId || !authorized) return;
    setLoading(true);

    // ❶ ดึงข้อมูล meat log ที่เลือกไว้ (ตามเดิม)
    const raw = localStorage.getItem('selectedMeatItems');
    if (!raw) {
      setItems([]);
      setLoading(false);
      return;
    }
    const selectedItems = JSON.parse(raw);

    // ❷ ส่ง meat log ไป API match-prices เพื่อให้ backend เติมชื่อเนื้อ/ราคาต่อหน่วย
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/beef-definition/match-prices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(selectedItems),
    })
      .then(res => {
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        return res.json();
      })
      .then((matched) => {
        // ❸ group รายการตาม unit (เช่น qty, total)
        const grouped = groupItems(matched);
        setItems(grouped);
        // (optional) เก็บไว้ใน localStorage สำหรับหน้า confirm
        localStorage.setItem('receiptMatchedItems', JSON.stringify(grouped));
      })
      .catch((err) => {
        console.error('❌ Failed to fetch match-prices:', err);
        setErrorMsg('ไม่สามารถโหลดข้อมูลจากระบบได้ กรุณาลองใหม่หรือติดต่อผู้ดูแล');
      })
      .finally(() => setLoading(false));
  }, [orderId, authorized]);

  // ถ้ายังไม่ authorize (login) ให้ return null ไปก่อน
  if (!authorized) return null;

  // Event handler เมื่อจะไปกรอกข้อมูลลูกค้า (ส่ง orderId ไป confirm ด้วย)
  const handleCustomerInput = () => {
    // เก็บ items (ที่ group/enrich แล้ว) พร้อม orderId สำหรับหน้าถัดไป
    localStorage.setItem('receiptMatchedItems', JSON.stringify({ orderId, items }));
    router.push(`/receipt/confirm?orderId=${orderId}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar ใช้ส่วนกลาง */}
      <Navbar title="CheQbeef+ Display" onTitleClick={() => router.push('/Report')} />
      <div className="flex-1 p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">สร้างใบเสร็จ</h1>
        {/* Loading/error/empty state */}
        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-100 rounded" />
            <div className="h-4 bg-gray-100 rounded" />
            <div className="h-4 bg-gray-100 rounded w-1/2" />
          </div>
        ) : errorMsg ? (
          <p className="text-red-500">{errorMsg}</p>
        ) : items.length === 0 ? (
          <p className="text-gray-500">ยังไม่มีรายการที่เลือก</p>
        ) : (
          <>
            {/* ตาราง meat log แยกเป็น component */}
            <MeatLogTable items={items} />
            {/* ส่วนสรุปราคากับปุ่ม ไปกรอกข้อมูลลูกค้า */}
            <ReceiptSummary items={items} onNext={handleCustomerInput} />
          </>
        )}
      </div>
    </div>
  );
}
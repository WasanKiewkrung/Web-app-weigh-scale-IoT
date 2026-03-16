'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Navbar from '../../components/Navbar';
import MeatLogTable from '../../components/confirm/MeatLogTable';
import ReceiptSummary from '../../components/confirm/ReceiptSummary';
import CustomerFields from '../../components/confirm/CustomerFields';
import SellerFields from '../../components/confirm/SellerFields';
import { useRouter } from 'next/navigation';

export default function ReceiptConfirmPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  //field form
  const [items, setItems] = useState([]);
  const [normalizedItems, setNormalizedItems] = useState([]);
  const [sellerName, setSellerName] = useState('');
  const [customSellerName, setCustomSellerName] = useState('');
  const [sellerDetail, setSellerDetail] = useState('');
  const [customSellerDetail, setCustomSellerDetail] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [shippingMethod, setShippingMethod] = useState('');
  const [customShippingMethod, setCustomShippingMethod] = useState('');
  const [shippingCost, setShippingCost] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [receiptNo, setReceiptNo] = useState('');
  const [orderId, setOrderId] = useState('');

  // ฟังก์ชัน normalizeItemList
  function normalizeItemList(items) {
    if (!items || !Array.isArray(items)) return [];
    // Receipt DB format
    if (items[0]?.description) {
      return items.map(it => ({
        name: String(it.description ?? ''),
        qty: Number(it.qty ?? 0),
        price: Number(it.price ?? 0),
        total: Number(it.total ?? 0),
      }));
    }
    // Meatlog format
    return items.map(it => ({
      name: String(it.label ?? ''),
      qty: Number(it.qty ?? it.weight ?? 0),
      price: Number(it.pricePerKg ?? 0),
      total: Number(it.total ?? 0),
    }));
  }

  // ตรวจสอบการยืนยันตัวตน + โหลดข้อมูล
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/Login');
      return;
    }
    setAuthorized(true);

    const query = new URLSearchParams(window.location.search);
    const isEdit = query.get('edit') === '1';
    const editReceiptId = query.get('id');
    const orderIdFromQuery = query.get('orderId');

    if (isEdit && editReceiptId) {
      const fetchReceipt = async () => {
        try {
          const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
          const token = localStorage.getItem('token');
          const res = await fetch(`${apiBase}/api/receipt/${editReceiptId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (!res.ok) throw new Error('ไม่พบใบเสร็จเดิม');
          const data = await res.json();
          setItems(data.items || []);
          setNormalizedItems(normalizeItemList(data.items || []));
          setIsEditMode(true);
          setEditId(editReceiptId);
          setReceiptNo(data.receiptNo || '');
          setOrderId(data.orderId || '');

          setItems(data.items || []);
          setSellerName(data.sellerName || '');
          setSellerDetail(data.sellerDetail || '');
          setCustomerName(data.customerName || '');
          setCustomerAddress(data.customerAddress || '');
          setShippingMethod(data.shippingMethod || '');
          setShippingCost(data.shippingCost || 0);
        } catch (err) {
          setErrorMsg('ไม่พบใบเสร็จเดิม');
          setItems([]);
          setNormalizedItems([]);
        }
      };
      fetchReceipt();
      return;
    }

    // โหมดสร้างใหม่
    if (orderIdFromQuery) setOrderId(orderIdFromQuery);
    const raw = localStorage.getItem('receiptMatchedItems');
    if (!raw) {
      setItems([]);
      setNormalizedItems([]);
      return;
    }
    try {
      // support ทั้งกรณี save { orderId, items }
      const data = JSON.parse(raw);
      if (Array.isArray(data)) {
        setItems(data);
        setNormalizedItems(normalizeItemList(data));
      } else if (data.items) {
        setItems(data.items);
        setNormalizedItems(normalizeItemList(data.items));
        if (!orderId && data.orderId) setOrderId(data.orderId);
      }
    } catch (err) {
      setItems([]);
      setNormalizedItems([]);
    }
  }, [router]);

  // Group & คำนวณยอด
  const groupItems = (items) => {
    const grouped = [];
    const pcMap = new Map();
    for (const item of items) {
      const key = `${item.beefCode}_${item.unit}`;
      if (item.unit === 'Pc') {
        if (!pcMap.has(key)) {
          pcMap.set(key, { ...item, qty: 1, weight: 1, total: item.pricePerKg });
        } else {
          const existing = pcMap.get(key);
          existing.qty += 1;
          existing.total = existing.qty * existing.pricePerKg;
          pcMap.set(key, existing);
        }
      } else {
        grouped.push({ ...item, qty: item.weight });
      }
    }
    grouped.push(...Array.from(pcMap.values()));
    return grouped;
  };
  const groupedItems = useMemo(() => groupItems(items), [items]);
  const totalProduct = useMemo(
    () => normalizedItems.reduce((sum, item) => sum + (item.total || 0), 0),
    [normalizedItems]
  );
  const shippingItem = useMemo(
    () =>
      shippingMethod
        ? {
          label: shippingMethod === 'custom' ? customShippingMethod : shippingMethod,
          weight: 1,
          pricePerKg: shippingCost,
          total: shippingCost,
        }
        : null,
    [shippingMethod, customShippingMethod, shippingCost]
  );
  const totalAll = useMemo(
    () => totalProduct + (shippingItem ? shippingItem.total : 0),
    [totalProduct, shippingItem]
  );

  const clearError = () => errorMsg && setErrorMsg('');

  const handleSubmit = async () => {
    if (normalizedItems.length === 0) {
      setErrorMsg('กรุณาเลือกสินค้าอย่างน้อย 1 รายการ');
      return;
    }
    if (!customerName || !shippingMethod) {
      setErrorMsg('กรุณากรอกชื่อลูกค้าและวิธีจัดส่ง');
      return;
    }
    const finalSellerName = sellerName === 'custom' ? customSellerName : sellerName;
    const finalSellerDetail = sellerDetail === 'custom' ? customSellerDetail : sellerDetail;
    if (sellerDetail === 'custom' && !customSellerDetail) {
      setErrorMsg('กรุณากรอกรายละเอียดผู้ขาย');
      return;
    }
    if (!isEditMode && !orderId) {
      setErrorMsg('ไม่พบ orderId สำหรับการสร้างใบเสร็จ');
      return;
    }
    setErrorMsg('');
    setLoading(true);
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
      const url = isEditMode
        ? `${apiBase}/api/receipt/${editId}`
        : `${apiBase}/api/receipt`;
      const method = isEditMode ? 'PATCH' : 'POST';
      const mappedItems = normalizedItems.map((item) => ({
        description: item.name,
        qty: item.qty,
        price: item.price,
        total: item.total,
      }));
      const payload = {
        sellerName: finalSellerName,
        sellerDetail: finalSellerDetail,
        customerName,
        customerAddress,
        shippingMethod: shippingMethod === 'custom' ? customShippingMethod : shippingMethod, // รวม customShippingMethod เข้าไปใน shippingMethod
        shippingCost,
        items: mappedItems,
        totalProduct,
        totalAll,
        ...(isEditMode ? {} : { orderId }),
      };
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('การบันทึกใบเสร็จล้มเหลว');
      const result = await res.json();
      const redirectId = isEditMode ? editId : result.receiptId;
      localStorage.removeItem('editReceipt');
      router.push(`/receipt/preview/${redirectId}`);
    } catch (err) {
      setErrorMsg('เกิดข้อผิดพลาดขณะบันทึกใบเสร็จ');
    } finally {
      setLoading(false);
    }
  };

  if (!authorized) return null;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar title="CheQbeef+ Display" onTitleClick={() => router.push('/Report')} />
      <div className="p-6 max-w-4xl mx-auto flex-1">
        <h1 className="text-2xl font-bold mb-2">
          {isEditMode ? 'อัปเดตใบเสร็จเดิม' : 'สร้างใบเสร็จใหม่'}
        </h1>
        {isEditMode && (
          <p className="text-sm text-gray-600 mb-4">
            📝 กำลังแก้ไขใบเสร็จเลขที่ <strong>{receiptNo}</strong>
          </p>
        )}
        {errorMsg && <p className="text-red-500 mb-4">{errorMsg}</p>}

        {/* ===== Seller fields component ===== */}
        <SellerFields
          sellerName={sellerName}
          setSellerName={setSellerName}
          customSellerName={customSellerName}
          setCustomSellerName={setCustomSellerName}
          sellerDetail={sellerDetail}
          setSellerDetail={setSellerDetail}
          customSellerDetail={customSellerDetail}
          setCustomSellerDetail={setCustomSellerDetail}
        />
        {/* ===== Customer fields component ===== */}
        <CustomerFields
          customerName={customerName}
          setCustomerName={setCustomerName}
          customerAddress={customerAddress}
          setCustomerAddress={setCustomerAddress}
        />

        {/* ===== Shipping fields (อยู่ในหน้าแม่ หรือแยกเพิ่ม) ===== */}
        <div className="mb-4 space-y-2">
          <label className="block font-medium mt-4">วิธีจัดส่ง</label>
          <select
            name="shippingMethod"
            aria-label="วิธีจัดส่ง"
            required
            className="border p-2 rounded w-full"
            value={shippingMethod}
            onChange={(e) => {
              const value = e.target.value;
              setShippingMethod(value);
              if (value !== 'custom') setCustomShippingMethod('');
            }}
          >
            <option value="">-- เลือก --</option>
            <option value="Messenger">Messenger</option>
            <option value="รับเอง">รับเอง</option>
            <option value="Logistic frozen truck">Frozen truck</option>
            <option value="custom">กรอกเอง</option>
          </select>
          {shippingMethod === 'custom' && (
            <input
              type="text"
              name="customShippingMethod"
              aria-label="วิธีจัดส่งเพิ่มเติม"
              required
              className="border p-2 rounded w-full mt-2"
              value={customShippingMethod}
              onChange={(e) => setCustomShippingMethod(e.target.value)}
              placeholder="กรอกวิธีจัดส่งเอง"
            />
          )}
          <label className="block font-medium mt-4">ค่าขนส่ง (บาท)</label>
          <input
            type="number"
            name="shippingCost"
            aria-label="ค่าขนส่ง (บาท)"
            className="border p-2 rounded w-full"
            value={shippingCost}
            onChange={(e) => {
              setShippingCost(parseFloat(e.target.value) || 0);
            }}
          />
        </div>

        {/* ===== ตาราง meat log ===== */}
        <MeatLogTable items={normalizedItems} shippingItem={shippingItem} />

        {/* ===== summary ===== */}
        <ReceiptSummary totalProduct={totalProduct} shippingItem={shippingItem} totalAll={totalAll} />

        <div className="text-right">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading
              ? isEditMode ? 'กำลังอัปเดต...' : 'กำลังสร้าง...'
              : isEditMode ? 'อัปเดตใบเสร็จ' : 'สร้างใบเสร็จ'}
          </button>
        </div>
      </div>
    </div>
  );
}
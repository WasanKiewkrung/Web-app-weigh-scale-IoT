import React from 'react';

/**
 * แสดงผลรวมราคาและปุ่มไปหน้ากรอกข้อมูลลูกค้า
 * @param {Array} items - รายการ meat log (หลัง group)
 * @param {Function} onNext - callback เมื่อกดปุ่ม "กรอกข้อมูลลูกค้า"
 */
export default function ReceiptSummary({ items, onNext }) {
  // คำนวณราคารวม
  const total = items.reduce((sum, item) => sum + (item.total || 0), 0);

  return (
    <>
      <div className="text-right font-bold mb-6">
        รวมทั้งสิ้น: {total.toLocaleString()} บาท
      </div>
      <div className="flex justify-end mt-6">
        <button
          onClick={onNext}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          กรอกข้อมูลลูกค้า
        </button>
      </div>
    </>
  );
}

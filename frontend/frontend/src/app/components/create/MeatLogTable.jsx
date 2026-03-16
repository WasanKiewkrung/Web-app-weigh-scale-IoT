import React from 'react';

/**
 * แสดงตารางรายการ meat log สำหรับการสร้างใบเสร็จ
 * @param {Array} items - รายการ meat log ที่ผ่านการ group แล้ว
 */
export default function MeatLogTable({ items }) {
  return (
    <table className="w-full border border-gray-300 text-left mb-4">
      <thead className="bg-gray-200">
        <tr>
          <th className="p-2 border">#</th>
          <th className="p-2 border">เวลา</th>
          <th className="p-2 border">ชื่อชนิดเนื้อ</th>
          <th className="p-2 border">จำนวน</th>
          <th className="p-2 border">ราคาต่อหน่วย (฿)</th>
          <th className="p-2 border">ยอดรวม (฿)</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item, index) => (
          <tr key={index}>
            <td className="p-2 border">{index + 1}</td>
            <td className="p-2 border">{item.time || '-'}</td>
            <td className="p-2 border">{item.label}</td>
            <td className="p-2 border">
              {item.unit === 'Pc'
                ? item.qty
                : typeof item.weight === 'number'
                  ? item.weight.toFixed(3)
                  : '-'}
            </td>
            <td className="p-2 border">
              {typeof item.pricePerKg === 'number'
                ? item.pricePerKg.toFixed(2)
                : '-'}
            </td>
            <td className="p-2 border">
              {typeof item.total === 'number'
                ? item.total.toFixed(2)
                : '-'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

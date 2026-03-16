import React from 'react';

/**
 * ตารางแสดง meat log (รายการเนื้อ + ค่าขนส่งถ้ามี)
 * @param {Object[]} items - รายการ meat log (normalize แล้ว)
 * @param {Object|null} shippingItem - รายการค่าขนส่ง (ถ้ามี)
 */
export default function MeatLogTable({ items = [], shippingItem = null }) {
  return (
    <table className="w-full border border-gray-300 text-left mb-4">
      <thead className="bg-gray-200">
        <tr>
          <th className="p-2 border">#</th>
          <th className="p-2 border">รายการเนื้อ</th>
          <th className="p-2 border">จำนวน</th>
          <th className="p-2 border">ราคาต่อหน่วย</th>
          <th className="p-2 border">รวม</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item, idx) => (
          <tr key={idx}>
            <td className="p-2 border">{idx + 1}</td>
            <td className="p-2 border">{item.name}</td>
            <td className="p-2 border">{item.qty}</td>
            <td className="p-2 border">{Number(item.price).toFixed(2)}</td>
            <td className="p-2 border">{Number(item.total).toFixed(2)}</td>
          </tr>
        ))}
        {shippingItem && (
          <tr>
            <td className="p-2 border">{items.length + 1}</td>
            <td className="p-2 border">{shippingItem.label}</td>
            <td className="p-2 border">{shippingItem.weight}</td>
            <td className="p-2 border">{Number(shippingItem.pricePerKg).toFixed(2)}</td>
            <td className="p-2 border">{Number(shippingItem.total).toFixed(2)}</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

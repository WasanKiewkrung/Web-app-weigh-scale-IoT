import React from 'react';

/**
 * สรุปยอดสินค้า, ค่าขนส่ง, และรวมทั้งหมด
 * @param {number} totalProduct - ยอดรวมสินค้า (บาท)
 * @param {object|null} shippingItem - รายการค่าขนส่ง (มี field .total), หรือ null
 * @param {number} totalAll - ยอดรวมทั้งหมด (สินค้า+ขนส่ง)
 */
export default function ReceiptSummary({ totalProduct, shippingItem, totalAll }) {
  return (
    <div className="text-right font-bold mb-4">
      รวมค่าสินค้า: {Number(totalProduct).toLocaleString()} บาท
      <br />
      ค่าขนส่ง: {shippingItem ? Number(shippingItem.total).toLocaleString() : '0'} บาท
      <br />
      รวมทั้งหมด: {Number(totalAll).toLocaleString()} บาท
    </div>
  );
}

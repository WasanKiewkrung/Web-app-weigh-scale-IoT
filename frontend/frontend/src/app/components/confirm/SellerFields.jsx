import React from 'react';

/**
 * ฟิลด์รับชื่อผู้ขายและรายละเอียดผู้ขาย (พร้อม custom field)
 * @param {string} sellerName
 * @param {function} setSellerName
 * @param {string} customSellerName
 * @param {function} setCustomSellerName
 * @param {string} sellerDetail
 * @param {function} setSellerDetail
 * @param {string} customSellerDetail
 * @param {function} setCustomSellerDetail
 * @param {string[]} predefinedSellerNames
 * @param {string[]} predefinedSellerDetails
 */
export default function SellerFields({
  sellerName,
  setSellerName,
  customSellerName,
  setCustomSellerName,
  sellerDetail,
  setSellerDetail,
  customSellerDetail,
  setCustomSellerDetail,
  predefinedSellerNames = [
    { value: '', label: '-- เลือก --' },
    { value: 'พชร เลิศศิลป์เจริญ', label: 'พชร เลิศศิลป์เจริญ' },
    { value: 'custom', label: 'กรอกเอง' }
  ],
  predefinedSellerDetails = [
    { value: '', label: '-- เลือก --' },
    { value: 'Backyard Bangkok\n 27/154 The plant ถนนกาญจนาภิเษก แขวงคันนายาว เขตคันนายาว กทม. 10230', label: 'Backyard Bangkok' },
    { value: 'custom', label: 'กรอกเอง' }
  ],
}) {
  return (
    <div className="mb-4 space-y-2">
      {/* Seller Name */}
      <label className="block font-medium">ชื่อผู้ขาย</label>
      <select
        name="sellerName"
        aria-label="ชื่อผู้ขาย"
        required
        className="border p-2 rounded w-full"
        value={sellerName}
        onChange={e => {
          setSellerName(e.target.value);
          if (e.target.value !== 'custom') setCustomSellerName('');
        }}
      >
        {predefinedSellerNames.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {sellerName === 'custom' && (
        <input
          type="text"
          name="customSellerName"
          aria-label="ชื่อผู้ขายเพิ่มเติม"
          required
          className="border p-2 rounded w-full mt-2"
          value={customSellerName}
          onChange={e => setCustomSellerName(e.target.value)}
          placeholder="กรอกชื่อผู้ขายเอง"
        />
      )}

      {/* Seller Detail */}
      <label className="block font-medium">รายละเอียดผู้ขาย</label>
      <select
        name="sellerDetail"
        aria-label="รายละเอียดผู้ขาย"
        required
        className="border p-2 rounded w-full"
        value={sellerDetail}
        onChange={e => {
          setSellerDetail(e.target.value);
          if (e.target.value !== 'custom') setCustomSellerDetail('');
        }}
      >
        {predefinedSellerDetails.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {sellerDetail === 'custom' && (
        <textarea
          name="customSellerDetail"
          aria-label="รายละเอียดผู้ขายเพิ่มเติม"
          rows={2}
          required
          className="border p-2 rounded w-full mt-2"
          value={customSellerDetail}
          onChange={e => setCustomSellerDetail(e.target.value)}
        />
      )}
    </div>
  );
}

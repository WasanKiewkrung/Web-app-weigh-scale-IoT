import React from 'react';
import AsyncCreatableSelect from 'react-select/async-creatable';


/**
 * ฟิลด์รับชื่อลูกค้าและที่อยู่ลูกค้า
 * @param {string} customerName
 * @param {function} setCustomerName
 * @param {string} customerAddress
 * @param {function} setCustomerAddress
 */
export default function CustomerFields({
  customerName,
  setCustomerName,
  customerAddress,
  setCustomerAddress,
}) {
  // API load ชื่อลูกค้า
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ;
  const loadOptions = async (inputValue, callback) => {
    try {
      const res = await fetch(
        `${apiBase}/api/receipt/customer-names?keyword=${encodeURIComponent(inputValue)}`
      );
      if (!res.ok) throw new Error('Fetch failed');
      const names = await res.json();
      callback(names.map(name => ({ value: name, label: name })));
    } catch (err) {
      callback([]);
    }
  };

  return (
    <div className="mb-4 space-y-2">
      {/* Customer Name */}
      <label className="block font-medium mt-4">ชื่อลูกค้า</label>
      <AsyncCreatableSelect
        cacheOptions
        defaultOptions
        loadOptions={loadOptions}
        value={customerName ? { value: customerName, label: customerName } : null}
        onChange={opt => setCustomerName(opt?.value || '')}
        placeholder="เลือกหรือพิมพ์ชื่อลูกค้า"
        isClearable
        className="w-full"
        styles={{
          container: base => ({ ...base, width: '100%' }),
          control: base => ({
            ...base,
            backgroundColor: 'white',
            borderColor: '#000',
            minHeight: '40px',
            borderRadius: '0.375rem',
          }),
          menu: base => ({ ...base, zIndex: 20 }),
          option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected
              ? '#22c55e'
              : state.isFocused
                ? '#bbf7d0'
                : 'white',
            color: state.isSelected ? 'white' : '#374151',
          }),
          singleValue: base => ({
            ...base,
            color: '#374151',
          }),
          input: base => ({
            ...base,
            color: '#374151',
          }),
        }}
      />

      {/* Customer Address */}
      <label className="block font-medium mt-4">ที่อยู่ลูกค้า</label>
      <textarea
        name="customerAddress"
        aria-label="ที่อยู่ลูกค้า"
        rows={2}
        className="border p-2 rounded w-full"
        value={customerAddress}
        onChange={e => setCustomerAddress(e.target.value)}
      />
    </div>
  );
}

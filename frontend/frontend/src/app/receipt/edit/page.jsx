'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import ReceiptCard from '../../components/edit/ReceiptCard';
import AsyncSelect from 'react-select/async';


function ReceiptEditPage() {
  const router = useRouter();
  const [customerName, setCustomerName] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/Login');
    } else {
      setAuthorized(true);
    }
  }, [router]);

  if (!authorized) return null;

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/receipt/by-customer/${customerName}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error('ไม่พบใบเสร็จสำหรับชื่อลูกค้านี้');

      const data = await res.json();
      setSearchResults(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'เกิดข้อผิดพลาด');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
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
    <div className="min-h-screen bg-gray-50">
      <Navbar title="CheQbeef+ Display" onTitleClick={() => router.push('/Report')} />

      <div className="flex items-center justify-center mt-12">
        <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4">ค้นหาใบเสร็จเพื่อแก้ไข</h2>
          <AsyncSelect
            cacheOptions
            defaultOptions
            loadOptions={loadOptions}
            value={customerName ? { value: customerName, label: customerName } : null}
            onChange={opt => setCustomerName(opt?.value || '')}
            placeholder="เลือกหรือลองพิมพ์ชื่อลูกค้า"
            isClearable
            className="mb-4"
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
          <button
            onClick={handleSearch}
            disabled={loading}
            className="w-full bg-red-700 hover:bg-red-600 text-white py-2 px-4 rounded"
          >
            {loading ? 'กำลังค้นหา...' : 'ค้นหาใบเสร็จ'}
          </button>
          {error && <p className="text-red-600 mt-4">{error}</p>}
        </div>
      </div>
      {Array.isArray(searchResults) && searchResults.length > 0 && (
        <div className="mt-6">
          {searchResults.map((receipt, idx) => (
            <ReceiptCard
              key={receipt._id || idx}
              receipt={receipt}
              onDelete={() => { }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ReceiptEditPage;

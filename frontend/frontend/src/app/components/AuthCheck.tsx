import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AuthCheckProps {
  setAuthorized: (authorized: boolean) => void;
}

const AuthCheck: React.FC<AuthCheckProps> = ({ setAuthorized }) => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthorized(true); // ถ้ามี token ให้ set authorized เป็น true
    } else {
      router.replace('/Login'); // ถ้าไม่มี token จะพาไปหน้า Login
    }
  }, [router, setAuthorized]);

  return null; // ไม่ต้อง render อะไร แค่ตรวจสอบการล็อกอิน
};

export default AuthCheck;

'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "./components/Navbar";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.replace("/Report");   // ถ้ามี token → ไป Report
    } else {
      router.replace("/Login");    // ถ้าไม่มี token → ไป Login
    }
  }, [router]);

  return (
    <main>
      <Navbar />
      <div className="p-6 text-gray-500">กำลังตรวจสอบสิทธิ์…</div>
    </main>
  );
}

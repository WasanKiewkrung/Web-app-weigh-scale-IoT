'use client';

import React, { useState } from 'react';
import Container from "../components/Container";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.access_token);
      router.push("/Report");
    } catch (err) {
      console.error("Server error:", err);
      setError("Server error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 flex justify-center items-center">
        <div className='w-[400px] shadow-xl p-10 rounded-xl bg-white'>
          <h3 className='text-3xl'>Login Page</h3>
          <hr className='my-3' />

          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className='w-full bg-gray-200 border py-2 px-3 rounded text-lg my-2'
              placeholder='Enter your username'
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full bg-gray-200 border py-2 px-3 rounded text-lg my-2'
              placeholder='Enter your password'
            />
            <button
              type='submit'
              className='bg-green-500 text-white border py-2 px-3 rounded text-lg my-2 w-full'
            >
              Sign In
            </button>
          </form>

          <hr className='my-3' />
          <p>Go to <Link href="/" className='text-blue-500 hover:underline'>Home</Link></p>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default LoginPage;

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import FileUpload from '../../components/FileUpload';
import VersionInput from '../../components/VersionInput';
import SubmitButton from '../../components/SubmitButton';
import Message from '../../components/Message';
import styles from './styles/uploadStyles';
import { useLatestVersion } from './hooks/useLatestVersion';
import { useVersionValidation } from './hooks/useVersionValidation';

const ConfigPage = () => {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [version, setVersion] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const latestVersion = useLatestVersion();
  const { isVersionComplete, showWarning } = useVersionValidation(version);

  const isFormValid = file && isVersionComplete && version !== latestVersion;

  // ตรวจสอบการล็อกอิน
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/Login');
    } else {
      setAuthorized(true);
    }
  }, [router]);

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid) return;

    const formData = new FormData();
    formData.append('firmware', file!);
    formData.append('version', version.trim());

    try {
      const res = await fetch('/config/upload', {
        method: 'POST',
        body: formData,
      });

      const text = await res.text();
      setMessage(text);
      setIsError(false);
    } catch (err) {
      console.error(err);
      setMessage('❌ Upload failed');
      setIsError(true);
    }
  };

  if (!authorized) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar title="CheQbeef+ Display" onTitleClick={() => router.push('/Report')} />
      <div className="container mx-auto mt-6">
        <h1 className="text-2xl font-bold">Configuration Page</h1>

        <main style={styles.container}>
          <h2 style={styles.title}>Upload Firmware (.bin)</h2>
          <p style={styles.latestVersion}>
            📍 <strong>Latest Version :</strong> {latestVersion ?? 'Loading...'}
          </p>

          <form onSubmit={handleUpload} style={styles.form}>
            <FileUpload file={file} onFileChange={setFile} />

            <VersionInput
              version={version}
              onChange={setVersion}
              latestVersion={latestVersion}
            />

            {showWarning && (
              <p style={{ color: 'red', margin: 0, fontSize: '0.85rem' }}>
                ⚠️ Version format invalid, use e.g. 1.0.0
              </p>
            )}

            <SubmitButton isFormValid={!!isFormValid} />
          </form>

          <Message message={message} isError={isError} />
        </main>
      </div>
    </div>
  );
};

export default ConfigPage;
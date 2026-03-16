import React from 'react'

interface FileUploadProps {
  file: File | null
  onFileChange: (file: File | null) => void
}

export default function FileUpload({ file, onFileChange }: FileUploadProps) {
  return (
    <>
      <label
        htmlFor="file-upload"
        style={{
          display: 'inline-block',
          padding: '0.6rem 1.2rem',
          borderRadius: 6,
          fontWeight: '600',
          textAlign: 'center',
          userSelect: 'none',
          transition: 'background-color 0.3s ease',
          color: 'white',
          backgroundColor: file ? '#0070f3' : '#aaa',
          cursor: file ? 'pointer' : 'not-allowed',
        }}
      >
        {file ? `Selected: ${file.name}` : 'Choose .bin File'}
      </label>
      <input
        id="file-upload"
        type="file"
        accept=".bin"
        style={{ display: 'none' }}
        onChange={(e) => onFileChange(e.target.files?.[0] || null)}
        required
      />
    </>
  )
}

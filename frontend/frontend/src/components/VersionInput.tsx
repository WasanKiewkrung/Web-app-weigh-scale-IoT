import React from 'react'

interface VersionInputProps {
  version: string
  onChange: (value: string) => void
  latestVersion: string | null
}

export default function VersionInput({ version, onChange, latestVersion }: VersionInputProps) {
  const isDuplicate = version.trim() === latestVersion

  return (
    <>
      <input
        type="text"
        placeholder="Enter new version e.g. 1.0.0"
        value={version}
        onChange={(e) => onChange(e.target.value)}
        style={{
          padding: '0.5rem',
          fontSize: '1rem',
          borderRadius: 4,
          border: '1px solid',
          borderColor: isDuplicate ? 'red' : '#ccc',
          outline: 'none',
        }}
      />
      {isDuplicate && (
        <p style={{ color: 'red', margin: 0, fontSize: '0.85rem' }}>
          ⚠️ Version already exists
        </p>
      )}
    </>
  )
}
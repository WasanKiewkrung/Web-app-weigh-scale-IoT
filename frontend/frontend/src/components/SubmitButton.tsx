import React from 'react'

interface SubmitButtonProps {
  isFormValid: boolean
}

export default function SubmitButton({ isFormValid }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={!isFormValid}
      style={{
        padding: '0.6rem',
        fontSize: '1rem',
        borderRadius: 4,
        border: 'none',
        color: '#fff',
        backgroundColor: isFormValid ? '#0070f3' : '#aaa',
        cursor: isFormValid ? 'pointer' : 'not-allowed',
        transition: 'background-color 0.2s',
      }}
    >
      Upload
    </button>
  )
}
import React from 'react'

interface MessageProps {
  message: string
  isError: boolean
}

export default function Message({ message, isError }: MessageProps) {
  if (!message) return null

  return (
    <p
      style={{
        marginTop: '1rem',
        fontWeight: 600,
        textAlign: 'center',
        color: isError ? 'red' : 'green',
      }}
    >
      {message}
    </p>
  )
}
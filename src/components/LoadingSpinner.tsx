import React from 'react'

interface LoadingSpinnerProps {
  message?: string
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = '加载中...' 
}) => {
  return (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <div className="loading-message">{message}</div>
    </div>
  )
}
'use client'

import useOnlineStatus from '@/utils/use-online-status'

function OfflineIndicator() {
  const containerStyle = {
    display: 'flex',
    flexFlow: 'row nowrap',
    gap: '0.5em',
    alignItems: 'center',
    color: 'var(--color-accent-5)',
  }
  const dotStyle = {
    width: '0.6em',
    height: '0.6em',
    borderRadius: '50%',
    backgroundColor: 'var(--color-mt-red)',
    boxShadow: '0 0 0.3em var(--color-mt-red)',
  }
  const bStyle = {
    color: 'var(--color-mt-red)',
  }

  return (
    <div style={containerStyle}>
      <div style={dotStyle} />
      <b style={bStyle}>You are offline</b> Some functionality will be suspended
    </div>
  )
}

function Footer() {
  const isOnline = useOnlineStatus()

  return (
    <footer className="page-footer">
      {!isOnline ? <OfflineIndicator /> : ''}
    </footer>
  )
}

export default Footer

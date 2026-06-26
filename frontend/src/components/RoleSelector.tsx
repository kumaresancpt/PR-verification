import { CSSProperties } from 'react'

export type Role = 'Admin' | 'Receptionist' | 'SecurityGuard'

interface RoleSelectorProps {
  value: Role
  onChange: (role: Role) => void
}

const roles: { id: Role; label: string }[] = [
  { id: 'Admin', label: 'Admin' },
  { id: 'Receptionist', label: 'Receptionist' },
  { id: 'SecurityGuard', label: 'Security Guard' }
]

export default function RoleSelector({ value, onChange }: RoleSelectorProps) {
  const containerStyle: CSSProperties = {
    width: '400px',
    height: '45px',
    backgroundColor: '#F3F3F3',
    borderRadius: '48px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '3px 4px'
  }

  const activeTabStyle: CSSProperties = {
    backgroundColor: 'var(--color-primary)',
    borderRadius: '25px',
    padding: '10px 18px',
    fontFamily: 'Inter, sans-serif',
    fontWeight: 600,
    fontSize: '16px',
    lineHeight: 'normal',
    color: '#FFFFFF',
    cursor: 'pointer',
    border: 'none',
    whiteSpace: 'nowrap'
  }

  const inactiveTabStyle: CSSProperties = {
    backgroundColor: 'transparent',
    borderRadius: '25px',
    padding: '10px 18px',
    fontFamily: 'Inter, sans-serif',
    fontWeight: 400,
    fontSize: '16px',
    lineHeight: 'normal',
    color: '#3C3C3C',
    cursor: 'pointer',
    border: 'none',
    whiteSpace: 'nowrap'
  }

  return (
    <div style={containerStyle} role="tablist" aria-label="Select role">
      {roles.map((role) => (
        <button
          key={role.id}
          role="tab"
          aria-selected={value === role.id}
          style={value === role.id ? activeTabStyle : inactiveTabStyle}
          onClick={() => onChange(role.id)}
          type="button"
        >
          {role.label}
        </button>
      ))}
    </div>
  )
}

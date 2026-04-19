'use client'

import { SUB_TABS, type IbadahView } from './types'

interface IbadahHeaderProps {
  activeView: IbadahView
  onViewChange: (view: IbadahView) => void
}

export function IbadahHeader({ activeView, onViewChange }: IbadahHeaderProps) {
  return (
    <>
      {/* Header */}
      <div className="px-4 pt-2 pb-2">
        <h2 className="text-lg font-bold" style={{ color: '#ffffff' }}>Ibadah</h2>
        <p className="text-xs" style={{ color: 'rgba(204,204,204,0.6)' }}>Solat, Kiblat, Tasbih & Lain-lain</p>
      </div>

      {/* Sub-tab navigation - scrollable */}
      <div className="px-4 mb-3">
        <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {SUB_TABS.map(tab => (
            <button
              key={tab.key}
              className="flex-shrink-0 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-medium transition-all"
              style={{
                background: activeView === tab.key ? 'rgba(74,74,166,0.2)' : 'rgba(42,42,106,0.3)',
                color: activeView === tab.key ? '#4a4aa6' : 'rgba(204,204,204,0.5)',
                border: `1px solid ${activeView === tab.key ? 'rgba(74,74,166,0.4)' : 'rgba(74,74,166,0.1)'}`,
              }}
              onClick={() => onViewChange(tab.key)}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>
    </>
  )
}

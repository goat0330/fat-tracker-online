import { useState } from 'react'
import WeightPage from './pages/WeightPage'
import WorkoutPage from './pages/WorkoutPage'
import HomePage from './pages/HomePage'

const TABS = [
  { id: 'home', label: '首页', icon: '🏠' },
  { id: 'weight', label: '体重', icon: '⚖️' },
  { id: 'workout', label: '训练', icon: '💪' },
]

function App() {
  const [currentPage, setCurrentPage] = useState('home')

  return (
    <div className="min-h-screen bg-gray-50 max-w-lg mx-auto flex flex-col overflow-hidden">
      {/* 内容区域 */}
      <main className="flex-1 overflow-y-auto">
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'weight' && <WeightPage />}
        {currentPage === 'workout' && <WorkoutPage />}
      </main>

      {/* 底部导航 - iOS 安全区适配 */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-gray-200 max-w-lg mx-auto" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="flex justify-around py-1.5">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCurrentPage(tab.id)}
              className={`flex flex-col items-center px-6 py-1.5 rounded-xl transition-colors ${
                currentPage === tab.id
                  ? 'text-emerald-600'
                  : 'text-gray-400'
              }`}
            >
              <span className="text-xl leading-none">{tab.icon}</span>
              <span className="text-[11px] mt-0.5 font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}

export default App

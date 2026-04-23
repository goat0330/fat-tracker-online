import { useState } from 'react'
import StoreTest from './pages/StoreTest'
import WeightPage from './pages/WeightPage'
import WorkoutPage from './pages/WorkoutPage'

function HomePage() {
  return (
    <div className="p-4 text-center text-gray-500">
      <p>情侣减脂打卡助手</p>
      <p className="text-sm mt-2">数据加载中...</p>
    </div>
  )
}

function App() {
  const [currentPage, setCurrentPage] = useState('home')

  return (
    <div className="min-h-screen bg-gray-50 max-w-lg mx-auto flex flex-col">
      {/* 内容区域 */}
      <main className="flex-1">
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'weight' && <WeightPage />}
        {currentPage === 'workout' && <WorkoutPage />}
        {currentPage === 'test' && <StoreTest />}
      </main>

      {/* 底部导航 */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 max-w-lg mx-auto">
        <div className="flex justify-around py-2">
          <button
            onClick={() => setCurrentPage('home')}
            className={`flex flex-col items-center px-4 py-1 text-xs ${
              currentPage === 'home' ? 'text-emerald-600' : 'text-gray-400'
            }`}
          >
            <span className="text-lg">🏠</span>
            首页
          </button>
          <button
            onClick={() => setCurrentPage('weight')}
            className={`flex flex-col items-center px-4 py-1 text-xs ${
              currentPage === 'weight' ? 'text-emerald-600' : 'text-gray-400'
            }`}
          >
            <span className="text-lg">⚖️</span>
            体重
          </button>
          <button
            onClick={() => setCurrentPage('workout')}
            className={`flex flex-col items-center px-4 py-1 text-xs ${
              currentPage === 'workout' ? 'text-emerald-600' : 'text-gray-400'
            }`}
          >
            <span className="text-lg">💪</span>
            训练
          </button>
          <button
            onClick={() => setCurrentPage('test')}
            className={`flex flex-col items-center px-4 py-1 text-xs ${
              currentPage === 'test' ? 'text-emerald-600' : 'text-gray-400'
            }`}
          >
            <span className="text-lg">🔧</span>
            测试
          </button>
        </div>
      </nav>
    </div>
  )
}

export default App

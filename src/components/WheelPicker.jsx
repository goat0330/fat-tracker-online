import { useRef, useState, useEffect } from 'react'
import { WORKOUT_PARTS } from '../store'

// 每个选项的高度（px）
const ITEM_HEIGHT = 44
const VISIBLE_COUNT = 5 // 可视区域内显示的选项数
const PAD_ITEMS = Math.floor(VISIBLE_COUNT / 2) // 上下 padding 的虚拟项数

/**
 * 上下滚轮滑动选择器 - 用于选择 5 个固定训练部位
 */
export default function WheelPicker({ value, onChange }) {
  const containerRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(WORKOUT_PARTS.indexOf(value) ?? 0)
  const [offset, setOffset] = useState(0)

  // 初始化时设置到当前值
  useEffect(() => {
    const idx = WORKOUT_PARTS.indexOf(value)
    if (idx >= 0 && idx !== activeIndex) {
      setActiveIndex(idx)
      setOffset(-idx * ITEM_HEIGHT)
    }
  }, []) // eslint-disable-line

  // 获取带 padding 的扩展列表
  const paddedParts = useRef(
    Array.from({ length: PAD_ITEMS }, () => '').concat(WORKOUT_PARTS, Array.from({ length: PAD_ITEMS }, () => ''))
  ).current

  const startIndex = Math.max(0, activeIndex - PAD_ITEMS)

  // 处理触摸/鼠标滑动
  const startYRef = useRef(0)
  const startOffsetRef = useRef(0)

  const handleStart = (clientY) => {
    startYRef.current = clientY
    startOffsetRef.current = offset
  }

  const handleMove = (clientY) => {
    const delta = clientY - startYRef.current
    const newOffset = startOffsetRef.current + delta
    setOffset(newOffset)
  }

  const handleEnd = () => {
    // 吸附到最近的选项
    const totalOffset = -offset
    let newIndex = Math.round(totalOffset / ITEM_HEIGHT)
    newIndex = Math.max(0, Math.min(WORKOUT_PARTS.length - 1, newIndex))
    setActiveIndex(newIndex)
    setOffset(-newIndex * ITEM_HEIGHT)
    onChange?.(WORKOUT_PARTS[newIndex])
  }

  // Touch events
  const onTouchStart = (e) => handleStart(e.touches[0].clientY)
  const onTouchMove = (e) => { e.preventDefault(); handleMove(e.touches[0].clientY) }
  const onTouchEnd = () => handleEnd()

  // Mouse events
  const onMouseDown = (e) => {
    handleStart(e.clientY)
    const onMove = (ev) => handleMove(ev.clientY)
    const onUp = () => {
      handleEnd()
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  // 计算当前可视区域内的选项
  const visibleStart = Math.max(0, Math.round(offset / ITEM_HEIGHT) * -1 - PAD_ITEMS)
  const visibleEnd = Math.min(WORKOUT_PARTS.length - 1, visibleStart + VISIBLE_COUNT + 1)

  const items = []
  for (let i = visibleStart; i <= visibleEnd; i++) {
    const itemY = -i * ITEM_HEIGHT - offset
    const distFromCenter = Math.abs(itemY / ITEM_HEIGHT)
    const isActive = distFromCenter < 0.5
    const opacity = Math.max(0.3, 1 - distFromCenter * 0.4)
    const scale = isActive ? 1.15 : Math.max(0.85, 1 - distFromCenter * 0.15)

    items.push(
      <div
        key={i}
        className="flex items-center justify-center font-medium transition-all duration-100"
        style={{
          height: `${ITEM_HEIGHT}px`,
          opacity,
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          fontSize: isActive ? '18px' : '15px',
          color: isActive ? '#1f2937' : '#9ca3af',
        }}
      >
        {WORKOUT_PARTS[i]}
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="relative mx-auto overflow-hidden"
      style={{ height: `${ITEM_HEIGHT * VISIBLE_COUNT}px`, width: '140px' }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown}
    >
      {/* 上遮罩 */}
      <div className="absolute top-0 left-0 right-0 z-10 pointer-events-none" style={{ height: `${ITEM_HEIGHT * PAD_ITEMS}px`, background: 'linear-gradient(to bottom, rgba(249,250,251,1) 0%, rgba(249,250,251,0) 100%)' }} />
      {/* 下遮罩 */}
      <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none" style={{ height: `${ITEM_HEIGHT * PAD_ITEMS}px`, background: 'linear-gradient(to top, rgba(249,250,251,1) 0%, rgba(249,250,251,0) 100%)' }} />
      {/* 选中高亮条 */}
      <div
        className="absolute left-0 right-0 z-0 border-y-2 border-emerald-400 bg-emerald-50"
        style={{ top: `${ITEM_HEIGHT * PAD_ITEMS}px`, height: `${ITEM_HEIGHT}px` }}
      />
      {/* 滚动列表 */}
      <div className="relative z-0">{items}</div>
    </div>
  )
}

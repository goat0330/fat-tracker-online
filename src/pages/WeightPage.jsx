import { useState, useEffect, useCallback } from 'react'
import { getAllWeightsForAllUsers } from '../store'
import WeightInput from '../components/WeightInput'
import WeightChart from '../components/WeightChart'
import WeightHistory from '../components/WeightHistory'

/**
 * 体重记录页面
 */
export default function WeightPage() {
  const [weights, setWeights] = useState([])
  const [refreshKey, setRefreshKey] = useState(0)

  const loadWeights = useCallback(async () => {
    const data = await getAllWeightsForAllUsers()
    setWeights(data)
  }, [])

  useEffect(() => {
    loadWeights()
  }, [loadWeights, refreshKey])

  return (
    <div className="p-4 pb-24 space-y-4">
      <h1 className="text-lg font-bold text-gray-800">⚖️ 体重记录</h1>

      <WeightInput onSaved={() => setRefreshKey((k) => k + 1)} />
      <WeightChart allWeights={weights} />
      <WeightHistory allWeights={weights} />
    </div>
  )
}

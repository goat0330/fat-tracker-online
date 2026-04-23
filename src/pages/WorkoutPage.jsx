import { useState, useEffect, useCallback } from 'react'
import { getAllWorkoutsForAllUsers } from '../store'
import WorkoutInput from '../components/WorkoutInput'
import WorkoutHistory from '../components/WorkoutHistory'

/**
 * 训练打卡页面
 */
export default function WorkoutPage() {
  const [workouts, setWorkouts] = useState([])
  const [refreshKey, setRefreshKey] = useState(0)

  const loadWorkouts = useCallback(async () => {
    const data = await getAllWorkoutsForAllUsers()
    setWorkouts(data)
  }, [])

  useEffect(() => {
    loadWorkouts()
  }, [loadWorkouts, refreshKey])

  return (
    <div className="p-4 pb-24 space-y-4">
      <h1 className="text-lg font-bold text-gray-800">💪 训练打卡</h1>

      <WorkoutInput onSaved={() => setRefreshKey((k) => k + 1)} />
      <WorkoutHistory allWorkouts={workouts} />
    </div>
  )
}

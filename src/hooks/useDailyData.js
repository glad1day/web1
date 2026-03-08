import { useLocalStorage } from './useLocalStorage'
import { getToday } from '../utils/dateUtils'

export function useDailyData(feature, initialValue) {
  const today = getToday()
  return useLocalStorage(`dailyboost_${feature}_${today}`, initialValue)
}

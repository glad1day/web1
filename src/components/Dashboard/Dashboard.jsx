import { useLocalStorage } from '../../hooks/useLocalStorage'
import { useDailyData } from '../../hooks/useDailyData'
import { getToday, getGreeting, formatDate, getRecentDates } from '../../utils/dateUtils'
import styles from './Dashboard.module.css'

function getScoreForDate(date) {
  let total = 0
  let filled = 0

  try {
    const goals = JSON.parse(localStorage.getItem(`dailyboost_goals_${date}`))
    if (goals?.goals) {
      const set = goals.goals.filter(g => g.wish?.trim())
      const done = goals.goals.filter(g => g.completed)
      if (set.length > 0) {
        total += set.length
        filled += done.length
      }
    }

    const todos = JSON.parse(localStorage.getItem(`dailyboost_todos_${date}`))
    if (todos?.items?.length > 0) {
      total += todos.items.length
      filled += todos.items.filter(i => i.completed).length
    }

    const habits = JSON.parse(localStorage.getItem('dailyboost_habits'))
    const log = JSON.parse(localStorage.getItem('dailyboost_habit_log'))
    if (habits?.length > 0) {
      total += habits.length
      filled += (log?.[date] || []).length
    }
  } catch {
    // ignore
  }

  return total > 0 ? Math.round((filled / total) * 100) : 0
}

export default function Dashboard({ onTabChange }) {
  const today = getToday()
  const greeting = getGreeting()

  const [goalsData] = useDailyData('goals', { goals: [] })
  const [todosData] = useDailyData('todos', { items: [] })
  const [journalData] = useDailyData('journal', { savedAt: null })
  const [habits] = useLocalStorage('dailyboost_habits', [])
  const [habitLog] = useLocalStorage('dailyboost_habit_log', {})

  const goals = goalsData.goals || []
  const todos = todosData.items || []
  const todayHabits = habitLog[today] || []

  const goalsSet = goals.filter(g => g.wish?.trim()).length
  const goalsDone = goals.filter(g => g.completed).length
  const todosDone = todos.filter(i => i.completed).length
  const habitsChecked = habits.filter(h => todayHabits.includes(h.id)).length

  const energyScore = getScoreForDate(today)
  const recentDates = getRecentDates(7)
  const weeklyScores = recentDates.map(d => ({ date: d, score: getScoreForDate(d) }))

  // Calculate consecutive days
  let consecutiveDays = 0
  for (let i = 0; i < 30; i++) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = d.toISOString().split('T')[0]
    if (getScoreForDate(key) > 0) {
      consecutiveDays++
    } else {
      break
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.greetingCard}>
        <div className={styles.greetingTop}>
          <span className={styles.greetingEmoji}>{greeting.emoji}</span>
          <span className={styles.date}>{formatDate(today)}</span>
        </div>
        <h1 className={styles.greetingText}>{greeting.text}</h1>
        {consecutiveDays > 1 && (
          <div className={styles.streak}>🔥 {consecutiveDays}일 연속 활동 중!</div>
        )}
      </div>

      <div className={styles.energySection}>
        <h3>오늘의 에너지</h3>
        <div className={styles.energyMeter}>
          <svg viewBox="0 0 120 120" className={styles.energySvg}>
            <circle
              cx="60" cy="60" r="52"
              fill="none"
              stroke="var(--color-border)"
              strokeWidth="10"
            />
            <circle
              cx="60" cy="60" r="52"
              fill="none"
              stroke={energyScore >= 70 ? 'var(--color-success)' : energyScore >= 40 ? 'var(--color-primary)' : 'var(--color-warning)'}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={`${(energyScore / 100) * 327} 327`}
              transform="rotate(-90 60 60)"
              style={{ transition: 'stroke-dasharray 0.6s ease' }}
            />
            <text x="60" y="55" textAnchor="middle" fontSize="28" fontWeight="700" fill="var(--color-text)">
              {energyScore}
            </text>
            <text x="60" y="75" textAnchor="middle" fontSize="12" fill="var(--color-text-light)">
              점
            </text>
          </svg>
        </div>
      </div>

      <div className={styles.weeklySection}>
        <h3>주간 추이</h3>
        <div className={styles.weeklyChart}>
          {weeklyScores.map(({ date, score }) => (
            <div key={date} className={styles.barWrapper}>
              <div className={styles.barContainer}>
                <div
                  className={styles.bar}
                  style={{
                    height: `${Math.max(score, 4)}%`,
                    background: date === today
                      ? 'var(--color-primary)'
                      : 'var(--color-primary-light)',
                  }}
                />
              </div>
              <span className={`${styles.barLabel} ${date === today ? styles.barToday : ''}`}>
                {new Date(date + 'T00:00:00').getDate()}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.summaryGrid}>
        <button className={styles.summaryCard} onClick={() => onTabChange('goals')}>
          <span className={styles.summaryEmoji}>🎯</span>
          <span className={styles.summaryLabel}>목표</span>
          <span className={styles.summaryValue}>{goalsDone}/{goalsSet || 3}</span>
        </button>
        <button className={styles.summaryCard} onClick={() => onTabChange('todo')}>
          <span className={styles.summaryEmoji}>✅</span>
          <span className={styles.summaryLabel}>할 일</span>
          <span className={styles.summaryValue}>{todosDone}/{todos.length}</span>
        </button>
        <button className={styles.summaryCard} onClick={() => onTabChange('habits')}>
          <span className={styles.summaryEmoji}>🔥</span>
          <span className={styles.summaryLabel}>습관</span>
          <span className={styles.summaryValue}>{habitsChecked}/{habits.length}</span>
        </button>
        <button className={styles.summaryCard} onClick={() => onTabChange('journal')}>
          <span className={styles.summaryEmoji}>📝</span>
          <span className={styles.summaryLabel}>회고</span>
          <span className={styles.summaryValue}>{journalData.savedAt ? '완료' : '미작성'}</span>
        </button>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { getToday } from '../../utils/dateUtils'
import HabitItem from './HabitItem'
import styles from './HabitTracker.module.css'

const EMOJIS = ['💧', '🧘', '📖', '🏃', '✍️', '🎵', '💤', '🥗', '💊', '🧹']

function calculateStreak(habitId, log) {
  let streak = 0
  const d = new Date()
  const todayKey = getToday()

  if (!(log[todayKey] || []).includes(habitId)) {
    d.setDate(d.getDate() - 1)
  }

  while (true) {
    const key = d.toISOString().split('T')[0]
    if ((log[key] || []).includes(habitId)) {
      streak++
      d.setDate(d.getDate() - 1)
    } else {
      break
    }
  }
  return streak
}

export default function HabitTracker() {
  const [habits, setHabits] = useLocalStorage('dailyboost_habits', [])
  const [log, setLog] = useLocalStorage('dailyboost_habit_log', {})
  const [showAdd, setShowAdd] = useState(false)
  const [newName, setNewName] = useState('')
  const [newEmoji, setNewEmoji] = useState('💧')
  const [newCue, setNewCue] = useState('')
  const [newReward, setNewReward] = useState('')

  const today = getToday()
  const todayLog = log[today] || []

  const toggleHabit = (id) => {
    const updated = todayLog.includes(id)
      ? todayLog.filter(hid => hid !== id)
      : [...todayLog, id]
    setLog({ ...log, [today]: updated })
  }

  const addHabit = () => {
    if (!newName.trim()) return
    const habit = {
      id: Date.now(),
      name: newName.trim(),
      emoji: newEmoji,
      cue: newCue.trim(),
      reward: newReward.trim(),
      createdAt: today,
    }
    setHabits([...habits, habit])
    setNewName('')
    setNewCue('')
    setNewReward('')
    setShowAdd(false)
  }

  const deleteHabit = (id) => {
    setHabits(habits.filter(h => h.id !== id))
  }

  const checkedCount = habits.filter(h => todayLog.includes(h.id)).length

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>습관 트래커</h2>
        <p className={styles.subtitle}>신호 → 루틴 → 보상, 습관 루프를 설계하세요</p>
        {habits.length > 0 && (
          <div className={styles.progress}>
            {checkedCount}/{habits.length} 체크
          </div>
        )}
      </div>

      <button
        className={styles.addToggle}
        onClick={() => setShowAdd(!showAdd)}
      >
        {showAdd ? '취소' : '+ 새 습관 추가'}
      </button>

      {showAdd && (
        <div className={styles.addForm}>
          <div className={styles.emojiPicker}>
            {EMOJIS.map(e => (
              <button
                key={e}
                className={`${styles.emojiBtn} ${newEmoji === e ? styles.emojiSelected : ''}`}
                onClick={() => setNewEmoji(e)}
              >
                {e}
              </button>
            ))}
          </div>
          <div className={styles.formField}>
            <label>⚡ 루틴 (습관 이름)</label>
            <input
              type="text"
              placeholder="예: 명상 10분"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </div>
          <div className={styles.formField}>
            <label>🔔 신호 (언제/어디서)</label>
            <input
              type="text"
              placeholder="예: 아침 7시 알람 후"
              value={newCue}
              onChange={(e) => setNewCue(e.target.value)}
            />
          </div>
          <div className={styles.formField}>
            <label>🎁 보상 (완료 후)</label>
            <input
              type="text"
              placeholder="예: 좋아하는 커피 한 잔"
              value={newReward}
              onChange={(e) => setNewReward(e.target.value)}
            />
          </div>
          <button className={styles.submitBtn} onClick={addHabit}>습관 추가</button>
        </div>
      )}

      <div className={styles.habitList}>
        {habits.map(habit => (
          <HabitItem
            key={habit.id}
            habit={habit}
            checked={todayLog.includes(habit.id)}
            streak={calculateStreak(habit.id, log)}
            onToggle={toggleHabit}
            onDelete={deleteHabit}
          />
        ))}
      </div>

      {habits.length === 0 && !showAdd && (
        <div className={styles.empty}>
          아직 습관이 없어요.<br />위에서 새 습관을 추가해보세요!
        </div>
      )}

      <div className={styles.tip}>
        🔄 Charles Duhigg의 습관 루프: 신호(Cue)가 루틴(Routine)을 시작하고,
        보상(Reward)이 루프를 강화합니다. 보상을 명확히 정하면 습관이 더 빨리 형성됩니다.
      </div>
    </div>
  )
}

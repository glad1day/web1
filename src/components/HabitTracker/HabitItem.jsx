import { useState } from 'react'
import styles from './HabitTracker.module.css'

export default function HabitItem({ habit, checked, streak, onToggle, onDelete, onShowDetail }) {
  const [showDetail, setShowDetail] = useState(false)

  return (
    <div className={styles.habitItem}>
      <div className={styles.habitRow}>
        <button
          className={`${styles.habitCheck} ${checked ? styles.habitChecked : ''}`}
          onClick={() => onToggle(habit.id)}
        >
          {checked ? '✓' : ''}
        </button>
        <div className={styles.habitInfo} onClick={() => setShowDetail(!showDetail)}>
          <span className={styles.habitEmoji}>{habit.emoji}</span>
          <span className={`${styles.habitName} ${checked ? styles.checkedName : ''}`}>
            {habit.name}
          </span>
        </div>
        {streak > 0 && (
          <span className={styles.streak}>🔥 {streak}일</span>
        )}
        <button className={styles.habitDeleteBtn} onClick={() => onDelete(habit.id)}>×</button>
      </div>

      {showDetail && (
        <div className={styles.habitDetail}>
          {habit.cue && (
            <div className={styles.loopItem}>
              <span className={styles.loopLabel}>🔔 신호</span>
              <span>{habit.cue}</span>
            </div>
          )}
          <div className={styles.loopItem}>
            <span className={styles.loopLabel}>⚡ 루틴</span>
            <span>{habit.name}</span>
          </div>
          {habit.reward && (
            <div className={styles.loopItem}>
              <span className={styles.loopLabel}>🎁 보상</span>
              <span>{habit.reward}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

import { useState } from 'react'
import { useDailyData } from '../../hooks/useDailyData'
import styles from './MorningGoals.module.css'

const emptyGoal = () => ({
  id: Date.now(),
  wish: '',
  outcome: '',
  obstacle: '',
  plan: '',
  completed: false,
})

const defaultGoals = [emptyGoal(), emptyGoal(), emptyGoal()]

export default function MorningGoals() {
  const [data, setData] = useDailyData('goals', { goals: defaultGoals })
  const [expandedId, setExpandedId] = useState(null)

  const goals = data.goals || defaultGoals

  const updateGoal = (index, field, value) => {
    const updated = [...goals]
    updated[index] = { ...updated[index], [field]: value }
    setData({ goals: updated })
  }

  const toggleComplete = (index) => {
    const updated = [...goals]
    updated[index] = { ...updated[index], completed: !updated[index].completed }
    setData({ goals: updated })
  }

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const filledGoals = goals.filter(g => g.wish.trim()).length
  const completedGoals = goals.filter(g => g.completed).length

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>WOOP 목표 설정</h2>
        <p className={styles.subtitle}>
          오늘의 목표를 과학적으로 설계하세요
        </p>
        {filledGoals > 0 && (
          <div className={styles.progress}>
            {completedGoals}/{filledGoals} 달성
          </div>
        )}
      </div>

      <div className={styles.goalList}>
        {goals.map((goal, index) => (
          <div
            key={index}
            className={`${styles.goalCard} ${goal.completed ? styles.completed : ''}`}
          >
            <div className={styles.goalHeader}>
              <button
                className={`${styles.checkbox} ${goal.completed ? styles.checked : ''}`}
                onClick={() => toggleComplete(index)}
              >
                {goal.completed && '✓'}
              </button>
              <div className={styles.goalMain}>
                <span className={styles.goalNumber}>목표 {index + 1}</span>
                <input
                  type="text"
                  placeholder="🌟 오늘 이루고 싶은 것은?"
                  value={goal.wish}
                  onChange={(e) => updateGoal(index, 'wish', e.target.value)}
                  className={styles.wishInput}
                />
              </div>
              {goal.wish.trim() && (
                <button
                  className={styles.expandBtn}
                  onClick={() => toggleExpand(goal.id || index)}
                >
                  {expandedId === (goal.id || index) ? '▲' : '▼'}
                </button>
              )}
            </div>

            {expandedId === (goal.id || index) && (
              <div className={styles.woopDetails}>
                <div className={styles.woopField}>
                  <label>🎯 최선의 결과</label>
                  <input
                    type="text"
                    placeholder="이걸 이루면 어떤 기분일까?"
                    value={goal.outcome}
                    onChange={(e) => updateGoal(index, 'outcome', e.target.value)}
                  />
                </div>
                <div className={styles.woopField}>
                  <label>🚧 장애물</label>
                  <input
                    type="text"
                    placeholder="방해가 될 수 있는 것은?"
                    value={goal.obstacle}
                    onChange={(e) => updateGoal(index, 'obstacle', e.target.value)}
                  />
                </div>
                <div className={styles.woopField}>
                  <label>📋 대처 계획</label>
                  <input
                    type="text"
                    placeholder="만약 [장애물]이 생기면, [대처]를 한다"
                    value={goal.plan}
                    onChange={(e) => updateGoal(index, 'plan', e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className={styles.tip}>
        💡 WOOP 기법: 소망을 정하고, 결과를 상상하고, 장애물을 예측하고, 대처 계획을 세우면 목표 달성 확률이 2배 이상 높아집니다.
      </div>
    </div>
  )
}

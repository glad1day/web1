import { useState } from 'react'
import { useDailyData } from '../../hooks/useDailyData'
import styles from './Journal.module.css'

const prompts = [
  { key: 'effort', emoji: '💪', label: '오늘의 노력', placeholder: '오늘 가장 열심히 한 순간은?' },
  { key: 'strategy', emoji: '🧠', label: '전략 발견', placeholder: '더 나은 방법을 발견했다면?' },
  { key: 'learned', emoji: '📚', label: '성장 기록', placeholder: "오늘 새로 알게 된 것, 또는 '아직' 배우는 중인 것은?" },
  { key: 'gratitude', emoji: '🙏', label: '감사 한 줄', placeholder: '오늘 감사한 것 하나는?' },
  { key: 'growth', emoji: '🌱', label: '내일의 나에게', placeholder: '내일의 나에게 한마디' },
]

export default function Journal() {
  const [data, setData] = useDailyData('journal', {
    effort: '', strategy: '', learned: '', gratitude: '', growth: '', savedAt: null
  })
  const [saved, setSaved] = useState(false)

  const updateField = (key, value) => {
    setData({ ...data, [key]: value, savedAt: null })
    setSaved(false)
  }

  const handleSave = () => {
    setData({ ...data, savedAt: new Date().toISOString() })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const hasContent = prompts.some(p => data[p.key]?.trim())

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>하루 회고</h2>
        <p className={styles.subtitle}>
          성장 마인드셋으로 하루를 돌아보세요
        </p>
        {data.savedAt && (
          <span className={styles.savedBadge}>저장됨 ✓</span>
        )}
      </div>

      <div className={styles.promptList}>
        {prompts.map(prompt => (
          <div key={prompt.key} className={styles.promptCard}>
            <label className={styles.promptLabel}>
              <span className={styles.promptEmoji}>{prompt.emoji}</span>
              {prompt.label}
            </label>
            <textarea
              placeholder={prompt.placeholder}
              value={data[prompt.key] || ''}
              onChange={(e) => updateField(prompt.key, e.target.value)}
              rows={3}
            />
          </div>
        ))}
      </div>

      <button
        className={`${styles.saveBtn} ${saved ? styles.savedAnim : ''}`}
        onClick={handleSave}
        disabled={!hasContent}
      >
        {saved ? '✓ 저장 완료!' : '💾 회고 저장하기'}
      </button>

      <div className={styles.tip}>
        🧠 Carol Dweck의 성장 마인드셋: "아직 못한 것"은 "앞으로 배울 것"입니다.
        과정과 노력에 집중하면 더 빠르게 성장합니다.
      </div>
    </div>
  )
}

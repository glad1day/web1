import { useState } from 'react'
import { useDailyData } from '../../hooks/useDailyData'
import TodoItem from './TodoItem'
import styles from './TodoList.module.css'

export default function TodoList() {
  const [data, setData] = useDailyData('todos', { items: [] })
  const [newText, setNewText] = useState('')

  const items = data.items || []
  const completedCount = items.filter(i => i.completed).length
  const totalCount = items.length
  const allDone = totalCount > 0 && completedCount === totalCount
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  const addItem = () => {
    const text = newText.trim()
    if (!text) return
    setData({
      items: [...items, { id: Date.now(), text, completed: false }]
    })
    setNewText('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') addItem()
  }

  const toggleItem = (id) => {
    setData({
      items: items.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    })
  }

  const deleteItem = (id) => {
    setData({ items: items.filter(item => item.id !== id) })
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>할 일 관리</h2>
        <p className={styles.subtitle}>작은 완료가 큰 성취를 만듭니다</p>
      </div>

      <div className={styles.inputRow}>
        <input
          type="text"
          placeholder="새로운 할 일 추가..."
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          onKeyDown={handleKeyDown}
          className={styles.input}
        />
        <button className={styles.addBtn} onClick={addItem}>+</button>
      </div>

      {totalCount > 0 && (
        <div className={styles.progressSection}>
          <div className={styles.progressInfo}>
            <span>{completedCount}/{totalCount} 완료</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {allDone && (
        <div className={styles.allDone}>
          🎉 오늘 하루 완주! 대단해요!
        </div>
      )}

      <div className={styles.list}>
        {items.map(item => (
          <TodoItem
            key={item.id}
            item={item}
            onToggle={toggleItem}
            onDelete={deleteItem}
          />
        ))}
      </div>

      {totalCount === 0 && (
        <div className={styles.empty}>
          아직 할 일이 없어요.<br />위에서 추가해보세요!
        </div>
      )}
    </div>
  )
}

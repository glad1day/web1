import { useState } from 'react'
import styles from './TodoList.module.css'

export default function TodoItem({ item, onToggle, onDelete }) {
  const [justCompleted, setJustCompleted] = useState(false)

  const handleToggle = () => {
    if (!item.completed) {
      setJustCompleted(true)
      setTimeout(() => setJustCompleted(false), 500)
    }
    onToggle(item.id)
  }

  return (
    <div className={`${styles.todoItem} ${item.completed ? styles.completed : ''}`}>
      <button
        className={`${styles.checkbox} ${item.completed ? styles.checked : ''} ${justCompleted ? styles.pop : ''}`}
        onClick={handleToggle}
      >
        {item.completed && '✓'}
      </button>
      <span className={styles.todoText}>{item.text}</span>
      <button className={styles.deleteBtn} onClick={() => onDelete(item.id)}>
        ×
      </button>
    </div>
  )
}

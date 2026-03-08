import styles from './TabBar.module.css'

const tabs = [
  { id: 'home', label: '홈', emoji: '🏠' },
  { id: 'goals', label: 'WOOP', emoji: '🎯' },
  { id: 'todo', label: '할 일', emoji: '✅' },
  { id: 'journal', label: '회고', emoji: '📝' },
  { id: 'habits', label: '습관', emoji: '🔥' },
]

export default function TabBar({ activeTab, onTabChange }) {
  return (
    <nav className={styles.tabBar}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          <span className={styles.emoji}>{tab.emoji}</span>
          <span className={styles.label}>{tab.label}</span>
        </button>
      ))}
    </nav>
  )
}

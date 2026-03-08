import { useState } from 'react'
import TabBar from './components/TabBar/TabBar'
import Dashboard from './components/Dashboard/Dashboard'
import MorningGoals from './components/MorningGoals/MorningGoals'
import TodoList from './components/TodoList/TodoList'
import Journal from './components/Journal/Journal'
import HabitTracker from './components/HabitTracker/HabitTracker'
import styles from './App.module.css'

export default function App() {
  const [activeTab, setActiveTab] = useState(() => {
    return sessionStorage.getItem('dailyboost_tab') || 'home'
  })

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    sessionStorage.setItem('dailyboost_tab', tab)
  }

  return (
    <div className={styles.app}>
      <main className={styles.content}>
        {activeTab === 'home' && <Dashboard onTabChange={handleTabChange} />}
        {activeTab === 'goals' && <MorningGoals />}
        {activeTab === 'todo' && <TodoList />}
        {activeTab === 'journal' && <Journal />}
        {activeTab === 'habits' && <HabitTracker />}
      </main>
      <TabBar activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  )
}

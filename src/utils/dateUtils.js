export function getToday() {
  return new Date().toISOString().split('T')[0]
}

export function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return { text: '좋은 아침이에요!', emoji: '🌅' }
  if (hour < 18) return { text: '좋은 오후예요!', emoji: '☀️' }
  return { text: '수고한 하루였어요!', emoji: '🌙' }
}

export function formatDate(dateStr) {
  const date = new Date(dateStr + 'T00:00:00')
  const month = date.getMonth() + 1
  const day = date.getDate()
  const days = ['일', '월', '화', '수', '목', '금', '토']
  const dayName = days[date.getDay()]
  return `${month}월 ${day}일 (${dayName})`
}

export function getRecentDates(count = 7) {
  const dates = []
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    dates.push(d.toISOString().split('T')[0])
  }
  return dates
}

import { useSelector } from 'react-redux';
import { getPastNDays } from '../utils/dateUtils';

export function useUserStats() {
  const { habits, completions } = useSelector((state: any) => state.habits);

  // 1. Active HabitsCount
  const activeHabitsCount = habits.filter((h: any) => h.isActive).length;

  // 2. Total Completions and Points
  const completedCompletions = completions.filter((c: any) => c.completed);
  const totalCompletions = completedCompletions.length;
  const totalPoints = totalCompletions * 10; // 10 points per completion

  // 3. Current Streak
  const calculateStreak = () => {
    const dates = getPastNDays(30);
    let streak = 0;
    
    for (const date of dates) {
      const dayCompletions = completions.filter((c: any) => c.date === date && c.completed);
      const activeHabits = habits.filter((h: any) => h.isActive);
      
      // Streak counts if all currently active habits were completed on that day
      if (activeHabits.length > 0 && dayCompletions.length >= activeHabits.length) {
        streak++;
      } else if (streak > 0) {
        break;
      }
    }
    
    return streak;
  };

  const currentStreak = calculateStreak();

  // 4. Weekly Progress
  const weekDates = getPastNDays(7);
  const thisWeekCompletionsCount = completions.filter((c: any) => 
    weekDates.includes(c.date) && c.completed
  ).length;

  // 5. Completion Rate (7 days)
  const totalPossibleSevenDays = activeHabitsCount * 7;
  const completionRate = totalPossibleSevenDays > 0 
    ? Math.round((thisWeekCompletionsCount / totalPossibleSevenDays) * 100) 
    : 0;

  return {
    activeHabitsCount,
    totalCompletions,
    totalPoints,
    currentStreak,
    thisWeekCompletionsCount,
    completionRate,
    habits,
    completions
  };
}

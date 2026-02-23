import { View, Text, ScrollView, Platform } from 'react-native';
import { useSelector } from 'react-redux';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getPastNDays } from '../../utils/dateUtils';
import { useAppTheme } from '../../hooks/useAppTheme';

export default function Analytics() {
  const { habits, completions } = useSelector((state: any) => state.habits);
  const { isGuest } = useSelector((state: any) => state.auth);
  const { isDarkMode, colors } = useAppTheme();

  // Calculate stats
  const completedCount = completions.filter((c: any) => c.completed).length;
  const totalPossible = habits.filter((h: any) => h.isActive).length * 7;
  const completionRate = totalPossible > 0 ? (completedCount / totalPossible) * 100 : 0;
  
  // Calculate current streak
  const calculateStreak = () => {
    const dates = getPastNDays(30);
    let streak = 0;
    
    for (const date of dates) {
      const dayCompletions = completions.filter((c: any) => c.date === date && c.completed);
      const activeHabits = habits.filter((h: any) => h.isActive);
      
      if (dayCompletions.length >= activeHabits.length && activeHabits.length > 0) {
        streak++;
      } else if (streak > 0) {
        break;
      }
    }
    
    return streak;
  };

  // Calculate weekly progress
  const weekDates = getPastNDays(7);
  const thisWeekCompletions = completions.filter((c: any) => 
    weekDates.includes(c.date) && c.completed
  ).length;

  const stats = {
    totalCompletions: completedCount,
    currentStreak: calculateStreak(),
    weeklyProgress: thisWeekCompletions,
    completionRate: Math.round(completionRate),
  };

  const getHabitStats = () => {
    return habits.map((habit: any) => {
      const habitCompletions = completions.filter((c: any) => c.habitId === habit.id);
      const completedCount = habitCompletions.filter((c: any) => c.completed).length;
      const rate = Math.round((completedCount / 30) * 100);
      
      return {
        name: habit.name,
        category: habit.category,
        completed: completedCount,
        rate,
      };
    });
  };

  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      {/* Premium Header - Full Bleed */}
      <View 
        className="pb-5 px-6 overflow-hidden" 
        style={{ backgroundColor: colors.primary, paddingTop: insets.top + 10 }}
      >
        {/* Background Decorations */}
        <View className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-20" style={{ backgroundColor: 'white' }} />
        <View className="absolute -bottom-5 -left-5 w-20 h-20 rounded-full opacity-10" style={{ backgroundColor: 'white' }} />

        <Text className="text-3xl font-black text-white tracking-tighter">Analytics</Text>
        <Text className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
          {isGuest ? 'Blessed Guest' : 'Track your progress'}
        </Text>
      </View>

      <ScrollView 
        className="flex-1" 
        contentContainerStyle={{ 
          padding: 16,
          paddingBottom: insets.bottom + 40 
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Grid */}
        <View className="flex-row flex-wrap justify-between mb-4">
          <View 
            className="w-[48%] rounded-2xl p-5 mb-3 items-center shadow-sm elevation-2"
            style={{ backgroundColor: colors.surface }}
          >
            <Text className="text-3xl font-bold" style={{ color: colors.primary }}>{stats.currentStreak}</Text>
            <View className="flex-row items-center mt-1">
              <Ionicons name="flame" size={16} color={colors.textSecondary} />
              <Text className="text-sm mt-0.5 ml-1" style={{ color: colors.textSecondary }}>Day Streak</Text>
            </View>
          </View>
          <View 
            className="w-[48%] rounded-2xl p-5 mb-3 items-center shadow-sm elevation-2"
            style={{ backgroundColor: colors.surface }}
          >
            <Text className="text-3xl font-bold" style={{ color: colors.primary }}>{stats.weeklyProgress}</Text>
            <Text className="text-sm mt-1" style={{ color: colors.textSecondary }}>This Week</Text>
          </View>
          <View 
            className="w-[48%] rounded-2xl p-5 mb-3 items-center shadow-sm elevation-2"
            style={{ backgroundColor: colors.surface }}
          >
            <Text className="text-3xl font-bold" style={{ color: colors.primary }}>{stats.totalCompletions}</Text>
            <Text className="text-sm mt-1" style={{ color: colors.textSecondary }}>Total</Text>
          </View>
          <View 
            className="w-[48%] rounded-2xl p-5 mb-3 items-center shadow-sm elevation-2"
            style={{ backgroundColor: colors.surface }}
          >
            <Text className="text-3xl font-bold" style={{ color: colors.primary }}>{stats.completionRate}%</Text>
            <Text className="text-sm mt-1" style={{ color: colors.textSecondary }}>Rate</Text>
          </View>
        </View>

        {/* Completion Rate */}
        <View 
          className="rounded-2xl p-5 mb-4 shadow-sm elevation-2"
          style={{ backgroundColor: colors.surface }}
        >
          <Text className="text-lg font-semibold mb-4" style={{ color: colors.text }}>Overall Completion Rate</Text>
          <View className="h-3 rounded-full overflow-hidden mb-2" style={{ backgroundColor: colors.border }}>
            <View 
              className="h-full rounded-full" 
              style={{ width: `${stats.completionRate}%`, backgroundColor: isDarkMode ? '#818cf8' : '#667eea' }} 
            />
          </View>
          <Text className="text-sm text-right" style={{ color: colors.textSecondary }}>{stats.completionRate}% completed</Text>
        </View>

        {/* Per-Habit Stats */}
        <View 
          className="rounded-2xl p-5 mb-4 shadow-sm elevation-2"
          style={{ backgroundColor: colors.surface }}
        >
          <Text className="text-lg font-semibold mb-4" style={{ color: colors.text }}>Habit Performance (30 days)</Text>
          {getHabitStats().map((habit: any, index: number) => (
            <View key={index} className="flex-row items-center mb-3">
              <View className="w-[100px]">
                <Text className="text-sm font-semibold" style={{ color: colors.text }}>{habit.name}</Text>
                <Text className="text-xs" style={{ color: colors.textSecondary }}>{habit.completed}/30 days</Text>
              </View>
              <View className="flex-1 h-2 rounded-full mx-3 overflow-hidden" style={{ backgroundColor: colors.border }}>
                <View 
                  className="h-full rounded-full" 
                  style={{ width: `${habit.rate}%`, backgroundColor: isDarkMode ? '#34D399' : '#10B981' }} 
                />
              </View>
              <Text className="w-10 text-sm font-semibold text-right" style={{ color: colors.success }}>{habit.rate}%</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

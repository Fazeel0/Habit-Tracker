import { View, Text, ScrollView, Platform } from 'react-native';
import { useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../hooks/useAppTheme';
import { useUserStats } from '../../hooks/useUserStats';
import { CATEGORY_ICONS, HabitCategory } from '../../types';

export default function Analytics() {
  const { isDarkMode, colors } = useAppTheme();
  const { isGuest } = useSelector((state: any) => state.auth);
  const { 
    activeHabitsCount, 
    totalCompletions, 
    currentStreak, 
    thisWeekCompletionsCount, 
    completionRate,
    habits,
    completions
  } = useUserStats();

  const stats = {
    totalCompletions: totalCompletions,
    currentStreak: currentStreak,
    weeklyProgress: thisWeekCompletionsCount,
    completionRate: completionRate,
  };

  const getHabitStats = () => {
    return habits.map((habit: any) => {
      const habitCompletions = completions.filter((c: any) => c.habitId === habit.id);
      const completedHabitCount = habitCompletions.filter((c: any) => c.completed).length;
      const rate = Math.round((completedHabitCount / 30) * 100);
      
      return {
        name: habit.name,
        category: habit.category,
        completed: totalCompletions,
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
        {/* Stats Grid - Premium Cards */}
        <View className="flex-row flex-wrap justify-between mb-6">
          <View 
            className="w-[48%] rounded-[32px] p-6 mb-4 shadow-sm elevation-3"
            style={{ 
              backgroundColor: colors.surface,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.05,
              shadowRadius: 15,
            }}
          >
            <View className="w-10 h-10 rounded-full items-center justify-center mb-3" style={{ backgroundColor: colors.primary + '15' }}>
              <Ionicons name="flame" size={20} color={colors.primary} />
            </View>
            <Text className="text-3xl font-black" style={{ color: colors.text }}>{stats.currentStreak}</Text>
            <Text className="text-[10px] font-black uppercase tracking-widest mt-1" style={{ color: colors.textSecondary }}>Day Streak</Text>
          </View>

          <View 
            className="w-[48%] rounded-[32px] p-6 mb-4 shadow-sm elevation-3"
            style={{ 
              backgroundColor: colors.surface,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.05,
              shadowRadius: 15,
            }}
          >
            <View className="w-10 h-10 rounded-full items-center justify-center mb-3" style={{ backgroundColor: '#10B98115' }}>
              <Ionicons name="calendar" size={20} color="#10B981" />
            </View>
            <Text className="text-3xl font-black" style={{ color: colors.text }}>{stats.weeklyProgress}</Text>
            <Text className="text-[10px] font-black uppercase tracking-widest mt-1" style={{ color: colors.textSecondary }}>This Week</Text>
          </View>

          <View 
            className="w-[48%] rounded-[32px] p-6 mb-4 shadow-sm elevation-3"
            style={{ 
              backgroundColor: colors.surface,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.05,
              shadowRadius: 15,
            }}
          >
            <View className="w-10 h-10 rounded-full items-center justify-center mb-3" style={{ backgroundColor: '#F59E0B15' }}>
              <Ionicons name="checkmark-circle" size={20} color="#F59E0B" />
            </View>
            <Text className="text-3xl font-black" style={{ color: colors.text }}>{stats.totalCompletions}</Text>
            <Text className="text-[10px] font-black uppercase tracking-widest mt-1" style={{ color: colors.textSecondary }}>Total Done</Text>
          </View>

          <View 
            className="w-[48%] rounded-[32px] p-6 mb-4 shadow-sm elevation-3"
            style={{ 
              backgroundColor: colors.surface,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.05,
              shadowRadius: 15,
            }}
          >
            <View className="w-10 h-10 rounded-full items-center justify-center mb-3" style={{ backgroundColor: '#8B5CF615' }}>
              <Ionicons name="trending-up" size={20} color="#8B5CF6" />
            </View>
            <Text className="text-3xl font-black" style={{ color: colors.text }}>{stats.completionRate}%</Text>
            <Text className="text-[10px] font-black uppercase tracking-widest mt-1" style={{ color: colors.textSecondary }}>Success Rate</Text>
          </View>
        </View>

        {/* Overall Completion Rate - Visual Progress */}
        <View 
          className="rounded-[32px] p-6 mb-6 shadow-sm elevation-3"
          style={{ 
            backgroundColor: colors.surface,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.05,
            shadowRadius: 15,
          }}
        >
          <Text className="text-xs font-black uppercase tracking-widest mb-4 ml-1" style={{ color: colors.textSecondary }}>Overall Progress</Text>
          
          <View className="flex-row items-end justify-between mb-4">
            <Text className="text-4xl font-black" style={{ color: colors.text }}>{stats.completionRate}<Text className="text-xl">%</Text></Text>
            <Text className="text-xs font-bold mb-1" style={{ color: colors.textSecondary }}>Weekly Goal</Text>
          </View>

          <View className="h-4 rounded-full overflow-hidden" style={{ backgroundColor: isDarkMode ? '#1F2937' : '#F1F5F9' }}>
            <View 
              className="h-full rounded-full" 
              style={{ 
                width: `${stats.completionRate}%`, 
                backgroundColor: colors.primary,
                shadowColor: colors.primary,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.5,
                shadowRadius: 10,
              }} 
            />
          </View>
        </View>

        {/* Per-Habit Stats - Separated Cards */}
        <Text className="text-xs font-black uppercase tracking-widest mb-4 ml-5" style={{ color: colors.textSecondary }}>Habit Performance (30 Days)</Text>
        
        {getHabitStats().map((stats: any, index: number) => (
          <View 
            key={index} 
            className="rounded-[28px] p-5 mb-4 shadow-sm elevation-3"
            style={{ 
              backgroundColor: colors.surface,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.05,
              shadowRadius: 15,
            }}
          >
            <View className="flex-row justify-between items-center mb-4">
              <View className="flex-row items-center flex-1 mr-3">
                <View 
                  className="w-10 h-10 rounded-full items-center justify-center mr-3" 
                  style={{ backgroundColor: colors.primary + '10' }}
                >
                  <Text className="text-lg">
                    {CATEGORY_ICONS[stats.category as HabitCategory] || '✨'}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="text-base font-black tracking-tight" style={{ color: colors.text }} numberOfLines={1}>
                    {stats.name}
                  </Text>
                  <Text className="text-[10px] font-bold uppercase tracking-widest" style={{ color: colors.textSecondary }}>
                    {stats.category}
                  </Text>
                </View>
              </View>
              <View className="items-end">
                <Text className="text-xl font-black" style={{ color: stats.rate > 70 ? colors.success : (stats.rate > 40 ? '#F59E0B' : '#EF4444') }}>
                  {stats.rate}%
                </Text>
              </View>
            </View>

            <View className="h-3 rounded-full overflow-hidden mb-3" style={{ backgroundColor: isDarkMode ? '#1F2937' : '#F1F5F9' }}>
              <View 
                className="h-full rounded-full" 
                style={{ 
                  width: `${stats.rate}%`, 
                  backgroundColor: stats.rate > 70 ? colors.success : (stats.rate > 40 ? '#F59E0B' : '#EF4444') 
                }} 
              />
            </View>

            <View className="flex-row justify-between items-center">
              <Text className="text-[10px] font-black uppercase tracking-wider" style={{ color: colors.textSecondary }}>
                Last 30 Days
              </Text>
              <Text className="text-[10px] font-black uppercase tracking-wider" style={{ color: colors.textSecondary }}>
                {stats.completed} / 30 Days
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

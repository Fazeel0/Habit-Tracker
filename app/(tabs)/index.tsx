import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getTodayDate, formatDisplayDate, getDaysAgo, getDayName } from '../../utils/dateUtils';
import { CATEGORY_ICONS, HabitCategory } from '../../types';
import { useAppTheme } from '../../hooks/useAppTheme';
import { toggleCompletion as toggleCompletionAction } from '../../redux/slice/habitsSlice';

export default function DailyTracker() {
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  
  const dispatch = useDispatch();
  const { user, isGuest } = useSelector((state: any) => state.auth);
  const { habits, completions } = useSelector((state: any) => state.habits);
  const { isDarkMode, colors } = useAppTheme();

  // Get active habits
  const defaultHabits = habits.filter((h: any) => h.isDefault && h.isActive);
  const customHabits = habits.filter((h: any) => !h.isDefault && h.isActive);
  
  // Get dates for the week
  const getWeekDates = () => {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      dates.push(getDaysAgo(i));
    }
    return dates;
  };

  const weekDates = getWeekDates();

  // Check if habit is completed
  const isCompleted = (habitId: string) => {
    return completions.some((c: any) => c.habitId === habitId && c.date === selectedDate && c.completed);
  };

  // Calculate progress
  const allActiveHabits = [...defaultHabits, ...customHabits];
  const completedCount = allActiveHabits.filter((h: any) => isCompleted(h.id)).length;
  const totalHabits = allActiveHabits.length;
  const progressPercent = totalHabits > 0 ? (completedCount / totalHabits) * 100 : 0;

  // Toggle completion
  const handleToggleCompletion = (habitId: string) => {
    dispatch(toggleCompletionAction({ habitId, date: selectedDate }));
  };

  // Get colors for completed state
  const getCompletedColors = (completed: boolean) => {
    if (completed) {
      return isDarkMode 
        ? { bg: '#064E3B', border: '#34D399', text: '#34D399' }
        : { bg: '#D1FAE5', border: '#10B981', text: '#10B981' };
    }
    return { bg: '', border: '', text: '' };
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

        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-3xl font-black text-white tracking-tighter">Daily Tracker</Text>
            <Text className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
              {isGuest ? 'Blessed Guest' : user?.email}
            </Text>
          </View>
          <TouchableOpacity 
            className="w-10 h-10 rounded-full items-center justify-center"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
            onPress={() => Alert.alert('Notifications', 'No new notifications')}
          >
            <Ionicons name="notifications-outline" size={22} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Date Selector - Card Styled */}
      <View 
        className="py-4 shadow-sm" 
        style={{ 
          backgroundColor: colors.surface,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 4,
        }}
      >
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {weekDates.map((date) => {
            const isToday = date === getTodayDate();
            const isSelected = date === selectedDate;
            return (
              <TouchableOpacity
                key={date}
                onPress={() => setSelectedDate(date)}
              >
                <View 
                  className="items-center py-2 px-4 mx-1 rounded-xl min-w-[50px]"
                  style={{
                    backgroundColor: isSelected ? colors.primary : 'transparent',
                    borderWidth: isToday && !isSelected ? 2 : 0,
                    borderColor: colors.primary,
                  }}
                >
                  <Text 
                    className="text-xs font-semibold"
                    style={{ color: isSelected ? 'white' : colors.textSecondary }}
                  >
                    {getDayName(date, true)}
                  </Text>
                  <Text 
                    className="text-lg font-bold mt-0.5"
                    style={{ color: isSelected ? 'white' : colors.text }}
                  >
                    {new Date(date).getDate()}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Habits List */}
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ 
          paddingHorizontal: 16, 
          paddingTop: 16,
          paddingBottom: insets.bottom + 40 
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress Bar */}
        <View className="mb-4">
          <View className="flex-row justify-between mb-2">
            <Text className="text-sm font-semibold" style={{ color: colors.text }}>Today's Progress</Text>
            <Text className="text-sm" style={{ color: colors.textSecondary }}>{Math.round(progressPercent)}%</Text>
          </View>
          <View className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: colors.border }}>
            <View 
              className="h-full rounded-full"
              style={{
                width: `${progressPercent}%`,
                backgroundColor: colors.primary,
              }}
            />
          </View>
        </View>

        {/* Prayers Section - Default Habits */}
        {defaultHabits.length > 0 && (
          <View className="mb-4">
            <Text className="text-sm font-semibold mb-3 ml-1" style={{ color: colors.textSecondary }}>🙏 Prayers</Text>
            {defaultHabits.map((habit: any) => {
              const completed = isCompleted(habit.id);
              const completedColors = getCompletedColors(completed);
              
              return (
                <TouchableOpacity
                  key={habit.id}
                  onPress={() => handleToggleCompletion(habit.id)}
                  activeOpacity={0.7}
                >
                  <View 
                    className="rounded-2xl p-4 mb-3"
                    style={{
                      backgroundColor: completedColors.bg || (isDarkMode ? '#1F2937' : '#FFFFFF'),
                      borderLeftWidth: 4,
                      borderLeftColor: completedColors.border || (isDarkMode ? '#374151' : '#E5E7EB'),
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.05,
                      shadowRadius: 5,
                      elevation: 3,
                    }}
                  >
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center flex-1">
                        <Text className="text-2xl mr-3">{CATEGORY_ICONS[habit.category as HabitCategory]}</Text>
                        <View className="flex-1">
                          <Text 
                            className="text-base font-semibold"
                            style={{ color: completed ? completedColors.text : (isDarkMode ? '#F9FAFB' : '#1F2937') }}
                          >
                            {habit.name}
                          </Text>
                          <Text className="text-xs" style={{ color: colors.textSecondary }}>
                            {habit.category.charAt(0).toUpperCase() + habit.category.slice(1)}
                          </Text>
                        </View>
                      </View>
                      
                      <View 
                        className="w-7 h-7 rounded-full items-center justify-center border-2"
                        style={{
                          borderColor: completedColors.border || (isDarkMode ? '#374151' : '#E5E7EB'),
                          backgroundColor: completed ? completedColors.border : 'transparent',
                        }}
                      >
                        {completed && <Text className="text-white font-bold text-xs">✓</Text>}
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* My Habits Section - Custom Habits */}
        {customHabits.length > 0 && (
          <View className="mb-4">
            <Text className="text-sm font-semibold mb-3 ml-1" style={{ color: colors.textSecondary }}>📝 My Habits</Text>
            {customHabits.map((habit: any) => {
              const completed = isCompleted(habit.id);
              const completedColors = getCompletedColors(completed);
              
              return (
                <TouchableOpacity
                  key={habit.id}
                  onPress={() => handleToggleCompletion(habit.id)}
                  activeOpacity={0.7}
                >
                  <View 
                    className="rounded-2xl p-4 mb-3"
                    style={{
                      backgroundColor: completedColors.bg || (isDarkMode ? '#1F2937' : '#FFFFFF'),
                      borderLeftWidth: 4,
                      borderLeftColor: completedColors.border || (isDarkMode ? '#374151' : '#E5E7EB'),
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.05,
                      shadowRadius: 5,
                      elevation: 3,
                    }}
                  >
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center flex-1">
                        <Text className="text-2xl mr-3">{CATEGORY_ICONS[habit.category as HabitCategory]}</Text>
                        <View className="flex-1">
                          <Text 
                            className="text-base font-semibold"
                            style={{ color: completed ? completedColors.text : (isDarkMode ? '#F9FAFB' : '#1F2937') }}
                          >
                            {habit.name}
                          </Text>
                          <Text className="text-xs" style={{ color: colors.textSecondary }}>
                            {habit.category.charAt(0).toUpperCase() + habit.category.slice(1)}
                          </Text>
                        </View>
                      </View>
                      
                      <View 
                        className="w-7 h-7 rounded-full items-center justify-center border-2"
                        style={{
                          borderColor: completedColors.border || (isDarkMode ? '#374151' : '#E5E7EB'),
                          backgroundColor: completed ? completedColors.border : 'transparent',
                        }}
                      >
                        {completed && <Text className="text-white font-bold text-xs">✓</Text>}
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

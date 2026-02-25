import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useEffect, useState, useRef } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { useAppTheme } from '../../hooks/useAppTheme';
import { toggleCompletion as toggleCompletionAction } from '../../redux/slice/habitsSlice';
import { setLocation } from '../../redux/slice/settingsSlice';
import { getHijriDateFromApi, HijriDate, AladhanData } from '../../services/aladhanService';
import { CATEGORY_ICONS, HabitCategory } from '../../types';
import { getDayName, getDaysAgo, getTodayDate } from '../../utils/dateUtils';

export default function DailyTracker() {
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [aladhanData, setAladhanData] = useState<Record<string, AladhanData>>({});
  const [isLoadingHijri, setIsLoadingHijri] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const dateScrollRef = useRef<ScrollView>(null);

  const dispatch = useDispatch();
  const { user, isGuest } = useSelector((state: any) => state.auth);
  const { hijriAdjustment, calculationMethod, location } = useSelector((state: any) => state.settings);
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

  // Fetch location on mount
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError('Permission to access location was denied');
        // Default to Gulbarga/Mumbai area if denied for Hijri context
        dispatch(setLocation({ latitude: 17.3297, longitude: 76.8343 }));
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      dispatch(setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude
      }));
    })();
  }, []);

  // Clear Hijri cache when settings change to force refetch
  useEffect(() => {
    setAladhanData({});
  }, [hijriAdjustment, calculationMethod]);

  // Fetch Hijri dates for the week
  useEffect(() => {
    const fetchWeekDatesHijri = async () => {
      if (!location) return;

      const datesToFetch = weekDates.filter(date => !aladhanData[date]);
      if (datesToFetch.length === 0) return;

      try {
        setIsLoadingHijri(true);
        // Fetch all dates in parallel
        const fetchPromises = datesToFetch.map(date =>
          getHijriDateFromApi(
            date,
            location.latitude,
            location.longitude,
            calculationMethod,
            hijriAdjustment
          ).then(data => ({ date, data }))
        );

        const results = await Promise.all(fetchPromises);

        const newData = { ...aladhanData, ...Object.fromEntries(results.map(r => [r.date, r.data])) };
        setAladhanData(newData);
      } catch (error) {
        console.error('Failed to fetch Hijri dates:', error);
      } finally {
        setIsLoadingHijri(false);
      }
    };

    fetchWeekDatesHijri();
  }, [location, hijriAdjustment, calculationMethod]);

  // Auto-scroll to today on mount or when weekData loads
  useEffect(() => {
    if (dateScrollRef.current) {
      const todayIndex = weekDates.indexOf(getTodayDate());
      if (todayIndex !== -1) {
        // Approximate width: mx-1.5 (12px total margin) + minWidth 70 = 82px per item
        // Plus paddingHorizontal 12 (offset)
        const scrollX = todayIndex * 82;
        setTimeout(() => {
          dateScrollRef.current?.scrollTo({ x: scrollX, animated: true });
        }, 500);
      }
    }
  }, [location]);

  const currentData = aladhanData[selectedDate];
  const currentHijri = currentData?.hijri;
  const currentTimings = currentData?.timings;

  // Prayer names mapping for API timings match
  const PRAYER_NAME_MAP: Record<string, string> = {
    'default-fajr': 'Fajr',
    'default-dhuhr': 'Dhuhr',
    'default-asr': 'Asr',
    'default-maghrib': 'Maghrib',
    'default-isha': 'Isha'
  };

  // Logic to find upcoming prayer
  const getUpcomingPrayer = () => {
    if (!currentTimings) return null;
    
    // Aladhan timings are like "05:12 (IST)" or just "05:12"
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const prayerOrder = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    
    for (const prayer of prayerOrder) {
      const timeStr = currentTimings[prayer];
      if (!timeStr) continue;
      
      const [h, m] = timeStr.split(' ')[0].split(':').map(Number);
      const prayerTime = h * 60 + m;
      
      if (prayerTime > currentTime) {
        return { name: prayer, time: timeStr.split(' ')[0] };
      }
    }
    
    // If all passed, next is Fajr tomorrow (simplified for today's display)
    return { name: 'Fajr', time: currentTimings['Fajr'].split(' ')[0], isTomorrow: true };
  };

  const upcomingPrayer = getUpcomingPrayer();

  // Toggle completion
  const handleToggleCompletion = (habitId: string) => {
    const isToday = selectedDate === getTodayDate();
    const prayerName = PRAYER_NAME_MAP[habitId];
    const isCompleting = !isCompleted(habitId);

    // If it's a prayer habit being marked as completed for today
    if (isCompleting && prayerName && isToday && currentTimings) {
      const timeStr = currentTimings[prayerName];
      if (timeStr) {
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();
        const [h, m] = timeStr.split(' ')[0].split(':').map(Number);
        const prayerTime = h * 60 + m;

        if (currentTime < prayerTime) {
          Alert.alert(
            "Time Not Passed",
            `It's not yet time for ${prayerName} (${timeStr.split(' ')[0]}). Please mark it after you've performed the prayer.`,
            [{ text: "OK" }]
          );
          return;
        }
      }
    }

    dispatch(toggleCompletionAction({ habitId, date: selectedDate }));
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
            <Text className="text-sm font-black uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
              {new Date(selectedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              {currentHijri ? ` • ${currentHijri.month.en} ${currentHijri.year} AH` : (isLoadingHijri ? ' • Loading...' : '')}
            </Text>
            <Text className="text-4xl font-black text-white tracking-tighter">Assalamu Alaikum,</Text>
            <Text className="text-lg font-bold text-white opacity-90 mt-[-4px]">
              {isGuest ? 'Abdullah' : user?.displayName || user?.email.split('@')[0]}
            </Text>
          </View>
          <TouchableOpacity
            className="w-12 h-12 rounded-2xl items-center justify-center"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
            onPress={() => Alert.alert('Notifications', 'No new notifications')}
          >
            <Ionicons name="notifications" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Date Selector - Premium Calendar Style */}
      <View
        className="py-6 shadow-sm mb-2"
        style={{
          backgroundColor: colors.surface,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.05,
          shadowRadius: 10,
          elevation: 4,
          borderBottomLeftRadius: 32,
          borderBottomRightRadius: 32,
        }}
      >
        <ScrollView 
          ref={dateScrollRef}
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={{ paddingHorizontal: 12 }}
        >
          {weekDates.map((date) => {
            const isToday = date === getTodayDate();
            const isSelected = date === selectedDate;
            const dateData = aladhanData[date];
            const dateHijri = dateData?.hijri;
            return (
              <TouchableOpacity
                key={date}
                onPress={() => setSelectedDate(date)}
                activeOpacity={0.8}
              >
                <View
                  className="items-center py-4 px-5 mx-1.5 rounded-[24px]"
                  style={{
                    backgroundColor: isSelected ? colors.primary : (isDarkMode ? '#1F2937' : '#F8FAFC'),
                    shadowColor: isSelected ? colors.primary : 'transparent',
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: 0.3,
                    shadowRadius: 10,
                    elevation: isSelected ? 6 : 0,
                    borderWidth: isToday && !isSelected ? 1 : 0,
                    borderColor: colors.primary,
                    minWidth: 70,
                  }}
                >
                  <Text
                    className="text-[10px] font-black uppercase tracking-widest"
                    style={{ color: isSelected ? 'rgba(255,255,255,0.8)' : colors.textSecondary }}
                  >
                    {getDayName(date, true)}
                  </Text>
                  <Text
                    className="text-xl font-black mt-1"
                    style={{ color: isSelected ? 'white' : colors.text }}
                  >
                    {new Date(date).getDate()}
                  </Text>
                  <Text
                    className="text-[9px] font-bold"
                    style={{ color: isSelected ? 'rgba(255,255,255,0.6)' : colors.textSecondary, marginTop: 2 }}
                  >
                    {dateHijri ? dateHijri.day : '-'}
                  </Text>
                  {isToday && !isSelected && (
                    <View className="absolute bottom-2 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.primary }} />
                  )}
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
        {/* Upcoming Prayer Reminder Card */}
        {upcomingPrayer && (
          <View 
            className="rounded-[32px] p-6 mb-6 flex-row items-center justify-between"
            style={{ 
              backgroundColor: colors.primary,
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.3,
              shadowRadius: 12,
              elevation: 8,
            }}
          >
            <View className="flex-1">
              <Text className="text-white/70 text-[10px] font-black uppercase tracking-widest mb-1">
                {upcomingPrayer.isTomorrow ? 'Next Prayer (Tomorrow)' : 'Upcoming Prayer'}
              </Text>
              <Text className="text-white text-3xl font-black">{upcomingPrayer.name}</Text>
            </View>
            <View className="items-end">
              <Text className="text-white text-2xl font-black">{upcomingPrayer.time}</Text>
              <View className="flex-row items-center bg-white/20 px-2 py-0.5 rounded-full mt-1">
                <Ionicons name="time-outline" size={12} color="white" />
                <Text className="text-white text-[10px] font-bold ml-1">Reminder</Text>
              </View>
            </View>
          </View>
        )}

        {/* Progress Card - Premium Style */}
        <View
          className="rounded-[32px] p-6 mb-8 shadow-sm elevation-3"
          style={{
            backgroundColor: colors.surface,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.05,
            shadowRadius: 15,
          }}
        >
          <View className="flex-row justify-between items-end mb-4">
            <View>
              <Text className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: colors.textSecondary }}>Daily Progress</Text>
              <Text className="text-4xl font-black" style={{ color: colors.text }}>{Math.round(progressPercent)}%</Text>
            </View>
            <Text className="text-xs font-bold mb-1" style={{ color: colors.textSecondary }}>
              {completedCount} of {totalHabits} habits
            </Text>
          </View>

          <View className="h-4 rounded-full overflow-hidden" style={{ backgroundColor: isDarkMode ? '#1F2937' : '#F1F5F9' }}>
            <View
              className="h-full rounded-full"
              style={{
                width: `${progressPercent}%`,
                backgroundColor: colors.primary,
                shadowColor: colors.primary,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.5,
                shadowRadius: 10,
              }}
            />
          </View>
        </View>

        {/* Prayers Section */}
        {defaultHabits.length > 0 && (
          <View className="mb-6">
            <Text className="text-xs font-black uppercase tracking-widest mb-4 ml-5" style={{ color: colors.textSecondary }}>Prayers</Text>
            {defaultHabits.map((habit: any) => {
              const completed = isCompleted(habit.id);

              return (
                <TouchableOpacity
                  key={habit.id}
                  onPress={() => handleToggleCompletion(habit.id)}
                  activeOpacity={0.8}
                >
                  <View
                    className="rounded-[28px] p-5 mb-4"
                    style={{
                      backgroundColor: colors.surface,
                      borderWidth: 2,
                      borderColor: completed ? colors.success : 'transparent',
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 6 },
                      shadowOpacity: 0.05,
                      shadowRadius: 15,
                      elevation: 4,
                    }}
                  >
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center flex-1">
                        <View
                          className="w-12 h-12 rounded-2xl items-center justify-center mr-4"
                          style={{ backgroundColor: isDarkMode ? '#111827' : '#F8FAFC' }}
                        >
                          <Text className="text-2xl">{CATEGORY_ICONS[habit.category as HabitCategory]}</Text>
                        </View>
                        <View className="flex-1">
                          <Text
                            className="text-lg font-black tracking-tight"
                            style={{ color: colors.text }}
                          >
                            {habit.name}
                          </Text>
                          <View className="flex-row items-center">
                            <Text className="text-[10px] font-black uppercase tracking-widest" style={{ color: colors.textSecondary }}>
                              {habit.category}
                            </Text>
                            {currentTimings && currentTimings[PRAYER_NAME_MAP[habit.id]] && (
                              <>
                                <View className="w-1 h-1 rounded-full mx-2" style={{ backgroundColor: colors.textSecondary + '40' }} />
                                <Text className="text-[10px] font-black" style={{ color: colors.primary }}>
                                  {currentTimings[PRAYER_NAME_MAP[habit.id]].split(' ')[0]}
                                </Text>
                              </>
                            )}
                          </View>
                        </View>
                      </View>

                      <View
                        className="w-10 h-10 rounded-full items-center justify-center border-2"
                        style={{
                          borderColor: completed ? colors.success : (isDarkMode ? '#374151' : '#E5E7EB'),
                          backgroundColor: completed ? colors.success : 'transparent',
                        }}
                      >
                        {completed && <Ionicons name="checkmark" size={20} color="white" />}
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* My Habits Section */}
        {customHabits.length > 0 && (
          <View className="mb-6">
            <Text className="text-xs font-black uppercase tracking-widest mb-4 ml-5" style={{ color: colors.textSecondary }}>My Habits</Text>
            {customHabits.map((habit: any) => {
              const completed = isCompleted(habit.id);

              return (
                <TouchableOpacity
                  key={habit.id}
                  onPress={() => handleToggleCompletion(habit.id)}
                  activeOpacity={0.8}
                >
                  <View
                    className="rounded-[28px] p-5 mb-4"
                    style={{
                      backgroundColor: colors.surface,
                      borderWidth: 2,
                      borderColor: completed ? colors.success : 'transparent',
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 6 },
                      shadowOpacity: 0.05,
                      shadowRadius: 15,
                      elevation: 4,
                    }}
                  >
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center flex-1">
                        <View
                          className="w-12 h-12 rounded-2xl items-center justify-center mr-4"
                          style={{ backgroundColor: isDarkMode ? '#111827' : '#F8FAFC' }}
                        >
                          <Text className="text-2xl">{CATEGORY_ICONS[habit.category as HabitCategory]}</Text>
                        </View>
                        <View className="flex-1">
                          <Text
                            className="text-lg font-black tracking-tight"
                            style={{ color: colors.text }}
                          >
                            {habit.name}
                          </Text>
                          <Text className="text-[10px] font-black uppercase tracking-widest" style={{ color: colors.textSecondary }}>
                            {habit.category}
                          </Text>
                        </View>
                      </View>

                      <View
                        className="w-10 h-10 rounded-full items-center justify-center border-2"
                        style={{
                          borderColor: completed ? colors.success : (isDarkMode ? '#374151' : '#E5E7EB'),
                          backgroundColor: completed ? colors.success : 'transparent',
                        }}
                      >
                        {completed && <Ionicons name="checkmark" size={20} color="white" />}
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

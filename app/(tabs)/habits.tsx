import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, Keyboard, KeyboardAvoidingView, Modal, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { useAppTheme } from '../../hooks/useAppTheme';
import { addHabit, deleteHabit, toggleHabitActive } from '../../redux/slice/habitsSlice';
import { Habit, HabitCategory } from '../../types';

const CATEGORIES: { value: HabitCategory; label: string; emoji: string }[] = [
  { value: 'prayer', label: 'Prayer', emoji: '🙏' },
  { value: 'quran', label: 'Quran', emoji: '📖' },
  { value: 'fasting', label: 'Fasting', emoji: '🌙' },
  { value: 'charity', label: 'Charity', emoji: '💝' },
  { value: 'dhikr', label: 'Dhikr', emoji: '✨' },
  { value: 'worship', label: 'Worship & Spirituality', emoji: '🕌' },
  { value: 'health', label: 'Health & Fitness', emoji: '🏃' },
  { value: 'work', label: 'Work & Career', emoji: '💼' },
  { value: 'personal', label: 'Personal Development', emoji: '🎓' },
  { value: 'social', label: 'Social & Relationships', emoji: '👥' },
  { value: 'hobbies', label: 'Hobbies & Interests', emoji: '🎨' },
  { value: 'finance', label: 'Finance', emoji: '💰' },
  { value: 'other', label: 'Other', emoji: '📝' },
];

const CATEGORY_COLORS: Record<HabitCategory, string> = {
  prayer: '#667eea',
  quran: '#764ba2',
  fasting: '#f093fb',
  charity: '#4facfe',
  dhikr: '#ffd200',
  worship: '#667eea',
  health: '#10B981',
  work: '#3B82F6',
  personal: '#8B5CF6',
  social: '#EC4899',
  hobbies: '#F59E0B',
  finance: '#EF4444',
  other: '#667eea',
};

export default function Habits() {
  const [showModal, setShowModal] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitCategory, setNewHabitCategory] = useState<HabitCategory>('other');

  const dispatch = useDispatch();
  const { user, isGuest } = useSelector((state: any) => state.auth);
  const { habits } = useSelector((state: any) => state.habits);
  const { isDarkMode, colors } = useAppTheme();

  const handleAddHabit = () => {
    if (!newHabitName.trim()) {
      Alert.alert('Error', 'Please enter a habit name');
      return;
    }

    const newHabit: Habit = {
      id: `custom-${Date.now()}`,
      userId: user?.uid || 'guest',
      name: newHabitName.trim(),
      category: newHabitCategory,
      frequency: 'daily',
      targetCount: 1,
      isActive: true,
      isDefault: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    dispatch(addHabit(newHabit));
    setShowModal(false);
    setNewHabitName('');
    setNewHabitCategory('other');
  };

  const handleDeleteHabit = (habitId: string) => {
    Alert.alert(
      'Delete Habit',
      'Are you sure you want to delete this habit?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            dispatch(deleteHabit(habitId));
          },
        },
      ]
    );
  };

  const handleToggleActive = (habitId: string) => {
    dispatch(toggleHabitActive(habitId));
  };

  const defaultHabits = habits.filter((h: any) => h.isDefault);
  const customHabits = habits.filter((h: any) => !h.isDefault);

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

        <Text className="text-3xl font-black text-white tracking-tighter">Habits</Text>
        <Text className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
          {isGuest ? 'Blessed Guest' : 'Manage your habits'}
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
        {/* Add Button - Premium Action */}
        <TouchableOpacity
          className="py-5 rounded-[24px] items-center mb-8 flex-row justify-center"
          onPress={() => setShowModal(true)}
          activeOpacity={0.8}
          style={{
            backgroundColor: colors.primary,
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 15,
            elevation: 8,
          }}
        >
          <Ionicons name="add-circle" size={24} color="white" className="mr-2" />
          <Text className="text-white text-base font-black uppercase tracking-[2px]">New Habit</Text>
        </TouchableOpacity>

        {/* Habits List */}
        {habits.length === 0 ? (
          <View className="items-center py-10">
            <Ionicons name="flag-outline" size={48} color={colors.textSecondary} />
            <Text className="text-lg font-semibold mt-4" style={{ color: colors.text }}>No habits yet</Text>
            <Text className="text-sm mt-2" style={{ color: colors.textSecondary }}>Add your first habit to get started!</Text>
          </View>
        ) : (
          <>
            {/* Default Habits Section */}
            {defaultHabits.length > 0 && (
              <>
                <Text className="text-xs font-semibold mb-3 uppercase ml-5" style={{ color: colors.textSecondary }}>Prayers</Text>
                {defaultHabits.map((habit: any) => (
                  <View
                    key={habit.id}
                    className="rounded-[28px] p-5 mb-4"
                    style={{
                      backgroundColor: colors.surface,
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.05,
                      shadowRadius: 15,
                      elevation: 4,
                    }}
                  >
                    <View className="flex-row justify-between items-start mb-4">
                      <View className="flex-1 mr-3">
                        <View
                          className="px-3 py-1 rounded-full self-start mb-2"
                          style={{ backgroundColor: CATEGORY_COLORS[habit.category as HabitCategory] + '15' }}
                        >
                          <Text className="text-[10px] font-black uppercase tracking-wider" style={{ color: CATEGORY_COLORS[habit.category as HabitCategory] }}>
                            {CATEGORIES.find(c => c.value === habit.category)?.emoji}{' '}
                            {habit.category.charAt(0).toUpperCase() + habit.category.slice(1)}
                          </Text>
                        </View>
                        <Text
                          className="text-xl font-black leading-7"
                          style={{ color: habit.isActive ? colors.text : colors.textSecondary }}
                        >
                          {habit.name}
                        </Text>
                      </View>

                      <TouchableOpacity
                        className="px-4 py-2 rounded-2xl"
                        style={{
                          backgroundColor: habit.isActive ? colors.primary : (isDarkMode ? '#374151' : '#F3F4F6'),
                          shadowColor: habit.isActive ? colors.primary : 'transparent',
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.2,
                          shadowRadius: 4,
                        }}
                        onPress={() => handleToggleActive(habit.id)}
                      >
                        <Text className="font-bold text-xs" style={{ color: habit.isActive ? 'white' : colors.textSecondary }}>
                          {habit.isActive ? 'ACTIVE' : 'INACTIVE'}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <View className="h-[1px] w-full mb-3 opacity-5" style={{ backgroundColor: colors.text }} />

                    <View className="flex-row items-center">
                      <Ionicons name="repeat" size={14} color={colors.textSecondary} className="mr-1" />
                      <Text className="text-xs font-bold uppercase tracking-widest" style={{ color: colors.textSecondary }}>
                        {habit.frequency}
                      </Text>
                    </View>
                  </View>
                ))}
              </>
            )}

            {/* Custom Habits Section */}
            {customHabits.length > 0 && (
              <>
                <Text className="text-xs font-semibold mt-4 mb-3 ml-5 uppercase" style={{ color: colors.textSecondary }}>MY HABITS</Text>
                {customHabits.map((habit: any) => (
                  <View
                    key={habit.id}
                    className="rounded-[28px] p-5 mb-4"
                    style={{
                      backgroundColor: colors.surface,
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.05,
                      shadowRadius: 15,
                      elevation: 4,
                    }}
                  >
                    <View className="flex-row justify-between items-start mb-4">
                      <View className="flex-1 mr-3">
                        <View
                          className="px-3 py-1 rounded-full self-start mb-2"
                          style={{ backgroundColor: CATEGORY_COLORS[habit.category as HabitCategory] + '15' }}
                        >
                          <Text className="text-[10px] font-black uppercase tracking-wider" style={{ color: CATEGORY_COLORS[habit.category as HabitCategory] }}>
                            {CATEGORIES.find(c => c.value === habit.category)?.emoji}{' '}
                            {habit.category.charAt(0).toUpperCase() + habit.category.slice(1)}
                          </Text>
                        </View>
                        <Text
                          className="text-xl font-black leading-7"
                          style={{ color: habit.isActive ? colors.text : colors.textSecondary }}
                        >
                          {habit.name}
                        </Text>
                      </View>

                      <TouchableOpacity
                        className="px-4 py-2 rounded-2xl"
                        style={{
                          backgroundColor: habit.isActive ? colors.primary : (isDarkMode ? '#374151' : '#F3F4F6'),
                          shadowColor: habit.isActive ? colors.primary : 'transparent',
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.2,
                          shadowRadius: 4,
                        }}
                        onPress={() => handleToggleActive(habit.id)}
                      >
                        <Text className="font-bold text-xs" style={{ color: habit.isActive ? 'white' : colors.textSecondary }}>
                          {habit.isActive ? 'ACTIVE' : 'INACTIVE'}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <View className="h-[1px] w-full mb-4 opacity-5" style={{ backgroundColor: colors.text }} />

                    <View className="flex-row justify-between items-center">
                      <View className="flex-row items-center">
                        <Ionicons name="repeat" size={14} color={colors.textSecondary} className="mr-1" />
                        <Text className="text-xs font-bold uppercase tracking-widest" style={{ color: colors.textSecondary }}>
                          {habit.frequency}
                        </Text>
                      </View>
                      <TouchableOpacity
                        className="bg-red-50 dark:bg-red-950/20 px-4 py-2 rounded-xl"
                        onPress={() => handleDeleteHabit(habit.id)}
                      >
                        <Text className="text-xs font-black uppercase tracking-wider" style={{ color: colors.error }}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </>
            )}
          </>
        )}
      </ScrollView>

      {/* Add Habit Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        statusBarTranslucent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <TouchableOpacity
            activeOpacity={1}
            style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}
            onPress={() => {
              Keyboard.dismiss();
              setShowModal(false);
            }}
          />
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1, justifyContent: 'flex-end' }}
          >
            <TouchableOpacity
              activeOpacity={1}
              onPress={(e) => e.stopPropagation()}
            >
              <View
                className="rounded-t-[40px] p-8 pb-10"
                style={{ backgroundColor: colors.surface }}
              >
                {/* Drag Handle */}
                <View className="w-16 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full self-center mb-8 opacity-50" />

                <Text className="text-3xl font-black text-center mb-2" style={{ color: colors.text }}>New Habit</Text>
                <Text className="text-sm text-center mb-8 font-medium" style={{ color: colors.textSecondary }}>Set a new goal for yourself</Text>

                <View className="mb-6">
                  <Text className="text-xs font-black uppercase tracking-widest mb-3 ml-1" style={{ color: colors.textSecondary }}>HABIT NAME</Text>
                  <TextInput
                    className="rounded-2xl p-5 text-lg font-bold"
                    style={{
                      backgroundColor: isDarkMode ? '#111827' : '#F8FAFC',
                      color: colors.text,
                      borderWidth: 1,
                      borderColor: isDarkMode ? '#374151' : '#E2E8F0',
                    }}
                    placeholder="e.g. Morning Prayer"
                    value={newHabitName}
                    onChangeText={setNewHabitName}
                    placeholderTextColor={colors.textSecondary}
                    autoFocus={true}
                  />
                </View>

                <View className="mb-8">
                  <Text className="text-xs font-black uppercase tracking-widest mb-4 ml-1" style={{ color: colors.textSecondary }}>SELECT CATEGORY</Text>
                  <View className="flex-row flex-wrap">
                    {CATEGORIES.map((cat) => (
                      <TouchableOpacity
                        key={cat.value}
                        className="rounded-2xl px-4 py-3 mr-2 mb-2 items-center justify-center flex-row border"
                        style={{
                          backgroundColor: newHabitCategory === cat.value ? CATEGORY_COLORS[cat.value] : (isDarkMode ? '#111827' : 'white'),
                          borderColor: newHabitCategory === cat.value ? CATEGORY_COLORS[cat.value] : (isDarkMode ? '#374151' : '#E2E8F0'),
                          shadowColor: newHabitCategory === cat.value ? CATEGORY_COLORS[cat.value] : 'transparent',
                          shadowOffset: { width: 0, height: 4 },
                          shadowOpacity: 0.2,
                          shadowRadius: 8,
                          elevation: newHabitCategory === cat.value ? 4 : 0,
                        }}
                        onPress={() => setNewHabitCategory(cat.value)}
                      >
                        <Text className="text-base mr-2">{cat.emoji}</Text>
                        <Text
                          className="text-[10px] font-black uppercase tracking-wider"
                          style={{ color: newHabitCategory === cat.value ? 'white' : colors.text }}
                        >
                          {cat.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View className="flex-row mt-4">
                  <TouchableOpacity
                    className="flex-1 py-5 rounded-[24px] mr-3 items-center justify-center border"
                    style={{
                      backgroundColor: isDarkMode ? 'transparent' : '#F1F5F9',
                      borderColor: isDarkMode ? '#374151' : 'transparent'
                    }}
                    onPress={() => {
                      setShowModal(false);
                      setNewHabitName('');
                      setNewHabitCategory('other');
                    }}
                  >
                    <Text className="text-base font-black uppercase tracking-widest" style={{ color: colors.textSecondary }}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="flex-1 py-5 rounded-[24px] items-center justify-center font-black"
                    style={{
                      backgroundColor: colors.primary,
                      shadowColor: colors.primary,
                      shadowOffset: { width: 0, height: 6 },
                      shadowOpacity: 0.3,
                      shadowRadius: 12,
                      elevation: 6,
                    }}
                    onPress={handleAddHabit}
                  >
                    <Text className="text-white text-base font-black uppercase tracking-widest">Create</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
}


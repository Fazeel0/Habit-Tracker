import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, Keyboard, KeyboardAvoidingView, Modal, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
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
        {/* Add Button */}
        <TouchableOpacity
          className="py-4 rounded-2xl items-center mb-6"
          onPress={() => setShowModal(true)}
          activeOpacity={0.8}
          style={{ 
            backgroundColor: colors.primary,
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 5,
          }}
        >
          <Text className="text-white text-base font-black uppercase tracking-wider">+ Add New Habit</Text>
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
                <Text className="text-xs font-semibold mb-3 uppercase" style={{ color: colors.textSecondary }}>DEFAULT HABITS</Text>
                {defaultHabits.map((habit: any) => (
                  <View
                    key={habit.id} 
                    className="rounded-2xl p-4 mb-4"
                    style={{ 
                      backgroundColor: colors.surface,
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.05,
                      shadowRadius: 10,
                      elevation: 3,
                    }}
                  >
                    <View className="flex-row justify-between items-center mb-3">
                      <View
                        className="px-3 py-1 rounded-lg"
                        style={{ backgroundColor: CATEGORY_COLORS[habit.category as HabitCategory] + '20' }}
                      >
                        <Text className="text-[10px] font-black uppercase tracking-wider" style={{ color: CATEGORY_COLORS[habit.category as HabitCategory] }}>
                          {CATEGORIES.find(c => c.value === habit.category)?.emoji}{' '}
                          {habit.category.charAt(0).toUpperCase() + habit.category.slice(1)}
                        </Text>
                      </View>
                      <TouchableOpacity
                        className="px-3 py-1 rounded-md"
                        style={{ backgroundColor: habit.isActive ? colors.primary : (isDarkMode ? '#4B5563' : '#9CA3AF') }}
                        onPress={() => handleToggleActive(habit.id)}
                      >
                        <Text className="text-white text-xs font-semibold">
                          {habit.isActive ? 'Active' : 'Inactive'}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <Text
                      className="text-lg font-semibold mb-2"
                      style={{ color: habit.isActive ? colors.text : colors.textSecondary }}
                    >
                      {habit.name}
                    </Text>

                    <View className="flex-row justify-between items-center">
                      <Text className="text-sm" style={{ color: colors.textSecondary }}>
                        {habit.frequency.charAt(0).toUpperCase() + habit.frequency.slice(1)}
                      </Text>
                    </View>
                  </View>
                ))}
              </>
            )}

            {/* Custom Habits Section */}
            {customHabits.length > 0 && (
              <>
                <Text className="text-xs font-semibold mt-4 mb-3 uppercase" style={{ color: colors.textSecondary }}>MY HABITS</Text>
                {customHabits.map((habit: any) => (
                  <View
                    key={habit.id}
                    className="rounded-2xl p-4 mb-4"
                    style={{ 
                      backgroundColor: colors.surface,
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.05,
                      shadowRadius: 10,
                      elevation: 3,
                    }}
                  >
                    <View className="flex-row justify-between items-center mb-3">
                      <View
                        className="px-3 py-1 rounded-lg"
                        style={{ backgroundColor: CATEGORY_COLORS[habit.category as HabitCategory] + '20' }}
                      >
                        <Text className="text-[10px] font-black uppercase tracking-wider" style={{ color: CATEGORY_COLORS[habit.category as HabitCategory] }}>
                          {CATEGORIES.find(c => c.value === habit.category)?.emoji}{' '}
                          {habit.category.charAt(0).toUpperCase() + habit.category.slice(1)}
                        </Text>
                      </View>
                      <TouchableOpacity
                        className="px-3 py-1 rounded-md"
                        style={{ backgroundColor: habit.isActive ? colors.primary : (isDarkMode ? '#4B5563' : '#9CA3AF') }}
                        onPress={() => handleToggleActive(habit.id)}
                      >
                        <Text className="text-white text-xs font-semibold">
                          {habit.isActive ? 'Active' : 'Inactive'}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <Text
                      className="text-lg font-semibold mb-2"
                      style={{ color: habit.isActive ? colors.text : colors.textSecondary }}
                    >
                      {habit.name}
                    </Text>

                    <View className="flex-row justify-between items-center">
                      <Text className="text-sm" style={{ color: colors.textSecondary }}>
                        {habit.frequency.charAt(0).toUpperCase() + habit.frequency.slice(1)}
                      </Text>
                      <TouchableOpacity
                        className="px-3 py-1.5"
                        onPress={() => handleDeleteHabit(habit.id)}
                      >
                        <Text className="text-sm font-semibold" style={{ color: colors.error }}>Delete</Text>
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
                className="rounded-t-3xl p-6"
                style={{ backgroundColor: colors.surface }}
              >
                <View className="w-12 h-1.5 bg-gray-300 rounded-full self-center opacity-50" style={{ marginBottom: 6 }} />

                <Text className="text-2xl font-bold text-center" style={{ color: colors.text, marginBottom: 10 }}>Add New Habit</Text>

                <TextInput
                  className="border-2 rounded-xl p-4 text-base mb-6"
                  style={{
                    borderColor: colors.border,
                    backgroundColor: isDarkMode ? '#111827' : '#F3F4F6',
                    color: colors.text,
                    marginBottom: 10,
                  }}
                  placeholder="Habit name"
                  value={newHabitName}
                  onChangeText={setNewHabitName}
                  placeholderTextColor={colors.textSecondary}
                  autoFocus={true}
                />

                <Text className="text-base font-semibold mb-2" style={{ color: colors.text, }}>Category</Text>
                <View className="flex-row flex-wrap mb-6">
                  {CATEGORIES.map((cat) => (
                    <TouchableOpacity
                      key={cat.value}
                      className="border-2 rounded-lg px-3 py-2 mr-2 mb-2"
                      style={{
                        backgroundColor: newHabitCategory === cat.value ? CATEGORY_COLORS[cat.value] : 'transparent',
                        borderColor: newHabitCategory === cat.value ? CATEGORY_COLORS[cat.value] : colors.border,

                      }}
                      onPress={() => setNewHabitCategory(cat.value)}
                    >
                      <Text
                        className="text-sm"
                        style={{ color: newHabitCategory === cat.value ? 'white' : colors.text }}
                      >
                        {cat.emoji} {cat.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View className="flex-row mb-2 mt-4">
                  <TouchableOpacity
                    className="flex-1 py-4 rounded-xl mr-2 "
                    style={{ backgroundColor: isDarkMode ? '#374151' : '#F3F4F6' }}
                    onPress={() => {
                      setShowModal(false);
                      setNewHabitName('');
                      setNewHabitCategory('other');
                    }}
                  >
                    <Text className="text-base font-semibold text-center" style={{ color: colors.textSecondary }}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="flex-1 py-4 rounded-xl ml-2"
                    style={{ backgroundColor: colors.primary }}
                    onPress={handleAddHabit}
                  >
                    <Text className="text-white text-base font-semibold text-center">Add Habit</Text>
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


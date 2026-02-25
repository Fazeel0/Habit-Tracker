import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Alert, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { PURGE } from 'redux-persist';
import { useAppTheme } from '../../hooks/useAppTheme';
import { logout, setGuest } from '../../redux/slice/authSlice';
import { toggleTheme } from '../../redux/slice/themeSlice';
import { setHijriAdjustment, setCalculationMethod } from '../../redux/slice/settingsSlice';
import { logOut } from '../../services/authService';
import { useUserStats } from '../../hooks/useUserStats';

const CALCULATION_METHODS = [
  { id: 1, name: 'Subcontinent (Karachi)' },
  { id: 2, name: 'ISNA (North America)' },
  { id: 3, name: 'Muslim World League' },
  { id: 4, name: 'Umm al-Qura (Makkah)' },
  { id: 5, name: 'Egyptian General Authority' },
];

export default function Profile() {
  const dispatch = useDispatch();
  const { user, isGuest } = useSelector((state: any) => state.auth);
  const { isDarkMode, colors } = useAppTheme();
  const { hijriAdjustment, calculationMethod } = useSelector((state: any) => state.settings);
  const { activeHabitsCount, totalPoints, currentStreak } = useUserStats();

  const handleLogout = () => {
    console.log('handleLogout called, isGuest:', isGuest);
    
    if (isGuest) {
      Alert.alert(
        'Sign In',
        'Sign in to your account to sync data across devices.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Go to Login',
            onPress: () => router.replace('/login'),
          },
        ]
      );
    } else {
      Alert.alert(
        'Sign Out',
        'Are you sure you want to sign out?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Sign Out',
            style: 'destructive',
            onPress: async () => {
              try {
                await logOut();
                // Clear Redux persist storage and reset all state
                dispatch({ type: PURGE, key: 'root' });
                dispatch(logout());
                router.replace('/login');
              } catch (error) {
                console.error('Error logging out:', error);
              }
            },
          },
        ]
      );
    }
  };

  const handleContinueAsGuest = () => {
    if (isGuest) {
      Alert.alert('Already Guest', 'You are currently in guest mode.');
      return;
    }

    Alert.alert(
      'Continue as Guest',
      'This will sign you out and continue as a guest. Your local data will be kept.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Continue',
          onPress: () => {
            // Clear persist and set guest mode
            dispatch({ type: PURGE, key: 'root' });
            dispatch(setGuest());
            router.replace('/(tabs)');
          },
        },
      ]
    );
  };

  const handleSwitchAccount = () => handleLogout();

  const insets = useSafeAreaInsets();

  const quranVerse = {
    text: "So remember Me; I will remember you.",
    surah: "Al-Baqarah 2:152"
  };

  const SettingItem = ({ icon, label, onPress, rightElement, color, isLast }: any) => (
    <TouchableOpacity
      className={`flex-row items-center py-4 ${!isLast ? 'border-b border-gray-100' : ''}`}
      style={!isLast ? { borderBottomColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' } : {}}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View 
        className="w-10 h-10 rounded-xl items-center justify-center mr-4"
        style={{ backgroundColor: color || (isDarkMode ? '#374151' : '#F3F4F6') }}
      >
        <Ionicons name={icon} size={20} color={color ? 'white' : colors.text} />
      </View>
      <Text className="flex-1 text-base font-semibold" style={{ color: colors.text }}>{label}</Text>
      {rightElement || <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />}
    </TouchableOpacity>
  );

  const handleToggleDarkMode = () => dispatch(toggleTheme());

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
            <Text className="text-3xl font-black text-white tracking-tighter">Profile</Text>
            <Text className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>Manage your journey</Text>
          </View>
        </View>
      </View>

      <ScrollView 
        className="flex-1" 
        contentContainerStyle={{ 
          paddingHorizontal: 20, 
          paddingTop: 20,
          paddingBottom: insets.bottom + 40 
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* User Card - Premium Glassmorphism-lite */}
        <View 
          className="mb-6 rounded-[32px] overflow-hidden" 
          style={{ 
            backgroundColor: colors.primary,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.2,
            shadowRadius: 15,
            elevation: 10,
          }}
        >
          <View className="p-6">
            {/* Background Decorations */}
            <View className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-20" style={{ backgroundColor: 'white' }} />
            <View className="absolute -bottom-5 -left-5 w-20 h-20 rounded-full opacity-10" style={{ backgroundColor: 'white' }} />

            <View className="flex-row items-center mb-6">
              <View 
                className="w-18 h-18 rounded-3xl items-center justify-center border-2 border-white/30"
                style={{ backgroundColor: 'rgba(255,255,255,0.2)', width: 72, height: 72 }}
              >
                <Ionicons name="person" size={36} color="white" />
              </View>
              <View className="ml-4 flex-1">
                <Text className="text-2xl font-bold text-white leading-tight">
                  {isGuest ? 'Blessed Abdullah' : (user?.displayName || 'Seeker')}
                </Text>
                <Text className="text-sm font-medium text-white/70">
                  {isGuest ? 'Join the community' : user?.email}
                </Text>
              </View>
              {isGuest && (
                <View className="bg-amber-400 px-3 py-1 rounded-full">
                  <Text className="text-[10px] font-black text-amber-900 uppercase">Guest</Text>
                </View>
              )}
            </View>

            {/* Quick Stats Row */}
            <View className="flex-row justify-between bg-black/10 rounded-2xl p-4 border border-white/5">
              <View className="items-center flex-1">
                <Text className="text-white text-lg font-black">{currentStreak}</Text>
                <Text className="text-white/60 text-[10px] font-bold uppercase tracking-wider">Streak</Text>
              </View>
              <View className="w-[1px] h-full bg-white/10" />
              <View className="items-center flex-1">
                <Text className="text-white text-lg font-black">{activeHabitsCount}</Text>
                <Text className="text-white/60 text-[10px] font-bold uppercase tracking-wider">Goals</Text>
              </View>
              <View className="w-[1px] h-full bg-white/10" />
              <View className="items-center flex-1">
                <Text className="text-white text-lg font-black">{totalPoints}</Text>
                <Text className="text-white/60 text-[10px] font-bold uppercase tracking-wider">Milestones</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Spiritual Motivation Card - Moved up */}
        <View className="mb-8 rounded-[28px] p-6 border-l-4" style={{ backgroundColor: colors.surface, borderLeftColor: colors.primary }}>
          <Ionicons name="chatbubble-ellipses" size={24} color={colors.primary} className="mb-3 opacity-30" />
          <Text className="text-lg italic font-medium leading-7 mb-3" style={{ color: colors.text }}>"{quranVerse.text}"</Text>
          <Text className="text-xs font-black uppercase tracking-widest text-right" style={{ color: colors.primary }}>— {quranVerse.surah}</Text>
        </View>

        {/* Settings Sections */}
        <View className="mb-6">
          <Text className="text-xs font-black uppercase mb-3 ml-2 tracking-widest" style={{ color: colors.textSecondary }}>Account</Text>
          <View 
            className="rounded-[28px] px-5 shadow-sm" 
            style={{ 
              backgroundColor: colors.surface,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 10,
              elevation: 3,
            }}
          >
            {isGuest ? (
              <SettingItem 
                icon="log-in" 
                label="Sign In" 
                onPress={handleLogout}
              />
            ) : (
              <SettingItem 
                icon="swap-horizontal" 
                label="Switch Account" 
                onPress={handleSwitchAccount}
              />
            )}
            <SettingItem 
              icon="person-circle" 
              label={isGuest ? "Stay as Guest" : "Continue as Guest"} 
              onPress={handleContinueAsGuest}
              isLast={true}
            />
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-xs font-black uppercase mb-3 ml-2 tracking-widest" style={{ color: colors.textSecondary }}>Preferences</Text>
          <View 
            className="rounded-[28px] px-5 shadow-sm" 
            style={{ 
              backgroundColor: colors.surface,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 10,
              elevation: 3,
            }}
          >
            <SettingItem 
              icon={isDarkMode ? "sunny" : "moon"} 
              label="Appearance" 
              onPress={handleToggleDarkMode}
              rightElement={
                <View 
                  className="w-11 h-6 rounded-full justify-center px-0.5" 
                  style={{ backgroundColor: isDarkMode ? colors.primary : (isDarkMode ? '#374151' : '#E5E7EB') }}
                >
                  <View 
                    className="w-5 h-5 rounded-full bg-white shadow-sm" 
                    style={{ marginLeft: isDarkMode ? 20 : 0 }} 
                  />
                </View>
              }
            />
            <SettingItem 
              icon="notifications" 
              label="Notifications" 
              onPress={() => Alert.alert('Coming Soon', 'Notification settings are arriving soon!')}
            />
            <SettingItem 
              icon="calendar" 
              label="Hijri Adjustment" 
              onPress={() => {
                Alert.alert(
                  'Adjust Hijri Date',
                  'Select an adjustment if the moon sighting differs in your region.',
                  [
                    { text: '-1 Day', onPress: () => dispatch(setHijriAdjustment(-1)) },
                    { text: '0 (Default)', onPress: () => dispatch(setHijriAdjustment(0)) },
                    { text: '+1 Day', onPress: () => dispatch(setHijriAdjustment(1)) },
                    { text: 'Cancel', style: 'cancel' }
                  ]
                );
              }}
              rightElement={
                <Text className="font-bold" style={{ color: colors.primary }}>
                  {hijriAdjustment > 0 ? `+${hijriAdjustment}` : hijriAdjustment} Day
                </Text>
              }
            />
            <SettingItem 
              icon="options" 
              label="Calculation Method" 
              onPress={() => {
                const options = CALCULATION_METHODS.map(m => ({
                  text: m.name,
                  onPress: () => dispatch(setCalculationMethod(m.id))
                }));
                Alert.alert('Calculation Method', 'Select the method used in your region.', [...options, { text: 'Cancel', style: 'cancel' }]);
              }}
              isLast={true}
              rightElement={
                <Text className="font-bold text-xs" style={{ color: colors.primary }}>
                  {CALCULATION_METHODS.find(m => m.id === calculationMethod)?.name.split(' ')[0]}
                </Text>
              }
            />
          </View>
        </View>

        <View className="mb-8">
          <Text className="text-xs font-black uppercase mb-3 ml-2 tracking-widest" style={{ color: colors.textSecondary }}>Support</Text>
          <View 
            className="rounded-[28px] px-5 shadow-sm" 
            style={{ 
              backgroundColor: colors.surface,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 10,
              elevation: 3,
            }}
          >
            <SettingItem icon="information-circle" label="About App" onPress={() => {}} />
            <SettingItem icon="help-circle" label="Help Center" onPress={() => {}} isLast={true} />
          </View>
        </View>

        {/* Sign Out Button */}
        {!isGuest && (
          <TouchableOpacity 
            className="p-5 rounded-2xl items-center border border-red-100 mb-8"
            style={{ backgroundColor: isDarkMode ? '#2D1616' : '#FFF5F5', borderColor: isDarkMode ? '#451D1D' : '#FEE2E2' }}
            onPress={handleLogout}
          >
            <Text className="font-bold text-red-500">Sign Out from Device</Text>
          </TouchableOpacity>
        )}

        {/* Footer */}
        <View className="items-center pb-10">
          <Text className="text-[10px] font-black opacity-30 tracking-[4px] mb-1" style={{ color: colors.text }}>V1.0.0</Text>
          <Text className="text-[10px] font-bold opacity-20" style={{ color: colors.text }}>MADE WITH ❤️ FOR THE UMMAH</Text>
        </View>
      </ScrollView>
    </View>
  );
}

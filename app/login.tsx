import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useDispatch } from 'react-redux';
import { MaterialIcons } from '@expo/vector-icons';
import { signIn, signUp } from '../services/authService';
import { login, setGuest } from '../redux/slice/authSlice';
import { useAppTheme } from '../hooks/useAppTheme';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const dispatch = useDispatch();
  const { isDarkMode, colors } = useAppTheme();

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        const result = await signUp(email, password);
        if (result.success && result.user) {
          dispatch(login({
            user: {
              uid: result.user.uid,
              email: result.user.email || email,
              displayName: result.user.displayName || '',
            },
            token: await result.user.getIdToken(),
          }));
          router.replace('/(tabs)');
        } else {
          setError(result.error || 'Failed to create account');
        }
      } else {
        const result = await signIn(email, password);
        if (result.success && result.user) {
          dispatch(login({
            user: {
              uid: result.user.uid,
              email: result.user.email || email,
              displayName: result.user.displayName || '',
            },
            token: await result.user.getIdToken(),
          }));
          router.replace('/(tabs)');
        } else {
          setError(result.error || 'Failed to sign in');
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestMode = () => {
    dispatch(setGuest());
    router.replace('/(tabs)');
  };

  // Dynamic styles using inline styles
  const containerStyle = {
    flex: 1,
    backgroundColor: colors.primary,
  };

  const surfaceStyle = {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 24,
  };

  const inputStyle = {
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: isDarkMode ? '#111827' : '#F9FAFB',
    color: colors.text,
  };

  const labelStyle = {
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 8,
    color: colors.text,
  };

  const buttonStyle = {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center' as const,
    marginTop: 8,
    opacity: loading ? 0.7 : 1,
  };

  const dividerStyle = {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  };

  const guestButtonStyle = {
    backgroundColor: isDarkMode ? '#374151' : '#F3F4F6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center' as const,
  };

  const textStyle = {
    color: colors.text,
    fontWeight: '600' as const,
  };

  const secondaryTextStyle = {
    color: colors.textSecondary,
  };

  const errorStyle = {
    backgroundColor: isDarkMode ? '#7F1D1D' : '#FEF2F2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  };

  const errorTextStyle = {
    color: colors.error,
    fontSize: 14,
    textAlign: 'center' as const,
  };

  return (
    <KeyboardAvoidingView 
      style={containerStyle}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        <View style={{ paddingHorizontal: 24 }}>
          {/* Header */}
          <View style={{ alignItems: 'center', marginBottom: 40 }}>
            <MaterialIcons name="assignment" size={64} color="white" />
            <Text style={{ fontSize: 28, fontWeight: 'bold' as const, color: 'white', textAlign: 'center', marginTop: 16, marginBottom: 8 }}>Habit Tracker</Text>
            <Text style={{ fontSize: 18, color: 'rgba(255,255,255,0.9)', marginBottom: 8 }}>
              {isSignUp ? 'Create your account' : 'Welcome back!'}
            </Text>
            <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>
              Track your daily habits
            </Text>
          </View>

          {/* Form */}
          <View style={surfaceStyle}>
            <View style={{ marginBottom: 20 }}>
              <Text style={labelStyle}>Email</Text>
              <TextInput
                style={inputStyle}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={{ marginBottom: 20 }}>
              <Text style={labelStyle}>Password</Text>
              <TextInput
                style={inputStyle}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                secureTextEntry
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            {/* Error Message */}
            {error ? (
              <View style={errorStyle}>
                <Text style={errorTextStyle}>{error}</Text>
              </View>
            ) : null}

            {/* Submit Button */}
            <TouchableOpacity 
              style={buttonStyle}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
                {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
              </Text>
            </TouchableOpacity>

            {/* Toggle Sign In/Sign Up */}
            <TouchableOpacity 
              style={{ marginTop: 16, alignItems: 'center' }}
              onPress={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
            >
              <Text style={{ color: colors.primary, fontSize: 16, fontWeight: '600' as const }}>
                {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
              </Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 24, marginBottom: 16 }}>
              <View style={dividerStyle} />
              <Text style={[secondaryTextStyle, { marginHorizontal: 16, fontSize: 14 }]}>OR</Text>
              <View style={dividerStyle} />
            </View>

            {/* Continue as Guest */}
            <TouchableOpacity 
              style={guestButtonStyle}
              onPress={handleGuestMode}
            >
              <Text style={[textStyle, { fontSize: 16, fontWeight: '600' }]}>
                Continue as Guest
              </Text>
            </TouchableOpacity>
            
            <Text style={[secondaryTextStyle, { fontSize: 12, textAlign: 'center', marginTop: 12 }]}>
              Guest data is stored locally. Sign up to sync across devices.
            </Text>

            {/* Footer */}
            <View style={{ alignItems: 'center', marginTop: 32, paddingBottom: 20 }}>
              <Text style={[secondaryTextStyle, { fontSize: 14, fontWeight: '600' }]}>v1.0.0</Text>
              <Text style={[secondaryTextStyle, { fontSize: 12, marginTop: 4 }]}>Created by Hamzah</Text>
              <Text style={[secondaryTextStyle, { fontSize: 12, marginTop: 4 }]}>© 2026 - Habit Tracking System</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

import { useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
   Image,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { Colors } from '../../constants/colors';
import { useAuth } from '../../hooks/useAuth';
import { Fonts } from '../../constants/fonts';

export default function LoginScreen() {
  const { login } = useAuth();

  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const handleLogin = async () => {
    if (!email.trim()) {
      Alert.alert(
        'Email required',
        'Please enter your email address.'
      );

      return;
    }

    if (!password) {
      Alert.alert(
        'Password required',
        'Please enter your password.'
      );

      return;
    }

    try {
      setLoading(true);

      await login({
        email: email.trim(),
        password,
      });

      router.replace(
        '/(app)/dashboard'
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to login.';

      Alert.alert(
        'Login failed',
        message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }
      >
        <ScrollView
          contentContainerStyle={
            styles.scrollContent
          }
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.logo}>
              <Text style={styles.logoMain}></Text>
              <Text style={styles.logoPlus}></Text>
            </View>

            <View style={styles.logoContainer}>
            <Image
              source={require('../../../assets/images/mefthe-logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

            <Text style={styles.welcome}>
              Welcome back
            </Text>

            <Text style={styles.description}>
              Sign in to access your
              workspace.
            </Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>
              Email address
            </Text>

            <View style={styles.inputContainer}>
              <Ionicons
                name="mail-outline"
                size={20}
                color={Colors.textSecondary}
              />

              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="name@company.com"
                placeholderTextColor={
                  Colors.textMuted
                }
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
                style={styles.input}
              />
            </View>

            <Text style={[
              styles.label,
              styles.passwordLabel,
            ]}>
              Password
            </Text>

            <View style={styles.inputContainer}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={Colors.textSecondary}
              />

              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter password"
                placeholderTextColor={
                  Colors.textMuted
                }
                secureTextEntry={!showPassword}
                editable={!loading}
                style={styles.input}
              />

              <Pressable
                onPress={() =>
                  setShowPassword(
                    (current) => !current
                  )
                }
                hitSlop={10}
              >
                <Ionicons
                  name={
                    showPassword
                      ? 'eye-off-outline'
                      : 'eye-outline'
                  }
                  size={21}
                  color={
                    Colors.textSecondary
                  }
                />
              </Pressable>
            </View>

            <Pressable
              onPress={handleLogin}
              disabled={loading}
              style={({ pressed }) => [
                styles.loginButton,
                pressed &&
                  !loading &&
                  styles.loginButtonPressed,

                loading &&
                  styles.loginButtonDisabled,
              ]}
            >
              {loading ? (
                <ActivityIndicator
                  color={Colors.white}
                />
              ) : (
                <>
                  <Text
                    style={
                      styles.loginButtonText
                    }
                  >
                    Sign In
                  </Text>

                  <Ionicons
                    name="arrow-forward"
                    size={20}
                    color={Colors.white}
                  />
                </>
              )}
            </Pressable>
          </View>

          <View style={styles.footer}>
            <Ionicons
              name="shield-checkmark-outline"
              size={16}
              color={Colors.textSecondary}
            />

            <Text style={styles.footerText}>
              Secure access to Mefthe+
            </Text>
          </View>

          <Text style={styles.version}>
            Mefthe+ Mobile
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  keyboardView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 55,
    paddingBottom: 30,
  },

  header: {
    alignItems: 'center',
  },

  
logoContainer: {
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
},

logoImage: {
  width: 300,
  height: 145,
},


welcome: {
  marginTop: 38,
  fontSize: 26,
  fontFamily: Fonts.extraBold,
  color: Colors.text,
},
description: {
  marginTop: 7,
  fontSize: 14,
  fontFamily: Fonts.regular,
  color: Colors.textSecondary,
},

label: {
  marginBottom: 8,
  fontSize: 13,
  fontFamily: Fonts.semiBold,
  color: Colors.text,
},
input: {
  flex: 1,
  height: '100%',
  marginLeft: 12,
  color: Colors.text,
  fontSize: 15,
  fontFamily: Fonts.regular,
},

loginButtonText: {
  color: Colors.white,
  fontSize: 15,
  fontFamily: Fonts.bold,
},

  logoText: {
    color: Colors.white,
    fontSize: 38,
    fontWeight: '800',
  },

  brand: {
    marginTop: 18,
    fontSize: 27,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: Colors.text,
  },

  erp: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
    letterSpacing: 1,
  },

  welcome: {
    marginTop: 38,
    fontSize: 25,
    fontWeight: '700',
    color: Colors.text,
  },

  description: {
    marginTop: 7,
    fontSize: 15,
    color: Colors.textSecondary,
  },

  form: {
    marginTop: 36,
  },

  label: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },

  passwordLabel: {
    marginTop: 20,
  },

  inputContainer: {
    height: 56,
    paddingHorizontal: 16,

    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: Colors.surface,

    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
  },

  input: {
    flex: 1,
    height: '100%',
    marginLeft: 12,

    color: Colors.text,
    fontSize: 16,
  },

  loginButton: {
    height: 56,
    marginTop: 30,

    borderRadius: 16,

    backgroundColor: Colors.primary,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    gap: 10,

    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },

  loginButtonPressed: {
    backgroundColor: Colors.primaryDark,
    transform: [
      {
        scale: 0.99,
      },
    ],
  },

  loginButtonDisabled: {
    opacity: 0.7,
  },

  loginButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
  },

  footer: {
    marginTop: 'auto',
    paddingTop: 50,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    gap: 6,
  },

  footerText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },

  version: {
    marginTop: 8,
    textAlign: 'center',
    fontSize: 11,
    color: Colors.textMuted,
  },
});
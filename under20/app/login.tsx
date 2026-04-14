import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { C } from '@/constants/theme';
import { authStyles } from '@/constants/authStyles';
import { useAuth } from '@/context/AuthContext';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    setError(null);
    const err = await signIn(email.trim(), password);
    setLoading(false);
    if (err) setError(err);
  };

  return (
    <SafeAreaView style={authStyles.container}>
      <KeyboardAvoidingView
        style={authStyles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

        <View style={styles.content}>

          <View style={authStyles.hero}>
            <Image
              source={require('@/assets/images/under20icon.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={authStyles.welcome}>Welcome back</Text>
            <Text style={authStyles.title}>Sign in to Under 20</Text>
            <Text style={authStyles.subtitle}>Decide Faster. Cook Sooner. Eat Better.</Text>
          </View>

          <View style={authStyles.card}>
            <View style={authStyles.field}>
              <Text style={authStyles.label}>Email</Text>
              <View style={authStyles.inputWrap}>
                <Ionicons name="mail-outline" size={17} color={C.gray} />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="you@example.com"
                  placeholderTextColor={C.gray}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  style={authStyles.input}
                />
              </View>
            </View>

            <View style={authStyles.field}>
              <View style={styles.labelRow}>
                <Text style={authStyles.label}>Password</Text>
                <Pressable hitSlop={8}>
                  <Text style={styles.forgot}>Forgot password?</Text>
                </Pressable>
              </View>
              <View style={authStyles.inputWrap}>
                <Ionicons name="lock-closed-outline" size={17} color={C.gray} />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  placeholderTextColor={C.gray}
                  secureTextEntry={!showPassword}
                  style={authStyles.input}
                />
                <Pressable onPress={() => setShowPassword(p => !p)} hitSlop={8}>
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={17}
                    color={C.gray}
                  />
                </Pressable>
              </View>
            </View>

            {error && <Text style={authStyles.errorText}>{error}</Text>}

            <Pressable
              style={({ pressed }) => [authStyles.button, pressed && authStyles.buttonPressed]}
              onPress={handleSubmit}
              disabled={loading}>
              {loading
                ? <ActivityIndicator color={C.white} />
                : <Text style={authStyles.buttonText}>Sign In</Text>
              }
            </Pressable>
          </View>

          <View style={authStyles.footer}>
            <Text style={authStyles.footerText}>Don't have an account? </Text>
            <Pressable hitSlop={8} onPress={() => router.push('/signup')}>
              <Text style={authStyles.footerLink}>Sign up</Text>
            </Pressable>
          </View>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
    gap: 28,
  },
  logo: {
    width: 110,
    height: 110,
    marginBottom: 8,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  forgot: {
    fontSize: 13,
    fontWeight: '600',
    color: C.medGreen,
  },
});

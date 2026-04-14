import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { C } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';

const COOKING_LEVELS = [
  { key: 'beginner',     label: 'Beginner',      icon: 'leaf-outline',       desc: 'Just starting out' },
  { key: 'home_cook',    label: 'Home Cook',      icon: 'home-outline',       desc: 'Comfortable in the kitchen' },
  { key: 'advanced',     label: 'Advanced',       icon: 'flame-outline',      desc: 'Love to experiment' },
  { key: 'chef',         label: 'Chef Level',     icon: 'restaurant-outline', desc: 'Culinary pro' },
] as const;

type CookingLevel = typeof COOKING_LEVELS[number]['key'];

export default function SignUpScreen() {
  const { signUp } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [cookingLevel, setCookingLevel] = useState<CookingLevel>('home_cook');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    setError(null);
    const err = await signUp(email.trim(), password, name.trim(), cookingLevel);
    setLoading(false);
    if (err) setError(err);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">

          {/* Back button */}
          <Pressable onPress={() => router.back()} style={styles.back} hitSlop={8}>
            <Ionicons name="arrow-back" size={20} color={C.text} />
          </Pressable>

          {/* Logo + heading */}
          <View style={styles.hero}>
            <Image
              source={require('@/assets/images/under20icon.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.welcome}>Get started</Text>
            <Text style={styles.title}>Create your account</Text>
            <Text style={styles.subtitle}>Decide Faster. Cook Sooner. Eat Better.</Text>
          </View>

          {/* Form card */}
          <View style={styles.card}>

            {/* Name */}
            <View style={styles.field}>
              <Text style={styles.label}>Name</Text>
              <View style={styles.inputWrap}>
                <Ionicons name="person-outline" size={17} color={C.gray} />
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Your name"
                  placeholderTextColor={C.gray}
                  autoCapitalize="words"
                  style={styles.input}
                />
              </View>
            </View>

            {/* Email */}
            <View style={styles.field}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputWrap}>
                <Ionicons name="mail-outline" size={17} color={C.gray} />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="you@example.com"
                  placeholderTextColor={C.gray}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  style={styles.input}
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.field}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrap}>
                <Ionicons name="lock-closed-outline" size={17} color={C.gray} />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="At least 6 characters"
                  placeholderTextColor={C.gray}
                  secureTextEntry={!showPassword}
                  style={styles.input}
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

            {/* Cooking level */}
            <View style={styles.field}>
              <Text style={styles.label}>Cooking Level</Text>
              <View style={styles.levelGrid}>
                {COOKING_LEVELS.map(level => {
                  const selected = cookingLevel === level.key;
                  return (
                    <TouchableOpacity
                      key={level.key}
                      style={[styles.levelCard, selected && styles.levelCardSelected]}
                      onPress={() => setCookingLevel(level.key)}
                      activeOpacity={0.8}>
                      <Ionicons
                        name={level.icon as any}
                        size={22}
                        color={selected ? C.medGreen : C.gray}
                      />
                      <Text style={[styles.levelLabel, selected && styles.levelLabelSelected]}>
                        {level.label}
                      </Text>
                      <Text style={styles.levelDesc}>{level.desc}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}

            <Pressable
              style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
              onPress={handleSignUp}
              disabled={loading}>
              {loading
                ? <ActivityIndicator color={C.white} />
                : <Text style={styles.buttonText}>Create Account</Text>
              }
            </Pressable>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Pressable hitSlop={8} onPress={() => router.back()}>
              <Text style={styles.footerLink}>Sign in</Text>
            </Pressable>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.cream,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: 28,
    paddingBottom: 40,
    gap: 28,
  },
  back: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  hero: {
    alignItems: 'center',
    gap: 6,
  },
  logo: {
    width: 90,
    height: 90,
    marginBottom: 6,
  },
  welcome: {
    fontSize: 13,
    fontWeight: '700',
    color: C.salmon,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: C.darkGreen,
    textAlign: 'center',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 14,
    color: C.gray,
    textAlign: 'center',
    lineHeight: 20,
  },
  card: {
    backgroundColor: C.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.border,
    padding: 20,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  field: {
    gap: 7,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: C.text,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.cream,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: C.text,
    padding: 0,
  },
  levelGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  levelCard: {
    width: '47%',
    backgroundColor: C.cream,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.border,
    padding: 12,
    gap: 4,
    alignItems: 'flex-start',
  },
  levelCardSelected: {
    borderColor: C.medGreen,
    backgroundColor: '#ECFDF5',
  },
  levelLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: C.text,
  },
  levelLabelSelected: {
    color: C.darkGreen,
  },
  levelDesc: {
    fontSize: 11,
    color: C.gray,
  },
  errorText: {
    fontSize: 13,
    color: C.salmon,
    textAlign: 'center',
  },
  button: {
    backgroundColor: C.darkGreen,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 2,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '800',
    color: C.white,
    letterSpacing: 0.3,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: C.gray,
  },
  footerLink: {
    fontSize: 14,
    fontWeight: '700',
    color: C.darkGreen,
  },
});

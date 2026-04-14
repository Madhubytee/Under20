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
import { authStyles } from '@/constants/authStyles';
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
    <SafeAreaView style={authStyles.container}>
      <KeyboardAvoidingView
        style={authStyles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">

          <Pressable onPress={() => router.back()} style={styles.back} hitSlop={8}>
            <Ionicons name="arrow-back" size={20} color={C.text} />
          </Pressable>

          <View style={authStyles.hero}>
            <Image
              source={require('@/assets/images/under20icon.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={authStyles.welcome}>Get started</Text>
            <Text style={authStyles.title}>Create your account</Text>
            <Text style={authStyles.subtitle}>Decide Faster. Cook Sooner. Eat Better.</Text>
          </View>

          <View style={authStyles.card}>

            <View style={authStyles.field}>
              <Text style={authStyles.label}>Name</Text>
              <View style={authStyles.inputWrap}>
                <Ionicons name="person-outline" size={17} color={C.gray} />
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Your name"
                  placeholderTextColor={C.gray}
                  autoCapitalize="words"
                  style={authStyles.input}
                />
              </View>
            </View>

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
              <Text style={authStyles.label}>Password</Text>
              <View style={authStyles.inputWrap}>
                <Ionicons name="lock-closed-outline" size={17} color={C.gray} />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="At least 6 characters"
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

            <View style={authStyles.field}>
              <Text style={authStyles.label}>Cooking Level</Text>
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

            {error && <Text style={authStyles.errorText}>{error}</Text>}

            <Pressable
              style={({ pressed }) => [authStyles.button, pressed && authStyles.buttonPressed]}
              onPress={handleSignUp}
              disabled={loading}>
              {loading
                ? <ActivityIndicator color={C.white} />
                : <Text style={authStyles.buttonText}>Create Account</Text>
              }
            </Pressable>
          </View>

          <View style={authStyles.footer}>
            <Text style={authStyles.footerText}>Already have an account? </Text>
            <Pressable hitSlop={8} onPress={() => router.back()}>
              <Text style={authStyles.footerLink}>Sign in</Text>
            </Pressable>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: 28,
    paddingBottom: 40,
    gap: 28,
  },
  back: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  logo: {
    width: 90,
    height: 90,
    marginBottom: 6,
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
});

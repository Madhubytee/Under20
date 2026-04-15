import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useFavorites } from '@/context/FavoritesContext';
import { usePantry } from '@/context/PantryContext';
import { useGroceryList } from '@/context/GroceryListContext';
import { C } from '@/constants/theme';

const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced'] as const;
type SkillLevel = typeof SKILL_LEVELS[number];

const DIETARY_OPTIONS = [
  { key: 'vegetarian', label: 'Vegetarian', icon: 'leaf-outline' },
  { key: 'vegan', label: 'Vegan', icon: 'flower-outline' },
  { key: 'glutenFree', label: 'Gluten-Free', icon: 'ban-outline' },
  { key: 'dairyFree', label: 'Dairy-Free', icon: 'water-outline' },
] as const;

type DietKey = typeof DIETARY_OPTIONS[number]['key'];

function SectionLabel({ title }: { title: string }) {
  return <Text style={styles.sectionLabel}>{title}</Text>;
}

function SettingsRow({
  icon,
  label,
  right,
  onPress,
  last,
}: {
  icon: string;
  label: string;
  right?: React.ReactNode;
  onPress?: () => void;
  last?: boolean;
}) {
  return (
    <TouchableOpacity
      style={[styles.row, last && styles.rowLast]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}>
      <View style={styles.rowLeft}>
        <View style={styles.rowIconWrap}>
          <Ionicons name={icon as any} size={17} color={C.darkGreen} />
        </View>
        <Text style={styles.rowLabel}>{label}</Text>
      </View>
      {right !== undefined
        ? right
        : <Ionicons name="chevron-forward" size={16} color={C.border} />}
    </TouchableOpacity>
  );
}

export default function AccountScreen() {
  const router = useRouter();
  const { favorites } = useFavorites();
  const { pantry } = usePantry();
  const { groceryList } = useGroceryList();

  const [skillLevel, setSkillLevel] = React.useState<SkillLevel>('Beginner');
  const [dietary, setDietary] = React.useState<Record<DietKey, boolean>>({
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    dairyFree: false,
  });
  const [notifications, setNotifications] = React.useState(true);
  const [weeklyDigest, setWeeklyDigest] = React.useState(false);

  const toggleDiet = (key: DietKey) =>
    setDietary(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}>

        {/* Avatar card */}
        <View style={styles.avatarCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>S</Text>
          </View>
          <View style={styles.avatarInfo}>
            <Text style={styles.userName}>SWE Student</Text>
            <Text style={styles.userEmail}>gators@example.com</Text>
          </View>
          <TouchableOpacity style={styles.editBtn} activeOpacity={0.7}>
            <Ionicons name="pencil-outline" size={16} color={C.medGreen} />
          </TouchableOpacity>
      
        </View>

        {/* Stats */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{favorites.length}</Text>
            <Text style={styles.statLabel}>Saved</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{pantry.length}</Text>
            <Text style={styles.statLabel}>Pantry items</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{groceryList.length}</Text>
            <Text style={styles.statLabel}>To buy</Text>
          </View>
        </View>

        {/* Cooking level */}
        <SectionLabel title="Cooking Level" />
        <View style={styles.card}>
          <View style={styles.skillRow}>
            {SKILL_LEVELS.map(level => (
              <TouchableOpacity
                key={level}
                style={[styles.skillBtn, skillLevel === level && styles.skillBtnActive]}
                onPress={() => setSkillLevel(level)}>
                <Text style={[styles.skillBtnText, skillLevel === level && styles.skillBtnTextActive]}>
                  {level}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Dietary preferences */}
        <SectionLabel title="Dietary Preferences" />
        <View style={styles.card}>
          {DIETARY_OPTIONS.map((opt, i) => (
            <SettingsRow
              key={opt.key}
              icon={opt.icon}
              label={opt.label}
              last={i === DIETARY_OPTIONS.length - 1}
              right={
                <Switch
                  value={dietary[opt.key]}
                  onValueChange={() => toggleDiet(opt.key)}
                  trackColor={{ false: C.border, true: C.medGreen }}
                  thumbColor={C.white}
                />
              }
            />
          ))}
        </View>

        {/* Notifications */}
        <SectionLabel title="Notifications" />
        <View style={styles.card}>
          <SettingsRow
            icon="notifications-outline"
            label="Push notifications"
            right={
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: C.border, true: C.medGreen }}
                thumbColor={C.white}
              />
            }
          />
          <SettingsRow
            icon="mail-outline"
            label="Weekly recipe digest"
            last
            right={
              <Switch
                value={weeklyDigest}
                onValueChange={setWeeklyDigest}
                trackColor={{ false: C.border, true: C.medGreen }}
                thumbColor={C.white}
              />
            }
          />
        </View>

        {/* Account */}
        <SectionLabel title="Account" />
        <View style={styles.card}>
          <SettingsRow icon="person-outline" label="Edit profile" onPress={() => {}} />
          <SettingsRow icon="lock-closed-outline" label="Change password" onPress={() => {}} />
          <SettingsRow
            icon="shield-checkmark-outline"
            label="Privacy policy"
            last
            onPress={() => {}}
          />
        </View>

        {/* About */}
        <SectionLabel title="About" />
        <View style={styles.card}>
          <SettingsRow icon="star-outline" label="Rate Under 20" onPress={() => {}} />
          <SettingsRow icon="chatbubble-outline" label="Send feedback" onPress={() => {}} />
          <SettingsRow
            icon="information-circle-outline"
            label="App version"
            last
            right={<Text style={styles.versionText}>1.0.0</Text>}
          />
        </View>

        {/* Sign out */}
        <TouchableOpacity
          style={styles.signOutBtn}
          onPress={() => router.replace('/')}
          activeOpacity={0.8}>
          <Ionicons name="log-out-outline" size={18} color={C.salmon} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>made with love · under 20 min</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.cream,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    backgroundColor: C.cream,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: C.text,
    letterSpacing: -0.5,
  },
  scroll: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },

  // Avatar
  avatarCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: C.border,
    gap: 14,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: C.darkGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: C.white,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 1,
  },
  avatarInfo: {
    flex: 1,
    gap: 3,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: C.text,
  },
  userEmail: {
    fontSize: 13,
    color: C.gray,
  },
  editBtn: {
    padding: 6,
  },

  // Stats
  statsCard: {
    flexDirection: 'row',
    backgroundColor: C.white,
    borderRadius: 16,
    paddingVertical: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: C.border,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  statNum: {
    fontSize: 22,
    fontWeight: '800',
    color: C.darkGreen,
  },
  statLabel: {
    fontSize: 11,
    color: C.gray,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    backgroundColor: C.border,
    marginVertical: 4,
  },

  // Section label
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: C.gray,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginLeft: 4,
  },

  // Card
  card: {
    backgroundColor: C.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.border,
    marginBottom: 24,
    overflow: 'hidden',
  },

  // Row
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: C.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    fontSize: 14,
    color: C.text,
    fontWeight: '500',
  },

  // Skill level
  skillRow: {
    flexDirection: 'row',
    padding: 10,
    gap: 8,
  },
  skillBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: C.lightGray,
    borderWidth: 1,
    borderColor: C.border,
  },
  skillBtnActive: {
    backgroundColor: C.darkGreen,
    borderColor: C.darkGreen,
  },
  skillBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: C.gray,
  },
  skillBtnTextActive: {
    color: C.white,
  },

  // Version text
  versionText: {
    fontSize: 13,
    color: C.gray,
  },

  // Sign out
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: C.white,
    borderRadius: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#FECACA',
    marginBottom: 20,
  },
  signOutText: {
    fontSize: 15,
    fontWeight: '700',
    color: C.salmon,
  },

  // Footer
  footer: {
    textAlign: 'center',
    fontSize: 12,
    color: C.gray,
    fontStyle: 'italic',
  },
});

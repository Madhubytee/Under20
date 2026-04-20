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
import { useAuth } from '@/context/AuthContext';
import { useDietary } from '@/context/DietaryContext';
import { C } from '@/constants/theme';

const COOKING_LEVELS = [
  { key: 'beginner',  label: 'Beginner'  },
  { key: 'home_cook', label: 'Home Cook' },
  { key: 'advanced',  label: 'Advanced'  },
  { key: 'chef',      label: 'Chef'      },
] as const;

type CookingLevelKey = typeof COOKING_LEVELS[number]['key'];

const DIETARY_OPTIONS = [
  { key: 'vegetarian', label: 'Vegetarian', icon: 'leaf-outline' },
  { key: 'vegan',      label: 'Vegan',      icon: 'flower-outline' },
  { key: 'glutenFree', label: 'Gluten-Free', icon: 'ban-outline' },
  { key: 'dairyFree',  label: 'Dairy-Free',  icon: 'water-outline' },
] as const;

type DietKey = typeof DIETARY_OPTIONS[number]['key'];

function SectionLabel({ title }: { title: string }) {
  return <Text style={styles.sectionLabel}>{title}</Text>;
}

function SettingsRow({
  icon, label, right, onPress, last,
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
  const { session, signOut, updateProfile } = useAuth();
  const router = useRouter();
  const { favorites } = useFavorites();
  const { pantry } = usePantry();
  const { groceryList } = useGroceryList();

  const metadata = session?.user?.user_metadata ?? {};
  const name: string = metadata.name ?? '';
  const email: string = session?.user?.email ?? '';
  const avatarLetter = name ? name[0].toUpperCase() : email ? email[0].toUpperCase() : '?';

  const savedLevel = (metadata.cooking_level as CookingLevelKey) ?? 'home_cook';
  const [cookingLevel, setCookingLevel] = React.useState<CookingLevelKey>(savedLevel);
  const [savingLevel, setSavingLevel] = React.useState(false);

  const { dietary, toggleDiet } = useDietary();
  const [notifications, setNotifications] = React.useState(true);
  const [weeklyDigest, setWeeklyDigest] = React.useState(false);

  const handleLevelChange = async (level: CookingLevelKey) => {
    setCookingLevel(level);
    setSavingLevel(true);
    await updateProfile({ cooking_level: level });
    setSavingLevel(false);
  };

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
            <Text style={styles.avatarText}>{avatarLetter}</Text>
          </View>
          <View style={styles.avatarInfo}>
            <Text style={styles.userName}>{name || 'No name set'}</Text>
            <Text style={styles.userEmail}>{email}</Text>
          </View>
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
        <SectionLabel title={savingLevel ? 'Cooking Level — saving…' : 'Cooking Level'} />
        <View style={styles.card}>
          <View style={styles.skillRow}>
            {COOKING_LEVELS.map(level => (
              <TouchableOpacity
                key={level.key}
                style={[styles.skillBtn, cookingLevel === level.key && styles.skillBtnActive]}
                onPress={() => handleLevelChange(level.key)}>
                <Text style={[styles.skillBtnText, cookingLevel === level.key && styles.skillBtnTextActive]}>
                  {level.label}
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
          onPress={async () => { await signOut(); router.replace('/login' as any); }}
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
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: C.gray,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    backgroundColor: C.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.border,
    marginBottom: 24,
    overflow: 'hidden',
  },
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
    fontSize: 11,
    fontWeight: '600',
    color: C.gray,
  },
  skillBtnTextActive: {
    color: C.white,
  },
  versionText: {
    fontSize: 13,
    color: C.gray,
  },
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
  footer: {
    textAlign: 'center',
    fontSize: 12,
    color: C.border,
    fontStyle: 'italic',
  },
});

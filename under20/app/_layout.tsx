import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Redirect, Stack, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { FavoritesProvider } from '@/context/FavoritesContext';
import { PantryProvider } from '@/context/PantryContext';
import { GroceryListProvider } from '@/context/GroceryListContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';

export const unstable_settings = {
  anchor: 'index',
};

function RootNavigator() {
  const colorScheme = useColorScheme();
  const { session, loading } = useAuth();
  const segments = useSegments();

  // Show nothing while auth state is loading
  if (loading) return null;

  const inTabs = segments[0] === '(tabs)';
  const inRecipe = segments[0] === 'recipe';
  const inProtectedRoute = inTabs || inRecipe;

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="recipe/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>

      {/* Redirect unauthenticated users away from protected routes */}
      {!session && inProtectedRoute && <Redirect href="/" />}
      {/* Redirect authenticated users away from auth screens */}
      {session && !inProtectedRoute && <Redirect href="/(tabs)" />}

      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <GroceryListProvider>
        <PantryProvider>
          <FavoritesProvider>
            <RootNavigator />
          </FavoritesProvider>
        </PantryProvider>
      </GroceryListProvider>
    </AuthProvider>
  );
}

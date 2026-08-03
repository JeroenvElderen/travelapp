import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';

export default function RootLayout() {
  const [client] = useState(() => new QueryClient());
  return (
    <GestureHandlerRootView style={styles.root}>
      <QueryClientProvider client={client}>
        <Stack screenOptions={{ headerShown: false, animation: 'fade' }} />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
const styles = StyleSheet.create({ root: { flex: 1 } });

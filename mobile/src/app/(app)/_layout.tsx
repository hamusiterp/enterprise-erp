import { Redirect, Stack } from 'expo-router';

import LoadingScreen from '../../components/LoadingScreen';
import { useAuth } from '../../hooks/useAuth';

export default function AppLayout() {
  const {
    isLoading,
    isAuthenticated,
  } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
import { Redirect, Stack } from 'expo-router';

import LoadingScreen from '../../components/LoadingScreen';
import { useAuth } from '../../hooks/useAuth';

export default function AuthLayout() {
  const {
    isLoading,
    isAuthenticated,
  } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isAuthenticated) {
    return <Redirect href="/(app)/dashboard" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
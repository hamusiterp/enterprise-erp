import { Redirect } from 'expo-router';

import LoadingScreen from '../components/LoadingScreen';
import { useAuth } from '../hooks/useAuth';

export default function Index() {
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

  return <Redirect href="/(auth)/login" />;
}
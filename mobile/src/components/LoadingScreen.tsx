import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Colors } from '../constants/colors';
import { Fonts } from '../constants/fonts';

export default function LoadingScreen() {
  return (
    <View style={styles.container}>

      <Image
        source={require('../../assets/images/mefthe-logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.systemName}>
        Enterprise Management System
      </Text>

      <ActivityIndicator
        size="large"
        color={Colors.primary}
        style={styles.loader}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },

  logo: {
    width: 310,
    height: 150,
  },

  systemName: {
    marginTop: 8,
    fontSize: 13,
    fontFamily: Fonts.medium,
    color: Colors.textSecondary,
    letterSpacing: 0.7,
  },

  loader: {
    marginTop: 28,
  },
});
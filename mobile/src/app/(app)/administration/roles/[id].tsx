import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import {
  router,
  useFocusEffect,
  useLocalSearchParams,
} from 'expo-router';

import {
  useCallback,
  useState,
} from 'react';

import { Colors } from '../../../../constants/colors';
import { Fonts } from '../../../../constants/fonts';

import {
  Role,
  rolesApi,
} from '../../../../api/rolesApi';


export default function RoleDetailsScreen() {
  const params =
    useLocalSearchParams();

  const roleId =
    Number(params.id);

  const [role, setRole] =
    useState<Role | null>(null);

  const [loading, setLoading] =
    useState(true);


  const loadRole =
    useCallback(async () => {
      try {
        setLoading(true);

        const data =
          await rolesApi.get(roleId);

        setRole(data);

      } catch (error) {
        console.log(
          'Role details error:',
          error
        );

        Alert.alert(
          'Unable to load role',
          'Role information could not be loaded.'
        );

      } finally {
        setLoading(false);
      }
    }, [roleId]);


  useFocusEffect(
    useCallback(() => {
      if (!Number.isNaN(roleId)) {
        loadRole();
      }
    }, [
      roleId,
      loadRole,
    ])
  );


  if (loading) {
    return (
      <SafeAreaView
        style={styles.safeArea}
      >
        <View
          style={styles.loadingContainer}
        >
          <ActivityIndicator
            size="large"
            color={Colors.primary}
          />

          <Text style={styles.loadingText}>
            Loading role...
          </Text>
        </View>
      </SafeAreaView>
    );
  }


  if (!role) {
    return null;
  }


  return (
    <SafeAreaView
      style={styles.safeArea}
    >
      <ScrollView
        contentContainerStyle={
          styles.container
        }
        showsVerticalScrollIndicator={false}
      >

        <View style={styles.header}>

          <Pressable
            style={styles.backButton}
            onPress={() =>
              router.back()
            }
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color={Colors.text}
            />
          </Pressable>

          <View style={styles.headerContent}>
            <Text style={styles.title}>
              Role Details
            </Text>

            <Text style={styles.subtitle}>
              Access and permissions
            </Text>
          </View>

          <Pressable
            style={styles.editButton}
            onPress={() =>
              router.push(
                `/(app)/administration/roles/${role.id}/edit` as any
              )
            }
          >
            <Ionicons
              name="create-outline"
              size={21}
              color={Colors.primary}
            />
          </Pressable>

        </View>


        <View style={styles.profileCard}>

          <View style={styles.icon}>
            <Ionicons
              name="shield-checkmark-outline"
              size={32}
              color={Colors.primary}
            />
          </View>

          <Text style={styles.roleName}>
            {role.name}
          </Text>

          <Text style={styles.roleCount}>
            {role.permissions?.length ?? 0}
            {' '}permissions assigned
          </Text>

        </View>


        <Text style={styles.sectionTitle}>
          Permissions
        </Text>


        <View style={styles.permissionCard}>

          {!role.permissions?.length ? (

            <Text style={styles.emptyText}>
              No permissions assigned.
            </Text>

          ) : (

            role.permissions.map(
  (permission) => (
    <View
      key={permission}
      style={styles.permissionRow}
    >
      <View
        style={
          styles.permissionIcon
        }
      >
        <Ionicons
          name="checkmark"
          size={16}
          color={Colors.primary}
        />
      </View>

      <Text
        style={
          styles.permissionName
        }
      >
        {formatPermission(
          permission
        )}
      </Text>
    </View>
  )
)

          )}

        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

function formatPermission(
  permission: string
): string {
  return permission
    .replace(/\./g, ' · ')
    .replace(/[-_]/g, ' ')
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase()
    );
}


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  container: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 45,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  headerContent: {
    flex: 1,
    marginLeft: 13,
  },

  title: {
    fontSize: 22,
    fontFamily: Fonts.extraBold,
    color: Colors.text,
  },

  subtitle: {
    marginTop: 2,
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
  },

  editButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryLight,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  profileCard: {
    marginTop: 24,
    padding: 24,
    alignItems: 'center',
    borderRadius: 22,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  icon: {
    width: 70,
    height: 70,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryLight,
  },

  roleName: {
    marginTop: 15,
    fontSize: 21,
    fontFamily: Fonts.extraBold,
    color: Colors.text,
  },

  roleCount: {
    marginTop: 5,
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
  },

  sectionTitle: {
    marginTop: 27,
    marginBottom: 12,
    fontSize: 17,
    fontFamily: Fonts.extraBold,
    color: Colors.text,
  },

  permissionCard: {
    padding: 16,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  permissionRow: {
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
  },

  permissionIcon: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryLight,
  },

  permissionName: {
    flex: 1,
    marginLeft: 10,
    fontSize: 13,
    fontFamily: Fonts.medium,
    color: Colors.text,
  },

  emptyText: {
    paddingVertical: 18,
    textAlign: 'center',
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
  },

  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    marginTop: 12,
    fontSize: 13,
    fontFamily: Fonts.medium,
    color: Colors.textSecondary,
  },
});
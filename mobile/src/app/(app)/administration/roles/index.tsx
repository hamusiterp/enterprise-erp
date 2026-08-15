import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import {
  router,
  useFocusEffect,
} from 'expo-router';

import {
  useCallback,
  useMemo,
  useState,
} from 'react';

import { Colors } from '../../../../constants/colors';
import { Fonts } from '../../../../constants/fonts';

import {
  Role,
  rolesApi,
} from '../../../../api/rolesApi';


export default function RolesScreen() {
  const [roles, setRoles] =
    useState<Role[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [search, setSearch] =
    useState('');


  const loadRoles = useCallback(
    async (refresh = false) => {
      try {
        if (refresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const data =
          await rolesApi.list();

        setRoles(data);

      } catch (error) {
        console.log(
          'Roles load error:',
          error
        );

      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );


  useFocusEffect(
    useCallback(() => {
      loadRoles();
    }, [loadRoles])
  );


  const filteredRoles =
    useMemo(() => {
      const value =
        search.trim().toLowerCase();

      if (!value) {
        return roles;
      }

      return roles.filter(
        (role) =>
          role.name
            ?.toLowerCase()
            .includes(value)
      );
    }, [
      roles,
      search,
    ]);


  return (
    <SafeAreaView style={styles.safeArea}>

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
            Roles
          </Text>

          <Text style={styles.subtitle}>
            {roles.length} system roles
          </Text>
        </View>

        <Pressable
          style={styles.addButton}
          onPress={() =>
            router.push(
              '/(app)/administration/roles/create'
            )
          }
        >
          <Ionicons
            name="add"
            size={25}
            color={Colors.white}
          />
        </Pressable>

      </View>


      <View style={styles.searchBox}>

        <Ionicons
          name="search-outline"
          size={20}
          color={Colors.textSecondary}
        />

        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search roles..."
          placeholderTextColor={
            Colors.textMuted
          }
          style={styles.searchInput}
        />

        {search.length > 0 && (
          <Pressable
            onPress={() =>
              setSearch('')
            }
          >
            <Ionicons
              name="close-circle"
              size={20}
              color={Colors.textMuted}
            />
          </Pressable>
        )}

      </View>


      {loading ? (

        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color={Colors.primary}
          />

          <Text style={styles.loadingText}>
            Loading roles...
          </Text>
        </View>

      ) : (

        <ScrollView
          contentContainerStyle={
            styles.listContent
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() =>
                loadRoles(true)
              }
              tintColor={Colors.primary}
            />
          }
        >

          {filteredRoles.map(
            (role) => (

              <Pressable
                key={role.id}
                onPress={() =>
                  router.push(
                    `/(app)/administration/roles/${role.id}` as any
                  )
                }
                style={({ pressed }) => [
                  styles.roleCard,
                  pressed &&
                    styles.roleCardPressed,
                ]}
              >

                <View style={styles.roleIcon}>
                  <Ionicons
                    name="shield-outline"
                    size={23}
                    color={Colors.primary}
                  />
                </View>

                <View style={styles.roleContent}>
                  <Text style={styles.roleName}>
                    {role.name}
                  </Text>

                  <Text style={styles.roleSubtitle}>
  {role.permissions_count ??
    role.permissions?.length ??
    0}
  {' '}permissions
  {'  •  '}
  {role.users_count ?? 0}
  {' '}users
</Text>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={19}
                  color={Colors.textMuted}
                />

              </Pressable>

            )
          )}

        </ScrollView>

      )}

    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 15,
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

  addButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
  },

  searchBox: {
    height: 52,
    marginHorizontal: 20,
    marginBottom: 15,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  searchInput: {
    flex: 1,
    height: '100%',
    marginLeft: 10,
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.text,
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

  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  roleCard: {
    minHeight: 82,
    marginBottom: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 19,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  roleCardPressed: {
    backgroundColor: Colors.primaryLight,
  },

  roleIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryLight,
  },

  roleContent: {
    flex: 1,
    marginLeft: 13,
  },

  roleName: {
    fontSize: 15,
    fontFamily: Fonts.bold,
    color: Colors.text,
  },

  roleSubtitle: {
    marginTop: 4,
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
  },
});
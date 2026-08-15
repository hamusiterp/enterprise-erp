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

import {
  Colors,
} from '../../../../constants/colors';

import {
  Fonts,
} from '../../../../constants/fonts';

import {
  MobileUser,
  usersApi,
} from '../../../../api/usersApi';


export default function UsersScreen() {
  const [
    users,
    setUsers,
  ] = useState<MobileUser[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

  const [
    search,
    setSearch,
  ] = useState('');


  /*
  |--------------------------------------------------------------------------
  | Load Users
  |--------------------------------------------------------------------------
  */

  const loadUsers = useCallback(
    async (refresh = false) => {
      try {
        if (refresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const data =
          await usersApi.list();

        setUsers(data);

      } catch (error) {
        console.log(
          'Users loading error:',
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
    loadUsers();
  }, [loadUsers])
);


  /*
  |--------------------------------------------------------------------------
  | Search
  |--------------------------------------------------------------------------
  */

  const filteredUsers =
    useMemo(() => {
      const value =
        search.trim().toLowerCase();

      if (!value) {
        return users;
      }

      return users.filter(
        (user) =>
          user.name
            ?.toLowerCase()
            .includes(value) ||

          user.email
            ?.toLowerCase()
            .includes(value) ||

          getRoleText(user)
            .toLowerCase()
            .includes(value)
      );
    }, [
      users,
      search,
    ]);


  return (
    <SafeAreaView
      style={styles.safeArea}
    >

      {/* HEADER */}

      <View
        style={styles.header}
      >

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


        <View
          style={styles.headerContent}
        >
          <Text style={styles.title}>
            Users
          </Text>

          <Text style={styles.subtitle}>
            {users.length} system users
          </Text>
        </View>


        <Pressable
  style={styles.addButton}
  onPress={() =>
    router.push(
      '/(app)/administration/users/create'
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


      {/* SEARCH */}

      <View
        style={styles.searchBox}
      >

        <Ionicons
          name="search-outline"
          size={20}
          color={
            Colors.textSecondary
          }
        />

        <TextInput
          value={search}
          onChangeText={setSearch}

          placeholder="Search users..."

          placeholderTextColor={
            Colors.textMuted
          }

          autoCapitalize="none"

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
              color={
                Colors.textMuted
              }
            />
          </Pressable>
        )}

      </View>


      {/* CONTENT */}

      {loading ? (

        <View
          style={styles.loadingContainer}
        >
          <ActivityIndicator
            size="large"
            color={Colors.primary}
          />

          <Text
            style={styles.loadingText}
          >
            Loading users...
          </Text>
        </View>

      ) : (

        <ScrollView
          contentContainerStyle={
            styles.listContent
          }

          showsVerticalScrollIndicator={
            false
          }

          refreshControl={
            <RefreshControl
              refreshing={refreshing}

              onRefresh={() =>
                loadUsers(true)
              }

              tintColor={
                Colors.primary
              }
            />
          }
        >

          {filteredUsers.length === 0 ? (

            <View
              style={styles.empty}
            >

              <View
                style={styles.emptyIcon}
              >
                <Ionicons
                  name="people-outline"
                  size={30}
                  color={
                    Colors.primary
                  }
                />
              </View>

              <Text
                style={styles.emptyTitle}
              >
                No users found
              </Text>

              <Text
                style={styles.emptyText}
              >
                Try a different search.
              </Text>

            </View>

          ) : (

            filteredUsers.map(
              (user) => (

                <UserCard
                  key={user.id}
                  user={user}
                />

              )
            )

          )}

        </ScrollView>

      )}

    </SafeAreaView>
  );
}


/*
|--------------------------------------------------------------------------
| User Card
|--------------------------------------------------------------------------
*/

function UserCard({
  user,
}: {
  user: MobileUser;
}) {

  const role =
    getRoleText(user);

  const active =
    !user.status ||
    user.status
      .toLowerCase() === 'active';


  const initials =
    getInitials(user.name);


  return (
    <Pressable
      onPress={() =>
        router.push(
          `/(app)/administration/users/${user.id}` as any
        )
      }

      style={({ pressed }) => [
        styles.userCard,

        pressed &&
          styles.userCardPressed,
      ]}
    >

      <View
        style={styles.avatar}
      >
        <Text
          style={styles.avatarText}
        >
          {initials}
        </Text>
      </View>


      <View
        style={styles.userContent}
      >

        <View
          style={styles.nameRow}
        >
          <Text
            style={styles.userName}
            numberOfLines={1}
          >
            {user.name}
          </Text>

          <View
            style={[
              styles.statusBadge,

              active
                ? styles.activeBadge
                : styles.inactiveBadge,
            ]}
          >
            <View
              style={[
                styles.statusDot,

                active
                  ? styles.activeDot
                  : styles.inactiveDot,
              ]}
            />

            <Text
              style={[
                styles.statusText,

                active
                  ? styles.activeText
                  : styles.inactiveText,
              ]}
            >
              {active
                ? 'Active'
                : user.status}
            </Text>
          </View>

        </View>


        <View
          style={styles.infoRow}
        >
          <Ionicons
            name="mail-outline"
            size={14}
            color={
              Colors.textSecondary
            }
          />

          <Text
            style={styles.email}
            numberOfLines={1}
          >
            {user.email}
          </Text>
        </View>


        <View
          style={styles.roleRow}
        >
          <Ionicons
            name="shield-outline"
            size={14}
            color={Colors.primary}
          />

          <Text
            style={styles.roleText}
          >
            {role}
          </Text>
        </View>

      </View>


      <Ionicons
        name="chevron-forward"
        size={19}
        color={Colors.textMuted}
      />

    </Pressable>
  );
}


/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function getInitials(
  name?: string
): string {
  if (!name) {
    return 'U';
  }

  const parts =
    name.trim().split(/\s+/);

  if (parts.length === 1) {
    return parts[0]
      .charAt(0)
      .toUpperCase();
  }

  return (
    parts[0].charAt(0) +
    parts[parts.length - 1]
      .charAt(0)
  ).toUpperCase();
}


function getRoleText(
  user: MobileUser
): string {

  if (!user.roles) {
    return 'User';
  }

  if (
    Array.isArray(user.roles)
  ) {

    const names =
      user.roles
        .map((role) => {

          if (
            typeof role === 'string'
          ) {
            return role;
          }

          return role.name ?? '';

        })
        .filter(Boolean);

    return (
      names.join(', ') ||
      'User'
    );
  }

  return 'User';
}


/*
|--------------------------------------------------------------------------
| Styles
|--------------------------------------------------------------------------
*/

const styles =
  StyleSheet.create({

    safeArea: {
      flex: 1,
      backgroundColor:
        Colors.background,
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

      backgroundColor:
        Colors.surface,

      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    headerContent: {
      flex: 1,
      marginLeft: 13,
    },

    title: {
      fontSize: 22,
      fontFamily:
        Fonts.extraBold,

      color: Colors.text,
    },

    subtitle: {
      marginTop: 2,

      fontSize: 12,
      fontFamily:
        Fonts.regular,

      color:
        Colors.textSecondary,
    },

    addButton: {
      width: 44,
      height: 44,

      borderRadius: 14,

      alignItems: 'center',
      justifyContent: 'center',

      backgroundColor:
        Colors.primary,
    },

    searchBox: {
      height: 52,

      marginHorizontal: 20,
      marginBottom: 15,

      paddingHorizontal: 15,

      flexDirection: 'row',
      alignItems: 'center',

      borderRadius: 16,

      backgroundColor:
        Colors.surface,

      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    searchInput: {
      flex: 1,
      height: '100%',

      marginLeft: 10,

      fontSize: 14,
      fontFamily:
        Fonts.regular,

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
      fontFamily:
        Fonts.medium,

      color:
        Colors.textSecondary,
    },

    listContent: {
      paddingHorizontal: 20,
      paddingBottom: 40,
    },

    userCard: {
      minHeight: 100,

      marginBottom: 12,
      padding: 14,

      flexDirection: 'row',
      alignItems: 'center',

      borderRadius: 19,

      backgroundColor:
        Colors.surface,

      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    userCardPressed: {
      backgroundColor:
        Colors.primaryLight,
    },

    avatar: {
      width: 52,
      height: 52,

      borderRadius: 17,

      alignItems: 'center',
      justifyContent: 'center',

      backgroundColor:
        Colors.primaryLight,
    },

    avatarText: {
      fontSize: 17,
      fontFamily:
        Fonts.extraBold,

      color: Colors.primary,
    },

    userContent: {
      flex: 1,
      marginLeft: 13,
    },

    nameRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    userName: {
      flex: 1,

      fontSize: 15,
      fontFamily:
        Fonts.bold,

      color: Colors.text,
    },

    infoRow: {
      marginTop: 6,

      flexDirection: 'row',
      alignItems: 'center',
    },

    email: {
      flex: 1,

      marginLeft: 6,

      fontSize: 12,
      fontFamily:
        Fonts.regular,

      color:
        Colors.textSecondary,
    },

    roleRow: {
      marginTop: 5,

      flexDirection: 'row',
      alignItems: 'center',
    },

    roleText: {
      marginLeft: 6,

      fontSize: 11,
      fontFamily:
        Fonts.semiBold,

      color: Colors.primary,
    },

    statusBadge: {
      marginLeft: 8,

      paddingHorizontal: 8,
      paddingVertical: 4,

      borderRadius: 20,

      flexDirection: 'row',
      alignItems: 'center',
    },

    activeBadge: {
      backgroundColor: '#EAF7EF',
    },

    inactiveBadge: {
      backgroundColor: '#FDECEC',
    },

    statusDot: {
      width: 6,
      height: 6,

      borderRadius: 3,
      marginRight: 5,
    },

    activeDot: {
      backgroundColor:
        Colors.success,
    },

    inactiveDot: {
      backgroundColor:
        Colors.danger,
    },

    statusText: {
      fontSize: 9,
      fontFamily:
        Fonts.bold,
    },

    activeText: {
      color: Colors.success,
    },

    inactiveText: {
      color: Colors.danger,
    },

    empty: {
      marginTop: 70,

      alignItems: 'center',
      justifyContent: 'center',
    },

    emptyIcon: {
      width: 65,
      height: 65,

      borderRadius: 20,

      alignItems: 'center',
      justifyContent: 'center',

      backgroundColor:
        Colors.primaryLight,
    },

    emptyTitle: {
      marginTop: 15,

      fontSize: 17,
      fontFamily:
        Fonts.bold,

      color: Colors.text,
    },

    emptyText: {
      marginTop: 5,

      fontSize: 13,
      fontFamily:
        Fonts.regular,

      color:
        Colors.textSecondary,
    },

  });
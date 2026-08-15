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
  MobileUser,
  usersApi,
} from '../../../../api/usersApi';

export default function UserDetailsScreen() {
  const params = useLocalSearchParams();

  const userId = Number(params.id);

  const [user, setUser] =
    useState<MobileUser | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [actionLoading, setActionLoading] =
    useState(false);

  const loadUser = useCallback(async () => {
    try {
      setLoading(true);

      const data =
        await usersApi.get(userId);

      setUser(data);

    } catch (error) {
      console.log(
        'User details error:',
        error
      );

      Alert.alert(
        'Unable to load user',
        'The user information could not be loaded.'
      );

    } finally {
      setLoading(false);
    }
  }, [userId]);

  useFocusEffect(
  useCallback(() => {
    if (!Number.isNaN(userId)) {
      loadUser();
    }
  }, [userId, loadUser])
);

  const handleStatusChange = () => {
    if (!user) {
      return;
    }

    const currentlyActive =
      !user.status ||
      user.status
        .toLowerCase() === 'active';

    const newStatus =
      currentlyActive
        ? 'inactive'
        : 'active';

    Alert.alert(
      currentlyActive
        ? 'Deactivate user'
        : 'Activate user',

      currentlyActive
        ? `Deactivate ${user.name}?`
        : `Activate ${user.name}?`,

      [
        {
          text: 'Cancel',
          style: 'cancel',
        },

        {
          text: currentlyActive
            ? 'Deactivate'
            : 'Activate',

          style: currentlyActive
            ? 'destructive'
            : 'default',

          onPress: async () => {
            try {
              setActionLoading(true);

              await usersApi.changeStatus(
                user.id,
                newStatus
              );

              await loadUser();

            } catch (error) {
              console.log(
                'Status update error:',
                error
              );

              Alert.alert(
                'Update failed',
                'Unable to change the user status.'
              );

            } finally {
              setActionLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleResetPassword = () => {
    if (!user) {
      return;
    }

    Alert.alert(
      'Reset password',
      `Reset password for ${user.name}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },

        {
          text: 'Reset',

          onPress: async () => {
            try {
              setActionLoading(true);

              await usersApi.resetPassword(
                user.id
              );

              Alert.alert(
                'Password reset',
                'The user password has been reset successfully.'
              );

            } catch (error) {
              console.log(
                'Password reset error:',
                error
              );

              Alert.alert(
                'Reset failed',
                'Unable to reset the password.'
              );

            } finally {
              setActionLoading(false);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView
        style={styles.safeArea}
      >
        <View
          style={
            styles.loadingContainer
          }
        >
          <ActivityIndicator
            size="large"
            color={Colors.primary}
          />

          <Text
            style={styles.loadingText}
          >
            Loading user...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView
        style={styles.safeArea}
      >
        <View
          style={styles.emptyContainer}
        >
          <Ionicons
            name="person-outline"
            size={40}
            color={Colors.textMuted}
          />

          <Text
            style={styles.emptyTitle}
          >
            User not found
          </Text>

          <Pressable
            style={styles.backHomeButton}
            onPress={() =>
              router.back()
            }
          >
            <Text
              style={
                styles.backHomeText
              }
            >
              Go Back
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const active =
    !user.status ||
    user.status
      .toLowerCase() === 'active';

  const initials =
    getInitials(user.name);

  const roleText =
    getRoleText(user);

  return (
    <SafeAreaView
      style={styles.safeArea}
    >
      <ScrollView
        contentContainerStyle={
          styles.container
        }
        showsVerticalScrollIndicator={
          false
        }
      >

        {/* HEADER */}

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

          <View
            style={
              styles.headerContent
            }
          >
            <Text style={styles.title}>
              User Details
            </Text>

            <Text
              style={styles.subtitle}
            >
              Account information
            </Text>
          </View>

          <Pressable
            style={styles.editButton}
            onPress={() =>
              router.push(
                `/(app)/administration/users/${user.id}/edit` as any
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

        {/* PROFILE */}

        <View
          style={styles.profileCard}
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

          <Text
            style={styles.name}
          >
            {user.name}
          </Text>

          <Text
            style={styles.email}
          >
            {user.email}
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

        {/* ACCOUNT INFORMATION */}

        <Text
          style={styles.sectionTitle}
        >
          Account Information
        </Text>

        <View
          style={styles.infoCard}
        >
          <InfoRow
            icon="person-outline"
            label="Full Name"
            value={user.name}
          />

          <Divider />

          <InfoRow
            icon="mail-outline"
            label="Email"
            value={user.email}
          />

          <Divider />

          <InfoRow
            icon="shield-outline"
            label="Role"
            value={roleText}
          />

          <Divider />

          <InfoRow
            icon="checkmark-circle-outline"
            label="Status"
            value={
              active
                ? 'Active'
                : user.status ??
                  'Inactive'
            }
          />

          {user.created_at && (
            <>
              <Divider />

              <InfoRow
                icon="calendar-outline"
                label="Created"
                value={
                  formatDate(
                    user.created_at
                  )
                }
              />
            </>
          )}
        </View>

        {/* ACTIONS */}

        <Text
          style={styles.sectionTitle}
        >
          Account Actions
        </Text>

        <View
          style={styles.actionCard}
        >
          <Pressable
            style={
              styles.actionRow
            }
            disabled={actionLoading}
            onPress={() =>
              router.push(
                `/(app)/administration/users/${user.id}/edit` as any
              )
            }
          >
            <View
              style={styles.actionIcon}
            >
              <Ionicons
                name="create-outline"
                size={21}
                color={Colors.primary}
              />
            </View>

            <View
              style={
                styles.actionContent
              }
            >
              <Text
                style={
                  styles.actionTitle
                }
              >
                Edit User
              </Text>

              <Text
                style={
                  styles.actionSubtitle
                }
              >
                Update account information
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={18}
              color={Colors.textMuted}
            />
          </Pressable>

          <Divider />

          <Pressable
            style={
              styles.actionRow
            }
            disabled={actionLoading}
            onPress={
              handleResetPassword
            }
          >
            <View
              style={styles.actionIcon}
            >
              <Ionicons
                name="key-outline"
                size={21}
                color={Colors.primary}
              />
            </View>

            <View
              style={
                styles.actionContent
              }
            >
              <Text
                style={
                  styles.actionTitle
                }
              >
                Reset Password
              </Text>

              <Text
                style={
                  styles.actionSubtitle
                }
              >
                Reset account password
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={18}
              color={Colors.textMuted}
            />
          </Pressable>

          <Divider />

          <Pressable
            style={
              styles.actionRow
            }
            disabled={actionLoading}
            onPress={
              handleStatusChange
            }
          >
            <View
              style={[
                styles.actionIcon,

                !active &&
                  styles.activateIcon,
              ]}
            >
              <Ionicons
                name={
                  active
                    ? 'ban-outline'
                    : 'checkmark-circle-outline'
                }
                size={21}
                color={
                  active
                    ? Colors.danger
                    : Colors.success
                }
              />
            </View>

            <View
              style={
                styles.actionContent
              }
            >
              <Text
                style={[
                  styles.actionTitle,

                  active
                    ? styles.dangerText
                    : styles.successText,
                ]}
              >
                {active
                  ? 'Deactivate User'
                  : 'Activate User'}
              </Text>

              <Text
                style={
                  styles.actionSubtitle
                }
              >
                {active
                  ? 'Prevent this user from signing in'
                  : 'Allow this user to sign in'}
              </Text>
            </View>
          </Pressable>
        </View>

        {actionLoading && (
          <View
            style={
              styles.actionLoading
            }
          >
            <ActivityIndicator
              size="small"
              color={Colors.primary}
            />

            <Text
              style={
                styles.actionLoadingText
              }
            >
              Updating account...
            </Text>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}


/*
|--------------------------------------------------------------------------
| Information Row
|--------------------------------------------------------------------------
*/

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infoRow}>
      <View
        style={styles.infoIcon}
      >
        <Ionicons
          name={icon}
          size={19}
          color={Colors.primary}
        />
      </View>

      <View
        style={styles.infoContent}
      >
        <Text
          style={styles.infoLabel}
        >
          {label}
        </Text>

        <Text
          style={styles.infoValue}
        >
          {value}
        </Text>
      </View>
    </View>
  );
}


function Divider() {
  return (
    <View style={styles.divider} />
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


function formatDate(
  value: string
): string {
  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return value;
  }

  return date.toLocaleDateString();
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

    editButton: {
      width: 44,
      height: 44,
      borderRadius: 14,

      alignItems: 'center',
      justifyContent: 'center',

      backgroundColor:
        Colors.primaryLight,

      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    profileCard: {
      marginTop: 24,
      padding: 23,

      alignItems: 'center',

      borderRadius: 22,

      backgroundColor:
        Colors.surface,

      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    avatar: {
      width: 74,
      height: 74,

      borderRadius: 24,

      alignItems: 'center',
      justifyContent: 'center',

      backgroundColor:
        Colors.primaryLight,
    },

    avatarText: {
      fontSize: 25,
      fontFamily:
        Fonts.extraBold,
      color: Colors.primary,
    },

    name: {
      marginTop: 15,

      fontSize: 20,
      fontFamily:
        Fonts.extraBold,

      color: Colors.text,
    },

    email: {
      marginTop: 4,

      fontSize: 13,
      fontFamily:
        Fonts.regular,

      color:
        Colors.textSecondary,
    },

    statusBadge: {
      marginTop: 13,

      paddingHorizontal: 11,
      paddingVertical: 6,

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
      width: 7,
      height: 7,
      borderRadius: 4,
      marginRight: 6,
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
      fontSize: 11,
      fontFamily:
        Fonts.bold,
    },

    activeText: {
      color: Colors.success,
    },

    inactiveText: {
      color: Colors.danger,
    },

    sectionTitle: {
      marginTop: 27,
      marginBottom: 12,

      fontSize: 17,
      fontFamily:
        Fonts.extraBold,

      color: Colors.text,
    },

    infoCard: {
      paddingHorizontal: 16,

      borderRadius: 20,

      backgroundColor:
        Colors.surface,

      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    infoRow: {
      minHeight: 70,
      paddingVertical: 13,

      flexDirection: 'row',
      alignItems: 'center',
    },

    infoIcon: {
      width: 42,
      height: 42,

      borderRadius: 13,

      alignItems: 'center',
      justifyContent: 'center',

      backgroundColor:
        Colors.primaryLight,
    },

    infoContent: {
      flex: 1,
      marginLeft: 12,
    },

    infoLabel: {
      fontSize: 11,
      fontFamily:
        Fonts.regular,

      color:
        Colors.textSecondary,
    },

    infoValue: {
      marginTop: 3,

      fontSize: 14,
      fontFamily:
        Fonts.semiBold,

      color: Colors.text,
    },

    divider: {
      height: 1,
      backgroundColor:
        Colors.border,
    },

    actionCard: {
      paddingHorizontal: 16,

      borderRadius: 20,

      backgroundColor:
        Colors.surface,

      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    actionRow: {
      minHeight: 77,

      paddingVertical: 13,

      flexDirection: 'row',
      alignItems: 'center',
    },

    actionIcon: {
      width: 43,
      height: 43,

      borderRadius: 13,

      alignItems: 'center',
      justifyContent: 'center',

      backgroundColor:
        Colors.primaryLight,
    },

    activateIcon: {
      backgroundColor: '#EAF7EF',
    },

    actionContent: {
      flex: 1,
      marginLeft: 12,
    },

    actionTitle: {
      fontSize: 14,
      fontFamily:
        Fonts.bold,

      color: Colors.text,
    },

    actionSubtitle: {
      marginTop: 3,

      fontSize: 11,
      fontFamily:
        Fonts.regular,

      color:
        Colors.textSecondary,
    },

    dangerText: {
      color: Colors.danger,
    },

    successText: {
      color: Colors.success,
    },

    actionLoading: {
      marginTop: 17,

      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },

    actionLoadingText: {
      marginLeft: 8,

      fontSize: 12,
      fontFamily:
        Fonts.medium,

      color:
        Colors.textSecondary,
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

    emptyContainer: {
      flex: 1,

      alignItems: 'center',
      justifyContent: 'center',

      padding: 30,
    },

    emptyTitle: {
      marginTop: 12,

      fontSize: 18,
      fontFamily:
        Fonts.bold,

      color: Colors.text,
    },

    backHomeButton: {
      marginTop: 20,

      paddingHorizontal: 22,
      paddingVertical: 12,

      borderRadius: 14,

      backgroundColor:
        Colors.primary,
    },

    backHomeText: {
      fontFamily:
        Fonts.bold,

      color: Colors.white,
    },

  });
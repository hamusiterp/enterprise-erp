import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

import {
  useEffect,
  useState,
} from 'react';

import { Colors } from '../../../../../constants/colors';
import { Fonts } from '../../../../../constants/fonts';

import {
  MobileUser,
  usersApi,
} from '../../../../../api/usersApi';

interface RoleOption {
  id: number;
  name: string;
}

export default function EditUserScreen() {
  const params = useLocalSearchParams();
  const userId = Number(params.id);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [roles, setRoles] =
    useState<RoleOption[]>([]);

  const [name, setName] =
    useState('');

  const [email, setEmail] =
    useState('');

  const [status, setStatus] =
    useState('active');

  const [selectedRole, setSelectedRole] =
    useState<number | null>(null);

  const [showRoles, setShowRoles] =
    useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const [
        user,
        roleOptions,
      ] = await Promise.all([
        usersApi.get(userId),
        usersApi.roles(),
      ]);

      setName(user.name ?? '');
      setEmail(user.email ?? '');
      setStatus(
        user.status?.toLowerCase() === 'inactive'
          ? 'inactive'
          : 'active'
      );

      setRoles(roleOptions);

      if (
        Array.isArray(user.roles) &&
        user.roles.length > 0
      ) {
        const firstRole =
          user.roles[0];

        if (
          typeof firstRole === 'object' &&
          firstRole.id
        ) {
          setSelectedRole(
            firstRole.id
          );
        } else if (
          typeof firstRole === 'string'
        ) {
          const match =
            roleOptions.find(
              (role) =>
                role.name === firstRole
            );

          if (match) {
            setSelectedRole(
              match.id
            );
          }
        }
      }

    } catch (error) {
      console.log(
        'Edit user load error:',
        error
      );

      Alert.alert(
        'Unable to load user',
        'The user information could not be loaded.'
      );

    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert(
        'Name required',
        'Please enter the user name.'
      );
      return;
    }

    if (!email.trim()) {
      Alert.alert(
        'Email required',
        'Please enter the email address.'
      );
      return;
    }

    try {
      setSaving(true);

      if (!selectedRole) {
  Alert.alert(
    'Role required',
    'Please select a role.'
  );

  return;
}

const selectedRoleObject =
  roles.find(
    (role) =>
      role.id === selectedRole
  );

if (!selectedRoleObject) {
  Alert.alert(
    'Role error',
    'The selected role could not be found.'
  );

  return;
}

await usersApi.update(
  userId,
  {
    name: name.trim(),
    email: email.trim(),
    status,
    roles: [
      selectedRoleObject.name
    ],
  }
);

      Alert.alert(
        'User updated',
        'The user has been updated successfully.',
        [
          {
            text: 'OK',
            onPress: () => {
              router.back();
            },
          },
        ]
      );

    } catch (error: any) {
      console.log(
        'User update error:',
        error
      );

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.errors
          ?.email?.[0] ||
        'Unable to update the user.';

      Alert.alert(
        'Update failed',
        message
      );

    } finally {
      setSaving(false);
    }
  };

  const selectedRoleName =
    roles.find(
      (role) =>
        role.id === selectedRole
    )?.name ?? 'Select role';

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

  return (
    <SafeAreaView
      style={styles.safeArea}
    >
      <ScrollView
        contentContainerStyle={
          styles.container
        }
        keyboardShouldPersistTaps="handled"
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

          <View
            style={styles.headerContent}
          >
            <Text style={styles.title}>
              Edit User
            </Text>

            <Text
              style={styles.subtitle}
            >
              Update account information
            </Text>
          </View>
        </View>


        <Text
          style={styles.sectionTitle}
        >
          User Information
        </Text>


        <View
          style={styles.formCard}
        >

          <Text style={styles.label}>
            Full Name
          </Text>

          <View
            style={styles.inputBox}
          >
            <Ionicons
              name="person-outline"
              size={19}
              color={Colors.textSecondary}
            />

            <TextInput
              value={name}
              onChangeText={setName}
              style={styles.input}
              placeholder="Full name"
              placeholderTextColor={
                Colors.textMuted
              }
            />
          </View>


          <Text
            style={[
              styles.label,
              styles.fieldSpacing,
            ]}
          >
            Email
          </Text>

          <View
            style={styles.inputBox}
          >
            <Ionicons
              name="mail-outline"
              size={19}
              color={Colors.textSecondary}
            />

            <TextInput
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              placeholder="Email address"
              placeholderTextColor={
                Colors.textMuted
              }
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>


          <Text
            style={[
              styles.label,
              styles.fieldSpacing,
            ]}
          >
            Role
          </Text>

          <Pressable
            style={styles.selectBox}
            onPress={() =>
              setShowRoles(
                !showRoles
              )
            }
          >
            <View
              style={styles.selectLeft}
            >
              <Ionicons
                name="shield-outline"
                size={19}
                color={Colors.textSecondary}
              />

              <Text
                style={[
                  styles.selectText,
                  !selectedRole &&
                    styles.placeholder,
                ]}
              >
                {selectedRoleName}
              </Text>
            </View>

            <Ionicons
              name={
                showRoles
                  ? 'chevron-up'
                  : 'chevron-down'
              }
              size={18}
              color={Colors.textMuted}
            />
          </Pressable>


          {showRoles && (
            <View
              style={styles.roleList}
            >
              {roles.map(
                (role) => (
                  <Pressable
                    key={role.id}
                    style={[
                      styles.roleOption,

                      selectedRole ===
                        role.id &&
                        styles.roleOptionSelected,
                    ]}
                    onPress={() => {
                      setSelectedRole(
                        role.id
                      );

                      setShowRoles(
                        false
                      );
                    }}
                  >
                    <Text
                      style={[
                        styles.roleOptionText,

                        selectedRole ===
                          role.id &&
                          styles.roleOptionTextSelected,
                      ]}
                    >
                      {role.name}
                    </Text>

                    {selectedRole ===
                      role.id && (
                      <Ionicons
                        name="checkmark"
                        size={18}
                        color={
                          Colors.primary
                        }
                      />
                    )}
                  </Pressable>
                )
              )}
            </View>
          )}


          <Text
            style={[
              styles.label,
              styles.fieldSpacing,
            ]}
          >
            Status
          </Text>

          <View
            style={styles.statusRow}
          >
            <StatusButton
              title="Active"
              icon="checkmark-circle-outline"
              selected={
                status === 'active'
              }
              onPress={() =>
                setStatus('active')
              }
            />

            <StatusButton
              title="Inactive"
              icon="ban-outline"
              selected={
                status === 'inactive'
              }
              onPress={() =>
                setStatus('inactive')
              }
            />
          </View>

        </View>


        <Pressable
          onPress={handleSave}
          disabled={saving}
          style={[
            styles.saveButton,

            saving &&
              styles.saveButtonDisabled,
          ]}
        >
          {saving ? (
            <ActivityIndicator
              color={Colors.white}
            />
          ) : (
            <>
              <Ionicons
                name="save-outline"
                size={20}
                color={Colors.white}
              />

              <Text
                style={
                  styles.saveButtonText
                }
              >
                Save Changes
              </Text>
            </>
          )}
        </Pressable>

      </ScrollView>
    </SafeAreaView>
  );
}


function StatusButton({
  title,
  icon,
  selected,
  onPress,
}: {
  title: string;
  icon: any;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.statusButton,

        selected &&
          styles.statusButtonSelected,
      ]}
    >
      <Ionicons
        name={icon}
        size={19}
        color={
          selected
            ? Colors.primary
            : Colors.textSecondary
        }
      />

      <Text
        style={[
          styles.statusButtonText,

          selected &&
            styles.statusButtonTextSelected,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}


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
      marginLeft: 13,
      flex: 1,
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

    sectionTitle: {
      marginTop: 26,
      marginBottom: 12,

      fontSize: 17,
      fontFamily:
        Fonts.extraBold,

      color: Colors.text,
    },

    formCard: {
      padding: 17,

      borderRadius: 20,

      backgroundColor:
        Colors.surface,

      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    label: {
      marginBottom: 8,

      fontSize: 12,
      fontFamily:
        Fonts.semiBold,

      color: Colors.text,
    },

    fieldSpacing: {
      marginTop: 19,
    },

    inputBox: {
      height: 54,

      paddingHorizontal: 14,

      flexDirection: 'row',
      alignItems: 'center',

      borderRadius: 15,

      backgroundColor:
        Colors.background,

      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    input: {
      flex: 1,
      height: '100%',

      marginLeft: 10,

      fontSize: 14,
      fontFamily:
        Fonts.regular,

      color: Colors.text,
    },

    selectBox: {
      height: 54,

      paddingHorizontal: 14,

      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'space-between',

      borderRadius: 15,

      backgroundColor:
        Colors.background,

      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    selectLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },

    selectText: {
      marginLeft: 10,

      fontSize: 14,
      fontFamily:
        Fonts.regular,

      color: Colors.text,
    },

    placeholder: {
      color: Colors.textMuted,
    },

    roleList: {
      marginTop: 8,

      borderRadius: 14,

      overflow: 'hidden',

      borderWidth: 1,
      borderColor:
        Colors.border,

      backgroundColor:
        Colors.surface,
    },

    roleOption: {
      minHeight: 48,

      paddingHorizontal: 14,

      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'space-between',

      borderBottomWidth: 1,
      borderBottomColor:
        Colors.border,
    },

    roleOptionSelected: {
      backgroundColor:
        Colors.primaryLight,
    },

    roleOptionText: {
      fontSize: 13,
      fontFamily:
        Fonts.medium,

      color: Colors.text,
    },

    roleOptionTextSelected: {
      color: Colors.primary,
      fontFamily:
        Fonts.bold,
    },

    statusRow: {
      flexDirection: 'row',
      gap: 10,
    },

    statusButton: {
      flex: 1,
      height: 52,

      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',

      gap: 7,

      borderRadius: 15,

      borderWidth: 1,
      borderColor:
        Colors.border,

      backgroundColor:
        Colors.background,
    },

    statusButtonSelected: {
      borderColor:
        Colors.primary,

      backgroundColor:
        Colors.primaryLight,
    },

    statusButtonText: {
      fontSize: 13,
      fontFamily:
        Fonts.medium,

      color:
        Colors.textSecondary,
    },

    statusButtonTextSelected: {
      color: Colors.primary,
      fontFamily:
        Fonts.bold,
    },

    saveButton: {
      height: 56,

      marginTop: 24,

      borderRadius: 16,

      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',

      gap: 9,

      backgroundColor:
        Colors.primary,
    },

    saveButtonDisabled: {
      opacity: 0.7,
    },

    saveButtonText: {
      color: Colors.white,

      fontSize: 14,
      fontFamily:
        Fonts.bold,
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

  });
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  Ionicons,
} from '@expo/vector-icons';

import {
  router,
} from 'expo-router';

import {
  useEffect,
  useState,
} from 'react';

import {
  Colors,
} from '../../../../constants/colors';

import {
  Fonts,
} from '../../../../constants/fonts';

import {
  usersApi,
} from '../../../../api/usersApi';


interface RoleOption {
  id: number;
  name: string;
}


export default function CreateUserScreen() {

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    roles,
    setRoles,
  ] = useState<RoleOption[]>([]);

  const [
    selectedRole,
    setSelectedRole,
  ] = useState<number | null>(null);

  const [
    showRoles,
    setShowRoles,
  ] = useState(false);

  const [
    name,
    setName,
  ] = useState('');

  const [
    email,
    setEmail,
  ] = useState('');

  const [
    password,
    setPassword,
  ] = useState('');

  const [
    passwordConfirmation,
    setPasswordConfirmation,
  ] = useState('');

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    showPasswordConfirmation,
    setShowPasswordConfirmation,
  ] = useState(false);

  const [
    status,
    setStatus,
  ] = useState('active');


  /*
  |--------------------------------------------------------------------------
  | Load Roles
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    loadRoles();
  }, []);


  const loadRoles = async () => {

    try {

      setLoading(true);

      const data =
        await usersApi.roles();

      setRoles(data);

    } catch (error) {

      console.log(
        'Role loading error:',
        error
      );

      Alert.alert(
        'Unable to load roles',
        'The system roles could not be loaded.'
      );

    } finally {

      setLoading(false);

    }

  };


  /*
  |--------------------------------------------------------------------------
  | Create User
  |--------------------------------------------------------------------------
  */

  const handleCreate = async () => {

    if (!name.trim()) {

      Alert.alert(
        'Name required',
        'Please enter the user full name.'
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


    if (!password) {

      Alert.alert(
        'Password required',
        'Please enter a password.'
      );

      return;
    }


    if (
      password.length < 8
    ) {

      Alert.alert(
        'Password too short',
        'Password must contain at least 8 characters.'
      );

      return;
    }


    if (
      password !==
      passwordConfirmation
    ) {

      Alert.alert(
        'Passwords do not match',
        'Password and confirmation must be the same.'
      );

      return;
    }


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


    if (
      !selectedRoleObject
    ) {

      Alert.alert(
        'Role error',
        'The selected role could not be found.'
      );

      return;
    }


    try {

      setSaving(true);


      await usersApi.create({
        name: name.trim(),

        email: email
          .trim()
          .toLowerCase(),

        password,

        password_confirmation:
          passwordConfirmation,

        status,

        roles: [
          selectedRoleObject.name,
        ],
      });


      Alert.alert(
        'User created',
        'The user has been created successfully.',
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
        'Create user error:',
        error?.response?.data ??
        error
      );


      const errors =
        error?.response
          ?.data?.errors;


      let message =
        error?.response
          ?.data?.message ||
        'Unable to create the user.';


      if (errors) {

        const firstError =
          Object.values(errors)
            .flat()
            .find(Boolean);

        if (
          typeof firstError ===
          'string'
        ) {
          message = firstError;
        }

      }


      Alert.alert(
        'Create failed',
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
        style={
          styles.safeArea
        }
      >

        <View
          style={
            styles.loadingContainer
          }
        >

          <ActivityIndicator
            size="large"
            color={
              Colors.primary
            }
          />

          <Text
            style={
              styles.loadingText
            }
          >
            Loading form...
          </Text>

        </View>

      </SafeAreaView>
    );

  }


  return (
    <SafeAreaView
      style={
        styles.safeArea
      }
    >

      <KeyboardAvoidingView
        style={{
          flex: 1,
        }}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }
      >

        <ScrollView
          contentContainerStyle={
            styles.container
          }
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={
            false
          }
        >

          {/* HEADER */}

          <View
            style={
              styles.header
            }
          >

            <Pressable
              style={
                styles.backButton
              }
              onPress={() =>
                router.back()
              }
            >

              <Ionicons
                name="arrow-back"
                size={22}
                color={
                  Colors.text
                }
              />

            </Pressable>


            <View
              style={
                styles.headerContent
              }
            >

              <Text
                style={
                  styles.title
                }
              >
                Add User
              </Text>

              <Text
                style={
                  styles.subtitle
                }
              >
                Create a new system account
              </Text>

            </View>

          </View>


          <Text
            style={
              styles.sectionTitle
            }
          >
            User Information
          </Text>


          <View
            style={
              styles.formCard
            }
          >

            {/* NAME */}

            <FieldLabel
              title="Full Name"
            />

            <View
              style={
                styles.inputBox
              }
            >

              <Ionicons
                name="person-outline"
                size={19}
                color={
                  Colors.textSecondary
                }
              />

              <TextInput
                value={name}
                onChangeText={
                  setName
                }
                placeholder="Enter full name"
                placeholderTextColor={
                  Colors.textMuted
                }
                style={
                  styles.input
                }
              />

            </View>


            {/* EMAIL */}

            <FieldLabel
              title="Email"
              spaced
            />

            <View
              style={
                styles.inputBox
              }
            >

              <Ionicons
                name="mail-outline"
                size={19}
                color={
                  Colors.textSecondary
                }
              />

              <TextInput
                value={email}
                onChangeText={
                  setEmail
                }
                placeholder="Email address"
                placeholderTextColor={
                  Colors.textMuted
                }
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                style={
                  styles.input
                }
              />

            </View>


            {/* PASSWORD */}

            <FieldLabel
              title="Password"
              spaced
            />

            <View
              style={
                styles.inputBox
              }
            >

              <Ionicons
                name="lock-closed-outline"
                size={19}
                color={
                  Colors.textSecondary
                }
              />

              <TextInput
                value={password}
                onChangeText={
                  setPassword
                }
                placeholder="Password"
                placeholderTextColor={
                  Colors.textMuted
                }
                secureTextEntry={
                  !showPassword
                }
                style={
                  styles.input
                }
              />

              <Pressable
                onPress={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
              >

                <Ionicons
                  name={
                    showPassword
                      ? 'eye-off-outline'
                      : 'eye-outline'
                  }
                  size={20}
                  color={
                    Colors.textSecondary
                  }
                />

              </Pressable>

            </View>


            {/* CONFIRM PASSWORD */}

            <FieldLabel
              title="Confirm Password"
              spaced
            />

            <View
              style={
                styles.inputBox
              }
            >

              <Ionicons
                name="lock-closed-outline"
                size={19}
                color={
                  Colors.textSecondary
                }
              />

              <TextInput
                value={
                  passwordConfirmation
                }
                onChangeText={
                  setPasswordConfirmation
                }
                placeholder="Confirm password"
                placeholderTextColor={
                  Colors.textMuted
                }
                secureTextEntry={
                  !showPasswordConfirmation
                }
                style={
                  styles.input
                }
              />

              <Pressable
                onPress={() =>
                  setShowPasswordConfirmation(
                    !showPasswordConfirmation
                  )
                }
              >

                <Ionicons
                  name={
                    showPasswordConfirmation
                      ? 'eye-off-outline'
                      : 'eye-outline'
                  }
                  size={20}
                  color={
                    Colors.textSecondary
                  }
                />

              </Pressable>

            </View>


            {/* ROLE */}

            <FieldLabel
              title="Role"
              spaced
            />

            <Pressable
              style={
                styles.selectBox
              }
              onPress={() =>
                setShowRoles(
                  !showRoles
                )
              }
            >

              <View
                style={
                  styles.selectLeft
                }
              >

                <Ionicons
                  name="shield-outline"
                  size={19}
                  color={
                    Colors.textSecondary
                  }
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
                color={
                  Colors.textMuted
                }
              />

            </Pressable>


            {showRoles && (

              <View
                style={
                  styles.roleList
                }
              >

                {roles.map(
                  (role) => (

                    <Pressable
                      key={
                        role.id
                      }
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


            {/* STATUS */}

            <FieldLabel
              title="Status"
              spaced
            />

            <View
              style={
                styles.statusRow
              }
            >

              <StatusButton
                title="Active"
                icon="checkmark-circle-outline"
                selected={
                  status === 'active'
                }
                onPress={() =>
                  setStatus(
                    'active'
                  )
                }
              />


              <StatusButton
                title="Inactive"
                icon="ban-outline"
                selected={
                  status === 'inactive'
                }
                onPress={() =>
                  setStatus(
                    'inactive'
                  )
                }
              />

            </View>

          </View>


          {/* CREATE BUTTON */}

          <Pressable
            disabled={saving}
            onPress={
              handleCreate
            }
            style={[
              styles.createButton,

              saving &&
                styles.createButtonDisabled,
            ]}
          >

            {saving ? (

              <ActivityIndicator
                color={
                  Colors.white
                }
              />

            ) : (

              <>

                <Ionicons
                  name="person-add-outline"
                  size={20}
                  color={
                    Colors.white
                  }
                />

                <Text
                  style={
                    styles.createButtonText
                  }
                >
                  Create User
                </Text>

              </>

            )}

          </Pressable>

        </ScrollView>

      </KeyboardAvoidingView>

    </SafeAreaView>
  );
}


/*
|--------------------------------------------------------------------------
| Field Label
|--------------------------------------------------------------------------
*/

function FieldLabel({
  title,
  spaced = false,
}: {
  title: string;
  spaced?: boolean;
}) {

  return (
    <Text
      style={[
        styles.label,

        spaced &&
          styles.fieldSpacing,
      ]}
    >
      {title}
    </Text>
  );

}


/*
|--------------------------------------------------------------------------
| Status Button
|--------------------------------------------------------------------------
*/

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
      onPress={
        onPress
      }
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

      color:
        Colors.text,
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

      color:
        Colors.text,
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

      color:
        Colors.text,
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

      color:
        Colors.text,
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
      flex: 1,

      flexDirection: 'row',
      alignItems: 'center',
    },

    selectText: {
      marginLeft: 10,

      fontSize: 14,

      fontFamily:
        Fonts.regular,

      color:
        Colors.text,
    },

    placeholder: {
      color:
        Colors.textMuted,
    },

    roleList: {
      marginTop: 8,

      overflow: 'hidden',

      borderRadius: 14,

      backgroundColor:
        Colors.surface,

      borderWidth: 1,
      borderColor:
        Colors.border,
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

      color:
        Colors.text,
    },

    roleOptionTextSelected: {
      color:
        Colors.primary,

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

      borderRadius: 15,

      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',

      gap: 7,

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
      color:
        Colors.primary,

      fontFamily:
        Fonts.bold,
    },

    createButton: {
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

    createButtonDisabled: {
      opacity: 0.7,
    },

    createButtonText: {
      color:
        Colors.white,

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
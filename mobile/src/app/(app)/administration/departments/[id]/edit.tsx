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

import { Ionicons } from '@expo/vector-icons';

import {
  router,
  useLocalSearchParams,
} from 'expo-router';

import {
  useEffect,
  useState,
} from 'react';

import {
  Colors,
} from '../../../../../constants/colors';

import {
  Fonts,
} from '../../../../../constants/fonts';

import {
  Department,
  departmentsApi,
} from '../../../../../api/departmentsApi';


type DepartmentStatus =
  | 'active'
  | 'inactive';


export default function EditDepartmentScreen() {

  const params =
    useLocalSearchParams();

  const departmentId =
    Number(params.id);


  const [
    department,
    setDepartment,
  ] =
    useState<Department | null>(
      null
    );

  const [
    departmentName,
    setDepartmentName,
  ] = useState('');

  const [
    description,
    setDescription,
  ] = useState('');

  const [
    status,
    setStatus,
  ] =
    useState<DepartmentStatus>(
      'active'
    );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    saving,
    setSaving,
  ] = useState(false);


  /*
  |--------------------------------------------------------------------------
  | Load
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    loadDepartment();

  }, []);


  const loadDepartment =
    async () => {

      try {

        setLoading(true);

        const data =
          await departmentsApi.get(
            departmentId
          );


        setDepartment(data);

        setDepartmentName(
          data.department_name ??
          ''
        );

        setDescription(
          data.description ??
          ''
        );

        setStatus(
          data.status ===
          'inactive'
            ? 'inactive'
            : 'active'
        );

      } catch (error: any) {

        console.log(
          'Department edit load error:',
          error?.response?.data ??
          error
        );

        Alert.alert(
          'Unable to load department',
          error?.response?.data?.message ??
          'Department information could not be loaded.'
        );

      } finally {

        setLoading(false);

      }

    };


  /*
  |--------------------------------------------------------------------------
  | Save
  |--------------------------------------------------------------------------
  */

  const handleSave =
    async () => {

      const cleanName =
        departmentName.trim();

      const cleanDescription =
        description.trim();


      if (!cleanName) {

        Alert.alert(
          'Department name required',
          'Please enter the department name.'
        );

        return;
      }


      if (
        cleanName.length > 200
      ) {

        Alert.alert(
          'Department name too long',
          'Department name cannot exceed 200 characters.'
        );

        return;
      }


      if (
        cleanDescription.length >
        2000
      ) {

        Alert.alert(
          'Description too long',
          'Description cannot exceed 2000 characters.'
        );

        return;
      }


      try {

        setSaving(true);


        await departmentsApi.update(
          departmentId,
          {
            department_name:
              cleanName,

            description:
              cleanDescription ||
              undefined,

            status,
          }
        );


        Alert.alert(
          'Department updated',
          'The department has been updated successfully.',
          [
            {
              text: 'OK',

              onPress: () =>
                router.back(),
            },
          ]
        );

      } catch (error: any) {

        console.log(
          'Department update error:',
          error?.response?.data ??
          error
        );


        Alert.alert(
          'Update failed',

          getApiErrorMessage(
            error,
            'Unable to update department.'
          )
        );

      } finally {

        setSaving(false);

      }

    };


  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

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
            Loading department...
          </Text>

        </View>

      </SafeAreaView>
    );

  }


  /*
  |--------------------------------------------------------------------------
  | Not Found
  |--------------------------------------------------------------------------
  */

  if (!department) {

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

          <Ionicons
            name="business-outline"
            size={42}
            color={
              Colors.textMuted
            }
          />

          <Text
            style={
              styles.notFoundTitle
            }
          >
            Department not found
          </Text>

          <Pressable
            style={
              styles.goBackButton
            }
            onPress={() =>
              router.back()
            }
          >

            <Text
              style={
                styles.goBackText
              }
            >
              Go Back
            </Text>

          </Pressable>

        </View>

      </SafeAreaView>
    );

  }


  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (
    <SafeAreaView
      style={
        styles.safeArea
      }
    >

      <KeyboardAvoidingView
        style={{ flex: 1 }}

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
                Edit Department
              </Text>

              <Text
                style={
                  styles.subtitle
                }
              >
                Update department information
              </Text>

            </View>

          </View>


          {/* CURRENT DEPARTMENT */}

          <View
            style={
              styles.introCard
            }
          >

            <View
              style={
                styles.introIcon
              }
            >

              <Ionicons
                name="business-outline"
                size={27}
                color={
                  Colors.primary
                }
              />

            </View>


            <View
              style={
                styles.introContent
              }
            >

              <Text
                style={
                  styles.introTitle
                }
              >
                {
                  department
                    .department_name
                }
              </Text>

              <Text
                style={
                  styles.departmentCode
                }
              >
                {
                  department
                    .department_id
                }
              </Text>

            </View>

          </View>


          {/* FORM */}

          <Text
            style={
              styles.sectionTitle
            }
          >
            Department Information
          </Text>


          <View
            style={
              styles.formCard
            }
          >

            <Text
              style={
                styles.label
              }
            >
              Department Name

              <Text
                style={
                  styles.required
                }
              >
                {' '}*
              </Text>

            </Text>


            <View
              style={
                styles.inputBox
              }
            >

              <Ionicons
                name="business-outline"
                size={19}
                color={
                  Colors.textSecondary
                }
              />

              <TextInput
                value={
                  departmentName
                }

                onChangeText={
                  setDepartmentName
                }

                placeholder="Department name"

                placeholderTextColor={
                  Colors.textMuted
                }

                maxLength={200}

                autoCapitalize="words"

                style={
                  styles.input
                }
              />

            </View>


            <Text
              style={
                styles.characterCount
              }
            >
              {
                departmentName.length
              }
              /200
            </Text>


            <Text
              style={[
                styles.label,
                styles.nextLabel,
              ]}
            >
              Description
            </Text>


            <View
              style={
                styles.textAreaBox
              }
            >

              <TextInput
                value={
                  description
                }

                onChangeText={
                  setDescription
                }

                placeholder="Department description..."

                placeholderTextColor={
                  Colors.textMuted
                }

                multiline

                maxLength={2000}

                textAlignVertical="top"

                style={
                  styles.textArea
                }
              />

            </View>


            <Text
              style={
                styles.characterCount
              }
            >
              {
                description.length
              }
              /2000
            </Text>

          </View>


          {/* STATUS */}

          <Text
            style={
              styles.sectionTitle
            }
          >
            Status
          </Text>


          <View
            style={
              styles.statusContainer
            }
          >

            <StatusOption
              title="Active"

              subtitle="Department can be used throughout the system"

              icon="checkmark-circle-outline"

              selected={
                status === 'active'
              }

              onPress={() =>
                setStatus('active')
              }
            />


            <StatusOption
              title="Inactive"

              subtitle="Department remains stored but is unavailable for normal use"

              icon="pause-circle-outline"

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


          {/* SAVE */}

          <Pressable
            disabled={
              saving
            }

            onPress={
              handleSave
            }

            style={[
              styles.saveButton,

              saving &&
                styles.disabled,
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
                  name="save-outline"
                  size={20}
                  color={
                    Colors.white
                  }
                />

                <Text
                  style={
                    styles.saveText
                  }
                >
                  Save Changes
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
| Status
|--------------------------------------------------------------------------
*/

function StatusOption({
  title,
  subtitle,
  icon,
  selected,
  onPress,
}: {
  title: string;
  subtitle: string;
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
        styles.statusOption,

        selected &&
          styles.statusOptionSelected,
      ]}
    >

      <View
        style={[
          styles.statusIcon,

          selected &&
            styles.statusIconSelected,
        ]}
      >

        <Ionicons
          name={icon}
          size={22}
          color={
            selected
              ? Colors.primary
              : Colors.textSecondary
          }
        />

      </View>


      <View
        style={
          styles.statusContent
        }
      >

        <Text
          style={
            styles.statusTitle
          }
        >
          {title}
        </Text>

        <Text
          style={
            styles.statusSubtitle
          }
        >
          {subtitle}
        </Text>

      </View>


      <View
        style={[
          styles.radioOuter,

          selected &&
            styles.radioOuterSelected,
        ]}
      >

        {selected && (

          <View
            style={
              styles.radioInner
            }
          />

        )}

      </View>

    </Pressable>

  );
}


/*
|--------------------------------------------------------------------------
| Laravel validation errors
|--------------------------------------------------------------------------
*/

function getApiErrorMessage(
  error: any,
  fallback: string
): string {

  const errors =
    error?.response
      ?.data?.errors;


  if (errors) {

    const first =
      Object.values(errors)
        .flat()
        .find(Boolean);

    if (
      typeof first ===
      'string'
    ) {
      return first;
    }

  }


  return (
    error?.response
      ?.data?.message ??
    fallback
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
      paddingBottom: 50,
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

    introCard: {
      marginTop: 24,
      padding: 16,

      flexDirection: 'row',
      alignItems: 'center',

      borderRadius: 20,

      backgroundColor:
        Colors.surface,

      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    introIcon: {
      width: 52,
      height: 52,

      borderRadius: 17,

      alignItems: 'center',
      justifyContent: 'center',

      backgroundColor:
        Colors.primaryLight,
    },

    introContent: {
      flex: 1,
      marginLeft: 13,
    },

    introTitle: {
      fontSize: 15,

      fontFamily:
        Fonts.bold,

      color:
        Colors.text,
    },

    departmentCode: {
      marginTop: 4,

      fontSize: 11,

      fontFamily:
        Fonts.medium,

      color:
        Colors.textSecondary,
    },

    sectionTitle: {
      marginTop: 27,
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

    required: {
      color:
        Colors.danger,
    },

    nextLabel: {
      marginTop: 18,
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

    textAreaBox: {
      minHeight: 130,

      paddingHorizontal: 14,
      paddingVertical: 12,

      borderRadius: 15,

      backgroundColor:
        Colors.background,

      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    textArea: {
      minHeight: 105,

      fontSize: 14,
      lineHeight: 20,

      fontFamily:
        Fonts.regular,

      color:
        Colors.text,
    },

    characterCount: {
      marginTop: 6,

      textAlign: 'right',

      fontSize: 9,

      fontFamily:
        Fonts.regular,

      color:
        Colors.textMuted,
    },

    statusContainer: {
      gap: 10,
    },

    statusOption: {
      minHeight: 80,

      padding: 14,

      flexDirection: 'row',
      alignItems: 'center',

      borderRadius: 18,

      backgroundColor:
        Colors.surface,

      borderWidth: 1.5,
      borderColor:
        Colors.border,
    },

    statusOptionSelected: {
      borderColor:
        Colors.primary,

      backgroundColor:
        Colors.primaryLight,
    },

    statusIcon: {
      width: 45,
      height: 45,

      borderRadius: 14,

      alignItems: 'center',
      justifyContent: 'center',

      backgroundColor:
        Colors.background,
    },

    statusIconSelected: {
      backgroundColor:
        Colors.surface,
    },

    statusContent: {
      flex: 1,

      marginLeft: 12,
      marginRight: 10,
    },

    statusTitle: {
      fontSize: 13,

      fontFamily:
        Fonts.bold,

      color:
        Colors.text,
    },

    statusSubtitle: {
      marginTop: 3,

      fontSize: 10,
      lineHeight: 15,

      fontFamily:
        Fonts.regular,

      color:
        Colors.textSecondary,
    },

    radioOuter: {
      width: 22,
      height: 22,

      borderRadius: 11,

      borderWidth: 2,
      borderColor:
        Colors.border,

      alignItems: 'center',
      justifyContent: 'center',
    },

    radioOuterSelected: {
      borderColor:
        Colors.primary,
    },

    radioInner: {
      width: 10,
      height: 10,

      borderRadius: 5,

      backgroundColor:
        Colors.primary,
    },

    saveButton: {
      height: 56,

      marginTop: 27,

      borderRadius: 16,

      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',

      gap: 9,

      backgroundColor:
        Colors.primary,
    },

    saveText: {
      fontSize: 14,

      fontFamily:
        Fonts.bold,

      color:
        Colors.white,
    },

    disabled: {
      opacity: 0.7,
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

    notFoundTitle: {
      marginTop: 12,

      fontSize: 17,

      fontFamily:
        Fonts.bold,

      color:
        Colors.text,
    },

    goBackButton: {
      marginTop: 20,

      paddingHorizontal: 22,
      paddingVertical: 12,

      borderRadius: 14,

      backgroundColor:
        Colors.primary,
    },

    goBackText: {
      fontFamily:
        Fonts.bold,

      color:
        Colors.white,
    },

  });
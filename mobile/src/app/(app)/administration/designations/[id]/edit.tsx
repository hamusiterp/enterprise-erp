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
  useMemo,
  useState,
} from 'react';

import {
  Colors,
} from '../../../../../constants/colors';

import {
  Fonts,
} from '../../../../../constants/fonts';

import {
  DepartmentOption,
  departmentsApi,
} from '../../../../../api/departmentsApi';

import {
  Designation,
  designationsApi,
} from '../../../../../api/designationsApi';


type DesignationStatus =
  | 'active'
  | 'inactive';


export default function EditDesignationScreen() {
  const params =
    useLocalSearchParams();

  const designationId =
    Number(params.id);

  const [
    designation,
    setDesignation,
  ] = useState<Designation | null>(
    null
  );

  const [
    name,
    setName,
  ] = useState('');

  const [
    description,
    setDescription,
  ] = useState('');

  const [
    level,
    setLevel,
  ] = useState('');

  const [
    status,
    setStatus,
  ] =
    useState<DesignationStatus>(
      'active'
    );

  const [
    departments,
    setDepartments,
  ] = useState<DepartmentOption[]>([]);

  const [
    selectedDepartmentId,
    setSelectedDepartmentId,
  ] = useState<number | null>(null);

  const [
    showDepartments,
    setShowDepartments,
  ] = useState(false);

  const [
    departmentSearch,
    setDepartmentSearch,
  ] = useState('');

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
  | Load Designation + Departments
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    loadData();
  }, []);


  const loadData = async () => {
    try {
      setLoading(true);

      const [
        designationData,
        departmentOptions,
      ] = await Promise.all([
        designationsApi.get(
          designationId
        ),

        departmentsApi.options(),
      ]);

      setDesignation(
        designationData
      );

      setDepartments(
        departmentOptions
      );

      setName(
        designationData.name ?? ''
      );

      setDescription(
        designationData.description ??
        ''
      );

      setLevel(
        designationData.level != null
          ? String(
              designationData.level
            )
          : ''
      );

      setStatus(
        designationData.status ===
        'inactive'
          ? 'inactive'
          : 'active'
      );

      setSelectedDepartmentId(
        designationData.department_id ??
        designationData.department?.id ??
        null
      );

    } catch (error: any) {
      console.log(
        'Designation edit load error:',
        error?.response?.data ??
        error
      );

      Alert.alert(
        'Unable to load designation',
        error?.response?.data?.message ??
        'Designation information could not be loaded.'
      );

    } finally {
      setLoading(false);
    }
  };


  /*
  |--------------------------------------------------------------------------
  | Department Search
  |--------------------------------------------------------------------------
  */

  const filteredDepartments =
    useMemo(() => {
      const value =
        departmentSearch
          .trim()
          .toLowerCase();

      if (!value) {
        return departments;
      }

      return departments.filter(
        (department) =>
          department.department_name
            .toLowerCase()
            .includes(value) ||

          department.department_id
            ?.toLowerCase()
            .includes(value)
      );

    }, [
      departments,
      departmentSearch,
    ]);


  const selectedDepartment =
    departments.find(
      (department) =>
        department.id ===
        selectedDepartmentId
    );


  /*
  |--------------------------------------------------------------------------
  | Save
  |--------------------------------------------------------------------------
  */

  const handleSave = async () => {
    const cleanName =
      name.trim();

    const cleanDescription =
      description.trim();

    const cleanLevel =
      level.trim();


    if (!cleanName) {
      Alert.alert(
        'Designation name required',
        'Please enter the designation name.'
      );

      return;
    }


    if (
      cleanName.length > 150
    ) {
      Alert.alert(
        'Designation name too long',
        'Designation name cannot exceed 150 characters.'
      );

      return;
    }


    if (
      cleanDescription.length >
      5000
    ) {
      Alert.alert(
        'Description too long',
        'Description cannot exceed 5000 characters.'
      );

      return;
    }


    let parsedLevel:
      number | null = null;


    if (cleanLevel !== '') {
      parsedLevel =
        Number(cleanLevel);

      if (
        !Number.isInteger(
          parsedLevel
        )
      ) {
        Alert.alert(
          'Invalid level',
          'Designation level must be a whole number.'
        );

        return;
      }


      if (
        parsedLevel < 1 ||
        parsedLevel > 999
      ) {
        Alert.alert(
          'Invalid level',
          'Designation level must be between 1 and 999.'
        );

        return;
      }
    }


    try {
      setSaving(true);

      await designationsApi.update(
        designationId,
        {
          name:
            cleanName,

          department_id:
            selectedDepartmentId,

          level:
            parsedLevel,

          status,

          description:
            cleanDescription ||
            null,
        }
      );


      Alert.alert(
        'Designation updated',
        'The designation has been updated successfully.',
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
        'Designation update error:',
        error?.response?.data ??
        error
      );

      Alert.alert(
        'Update failed',
        getApiErrorMessage(
          error,
          'Unable to update designation.'
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
            Loading designation...
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

  if (!designation) {
    return (
      <SafeAreaView
        style={styles.safeArea}
      >
        <View
          style={
            styles.loadingContainer
          }
        >
          <Ionicons
            name="ribbon-outline"
            size={42}
            color={Colors.textMuted}
          />

          <Text
            style={
              styles.notFoundTitle
            }
          >
            Designation not found
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
      style={styles.safeArea}
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
            style={styles.header}
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
                color={Colors.text}
              />
            </Pressable>


            <View
              style={
                styles.headerContent
              }
            >
              <Text
                style={styles.title}
              >
                Edit Designation
              </Text>

              <Text
                style={
                  styles.subtitle
                }
              >
                Update job title information
              </Text>
            </View>
          </View>


          {/* CURRENT DESIGNATION */}

          <View
            style={styles.introCard}
          >
            <View
              style={styles.introIcon}
            >
              <Ionicons
                name="ribbon-outline"
                size={27}
                color={Colors.primary}
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
                {designation.name}
              </Text>

              <Text
                style={
                  styles.designationCode
                }
              >
                {designation.code}
              </Text>
            </View>
          </View>


          {/* FORM */}

          <Text
            style={
              styles.sectionTitle
            }
          >
            Designation Information
          </Text>


          <View
            style={styles.formCard}
          >

            {/* NAME */}

            <Text
              style={styles.label}
            >
              Designation Name
              <Text
                style={
                  styles.required
                }
              >
                {' '}*
              </Text>
            </Text>

            <View
              style={styles.inputBox}
            >
              <Ionicons
                name="ribbon-outline"
                size={19}
                color={
                  Colors.textSecondary
                }
              />

              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Designation name"
                placeholderTextColor={
                  Colors.textMuted
                }
                maxLength={150}
                style={styles.input}
              />
            </View>

            <Text
              style={
                styles.characterCount
              }
            >
              {name.length}/150
            </Text>


            {/* DEPARTMENT */}

            <Text
              style={[
                styles.label,
                styles.nextLabel,
              ]}
            >
              Department
            </Text>

            <Pressable
              style={styles.selectBox}
              onPress={() =>
                setShowDepartments(
                  !showDepartments
                )
              }
            >
              <View
                style={
                  styles.selectLeft
                }
              >
                <Ionicons
                  name="business-outline"
                  size={19}
                  color={
                    Colors.textSecondary
                  }
                />

                <Text
                  style={[
                    styles.selectText,

                    !selectedDepartment &&
                      styles.placeholder,
                  ]}
                >
                  {
                    selectedDepartment
                      ?.department_name ??
                    designation.department
                      ?.department_name ??
                    'Select department'
                  }
                </Text>
              </View>

              <Ionicons
                name={
                  showDepartments
                    ? 'chevron-up'
                    : 'chevron-down'
                }
                size={18}
                color={Colors.textMuted}
              />
            </Pressable>


            {showDepartments && (
              <View
                style={
                  styles.departmentDropdown
                }
              >
                <View
                  style={
                    styles.departmentSearch
                  }
                >
                  <Ionicons
                    name="search-outline"
                    size={17}
                    color={
                      Colors.textSecondary
                    }
                  />

                  <TextInput
                    value={
                      departmentSearch
                    }
                    onChangeText={
                      setDepartmentSearch
                    }
                    placeholder="Search departments..."
                    placeholderTextColor={
                      Colors.textMuted
                    }
                    style={
                      styles.departmentSearchInput
                    }
                  />
                </View>


                <Pressable
                  style={
                    styles.departmentOption
                  }
                  onPress={() => {
                    setSelectedDepartmentId(
                      null
                    );

                    setShowDepartments(
                      false
                    );

                    setDepartmentSearch(
                      ''
                    );
                  }}
                >
                  <Text
                    style={
                      styles.departmentOptionText
                    }
                  >
                    No Department
                  </Text>
                </Pressable>


                {filteredDepartments.map(
                  (department) => {
                    const selected =
                      department.id ===
                      selectedDepartmentId;

                    return (
                      <Pressable
                        key={
                          department.id
                        }
                        style={[
                          styles.departmentOption,

                          selected &&
                            styles.departmentOptionSelected,
                        ]}
                        onPress={() => {
                          setSelectedDepartmentId(
                            department.id
                          );

                          setShowDepartments(
                            false
                          );

                          setDepartmentSearch(
                            ''
                          );
                        }}
                      >
                        <View
                          style={{
                            flex: 1,
                          }}
                        >
                          <Text
                            style={[
                              styles.departmentOptionText,

                              selected &&
                                styles.departmentOptionTextSelected,
                            ]}
                          >
                            {
                              department
                                .department_name
                            }
                          </Text>

                          {department.department_id && (
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
                          )}
                        </View>

                        {selected && (
                          <Ionicons
                            name="checkmark"
                            size={18}
                            color={
                              Colors.primary
                            }
                          />
                        )}
                      </Pressable>
                    );
                  }
                )}
              </View>
            )}


            {/* LEVEL */}

            <Text
              style={[
                styles.label,
                styles.nextLabel,
              ]}
            >
              Level
            </Text>

            <View
              style={styles.inputBox}
            >
              <Ionicons
                name="layers-outline"
                size={19}
                color={
                  Colors.textSecondary
                }
              />

              <TextInput
                value={level}
                onChangeText={
                  (value) =>
                    setLevel(
                      value.replace(
                        /[^0-9]/g,
                        ''
                      )
                    )
                }
                placeholder="Optional, 1 - 999"
                placeholderTextColor={
                  Colors.textMuted
                }
                keyboardType="number-pad"
                maxLength={3}
                style={styles.input}
              />
            </View>


            {/* DESCRIPTION */}

            <Text
              style={[
                styles.label,
                styles.nextLabel,
              ]}
            >
              Description
            </Text>

            <View
              style={styles.textAreaBox}
            >
              <TextInput
                value={description}
                onChangeText={
                  setDescription
                }
                placeholder="Designation description..."
                placeholderTextColor={
                  Colors.textMuted
                }
                multiline
                maxLength={5000}
                textAlignVertical="top"
                style={styles.textArea}
              />
            </View>

            <Text
              style={
                styles.characterCount
              }
            >
              {description.length}/5000
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
              subtitle="Designation is available for use"
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
              subtitle="Keep the designation but disable normal use"
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
            disabled={saving}
            onPress={handleSave}
            style={[
              styles.saveButton,

              saving &&
                styles.disabled,
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
                  style={styles.saveText}
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
      onPress={onPress}
      style={[
        styles.statusOption,

        selected &&
          styles.statusOptionSelected,
      ]}
    >
      <View
        style={styles.statusIcon}
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
          style={styles.statusTitle}
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
            style={styles.radioInner}
          />
        )}
      </View>
    </Pressable>
  );
}


/*
|--------------------------------------------------------------------------
| Laravel Validation
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
    error?.response?.data?.message ??
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
      color: Colors.text,
    },

    designationCode: {
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

    required: {
      color: Colors.danger,
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
      color: Colors.text,
    },

    characterCount: {
      marginTop: 6,
      textAlign: 'right',
      fontSize: 9,
      fontFamily:
        Fonts.regular,
      color: Colors.textMuted,
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
      flex: 1,
      marginLeft: 10,
      fontSize: 14,
      fontFamily:
        Fonts.regular,
      color: Colors.text,
    },

    placeholder: {
      color: Colors.textMuted,
    },

    departmentDropdown: {
      marginTop: 8,
      maxHeight: 320,
      borderRadius: 15,
      overflow: 'hidden',
      backgroundColor:
        Colors.surface,
      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    departmentSearch: {
      height: 46,
      paddingHorizontal: 12,
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor:
        Colors.border,
    },

    departmentSearchInput: {
      flex: 1,
      marginLeft: 8,
      fontSize: 12,
      fontFamily:
        Fonts.regular,
      color: Colors.text,
    },

    departmentOption: {
      minHeight: 51,
      paddingHorizontal: 14,
      paddingVertical: 9,
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor:
        Colors.border,
    },

    departmentOptionSelected: {
      backgroundColor:
        Colors.primaryLight,
    },

    departmentOptionText: {
      fontSize: 12,
      fontFamily:
        Fonts.medium,
      color: Colors.text,
    },

    departmentOptionTextSelected: {
      color: Colors.primary,
      fontFamily:
        Fonts.bold,
    },

    departmentCode: {
      marginTop: 2,
      fontSize: 9,
      fontFamily:
        Fonts.regular,
      color: Colors.textMuted,
    },

    textAreaBox: {
      minHeight: 135,
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
      minHeight: 108,
      fontSize: 14,
      lineHeight: 20,
      fontFamily:
        Fonts.regular,
      color: Colors.text,
    },

    statusContainer: {
      gap: 10,
    },

    statusOption: {
      minHeight: 78,
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

    statusContent: {
      flex: 1,
      marginLeft: 12,
      marginRight: 10,
    },

    statusTitle: {
      fontSize: 13,
      fontFamily:
        Fonts.bold,
      color: Colors.text,
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
      color: Colors.white,
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
      marginTop: 13,
      fontSize: 17,
      fontFamily:
        Fonts.bold,
      color: Colors.text,
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
      color: Colors.white,
    },

  });
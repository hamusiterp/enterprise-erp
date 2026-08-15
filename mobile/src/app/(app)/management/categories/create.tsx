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
import { router } from 'expo-router';
import { useState } from 'react';

import {
  CategoryStatus,
  categoriesApi,
} from '../../../../api/categoriesApi';

import {
  Colors,
} from '../../../../constants/colors';

import {
  Fonts,
} from '../../../../constants/fonts';


type CategoryType =
  | 'Supplier'
  | 'Material'
  | 'Equipment'
  | 'Service'
  | 'Subcontractor'
  | 'Machine';


const CATEGORY_TYPES: CategoryType[] = [
  'Supplier',
  'Material',
  'Equipment',
  'Service',
  'Subcontractor',
  'Machine',
];


function getCategoryTypeIcon(
  type: CategoryType
) {

  switch (type) {

    case 'Supplier':
      return 'people-outline';

    case 'Material':
      return 'cube-outline';

    case 'Equipment':
      return 'construct-outline';

    case 'Service':
      return 'settings-outline';

    case 'Subcontractor':
      return 'business-outline';

    case 'Machine':
      return 'cog-outline';

    default:
      return 'pricetag-outline';

  }

}


export default function CreateCategoryScreen() {

  const [
    category,
    setCategory,
  ] = useState('');


  const [
    type,
    setType,
  ] =
    useState<
      CategoryType | ''
    >('');


  const [
    status,
    setStatus,
  ] =
    useState<CategoryStatus>(
      'active'
    );


  const [
    saving,
    setSaving,
  ] = useState(false);


  /*
  |--------------------------------------------------------------------------
  | Validation
  |--------------------------------------------------------------------------
  */

  const validate =
    () => {

      if (
        !category.trim()
      ) {

        Alert.alert(
          'Required Field',
          'Category name is required.'
        );

        return false;

      }


      if (
        category
          .trim()
          .length > 50
      ) {

        Alert.alert(
          'Invalid Category',
          'Category name cannot exceed 50 characters.'
        );

        return false;

      }


      if (!type) {

        Alert.alert(
          'Required Field',
          'Please select category type.'
        );

        return false;

      }


      return true;

    };


  /*
  |--------------------------------------------------------------------------
  | Save
  |--------------------------------------------------------------------------
  */

  const saveCategory =
    async () => {

      if (
        saving ||
        !validate()
      ) {
        return;
      }


      try {

        setSaving(true);


        const created =
          await categoriesApi.create({
            category:
              category.trim(),

            type,

            status,
          });


        Alert.alert(
          'Category Created',
          `${created.category} has been created successfully.`,
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
          'CREATE CATEGORY ERROR:',
          error?.response?.data ??
          error
        );


        Alert.alert(
          'Unable to Create Category',
          getApiError(
            error,
            'The category could not be created.'
          )
        );

      } finally {

        setSaving(false);

      }

    };


  return (
    <SafeAreaView
      style={
        styles.safeArea
      }
    >

      <ScrollView
        contentContainerStyle={
          styles.container
        }

        showsVerticalScrollIndicator={
          false
        }

        keyboardShouldPersistTaps="handled"
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
              size={21}
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
              Add Category
            </Text>

            <Text
              style={
                styles.subtitle
              }
            >
              Create a new category
            </Text>

          </View>

        </View>


        {/* FORM CARD */}

        <View
          style={
            styles.formCard
          }
        >

          <View
            style={
              styles.heroIcon
            }
          >

            <Ionicons
              name="folder-outline"
              size={27}
              color={
                Colors.primary
              }
            />

          </View>


          <Text
            style={
              styles.cardTitle
            }
          >
            Category Information
          </Text>


          <Text
            style={
              styles.cardSubtitle
            }
          >
            Enter category name, type and status.
          </Text>


          {/* CATEGORY NAME */}

          <Label
            title="Category Name"
            required
          />


          <View
            style={
              styles.inputBox
            }
          >

            <Ionicons
              name="folder-open-outline"
              size={18}
              color={
                Colors.textSecondary
              }
            />


            <TextInput
              value={
                category
              }

              onChangeText={
                setCategory
              }

              placeholder="Enter category name"

              placeholderTextColor={
                Colors.textMuted
              }

              maxLength={50}

              style={
                styles.input
              }
            />

          </View>


          <Text
            style={
              styles.helperText
            }
          >
            {category.length}/50
          </Text>


          {/* CATEGORY TYPE */}

          <Label
            title="Category Type"
            required
          />


          <View
            style={
              styles.typeSection
            }
          >

            {CATEGORY_TYPES.map(
              item => {

                const selected =
                  type === item;


                return (

                  <Pressable
                    key={
                      item
                    }

                    onPress={() =>
                      setType(
                        item
                      )
                    }

                    style={[
                      styles.typeOption,

                      selected &&
                        styles.typeOptionSelected,
                    ]}
                  >

                    <View
                      style={[
                        styles.typeRadio,

                        selected &&
                          styles.typeRadioSelected,
                      ]}
                    >

                      {selected && (

                        <View
                          style={
                            styles.typeRadioDot
                          }
                        />

                      )}

                    </View>


                    <Ionicons
                      name={
                        getCategoryTypeIcon(
                          item
                        ) as any
                      }

                      size={18}

                      color={
                        selected
                          ? Colors.primary
                          : Colors.textSecondary
                      }
                    />


                    <Text
                      style={[
                        styles.typeOptionText,

                        selected &&
                          styles.typeOptionTextSelected,
                      ]}
                    >
                      {item}
                    </Text>

                  </Pressable>

                );

              }
            )}

          </View>


          {/* STATUS */}

          <Label
            title="Status"
            required
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
                status ===
                'active'
              }

              onPress={() =>
                setStatus(
                  'active'
                )
              }
            />


            <StatusButton
              title="Inactive"

              icon="pause-circle-outline"

              selected={
                status ===
                'inactive'
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
              saveCategory
            }

            style={[
              styles.saveButton,

              saving &&
                styles.disabled,
            ]}
          >

            {saving ? (

              <ActivityIndicator
                size="small"
                color="#FFFFFF"
              />

            ) : (

              <>

                <Ionicons
                  name="save-outline"
                  size={19}
                  color="#FFFFFF"
                />


                <Text
                  style={
                    styles.saveText
                  }
                >
                  Save Category
                </Text>

              </>

            )}

          </Pressable>


          {/* CANCEL */}

          <Pressable
            disabled={
              saving
            }

            style={
              styles.cancelButton
            }

            onPress={() =>
              router.back()
            }
          >

            <Text
              style={
                styles.cancelText
              }
            >
              Cancel
            </Text>

          </Pressable>

        </View>

      </ScrollView>

    </SafeAreaView>
  );

}


/*
|--------------------------------------------------------------------------
| Label
|--------------------------------------------------------------------------
*/

function Label({
  title,
  required = false,
}: {
  title: string;
  required?: boolean;
}) {

  return (
    <View
      style={
        styles.labelRow
      }
    >

      <Text
        style={
          styles.label
        }
      >
        {title}
      </Text>


      {required && (

        <Text
          style={
            styles.required
          }
        >
          *
        </Text>

      )}

    </View>
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
  icon: string;
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
          styles.statusSelected,
      ]}
    >

      <Ionicons
        name={
          icon as any
        }

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
| API Error
|--------------------------------------------------------------------------
*/

function getApiError(
  error: any,
  fallback: string
) {

  const errors =
    error?.response
      ?.data?.errors;


  if (errors) {

    const first =
      Object.values(
        errors
      )
        .flat()
        .find(
          Boolean
        );


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
      paddingHorizontal: 18,

      paddingTop: 12,

      paddingBottom: 50,
    },


    header: {
      flexDirection: 'row',

      alignItems: 'center',
    },


    backButton: {
      width: 43,

      height: 43,

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

      marginLeft: 12,
    },


    title: {
      fontSize: 21,

      fontFamily:
        Fonts.extraBold,

      color:
        Colors.text,
    },


    subtitle: {
      marginTop: 2,

      fontSize: 10,

      fontFamily:
        Fonts.regular,

      color:
        Colors.textSecondary,
    },


    formCard: {
      marginTop: 24,

      padding: 18,

      borderRadius: 20,

      backgroundColor:
        Colors.surface,

      borderWidth: 1,

      borderColor:
        Colors.border,
    },


    heroIcon: {
      width: 54,

      height: 54,

      borderRadius: 17,

      alignItems: 'center',

      justifyContent: 'center',

      backgroundColor:
        Colors.primaryLight,
    },


    cardTitle: {
      marginTop: 14,

      fontSize: 15,

      fontFamily:
        Fonts.extraBold,

      color:
        Colors.text,
    },


    cardSubtitle: {
      marginTop: 4,

      fontSize: 10,

      lineHeight: 15,

      fontFamily:
        Fonts.regular,

      color:
        Colors.textSecondary,
    },


    labelRow: {
      marginTop: 20,

      marginBottom: 7,

      flexDirection: 'row',

      alignItems: 'center',
    },


    label: {
      fontSize: 11,

      fontFamily:
        Fonts.semiBold,

      color:
        Colors.text,
    },


    required: {
      marginLeft: 3,

      color:
        Colors.danger,

      fontFamily:
        Fonts.bold,
    },


    inputBox: {
      minHeight: 52,

      paddingHorizontal: 14,

      flexDirection: 'row',

      alignItems: 'center',

      borderRadius: 14,

      backgroundColor:
        Colors.background,

      borderWidth: 1,

      borderColor:
        Colors.border,
    },


    input: {
      flex: 1,

      marginLeft: 9,

      fontSize: 12,

      fontFamily:
        Fonts.regular,

      color:
        Colors.text,
    },


    helperText: {
      marginTop: 5,

      textAlign: 'right',

      fontSize: 8,

      fontFamily:
        Fonts.regular,

      color:
        Colors.textMuted,
    },


    typeSection: {
      width: '100%',

      gap: 8,
    },


    typeOption: {
      width: '100%',

      minHeight: 52,

      paddingHorizontal: 14,

      flexDirection: 'row',

      alignItems: 'center',

      borderRadius: 14,

      backgroundColor:
        Colors.background,

      borderWidth: 1,

      borderColor:
        Colors.border,
    },


    typeOptionSelected: {
      backgroundColor:
        Colors.primaryLight,

      borderColor:
        Colors.primary,
    },


    typeRadio: {
      width: 20,

      height: 20,

      marginRight: 11,

      borderRadius: 10,

      alignItems: 'center',

      justifyContent: 'center',

      borderWidth: 2,

      borderColor:
        Colors.textMuted,
    },


    typeRadioSelected: {
      borderColor:
        Colors.primary,
    },


    typeRadioDot: {
      width: 9,

      height: 9,

      borderRadius: 5,

      backgroundColor:
        Colors.primary,
    },


    typeOptionText: {
      flex: 1,

      marginLeft: 10,

      fontSize: 11,

      fontFamily:
        Fonts.medium,

      color:
        Colors.textSecondary,
    },


    typeOptionTextSelected: {
      color:
        Colors.primary,

      fontFamily:
        Fonts.bold,
    },


    statusRow: {
      flexDirection: 'row',

      gap: 9,
    },


    statusButton: {
      flex: 1,

      height: 51,

      flexDirection: 'row',

      alignItems: 'center',

      justifyContent: 'center',

      gap: 7,

      borderRadius: 14,

      backgroundColor:
        Colors.background,

      borderWidth: 1,

      borderColor:
        Colors.border,
    },


    statusSelected: {
      borderColor:
        Colors.primary,

      backgroundColor:
        Colors.primaryLight,
    },


    statusButtonText: {
      fontSize: 10,

      fontFamily:
        Fonts.semiBold,

      color:
        Colors.textSecondary,
    },


    statusButtonTextSelected: {
      color:
        Colors.primary,

      fontFamily:
        Fonts.bold,
    },


    saveButton: {
      height: 53,

      marginTop: 28,

      flexDirection: 'row',

      alignItems: 'center',

      justifyContent: 'center',

      gap: 7,

      borderRadius: 14,

      backgroundColor:
        Colors.primary,
    },


    saveText: {
      fontSize: 11,

      fontFamily:
        Fonts.bold,

      color: '#FFFFFF',
    },


    cancelButton: {
      height: 49,

      marginTop: 10,

      alignItems: 'center',

      justifyContent: 'center',

      borderRadius: 14,

      borderWidth: 1,

      borderColor:
        Colors.border,

      backgroundColor:
        Colors.background,
    },


    cancelText: {
      fontSize: 10,

      fontFamily:
        Fonts.bold,

      color:
        Colors.textSecondary,
    },


    disabled: {
      opacity: 0.55,
    },

  });
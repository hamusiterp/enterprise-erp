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

import {
  useEffect,
  useState,
} from 'react';

import {
  SupplierStatus,
  suppliersApi,
} from '../../../../api/suppliersApi';

import {
  CategoryOption,
  categoriesApi,
} from '../../../../api/categoriesApi';

import {
  Colors,
} from '../../../../constants/colors';

import {
  Fonts,
} from '../../../../constants/fonts';


export default function CreateSupplierScreen() {

  /*
  |--------------------------------------------------------------------------
  | Form State
  |--------------------------------------------------------------------------
  */

  const [
    supplierNo,
    setSupplierNo,
  ] =
    useState('');


  const [
    supplierName,
    setSupplierName,
  ] =
    useState('');


  const [
    categoryId,
    setCategoryId,
  ] =
    useState<number | null>(
      null
    );


  const [
    address,
    setAddress,
  ] =
    useState('');


  const [
    phoneNumber,
    setPhoneNumber,
  ] =
    useState('');


  const [
    hasTin,
    setHasTin,
  ] =
    useState(false);


  const [
    tin,
    setTin,
  ] =
    useState('');


  const [
    status,
    setStatus,
  ] =
    useState<SupplierStatus>(
      'active'
    );


  /*
  |--------------------------------------------------------------------------
  | Categories
  |--------------------------------------------------------------------------
  */

  const [
    categories,
    setCategories,
  ] =
    useState<CategoryOption[]>(
      []
    );


  const [
    categoryOpen,
    setCategoryOpen,
  ] =
    useState(false);


  const [
    loadingOptions,
    setLoadingOptions,
  ] =
    useState(true);


  const [
    saving,
    setSaving,
  ] =
    useState(false);


  /*
  |--------------------------------------------------------------------------
  | Load Supplier Number + Categories
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    const load =
      async () => {

        try {

          setLoadingOptions(
            true
          );


          const [
            nextNumber,
            categoryOptions,
          ] =
            await Promise.all([

              suppliersApi
                .nextNumber(),

              categoriesApi
                .options({
                  type:
                    'Supplier',
                }),

            ]);


          setSupplierNo(
            nextNumber
          );


          setCategories(
            categoryOptions ??
            []
          );

        } catch (error: any) {

          console.log(
            'SUPPLIER CREATE OPTIONS ERROR:',
            error?.response?.data ??
            error
          );


          Alert.alert(
            'Unable to Load',
            'Unable to load supplier form options.'
          );

        } finally {

          setLoadingOptions(
            false
          );

        }

      };


    load();

  }, []);


  /*
  |--------------------------------------------------------------------------
  | Selected Category
  |--------------------------------------------------------------------------
  */

  const selectedCategory =
    categories.find(
      item =>
        item.id ===
        categoryId
    );


  /*
  |--------------------------------------------------------------------------
  | Validation
  |--------------------------------------------------------------------------
  */

  const validate =
    () => {

      if (
        !supplierName.trim()
      ) {

        Alert.alert(
          'Required Field',
          'Supplier name is required.'
        );

        return false;

      }


      if (
        supplierName
          .trim()
          .length > 200
      ) {

        Alert.alert(
          'Invalid Supplier Name',
          'Supplier name cannot exceed 200 characters.'
        );

        return false;

      }


      if (!categoryId) {

        Alert.alert(
          'Required Field',
          'Please select a supplier category.'
        );

        return false;

      }


      if (
        !phoneNumber.trim()
      ) {

        Alert.alert(
          'Required Field',
          'Phone number is required.'
        );

        return false;

      }


      if (
        phoneNumber
          .trim()
          .length > 50
      ) {

        Alert.alert(
          'Invalid Phone Number',
          'Phone number cannot exceed 50 characters.'
        );

        return false;

      }


      if (
        hasTin &&
        !tin.trim()
      ) {

        Alert.alert(
          'Required Field',
          'TIN Number is required when Have a TIN Number is Yes.'
        );

        return false;

      }


      if (
        tin.trim().length > 50
      ) {

        Alert.alert(
          'Invalid TIN',
          'TIN Number cannot exceed 50 characters.'
        );

        return false;

      }


      return true;

    };


  /*
  |--------------------------------------------------------------------------
  | Save Supplier
  |--------------------------------------------------------------------------
  */

  const saveSupplier =
    async () => {

      if (
        saving ||
        !validate() ||
        !categoryId
      ) {
        return;
      }


      try {

        setSaving(
          true
        );


        const created =
          await suppliersApi.create({

            supplier_name:
              supplierName.trim(),

            category_id:
              categoryId,

            address:
              address.trim()
                ? address.trim()
                : null,

            phone_number:
              phoneNumber.trim(),

            has_tin:
              hasTin,

            tin:
              hasTin
                ? tin.trim()
                : null,

            status,

          });


        Alert.alert(
          'Supplier Created',
          `${created.supplier_no} - ${created.supplier_name} has been created successfully.`,
          [
            {
              text:
                'View Supplier',

              onPress: () =>
                router.replace(
                  `/(app)/management/suppliers/${created.id}` as any
                ),
            },
          ]
        );

      } catch (error: any) {

        console.log(
          'CREATE SUPPLIER ERROR:',
          error?.response?.data ??
          error
        );


        Alert.alert(
          'Unable to Create Supplier',
          getApiError(
            error,
            'The supplier could not be created.'
          )
        );

      } finally {

        setSaving(
          false
        );

      }

    };


  /*
  |--------------------------------------------------------------------------
  | Screen
  |--------------------------------------------------------------------------
  */

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
              Add Supplier
            </Text>


            <Text
              style={
                styles.subtitle
              }
            >
              Create a new supplier
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
              name="business-outline"
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
            Supplier Information
          </Text>


          <Text
            style={
              styles.cardSubtitle
            }
          >
            Enter supplier, contact and tax information.
          </Text>


          {/* SUPPLIER NUMBER */}

          <Label
            title="Supplier Number"
          />


          <View
            style={
              styles.readOnlyBox
            }
          >

            <Ionicons
              name="lock-closed-outline"
              size={17}
              color={
                Colors.textMuted
              }
            />


            {loadingOptions ? (

              <ActivityIndicator
                size="small"
                color={
                  Colors.primary
                }
                style={{
                  marginLeft: 10,
                }}
              />

            ) : (

              <Text
                style={
                  styles.readOnlyText
                }
              >
                {
                  supplierNo ||
                  'Generated when saved'
                }
              </Text>

            )}

          </View>


          <Text
            style={
              styles.helperLeft
            }
          >
            Supplier number is generated automatically.
          </Text>


          {/* SUPPLIER NAME */}

          <Label
            title="Supplier Name"
            required
          />


          <View
            style={
              styles.inputBox
            }
          >

            <Ionicons
              name="business-outline"
              size={18}
              color={
                Colors.textSecondary
              }
            />


            <TextInput
              value={
                supplierName
              }

              onChangeText={
                setSupplierName
              }

              placeholder="Enter supplier name"

              placeholderTextColor={
                Colors.textMuted
              }

              maxLength={200}

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
            {supplierName.length}/200
          </Text>


          {/* CATEGORY */}

          <Label
            title="Supplier Category"
            required
          />


          <Pressable
            style={[
              styles.selectBox,

              categoryOpen &&
                styles.selectBoxOpen,
            ]}

            onPress={() =>
              setCategoryOpen(
                current =>
                  !current
              )
            }
          >

            <Ionicons
              name="folder-outline"
              size={18}
              color={
                Colors.textSecondary
              }
            />


            <Text
              style={[
                styles.selectText,

                !selectedCategory &&
                  styles.placeholderText,
              ]}
            >
              {
                selectedCategory
                  ?.label ??
                (
                  loadingOptions
                    ? 'Loading categories...'
                    : 'Select supplier category'
                )
              }
            </Text>


            <Ionicons
              name={
                categoryOpen
                  ? 'chevron-up'
                  : 'chevron-down'
              }
              size={17}
              color={
                Colors.textMuted
              }
            />

          </Pressable>


          {categoryOpen && (

            <View
              style={
                styles.optionContainer
              }
            >

              {categories.length ===
              0 ? (

                <Text
                  style={
                    styles.noOptionsText
                  }
                >
                  No active Supplier categories found.
                </Text>

              ) : (

                categories.map(
                  item => {

                    const selected =
                      item.id ===
                      categoryId;


                    return (

                      <Pressable
                        key={
                          item.id
                        }

                        style={[
                          styles.optionItem,

                          selected &&
                            styles.optionSelected,
                        ]}

                        onPress={() => {

                          setCategoryId(
                            item.id
                          );

                          setCategoryOpen(
                            false
                          );

                        }}
                      >

                        <View
                          style={
                            styles.optionIcon
                          }
                        >
                          <Ionicons
                            name="folder-outline"
                            size={16}
                            color={
                              selected
                                ? Colors.primary
                                : Colors.textSecondary
                            }
                          />
                        </View>


                        <Text
                          style={[
                            styles.optionText,

                            selected &&
                              styles.optionTextSelected,
                          ]}
                        >
                          {item.label}
                        </Text>


                        {selected && (

                          <Ionicons
                            name="checkmark-circle"
                            size={18}
                            color={
                              Colors.primary
                            }
                          />

                        )}

                      </Pressable>

                    );

                  }
                )

              )}

            </View>

          )}


          {/* ADDRESS */}

          <Label
            title="Address"
          />


          <View
            style={
              styles.textAreaBox
            }
          >

            <Ionicons
              name="location-outline"
              size={18}
              color={
                Colors.textSecondary
              }
              style={{
                marginTop: 2,
              }}
            />


            <TextInput
              value={
                address
              }

              onChangeText={
                setAddress
              }

              placeholder="Enter supplier address"

              placeholderTextColor={
                Colors.textMuted
              }

              multiline

              textAlignVertical="top"

              style={
                styles.textArea
              }
            />

          </View>


          {/* PHONE */}

          <Label
            title="Phone Number"
            required
          />


          <View
            style={
              styles.inputBox
            }
          >

            <Ionicons
              name="call-outline"
              size={18}
              color={
                Colors.textSecondary
              }
            />


            <TextInput
              value={
                phoneNumber
              }

              onChangeText={
                setPhoneNumber
              }

              placeholder="Enter phone number"

              placeholderTextColor={
                Colors.textMuted
              }

              keyboardType="phone-pad"

              maxLength={50}

              style={
                styles.input
              }
            />

          </View>


          {/* HAS TIN */}

          <Label
            title="Have a TIN Number?"
            required
          />


          <View
            style={
              styles.choiceRow
            }
          >

            <ChoiceButton
              title="Yes"

              icon="checkmark-circle-outline"

              selected={
                hasTin
              }

              onPress={() =>
                setHasTin(
                  true
                )
              }
            />


            <ChoiceButton
              title="No"

              icon="close-circle-outline"

              selected={
                !hasTin
              }

              onPress={() => {

                setHasTin(
                  false
                );

                setTin('');

              }}
            />

          </View>


          {/* TIN */}

          {hasTin && (

            <>

              <Label
                title="TIN Number"
                required
              />


              <View
                style={
                  styles.inputBox
                }
              >

                <Ionicons
                  name="document-text-outline"
                  size={18}
                  color={
                    Colors.textSecondary
                  }
                />


                <TextInput
                  value={
                    tin
                  }

                  onChangeText={
                    setTin
                  }

                  placeholder="Enter TIN number"

                  placeholderTextColor={
                    Colors.textMuted
                  }

                  maxLength={50}

                  style={
                    styles.input
                  }
                />

              </View>

            </>

          )}


          {/* STATUS */}

          <Label
            title="Status"
            required
          />


          <View
            style={
              styles.choiceRow
            }
          >

            <ChoiceButton
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


            <ChoiceButton
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

            style={[
              styles.saveButton,

              saving &&
                styles.disabled,
            ]}

            onPress={
              saveSupplier
            }
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
                  Save Supplier
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
| Choice Button
|--------------------------------------------------------------------------
*/

function ChoiceButton({
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
        styles.choiceButton,

        selected &&
          styles.choiceSelected,
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
          styles.choiceText,

          selected &&
            styles.choiceTextSelected,
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


    /*
    |--------------------------------------------------------------------------
    | Header
    |--------------------------------------------------------------------------
    */

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


    /*
    |--------------------------------------------------------------------------
    | Form
    |--------------------------------------------------------------------------
    */

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


    /*
    |--------------------------------------------------------------------------
    | Labels
    |--------------------------------------------------------------------------
    */

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

      fontFamily:
        Fonts.bold,

      color:
        Colors.danger,
    },


    /*
    |--------------------------------------------------------------------------
    | Inputs
    |--------------------------------------------------------------------------
    */

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


    textAreaBox: {
      minHeight: 95,

      padding: 14,

      flexDirection: 'row',

      alignItems:
        'flex-start',

      borderRadius: 14,

      backgroundColor:
        Colors.background,

      borderWidth: 1,

      borderColor:
        Colors.border,
    },


    textArea: {
      flex: 1,

      minHeight: 65,

      marginLeft: 9,

      paddingTop: 0,

      fontSize: 12,

      lineHeight: 18,

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


    helperLeft: {
      marginTop: 5,

      fontSize: 8,

      fontFamily:
        Fonts.regular,

      color:
        Colors.textMuted,
    },


    /*
    |--------------------------------------------------------------------------
    | Read Only
    |--------------------------------------------------------------------------
    */

    readOnlyBox: {
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


    readOnlyText: {
      marginLeft: 9,

      fontSize: 11,

      fontFamily:
        Fonts.bold,

      color:
        Colors.textSecondary,
    },


    /*
    |--------------------------------------------------------------------------
    | Category
    |--------------------------------------------------------------------------
    */

    selectBox: {
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


    selectBoxOpen: {
      borderColor:
        Colors.primary,
    },


    selectText: {
      flex: 1,

      marginLeft: 9,

      fontSize: 11,

      fontFamily:
        Fonts.medium,

      color:
        Colors.text,
    },


    placeholderText: {
      color:
        Colors.textMuted,

      fontFamily:
        Fonts.regular,
    },


    optionContainer: {
      marginTop: 6,

      maxHeight: 260,

      overflow: 'hidden',

      borderRadius: 14,

      backgroundColor:
        Colors.background,

      borderWidth: 1,

      borderColor:
        Colors.border,
    },


    optionItem: {
      minHeight: 49,

      paddingHorizontal: 13,

      flexDirection: 'row',

      alignItems: 'center',

      borderBottomWidth: 1,

      borderBottomColor:
        Colors.border,
    },


    optionSelected: {
      backgroundColor:
        Colors.primaryLight,
    },


    optionIcon: {
      width: 28,

      alignItems: 'center',
    },


    optionText: {
      flex: 1,

      marginLeft: 4,

      fontSize: 10,

      fontFamily:
        Fonts.medium,

      color:
        Colors.text,
    },


    optionTextSelected: {
      color:
        Colors.primary,

      fontFamily:
        Fonts.bold,
    },


    noOptionsText: {
      padding: 15,

      fontSize: 10,

      fontFamily:
        Fonts.regular,

      color:
        Colors.textMuted,
    },


    /*
    |--------------------------------------------------------------------------
    | Choices
    |--------------------------------------------------------------------------
    */

    choiceRow: {
      flexDirection: 'row',

      gap: 9,
    },


    choiceButton: {
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


    choiceSelected: {
      backgroundColor:
        Colors.primaryLight,

      borderColor:
        Colors.primary,
    },


    choiceText: {
      fontSize: 10,

      fontFamily:
        Fonts.semiBold,

      color:
        Colors.textSecondary,
    },


    choiceTextSelected: {
      color:
        Colors.primary,

      fontFamily:
        Fonts.bold,
    },


    /*
    |--------------------------------------------------------------------------
    | Buttons
    |--------------------------------------------------------------------------
    */

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
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
  SubcontractorStatus,
  SubcontractorTaxPercent,
  SubcontractorType,
  subcontractorsApi,
} from '../../../../api/subcontractorsApi';

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


const TAX_OPTIONS:
  SubcontractorTaxPercent[] = [
    0,
    2,
    10,
    15,
  ];


export default function CreateSubcontractorScreen() {

  /*
  |--------------------------------------------------------------------------
  | Type
  |--------------------------------------------------------------------------
  */

  const [
    type,
    setType,
  ] =
    useState<SubcontractorType>(
      'company'
    );


  /*
  |--------------------------------------------------------------------------
  | Individual
  |--------------------------------------------------------------------------
  */

  const [
    firstname,
    setFirstname,
  ] =
    useState('');


  const [
    lastname,
    setLastname,
  ] =
    useState('');


  /*
  |--------------------------------------------------------------------------
  | Company
  |--------------------------------------------------------------------------
  */

  const [
    companyName,
    setCompanyName,
  ] =
    useState('');


  const [
    tinNo,
    setTinNo,
  ] =
    useState('');


  /*
  |--------------------------------------------------------------------------
  | Common
  |--------------------------------------------------------------------------
  */

  const [
    address,
    setAddress,
  ] =
    useState('');


  const [
    contactPerson,
    setContactPerson,
  ] =
    useState('');


  const [
    phoneNumber,
    setPhoneNumber,
  ] =
    useState('');


  const [
    taxPercent,
    setTaxPercent,
  ] =
    useState<SubcontractorTaxPercent>(
      0
    );


  /*
  |--------------------------------------------------------------------------
  | Category
  |--------------------------------------------------------------------------
  */

  const [
    categories,
    setCategories,
  ] =
    useState<CategoryOption[]>([]);


  const [
    categoryId,
    setCategoryId,
  ] =
    useState<number | null>(
      null
    );


  const [
    categoryOpen,
    setCategoryOpen,
  ] =
    useState(false);


  /*
  |--------------------------------------------------------------------------
  | Status
  |--------------------------------------------------------------------------
  */

  const [
    status,
    setStatus,
  ] =
    useState<SubcontractorStatus>(
      'active'
    );


  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  const [
    loadingCategories,
    setLoadingCategories,
  ] =
    useState(true);


  const [
    saving,
    setSaving,
  ] =
    useState(false);


  /*
  |--------------------------------------------------------------------------
  | Load Categories
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    const loadCategories =
      async () => {

        try {

          const result =
            await categoriesApi
              .options();


          setCategories(
            result ?? []
          );

        } catch (error: any) {

          console.log(
            'SUBCONTRACTOR CATEGORY ERROR:',
            error?.response?.data ??
            error
          );


          Alert.alert(
            'Unable to Load Categories',
            'Unable to load category options.'
          );

        } finally {

          setLoadingCategories(
            false
          );

        }

      };


    loadCategories();

  }, []);


  const selectedCategory =
    categories.find(
      item =>
        item.id ===
        categoryId
    );


  /*
  |--------------------------------------------------------------------------
  | Type Change
  |--------------------------------------------------------------------------
  */

  const changeType =
    (
      newType:
        SubcontractorType
    ) => {

      setType(
        newType
      );


      if (
        newType ===
        'company'
      ) {

        /*
         * Individual fields do not apply
         * to a company.
         */

        setFirstname('');

        setLastname('');

      } else {

        /*
         * Company fields do not apply
         * to an individual.
         */

        setCompanyName('');

        setTinNo('');

      }

    };


  /*
  |--------------------------------------------------------------------------
  | Validation
  |--------------------------------------------------------------------------
  */

  const validate =
    () => {

      /*
      |--------------------------------------------------------------------------
      | Company
      |--------------------------------------------------------------------------
      */

      if (
        type === 'company'
      ) {

        if (
          !companyName.trim()
        ) {

          Alert.alert(
            'Required Field',
            'Company name is required.'
          );

          return false;

        }


        if (
          companyName
            .trim()
            .length > 150
        ) {

          Alert.alert(
            'Invalid Company Name',
            'Company name cannot exceed 150 characters.'
          );

          return false;

        }


        if (
          !tinNo.trim()
        ) {

          Alert.alert(
            'Required Field',
            'TIN number is required for a company.'
          );

          return false;

        }


        if (
          tinNo
            .trim()
            .length > 50
        ) {

          Alert.alert(
            'Invalid TIN',
            'TIN number cannot exceed 50 characters.'
          );

          return false;

        }

      }


      /*
      |--------------------------------------------------------------------------
      | Individual
      |--------------------------------------------------------------------------
      */

      if (
        type === 'individual'
      ) {

        if (
          !firstname.trim()
        ) {

          Alert.alert(
            'Required Field',
            'First name is required.'
          );

          return false;

        }


        if (
          firstname
            .trim()
            .length > 100
        ) {

          Alert.alert(
            'Invalid First Name',
            'First name cannot exceed 100 characters.'
          );

          return false;

        }


        if (
          !lastname.trim()
        ) {

          Alert.alert(
            'Required Field',
            'Last name is required.'
          );

          return false;

        }


        if (
          lastname
            .trim()
            .length > 100
        ) {

          Alert.alert(
            'Invalid Last Name',
            'Last name cannot exceed 100 characters.'
          );

          return false;

        }

      }


      /*
      |--------------------------------------------------------------------------
      | Common
      |--------------------------------------------------------------------------
      */

      if (
        !address.trim()
      ) {

        Alert.alert(
          'Required Field',
          'Address is required.'
        );

        return false;

      }


      if (
        !contactPerson.trim()
      ) {

        Alert.alert(
          'Required Field',
          'Contact person is required.'
        );

        return false;

      }


      if (
        contactPerson
          .trim()
          .length > 100
      ) {

        Alert.alert(
          'Invalid Contact Person',
          'Contact person cannot exceed 100 characters.'
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
          .length > 100
      ) {

        Alert.alert(
          'Invalid Phone Number',
          'Phone number cannot exceed 100 characters.'
        );

        return false;

      }


      if (!categoryId) {

        Alert.alert(
          'Required Field',
          'Please select a category.'
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

  const saveSubcontractor =
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
          await subcontractorsApi.create({

            type,

            firstname:
              type ===
              'individual'
                ? firstname.trim()
                : null,

            lastname:
              type ===
              'individual'
                ? lastname.trim()
                : null,

            company_name:
              type ===
              'company'
                ? companyName.trim()
                : null,

            tin_no:
              type ===
              'company'
                ? tinNo.trim()
                : null,

            address:
              address.trim(),

            contact_person:
              contactPerson.trim(),

            phone_number:
              phoneNumber.trim(),

            tax_percent:
              taxPercent,

            category_id:
              categoryId,

            status,

          });


        Alert.alert(
          'Subcontractor Created',
          `${created.display_name} has been created successfully.`,
          [
            {
              text:
                'View Subcontractor',

              onPress: () =>
                router.replace(
                  `/(app)/management/subcontractors/${created.id}` as any
                ),
            },
          ]
        );

      } catch (error: any) {

        console.log(
          'CREATE SUBCONTRACTOR ERROR:',
          error?.response?.data ??
          error
        );


        Alert.alert(
          'Unable to Create Subcontractor',
          getApiError(
            error,
            'The subcontractor could not be created.'
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
              Add Subcontractor
            </Text>


            <Text
              style={
                styles.subtitle
              }
            >
              Register a company or individual
            </Text>

          </View>

        </View>


        {/* FORM */}

        <View
          style={
            styles.formCard
          }
        >

          <View
            style={
              styles.formHeader
            }
          >

            <View
              style={
                styles.formIcon
              }
            >

              <Ionicons
                name="construct-outline"
                size={25}
                color={
                  Colors.primary
                }
              />

            </View>


            <View
              style={
                styles.formHeaderContent
              }
            >

              <Text
                style={
                  styles.formTitle
                }
              >
                Subcontractor Information
              </Text>


              <Text
                style={
                  styles.formSubtitle
                }
              >
                Select the subcontractor type and complete the required information.
              </Text>

            </View>

          </View>


          {/* TYPE */}

          <Label
            title="Subcontractor Type"
            required
          />


          <View
            style={
              styles.choiceRow
            }
          >

            <ChoiceButton
              title="Company"
              icon="business-outline"

              selected={
                type ===
                'company'
              }

              onPress={() =>
                changeType(
                  'company'
                )
              }
            />


            <ChoiceButton
              title="Individual"
              icon="person-outline"

              selected={
                type ===
                'individual'
              }

              onPress={() =>
                changeType(
                  'individual'
                )
              }
            />

          </View>


          {/* COMPANY FIELDS */}

          {type ===
            'company' && (

            <>

              <Label
                title="Company Name"
                required
              />


              <InputBox
                icon="business-outline"

                value={
                  companyName
                }

                onChangeText={
                  setCompanyName
                }

                placeholder="Enter company name"

                maxLength={150}
              />


              <Label
                title="TIN Number"
                required
              />


              <InputBox
                icon="document-text-outline"

                value={
                  tinNo
                }

                onChangeText={
                  setTinNo
                }

                placeholder="Enter TIN number"

                maxLength={50}
              />

            </>

          )}


          {/* INDIVIDUAL FIELDS */}

          {type ===
            'individual' && (

            <>

              <Label
                title="First Name"
                required
              />


              <InputBox
                icon="person-outline"

                value={
                  firstname
                }

                onChangeText={
                  setFirstname
                }

                placeholder="Enter first name"

                maxLength={100}
              />


              <Label
                title="Last Name"
                required
              />


              <InputBox
                icon="person-outline"

                value={
                  lastname
                }

                onChangeText={
                  setLastname
                }

                placeholder="Enter last name"

                maxLength={100}
              />

            </>

          )}


          {/* ADDRESS */}

          <Label
            title="Address"
            required
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
                marginTop: 3,
              }}
            />


            <TextInput
              value={
                address
              }

              onChangeText={
                setAddress
              }

              placeholder="Enter subcontractor address"

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


          {/* CONTACT PERSON */}

          <Label
            title="Contact Person"
            required
          />


          <InputBox
            icon="person-circle-outline"

            value={
              contactPerson
            }

            onChangeText={
              setContactPerson
            }

            placeholder="Enter contact person"

            maxLength={100}
          />


          {/* PHONE */}

          <Label
            title="Phone Number"
            required
          />


          <InputBox
            icon="call-outline"

            value={
              phoneNumber
            }

            onChangeText={
              setPhoneNumber
            }

            placeholder="Enter phone number"

            keyboardType="phone-pad"

            maxLength={100}
          />


          {/* TAX */}

          <Label
            title="Tax Percent"
            required
          />


          <View
            style={
              styles.taxContainer
            }
          >

            {TAX_OPTIONS.map(
              item => {

                const selected =
                  taxPercent ===
                  item;


                return (

                  <Pressable
                    key={item}

                    style={[
                      styles.taxOption,

                      selected &&
                        styles.taxOptionSelected,
                    ]}

                    onPress={() =>
                      setTaxPercent(
                        item
                      )
                    }
                  >

                    <Ionicons
                      name={
                        selected
                          ? 'radio-button-on'
                          : 'radio-button-off'
                      }
                      size={18}
                      color={
                        selected
                          ? Colors.primary
                          : Colors.textMuted
                      }
                    />


                    <Text
                      style={[
                        styles.taxOptionText,

                        selected &&
                          styles.taxOptionTextSelected,
                      ]}
                    >
                      {item}%
                    </Text>

                  </Pressable>

                );

              }
            )}

          </View>


          {/* CATEGORY */}

          <Label
            title="Category"
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


            {loadingCategories ? (

              <ActivityIndicator
                size="small"
                color={
                  Colors.primary
                }
                style={{
                  marginLeft: 9,
                }}
              />

            ) : (

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
                  'Select category'
                }
              </Text>

            )}


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


          {categoryOpen &&
            !loadingCategories && (

            <View
              style={
                styles.optionContainer
              }
            >

              {categories.length ===
              0 ? (

                <Text
                  style={
                    styles.noOptions
                  }
                >
                  No category options found.
                </Text>

              ) : (

                categories.map(
                  item => (

                    <Pressable
                      key={
                        item.id
                      }

                      style={[
                        styles.optionItem,

                        categoryId ===
                          item.id &&
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

                      <Text
                        style={[
                          styles.optionText,

                          categoryId ===
                            item.id &&
                            styles.optionTextSelected,
                        ]}
                      >
                        {item.label}
                      </Text>


                      {categoryId ===
                        item.id && (

                        <Ionicons
                          name="checkmark"
                          size={17}
                          color={
                            Colors.primary
                          }
                        />

                      )}

                    </Pressable>

                  )
                )

              )}

            </View>

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
              saveSubcontractor
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
                  Save Subcontractor
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
| Input
|--------------------------------------------------------------------------
*/

function InputBox({
  icon,
  value,
  onChangeText,
  placeholder,
  maxLength,
  keyboardType,
}: {
  icon: string;

  value: string;

  onChangeText:
    (value: string) => void;

  placeholder: string;

  maxLength?: number;

  keyboardType?: any;
}) {

  return (
    <View
      style={
        styles.inputBox
      }
    >

      <Ionicons
        name={icon as any}
        size={18}
        color={
          Colors.textSecondary
        }
      />


      <TextInput
        value={
          value
        }

        onChangeText={
          onChangeText
        }

        placeholder={
          placeholder
        }

        placeholderTextColor={
          Colors.textMuted
        }

        maxLength={
          maxLength
        }

        keyboardType={
          keyboardType
        }

        style={
          styles.input
        }
      />

    </View>
  );

}


/*
|--------------------------------------------------------------------------
| Choice
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

  onPress:
    () => void;
}) {

  return (
    <Pressable
      style={[
        styles.choiceButton,

        selected &&
          styles.choiceSelected,
      ]}

      onPress={
        onPress
      }
    >

      <Ionicons
        name={icon as any}
        size={18}
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
| Error
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
      paddingBottom: 55,
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
      marginTop: 22,
      padding: 18,
      borderRadius: 20,
      backgroundColor:
        Colors.surface,
      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    formHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
    },

    formIcon: {
      width: 50,
      height: 50,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        Colors.primaryLight,
    },

    formHeaderContent: {
      flex: 1,
      marginLeft: 11,
    },

    formTitle: {
      fontSize: 14,
      fontFamily:
        Fonts.extraBold,
      color:
        Colors.text,
    },

    formSubtitle: {
      marginTop: 3,
      fontSize: 9,
      lineHeight: 14,
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
      marginTop: 19,
      marginBottom: 7,
      flexDirection: 'row',
      alignItems: 'center',
    },

    label: {
      fontSize: 10,
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
    | Input
    |--------------------------------------------------------------------------
    */

    inputBox: {
      minHeight: 51,
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
      fontSize: 11,
      fontFamily:
        Fonts.regular,
      color:
        Colors.text,
    },

    textAreaBox: {
      minHeight: 110,
      padding: 14,
      flexDirection: 'row',
      alignItems: 'flex-start',
      borderRadius: 14,
      backgroundColor:
        Colors.background,
      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    textArea: {
      flex: 1,
      minHeight: 80,
      marginLeft: 9,
      paddingTop: 0,
      fontSize: 11,
      lineHeight: 18,
      fontFamily:
        Fonts.regular,
      color:
        Colors.text,
    },

    /*
    |--------------------------------------------------------------------------
    | Choice
    |--------------------------------------------------------------------------
    */

    choiceRow: {
      flexDirection: 'row',
      gap: 9,
    },

    choiceButton: {
      flex: 1,
      minHeight: 50,
      paddingHorizontal: 8,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      borderRadius: 14,
      backgroundColor:
        Colors.background,
      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    choiceSelected: {
      borderColor:
        Colors.primary,
      backgroundColor:
        Colors.primaryLight,
    },

    choiceText: {
      fontSize: 9,
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
    | Tax
    |--------------------------------------------------------------------------
    */

    taxContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },

    taxOption: {
      width: '48%',
      minHeight: 48,
      paddingHorizontal: 12,
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 13,
      backgroundColor:
        Colors.background,
      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    taxOptionSelected: {
      borderColor:
        Colors.primary,
      backgroundColor:
        Colors.primaryLight,
    },

    taxOptionText: {
      marginLeft: 7,
      fontSize: 10,
      fontFamily:
        Fonts.medium,
      color:
        Colors.textSecondary,
    },

    taxOptionTextSelected: {
      color:
        Colors.primary,
      fontFamily:
        Fonts.bold,
    },

    /*
    |--------------------------------------------------------------------------
    | Category
    |--------------------------------------------------------------------------
    */

    selectBox: {
      minHeight: 51,
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
      maxHeight: 270,
      overflow: 'hidden',
      borderRadius: 14,
      backgroundColor:
        Colors.background,
      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    optionItem: {
      minHeight: 46,
      paddingHorizontal: 13,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'space-between',
      borderBottomWidth: 1,
      borderBottomColor:
        Colors.border,
    },

    optionSelected: {
      backgroundColor:
        Colors.primaryLight,
    },

    optionText: {
      flex: 1,
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

    noOptions: {
      padding: 14,
      fontSize: 9,
      fontFamily:
        Fonts.regular,
      color:
        Colors.textMuted,
    },

    /*
    |--------------------------------------------------------------------------
    | Buttons
    |--------------------------------------------------------------------------
    */

    saveButton: {
      height: 54,
      marginTop: 27,
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
      backgroundColor:
        Colors.background,
      borderWidth: 1,
      borderColor:
        Colors.border,
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
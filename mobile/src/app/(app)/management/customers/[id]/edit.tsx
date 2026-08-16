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

import {
  router,
  useLocalSearchParams,
} from 'expo-router';

import {
  useEffect,
  useState,
} from 'react';

import {
  Customer,
  CustomerStatus,
  CustomerType,
  customersApi,
} from '../../../../../api/customersApi';

import {
  Colors,
} from '../../../../../constants/colors';

import {
  Fonts,
} from '../../../../../constants/fonts';


export default function EditCustomerScreen() {

  const params =
    useLocalSearchParams();

  const rawId =
    Array.isArray(params.id)
      ? params.id[0]
      : params.id;

  const customerId =
    Number(rawId);


  const [
    customerData,
    setCustomerData,
  ] =
    useState<Customer | null>(
      null
    );


  const [
    customerNo,
    setCustomerNo,
  ] =
    useState('');


  const [
    customerType,
    setCustomerType,
  ] =
    useState<CustomerType>(
      'individual'
    );


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


  const [
    companyName,
    setCompanyName,
  ] =
    useState('');


  const [
    emailAddress,
    setEmailAddress,
  ] =
    useState('');


  const [
    tinNumber,
    setTinNumber,
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
    location,
    setLocation,
  ] =
    useState('');


  const [
    customerStatus,
    setCustomerStatus,
  ] =
    useState<CustomerStatus>(
      'active'
    );


  const [
    withhold,
    setWithhold,
  ] =
    useState(false);


  const [
    withholdPercent,
    setWithholdPercent,
  ] =
    useState('');


  const [
    withholdFromAdvance,
    setWithholdFromAdvance,
  ] =
    useState(false);


  const [
    loading,
    setLoading,
  ] =
    useState(true);


  const [
    saving,
    setSaving,
  ] =
    useState(false);


  /*
  |--------------------------------------------------------------------------
  | Load Customer
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    const load =
      async () => {

        if (
          !customerId ||
          Number.isNaN(
            customerId
          )
        ) {

          Alert.alert(
            'Invalid Customer',
            'The customer ID is invalid.',
            [
              {
                text: 'OK',
                onPress: () =>
                  router.back(),
              },
            ]
          );

          setLoading(false);

          return;
        }


        try {

          setLoading(true);


          const customer =
            await customersApi.get(
              customerId
            );


          setCustomerData(
            customer
          );


          setCustomerNo(
            customer.customer_no ??
            ''
          );


          setCustomerType(
            customer.customer_type ===
            'company'
              ? 'company'
              : 'individual'
          );


          setFirstname(
            customer.firstname ??
            ''
          );


          setLastname(
            customer.lastname ??
            ''
          );


          setCompanyName(
            customer.company_name ??
            ''
          );


          setEmailAddress(
            customer.email_address ??
            ''
          );


          setTinNumber(
            customer.tin_number ??
            ''
          );


          setContactPerson(
            customer.contact_person ??
            ''
          );


          setPhoneNumber(
            customer.phone_number ??
            ''
          );


          setLocation(
            customer.location ??
            ''
          );


          setCustomerStatus(
            customer.customer_status ===
            'inactive'
              ? 'inactive'
              : 'active'
          );


          const customerWithhold =
            toBoolean(
              customer.withhold
            );


          setWithhold(
            customerWithhold
          );


          setWithholdPercent(
            customerWithhold &&
            customer.withhold_percent !==
              null &&
            customer.withhold_percent !==
              undefined
              ? String(
                  customer.withhold_percent
                )
              : ''
          );


          setWithholdFromAdvance(
            toBoolean(
              customer
                .withhold_from_advance
            )
          );

        } catch (error: any) {

          console.log(
            'EDIT CUSTOMER LOAD ERROR:',
            error?.response?.data ??
            error
          );


          Alert.alert(
            'Unable to Load',
            getApiError(
              error,
              'Unable to load customer.'
            ),
            [
              {
                text: 'OK',
                onPress: () =>
                  router.back(),
              },
            ]
          );

        } finally {

          setLoading(false);

        }

      };


    load();

  }, [
    customerId,
  ]);


  /*
  |--------------------------------------------------------------------------
  | Validation
  |--------------------------------------------------------------------------
  */

  const validate =
    () => {

      if (
        customerType ===
        'individual'
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
          !lastname.trim()
        ) {

          Alert.alert(
            'Required Field',
            'Last name is required.'
          );

          return false;
        }

      }


      if (
        customerType ===
        'company'
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
          !tinNumber.trim()
        ) {

          Alert.alert(
            'Required Field',
            'TIN number is required for company customers.'
          );

          return false;
        }

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
        !location.trim()
      ) {

        Alert.alert(
          'Required Field',
          'Location is required.'
        );

        return false;
      }


      if (
        withhold &&
        !withholdPercent.trim()
      ) {

        Alert.alert(
          'Required Field',
          'Withhold percent is required.'
        );

        return false;
      }


      if (withhold) {

        const percent =
          Number(
            withholdPercent
          );


        if (
          Number.isNaN(
            percent
          ) ||
          percent < 0 ||
          percent > 100
        ) {

          Alert.alert(
            'Invalid Withhold',
            'Withhold percent must be between 0 and 100.'
          );

          return false;
        }

      }


      return true;

    };


  /*
  |--------------------------------------------------------------------------
  | Update
  |--------------------------------------------------------------------------
  */

  const updateCustomer =
    async () => {

      if (
        saving ||
        !validate()
      ) {
        return;
      }


      try {

        setSaving(true);


        const updated =
          await customersApi.update(
            customerId,
            {

              customer_type:
                customerType,

              firstname:
                customerType ===
                'individual'
                  ? firstname.trim()
                  : null,

              lastname:
                customerType ===
                'individual'
                  ? lastname.trim()
                  : null,

              company_name:
                customerType ===
                'company'
                  ? companyName.trim()
                  : null,

              email_address:
                emailAddress.trim()
                  ? emailAddress.trim()
                  : null,

              tin_number:
                customerType ===
                'company'
                  ? tinNumber.trim()
                  : null,

              contact_person:
                contactPerson.trim()
                  ? contactPerson.trim()
                  : null,

              phone_number:
                phoneNumber.trim(),

              location:
                location.trim(),

              customer_status:
                customerStatus,

              withhold,

              withhold_percent:
                withhold
                  ? Number(
                      withholdPercent
                    )
                  : null,

              withhold_from_advance:
                withholdFromAdvance,

            }
          );


        setCustomerData(
          updated
        );


        Alert.alert(
          'Customer Updated',
          `${updated.customer_no} - ${updated.display_name} has been updated successfully.`,
          [
            {
              text: 'OK',

              onPress: () =>
                router.replace(
                  `/(app)/management/customers/${customerId}` as any
                ),
            },
          ]
        );

      } catch (error: any) {

        console.log(
          'UPDATE CUSTOMER ERROR:',
          error?.response?.data ??
          error
        );


        Alert.alert(
          'Unable to Update Customer',
          getApiError(
            error,
            'The customer could not be updated.'
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
          style={styles.center}
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
            Loading customer...
          </Text>

        </View>

      </SafeAreaView>
    );

  }


  if (!customerData) {

    return (
      <SafeAreaView
        style={styles.safeArea}
      >

        <View
          style={styles.center}
        >

          <Ionicons
            name="alert-circle-outline"
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
            Customer not found
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
        keyboardShouldPersistTaps="handled"
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
              size={21}
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
              Edit Customer
            </Text>

            <Text
              style={styles.subtitle}
            >
              Update customer information
            </Text>

          </View>

        </View>


        <View
          style={styles.formCard}
        >

          <View
            style={styles.heroIcon}
          >
            <Ionicons
              name="create-outline"
              size={27}
              color={Colors.primary}
            />
          </View>


          <Text
            style={styles.cardTitle}
          >
            Customer Information
          </Text>


          {/* NUMBER */}

          <Label
            title="Customer Number"
          />

          <View
            style={styles.readOnlyBox}
          >

            <Ionicons
              name="lock-closed-outline"
              size={17}
              color={Colors.textMuted}
            />

            <Text
              style={
                styles.readOnlyText
              }
            >
              {customerNo}
            </Text>

          </View>


          {/* TYPE */}

          <Label
            title="Customer Type"
            required
          />

          <View
            style={styles.choiceRow}
          >

            <ChoiceButton
              title="Individual"
              icon="person-outline"
              selected={
                customerType ===
                'individual'
              }
              onPress={() => {

                setCustomerType(
                  'individual'
                );

                setCompanyName('');

                setTinNumber('');

              }}
            />


            <ChoiceButton
              title="Company"
              icon="business-outline"
              selected={
                customerType ===
                'company'
              }
              onPress={() => {

                setCustomerType(
                  'company'
                );

                setFirstname('');

                setLastname('');

              }}
            />

          </View>


          {/* INDIVIDUAL */}

          {customerType ===
          'individual' ? (

            <>

              <Label
                title="First Name"
                required
              />

              <InputBox
                icon="person-outline"
                value={firstname}
                onChangeText={
                  setFirstname
                }
                placeholder="Enter first name"
                maxLength={50}
              />


              <Label
                title="Last Name"
                required
              />

              <InputBox
                icon="person-outline"
                value={lastname}
                onChangeText={
                  setLastname
                }
                placeholder="Enter last name"
                maxLength={50}
              />

            </>

          ) : (

            <>

              <Label
                title="Company Name"
                required
              />

              <InputBox
                icon="business-outline"
                value={companyName}
                onChangeText={
                  setCompanyName
                }
                placeholder="Enter company name"
                maxLength={200}
              />


              <Label
                title="TIN Number"
                required
              />

              <InputBox
                icon="document-text-outline"
                value={tinNumber}
                onChangeText={
                  setTinNumber
                }
                placeholder="Enter TIN number"
                maxLength={50}
              />

            </>

          )}


          {/* EMAIL */}

          <Label
            title="Email Address"
          />

          <InputBox
            icon="mail-outline"
            value={emailAddress}
            onChangeText={
              setEmailAddress
            }
            placeholder="Enter email address"
            keyboardType="email-address"
            maxLength={100}
          />


          {/* CONTACT */}

          <Label
            title="Contact Person"
          />

          <InputBox
            icon="people-outline"
            value={contactPerson}
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
            value={phoneNumber}
            onChangeText={
              setPhoneNumber
            }
            placeholder="Enter phone number"
            keyboardType="phone-pad"
            maxLength={50}
          />


          {/* LOCATION */}

          <Label
            title="Location"
            required
          />

          <InputBox
            icon="location-outline"
            value={location}
            onChangeText={
              setLocation
            }
            placeholder="Enter location"
            maxLength={100}
          />


          {/* WITHHOLD */}

          <Label
            title="Withhold?"
            required
          />

          <View
            style={styles.choiceRow}
          >

            <ChoiceButton
              title="Yes"
              icon="checkmark-circle-outline"
              selected={withhold}
              onPress={() =>
                setWithhold(true)
              }
            />


            <ChoiceButton
              title="No"
              icon="close-circle-outline"
              selected={!withhold}
              onPress={() => {

                setWithhold(false);

                setWithholdPercent('');

              }}
            />

          </View>


          {withhold && (

            <>

              <Label
                title="Withhold Percent"
                required
              />

              <InputBox
                icon="analytics-outline"
                value={withholdPercent}
                onChangeText={
                  setWithholdPercent
                }
                placeholder="0 - 100"
                keyboardType="decimal-pad"
              />

            </>

          )}


          {/* ADVANCE */}

          <Label
            title="Withhold From Advance?"
            required
          />

          <View
            style={styles.choiceRow}
          >

            <ChoiceButton
              title="Yes"
              icon="checkmark-circle-outline"
              selected={
                withholdFromAdvance
              }
              onPress={() =>
                setWithholdFromAdvance(
                  true
                )
              }
            />


            <ChoiceButton
              title="No"
              icon="close-circle-outline"
              selected={
                !withholdFromAdvance
              }
              onPress={() =>
                setWithholdFromAdvance(
                  false
                )
              }
            />

          </View>


          {/* STATUS */}

          <Label
            title="Status"
            required
          />

          <View
            style={styles.choiceRow}
          >

            <ChoiceButton
              title="Active"
              icon="checkmark-circle-outline"
              selected={
                customerStatus ===
                'active'
              }
              onPress={() =>
                setCustomerStatus(
                  'active'
                )
              }
            />


            <ChoiceButton
              title="Inactive"
              icon="pause-circle-outline"
              selected={
                customerStatus ===
                'inactive'
              }
              onPress={() =>
                setCustomerStatus(
                  'inactive'
                )
              }
            />

          </View>


          {/* UPDATE */}

          <Pressable
            disabled={saving}
            style={[
              styles.saveButton,
              saving &&
                styles.disabled,
            ]}
            onPress={
              updateCustomer
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
                  style={styles.saveText}
                >
                  Update Customer
                </Text>
              </>

            )}

          </Pressable>


          <Pressable
            disabled={saving}
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
| Input
|--------------------------------------------------------------------------
*/

function InputBox({
  icon,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  maxLength,
}: {
  icon: string;
  value: string;
  onChangeText:
    (value: string) => void;
  placeholder: string;
  keyboardType?: any;
  maxLength?: number;
}) {

  return (
    <View
      style={styles.inputBox}
    >

      <Ionicons
        name={icon as any}
        size={18}
        color={
          Colors.textSecondary
        }
      />

      <TextInput
        value={value}
        onChangeText={
          onChangeText
        }
        placeholder={
          placeholder
        }
        placeholderTextColor={
          Colors.textMuted
        }
        keyboardType={
          keyboardType
        }
        maxLength={
          maxLength
        }
        autoCapitalize={
          keyboardType ===
          'email-address'
            ? 'none'
            : 'sentences'
        }
        style={styles.input}
      />

    </View>
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
      style={styles.labelRow}
    >

      <Text style={styles.label}>
        {title}
      </Text>

      {required && (
        <Text
          style={styles.required}
        >
          *
        </Text>
      )}

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
  onPress: () => void;
}) {

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.choiceButton,
        selected &&
          styles.choiceSelected,
      ]}
    >

      <Ionicons
        name={icon as any}
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
| Helpers
|--------------------------------------------------------------------------
*/

function toBoolean(
  value: unknown
) {

  return (
    value === true ||
    value === 1 ||
    value === '1' ||
    value === 'true' ||
    value === 'Yes'
  );
}


function getApiError(
  error: any,
  fallback: string
) {

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
      paddingHorizontal: 18,
      paddingTop: 12,
      paddingBottom: 50,
    },

    center: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    },

    loadingText: {
      marginTop: 12,
      fontSize: 10,
      fontFamily:
        Fonts.regular,
      color:
        Colors.textSecondary,
    },

    notFoundTitle: {
      marginTop: 12,
      fontSize: 15,
      fontFamily:
        Fonts.bold,
      color:
        Colors.text,
    },

    goBackButton: {
      marginTop: 17,
      paddingHorizontal: 20,
      paddingVertical: 11,
      borderRadius: 12,
      backgroundColor:
        Colors.primary,
    },

    goBackText: {
      fontSize: 10,
      fontFamily:
        Fonts.bold,
      color: '#FFFFFF',
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
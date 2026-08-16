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
  Purchaser,
  PurchaserStatus,
  purchasersApi,
} from '../../../../../api/purchasersApi';

import {
  Colors,
} from '../../../../../constants/colors';

import {
  Fonts,
} from '../../../../../constants/fonts';


export default function EditPurchaserScreen() {

  const params =
    useLocalSearchParams();


  const rawId =
    Array.isArray(params.id)
      ? params.id[0]
      : params.id;


  const purchaserId =
    Number(rawId);


  const [
    purchaser,
    setPurchaser,
  ] =
    useState<Purchaser | null>(
      null
    );


  const [
    purchaserNo,
    setPurchaserNo,
  ] =
    useState('');


  const [
    purchaserName,
    setPurchaserName,
  ] =
    useState('');


  const [
    status,
    setStatus,
  ] =
    useState<PurchaserStatus>(
      'active'
    );


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
  | Load Purchaser
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    const loadPurchaser =
      async () => {

        if (
          !purchaserId ||
          Number.isNaN(
            purchaserId
          )
        ) {

          Alert.alert(
            'Invalid Purchaser',
            'The purchaser ID is invalid.',
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


          const result =
            await purchasersApi.get(
              purchaserId
            );


          setPurchaser(
            result
          );


          setPurchaserNo(
            result.purchaser_no ??
            ''
          );


          setPurchaserName(
            result.purchaser_name ??
            ''
          );


          setStatus(
            result.status ===
            'inactive'
              ? 'inactive'
              : 'active'
          );

        } catch (error: any) {

          console.log(
            'EDIT PURCHASER LOAD ERROR:',
            error?.response?.data ??
            error
          );


          Alert.alert(
            'Unable to Load',
            getApiError(
              error,
              'Unable to load purchaser.'
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


    loadPurchaser();

  }, [
    purchaserId,
  ]);


  /*
  |--------------------------------------------------------------------------
  | Validation
  |--------------------------------------------------------------------------
  */

  const validate =
    () => {

      if (
        !purchaserName.trim()
      ) {

        Alert.alert(
          'Required Field',
          'Purchaser name is required.'
        );

        return false;

      }


      if (
        purchaserName
          .trim()
          .length > 100
      ) {

        Alert.alert(
          'Invalid Purchaser Name',
          'Purchaser name cannot exceed 100 characters.'
        );

        return false;

      }


      return true;

    };


  /*
  |--------------------------------------------------------------------------
  | Update
  |--------------------------------------------------------------------------
  */

  const updatePurchaser =
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
          await purchasersApi.update(
            purchaserId,
            {

              purchaser_name:
                purchaserName.trim(),

              status,

            }
          );


        setPurchaser(
          updated
        );


        Alert.alert(
          'Purchaser Updated',
          `${updated.purchaser_no} - ${updated.purchaser_name} has been updated successfully.`,
          [
            {
              text: 'OK',

              onPress: () =>
                router.replace(
                  `/(app)/management/purchasers/${purchaserId}` as any
                ),
            },
          ]
        );

      } catch (error: any) {

        console.log(
          'UPDATE PURCHASER ERROR:',
          error?.response?.data ??
          error
        );


        Alert.alert(
          'Unable to Update Purchaser',
          getApiError(
            error,
            'The purchaser could not be updated.'
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
            styles.center
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
            Loading purchaser...
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

  if (!purchaser) {

    return (
      <SafeAreaView
        style={
          styles.safeArea
        }
      >

        <View
          style={
            styles.center
          }
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
            Purchaser not found
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
              Edit Purchaser
            </Text>


            <Text
              style={
                styles.subtitle
              }
            >
              Update purchaser information
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
              styles.heroIcon
            }
          >

            <Ionicons
              name="create-outline"
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
            Purchaser Information
          </Text>


          <Text
            style={
              styles.cardSubtitle
            }
          >
            Bank accounts are managed separately from the purchaser details screen.
          </Text>


          {/* NUMBER */}

          <Label
            title="Purchaser Number"
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


            <Text
              style={
                styles.readOnlyText
              }
            >
              {purchaserNo}
            </Text>

          </View>


          <Text
            style={
              styles.helperText
            }
          >
            Purchaser number cannot be changed.
          </Text>


          {/* NAME */}

          <Label
            title="Purchaser Name"
            required
          />


          <View
            style={
              styles.inputBox
            }
          >

            <Ionicons
              name="person-outline"
              size={18}
              color={
                Colors.textSecondary
              }
            />


            <TextInput
              value={
                purchaserName
              }

              onChangeText={
                setPurchaserName
              }

              placeholder="Enter purchaser name"

              placeholderTextColor={
                Colors.textMuted
              }

              maxLength={100}

              autoCapitalize="words"

              style={
                styles.input
              }
            />

          </View>


          <Text
            style={
              styles.counterText
            }
          >
            {purchaserName.length}/100
          </Text>


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


          {/* ACCOUNT INFORMATION */}

          <View
            style={
              styles.accountInfoCard
            }
          >

            <View
              style={
                styles.accountInfoIcon
              }
            >

              <Ionicons
                name="wallet-outline"
                size={19}
                color={
                  Colors.primary
                }
              />

            </View>


            <View
              style={
                styles.accountInfoContent
              }
            >

              <Text
                style={
                  styles.accountInfoTitle
                }
              >
                Bank Accounts
              </Text>


              <Text
                style={
                  styles.accountInfoText
                }
              >
                {
                  purchaser.accounts_count ??
                  purchaser.accounts
                    ?.length ??
                  0
                } account(s) are linked to this purchaser.
              </Text>

            </View>

          </View>


          {/* UPDATE */}

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
              updatePurchaser
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
                  Update Purchaser
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
      paddingBottom: 50,
    },

    center: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    },

    loadingText: {
      marginTop: 11,
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

    helperText: {
      marginTop: 5,
      fontSize: 8,
      lineHeight: 13,
      fontFamily:
        Fonts.regular,
      color:
        Colors.textMuted,
    },

    /*
    |--------------------------------------------------------------------------
    | Input
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

    counterText: {
      marginTop: 5,
      textAlign: 'right',
      fontSize: 8,
      fontFamily:
        Fonts.regular,
      color:
        Colors.textMuted,
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
      borderColor:
        Colors.primary,
      backgroundColor:
        Colors.primaryLight,
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
    | Account Information
    |--------------------------------------------------------------------------
    */

    accountInfoCard: {
      marginTop: 22,
      padding: 13,
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 14,
      backgroundColor:
        Colors.background,
      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    accountInfoIcon: {
      width: 40,
      height: 40,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        Colors.primaryLight,
    },

    accountInfoContent: {
      flex: 1,
      marginLeft: 10,
    },

    accountInfoTitle: {
      fontSize: 10,
      fontFamily:
        Fonts.bold,
      color:
        Colors.text,
    },

    accountInfoText: {
      marginTop: 3,
      fontSize: 8,
      lineHeight: 13,
      fontFamily:
        Fonts.regular,
      color:
        Colors.textSecondary,
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
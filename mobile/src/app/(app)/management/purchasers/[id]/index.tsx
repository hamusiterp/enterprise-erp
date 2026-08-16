import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  RefreshControl,
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
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  banksApi,
} from '../../../../../api/banksApi';

import {
  Purchaser,
  PurchaserAccount,
  PurchaserAccountPayload,
  PurchaserAccountStatus,
  PurchaserCurrency,
  purchasersApi,
} from '../../../../../api/purchasersApi';

import {
  Colors,
} from '../../../../../constants/colors';

import {
  Fonts,
} from '../../../../../constants/fonts';


/*
|--------------------------------------------------------------------------
| Bank Option
|--------------------------------------------------------------------------
*/

interface BankOption {
  id: number;
  label: string;
}


const CURRENCIES: PurchaserCurrency[] = [
  'ETB',
  'USD',
  'EUR',
  'GBP',
  'AED',
  'JPY',
  'CNY',
];


/*
|--------------------------------------------------------------------------
| Screen
|--------------------------------------------------------------------------
*/

export default function PurchaserDetailsScreen() {

  const params =
    useLocalSearchParams();


  const rawId =
    Array.isArray(params.id)
      ? params.id[0]
      : params.id;


  const purchaserId =
    Number(rawId);


  /*
  |--------------------------------------------------------------------------
  | Purchaser
  |--------------------------------------------------------------------------
  */

  const [
    purchaser,
    setPurchaser,
  ] =
    useState<Purchaser | null>(
      null
    );


  const [
    loading,
    setLoading,
  ] =
    useState(true);


  const [
    refreshing,
    setRefreshing,
  ] =
    useState(false);


  const [
    deleting,
    setDeleting,
  ] =
    useState(false);


  /*
  |--------------------------------------------------------------------------
  | Banks
  |--------------------------------------------------------------------------
  */

  const [
    banks,
    setBanks,
  ] =
    useState<BankOption[]>([]);


  /*
  |--------------------------------------------------------------------------
  | Account Modal
  |--------------------------------------------------------------------------
  */

  const [
    accountModalVisible,
    setAccountModalVisible,
  ] =
    useState(false);


  const [
    editingAccount,
    setEditingAccount,
  ] =
    useState<PurchaserAccount | null>(
      null
    );


  const [
    bankId,
    setBankId,
  ] =
    useState<number | null>(
      null
    );


  const [
    bankOpen,
    setBankOpen,
  ] =
    useState(false);


  const [
    accountNumber,
    setAccountNumber,
  ] =
    useState('');


  const [
    accountName,
    setAccountName,
  ] =
    useState('');


  const [
    currency,
    setCurrency,
  ] =
    useState<PurchaserCurrency>(
      'ETB'
    );


  const [
    currencyOpen,
    setCurrencyOpen,
  ] =
    useState(false);


  const [
    isPrimary,
    setIsPrimary,
  ] =
    useState(false);


  const [
    accountStatus,
    setAccountStatus,
  ] =
    useState<PurchaserAccountStatus>(
      'active'
    );


  const [
    savingAccount,
    setSavingAccount,
  ] =
    useState(false);


  const [
    processingAccountId,
    setProcessingAccountId,
  ] =
    useState<number | null>(
      null
    );


  /*
  |--------------------------------------------------------------------------
  | Load Purchaser
  |--------------------------------------------------------------------------
  */

  const loadPurchaser =
    useCallback(
      async () => {

        if (
          !purchaserId ||
          Number.isNaN(
            purchaserId
          )
        ) {

          setLoading(false);

          return;
        }


        try {

          const result =
            await purchasersApi.get(
              purchaserId
            );


          setPurchaser(
            result
          );

        } catch (error: any) {

          console.log(
            'PURCHASER DETAILS ERROR:',
            error?.response?.data ??
            error
          );


          Alert.alert(
            'Unable to Load',
            getApiError(
              error,
              'Unable to load purchaser.'
            )
          );

        } finally {

          setLoading(false);

          setRefreshing(false);

        }

      },
      [
        purchaserId,
      ]
    );


  /*
  |--------------------------------------------------------------------------
  | Load Banks
  |--------------------------------------------------------------------------
  |
  | If your Banks options route is named differently,
  | only change this function.
  |
  */

  const loadBanks =
  useCallback(
    async () => {

      try {

        const result =
          await banksApi.list({

            status: 'active',

            per_page: 100,

            page: 1,

            sort_by: 'bank_name',

            sort_direction: 'asc',

          });


        const options:
          BankOption[] =
          result.data.map(
            bank => ({

              id:
                bank.id,

              label:
                bank.bank_name,

            })
          );


        setBanks(
          options
        );

      } catch (error: any) {

        console.log(
          'BANK LIST ERROR:',
          error?.response?.data ??
          error
        );


        Alert.alert(
          'Unable to Load Banks',
          error?.response?.data?.message ??
          'Unable to load bank list.'
        );

      }

    },
    []
  );


  /*
  |--------------------------------------------------------------------------
  | Initial Load
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    loadPurchaser();

    loadBanks();

  }, [
    loadPurchaser,
    loadBanks,
  ]);


  /*
  |--------------------------------------------------------------------------
  | Refresh
  |--------------------------------------------------------------------------
  */

  const refresh =
    async () => {

      setRefreshing(true);


      await Promise.all([
        loadPurchaser(),
        loadBanks(),
      ]);

    };


  /*
  |--------------------------------------------------------------------------
  | Open Create Account
  |--------------------------------------------------------------------------
  */

  const openCreateAccount =
    () => {

      setEditingAccount(
        null
      );

      setBankId(
        null
      );

      setAccountNumber(
        ''
      );

      setAccountName(
        ''
      );

      setCurrency(
        'ETB'
      );

      setIsPrimary(
        false
      );

      setAccountStatus(
        'active'
      );

      setBankOpen(
        false
      );

      setCurrencyOpen(
        false
      );

      setAccountModalVisible(
        true
      );

    };


  /*
  |--------------------------------------------------------------------------
  | Open Edit Account
  |--------------------------------------------------------------------------
  */

  const openEditAccount =
    (
      account:
        PurchaserAccount
    ) => {

      setEditingAccount(
        account
      );


      setBankId(
        account.bank_id
      );


      setAccountNumber(
        account.account_number ??
        ''
      );


      setAccountName(
        account.account_name ??
        ''
      );


      setCurrency(
        account.currency ??
        'ETB'
      );


      setIsPrimary(
        toBoolean(
          account.is_primary
        )
      );


      setAccountStatus(
        account.status ===
        'inactive'
          ? 'inactive'
          : 'active'
      );


      setBankOpen(
        false
      );


      setCurrencyOpen(
        false
      );


      setAccountModalVisible(
        true
      );

    };


  /*
  |--------------------------------------------------------------------------
  | Close Account Modal
  |--------------------------------------------------------------------------
  */

  const closeAccountModal =
    () => {

      if (
        savingAccount
      ) {
        return;
      }


      setAccountModalVisible(
        false
      );


      setEditingAccount(
        null
      );

    };


  /*
  |--------------------------------------------------------------------------
  | Account Validation
  |--------------------------------------------------------------------------
  */

  const validateAccount =
    () => {

      if (!bankId) {

        Alert.alert(
          'Required Field',
          'Please select a bank.'
        );

        return false;

      }


      if (
        !accountNumber.trim()
      ) {

        Alert.alert(
          'Required Field',
          'Account number is required.'
        );

        return false;

      }


      if (
        accountNumber
          .trim()
          .length > 50
      ) {

        Alert.alert(
          'Invalid Account Number',
          'Account number cannot exceed 50 characters.'
        );

        return false;

      }


      if (
        accountName
          .trim()
          .length > 100
      ) {

        Alert.alert(
          'Invalid Account Name',
          'Account name cannot exceed 100 characters.'
        );

        return false;

      }


      return true;

    };


  /*
  |--------------------------------------------------------------------------
  | Save Account
  |--------------------------------------------------------------------------
  */

  const saveAccount =
    async () => {

      if (
        savingAccount ||
        !validateAccount() ||
        !bankId
      ) {
        return;
      }


      const payload:
        PurchaserAccountPayload = {

          bank_id:
            bankId,

          account_number:
            accountNumber.trim(),

          account_name:
            accountName.trim()
              ? accountName.trim()
              : null,

          currency,

          is_primary:
            isPrimary,

          status:
            accountStatus,

        };


      try {

        setSavingAccount(
          true
        );


        if (
          editingAccount
        ) {

          await purchasersApi
            .updateAccount(
              purchaserId,
              editingAccount.id,
              payload
            );


          Alert.alert(
            'Account Updated',
            'Bank account updated successfully.'
          );

        } else {

          await purchasersApi
            .createAccount(
              purchaserId,
              payload
            );


          Alert.alert(
            'Account Added',
            'Bank account added successfully.'
          );

        }


        setAccountModalVisible(
          false
        );


        setEditingAccount(
          null
        );


        await loadPurchaser();

      } catch (error: any) {

        console.log(
          'SAVE ACCOUNT ERROR:',
          error?.response?.data ??
          error
        );


        Alert.alert(
          editingAccount
            ? 'Unable to Update Account'
            : 'Unable to Add Account',

          getApiError(
            error,
            'The bank account could not be saved.'
          )
        );

      } finally {

        setSavingAccount(
          false
        );

      }

    };


  /*
  |--------------------------------------------------------------------------
  | Set Primary
  |--------------------------------------------------------------------------
  */

  const setPrimary =
    (
      account:
        PurchaserAccount
    ) => {

      if (
        toBoolean(
          account.is_primary
        )
      ) {
        return;
      }


      Alert.alert(
        'Set Primary Account',

        `Make ${account.account_number} the primary account?`,

        [
          {
            text: 'Cancel',
            style: 'cancel',
          },

          {
            text:
              'Set Primary',

            onPress:
              async () => {

                try {

                  setProcessingAccountId(
                    account.id
                  );


                  await purchasersApi
                    .setPrimaryAccount(
                      purchaserId,
                      account.id
                    );


                  Alert.alert(
                    'Primary Account Updated',
                    'The primary account has been updated.'
                  );


                  await loadPurchaser();

                } catch (error: any) {

                  Alert.alert(
                    'Unable to Update',
                    getApiError(
                      error,
                      'Unable to set the primary account.'
                    )
                  );

                } finally {

                  setProcessingAccountId(
                    null
                  );

                }

              },
          },
        ]
      );

    };


  /*
  |--------------------------------------------------------------------------
  | Delete Account
  |--------------------------------------------------------------------------
  */

  const deleteAccount =
    (
      account:
        PurchaserAccount
    ) => {

      Alert.alert(
        'Delete Bank Account',

        `Delete account ${account.account_number}?`,

        [
          {
            text: 'Cancel',
            style: 'cancel',
          },

          {
            text: 'Delete',

            style:
              'destructive',

            onPress:
              async () => {

                try {

                  setProcessingAccountId(
                    account.id
                  );


                  await purchasersApi
                    .deleteAccount(
                      purchaserId,
                      account.id
                    );


                  Alert.alert(
                    'Account Deleted',
                    'Bank account deleted successfully.'
                  );


                  await loadPurchaser();

                } catch (error: any) {

                  Alert.alert(
                    'Unable to Delete',
                    getApiError(
                      error,
                      'Unable to delete bank account.'
                    )
                  );

                } finally {

                  setProcessingAccountId(
                    null
                  );

                }

              },
          },
        ]
      );

    };


  /*
  |--------------------------------------------------------------------------
  | Delete Purchaser
  |--------------------------------------------------------------------------
  */

  const deletePurchaser =
    () => {

      if (
        !purchaser ||
        deleting
      ) {
        return;
      }


      Alert.alert(
        'Delete Purchaser',

        `Move ${purchaser.purchaser_no} - ${purchaser.purchaser_name} to the recycle bin?`,

        [
          {
            text: 'Cancel',
            style: 'cancel',
          },

          {
            text: 'Delete',

            style:
              'destructive',

            onPress:
              async () => {

                try {

                  setDeleting(
                    true
                  );


                  await purchasersApi
                    .remove(
                      purchaser.id
                    );


                  Alert.alert(
                    'Purchaser Deleted',
                    'Purchaser moved to the recycle bin.',
                    [
                      {
                        text: 'OK',

                        onPress: () =>
                          router.back(),
                      },
                    ]
                  );

                } catch (error: any) {

                  Alert.alert(
                    'Unable to Delete',
                    getApiError(
                      error,
                      'Unable to delete purchaser.'
                    )
                  );

                } finally {

                  setDeleting(
                    false
                  );

                }

              },
          },
        ]
      );

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


  const active =
    purchaser.status ===
    'active';


  const accounts =
    purchaser.accounts ??
    [];


  const primary =
    purchaser.primary_account ??
    accounts.find(
      item =>
        toBoolean(
          item.is_primary
        )
    ) ??
    null;


  const selectedBank =
    banks.find(
      item =>
        item.id ===
        bankId
    );


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

        refreshControl={
          <RefreshControl
            refreshing={
              refreshing
            }

            onRefresh={
              refresh
            }
          />
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
              Purchaser Details
            </Text>


            <Text
              style={
                styles.subtitle
              }
            >
              {purchaser.purchaser_no}
            </Text>

          </View>


          <Pressable
            style={
              styles.editButton
            }

            onPress={() =>
              router.push(
                `/(app)/management/purchasers/${purchaser.id}/edit` as any
              )
            }
          >

            <Ionicons
              name="create-outline"
              size={20}
              color="#FFFFFF"
            />

          </Pressable>

        </View>


        {/* HERO */}

        <View
          style={
            styles.heroCard
          }
        >

          <View
            style={
              styles.heroTop
            }
          >

            <View
              style={
                styles.heroIcon
              }
            >

              <Ionicons
                name="person-outline"
                size={27}
                color={
                  Colors.primary
                }
              />

            </View>


            <View
              style={
                styles.heroContent
              }
            >

              <Text
                style={
                  styles.purchaserNo
                }
              >
                {
                  purchaser.purchaser_no
                }
              </Text>


              <Text
                style={
                  styles.purchaserName
                }
              >
                {
                  purchaser.purchaser_name
                }
              </Text>

            </View>


            <View
              style={[
                styles.statusBadge,

                !active &&
                  styles.inactiveBadge,
              ]}
            >

              <Text
                style={
                  styles.statusText
                }
              >
                {
                  active
                    ? 'Active'
                    : 'Inactive'
                }
              </Text>

            </View>

          </View>


          <View
            style={
              styles.heroStats
            }
          >

            <HeroStat
              value={
                purchaser.accounts_count ??
                accounts.length
              }

              label="Accounts"
            />


            <View
              style={
                styles.heroDivider
              }
            />


            <HeroStat
              value={
                purchaser.active_accounts_count ??
                accounts.filter(
                  item =>
                    item.status ===
                    'active'
                ).length
              }

              label="Active"
            />


            <View
              style={
                styles.heroDivider
              }
            />


            <HeroStat
              value={
                primary
                  ? 1
                  : 0
              }

              label="Primary"
            />

          </View>

        </View>


        {/* PRIMARY ACCOUNT */}

        <SectionHeader
          icon="star-outline"
          title="Primary Bank Account"
        />


        {primary ? (

          <View
            style={
              styles.primaryCard
            }
          >

            <View
              style={
                styles.primaryHeader
              }
            >

              <View
                style={
                  styles.bankIcon
                }
              >

                <Ionicons
                  name="business-outline"
                  size={22}
                  color={
                    Colors.primary
                  }
                />

              </View>


              <View
                style={
                  styles.primaryContent
                }
              >

                <Text
                  style={
                    styles.primaryBank
                  }
                >
                  {
                    primary.bank
                      ?.name ??
                    'Bank'
                  }
                </Text>


                <Text
                  style={
                    styles.primaryAccount
                  }
                >
                  {
                    primary.account_number
                  }
                </Text>


                {primary.account_name && (

                  <Text
                    style={
                      styles.primaryAccountName
                    }
                  >
                    {
                      primary.account_name
                    }
                  </Text>

                )}

              </View>


              <View
                style={
                  styles.primaryBadge
                }
              >

                <Ionicons
                  name="star"
                  size={12}
                  color={
                    Colors.primary
                  }
                />


                <Text
                  style={
                    styles.primaryBadgeText
                  }
                >
                  Primary
                </Text>

              </View>

            </View>


            <View
              style={
                styles.primaryFooter
              }
            >

              <InfoPill
                icon="cash-outline"
                value={
                  primary.currency ??
                  '-'
                }
              />


              <InfoPill
                icon="checkmark-circle-outline"
                value={
                  primary.status ===
                  'active'
                    ? 'Active'
                    : 'Inactive'
                }
              />

            </View>

          </View>

        ) : (

          <View
            style={
              styles.noPrimaryCard
            }
          >

            <Ionicons
              name="card-outline"
              size={31}
              color={
                Colors.textMuted
              }
            />


            <Text
              style={
                styles.noPrimaryTitle
              }
            >
              No Primary Account
            </Text>


            <Text
              style={
                styles.noPrimaryText
              }
            >
              Add an account or mark an existing account as primary.
            </Text>

          </View>

        )}


        {/* ACCOUNTS HEADER */}

        <View
          style={
            styles.accountsHeader
          }
        >

          <SectionHeader
            icon="wallet-outline"
            title="Bank Accounts"
            noMargin
          />


          <Pressable
            style={
              styles.addAccountButton
            }

            onPress={
              openCreateAccount
            }
          >

            <Ionicons
              name="add"
              size={18}
              color="#FFFFFF"
            />


            <Text
              style={
                styles.addAccountText
              }
            >
              Add Account
            </Text>

          </Pressable>

        </View>


        {/* ACCOUNT LIST */}

        {accounts.length === 0 ? (

          <View
            style={
              styles.emptyAccounts
            }
          >

            <Ionicons
              name="wallet-outline"
              size={34}
              color={
                Colors.textMuted
              }
            />


            <Text
              style={
                styles.emptyAccountsTitle
              }
            >
              No Bank Accounts
            </Text>


            <Text
              style={
                styles.emptyAccountsText
              }
            >
              Add the purchaser's first bank account.
            </Text>

          </View>

        ) : (

          accounts.map(
            account => (

              <AccountCard
                key={
                  account.id
                }

                account={
                  account
                }

                processing={
                  processingAccountId ===
                  account.id
                }

                onEdit={() =>
                  openEditAccount(
                    account
                  )
                }

                onPrimary={() =>
                  setPrimary(
                    account
                  )
                }

                onDelete={() =>
                  deleteAccount(
                    account
                  )
                }
              />

            )
          )

        )}


        {/* REGISTRATION */}

        <SectionHeader
          icon="shield-checkmark-outline"
          title="Registration & Audit"
        />


        <View
          style={
            styles.detailsCard
          }
        >

          <DetailRow
            icon="person-outline"
            label="Registered By"
            value={
              purchaser.registered_by ||
              'System'
            }
          />


          <DetailRow
            icon="calendar-outline"
            label="Registered Date"
            value={
              purchaser.date_registered
            }
          />


          <DetailRow
            icon="time-outline"
            label="Created"
            value={
              purchaser.created_at
            }
          />


          <DetailRow
            icon="refresh-outline"
            label="Updated"
            value={
              purchaser.updated_at
            }
            last
          />

        </View>


        {/* DELETE PURCHASER */}

        <Pressable
          disabled={
            deleting
          }

          style={[
            styles.deletePurchaserButton,

            deleting &&
              styles.disabled,
          ]}

          onPress={
            deletePurchaser
          }
        >

          {deleting ? (

            <ActivityIndicator
              size="small"
              color="#FFFFFF"
            />

          ) : (

            <>

              <Ionicons
                name="trash-outline"
                size={18}
                color="#FFFFFF"
              />


              <Text
                style={
                  styles.deletePurchaserText
                }
              >
                Delete Purchaser
              </Text>

            </>

          )}

        </Pressable>

      </ScrollView>


      {/* ACCOUNT MODAL */}

      <Modal
        visible={
          accountModalVisible
        }

        transparent

        animationType="slide"

        onRequestClose={
          closeAccountModal
        }
      >

        <View
          style={
            styles.modalOverlay
          }
        >

          <View
            style={
              styles.modalCard
            }
          >

            <View
              style={
                styles.modalHeader
              }
            >

              <View>

                <Text
                  style={
                    styles.modalTitle
                  }
                >
                  {
                    editingAccount
                      ? 'Edit Bank Account'
                      : 'Add Bank Account'
                  }
                </Text>


                <Text
                  style={
                    styles.modalSubtitle
                  }
                >
                  {
                    purchaser.purchaser_name
                  }
                </Text>

              </View>


              <Pressable
                disabled={
                  savingAccount
                }

                style={
                  styles.modalClose
                }

                onPress={
                  closeAccountModal
                }
              >

                <Ionicons
                  name="close"
                  size={21}
                  color={
                    Colors.text
                  }
                />

              </Pressable>

            </View>


            <ScrollView
              showsVerticalScrollIndicator={
                false
              }

              keyboardShouldPersistTaps="handled"
            >

              {/* BANK */}

              <Label
                title="Bank"
                required
              />


              <Pressable
                style={[
                  styles.selectBox,

                  bankOpen &&
                    styles.selectBoxOpen,
                ]}

                onPress={() =>
                  setBankOpen(
                    current =>
                      !current
                  )
                }
              >

                <Ionicons
                  name="business-outline"
                  size={18}
                  color={
                    Colors.textSecondary
                  }
                />


                <Text
                  style={[
                    styles.selectText,

                    !selectedBank &&
                      styles.placeholderText,
                  ]}
                >
                  {
                    selectedBank
                      ?.label ??
                    'Select bank'
                  }
                </Text>


                <Ionicons
                  name={
                    bankOpen
                      ? 'chevron-up'
                      : 'chevron-down'
                  }
                  size={17}
                  color={
                    Colors.textMuted
                  }
                />

              </Pressable>


              {bankOpen && (

                <View
                  style={
                    styles.optionsBox
                  }
                >

                  {banks.length ===
                  0 ? (

                    <Text
                      style={
                        styles.noOptions
                      }
                    >
                      No bank options found.
                    </Text>

                  ) : (

                    banks.map(
                      bank => (

                        <Pressable
                          key={
                            bank.id
                          }

                          style={[
                            styles.optionItem,

                            bank.id ===
                              bankId &&
                              styles.optionSelected,
                          ]}

                          onPress={() => {

                            setBankId(
                              bank.id
                            );

                            setBankOpen(
                              false
                            );

                          }}
                        >

                          <Text
                            style={[
                              styles.optionText,

                              bank.id ===
                                bankId &&
                                styles.optionTextSelected,
                            ]}
                          >
                            {
                              bank.label
                            }
                          </Text>


                          {bank.id ===
                            bankId && (

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


              {/* ACCOUNT NUMBER */}

              <Label
                title="Account Number"
                required
              />


              <InputBox
                icon="card-outline"
                value={
                  accountNumber
                }
                onChangeText={
                  setAccountNumber
                }
                placeholder="Enter account number"
                maxLength={50}
              />


              {/* ACCOUNT NAME */}

              <Label
                title="Account Name"
              />


              <InputBox
                icon="person-outline"
                value={
                  accountName
                }
                onChangeText={
                  setAccountName
                }
                placeholder="Enter account name"
                maxLength={100}
              />


              {/* CURRENCY */}

              <Label
                title="Currency"
              />


              <Pressable
                style={[
                  styles.selectBox,

                  currencyOpen &&
                    styles.selectBoxOpen,
                ]}

                onPress={() =>
                  setCurrencyOpen(
                    current =>
                      !current
                  )
                }
              >

                <Ionicons
                  name="cash-outline"
                  size={18}
                  color={
                    Colors.textSecondary
                  }
                />


                <Text
                  style={
                    styles.selectText
                  }
                >
                  {currency}
                </Text>


                <Ionicons
                  name={
                    currencyOpen
                      ? 'chevron-up'
                      : 'chevron-down'
                  }
                  size={17}
                  color={
                    Colors.textMuted
                  }
                />

              </Pressable>


              {currencyOpen && (

                <View
                  style={
                    styles.optionsBox
                  }
                >

                  {CURRENCIES.map(
                    item => (

                      <Pressable
                        key={item}

                        style={[
                          styles.optionItem,

                          currency ===
                            item &&
                            styles.optionSelected,
                        ]}

                        onPress={() => {

                          setCurrency(
                            item
                          );

                          setCurrencyOpen(
                            false
                          );

                        }}
                      >

                        <Text
                          style={[
                            styles.optionText,

                            currency ===
                              item &&
                              styles.optionTextSelected,
                          ]}
                        >
                          {item}
                        </Text>


                        {currency ===
                          item && (

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
                  )}

                </View>

              )}


              {/* PRIMARY */}

              <Label
                title="Primary Account?"
                required
              />


              <View
                style={
                  styles.choiceRow
                }
              >

                <ChoiceButton
                  title="Yes"
                  icon="star-outline"
                  selected={
                    isPrimary
                  }
                  onPress={() =>
                    setIsPrimary(
                      true
                    )
                  }
                />


                <ChoiceButton
                  title="No"
                  icon="remove-circle-outline"
                  selected={
                    !isPrimary
                  }
                  onPress={() =>
                    setIsPrimary(
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
                style={
                  styles.choiceRow
                }
              >

                <ChoiceButton
                  title="Active"
                  icon="checkmark-circle-outline"
                  selected={
                    accountStatus ===
                    'active'
                  }
                  onPress={() =>
                    setAccountStatus(
                      'active'
                    )
                  }
                />


                <ChoiceButton
                  title="Inactive"
                  icon="pause-circle-outline"
                  selected={
                    accountStatus ===
                    'inactive'
                  }
                  onPress={() =>
                    setAccountStatus(
                      'inactive'
                    )
                  }
                />

              </View>


              {/* SAVE */}

              <Pressable
                disabled={
                  savingAccount
                }

                style={[
                  styles.modalSaveButton,

                  savingAccount &&
                    styles.disabled,
                ]}

                onPress={
                  saveAccount
                }
              >

                {savingAccount ? (

                  <ActivityIndicator
                    size="small"
                    color="#FFFFFF"
                  />

                ) : (

                  <>

                    <Ionicons
                      name="save-outline"
                      size={18}
                      color="#FFFFFF"
                    />


                    <Text
                      style={
                        styles.modalSaveText
                      }
                    >
                      {
                        editingAccount
                          ? 'Update Account'
                          : 'Save Account'
                      }
                    </Text>

                  </>

                )}

              </Pressable>

            </ScrollView>

          </View>

        </View>

      </Modal>

    </SafeAreaView>
  );

}


/*
|--------------------------------------------------------------------------
| Account Card
|--------------------------------------------------------------------------
*/

function AccountCard({
  account,
  processing,
  onEdit,
  onPrimary,
  onDelete,
}: {
  account:
    PurchaserAccount;

  processing:
    boolean;

  onEdit:
    () => void;

  onPrimary:
    () => void;

  onDelete:
    () => void;
}) {

  const primary =
    toBoolean(
      account.is_primary
    );


  const active =
    account.status ===
    'active';


  return (
    <View
      style={
        styles.accountCard
      }
    >

      <View
        style={
          styles.accountCardTop
        }
      >

        <View
          style={
            styles.accountBankIcon
          }
        >

          <Ionicons
            name="business-outline"
            size={21}
            color={
              Colors.primary
            }
          />

        </View>


        <View
          style={
            styles.accountHeading
          }
        >

          <Text
            style={
              styles.accountBankName
            }
          >
            {
              account.bank
                ?.name ??
              'Bank'
            }
          </Text>


          <Text
            style={
              styles.accountNoText
            }
          >
            {
              account.account_number
            }
          </Text>


          {account.account_name && (

            <Text
              style={
                styles.accountNameText
              }
            >
              {
                account.account_name
              }
            </Text>

          )}

        </View>


        {primary ? (

          <View
            style={
              styles.primarySmallBadge
            }
          >

            <Ionicons
              name="star"
              size={11}
              color={
                Colors.primary
              }
            />

            <Text
              style={
                styles.primarySmallText
              }
            >
              Primary
            </Text>

          </View>

        ) : (

          <View
            style={[
              styles.accountStatusBadge,

              !active &&
                styles.inactiveBadge,
            ]}
          >

            <Text
              style={
                styles.accountStatusText
              }
            >
              {
                active
                  ? 'Active'
                  : 'Inactive'
              }
            </Text>

          </View>

        )}

      </View>


      <View
        style={
          styles.accountMeta
        }
      >

        <InfoPill
          icon="cash-outline"
          value={
            account.currency ??
            '-'
          }
        />


        <InfoPill
          icon="calendar-outline"
          value={
            account.date_registered ??
            '-'
          }
        />

      </View>


      <View
        style={
          styles.accountActions
        }
      >

        <Pressable
          disabled={
            processing
          }

          style={
            styles.accountAction
          }

          onPress={
            onEdit
          }
        >

          <Ionicons
            name="create-outline"
            size={16}
            color={
              Colors.primary
            }
          />


          <Text
            style={
              styles.accountActionText
            }
          >
            Edit
          </Text>

        </Pressable>


        {!primary && (

          <Pressable
            disabled={
              processing
            }

            style={
              styles.accountAction
            }

            onPress={
              onPrimary
            }
          >

            {processing ? (

              <ActivityIndicator
                size="small"
                color={
                  Colors.primary
                }
              />

            ) : (

              <>
                <Ionicons
                  name="star-outline"
                  size={16}
                  color={
                    Colors.primary
                  }
                />

                <Text
                  style={
                    styles.accountActionText
                  }
                >
                  Primary
                </Text>
              </>

            )}

          </Pressable>

        )}


        <Pressable
          disabled={
            processing
          }

          style={
            styles.deleteAccountAction
          }

          onPress={
            onDelete
          }
        >

          <Ionicons
            name="trash-outline"
            size={16}
            color={
              Colors.danger
            }
          />


          <Text
            style={
              styles.deleteAccountText
            }
          >
            Delete
          </Text>

        </Pressable>

      </View>

    </View>
  );

}


/*
|--------------------------------------------------------------------------
| Components
|--------------------------------------------------------------------------
*/

function SectionHeader({
  icon,
  title,
  noMargin = false,
}: {
  icon: string;
  title: string;
  noMargin?: boolean;
}) {

  return (
    <View
      style={[
        styles.sectionHeader,

        noMargin &&
          styles.sectionHeaderNoMargin,
      ]}
    >

      <Ionicons
        name={icon as any}
        size={17}
        color={
          Colors.primary
        }
      />


      <Text
        style={
          styles.sectionTitle
        }
      >
        {title}
      </Text>

    </View>
  );

}


function HeroStat({
  value,
  label,
}: {
  value:
    string |
    number;
  label: string;
}) {

  return (
    <View
      style={
        styles.heroStat
      }
    >

      <Text
        style={
          styles.heroStatValue
        }
      >
        {value}
      </Text>


      <Text
        style={
          styles.heroStatLabel
        }
      >
        {label}
      </Text>

    </View>
  );

}


function InfoPill({
  icon,
  value,
}: {
  icon: string;
  value: string;
}) {

  return (
    <View
      style={
        styles.infoPill
      }
    >

      <Ionicons
        name={icon as any}
        size={13}
        color={
          Colors.primary
        }
      />


      <Text
        style={
          styles.infoPillText
        }
      >
        {value}
      </Text>

    </View>
  );

}


function DetailRow({
  icon,
  label,
  value,
  last = false,
}: {
  icon: string;
  label: string;
  value?:
    string |
    null;
  last?: boolean;
}) {

  return (
    <View
      style={[
        styles.detailRow,

        last &&
          styles.lastDetailRow,
      ]}
    >

      <View
        style={
          styles.detailIcon
        }
      >

        <Ionicons
          name={icon as any}
          size={16}
          color={
            Colors.textSecondary
          }
        />

      </View>


      <View
        style={{
          flex: 1,
          marginLeft: 10,
        }}
      >

        <Text
          style={
            styles.detailLabel
          }
        >
          {label}
        </Text>


        <Text
          style={
            styles.detailValue
          }
        >
          {value || '-'}
        </Text>

      </View>

    </View>
  );

}


function InputBox({
  icon,
  value,
  onChangeText,
  placeholder,
  maxLength,
}: {
  icon: string;
  value: string;
  onChangeText:
    (value: string) => void;
  placeholder: string;
  maxLength?: number;
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

        maxLength={
          maxLength
        }

        style={
          styles.input
        }
      />

    </View>
  );

}


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

    center: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },

    loadingText: {
      marginTop: 10,
      fontSize: 10,
      fontFamily:
        Fonts.regular,
      color:
        Colors.textSecondary,
    },

    notFoundTitle: {
      marginTop: 12,
      fontSize: 14,
      fontFamily:
        Fonts.bold,
      color:
        Colors.text,
    },

    goBackButton: {
      marginTop: 15,
      paddingHorizontal: 18,
      paddingVertical: 10,
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
      fontSize: 20,
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

    editButton: {
      width: 43,
      height: 43,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        Colors.primary,
    },

    heroCard: {
      marginTop: 22,
      padding: 17,
      borderRadius: 20,
      backgroundColor:
        Colors.surface,
      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    heroTop: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    heroIcon: {
      width: 52,
      height: 52,
      borderRadius: 17,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        Colors.primaryLight,
    },

    heroContent: {
      flex: 1,
      marginLeft: 12,
      marginRight: 8,
    },

    purchaserNo: {
      fontSize: 9,
      fontFamily:
        Fonts.bold,
      color:
        Colors.primary,
    },

    purchaserName: {
      marginTop: 3,
      fontSize: 15,
      fontFamily:
        Fonts.extraBold,
      color:
        Colors.text,
    },

    statusBadge: {
      paddingHorizontal: 9,
      paddingVertical: 6,
      borderRadius: 10,
      backgroundColor:
        Colors.primaryLight,
    },

    inactiveBadge: {
      opacity: 0.65,
    },

    statusText: {
      fontSize: 8,
      fontFamily:
        Fonts.bold,
      color:
        Colors.primary,
    },

    heroStats: {
      marginTop: 16,
      minHeight: 58,
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 13,
      backgroundColor:
        Colors.background,
    },

    heroStat: {
      flex: 1,
      alignItems: 'center',
    },

    heroStatValue: {
      fontSize: 13,
      fontFamily:
        Fonts.extraBold,
      color:
        Colors.text,
    },

    heroStatLabel: {
      marginTop: 3,
      fontSize: 8,
      fontFamily:
        Fonts.regular,
      color:
        Colors.textMuted,
    },

    heroDivider: {
      width: 1,
      height: 28,
      backgroundColor:
        Colors.border,
    },

    sectionHeader: {
      marginTop: 24,
      marginBottom: 9,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },

    sectionHeaderNoMargin: {
      marginTop: 0,
      marginBottom: 0,
    },

    sectionTitle: {
      fontSize: 13,
      fontFamily:
        Fonts.extraBold,
      color:
        Colors.text,
    },

    primaryCard: {
      padding: 15,
      borderRadius: 18,
      backgroundColor:
        Colors.surface,
      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    primaryHeader: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    bankIcon: {
      width: 45,
      height: 45,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        Colors.primaryLight,
    },

    primaryContent: {
      flex: 1,
      marginLeft: 10,
    },

    primaryBank: {
      fontSize: 11,
      fontFamily:
        Fonts.bold,
      color:
        Colors.text,
    },

    primaryAccount: {
      marginTop: 3,
      fontSize: 10,
      fontFamily:
        Fonts.medium,
      color:
        Colors.textSecondary,
    },

    primaryAccountName: {
      marginTop: 2,
      fontSize: 8,
      fontFamily:
        Fonts.regular,
      color:
        Colors.textMuted,
    },

    primaryBadge: {
      paddingHorizontal: 8,
      paddingVertical: 5,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 3,
      borderRadius: 9,
      backgroundColor:
        Colors.primaryLight,
    },

    primaryBadgeText: {
      fontSize: 8,
      fontFamily:
        Fonts.bold,
      color:
        Colors.primary,
    },

    primaryFooter: {
      marginTop: 12,
      flexDirection: 'row',
      gap: 7,
    },

    infoPill: {
      paddingHorizontal: 9,
      paddingVertical: 6,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      borderRadius: 9,
      backgroundColor:
        Colors.background,
    },

    infoPillText: {
      fontSize: 8,
      fontFamily:
        Fonts.bold,
      color:
        Colors.textSecondary,
    },

    noPrimaryCard: {
      paddingVertical: 30,
      alignItems: 'center',
      borderRadius: 18,
      backgroundColor:
        Colors.surface,
      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    noPrimaryTitle: {
      marginTop: 8,
      fontSize: 11,
      fontFamily:
        Fonts.bold,
      color:
        Colors.text,
    },

    noPrimaryText: {
      marginTop: 4,
      fontSize: 9,
      fontFamily:
        Fonts.regular,
      color:
        Colors.textSecondary,
    },

    accountsHeader: {
      marginTop: 24,
      marginBottom: 9,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'space-between',
    },

    addAccountButton: {
      height: 37,
      paddingHorizontal: 11,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      borderRadius: 11,
      backgroundColor:
        Colors.primary,
    },

    addAccountText: {
      fontSize: 8,
      fontFamily:
        Fonts.bold,
      color: '#FFFFFF',
    },

    emptyAccounts: {
      paddingVertical: 35,
      alignItems: 'center',
      borderRadius: 18,
      backgroundColor:
        Colors.surface,
      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    emptyAccountsTitle: {
      marginTop: 8,
      fontSize: 11,
      fontFamily:
        Fonts.bold,
      color:
        Colors.text,
    },

    emptyAccountsText: {
      marginTop: 4,
      fontSize: 9,
      fontFamily:
        Fonts.regular,
      color:
        Colors.textSecondary,
    },

    accountCard: {
      marginBottom: 11,
      padding: 14,
      borderRadius: 17,
      backgroundColor:
        Colors.surface,
      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    accountCardTop: {
      flexDirection: 'row',
      alignItems:
        'flex-start',
    },

    accountBankIcon: {
      width: 42,
      height: 42,
      borderRadius: 13,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        Colors.primaryLight,
    },

    accountHeading: {
      flex: 1,
      marginLeft: 10,
      marginRight: 7,
    },

    accountBankName: {
      fontSize: 10,
      fontFamily:
        Fonts.bold,
      color:
        Colors.text,
    },

    accountNoText: {
      marginTop: 3,
      fontSize: 10,
      fontFamily:
        Fonts.medium,
      color:
        Colors.textSecondary,
    },

    accountNameText: {
      marginTop: 2,
      fontSize: 8,
      fontFamily:
        Fonts.regular,
      color:
        Colors.textMuted,
    },

    primarySmallBadge: {
      paddingHorizontal: 7,
      paddingVertical: 5,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 3,
      borderRadius: 9,
      backgroundColor:
        Colors.primaryLight,
    },

    primarySmallText: {
      fontSize: 7,
      fontFamily:
        Fonts.bold,
      color:
        Colors.primary,
    },

    accountStatusBadge: {
      paddingHorizontal: 7,
      paddingVertical: 5,
      borderRadius: 9,
      backgroundColor:
        Colors.primaryLight,
    },

    accountStatusText: {
      fontSize: 7,
      fontFamily:
        Fonts.bold,
      color:
        Colors.primary,
    },

    accountMeta: {
      marginTop: 11,
      flexDirection: 'row',
      gap: 6,
    },

    accountActions: {
      marginTop: 12,
      paddingTop: 11,
      flexDirection: 'row',
      gap: 7,
      borderTopWidth: 1,
      borderTopColor:
        Colors.border,
    },

    accountAction: {
      flex: 1,
      height: 39,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4,
      borderRadius: 11,
      backgroundColor:
        Colors.primaryLight,
    },

    accountActionText: {
      fontSize: 8,
      fontFamily:
        Fonts.bold,
      color:
        Colors.primary,
    },

    deleteAccountAction: {
      flex: 1,
      height: 39,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4,
      borderRadius: 11,
      backgroundColor:
        Colors.background,
    },

    deleteAccountText: {
      fontSize: 8,
      fontFamily:
        Fonts.bold,
      color:
        Colors.danger,
    },

    detailsCard: {
      paddingHorizontal: 15,
      borderRadius: 18,
      backgroundColor:
        Colors.surface,
      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    detailRow: {
      minHeight: 65,
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor:
        Colors.border,
    },

    lastDetailRow: {
      borderBottomWidth: 0,
    },

    detailIcon: {
      width: 37,
      height: 37,
      borderRadius: 11,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        Colors.background,
    },

    detailLabel: {
      fontSize: 8,
      fontFamily:
        Fonts.regular,
      color:
        Colors.textMuted,
    },

    detailValue: {
      marginTop: 3,
      fontSize: 10,
      fontFamily:
        Fonts.bold,
      color:
        Colors.text,
    },

    deletePurchaserButton: {
      marginTop: 24,
      height: 50,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      borderRadius: 14,
      backgroundColor:
        '#C83D3D',
    },

    deletePurchaserText: {
      fontSize: 10,
      fontFamily:
        Fonts.bold,
      color: '#FFFFFF',
    },

    modalOverlay: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor:
        'rgba(0,0,0,0.42)',
    },

    modalCard: {
      maxHeight: '92%',
      padding: 18,
      paddingBottom: 30,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      backgroundColor:
        Colors.surface,
    },

    modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'space-between',
      marginBottom: 4,
    },

    modalTitle: {
      fontSize: 16,
      fontFamily:
        Fonts.extraBold,
      color:
        Colors.text,
    },

    modalSubtitle: {
      marginTop: 3,
      fontSize: 9,
      fontFamily:
        Fonts.regular,
      color:
        Colors.textSecondary,
    },

    modalClose: {
      width: 39,
      height: 39,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        Colors.background,
    },

    labelRow: {
      marginTop: 18,
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

    inputBox: {
      minHeight: 50,
      paddingHorizontal: 13,
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 13,
      backgroundColor:
        Colors.background,
      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    input: {
      flex: 1,
      marginLeft: 8,
      fontSize: 11,
      fontFamily:
        Fonts.regular,
      color:
        Colors.text,
    },

    selectBox: {
      minHeight: 50,
      paddingHorizontal: 13,
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 13,
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
      marginLeft: 8,
      fontSize: 10,
      fontFamily:
        Fonts.medium,
      color:
        Colors.text,
    },

    placeholderText: {
      color:
        Colors.textMuted,
    },

    optionsBox: {
      marginTop: 5,
      maxHeight: 220,
      borderRadius: 13,
      overflow: 'hidden',
      backgroundColor:
        Colors.background,
      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    optionItem: {
      minHeight: 44,
      paddingHorizontal: 12,
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
      fontSize: 9,
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
      padding: 13,
      fontSize: 9,
      fontFamily:
        Fonts.regular,
      color:
        Colors.textMuted,
    },

    choiceRow: {
      flexDirection: 'row',
      gap: 8,
    },

    choiceButton: {
      flex: 1,
      height: 48,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 5,
      borderRadius: 13,
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

    modalSaveButton: {
      marginTop: 24,
      height: 51,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      borderRadius: 14,
      backgroundColor:
        Colors.primary,
    },

    modalSaveText: {
      fontSize: 10,
      fontFamily:
        Fonts.bold,
      color: '#FFFFFF',
    },

    disabled: {
      opacity: 0.5,
    },

  });
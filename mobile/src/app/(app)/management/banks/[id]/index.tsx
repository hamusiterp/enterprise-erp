import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import {
  router,
  useFocusEffect,
  useLocalSearchParams,
} from 'expo-router';

import {
  useCallback,
  useState,
} from 'react';

import {
  Colors,
} from '../../../../../constants/colors';

import {
  Fonts,
} from '../../../../../constants/fonts';

import {
  Bank,
  banksApi,
} from '../../../../../api/banksApi';


export default function BankDetailsScreen() {
  const params =
    useLocalSearchParams();

  const rawId =
  Array.isArray(params.id)
    ? params.id[0]
    : params.id;

const bankId =
  Number(rawId);

  const [
    bank,
    setBank,
  ] = useState<Bank | null>(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    changingStatus,
    setChangingStatus,
  ] = useState(false);

  const [
    deleting,
    setDeleting,
  ] = useState(false);


  /*
  |--------------------------------------------------------------------------
  | Load Bank
  |--------------------------------------------------------------------------
  */

  const loadBank =
  useCallback(async () => {

    if (
      !rawId ||
      Number.isNaN(bankId)
    ) {
      console.log(
        'Invalid bank route id:',
        params.id
      );

      Alert.alert(
        'Invalid bank',
        'The bank ID is missing or invalid.'
      );

      setLoading(false);

      return;
    }

    try {
      setLoading(true);

      const data =
        await banksApi.get(
          bankId
        );

      setBank(data);

    } catch (error: any) {

      console.log(
        'Bank details error:',
        error?.response?.data ??
        error
      );

      Alert.alert(
        'Unable to load bank',
        error?.response?.data?.message ??
        'Bank information could not be loaded.'
      );

    } finally {
      setLoading(false);
    }

  }, [
    bankId,
    rawId,
  ]);


  useFocusEffect(
    useCallback(() => {
      loadBank();
    }, [loadBank])
  );


  /*
  |--------------------------------------------------------------------------
  | Status
  |--------------------------------------------------------------------------
  */

  const confirmStatusChange = () => {
    if (
      !bank ||
      changingStatus
    ) {
      return;
    }

    const newStatus =
      bank.status === 'active'
        ? 'inactive'
        : 'active';

    Alert.alert(
      newStatus === 'active'
        ? 'Activate Bank'
        : 'Deactivate Bank',

      newStatus === 'active'
        ? `Activate ${bank.bank_name}?`
        : `Deactivate ${bank.bank_name}?`,

      [
        {
          text: 'Cancel',
          style: 'cancel',
        },

        {
          text:
            newStatus === 'active'
              ? 'Activate'
              : 'Deactivate',

          onPress: () =>
            changeStatus(
              newStatus
            ),
        },
      ]
    );
  };


  const changeStatus =
    async (
      status:
        | 'active'
        | 'inactive'
    ) => {
      if (!bank) {
        return;
      }

      try {
        setChangingStatus(true);

        const updated =
          await banksApi
            .changeStatus(
              bank.id,
              status
            );

        setBank(updated);

        Alert.alert(
          'Status updated',
          status === 'active'
            ? 'The bank is now active.'
            : 'The bank is now inactive.'
        );

      } catch (error: any) {
        console.log(
          'Bank status error:',
          error?.response?.data ??
          error
        );

        Alert.alert(
          'Unable to update status',
          error?.response?.data?.message ??
          'The bank status could not be changed.'
        );

      } finally {
        setChangingStatus(false);
      }
    };


  /*
  |--------------------------------------------------------------------------
  | Delete
  |--------------------------------------------------------------------------
  */

  const confirmDelete = () => {
    if (
      !bank ||
      deleting
    ) {
      return;
    }

    Alert.alert(
      'Delete Bank',
      `Are you sure you want to delete ${bank.bank_name}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },

        {
          text: 'Delete',
          style: 'destructive',

          onPress: () =>
            deleteBank(),
        },
      ]
    );
  };


  const deleteBank =
    async () => {
      if (!bank) {
        return;
      }

      try {
        setDeleting(true);

        await banksApi.remove(
          bank.id
        );

        Alert.alert(
          'Bank deleted',
          'The bank has been moved to deleted records.',
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
          'Bank delete error:',
          error?.response?.data ??
          error
        );

        Alert.alert(
          'Delete failed',
          error?.response?.data?.message ??
          'Unable to delete the bank.'
        );

      } finally {
        setDeleting(false);
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
            Loading bank...
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

  if (!bank) {
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
            name="business-outline"
            size={42}
            color={Colors.textMuted}
          />

          <Text
            style={
              styles.notFoundTitle
            }
          >
            Bank not found
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


  const isActive =
    bank.status === 'active';


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
      >

        {/* HEADER */}

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
            style={
              styles.headerContent
            }
          >
            <Text style={styles.title}>
              Bank Details
            </Text>

            <Text
              style={styles.subtitle}
            >
              Banking & credit setup
            </Text>
          </View>

          <Pressable
            style={styles.editButton}
            onPress={() =>
              router.push(
                `/(app)/management/banks/${bank.id}/edit` as any
              )
            }
          >
            <Ionicons
              name="create-outline"
              size={21}
              color={Colors.primary}
            />
          </Pressable>

        </View>


        {/* HERO */}

        <View
          style={styles.heroCard}
        >
          <View
            style={styles.heroIcon}
          >
            <Ionicons
              name="business-outline"
              size={34}
              color={Colors.primary}
            />
          </View>

          <Text
            style={styles.bankName}
          >
            {bank.bank_name}
          </Text>

          <Text
            style={styles.bankCode}
          >
            {bank.bank_id}
          </Text>

          <Text
            style={styles.accountNo}
          >
            {bank.account_no}
          </Text>

          <View
            style={[
              styles.statusBadge,

              isActive
                ? styles.activeBadge
                : styles.inactiveBadge,
            ]}
          >
            <View
              style={[
                styles.statusDot,

                isActive
                  ? styles.activeDot
                  : styles.inactiveDot,
              ]}
            />

            <Text
              style={[
                styles.statusText,

                isActive
                  ? styles.activeText
                  : styles.inactiveText,
              ]}
            >
              {isActive
                ? 'Active'
                : 'Inactive'}
            </Text>
          </View>
        </View>


        {/* BASIC INFORMATION */}

        <SectionTitle
          title="Basic Information"
        />

        <View style={styles.infoCard}>

          <InfoRow
            icon="barcode-outline"
            label="Bank ID"
            value={bank.bank_id}
          />

          <Divider />

          <InfoRow
            icon="business-outline"
            label="Bank Name"
            value={bank.bank_name}
          />

          {bank.bank_name_orginal ? (
            <>
              <Divider />

              <InfoRow
                icon="text-outline"
                label="Original Name"
                value={
                  bank.bank_name_orginal
                }
              />
            </>
          ) : null}

          <Divider />

          <InfoRow
            icon="card-outline"
            label="Account Number"
            value={bank.account_no}
          />

          <Divider />

          <InfoRow
            icon="location-outline"
            label="Branch"
            value={bank.branch}
          />

          {bank.contact_address ? (
            <>
              <Divider />

              <InfoRow
                icon="call-outline"
                label="Contact Address"
                value={
                  bank.contact_address
                }
              />
            </>
          ) : null}

        </View>


        {/* FINANCIAL SETUP */}

        <SectionTitle
          title="Financial Setup"
        />

        <View style={styles.infoCard}>

          <InfoRow
            icon="wallet-outline"
            label="Beginning Amount"
            value={
              formatAmount(
                bank.begnning_amount
              )
            }
          />

          <Divider />

          <InfoRow
            icon="cash-outline"
            label="Beginning Amount Left"
            value={
              formatAmount(
                bank.begnning__amount_left
              )
            }
          />

          <Divider />

          <InfoRow
            icon="remove-circle-outline"
            label="Minimum Amount"
            value={
              formatAmount(
                bank.min_amount
              )
            }
          />

          <Divider />

          <InfoRow
            icon="swap-horizontal-outline"
            label="Transfer Rate"
            value={
              formatAmount(
                bank.transfer_rate
              )
            }
          />

        </View>


        {/* OVERDRAFT */}

        <SectionTitle
          title="Overdraft Facility"
        />

        <View style={styles.infoCard}>

          <InfoRow
            icon="card-outline"
            label="OD Available"
            value={bank.od_available}
          />

          {bank.od_available ===
          'Yes' ? (
            <>
              <Divider />

              <InfoRow
                icon="cash-outline"
                label="OD Amount"
                value={
                  formatAmount(
                    bank.od_amount
                  )
                }
              />

              <Divider />

              <InfoRow
                icon="wallet-outline"
                label="OD Amount Left"
                value={
                  formatAmount(
                    bank.od_amount_left
                  )
                }
              />

              <Divider />

              <InfoRow
                icon="speedometer-outline"
                label="OD Limit"
                value={
                  bank.od_limit ||
                  '-'
                }
              />

              <Divider />

              <InfoRow
                icon="information-circle-outline"
                label="OD Status"
                value={
                  bank.od_status ||
                  '-'
                }
              />

              <Divider />

              <InfoRow
                icon="calendar-outline"
                label="Start Date"
                value={
                  formatDate(
                    bank.start_date
                  )
                }
              />

              <Divider />

              <InfoRow
                icon="calendar-outline"
                label="End Date"
                value={
                  formatDate(
                    bank.end_date
                  )
                }
              />
            </>
          ) : null}

        </View>


        {/* TERM LOAN */}

        <SectionTitle
          title="Term Loan"
        />

        <View style={styles.infoCard}>

          <InfoRow
            icon="document-text-outline"
            label="Term Loan"
            value={bank.term_loan}
          />

          {bank.term_loan ===
          'Yes' ? (
            <>
              <Divider />

              <InfoRow
                icon="cash-outline"
                label="Loan Amount"
                value={
                  formatAmount(
                    bank.term_loan_amount
                  )
                }
              />

              <Divider />

              <InfoRow
                icon="information-circle-outline"
                label="Loan Status"
                value={
                  bank.loan_status ||
                  '-'
                }
              />

              <Divider />

              <InfoRow
                icon="calendar-outline"
                label="Loan Start"
                value={
                  formatDate(
                    bank.term_loan_start_date
                  )
                }
              />

              <Divider />

              <InfoRow
                icon="calendar-outline"
                label="Loan End"
                value={
                  formatDate(
                    bank.term_loan_end_date
                  )
                }
              />

              <Divider />

              <InfoRow
                icon="cash-outline"
                label="Repayment Amount"
                value={
                  formatAmount(
                    bank.repayment_amount
                  )
                }
              />

              <Divider />

              <InfoRow
                icon="wallet-outline"
                label="Repayment Left"
                value={
                  bank.repayment_amount_left ||
                  '-'
                }
              />

              <Divider />

              <InfoRow
                icon="time-outline"
                label="Period"
                value={
                  bank.period ||
                  '-'
                }
              />
            </>
          ) : null}

        </View>


        {/* TERM LOAN RELIEF */}

        <SectionTitle
          title="Term Loan Relief"
        />

        <View style={styles.infoCard}>

          <InfoRow
            icon="umbrella-outline"
            label="Relief Available"
            value={
              bank.term_loan_relief
            }
          />

          {bank.term_loan_relief ===
          'Yes' ? (
            <>
              <Divider />

              <InfoRow
                icon="calendar-outline"
                label="Relief Start"
                value={
                  formatDate(
                    bank.term_loan_relief_start_date
                  )
                }
              />

              <Divider />

              <InfoRow
                icon="calendar-outline"
                label="Relief End"
                value={
                  formatDate(
                    bank.term_loan_relief_end_date
                  )
                }
              />
            </>
          ) : null}

        </View>


        {/* OTHER INFORMATION */}

        <SectionTitle
          title="Other Information"
        />

        <View style={styles.infoCard}>

          <InfoRow
            icon="calendar-outline"
            label="Date Registered"
            value={
              formatDate(
                bank.date_registered
              )
            }
          />

          {bank.ethiopian_date ? (
            <>
              <Divider />

              <InfoRow
                icon="calendar-number-outline"
                label="Ethiopian Date"
                value={
                  bank.ethiopian_date
                }
              />
            </>
          ) : null}

          {bank.cob_balance ? (
            <>
              <Divider />

              <InfoRow
                icon="wallet-outline"
                label="COB Balance"
                value={
                  bank.cob_balance
                }
              />
            </>
          ) : null}

          {bank.category ? (
            <>
              <Divider />

              <InfoRow
                icon="folder-outline"
                label="Category"
                value={
                  bank.category
                }
              />
            </>
          ) : null}

          {bank.start_month ? (
            <>
              <Divider />

              <InfoRow
                icon="calendar-outline"
                label="Start Month"
                value={
                  bank.start_month
                }
              />
            </>
          ) : null}

        </View>


        {/* ACTIONS */}

        <SectionTitle
          title="Actions"
        />

        <Pressable
          disabled={
            changingStatus
          }
          onPress={
            confirmStatusChange
          }
          style={styles.actionCard}
        >

          <View
            style={styles.actionIcon}
          >
            {changingStatus ? (
              <ActivityIndicator
                size="small"
                color={Colors.primary}
              />
            ) : (
              <Ionicons
                name={
                  isActive
                    ? 'pause-circle-outline'
                    : 'checkmark-circle-outline'
                }
                size={22}
                color={Colors.primary}
              />
            )}
          </View>

          <View
            style={
              styles.actionContent
            }
          >
            <Text
              style={
                styles.actionTitle
              }
            >
              {isActive
                ? 'Deactivate Bank'
                : 'Activate Bank'}
            </Text>

            <Text
              style={
                styles.actionSubtitle
              }
            >
              {isActive
                ? 'Temporarily disable this bank'
                : 'Make this bank active again'}
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={19}
            color={Colors.textMuted}
          />

        </Pressable>


        <Pressable
          disabled={deleting}
          onPress={confirmDelete}
          style={[
            styles.actionCard,
            styles.deleteCard,
          ]}
        >
          <View
            style={[
              styles.actionIcon,
              styles.deleteIcon,
            ]}
          >
            {deleting ? (
              <ActivityIndicator
                size="small"
                color={Colors.danger}
              />
            ) : (
              <Ionicons
                name="trash-outline"
                size={21}
                color={Colors.danger}
              />
            )}
          </View>

          <View
            style={
              styles.actionContent
            }
          >
            <Text
              style={
                styles.deleteTitle
              }
            >
              Delete Bank
            </Text>

            <Text
              style={
                styles.actionSubtitle
              }
            >
              Move this bank to deleted records
            </Text>
          </View>
        </Pressable>

      </ScrollView>
    </SafeAreaView>
  );
}


/*
|--------------------------------------------------------------------------
| Components
|--------------------------------------------------------------------------
*/

function SectionTitle({
  title,
}: {
  title: string;
}) {
  return (
    <Text
      style={styles.sectionTitle}
    >
      {title}
    </Text>
  );
}


function InfoRow({
  icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infoRow}>
      <View
        style={styles.infoIcon}
      >
        <Ionicons
          name={icon}
          size={18}
          color={Colors.primary}
        />
      </View>

      <View
        style={styles.infoContent}
      >
        <Text
          style={styles.infoLabel}
        >
          {label}
        </Text>

        <Text
          style={styles.infoValue}
        >
          {value}
        </Text>
      </View>
    </View>
  );
}


function Divider() {
  return (
    <View style={styles.divider} />
  );
}


/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function formatAmount(
  value:
    | number
    | string
    | null
    | undefined
): string {

  if (
    value === null ||
    value === undefined ||
    value === ''
  ) {
    return '-';
  }

  const number =
    Number(value);

  if (
    Number.isNaN(number)
  ) {
    return String(value);
  }

  return number.toLocaleString(
    undefined,
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  );
}


function formatDate(
  value:
    | string
    | null
    | undefined
): string {

  if (!value) {
    return '-';
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return value;
  }

  return date.toLocaleDateString(
    undefined,
    {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }
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

    editButton: {
      width: 44,
      height: 44,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        Colors.primaryLight,
      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    heroCard: {
      marginTop: 24,
      padding: 24,
      alignItems: 'center',
      borderRadius: 22,
      backgroundColor:
        Colors.surface,
      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    heroIcon: {
      width: 72,
      height: 72,
      borderRadius: 23,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        Colors.primaryLight,
    },

    bankName: {
      marginTop: 15,
      textAlign: 'center',
      fontSize: 20,
      fontFamily:
        Fonts.extraBold,
      color: Colors.text,
    },

    bankCode: {
      marginTop: 5,
      fontSize: 12,
      fontFamily:
        Fonts.medium,
      color:
        Colors.textSecondary,
    },

    accountNo: {
      marginTop: 3,
      fontSize: 11,
      fontFamily:
        Fonts.regular,
      color: Colors.textMuted,
    },

    statusBadge: {
      marginTop: 13,
      paddingHorizontal: 12,
      paddingVertical: 7,
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 20,
    },

    activeBadge: {
      backgroundColor:
        Colors.primaryLight,
    },

    inactiveBadge: {
      backgroundColor:
        Colors.surface,
    },

    statusDot: {
      width: 7,
      height: 7,
      marginRight: 6,
      borderRadius: 10,
    },

    activeDot: {
      backgroundColor:
        Colors.primary,
    },

    inactiveDot: {
      backgroundColor:
        Colors.danger,
    },

    statusText: {
      fontSize: 11,
      fontFamily:
        Fonts.bold,
    },

    activeText: {
      color:
        Colors.primary,
    },

    inactiveText: {
      color:
        Colors.danger,
    },

    sectionTitle: {
      marginTop: 27,
      marginBottom: 12,
      fontSize: 17,
      fontFamily:
        Fonts.extraBold,
      color: Colors.text,
    },

    infoCard: {
      paddingHorizontal: 16,
      borderRadius: 20,
      backgroundColor:
        Colors.surface,
      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    infoRow: {
      minHeight: 72,
      paddingVertical: 12,
      flexDirection: 'row',
      alignItems: 'center',
    },

    infoIcon: {
      width: 38,
      height: 38,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        Colors.primaryLight,
    },

    infoContent: {
      flex: 1,
      marginLeft: 12,
    },

    infoLabel: {
      fontSize: 10,
      fontFamily:
        Fonts.medium,
      color: Colors.textMuted,
    },

    infoValue: {
      marginTop: 3,
      fontSize: 13,
      lineHeight: 19,
      fontFamily:
        Fonts.semiBold,
      color: Colors.text,
    },

    divider: {
      height: 1,
      backgroundColor:
        Colors.border,
    },

    actionCard: {
      minHeight: 74,
      marginBottom: 11,
      padding: 14,
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 18,
      backgroundColor:
        Colors.surface,
      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    actionIcon: {
      width: 44,
      height: 44,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        Colors.primaryLight,
    },

    actionContent: {
      flex: 1,
      marginLeft: 12,
    },

    actionTitle: {
      fontSize: 13,
      fontFamily:
        Fonts.bold,
      color: Colors.text,
    },

    actionSubtitle: {
      marginTop: 3,
      fontSize: 10,
      lineHeight: 15,
      fontFamily:
        Fonts.regular,
      color:
        Colors.textSecondary,
    },

    deleteCard: {
      marginTop: 3,
    },

    deleteIcon: {
      backgroundColor:
        Colors.background,
    },

    deleteTitle: {
      fontSize: 13,
      fontFamily:
        Fonts.bold,
      color: Colors.danger,
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
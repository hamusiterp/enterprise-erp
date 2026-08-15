import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import { Colors } from '../../../../constants/colors';
import { Fonts } from '../../../../constants/fonts';

import {
  Bank,
  banksApi,
} from '../../../../api/banksApi';


export default function DeletedBanksScreen() {

  const [banks, setBanks] =
    useState<Bank[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [actionId, setActionId] =
    useState<number | null>(null);


  /*
  |--------------------------------------------------------------------------
  | Load Deleted Banks
  |--------------------------------------------------------------------------
  */

  const loadBanks =
    useCallback(
      async (
        refresh = false
      ) => {

        try {

          if (refresh) {
            setRefreshing(true);
          } else {
            setLoading(true);
          }

          const result =
            await banksApi.deleted({
              page: 1,
              per_page: 100,
            });

          setBanks(
            result.data ?? []
          );

        } catch (error: any) {

          console.log(
            'Deleted banks error:',
            error?.response?.data ??
            error
          );

          Alert.alert(
            'Unable to load',
            getApiErrorMessage(
              error,
              'Unable to load deleted banks.'
            )
          );

        } finally {

          setLoading(false);
          setRefreshing(false);

        }

      },
      []
    );


  /*
  |--------------------------------------------------------------------------
  | Refresh Screen
  |--------------------------------------------------------------------------
  */

  useFocusEffect(
    useCallback(() => {

      loadBanks();

    }, [loadBanks])
  );


  /*
  |--------------------------------------------------------------------------
  | Restore
  |--------------------------------------------------------------------------
  */

  const confirmRestore = (
    bank: Bank
  ) => {

    Alert.alert(
      'Restore Bank',
      `Restore ${bank.bank_name}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Restore',
          onPress: () =>
            restoreBank(bank),
        },
      ]
    );

  };


  const restoreBank =
    async (
      bank: Bank
    ) => {

      try {

        setActionId(bank.id);

        await banksApi.restore(
          bank.id
        );

        setBanks(
          current =>
            current.filter(
              item =>
                item.id !==
                bank.id
            )
        );

        Alert.alert(
          'Bank restored',
          `${bank.bank_name} has been restored successfully.`
        );

      } catch (error: any) {

        console.log(
          'Restore bank error:',
          error?.response?.data ??
          error
        );

        Alert.alert(
          'Restore failed',
          getApiErrorMessage(
            error,
            'Unable to restore bank.'
          )
        );

      } finally {

        setActionId(null);

      }

    };


  /*
  |--------------------------------------------------------------------------
  | Permanent Delete
  |--------------------------------------------------------------------------
  */

  const confirmPermanentDelete = (
    bank: Bank
  ) => {

    Alert.alert(
      'Permanently Delete Bank',
      `Permanently delete ${bank.bank_name}?\n\nThis action cannot be undone.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete Permanently',
          style: 'destructive',
          onPress: () =>
            permanentDelete(bank),
        },
      ]
    );

  };


  const permanentDelete =
    async (
      bank: Bank
    ) => {

      try {

        setActionId(bank.id);

        await banksApi.forceDelete(
          bank.id
        );

        setBanks(
          current =>
            current.filter(
              item =>
                item.id !==
                bank.id
            )
        );

        Alert.alert(
          'Bank deleted',
          `${bank.bank_name} has been permanently deleted.`
        );

      } catch (error: any) {

        console.log(
          'Permanent delete error:',
          error?.response?.data ??
          error
        );

        Alert.alert(
          'Delete failed',
          getApiErrorMessage(
            error,
            'Unable to permanently delete bank.'
          )
        );

      } finally {

        setActionId(null);

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
            Loading deleted banks...
          </Text>

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

        refreshControl={
          <RefreshControl
            refreshing={
              refreshing
            }

            onRefresh={() =>
              loadBanks(true)
            }

            tintColor={
              Colors.primary
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
              Deleted Banks
            </Text>

            <Text
              style={
                styles.subtitle
              }
            >
              Restore or permanently remove banks
            </Text>

          </View>


          <View
            style={
              styles.countBadge
            }
          >

            <Text
              style={
                styles.countText
              }
            >
              {banks.length}
            </Text>

          </View>

        </View>


        {/* WARNING */}

        <View
          style={
            styles.warningCard
          }
        >

          <View
            style={
              styles.warningIcon
            }
          >

            <Ionicons
              name="warning-outline"
              size={22}
              color={
                Colors.danger
              }
            />

          </View>


          <View
            style={
              styles.warningContent
            }
          >

            <Text
              style={
                styles.warningTitle
              }
            >
              Recycle Bin
            </Text>

            <Text
              style={
                styles.warningText
              }
            >
              Restored banks return to the active Banks list. Permanent deletion cannot be undone.
            </Text>

          </View>

        </View>


        {/* EMPTY */}

        {banks.length === 0 ? (

          <View
            style={
              styles.emptyContainer
            }
          >

            <View
              style={
                styles.emptyIcon
              }
            >

              <Ionicons
                name="trash-bin-outline"
                size={35}
                color={
                  Colors.textMuted
                }
              />

            </View>

            <Text
              style={
                styles.emptyTitle
              }
            >
              Recycle bin is empty
            </Text>

            <Text
              style={
                styles.emptySubtitle
              }
            >
              Deleted banks will appear here.
            </Text>


            <Pressable
              style={
                styles.returnButton
              }

              onPress={() =>
                router.back()
              }
            >

              <Ionicons
                name="arrow-back-outline"
                size={18}
                color={
                  Colors.white
                }
              />

              <Text
                style={
                  styles.returnText
                }
              >
                Back to Banks
              </Text>

            </Pressable>

          </View>

        ) : (

          <View
            style={
              styles.list
            }
          >

            {banks.map(
              bank => {

                const processing =
                  actionId ===
                  bank.id;

                return (

                  <View
                    key={bank.id}
                    style={
                      styles.bankCard
                    }
                  >

                    {/* BANK HEADER */}

                    <View
                      style={
                        styles.bankHeader
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
                          styles.bankHeaderContent
                        }
                      >

                        <Text
                          style={
                            styles.bankName
                          }
                          numberOfLines={2}
                        >
                          {bank.bank_name}
                        </Text>

                        <Text
                          style={
                            styles.bankCode
                          }
                        >
                          {bank.bank_id}
                        </Text>

                      </View>


                      <View
                        style={
                          styles.deletedBadge
                        }
                      >

                        <Text
                          style={
                            styles.deletedBadgeText
                          }
                        >
                          Deleted
                        </Text>

                      </View>

                    </View>


                    {/* INFORMATION */}

                    <View
                      style={
                        styles.details
                      }
                    >

                      <DetailRow
                        icon="card-outline"
                        label="Account"
                        value={
                          bank.account_no
                        }
                      />

                      <DetailRow
                        icon="location-outline"
                        label="Branch"
                        value={
                          bank.branch
                        }
                      />

                      <DetailRow
                        icon="calendar-outline"
                        label="Deleted"
                        value={
                          formatDate(
                            bank.deleted_at
                          )
                        }
                        last
                      />

                    </View>


                    {/* ACTIONS */}

                    <View
                      style={
                        styles.actions
                      }
                    >

                      <Pressable
                        disabled={
                          processing
                        }

                        onPress={() =>
                          confirmRestore(
                            bank
                          )
                        }

                        style={[
                          styles.restoreButton,

                          processing &&
                            styles.disabled,
                        ]}
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
                              name="refresh-outline"
                              size={18}
                              color={
                                Colors.primary
                              }
                            />

                            <Text
                              style={
                                styles.restoreText
                              }
                            >
                              Restore
                            </Text>
                          </>

                        )}

                      </Pressable>


                      <Pressable
                        disabled={
                          processing
                        }

                        onPress={() =>
                          confirmPermanentDelete(
                            bank
                          )
                        }

                        style={[
                          styles.deleteButton,

                          processing &&
                            styles.disabled,
                        ]}
                      >

                        <Ionicons
                          name="trash-outline"
                          size={18}
                          color={
                            Colors.danger
                          }
                        />

                      </Pressable>

                    </View>

                  </View>

                );

              }
            )}

          </View>

        )}

      </ScrollView>

    </SafeAreaView>
  );

}


/*
|--------------------------------------------------------------------------
| Detail Row
|--------------------------------------------------------------------------
*/

function DetailRow({
  icon,
  label,
  value,
  last = false,
}: {
  icon: any;
  label: string;
  value?: string | null;
  last?: boolean;
}) {

  return (

    <View
      style={[
        styles.detailRow,

        last &&
          styles.detailRowLast,
      ]}
    >

      <View
        style={
          styles.detailIcon
        }
      >

        <Ionicons
          name={icon}
          size={16}
          color={
            Colors.textSecondary
          }
        />

      </View>


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
        numberOfLines={1}
      >
        {value || '—'}
      </Text>

    </View>

  );

}


/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function formatDate(
  value?: string | null
): string {

  if (!value) {
    return '—';
  }

  return String(value)
    .substring(0, 10);

}


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

      fontSize: 10,

      fontFamily:
        Fonts.regular,

      color:
        Colors.textSecondary,
    },

    countBadge: {
      minWidth: 38,
      height: 38,

      paddingHorizontal: 10,

      borderRadius: 12,

      alignItems: 'center',
      justifyContent: 'center',

      backgroundColor:
        Colors.surface,

      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    countText: {
      fontSize: 13,

      fontFamily:
        Fonts.bold,

      color:
        Colors.text,
    },


    /*
    |--------------------------------------------------------------------------
    | Warning
    |--------------------------------------------------------------------------
    */

    warningCard: {
      marginTop: 24,

      padding: 15,

      flexDirection: 'row',

      borderRadius: 18,

      backgroundColor:
        Colors.surface,

      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    warningIcon: {
      width: 42,
      height: 42,

      borderRadius: 13,

      alignItems: 'center',
      justifyContent: 'center',

      backgroundColor:
        Colors.background,
    },

    warningContent: {
      flex: 1,
      marginLeft: 12,
    },

    warningTitle: {
      fontSize: 12,

      fontFamily:
        Fonts.bold,

      color:
        Colors.text,
    },

    warningText: {
      marginTop: 4,

      fontSize: 9,
      lineHeight: 14,

      fontFamily:
        Fonts.regular,

      color:
        Colors.textSecondary,
    },


    /*
    |--------------------------------------------------------------------------
    | List
    |--------------------------------------------------------------------------
    */

    list: {
      marginTop: 18,
      gap: 13,
    },

    bankCard: {
      padding: 16,

      borderRadius: 20,

      backgroundColor:
        Colors.surface,

      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    bankHeader: {
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

    bankHeaderContent: {
      flex: 1,

      marginLeft: 11,
      marginRight: 8,
    },

    bankName: {
      fontSize: 13,

      fontFamily:
        Fonts.bold,

      color:
        Colors.text,
    },

    bankCode: {
      marginTop: 3,

      fontSize: 9,

      fontFamily:
        Fonts.medium,

      color:
        Colors.textSecondary,
    },

    deletedBadge: {
      paddingHorizontal: 9,
      paddingVertical: 5,

      borderRadius: 10,

      backgroundColor:
        Colors.background,
    },

    deletedBadgeText: {
      fontSize: 8,

      fontFamily:
        Fonts.bold,

      color:
        Colors.danger,
    },


    /*
    |--------------------------------------------------------------------------
    | Details
    |--------------------------------------------------------------------------
    */

    details: {
      marginTop: 15,

      paddingTop: 4,

      borderTopWidth: 1,
      borderTopColor:
        Colors.border,
    },

    detailRow: {
      minHeight: 43,

      flexDirection: 'row',
      alignItems: 'center',

      borderBottomWidth: 1,
      borderBottomColor:
        Colors.border,
    },

    detailRowLast: {
      borderBottomWidth: 0,
    },

    detailIcon: {
      width: 28,
    },

    detailLabel: {
      width: 68,

      fontSize: 9,

      fontFamily:
        Fonts.medium,

      color:
        Colors.textMuted,
    },

    detailValue: {
      flex: 1,

      textAlign: 'right',

      fontSize: 10,

      fontFamily:
        Fonts.semiBold,

      color:
        Colors.text,
    },


    /*
    |--------------------------------------------------------------------------
    | Actions
    |--------------------------------------------------------------------------
    */

    actions: {
      marginTop: 13,

      flexDirection: 'row',

      gap: 9,
    },

    restoreButton: {
      flex: 1,
      height: 47,

      flexDirection: 'row',

      alignItems: 'center',
      justifyContent: 'center',

      gap: 7,

      borderRadius: 14,

      backgroundColor:
        Colors.primaryLight,

      borderWidth: 1,
      borderColor:
        Colors.primary,
    },

    restoreText: {
      fontSize: 11,

      fontFamily:
        Fonts.bold,

      color:
        Colors.primary,
    },

    deleteButton: {
      width: 50,
      height: 47,

      alignItems: 'center',
      justifyContent: 'center',

      borderRadius: 14,

      backgroundColor:
        Colors.background,

      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    disabled: {
      opacity: 0.5,
    },


    /*
    |--------------------------------------------------------------------------
    | Empty
    |--------------------------------------------------------------------------
    */

    emptyContainer: {
      marginTop: 75,

      alignItems: 'center',

      paddingHorizontal: 30,
    },

    emptyIcon: {
      width: 75,
      height: 75,

      borderRadius: 24,

      alignItems: 'center',
      justifyContent: 'center',

      backgroundColor:
        Colors.surface,

      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    emptyTitle: {
      marginTop: 18,

      fontSize: 16,

      fontFamily:
        Fonts.bold,

      color:
        Colors.text,
    },

    emptySubtitle: {
      marginTop: 5,

      fontSize: 10,

      fontFamily:
        Fonts.regular,

      color:
        Colors.textSecondary,
    },

    returnButton: {
      marginTop: 22,

      height: 46,

      paddingHorizontal: 18,

      flexDirection: 'row',

      alignItems: 'center',
      justifyContent: 'center',

      gap: 7,

      borderRadius: 14,

      backgroundColor:
        Colors.primary,
    },

    returnText: {
      fontSize: 11,

      fontFamily:
        Fonts.bold,

      color:
        Colors.white,
    },


    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    loadingContainer: {
      flex: 1,

      alignItems: 'center',
      justifyContent: 'center',
    },

    loadingText: {
      marginTop: 12,

      fontSize: 11,

      fontFamily:
        Fonts.medium,

      color:
        Colors.textSecondary,
    },

  });
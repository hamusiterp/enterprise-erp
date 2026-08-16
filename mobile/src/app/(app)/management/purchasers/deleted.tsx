import {
  ActivityIndicator,
  Alert,
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
import { router } from 'expo-router';

import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  Purchaser,
  purchasersApi,
} from '../../../../api/purchasersApi';

import {
  Colors,
} from '../../../../constants/colors';

import {
  Fonts,
} from '../../../../constants/fonts';


export default function DeletedPurchasersScreen() {

  const [
    purchasers,
    setPurchasers,
  ] =
    useState<Purchaser[]>([]);


  const [
    search,
    setSearch,
  ] =
    useState('');


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
    processingId,
    setProcessingId,
  ] =
    useState<number | null>(
      null
    );


  const [
    page,
    setPage,
  ] =
    useState(1);


  const [
    lastPage,
    setLastPage,
  ] =
    useState(1);


  const [
    total,
    setTotal,
  ] =
    useState(0);


  /*
  |--------------------------------------------------------------------------
  | Load Deleted Purchasers
  |--------------------------------------------------------------------------
  */

  const loadPurchasers =
    useCallback(
      async (
        requestedPage = 1
      ) => {

        try {

          const result =
            await purchasersApi.deleted({

              search:
                search.trim() ||
                undefined,

              page:
                requestedPage,

              per_page:
                10,

            });


          setPurchasers(
            result.data ?? []
          );


          setPage(
            result.pagination
              ?.current_page ?? 1
          );


          setLastPage(
            result.pagination
              ?.last_page ?? 1
          );


          setTotal(
            result.pagination
              ?.total ?? 0
          );

        } catch (error: any) {

          console.log(
            'DELETED PURCHASERS ERROR:',
            error?.response?.data ??
            error
          );


          Alert.alert(
            'Unable to Load',
            getApiError(
              error,
              'Unable to load deleted purchasers.'
            )
          );

        } finally {

          setLoading(false);

          setRefreshing(false);

        }

      },
      [search]
    );


  /*
  |--------------------------------------------------------------------------
  | Search
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    const timer =
      setTimeout(() => {

        setLoading(true);

        loadPurchasers(1);

      }, 300);


    return () =>
      clearTimeout(timer);

  }, [
    search,
    loadPurchasers,
  ]);


  /*
  |--------------------------------------------------------------------------
  | Refresh
  |--------------------------------------------------------------------------
  */

  const refresh =
    () => {

      setRefreshing(true);

      loadPurchasers(page);

    };


  /*
  |--------------------------------------------------------------------------
  | Restore
  |--------------------------------------------------------------------------
  */

  const restorePurchaser =
    (
      purchaser: Purchaser
    ) => {

      Alert.alert(
        'Restore Purchaser',
        `Restore ${purchaser.purchaser_no} - ${purchaser.purchaser_name}?`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },

          {
            text: 'Restore',

            onPress:
              async () => {

                try {

                  setProcessingId(
                    purchaser.id
                  );


                  await purchasersApi.restore(
                    purchaser.id
                  );


                  Alert.alert(
                    'Purchaser Restored',
                    `${purchaser.purchaser_name} has been restored successfully.`
                  );


                  await loadPurchasers(
                    page
                  );

                } catch (error: any) {

                  console.log(
                    'RESTORE PURCHASER ERROR:',
                    error?.response?.data ??
                    error
                  );


                  Alert.alert(
                    'Restore Failed',
                    getApiError(
                      error,
                      'Unable to restore purchaser.'
                    )
                  );

                } finally {

                  setProcessingId(
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
  | Permanent Delete
  |--------------------------------------------------------------------------
  */

  const forceDeletePurchaser =
    (
      purchaser: Purchaser
    ) => {

      Alert.alert(
        'Delete Permanently',
        `Permanently delete ${purchaser.purchaser_no} - ${purchaser.purchaser_name}? This action cannot be undone.`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },

          {
            text:
              'Delete Permanently',

            style:
              'destructive',

            onPress:
              async () => {

                try {

                  setProcessingId(
                    purchaser.id
                  );


                  await purchasersApi
                    .forceDelete(
                      purchaser.id
                    );


                  Alert.alert(
                    'Purchaser Deleted',
                    `${purchaser.purchaser_name} has been permanently deleted.`
                  );


                  await loadPurchasers(
                    page
                  );

                } catch (error: any) {

                  console.log(
                    'FORCE DELETE PURCHASER ERROR:',
                    error?.response?.data ??
                    error
                  );


                  Alert.alert(
                    'Delete Failed',
                    getApiError(
                      error,
                      'Unable to permanently delete purchaser.'
                    )
                  );

                } finally {

                  setProcessingId(
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
            Loading deleted purchasers...
          </Text>

        </View>

      </SafeAreaView>
    );

  }


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
              Deleted Purchasers
            </Text>


            <Text
              style={
                styles.subtitle
              }
            >
              Restore or permanently remove purchasers
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
              {total}
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
              size={21}
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
              Restore returns the purchaser to the normal purchaser list.
              Permanent deletion cannot be undone.
            </Text>

          </View>

        </View>


        {/* SEARCH */}

        <View
          style={
            styles.searchBox
          }
        >

          <Ionicons
            name="search-outline"
            size={19}
            color={
              Colors.textMuted
            }
          />


          <TextInput
            value={
              search
            }

            onChangeText={
              setSearch
            }

            placeholder="Search purchaser name or number..."

            placeholderTextColor={
              Colors.textMuted
            }

            style={
              styles.searchInput
            }
          />


          {search !== '' && (

            <Pressable
              onPress={() =>
                setSearch('')
              }
            >

              <Ionicons
                name="close-circle"
                size={19}
                color={
                  Colors.textMuted
                }
              />

            </Pressable>

          )}

        </View>


        {/* LIST HEADER */}

        <View
          style={
            styles.listHeader
          }
        >

          <Text
            style={
              styles.listTitle
            }
          >
            Deleted Purchasers
          </Text>


          <Text
            style={
              styles.resultCount
            }
          >
            {total} records
          </Text>

        </View>


        {/* EMPTY */}

        {purchasers.length === 0 ? (

          <View
            style={
              styles.emptyCard
            }
          >

            <View
              style={
                styles.emptyIcon
              }
            >

              <Ionicons
                name="trash-outline"
                size={34}
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
              No Deleted Purchasers
            </Text>


            <Text
              style={
                styles.emptyText
              }
            >
              Deleted purchasers will appear here.
            </Text>

          </View>

        ) : (

          purchasers.map(
            purchaser => {

              const processing =
                processingId ===
                purchaser.id;


              const primary =
                purchaser.primary_account;


              const bankName =
                primary
                  ?.bank
                  ?.name ??
                'No primary bank';


              const accountNumber =
                primary
                  ?.account_number ??
                'No primary account';


              return (

                <View
                  key={
                    purchaser.id
                  }

                  style={
                    styles.purchaserCard
                  }
                >

                  {/* TOP */}

                  <View
                    style={
                      styles.purchaserTop
                    }
                  >

                    <View
                      style={
                        styles.purchaserIcon
                      }
                    >

                      <Ionicons
                        name="person-outline"
                        size={22}
                        color={
                          Colors.primary
                        }
                      />

                    </View>


                    <View
                      style={
                        styles.purchaserHeading
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

                        numberOfLines={2}
                      >
                        {
                          purchaser.purchaser_name
                        }
                      </Text>

                    </View>


                    <View
                      style={
                        styles.deletedBadge
                      }
                    >

                      <Text
                        style={
                          styles.deletedText
                        }
                      >
                        Deleted
                      </Text>

                    </View>

                  </View>


                  {/* PRIMARY ACCOUNT */}

                  <View
                    style={
                      styles.primaryCard
                    }
                  >

                    <View
                      style={
                        styles.primaryTitleRow
                      }
                    >

                      <Ionicons
                        name="star-outline"
                        size={14}
                        color={
                          Colors.primary
                        }
                      />


                      <Text
                        style={
                          styles.primaryTitle
                        }
                      >
                        Primary Account
                      </Text>

                    </View>


                    <View
                      style={
                        styles.primaryRow
                      }
                    >

                      <View
                        style={
                          styles.bankIcon
                        }
                      >

                        <Ionicons
                          name="business-outline"
                          size={17}
                          color={
                            Colors.textSecondary
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
                            styles.bankName
                          }

                          numberOfLines={1}
                        >
                          {bankName}
                        </Text>


                        <Text
                          style={
                            styles.accountNumber
                          }

                          numberOfLines={1}
                        >
                          {accountNumber}
                        </Text>


                        {primary?.currency && (

                          <Text
                            style={
                              styles.currencyText
                            }
                          >
                            {
                              primary.currency
                            }
                          </Text>

                        )}

                      </View>

                    </View>

                  </View>


                  {/* INFO */}

                  <View
                    style={
                      styles.detailSection
                    }
                  >

                    <DetailRow
                      icon="wallet-outline"
                      label="Accounts"
                      value={
                        String(
                          purchaser.accounts_count ??
                          purchaser.accounts?.length ??
                          0
                        )
                      }
                    />


                    <DetailRow
                      icon="checkmark-circle-outline"
                      label="Active"
                      value={
                        String(
                          purchaser.active_accounts_count ??
                          0
                        )
                      }
                    />


                    <DetailRow
                      icon="calendar-outline"
                      label="Registered"
                      value={
                        purchaser.date_registered ??
                        '-'
                      }
                    />


                    <DetailRow
                      icon="trash-outline"
                      label="Deleted"
                      value={
                        normalizeDateTime(
                          purchaser.deleted_at
                        )
                      }
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

                      style={[
                        styles.restoreButton,

                        processing &&
                          styles.disabled,
                      ]}

                      onPress={() =>
                        restorePurchaser(
                          purchaser
                        )
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
                            name="refresh-outline"
                            size={17}
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

                      style={[
                        styles.deleteButton,

                        processing &&
                          styles.disabled,
                      ]}

                      onPress={() =>
                        forceDeletePurchaser(
                          purchaser
                        )
                      }
                    >

                      <Ionicons
                        name="trash-outline"
                        size={17}
                        color="#FFFFFF"
                      />


                      <Text
                        style={
                          styles.deleteText
                        }
                      >
                        Delete
                      </Text>

                    </Pressable>

                  </View>

                </View>

              );

            }
          )

        )}


        {/* PAGINATION */}

        {lastPage > 1 && (

          <View
            style={
              styles.pagination
            }
          >

            <Pressable
              disabled={
                page <= 1
              }

              style={[
                styles.pageButton,

                page <= 1 &&
                  styles.pageButtonDisabled,
              ]}

              onPress={() =>
                loadPurchasers(
                  page - 1
                )
              }
            >

              <Ionicons
                name="chevron-back"
                size={17}
                color={
                  Colors.text
                }
              />


              <Text
                style={
                  styles.pageButtonText
                }
              >
                Previous
              </Text>

            </Pressable>


            <Text
              style={
                styles.pageText
              }
            >
              {page} / {lastPage}
            </Text>


            <Pressable
              disabled={
                page >=
                lastPage
              }

              style={[
                styles.pageButton,

                page >=
                  lastPage &&
                  styles.pageButtonDisabled,
              ]}

              onPress={() =>
                loadPurchasers(
                  page + 1
                )
              }
            >

              <Text
                style={
                  styles.pageButtonText
                }
              >
                Next
              </Text>


              <Ionicons
                name="chevron-forward"
                size={17}
                color={
                  Colors.text
                }
              />

            </Pressable>

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
}: {
  icon: string;
  label: string;
  value: string;
}) {

  return (
    <View
      style={
        styles.detailRow
      }
    >

      <Ionicons
        name={
          icon as any
        }
        size={15}
        color={
          Colors.textMuted
        }
      />


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

        numberOfLines={2}
      >
        {value}
      </Text>

    </View>
  );

}


/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function normalizeDateTime(
  value?:
    | string
    | null
) {

  if (!value) {
    return '-';
  }


  return String(value)
    .replace(
      'T',
      ' '
    )
    .substring(
      0,
      19
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
      paddingBottom: 50,
    },

    center: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },

    loadingText: {
      marginTop: 11,
      fontSize: 10,
      fontFamily:
        Fonts.regular,
      color:
        Colors.textSecondary,
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
      fontSize: 20,
      fontFamily:
        Fonts.extraBold,
      color:
        Colors.text,
    },

    subtitle: {
      marginTop: 2,
      fontSize: 9,
      fontFamily:
        Fonts.regular,
      color:
        Colors.textSecondary,
    },

    countBadge: {
      minWidth: 39,
      height: 39,
      paddingHorizontal: 9,
      borderRadius: 13,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        Colors.primaryLight,
    },

    countText: {
      fontSize: 12,
      fontFamily:
        Fonts.bold,
      color:
        Colors.primary,
    },

    /*
    |--------------------------------------------------------------------------
    | Warning
    |--------------------------------------------------------------------------
    */

    warningCard: {
      marginTop: 20,
      padding: 14,
      flexDirection: 'row',
      borderRadius: 16,
      backgroundColor:
        Colors.surface,
      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    warningIcon: {
      width: 40,
      height: 40,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        Colors.background,
    },

    warningContent: {
      flex: 1,
      marginLeft: 10,
    },

    warningTitle: {
      fontSize: 10,
      fontFamily:
        Fonts.bold,
      color:
        Colors.text,
    },

    warningText: {
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
    | Search
    |--------------------------------------------------------------------------
    */

    searchBox: {
      marginTop: 16,
      height: 48,
      paddingHorizontal: 14,
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 15,
      backgroundColor:
        Colors.surface,
      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    searchInput: {
      flex: 1,
      marginLeft: 9,
      fontSize: 11,
      fontFamily:
        Fonts.regular,
      color:
        Colors.text,
    },

    /*
    |--------------------------------------------------------------------------
    | List
    |--------------------------------------------------------------------------
    */

    listHeader: {
      marginTop: 24,
      marginBottom: 11,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'space-between',
    },

    listTitle: {
      fontSize: 16,
      fontFamily:
        Fonts.extraBold,
      color:
        Colors.text,
    },

    resultCount: {
      fontSize: 9,
      fontFamily:
        Fonts.regular,
      color:
        Colors.textSecondary,
    },

    emptyCard: {
      paddingVertical: 50,
      alignItems: 'center',
      borderRadius: 18,
      backgroundColor:
        Colors.surface,
      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    emptyIcon: {
      width: 64,
      height: 64,
      borderRadius: 21,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        Colors.background,
    },

    emptyTitle: {
      marginTop: 13,
      fontSize: 13,
      fontFamily:
        Fonts.bold,
      color:
        Colors.text,
    },

    emptyText: {
      marginTop: 4,
      fontSize: 10,
      fontFamily:
        Fonts.regular,
      color:
        Colors.textSecondary,
    },

    /*
    |--------------------------------------------------------------------------
    | Purchaser Card
    |--------------------------------------------------------------------------
    */

    purchaserCard: {
      marginBottom: 14,
      padding: 15,
      borderRadius: 18,
      backgroundColor:
        Colors.surface,
      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    purchaserTop: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    purchaserIcon: {
      width: 44,
      height: 44,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        Colors.primaryLight,
    },

    purchaserHeading: {
      flex: 1,
      marginLeft: 11,
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
      fontSize: 13,
      lineHeight: 18,
      fontFamily:
        Fonts.bold,
      color:
        Colors.text,
    },

    deletedBadge: {
      paddingHorizontal: 8,
      paddingVertical: 5,
      borderRadius: 9,
      backgroundColor:
        Colors.background,
    },

    deletedText: {
      fontSize: 8,
      fontFamily:
        Fonts.bold,
      color:
        Colors.danger,
    },

    /*
    |--------------------------------------------------------------------------
    | Primary Account
    |--------------------------------------------------------------------------
    */

    primaryCard: {
      marginTop: 14,
      padding: 11,
      borderRadius: 13,
      backgroundColor:
        Colors.background,
    },

    primaryTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    primaryTitle: {
      marginLeft: 5,
      fontSize: 8,
      fontFamily:
        Fonts.bold,
      color:
        Colors.primary,
    },

    primaryRow: {
      marginTop: 8,
      flexDirection: 'row',
      alignItems: 'center',
    },

    bankIcon: {
      width: 35,
      height: 35,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        Colors.surface,
    },

    primaryContent: {
      flex: 1,
      marginLeft: 8,
    },

    bankName: {
      fontSize: 9,
      fontFamily:
        Fonts.bold,
      color:
        Colors.text,
    },

    accountNumber: {
      marginTop: 2,
      fontSize: 9,
      fontFamily:
        Fonts.medium,
      color:
        Colors.textSecondary,
    },

    currencyText: {
      marginTop: 2,
      fontSize: 7,
      fontFamily:
        Fonts.bold,
      color:
        Colors.primary,
    },

    /*
    |--------------------------------------------------------------------------
    | Details
    |--------------------------------------------------------------------------
    */

    detailSection: {
      marginTop: 13,
      paddingTop: 5,
      borderTopWidth: 1,
      borderTopColor:
        Colors.border,
    },

    detailRow: {
      minHeight: 39,
      flexDirection: 'row',
      alignItems: 'center',
    },

    detailLabel: {
      marginLeft: 7,
      width: 72,
      fontSize: 9,
      fontFamily:
        Fonts.medium,
      color:
        Colors.textMuted,
    },

    detailValue: {
      flex: 1,
      textAlign: 'right',
      fontSize: 9,
      lineHeight: 14,
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
      marginTop: 14,
      paddingTop: 13,
      flexDirection: 'row',
      gap: 9,
      borderTopWidth: 1,
      borderTopColor:
        Colors.border,
    },

    restoreButton: {
      flex: 1,
      height: 44,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      borderRadius: 13,
      backgroundColor:
        Colors.primaryLight,
      borderWidth: 1,
      borderColor:
        Colors.primary,
    },

    restoreText: {
      fontSize: 10,
      fontFamily:
        Fonts.bold,
      color:
        Colors.primary,
    },

    deleteButton: {
      flex: 1,
      height: 44,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      borderRadius: 13,
      backgroundColor:
        '#C83D3D',
    },

    deleteText: {
      fontSize: 10,
      fontFamily:
        Fonts.bold,
      color: '#FFFFFF',
    },

    disabled: {
      opacity: 0.5,
    },

    /*
    |--------------------------------------------------------------------------
    | Pagination
    |--------------------------------------------------------------------------
    */

    pagination: {
      marginTop: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'space-between',
    },

    pageButton: {
      minWidth: 95,
      height: 42,
      paddingHorizontal: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 13,
      backgroundColor:
        Colors.surface,
      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    pageButtonDisabled: {
      opacity: 0.35,
    },

    pageButtonText: {
      marginHorizontal: 3,
      fontSize: 9,
      fontFamily:
        Fonts.bold,
      color:
        Colors.text,
    },

    pageText: {
      fontSize: 10,
      fontFamily:
        Fonts.bold,
      color:
        Colors.textSecondary,
    },

  });
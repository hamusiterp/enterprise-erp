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
  Subcontractor,
  subcontractorsApi,
} from '../../../../api/subcontractorsApi';

import {
  Colors,
} from '../../../../constants/colors';

import {
  Fonts,
} from '../../../../constants/fonts';


export default function DeletedSubcontractorsScreen() {

  const [
    subcontractors,
    setSubcontractors,
  ] =
    useState<Subcontractor[]>([]);


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
  | Load Deleted Subcontractors
  |--------------------------------------------------------------------------
  */

  const loadSubcontractors =
    useCallback(
      async (
        requestedPage = 1
      ) => {

        try {

          const result =
            await subcontractorsApi.deleted({

              search:
                search.trim() ||
                undefined,

              page:
                requestedPage,

              per_page:
                10,

            });


          setSubcontractors(
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
            'DELETED SUBCONTRACTORS ERROR:',
            error?.response?.data ??
            error
          );


          Alert.alert(
            'Unable to Load',
            getApiError(
              error,
              'Unable to load deleted subcontractors.'
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

        loadSubcontractors(1);

      }, 300);


    return () =>
      clearTimeout(timer);

  }, [
    search,
    loadSubcontractors,
  ]);


  /*
  |--------------------------------------------------------------------------
  | Refresh
  |--------------------------------------------------------------------------
  */

  const refresh =
    () => {

      setRefreshing(true);

      loadSubcontractors(page);

    };


  /*
  |--------------------------------------------------------------------------
  | Restore
  |--------------------------------------------------------------------------
  */

  const restoreSubcontractor =
    (
      subcontractor:
        Subcontractor
    ) => {

      Alert.alert(
        'Restore Subcontractor',

        `Restore ${subcontractor.display_name}?`,

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
                    subcontractor.id
                  );


                  await subcontractorsApi
                    .restore(
                      subcontractor.id
                    );


                  Alert.alert(
                    'Subcontractor Restored',
                    `${subcontractor.display_name} has been restored successfully.`
                  );


                  await loadSubcontractors(
                    page
                  );

                } catch (error: any) {

                  console.log(
                    'RESTORE SUBCONTRACTOR ERROR:',
                    error?.response?.data ??
                    error
                  );


                  Alert.alert(
                    'Restore Failed',
                    getApiError(
                      error,
                      'Unable to restore subcontractor.'
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
            Loading deleted subcontractors...
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
              Deleted Subcontractors
            </Text>


            <Text
              style={
                styles.subtitle
              }
            >
              Restore deleted subcontractors
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


        {/* INFO */}

        <View
          style={
            styles.infoCard
          }
        >

          <View
            style={
              styles.infoIcon
            }
          >

            <Ionicons
              name="trash-outline"
              size={21}
              color={
                Colors.primary
              }
            />

          </View>


          <View
            style={
              styles.infoContent
            }
          >

            <Text
              style={
                styles.infoTitle
              }
            >
              Recycle Bin
            </Text>


            <Text
              style={
                styles.infoText
              }
            >
              Restoring a subcontractor returns it to the normal subcontractor list.
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

            placeholder="Search deleted subcontractors..."

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
            Deleted Records
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

        {subcontractors.length ===
        0 ? (

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
              No Deleted Subcontractors
            </Text>


            <Text
              style={
                styles.emptyText
              }
            >
              Deleted subcontractors will appear here.
            </Text>

          </View>

        ) : (

          subcontractors.map(
            subcontractor => {

              const processing =
                processingId ===
                subcontractor.id;


              const isCompany =
                subcontractor.type ===
                'company';


              const categoryName =
                subcontractor.category
                  ?.name ??
                '-';


              return (

                <View
                  key={
                    subcontractor.id
                  }

                  style={
                    styles.card
                  }
                >

                  {/* TOP */}

                  <View
                    style={
                      styles.cardTop
                    }
                  >

                    <View
                      style={
                        styles.cardIcon
                      }
                    >

                      <Ionicons
                        name={
                          isCompany
                            ? 'business-outline'
                            : 'person-outline'
                        }
                        size={22}
                        color={
                          Colors.primary
                        }
                      />

                    </View>


                    <View
                      style={
                        styles.cardHeading
                      }
                    >

                      <Text
                        style={
                          styles.typeText
                        }
                      >
                        {
                          isCompany
                            ? 'Company'
                            : 'Individual'
                        }
                      </Text>


                      <Text
                        style={
                          styles.nameText
                        }

                        numberOfLines={2}
                      >
                        {
                          subcontractor.display_name
                        }
                      </Text>


                      <Text
                        style={
                          styles.categoryText
                        }
                      >
                        {categoryName}
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


                  {/* DETAILS */}

                  <View
                    style={
                      styles.detailSection
                    }
                  >

                    <DetailRow
                      icon="call-outline"
                      label="Phone"
                      value={
                        subcontractor.phone_number
                      }
                    />


                    <DetailRow
                      icon="person-circle-outline"
                      label="Contact"
                      value={
                        subcontractor.contact_person
                      }
                    />


                    <DetailRow
                      icon="cash-outline"
                      label="Tax"
                      value={
                        `${subcontractor.tax_percent}%`
                      }
                    />


                    {isCompany && (

                      <DetailRow
                        icon="document-text-outline"
                        label="TIN"
                        value={
                          subcontractor.tin_no ??
                          '-'
                        }
                      />

                    )}


                    <DetailRow
                      icon="calendar-outline"
                      label="Registered"
                      value={
                        subcontractor.date_registered ??
                        '-'
                      }
                    />


                    <DetailRow
                      icon="trash-outline"
                      label="Deleted"
                      value={
                        subcontractor.deleted_at ??
                        '-'
                      }
                    />

                  </View>


                  {/* RESTORE */}

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
                      restoreSubcontractor(
                        subcontractor
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
                          Restore Subcontractor
                        </Text>

                      </>

                    )}

                  </Pressable>

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
                  styles.pageDisabled,
              ]}

              onPress={() =>
                loadSubcontractors(
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
                  styles.pageDisabled,
              ]}

              onPress={() =>
                loadSubcontractors(
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

  value:
    | string
    | null
    | undefined;
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
        {value || '-'}
      </Text>

    </View>
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
    },

    loadingText: {
      marginTop: 11,
      fontSize: 10,
      fontFamily:
        Fonts.regular,
      color:
        Colors.textSecondary,
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

    infoCard: {
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

    infoIcon: {
      width: 40,
      height: 40,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        Colors.primaryLight,
    },

    infoContent: {
      flex: 1,
      marginLeft: 10,
    },

    infoTitle: {
      fontSize: 10,
      fontFamily:
        Fonts.bold,
      color:
        Colors.text,
    },

    infoText: {
      marginTop: 3,
      fontSize: 9,
      lineHeight: 14,
      fontFamily:
        Fonts.regular,
      color:
        Colors.textSecondary,
    },

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

    card: {
      marginBottom: 14,
      padding: 15,
      borderRadius: 18,
      backgroundColor:
        Colors.surface,
      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    cardTop: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    cardIcon: {
      width: 44,
      height: 44,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        Colors.primaryLight,
    },

    cardHeading: {
      flex: 1,
      marginLeft: 11,
      marginRight: 8,
    },

    typeText: {
      fontSize: 8,
      fontFamily:
        Fonts.bold,
      color:
        Colors.primary,
    },

    nameText: {
      marginTop: 3,
      fontSize: 13,
      lineHeight: 18,
      fontFamily:
        Fonts.bold,
      color:
        Colors.text,
    },

    categoryText: {
      marginTop: 3,
      fontSize: 9,
      fontFamily:
        Fonts.medium,
      color:
        Colors.textSecondary,
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

    restoreButton: {
      marginTop: 14,
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

    disabled: {
      opacity: 0.5,
    },

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

    pageDisabled: {
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
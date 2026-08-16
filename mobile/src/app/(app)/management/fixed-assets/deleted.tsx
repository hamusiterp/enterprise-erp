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
  FixedAsset,
  fixedAssetsApi,
} from '../../../../api/fixedAssetsApi';

import {
  Colors,
} from '../../../../constants/colors';

import {
  Fonts,
} from '../../../../constants/fonts';


export default function DeletedFixedAssetsScreen() {

  const [
    assets,
    setAssets,
  ] =
    useState<FixedAsset[]>([]);


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
  | Load Deleted Assets
  |--------------------------------------------------------------------------
  */

  const loadAssets =
    useCallback(
      async (
        requestedPage = 1
      ) => {

        try {

          const result =
            await fixedAssetsApi.deleted({

              search:
                search.trim() ||
                undefined,

              page:
                requestedPage,

              per_page:
                10,

            });


          setAssets(
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
            'DELETED FIXED ASSETS ERROR:',
            error?.response?.data ??
            error
          );


          Alert.alert(
            'Unable to Load',
            getApiError(
              error,
              'Unable to load deleted fixed assets.'
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
  | Search Load
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    const timer =
      setTimeout(() => {

        setLoading(true);

        loadAssets(1);

      }, 300);


    return () =>
      clearTimeout(timer);

  }, [
    search,
    loadAssets,
  ]);


  /*
  |--------------------------------------------------------------------------
  | Refresh
  |--------------------------------------------------------------------------
  */

  const refresh =
    () => {

      setRefreshing(true);

      loadAssets(page);

    };


  /*
  |--------------------------------------------------------------------------
  | Restore
  |--------------------------------------------------------------------------
  */

  const restoreAsset =
    (
      asset: FixedAsset
    ) => {

      Alert.alert(
        'Restore Fixed Asset',
        `Restore ${asset.asset_no} - ${asset.name_of_machinery}?`,
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
                    asset.id
                  );


                  await fixedAssetsApi
                    .restore(
                      asset.id
                    );


                  Alert.alert(
                    'Fixed Asset Restored',
                    `${asset.asset_no} has been restored successfully.`
                  );


                  await loadAssets(
                    page
                  );

                } catch (error: any) {

                  console.log(
                    'RESTORE FIXED ASSET ERROR:',
                    error?.response?.data ??
                    error
                  );


                  Alert.alert(
                    'Restore Failed',
                    getApiError(
                      error,
                      'Unable to restore fixed asset.'
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

  const forceDeleteAsset =
    (
      asset: FixedAsset
    ) => {

      Alert.alert(
        'Delete Permanently',
        `Permanently delete ${asset.asset_no} - ${asset.name_of_machinery}? This will also delete all photos and documents. This action cannot be undone.`,
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
                    asset.id
                  );


                  await fixedAssetsApi
                    .forceDelete(
                      asset.id
                    );


                  Alert.alert(
                    'Fixed Asset Deleted',
                    `${asset.asset_no} has been permanently deleted.`
                  );


                  await loadAssets(
                    page
                  );

                } catch (error: any) {

                  console.log(
                    'FORCE DELETE FIXED ASSET ERROR:',
                    error?.response?.data ??
                    error
                  );


                  Alert.alert(
                    'Delete Failed',
                    getApiError(
                      error,
                      'Unable to permanently delete fixed asset.'
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
            Loading deleted fixed assets...
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
              Deleted Fixed Assets
            </Text>


            <Text
              style={
                styles.subtitle
              }
            >
              Restore or permanently remove assets
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
              Restore returns the asset to the fixed asset list. Permanent
              deletion also removes its stored photos and documents.
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

            placeholder="Search asset, vehicle, plate, tag..."

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
            Deleted Assets
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

        {assets.length === 0 ? (

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
              No Deleted Fixed Assets
            </Text>


            <Text
              style={
                styles.emptyText
              }
            >
              Deleted fixed assets will appear here.
            </Text>

          </View>

        ) : (

          assets.map(
            asset => {

              const processing =
                processingId ===
                asset.id;


              const categoryName =
                asset.category
                  ?.name ??
                '-';


              const hasGauge =
                toBoolean(
                  asset.has_gauge
                );


              return (

                <View
                  key={
                    asset.id
                  }

                  style={
                    styles.assetCard
                  }
                >

                  {/* TOP */}

                  <View
                    style={
                      styles.assetTop
                    }
                  >

                    <View
                      style={
                        styles.assetIcon
                      }
                    >

                      <Ionicons
                        name="car-sport-outline"
                        size={22}
                        color={
                          Colors.primary
                        }
                      />

                    </View>


                    <View
                      style={
                        styles.assetHeading
                      }
                    >

                      <Text
                        style={
                          styles.assetNo
                        }
                      >
                        {asset.asset_no}
                      </Text>


                      <Text
                        style={
                          styles.assetName
                        }
                        numberOfLines={2}
                      >
                        {
                          asset.name_of_machinery
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
                      icon="car-outline"
                      label="Vehicle"
                      value={
                        asset.vehicle_no ||
                        '-'
                      }
                    />


                    <DetailRow
                      icon="card-outline"
                      label="Plate"
                      value={
                        asset.plate_no ||
                        '-'
                      }
                    />


                    <DetailRow
                      icon="pricetag-outline"
                      label="Tag"
                      value={
                        asset.tag_no ||
                        '-'
                      }
                    />


                    <DetailRow
                      icon="pulse-outline"
                      label="Condition"
                      value={
                        formatCondition(
                          asset.asset_condition
                        )
                      }
                    />


                    <DetailRow
                      icon="speedometer-outline"
                      label="Gauge"
                      value={
                        hasGauge
                          ? 'Yes'
                          : 'No'
                      }
                    />


                    <DetailRow
                      icon="calendar-outline"
                      label="Deleted"
                      value={
                        normalizeDateTime(
                          asset.deleted_at
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
                        restoreAsset(
                          asset
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
                        forceDeleteAsset(
                          asset
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
                loadAssets(
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
                loadAssets(
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


function formatCondition(
  value: string
) {

  switch (value) {

    case 'excellent':
      return 'Excellent';

    case 'good':
      return 'Good';

    case 'fair':
      return 'Fair';

    case 'poor':
      return 'Poor';

    case 'out_of_service':
      return 'Out of Service';

    default:
      return value || '-';

  }

}


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
    | Card
    |--------------------------------------------------------------------------
    */

    assetCard: {
      marginBottom: 14,
      padding: 15,
      borderRadius: 18,
      backgroundColor:
        Colors.surface,
      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    assetTop: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    assetIcon: {
      width: 44,
      height: 44,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        Colors.primaryLight,
    },

    assetHeading: {
      flex: 1,
      marginLeft: 11,
      marginRight: 8,
    },

    assetNo: {
      fontSize: 9,
      fontFamily:
        Fonts.bold,
      color:
        Colors.primary,
    },

    assetName: {
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
      marginTop: 14,
      paddingTop: 5,
      borderTopWidth: 1,
      borderTopColor:
        Colors.border,
    },

    detailRow: {
      minHeight: 40,
      flexDirection: 'row',
      alignItems: 'center',
    },

    detailLabel: {
      marginLeft: 7,
      width: 65,
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
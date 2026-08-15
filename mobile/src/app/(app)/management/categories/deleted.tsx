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
import { useCallback, useEffect, useState } from 'react';

import {
  Category,
  categoriesApi,
} from '../../../../api/categoriesApi';

import { Colors } from '../../../../constants/colors';
import { Fonts } from '../../../../constants/fonts';


export default function DeletedCategoriesScreen() {

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [search, setSearch] =
    useState('');

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [
    processingId,
    setProcessingId,
  ] = useState<number | null>(
    null
  );


  /*
  |--------------------------------------------------------------------------
  | Load Deleted Categories
  |--------------------------------------------------------------------------
  */

  const loadCategories =
    useCallback(
      async () => {

        try {

          const result =
            await categoriesApi.deleted({
              search:
                search.trim() ||
                undefined,

              page: 1,

              per_page: 100,
            });


          setCategories(
            result.data ?? []
          );

        } catch (error: any) {

          console.log(
            'DELETED CATEGORIES ERROR:',
            error?.response?.data ??
            error
          );


          Alert.alert(
            'Unable to Load',
            getApiError(
              error,
              'Unable to load deleted categories.'
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
  | Initial / Search Load
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    const timer =
      setTimeout(() => {

        setLoading(true);

        loadCategories();

      }, 300);


    return () =>
      clearTimeout(timer);

  }, [
    search,
    loadCategories,
  ]);


  /*
  |--------------------------------------------------------------------------
  | Refresh
  |--------------------------------------------------------------------------
  */

  const refresh =
    () => {

      setRefreshing(true);

      loadCategories();

    };


  /*
  |--------------------------------------------------------------------------
  | Restore
  |--------------------------------------------------------------------------
  */

  const restoreCategory =
    (
      category: Category
    ) => {

      Alert.alert(
        'Restore Category',
        `Restore ${category.category}?`,
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
                    category.id
                  );


                  await categoriesApi
                    .restore(
                      category.id
                    );


                  setCategories(
                    current =>
                      current.filter(
                        item =>
                          item.id !==
                          category.id
                      )
                  );


                  Alert.alert(
                    'Category Restored',
                    `${category.category} has been restored successfully.`
                  );

                } catch (error: any) {

                  console.log(
                    'RESTORE CATEGORY ERROR:',
                    error?.response?.data ??
                    error
                  );


                  Alert.alert(
                    'Restore Failed',
                    getApiError(
                      error,
                      'Unable to restore category.'
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

  const forceDeleteCategory =
    (
      category: Category
    ) => {

      Alert.alert(
        'Delete Permanently',
        `Permanently delete ${category.category}? This action cannot be undone.`,
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
                    category.id
                  );


                  await categoriesApi
                    .forceDelete(
                      category.id
                    );


                  setCategories(
                    current =>
                      current.filter(
                        item =>
                          item.id !==
                          category.id
                      )
                  );


                  Alert.alert(
                    'Category Deleted',
                    `${category.category} has been permanently deleted.`
                  );

                } catch (error: any) {

                  console.log(
                    'FORCE DELETE CATEGORY ERROR:',
                    error?.response?.data ??
                    error
                  );


                  Alert.alert(
                    'Delete Failed',
                    getApiError(
                      error,
                      'Unable to permanently delete category.'
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
            Loading deleted categories...
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
              Deleted Categories
            </Text>

            <Text
              style={
                styles.subtitle
              }
            >
              Restore or permanently remove categories
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
              {categories.length}
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
              Restore makes the category available again. Permanent deletion cannot be undone.
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
            placeholder="Search deleted categories..."
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


        {/* LIST */}

        {categories.length ===
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
                size={33}
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
              No Deleted Categories
            </Text>

            <Text
              style={
                styles.emptyText
              }
            >
              Deleted categories will appear here.
            </Text>

          </View>

        ) : (

          categories.map(
            category => {

              const processing =
                processingId ===
                category.id;

              return (

                <View
                  key={
                    category.id
                  }
                  style={
                    styles.categoryCard
                  }
                >

                  {/* TOP */}

                  <View
                    style={
                      styles.categoryTop
                    }
                  >

                    <View
                      style={
                        styles.categoryIcon
                      }
                    >
                      <Ionicons
                        name="folder-outline"
                        size={22}
                        color={
                          Colors.primary
                        }
                      />
                    </View>


                    <View
                      style={
                        styles.categoryHeading
                      }
                    >

                      <Text
                        style={
                          styles.categoryName
                        }
                        numberOfLines={2}
                      >
                        {
                          category.category
                        }
                      </Text>

                      <Text
                        style={
                          styles.categoryType
                        }
                      >
                        {
                          category.type ||
                          '-'
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


                  {/* DETAILS */}

                  <View
                    style={
                      styles.detailSection
                    }
                  >

                    <DetailRow
                      icon="pricetag-outline"
                      label="Type"
                      value={
                        category.type ||
                        '-'
                      }
                    />

                    <DetailRow
                      icon="calendar-outline"
                      label="Deleted"
                      value={
                        normalizeDateTime(
                          category.deleted_at
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
                        restoreCategory(
                          category
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
                        forceDeleteCategory(
                          category
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
        name={icon as any}
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
    .replace('T', ' ')
    .substring(0, 19);
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

    emptyCard: {
      marginTop: 22,
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

    categoryCard: {
      marginTop: 14,
      padding: 15,
      borderRadius: 18,
      backgroundColor:
        Colors.surface,
      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    categoryTop: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    categoryIcon: {
      width: 44,
      height: 44,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        Colors.primaryLight,
    },

    categoryHeading: {
      flex: 1,
      marginLeft: 11,
      marginRight: 8,
    },

    categoryName: {
      fontSize: 13,
      lineHeight: 18,
      fontFamily:
        Fonts.bold,
      color:
        Colors.text,
    },

    categoryType: {
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
      paddingTop: 4,
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
      width: 55,
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
      fontFamily:
        Fonts.semiBold,
      color:
        Colors.text,
    },

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

  });
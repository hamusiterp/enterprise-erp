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
  Category,
  categoriesApi,
} from '../../../../../api/categoriesApi';

import {
  Colors,
} from '../../../../../constants/colors';

import {
  Fonts,
} from '../../../../../constants/fonts';


export default function CategoryDetailsScreen() {

  const params =
    useLocalSearchParams();

  const rawId =
    Array.isArray(params.id)
      ? params.id[0]
      : params.id;

  const categoryId =
    Number(rawId);


  const [
    category,
    setCategory,
  ] =
    useState<Category | null>(
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
    changingStatus,
    setChangingStatus,
  ] =
    useState(false);

  const [
    deleting,
    setDeleting,
  ] =
    useState(false);


  /*
  |--------------------------------------------------------------------------
  | Load Category
  |--------------------------------------------------------------------------
  */

  const loadCategory =
    useCallback(
      async () => {

        if (
          !categoryId ||
          Number.isNaN(
            categoryId
          )
        ) {
          setLoading(false);
          return;
        }

        try {

          const result =
            await categoriesApi.get(
              categoryId
            );

          setCategory(
            result
          );

        } catch (error: any) {

          console.log(
            'CATEGORY DETAILS ERROR:',
            error?.response?.data ??
            error
          );

          Alert.alert(
            'Unable to Load',
            'Unable to load category.'
          );

        } finally {

          setLoading(false);
          setRefreshing(false);

        }

      },
      [categoryId]
    );


  useEffect(() => {

    loadCategory();

  }, [loadCategory]);


  /*
  |--------------------------------------------------------------------------
  | Refresh
  |--------------------------------------------------------------------------
  */

  const refresh =
    () => {

      setRefreshing(true);

      loadCategory();

    };


  /*
  |--------------------------------------------------------------------------
  | Status
  |--------------------------------------------------------------------------
  */

  const toggleStatus =
    () => {

      if (
        !category ||
        changingStatus
      ) {
        return;
      }


      const nextStatus =
        category.status ===
        'active'
          ? 'inactive'
          : 'active';


      Alert.alert(
        nextStatus === 'active'
          ? 'Activate Category'
          : 'Deactivate Category',

        `Change ${category.category} to ${nextStatus}?`,

        [
          {
            text: 'Cancel',
            style: 'cancel',
          },

          {
            text:
              nextStatus ===
              'active'
                ? 'Activate'
                : 'Deactivate',

            onPress:
              async () => {

                try {

                  setChangingStatus(
                    true
                  );


                  const updated =
                    await categoriesApi
                      .changeStatus(
                        category.id,
                        nextStatus
                      );


                  setCategory(
                    updated
                  );


                  Alert.alert(
                    'Status Updated',
                    'Category status updated successfully.'
                  );

                } catch (error: any) {

                  console.log(
                    'CATEGORY STATUS ERROR:',
                    error?.response?.data ??
                    error
                  );


                  Alert.alert(
                    'Unable to Update',
                    getApiError(
                      error,
                      'Unable to update category status.'
                    )
                  );

                } finally {

                  setChangingStatus(
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
  | Delete
  |--------------------------------------------------------------------------
  */

  const deleteCategory =
    () => {

      if (
        !category ||
        deleting
      ) {
        return;
      }


      Alert.alert(
        'Delete Category',
        `Move ${category.category} to the recycle bin?`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },

          {
            text: 'Delete',
            style: 'destructive',

            onPress:
              async () => {

                try {

                  setDeleting(
                    true
                  );


                  await categoriesApi
                    .remove(
                      category.id
                    );


                  Alert.alert(
                    'Category Deleted',
                    'Category moved to the recycle bin.',
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
                    'DELETE CATEGORY ERROR:',
                    error?.response?.data ??
                    error
                  );


                  Alert.alert(
                    'Unable to Delete',
                    getApiError(
                      error,
                      'Unable to delete category.'
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
            Loading category...
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

  if (!category) {

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
            Category not found
          </Text>


          <Pressable
            onPress={() =>
              router.back()
            }
            style={
              styles.goBackButton
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
    category.status ===
    'active';


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
              Category Details
            </Text>

            <Text
              style={
                styles.subtitle
              }
            >
              View and manage category
            </Text>
          </View>


          <Pressable
            style={
              styles.editButton
            }
            onPress={() =>
              router.push(
                `/(app)/management/categories/${category.id}/edit` as any
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
                name="folder-outline"
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
                  styles.categoryName
                }
              >
                {category.category}
              </Text>


              <Text
                style={
                  styles.categoryType
                }
              >
                {category.type}
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
                {active
                  ? 'Active'
                  : 'Inactive'}
              </Text>
            </View>

          </View>

        </View>


        {/* DETAILS */}

        <Text
          style={
            styles.sectionTitle
          }
        >
          Category Information
        </Text>


        <View
          style={
            styles.detailsCard
          }
        >

          <DetailRow
            icon="folder-open-outline"
            label="Category Name"
            value={
              category.category
            }
          />

          <DetailRow
            icon="pricetag-outline"
            label="Type"
            value={
              category.type
            }
          />

          <DetailRow
            icon="pulse-outline"
            label="Status"
            value={
              active
                ? 'Active'
                : 'Inactive'
            }
          />

          <DetailRow
            icon="calendar-outline"
            label="Created"
            value={
              normalizeDateTime(
                category.created_at
              )
            }
          />

          <DetailRow
            icon="time-outline"
            label="Updated"
            value={
              normalizeDateTime(
                category.updated_at
              )
            }
            last
          />

        </View>


        {/* STATUS BUTTON */}

        <Pressable
          disabled={
            changingStatus
          }
          style={[
            styles.statusAction,

            !active &&
              styles.activateAction,

            changingStatus &&
              styles.disabled,
          ]}
          onPress={
            toggleStatus
          }
        >

          {changingStatus ? (

            <ActivityIndicator
              size="small"
              color={
                Colors.primary
              }
            />

          ) : (

            <>
              <Ionicons
                name={
                  active
                    ? 'pause-circle-outline'
                    : 'checkmark-circle-outline'
                }
                size={19}
                color={
                  Colors.primary
                }
              />

              <Text
                style={
                  styles.statusActionText
                }
              >
                {active
                  ? 'Deactivate Category'
                  : 'Activate Category'}
              </Text>
            </>

          )}

        </Pressable>


        {/* DELETE */}

        <Pressable
          disabled={
            deleting
          }
          style={[
            styles.deleteButton,

            deleting &&
              styles.disabled,
          ]}
          onPress={
            deleteCategory
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
                  styles.deleteText
                }
              >
                Delete Category
              </Text>
            </>

          )}

        </Pressable>

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
  icon: string;
  label: string;
  value: string;
  last?: boolean;
}) {

  return (
    <View
      style={[
        styles.detailRow,

        last &&
          styles.lastRow,
      ]}
    >

      <View
        style={
          styles.detailIcon
        }
      >
        <Ionicons
          name={
            icon as any
          }
          size={16}
          color={
            Colors.textSecondary
          }
        />
      </View>


      <View
        style={
          styles.detailContent
        }
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

    categoryName: {
      fontSize: 16,
      lineHeight: 21,
      fontFamily:
        Fonts.extraBold,
      color:
        Colors.text,
    },

    categoryType: {
      marginTop: 4,
      fontSize: 10,
      fontFamily:
        Fonts.medium,
      color:
        Colors.textSecondary,
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

    sectionTitle: {
      marginTop: 25,
      marginBottom: 10,
      fontSize: 15,
      fontFamily:
        Fonts.extraBold,
      color:
        Colors.text,
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
      minHeight: 67,
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor:
        Colors.border,
    },

    lastRow: {
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

    detailContent: {
      flex: 1,
      marginLeft: 11,
    },

    detailLabel: {
      fontSize: 9,
      fontFamily:
        Fonts.regular,
      color:
        Colors.textMuted,
    },

    detailValue: {
      marginTop: 3,
      fontSize: 11,
      fontFamily:
        Fonts.bold,
      color:
        Colors.text,
    },

    statusAction: {
      marginTop: 22,
      height: 50,
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

    activateAction: {
      backgroundColor:
        Colors.primaryLight,
    },

    statusActionText: {
      fontSize: 10,
      fontFamily:
        Fonts.bold,
      color:
        Colors.primary,
    },

    deleteButton: {
      marginTop: 10,
      height: 50,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 7,
      borderRadius: 14,
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
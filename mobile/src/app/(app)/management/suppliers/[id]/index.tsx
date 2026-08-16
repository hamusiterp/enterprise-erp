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
  Supplier,
  suppliersApi,
} from '../../../../../api/suppliersApi';

import {
  Colors,
} from '../../../../../constants/colors';

import {
  Fonts,
} from '../../../../../constants/fonts';


export default function SupplierDetailsScreen() {

  const params =
    useLocalSearchParams();


  const rawId =
    Array.isArray(params.id)
      ? params.id[0]
      : params.id;


  const supplierId =
    Number(rawId);


  const [
    supplier,
    setSupplier,
  ] =
    useState<Supplier | null>(
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
  | Load Supplier
  |--------------------------------------------------------------------------
  */

  const loadSupplier =
    useCallback(
      async () => {

        if (
          !supplierId ||
          Number.isNaN(
            supplierId
          )
        ) {

          setLoading(false);

          return;
        }


        try {

          const result =
            await suppliersApi.get(
              supplierId
            );


          setSupplier(
            result
          );

        } catch (error: any) {

          console.log(
            'SUPPLIER DETAILS ERROR:',
            error?.response?.data ??
            error
          );


          Alert.alert(
            'Unable to Load',
            getApiError(
              error,
              'Unable to load supplier.'
            )
          );

        } finally {

          setLoading(false);

          setRefreshing(false);

        }

      },
      [
        supplierId,
      ]
    );


  useEffect(() => {

    loadSupplier();

  }, [
    loadSupplier,
  ]);


  /*
  |--------------------------------------------------------------------------
  | Refresh
  |--------------------------------------------------------------------------
  */

  const refresh =
    () => {

      setRefreshing(true);

      loadSupplier();

    };


  /*
  |--------------------------------------------------------------------------
  | Change Status
  |--------------------------------------------------------------------------
  */

  const toggleStatus =
    () => {

      if (
        !supplier ||
        changingStatus
      ) {
        return;
      }


      const newStatus =
        supplier.status ===
        'active'
          ? 'inactive'
          : 'active';


      Alert.alert(
        newStatus === 'active'
          ? 'Activate Supplier'
          : 'Deactivate Supplier',

        `Change ${supplier.supplier_name} to ${newStatus}?`,

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

            onPress:
              async () => {

                try {

                  setChangingStatus(
                    true
                  );


                  const updated =
                    await suppliersApi
                      .changeStatus(
                        supplier.id,
                        newStatus
                      );


                  setSupplier(
                    updated
                  );


                  Alert.alert(
                    'Status Updated',
                    'Supplier status updated successfully.'
                  );

                } catch (error: any) {

                  console.log(
                    'SUPPLIER STATUS ERROR:',
                    error?.response?.data ??
                    error
                  );


                  Alert.alert(
                    'Unable to Update',
                    getApiError(
                      error,
                      'Unable to update supplier status.'
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
  | Delete Supplier
  |--------------------------------------------------------------------------
  */

  const deleteSupplier =
    () => {

      if (
        !supplier ||
        deleting
      ) {
        return;
      }


      Alert.alert(
        'Delete Supplier',

        `Move ${supplier.supplier_name} to the recycle bin?`,

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


                  await suppliersApi
                    .remove(
                      supplier.id
                    );


                  Alert.alert(
                    'Supplier Deleted',
                    'Supplier moved to the recycle bin.',
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
                    'DELETE SUPPLIER ERROR:',
                    error?.response?.data ??
                    error
                  );


                  Alert.alert(
                    'Unable to Delete',
                    getApiError(
                      error,
                      'Unable to delete supplier.'
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
            Loading supplier...
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

  if (!supplier) {

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
            Supplier not found
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
    supplier.status ===
    'active';


  const hasTin =
    supplier.has_tin ===
      true ||
    supplier.has_tin ===
      1 ||
    supplier.has_tin ===
      '1' ||
    supplier.has_tin ===
      'true';


  const categoryName =
  supplier.category?.name ??
  '-';


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
              Supplier Details
            </Text>


            <Text
              style={
                styles.subtitle
              }
            >
              {supplier.supplier_no}
            </Text>

          </View>


          <Pressable
            style={
              styles.editButton
            }

            onPress={() =>
              router.push(
                `/(app)/management/suppliers/${supplier.id}/edit` as any
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
                name="business-outline"
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
                  styles.supplierNo
                }
              >
                {supplier.supplier_no}
              </Text>


              <Text
                style={
                  styles.supplierName
                }
              >
                {supplier.supplier_name}
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

        </View>


        {/* BASIC INFORMATION */}

        <SectionTitle
          icon="business-outline"
          title="Basic Information"
        />


        <View
          style={
            styles.detailsCard
          }
        >

          <DetailRow
            icon="barcode-outline"
            label="Supplier Number"
            value={
              supplier.supplier_no
            }
          />


          <DetailRow
            icon="business-outline"
            label="Supplier Name"
            value={
              supplier.supplier_name
            }
          />


          <DetailRow
            icon="folder-outline"
            label="Category"
            value={
              categoryName
            }
            last
          />

        </View>


        {/* CONTACT */}

        <SectionTitle
          icon="call-outline"
          title="Contact Information"
        />


        <View
          style={
            styles.detailsCard
          }
        >

          <DetailRow
            icon="call-outline"
            label="Phone Number"
            value={
              supplier.phone_number
            }
          />


          <DetailRow
            icon="location-outline"
            label="Address"
            value={
              supplier.address ||
              '-'
            }
            last
          />

        </View>


        {/* TAX */}

        <SectionTitle
          icon="document-text-outline"
          title="Tax Information"
        />


        <View
          style={
            styles.detailsCard
          }
        >

          <DetailRow
            icon="document-outline"
            label="Have TIN?"
            value={
              hasTin
                ? 'Yes'
                : 'No'
            }
          />


          <DetailRow
            icon="document-text-outline"
            label="TIN Number"
            value={
              hasTin
                ? (
                    supplier.tin ||
                    '-'
                  )
                : '-'
            }
            last
          />

        </View>


        {/* REGISTRATION */}

        <SectionTitle
          icon="person-outline"
          title="Registration"
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
              supplier.registered_by ||
              'System'
            }
          />


          <DetailRow
            icon="calendar-outline"
            label="Date Registered"
            value={
              normalizeDate(
                supplier.date_registered
              )
            }
          />


          <DetailRow
            icon="shield-checkmark-outline"
            label="Approved By"
            value={
              supplier.approved_by ||
              '-'
            }
          />


          <DetailRow
            icon="time-outline"
            label="Created"
            value={
              normalizeDateTime(
                supplier.created_at
              )
            }
          />


          <DetailRow
            icon="refresh-outline"
            label="Updated"
            value={
              normalizeDateTime(
                supplier.updated_at
              )
            }
            last
          />

        </View>


        {/* STATUS */}

        <Pressable
          disabled={
            changingStatus
          }

          style={[
            styles.statusAction,

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
                {
                  active
                    ? 'Deactivate Supplier'
                    : 'Activate Supplier'
                }
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
            deleteSupplier
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
                Delete Supplier
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
| Section Title
|--------------------------------------------------------------------------
*/

function SectionTitle({
  icon,
  title,
}: {
  icon: string;
  title: string;
}) {

  return (
    <View
      style={
        styles.sectionTitleRow
      }
    >

      <Ionicons
        name={
          icon as any
        }
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
  value:
    | string
    | null
    | undefined;
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
          {
            value &&
            String(value).trim()
              ? value
              : '-'
          }
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

function normalizeDate(
  value?:
    | string
    | null
) {

  if (!value) {
    return '-';
  }

  return String(value)
    .substring(
      0,
      10
    );

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

    editButton: {
      width: 43,
      height: 43,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        Colors.primary,
    },

    /*
    |--------------------------------------------------------------------------
    | Hero
    |--------------------------------------------------------------------------
    */

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

    supplierNo: {
      fontSize: 9,
      fontFamily:
        Fonts.bold,
      color:
        Colors.primary,
    },

    supplierName: {
      marginTop: 3,
      fontSize: 15,
      lineHeight: 20,
      fontFamily:
        Fonts.extraBold,
      color:
        Colors.text,
    },

    categoryText: {
      marginTop: 4,
      fontSize: 9,
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

    /*
    |--------------------------------------------------------------------------
    | Sections
    |--------------------------------------------------------------------------
    */

    sectionTitleRow: {
      marginTop: 24,
      marginBottom: 9,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },

    sectionTitle: {
      fontSize: 13,
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
      lineHeight: 17,
      fontFamily:
        Fonts.bold,
      color:
        Colors.text,
    },

    /*
    |--------------------------------------------------------------------------
    | Actions
    |--------------------------------------------------------------------------
    */

    statusAction: {
      marginTop: 24,
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
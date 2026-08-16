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
  Subcontractor,
  subcontractorsApi,
} from '../../../../../api/subcontractorsApi';

import {
  Colors,
} from '../../../../../constants/colors';

import {
  Fonts,
} from '../../../../../constants/fonts';


export default function SubcontractorDetailsScreen() {

  const {
  id,
} =
  useLocalSearchParams<{
    id: string;
  }>();

const subcontractorId =
  parseInt(
    String(id),
    10
  );


  const [
    subcontractor,
    setSubcontractor,
  ] =
    useState<Subcontractor | null>(
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
  | Load Subcontractor
  |--------------------------------------------------------------------------
  */

  const loadSubcontractor =
    useCallback(
      async () => {

        if (
          !subcontractorId ||
          Number.isNaN(
            subcontractorId
          )
        ) {

          setLoading(false);

          return;

        }


        try {

          const result =
            await subcontractorsApi.get(
              subcontractorId
            );


          setSubcontractor(
            result
          );

        } catch (error: any) {

          console.log(
            'SUBCONTRACTOR DETAILS ERROR:',
            error?.response?.data ??
            error
          );


          Alert.alert(
            'Unable to Load',
            getApiError(
              error,
              'Unable to load subcontractor.'
            )
          );

        } finally {

          setLoading(false);

          setRefreshing(false);

        }

      },
      [
        subcontractorId,
      ]
    );


  useEffect(() => {

    loadSubcontractor();

  }, [
    loadSubcontractor,
  ]);


  /*
  |--------------------------------------------------------------------------
  | Refresh
  |--------------------------------------------------------------------------
  */

  const refresh =
    () => {

      setRefreshing(
        true
      );


      loadSubcontractor();

    };


  /*
  |--------------------------------------------------------------------------
  | Delete
  |--------------------------------------------------------------------------
  */

  const deleteSubcontractor =
    () => {

      if (
        !subcontractor ||
        deleting
      ) {
        return;
      }


      Alert.alert(
        'Delete Subcontractor',

        `Move ${subcontractor.display_name} to the recycle bin?`,

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


                  await subcontractorsApi
                    .remove(
                      subcontractor.id
                    );


                  Alert.alert(
                    'Subcontractor Deleted',
                    'Subcontractor moved to the recycle bin.',
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
                    'DELETE SUBCONTRACTOR ERROR:',
                    error?.response?.data ??
                    error
                  );


                  Alert.alert(
                    'Unable to Delete',
                    getApiError(
                      error,
                      'Unable to delete subcontractor.'
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
            Loading subcontractor...
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

  if (!subcontractor) {

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
            Subcontractor not found
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


  const isCompany =
    subcontractor.type ===
    'company';


  const active =
    subcontractor.status ===
    'active';


  const categoryName =
    subcontractor.category
      ?.name ??
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
              Subcontractor Details
            </Text>


            <Text
              style={
                styles.subtitle
              }
            >
              {
                isCompany
                  ? 'Company'
                  : 'Individual'
              }
            </Text>

          </View>


          <Pressable
            style={
              styles.editButton
            }

            onPress={() =>
              router.push(
                `/(app)/management/subcontractors/${subcontractor.id}/edit` as any
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
                name={
                  isCompany
                    ? 'business-outline'
                    : 'person-outline'
                }
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
                  styles.typeText
                }
              >
                {
                  isCompany
                    ? 'COMPANY'
                    : 'INDIVIDUAL'
                }
              </Text>


              <Text
                style={
                  styles.displayName
                }
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
              styles.heroMeta
            }
          >

            <HeroMeta
              label="Tax"
              value={
                `${subcontractor.tax_percent}%`
              }
            />


            <HeroMeta
              label="Category"
              value={
                categoryName
              }
            />


            <HeroMeta
              label="Registered"
              value={
                subcontractor.date_registered ??
                '-'
              }
            />

          </View>

        </View>


        {/* IDENTITY */}

        <SectionTitle
          icon={
            isCompany
              ? 'business-outline'
              : 'person-outline'
          }
          title={
            isCompany
              ? 'Company Information'
              : 'Individual Information'
          }
        />


        <View
          style={
            styles.detailsCard
          }
        >

          <DetailRow
            icon="people-outline"
            label="Type"
            value={
              isCompany
                ? 'Company'
                : 'Individual'
            }
          />


          {isCompany ? (

            <>

              <DetailRow
                icon="business-outline"
                label="Company Name"
                value={
                  subcontractor.company_name
                }
              />


              <DetailRow
                icon="document-text-outline"
                label="TIN Number"
                value={
                  subcontractor.tin_no
                }
                last
              />

            </>

          ) : (

            <>

              <DetailRow
                icon="person-outline"
                label="First Name"
                value={
                  subcontractor.firstname
                }
              />


              <DetailRow
                icon="person-outline"
                label="Last Name"
                value={
                  subcontractor.lastname
                }
                last
              />

            </>

          )}

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
            icon="location-outline"
            label="Address"
            value={
              subcontractor.address
            }
          />


          <DetailRow
            icon="person-circle-outline"
            label="Contact Person"
            value={
              subcontractor.contact_person
            }
          />


          <DetailRow
            icon="call-outline"
            label="Phone Number"
            value={
              subcontractor.phone_number
            }
            last
          />

        </View>


        {/* BUSINESS */}

        <SectionTitle
          icon="cash-outline"
          title="Business Information"
        />


        <View
          style={
            styles.detailsCard
          }
        >

          <DetailRow
            icon="cash-outline"
            label="Tax Percent"
            value={
              `${subcontractor.tax_percent}%`
            }
          />


          <DetailRow
            icon="folder-outline"
            label="Category"
            value={
              categoryName
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
            last
          />

        </View>


        {/* REGISTRATION */}

        <SectionTitle
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
              subcontractor.registered_by ||
              'System'
            }
          />


          <DetailRow
            icon="calendar-outline"
            label="Registered Date"
            value={
              subcontractor.date_registered
            }
          />


          <DetailRow
            icon="time-outline"
            label="Created"
            value={
              subcontractor.created_at
            }
          />


          <DetailRow
            icon="refresh-outline"
            label="Updated"
            value={
              subcontractor.updated_at
            }
            last
          />

        </View>


        {/* EDIT ACTION */}

        <Pressable
          style={
            styles.editAction
          }

          onPress={() =>
            router.push(
              `/(app)/management/subcontractors/${subcontractor.id}/edit` as any
            )
          }
        >

          <Ionicons
            name="create-outline"
            size={18}
            color={
              Colors.primary
            }
          />


          <Text
            style={
              styles.editActionText
            }
          >
            Edit Subcontractor
          </Text>

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
            deleteSubcontractor
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
                Delete Subcontractor
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
    | number
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
            value !== null &&
            value !== undefined &&
            String(value).trim() !== ''
              ? String(value)
              : '-'
          }
        </Text>

      </View>

    </View>
  );

}


/*
|--------------------------------------------------------------------------
| Hero Meta
|--------------------------------------------------------------------------
*/

function HeroMeta({
  label,
  value,
}: {
  label: string;
  value: string;
}) {

  return (
    <View
      style={
        styles.heroMetaItem
      }
    >

      <Text
        style={
          styles.heroMetaLabel
        }
      >
        {label}
      </Text>


      <Text
        style={
          styles.heroMetaValue
        }
        numberOfLines={1}
      >
        {value}
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

    typeText: {
      fontSize: 8,
      fontFamily:
        Fonts.bold,
      color:
        Colors.primary,
    },

    displayName: {
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

    heroMeta: {
      marginTop: 16,
      flexDirection: 'row',
      gap: 8,
    },

    heroMetaItem: {
      flex: 1,
      padding: 9,
      borderRadius: 11,
      backgroundColor:
        Colors.background,
    },

    heroMetaLabel: {
      fontSize: 7,
      fontFamily:
        Fonts.regular,
      color:
        Colors.textMuted,
    },

    heroMetaValue: {
      marginTop: 3,
      fontSize: 9,
      fontFamily:
        Fonts.bold,
      color:
        Colors.text,
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

    editAction: {
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

    editActionText: {
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
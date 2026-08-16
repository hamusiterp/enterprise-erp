import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
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
  FixedAsset,
  fixedAssetsApi,
} from '../../../../../api/fixedAssetsApi';

import {
  Colors,
} from '../../../../../constants/colors';

import {
  Fonts,
} from '../../../../../constants/fonts';


export default function FixedAssetDetailsScreen() {

  const params =
    useLocalSearchParams();


  const rawId =
    Array.isArray(params.id)
      ? params.id[0]
      : params.id;


  const assetId =
    Number(rawId);


  const [
    asset,
    setAsset,
  ] =
    useState<FixedAsset | null>(
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
  | Load Asset
  |--------------------------------------------------------------------------
  */

  const loadAsset =
    useCallback(
      async () => {

        if (
          !assetId ||
          Number.isNaN(
            assetId
          )
        ) {

          setLoading(false);

          return;

        }


        try {

          const result =
            await fixedAssetsApi.get(
              assetId
            );


          setAsset(
            result
          );

        } catch (error: any) {

          console.log(
            'FIXED ASSET DETAILS ERROR:',
            error?.response?.data ??
            error
          );


          Alert.alert(
            'Unable to Load',
            getApiError(
              error,
              'Unable to load fixed asset.'
            )
          );

        } finally {

          setLoading(false);

          setRefreshing(false);

        }

      },
      [assetId]
    );


  useEffect(() => {

    loadAsset();

  }, [
    loadAsset,
  ]);


  /*
  |--------------------------------------------------------------------------
  | Refresh
  |--------------------------------------------------------------------------
  */

  const refresh =
    () => {

      setRefreshing(true);

      loadAsset();

    };


  /*
  |--------------------------------------------------------------------------
  | Status
  |--------------------------------------------------------------------------
  */

  const toggleStatus =
    () => {

      if (
        !asset ||
        changingStatus
      ) {
        return;
      }


      const newStatus =
        asset.status === 'active'
          ? 'inactive'
          : 'active';


      Alert.alert(
        newStatus === 'active'
          ? 'Activate Fixed Asset'
          : 'Deactivate Fixed Asset',

        `Change ${asset.asset_no} to ${newStatus}?`,

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

                  setChangingStatus(true);


                  const updated =
                    await fixedAssetsApi
                      .changeStatus(
                        asset.id,
                        newStatus
                      );


                  setAsset(
                    updated
                  );


                  Alert.alert(
                    'Status Updated',
                    'Fixed asset status updated successfully.'
                  );

                } catch (error: any) {

                  Alert.alert(
                    'Unable to Update',
                    getApiError(
                      error,
                      'Unable to update fixed asset status.'
                    )
                  );

                } finally {

                  setChangingStatus(false);

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

  const deleteAsset =
    () => {

      if (
        !asset ||
        deleting
      ) {
        return;
      }


      Alert.alert(
        'Delete Fixed Asset',
        `Move ${asset.asset_no} - ${asset.name_of_machinery} to the recycle bin?`,
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

                  setDeleting(true);


                  await fixedAssetsApi.remove(
                    asset.id
                  );


                  Alert.alert(
                    'Fixed Asset Deleted',
                    'Fixed asset moved to the recycle bin.',
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
                      'Unable to delete fixed asset.'
                    )
                  );

                } finally {

                  setDeleting(false);

                }

              },
          },
        ]
      );

    };


  /*
  |--------------------------------------------------------------------------
  | Open Document
  |--------------------------------------------------------------------------
  */

  const openDocument =
    async (
      url?:
        | string
        | null
    ) => {

      if (!url) {

        Alert.alert(
          'Document Not Available',
          'No document is available for this asset.'
        );

        return;

      }


      try {

        const supported =
          await Linking.canOpenURL(
            url
          );


        if (!supported) {

          Alert.alert(
            'Unable to Open',
            'This document link cannot be opened on this device.'
          );

          return;

        }


        await Linking.openURL(
          url
        );

      } catch {

        Alert.alert(
          'Unable to Open',
          'The document could not be opened.'
        );

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
            Loading fixed asset...
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

  if (!asset) {

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
            Fixed asset not found
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
    asset.status === 'active';


  const hasGauge =
    toBoolean(
      asset.has_gauge
    );


  const categoryName =
    asset.category
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
              Fixed Asset Details
            </Text>


            <Text
              style={
                styles.subtitle
              }
            >
              {asset.asset_no}
            </Text>

          </View>


          <Pressable
            style={
              styles.editButton
            }

            onPress={() =>
              router.push(
                `/(app)/management/fixed-assets/${asset.id}/edit` as any
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
                name="car-sport-outline"
                size={28}
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
                  styles.assetNo
                }
              >
                {asset.asset_no}
              </Text>


              <Text
                style={
                  styles.assetName
                }
              >
                {asset.name_of_machinery}
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
              label="Vehicle No."
              value={
                asset.vehicle_no
              }
            />

            <HeroMeta
              label="Plate No."
              value={
                asset.plate_no
              }
            />

            <HeroMeta
              label="Tag No."
              value={
                asset.tag_no
              }
            />

          </View>

        </View>


        {/* IDENTIFICATION */}

        <SectionTitle
          icon="barcode-outline"
          title="Identification"
        />


        <View
          style={
            styles.detailsCard
          }
        >

          <DetailRow
            icon="barcode-outline"
            label="Asset Number"
            value={
              asset.asset_no
            }
          />


          <DetailRow
            icon="car-outline"
            label="Vehicle Number"
            value={
              asset.vehicle_no
            }
          />


          <DetailRow
            icon="pricetag-outline"
            label="Tag Number"
            value={
              asset.tag_no
            }
          />


          <DetailRow
            icon="card-outline"
            label="Plate Number"
            value={
              asset.plate_no
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
            icon="construct-outline"
            label="Machinery Name"
            value={
              asset.name_of_machinery
            }
            last
          />

        </View>


        {/* VEHICLE / MACHINERY */}

        <SectionTitle
          icon="settings-outline"
          title="Vehicle / Machinery"
        />


        <View
          style={
            styles.detailsCard
          }
        >

          <DetailRow
            icon="car-sport-outline"
            label="Vehicle Make"
            value={
              asset.make_of_vehicle
            }
          />


          <DetailRow
            icon="layers-outline"
            label="Model"
            value={
              asset.model
            }
          />


          <DetailRow
            icon="calendar-outline"
            label="Make Year"
            value={
              asset.make_of_year
            }
          />


          <DetailRow
            icon="barcode-outline"
            label="Chassis Number"
            value={
              asset.chassis_no
            }
          />


          <DetailRow
            icon="settings-outline"
            label="Engine Number"
            value={
              asset.engine_no
            }
          />


          <DetailRow
            icon="construct-outline"
            label="Engine Model"
            value={
              asset.engine_model
            }
          />


          <DetailRow
            icon="cog-outline"
            label="Engine Make"
            value={
              asset.make_of_engine
            }
          />


          <DetailRow
            icon="flash-outline"
            label="Horse Power"
            value={
              asset.horse_power
            }
          />


          <DetailRow
            icon="flame-outline"
            label="Fuel Type"
            value={
              asset.type_of_fuel
            }
            last
          />

        </View>


        {/* READING */}

        <SectionTitle
          icon="speedometer-outline"
          title="Reading & Consumption"
        />


        <View
          style={
            styles.detailsCard
          }
        >

          <DetailRow
            icon="speedometer-outline"
            label="Reading Type"
            value={
              formatReadingType(
                asset.reading_type
              )
            }
          />


          <DetailRow
            icon="analytics-outline"
            label="Reading"
            value={
              asset.reading
            }
          />


          <DetailRow
            icon="water-outline"
            label="Consumption"
            value={
              asset.consumption
            }
          />


          <DetailRow
            icon="stats-chart-outline"
            label="Standard Consumption"
            value={
              asset.standard_consumption
            }
          />


          <DetailRow
            icon="beaker-outline"
            label="Tank Capacity"
            value={
              asset.tanker_capacity
            }
          />


          <DetailRow
            icon="calendar-outline"
            label="Last Refill"
            value={
              asset.last_refill
            }
            last
          />

        </View>


        {/* GAUGE */}

        <SectionTitle
          icon="speedometer-outline"
          title="Gauge Information"
        />


        <View
          style={
            styles.detailsCard
          }
        >

          <DetailRow
            icon="speedometer-outline"
            label="Has Gauge"
            value={
              hasGauge
                ? 'Yes'
                : 'No'
            }
          />


          <DetailRow
            icon="analytics-outline"
            label="Gauge Reading"
            value={
              hasGauge
                ? asset.gauge_reading
                : '-'
            }
            last
          />

        </View>


        {/* SERVICE */}

        <SectionTitle
          icon="build-outline"
          title="Service Information"
        />


        <View
          style={
            styles.detailsCard
          }
        >

          <DetailRow
            icon="repeat-outline"
            label="Service Interval"
            value={
              asset.service_interval
            }
          />


          <DetailRow
            icon="calendar-outline"
            label="Last Service"
            value={
              asset.last_service
            }
            last
          />

        </View>


        {/* IMPORTANT DATES */}

        <SectionTitle
          icon="calendar-outline"
          title="Important Dates"
        />


        <View
          style={
            styles.detailsCard
          }
        >

          <DetailRow
            icon="cart-outline"
            label="Purchase Date"
            value={
              asset.purchase_date
            }
          />


          <DetailRow
            icon="document-outline"
            label="Licence Renewal"
            value={
              asset.licence_renewal_date
            }
          />


          <DetailRow
            icon="search-outline"
            label="Inspection Renewal"
            value={
              asset.last_inspection_renewal_date
            }
          />


          <DetailRow
            icon="shield-checkmark-outline"
            label="Insurance Renewal"
            value={
              asset.last_insurance_renewal_date
            }
            last
          />

        </View>


        {/* PHOTOS */}

        <SectionTitle
          icon="images-outline"
          title="Asset Photos"
        />


        <View
          style={
            styles.photoCard
          }
        >

          <PhotoItem
            title="Front View"
            url={
              asset.front_view_photo_url
            }
          />


          <PhotoItem
            title="Rear View"
            url={
              asset.rear_view_photo_url
            }
          />


          <PhotoItem
            title="Right Side View"
            url={
              asset.right_side_view_photo_url
            }
          />


          <PhotoItem
            title="Left Side View"
            url={
              asset.left_side_view_photo_url
            }
          />

        </View>


        {/* DOCUMENTS */}

        <SectionTitle
          icon="documents-outline"
          title="Documents"
        />


        <View
          style={
            styles.detailsCard
          }
        >

          <DocumentRow
            title="Libre Document"
            url={
              asset.libre_document_url
            }
            onOpen={() =>
              openDocument(
                asset.libre_document_url
              )
            }
          />


          <DocumentRow
            title="Inspection Document"
            url={
              asset.inspection_document_url
            }
            onOpen={() =>
              openDocument(
                asset.inspection_document_url
              )
            }
          />


          <DocumentRow
            title="Insurance Document"
            url={
              asset.insurance_document_url
            }
            onOpen={() =>
              openDocument(
                asset.insurance_document_url
              )
            }
            last
          />

        </View>


        {/* OTHER */}

        <SectionTitle
          icon="information-circle-outline"
          title="Other Information"
        />


        <View
          style={
            styles.detailsCard
          }
        >

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
            icon="location-outline"
            label="Current Location"
            value={
              asset.current_location
            }
          />


          <DetailRow
            icon="person-outline"
            label="Assigned To"
            value={
              asset.assigned_to
            }
          />


          <DetailRow
            icon="document-text-outline"
            label="Remarks"
            value={
              asset.remarks
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
              asset.registered_by ||
              'System'
            }
          />


          <DetailRow
            icon="calendar-outline"
            label="Registered Date"
            value={
              asset.registered_date
            }
          />


          <DetailRow
            icon="create-outline"
            label="Edited By"
            value={
              asset.edited_by
            }
          />


          <DetailRow
            icon="time-outline"
            label="Created"
            value={
              asset.created_at
            }
          />


          <DetailRow
            icon="refresh-outline"
            label="Updated"
            value={
              asset.updated_at
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
                    ? 'Deactivate Fixed Asset'
                    : 'Activate Fixed Asset'
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
            deleteAsset
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
                Delete Fixed Asset
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
  value:
    | string
    | null
    | undefined;
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
        {value || '-'}
      </Text>

    </View>
  );

}


/*
|--------------------------------------------------------------------------
| Photo
|--------------------------------------------------------------------------
*/

function PhotoItem({
  title,
  url,
}: {
  title: string;
  url?:
    | string
    | null;
}) {

  return (
    <View
      style={
        styles.photoItem
      }
    >

      <Text
        style={
          styles.photoTitle
        }
      >
        {title}
      </Text>


      {url ? (

        <Image
          source={{
            uri: url,
          }}

          resizeMode="cover"

          style={
            styles.photo
          }
        />

      ) : (

        <View
          style={
            styles.noPhoto
          }
        >

          <Ionicons
            name="image-outline"
            size={28}
            color={
              Colors.textMuted
            }
          />


          <Text
            style={
              styles.noPhotoText
            }
          >
            No photo
          </Text>

        </View>

      )}

    </View>
  );

}


/*
|--------------------------------------------------------------------------
| Document Row
|--------------------------------------------------------------------------
*/

function DocumentRow({
  title,
  url,
  onOpen,
  last = false,
}: {
  title: string;
  url?:
    | string
    | null;
  onOpen:
    () => void;
  last?: boolean;
}) {

  return (
    <View
      style={[
        styles.documentRow,

        last &&
          styles.lastDetailRow,
      ]}
    >

      <View
        style={
          styles.documentIcon
        }
      >

        <Ionicons
          name="document-text-outline"
          size={18}
          color={
            Colors.primary
          }
        />

      </View>


      <View
        style={
          styles.documentContent
        }
      >

        <Text
          style={
            styles.documentTitle
          }
        >
          {title}
        </Text>


        <Text
          style={
            styles.documentStatus
          }
        >
          {
            url
              ? 'PDF available'
              : 'Not available'
          }
        </Text>

      </View>


      <Pressable
        disabled={!url}

        style={[
          styles.openDocumentButton,

          !url &&
            styles.disabled,
        ]}

        onPress={
          onOpen
        }
      >

        <Ionicons
          name="open-outline"
          size={17}
          color={
            Colors.primary
          }
        />

        <Text
          style={
            styles.openDocumentText
          }
        >
          Open
        </Text>

      </Pressable>

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


function formatReadingType(
  value: string
) {

  if (
    value ===
    'engine_horse_power'
  ) {
    return 'Engine Horse Power';
  }


  if (
    value ===
    'km_reading'
  ) {
    return 'KM Reading';
  }


  return value;
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
      return value;

  }

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
      paddingBottom: 55,
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

    assetNo: {
      fontSize: 9,
      fontFamily:
        Fonts.bold,
      color:
        Colors.primary,
    },

    assetName: {
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
    | Photos
    |--------------------------------------------------------------------------
    */

    photoCard: {
      padding: 12,
      borderRadius: 18,
      backgroundColor:
        Colors.surface,
      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    photoItem: {
      marginBottom: 14,
    },

    photoTitle: {
      marginBottom: 7,
      fontSize: 10,
      fontFamily:
        Fonts.bold,
      color:
        Colors.text,
    },

    photo: {
      width: '100%',
      height: 210,
      borderRadius: 14,
      backgroundColor:
        Colors.background,
    },

    noPhoto: {
      height: 130,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 14,
      backgroundColor:
        Colors.background,
    },

    noPhotoText: {
      marginTop: 6,
      fontSize: 9,
      fontFamily:
        Fonts.regular,
      color:
        Colors.textMuted,
    },

    /*
    |--------------------------------------------------------------------------
    | Documents
    |--------------------------------------------------------------------------
    */

    documentRow: {
      minHeight: 68,
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor:
        Colors.border,
    },

    documentIcon: {
      width: 38,
      height: 38,
      borderRadius: 11,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        Colors.primaryLight,
    },

    documentContent: {
      flex: 1,
      marginLeft: 10,
    },

    documentTitle: {
      fontSize: 10,
      fontFamily:
        Fonts.bold,
      color:
        Colors.text,
    },

    documentStatus: {
      marginTop: 3,
      fontSize: 8,
      fontFamily:
        Fonts.regular,
      color:
        Colors.textMuted,
    },

    openDocumentButton: {
      height: 36,
      paddingHorizontal: 10,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      borderRadius: 10,
      backgroundColor:
        Colors.primaryLight,
    },

    openDocumentText: {
      fontSize: 8,
      fontFamily:
        Fonts.bold,
      color:
        Colors.primary,
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
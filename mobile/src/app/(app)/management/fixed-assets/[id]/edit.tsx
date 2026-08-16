import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import {
  router,
  useLocalSearchParams,
} from 'expo-router';

import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

import {
  useEffect,
  useState,
} from 'react';

import {
  FixedAsset,
  FixedAssetCondition,
  FixedAssetReadingType,
  FixedAssetStatus,
  UploadFile,
  fixedAssetsApi,
} from '../../../../../api/fixedAssetsApi';

import {
  CategoryOption,
  categoriesApi,
} from '../../../../../api/categoriesApi';

import {
  Colors,
} from '../../../../../constants/colors';

import {
  Fonts,
} from '../../../../../constants/fonts';


const CONDITIONS: {
  value: FixedAssetCondition;
  label: string;
}[] = [
  {
    value: 'excellent',
    label: 'Excellent',
  },
  {
    value: 'good',
    label: 'Good',
  },
  {
    value: 'fair',
    label: 'Fair',
  },
  {
    value: 'poor',
    label: 'Poor',
  },
  {
    value: 'out_of_service',
    label: 'Out of Service',
  },
];


export default function EditFixedAssetScreen() {

  const params =
    useLocalSearchParams();

  const rawId =
    Array.isArray(params.id)
      ? params.id[0]
      : params.id;

  const assetId =
    Number(rawId);


  /*
  |--------------------------------------------------------------------------
  | Original Asset
  |--------------------------------------------------------------------------
  */

  const [
    assetData,
    setAssetData,
  ] =
    useState<FixedAsset | null>(
      null
    );


  /*
  |--------------------------------------------------------------------------
  | Identification
  |--------------------------------------------------------------------------
  */

  const [
    assetNo,
    setAssetNo,
  ] =
    useState('');


  const [
    vehicleNo,
    setVehicleNo,
  ] =
    useState('');


  const [
    tagNo,
    setTagNo,
  ] =
    useState('');


  const [
    plateNo,
    setPlateNo,
  ] =
    useState('');


  const [
    categoryId,
    setCategoryId,
  ] =
    useState<number | null>(
      null
    );


  const [
    categories,
    setCategories,
  ] =
    useState<CategoryOption[]>(
      []
    );


  const [
    categoryOpen,
    setCategoryOpen,
  ] =
    useState(false);


  const [
    nameOfMachinery,
    setNameOfMachinery,
  ] =
    useState('');


  /*
  |--------------------------------------------------------------------------
  | Vehicle / Machinery
  |--------------------------------------------------------------------------
  */

  const [
    makeOfVehicle,
    setMakeOfVehicle,
  ] =
    useState('');


  const [
    model,
    setModel,
  ] =
    useState('');


  const [
    makeOfYear,
    setMakeOfYear,
  ] =
    useState('');


  const [
    chassisNo,
    setChassisNo,
  ] =
    useState('');


  const [
    engineNo,
    setEngineNo,
  ] =
    useState('');


  const [
    engineModel,
    setEngineModel,
  ] =
    useState('');


  const [
    makeOfEngine,
    setMakeOfEngine,
  ] =
    useState('');


  const [
    horsePower,
    setHorsePower,
  ] =
    useState('');


  const [
    typeOfFuel,
    setTypeOfFuel,
  ] =
    useState('');


  /*
  |--------------------------------------------------------------------------
  | Reading
  |--------------------------------------------------------------------------
  */

  const [
    readingType,
    setReadingType,
  ] =
    useState<FixedAssetReadingType>(
      'km_reading'
    );


  const [
    reading,
    setReading,
  ] =
    useState('');


  const [
    consumption,
    setConsumption,
  ] =
    useState('');


  const [
    standardConsumption,
    setStandardConsumption,
  ] =
    useState('');


  const [
    tankerCapacity,
    setTankerCapacity,
  ] =
    useState('');


  const [
    lastRefill,
    setLastRefill,
  ] =
    useState('');


  /*
  |--------------------------------------------------------------------------
  | Gauge
  |--------------------------------------------------------------------------
  */

  const [
    hasGauge,
    setHasGauge,
  ] =
    useState(false);


  const [
    gaugeReading,
    setGaugeReading,
  ] =
    useState('');


  /*
  |--------------------------------------------------------------------------
  | Service
  |--------------------------------------------------------------------------
  */

  const [
    serviceInterval,
    setServiceInterval,
  ] =
    useState('');


  const [
    lastService,
    setLastService,
  ] =
    useState('');


  /*
  |--------------------------------------------------------------------------
  | Dates
  |--------------------------------------------------------------------------
  */

  const [
    purchaseDate,
    setPurchaseDate,
  ] =
    useState('');


  const [
    licenceRenewalDate,
    setLicenceRenewalDate,
  ] =
    useState('');


  const [
    inspectionRenewalDate,
    setInspectionRenewalDate,
  ] =
    useState('');


  const [
    insuranceRenewalDate,
    setInsuranceRenewalDate,
  ] =
    useState('');


  /*
  |--------------------------------------------------------------------------
  | Other
  |--------------------------------------------------------------------------
  */

  const [
    assetCondition,
    setAssetCondition,
  ] =
    useState<FixedAssetCondition>(
      'good'
    );


  const [
    currentLocation,
    setCurrentLocation,
  ] =
    useState('');


  const [
    assignedTo,
    setAssignedTo,
  ] =
    useState('');


  const [
    remarks,
    setRemarks,
  ] =
    useState('');


  const [
    status,
    setStatus,
  ] =
    useState<FixedAssetStatus>(
      'active'
    );


  /*
  |--------------------------------------------------------------------------
  | Replacement Photos
  |--------------------------------------------------------------------------
  |
  | Null means:
  | Keep existing backend file.
  |
  */

  const [
    frontPhoto,
    setFrontPhoto,
  ] =
    useState<UploadFile | null>(
      null
    );


  const [
    rearPhoto,
    setRearPhoto,
  ] =
    useState<UploadFile | null>(
      null
    );


  const [
    rightPhoto,
    setRightPhoto,
  ] =
    useState<UploadFile | null>(
      null
    );


  const [
    leftPhoto,
    setLeftPhoto,
  ] =
    useState<UploadFile | null>(
      null
    );


  /*
  |--------------------------------------------------------------------------
  | Replacement Documents
  |--------------------------------------------------------------------------
  */

  const [
    libreDocument,
    setLibreDocument,
  ] =
    useState<UploadFile | null>(
      null
    );


  const [
    inspectionDocument,
    setInspectionDocument,
  ] =
    useState<UploadFile | null>(
      null
    );


  const [
    insuranceDocument,
    setInsuranceDocument,
  ] =
    useState<UploadFile | null>(
      null
    );


  /*
  |--------------------------------------------------------------------------
  | State
  |--------------------------------------------------------------------------
  */

  const [
    loading,
    setLoading,
  ] =
    useState(true);


  const [
    saving,
    setSaving,
  ] =
    useState(false);


  /*
  |--------------------------------------------------------------------------
  | Load Asset + Categories
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    const load =
      async () => {

        if (
          !assetId ||
          Number.isNaN(assetId)
        ) {

          Alert.alert(
            'Invalid Asset',
            'The fixed asset ID is invalid.',
            [
              {
                text: 'OK',
                onPress: () =>
                  router.back(),
              },
            ]
          );

          setLoading(false);

          return;
        }


        try {

          setLoading(true);


          const [
            asset,
            categoryOptions,
          ] =
            await Promise.all([

              fixedAssetsApi.get(
                assetId
              ),

              categoriesApi.options(),

            ]);


          setAssetData(
            asset
          );


          setCategories(
            categoryOptions ??
            []
          );


          /*
          |--------------------------------------------------------------------------
          | Prefill
          |--------------------------------------------------------------------------
          */

          setAssetNo(
            asset.asset_no ?? ''
          );


          setVehicleNo(
            asset.vehicle_no ?? ''
          );


          setTagNo(
            asset.tag_no ?? ''
          );


          setPlateNo(
            asset.plate_no ?? ''
          );


          setCategoryId(
            asset.category_id ??
            null
          );


          setNameOfMachinery(
            asset.name_of_machinery ??
            ''
          );


          setMakeOfVehicle(
            asset.make_of_vehicle ??
            ''
          );


          setModel(
            asset.model ?? ''
          );


          setMakeOfYear(
            asset.make_of_year ??
            ''
          );


          setChassisNo(
            asset.chassis_no ??
            ''
          );


          setEngineNo(
            asset.engine_no ??
            ''
          );


          setEngineModel(
            asset.engine_model ??
            ''
          );


          setMakeOfEngine(
            asset.make_of_engine ??
            ''
          );


          setHorsePower(
            valueToString(
              asset.horse_power
            )
          );


          setTypeOfFuel(
            asset.type_of_fuel ??
            ''
          );


          setReadingType(
            asset.reading_type ===
            'engine_horse_power'
              ? 'engine_horse_power'
              : 'km_reading'
          );


          setReading(
            valueToString(
              asset.reading
            )
          );


          setConsumption(
            valueToString(
              asset.consumption
            )
          );


          setStandardConsumption(
            valueToString(
              asset.standard_consumption
            )
          );


          setTankerCapacity(
            valueToString(
              asset.tanker_capacity
            )
          );


          setLastRefill(
            asset.last_refill ??
            ''
          );


          const gauge =
            toBoolean(
              asset.has_gauge
            );


          setHasGauge(
            gauge
          );


          setGaugeReading(
            gauge
              ? valueToString(
                  asset.gauge_reading
                )
              : ''
          );


          setServiceInterval(
            valueToString(
              asset.service_interval
            )
          );


          setLastService(
            asset.last_service ??
            ''
          );


          setPurchaseDate(
            asset.purchase_date ??
            ''
          );


          setLicenceRenewalDate(
            asset.licence_renewal_date ??
            ''
          );


          setInspectionRenewalDate(
            asset.last_inspection_renewal_date ??
            ''
          );


          setInsuranceRenewalDate(
            asset.last_insurance_renewal_date ??
            ''
          );


          setAssetCondition(
            asset.asset_condition ??
            'good'
          );


          setCurrentLocation(
            asset.current_location ??
            ''
          );


          setAssignedTo(
            asset.assigned_to ??
            ''
          );


          setRemarks(
            asset.remarks ??
            ''
          );


          setStatus(
            asset.status ===
            'inactive'
              ? 'inactive'
              : 'active'
          );

        } catch (error: any) {

          console.log(
            'EDIT FIXED ASSET LOAD ERROR:',
            error?.response?.data ??
            error
          );


          Alert.alert(
            'Unable to Load',
            getApiError(
              error,
              'Unable to load fixed asset.'
            ),
            [
              {
                text: 'OK',
                onPress: () =>
                  router.back(),
              },
            ]
          );

        } finally {

          setLoading(false);

        }

      };


    load();

  }, [
    assetId,
  ]);


  const selectedCategory =
    categories.find(
      item =>
        item.id ===
        categoryId
    );


  /*
  |--------------------------------------------------------------------------
  | Select Photo
  |--------------------------------------------------------------------------
  */

  const pickImage =
    async (
      setter:
        (
          file:
            UploadFile |
            null
        ) => void
    ) => {

      try {

        const permission =
          await ImagePicker
            .requestMediaLibraryPermissionsAsync();


        if (
          !permission.granted
        ) {

          Alert.alert(
            'Permission Required',
            'Photo library access is required.'
          );

          return;
        }


        const result =
          await ImagePicker
            .launchImageLibraryAsync({

              mediaTypes: [
                'images',
              ],

              allowsEditing:
                false,

              quality:
                0.9,

            });


        if (
          result.canceled ||
          !result.assets?.length
        ) {
          return;
        }


        const image =
          result.assets[0];


        setter({

          uri:
            image.uri,

          name:
            image.fileName ||
            `asset_${Date.now()}.jpg`,

          type:
            image.mimeType ||
            'image/jpeg',

        });

      } catch (error) {

        console.log(
          'IMAGE PICKER ERROR:',
          error
        );


        Alert.alert(
          'Unable to Select',
          'The photo could not be selected.'
        );

      }

    };


  /*
  |--------------------------------------------------------------------------
  | Select PDF
  |--------------------------------------------------------------------------
  */

  const pickPdf =
    async (
      setter:
        (
          file:
            UploadFile |
            null
        ) => void
    ) => {

      try {

        const result =
          await DocumentPicker
            .getDocumentAsync({

              type:
                'application/pdf',

              copyToCacheDirectory:
                true,

              multiple:
                false,

            });


        if (
          result.canceled ||
          !result.assets?.length
        ) {
          return;
        }


        const document =
          result.assets[0];


        setter({

          uri:
            document.uri,

          name:
            document.name,

          type:
            document.mimeType ||
            'application/pdf',

        });

      } catch (error) {

        console.log(
          'DOCUMENT PICKER ERROR:',
          error
        );


        Alert.alert(
          'Unable to Select',
          'The PDF could not be selected.'
        );

      }

    };


  /*
  |--------------------------------------------------------------------------
  | Open Existing Document
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
          'Not Available',
          'No existing document is available.'
        );

        return;
      }


      try {

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
  | Validation
  |--------------------------------------------------------------------------
  */

  const validate =
    () => {

      const requiredFields = [

        {
          value: vehicleNo,
          label:
            'Vehicle number',
        },

        {
          value: tagNo,
          label:
            'Tag number',
        },

        {
          value: plateNo,
          label:
            'Plate number',
        },

        {
          value:
            nameOfMachinery,
          label:
            'Name of machinery',
        },

        {
          value:
            makeOfVehicle,
          label:
            'Make of vehicle',
        },

        {
          value: model,
          label:
            'Model',
        },

        {
          value:
            makeOfYear,
          label:
            'Make year',
        },

        {
          value:
            chassisNo,
          label:
            'Chassis number',
        },

        {
          value:
            engineNo,
          label:
            'Engine number',
        },

        {
          value:
            engineModel,
          label:
            'Engine model',
        },

        {
          value:
            makeOfEngine,
          label:
            'Make of engine',
        },

        {
          value:
            horsePower,
          label:
            'Horse power',
        },

        {
          value:
            typeOfFuel,
          label:
            'Fuel type',
        },

        {
          value:
            reading,
          label:
            'Current reading',
        },

        {
          value:
            tankerCapacity,
          label:
            'Tank capacity',
        },

        {
          value:
            lastService,
          label:
            'Last service date',
        },

        {
          value:
            purchaseDate,
          label:
            'Purchase date',
        },

        {
          value:
            licenceRenewalDate,
          label:
            'Licence renewal date',
        },

        {
          value:
            inspectionRenewalDate,
          label:
            'Inspection renewal date',
        },

        {
          value:
            insuranceRenewalDate,
          label:
            'Insurance renewal date',
        },

      ];


      for (
        const field of
        requiredFields
      ) {

        if (
          !field.value.trim()
        ) {

          Alert.alert(
            'Required Field',
            `${field.label} is required.`
          );

          return false;

        }

      }


      if (!categoryId) {

        Alert.alert(
          'Required Field',
          'Please select an asset category.'
        );

        return false;

      }


      if (
        !isNonNegativeNumber(
          horsePower
        )
      ) {

        Alert.alert(
          'Invalid Horse Power',
          'Horse power must be zero or greater.'
        );

        return false;

      }


      if (
        !isNonNegativeNumber(
          reading
        )
      ) {

        Alert.alert(
          'Invalid Reading',
          'Current reading must be zero or greater.'
        );

        return false;

      }


      if (
        consumption.trim() &&
        !isNonNegativeNumber(
          consumption
        )
      ) {

        Alert.alert(
          'Invalid Consumption',
          'Consumption must be zero or greater.'
        );

        return false;

      }


      if (
        standardConsumption.trim() &&
        !isNonNegativeNumber(
          standardConsumption
        )
      ) {

        Alert.alert(
          'Invalid Standard Consumption',
          'Standard consumption must be zero or greater.'
        );

        return false;

      }


      if (
        !isNonNegativeNumber(
          tankerCapacity
        )
      ) {

        Alert.alert(
          'Invalid Tank Capacity',
          'Tank capacity must be zero or greater.'
        );

        return false;

      }


      if (
        hasGauge &&
        !gaugeReading.trim()
      ) {

        Alert.alert(
          'Required Field',
          'Gauge reading is required when Has Gauge is Yes.'
        );

        return false;

      }


      if (
        hasGauge &&
        !isNonNegativeNumber(
          gaugeReading
        )
      ) {

        Alert.alert(
          'Invalid Gauge Reading',
          'Gauge reading must be zero or greater.'
        );

        return false;

      }


      if (
        serviceInterval.trim()
      ) {

        const interval =
          Number(
            serviceInterval
          );


        if (
          Number.isNaN(
            interval
          ) ||
          interval < 0 ||
          !Number.isInteger(
            interval
          )
        ) {

          Alert.alert(
            'Invalid Service Interval',
            'Service interval must be a whole number of zero or greater.'
          );

          return false;

        }

      }


      return true;

    };


  /*
  |--------------------------------------------------------------------------
  | Update
  |--------------------------------------------------------------------------
  */

  const updateAsset =
    async () => {

      if (
        saving ||
        !validate() ||
        !categoryId
      ) {
        return;
      }


      try {

        setSaving(true);


        const updated =
          await fixedAssetsApi.update(
            assetId,
            {

              vehicle_no:
                vehicleNo.trim(),

              tag_no:
                tagNo.trim(),

              plate_no:
                plateNo.trim(),

              category_id:
                categoryId,

              name_of_machinery:
                nameOfMachinery.trim(),

              make_of_vehicle:
                makeOfVehicle.trim(),

              model:
                model.trim(),

              make_of_year:
                makeOfYear.trim(),

              chassis_no:
                chassisNo.trim(),

              engine_no:
                engineNo.trim(),

              engine_model:
                engineModel.trim(),

              make_of_engine:
                makeOfEngine.trim(),

              horse_power:
                Number(
                  horsePower
                ),

              type_of_fuel:
                typeOfFuel.trim(),

              reading_type:
                readingType,

              reading:
                Number(
                  reading
                ),

              consumption:
                consumption.trim()
                  ? Number(
                      consumption
                    )
                  : null,

              standard_consumption:
                standardConsumption.trim()
                  ? Number(
                      standardConsumption
                    )
                  : null,

              tanker_capacity:
                Number(
                  tankerCapacity
                ),

              last_refill:
                lastRefill.trim()
                  ? lastRefill.trim()
                  : null,

              has_gauge:
                hasGauge,

              gauge_reading:
                hasGauge
                  ? Number(
                      gaugeReading
                    )
                  : null,

              service_interval:
                serviceInterval.trim()
                  ? Number(
                      serviceInterval
                    )
                  : null,

              last_service:
                lastService.trim(),

              purchase_date:
                purchaseDate.trim(),

              licence_renewal_date:
                licenceRenewalDate.trim(),

              last_inspection_renewal_date:
                inspectionRenewalDate.trim(),

              last_insurance_renewal_date:
                insuranceRenewalDate.trim(),

              asset_condition:
                assetCondition,

              current_location:
                currentLocation.trim()
                  ? currentLocation.trim()
                  : null,

              assigned_to:
                assignedTo.trim()
                  ? assignedTo.trim()
                  : null,

              remarks:
                remarks.trim()
                  ? remarks.trim()
                  : null,

              status,

              /*
               * Only selected replacements
               * are uploaded.
               */

              front_view_photo:
                frontPhoto,

              rear_view_photo:
                rearPhoto,

              right_side_view_photo:
                rightPhoto,

              left_side_view_photo:
                leftPhoto,

              libre_document:
                libreDocument,

              inspection_document:
                inspectionDocument,

              insurance_document:
                insuranceDocument,

            }
          );


        setAssetData(
          updated
        );


        Alert.alert(
          'Fixed Asset Updated',
          `${updated.asset_no} has been updated successfully.`,
          [
            {
              text: 'OK',

              onPress: () =>
                router.replace(
                  `/(app)/management/fixed-assets/${assetId}` as any
                ),
            },
          ]
        );

      } catch (error: any) {

        console.log(
          'UPDATE FIXED ASSET ERROR:',
          error?.response?.data ??
          error
        );


        Alert.alert(
          'Unable to Update Asset',
          getApiError(
            error,
            'The fixed asset could not be updated.'
          )
        );

      } finally {

        setSaving(false);

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


  if (!assetData) {

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

        keyboardShouldPersistTaps="handled"
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
              Edit Fixed Asset
            </Text>


            <Text
              style={
                styles.subtitle
              }
            >
              {assetNo}
            </Text>

          </View>

        </View>


        {/* IDENTIFICATION */}

        <FormSection
          icon="car-outline"
          title="Asset Identification"
        >

          <Label
            title="Asset Number"
          />


          <View
            style={
              styles.readOnlyBox
            }
          >

            <Ionicons
              name="lock-closed-outline"
              size={17}
              color={
                Colors.textMuted
              }
            />


            <Text
              style={
                styles.readOnlyText
              }
            >
              {assetNo}
            </Text>

          </View>


          <Text
            style={
              styles.helperText
            }
          >
            Asset number cannot be changed.
          </Text>


          <Label
            title="Vehicle Number"
            required
          />

          <InputBox
            icon="car-outline"
            value={vehicleNo}
            onChangeText={
              setVehicleNo
            }
            placeholder="Enter vehicle number"
            maxLength={50}
          />


          <Label
            title="Tag Number"
            required
          />

          <InputBox
            icon="pricetag-outline"
            value={tagNo}
            onChangeText={
              setTagNo
            }
            placeholder="Enter tag number"
            maxLength={50}
          />


          <Label
            title="Plate Number"
            required
          />

          <InputBox
            icon="card-outline"
            value={plateNo}
            onChangeText={
              setPlateNo
            }
            placeholder="Enter plate number"
            maxLength={50}
          />


          <Label
            title="Asset Category"
            required
          />


          <Pressable
            style={[
              styles.selectBox,

              categoryOpen &&
                styles.selectBoxOpen,
            ]}

            onPress={() =>
              setCategoryOpen(
                current =>
                  !current
              )
            }
          >

            <Ionicons
              name="folder-outline"
              size={18}
              color={
                Colors.textSecondary
              }
            />


            <Text
              style={[
                styles.selectText,

                !selectedCategory &&
                  styles.placeholder,
              ]}
            >
              {
                selectedCategory
                  ?.label ??
                'Select category'
              }
            </Text>


            <Ionicons
              name={
                categoryOpen
                  ? 'chevron-up'
                  : 'chevron-down'
              }
              size={17}
              color={
                Colors.textMuted
              }
            />

          </Pressable>


          {categoryOpen && (

            <View
              style={
                styles.optionContainer
              }
            >

              {categories.map(
                item => (

                  <Pressable
                    key={item.id}

                    style={[
                      styles.optionItem,

                      categoryId ===
                        item.id &&
                        styles.optionSelected,
                    ]}

                    onPress={() => {

                      setCategoryId(
                        item.id
                      );

                      setCategoryOpen(
                        false
                      );

                    }}
                  >

                    <Text
                      style={[
                        styles.optionText,

                        categoryId ===
                          item.id &&
                          styles.optionTextSelected,
                      ]}
                    >
                      {item.label}
                    </Text>


                    {categoryId ===
                      item.id && (

                      <Ionicons
                        name="checkmark"
                        size={18}
                        color={
                          Colors.primary
                        }
                      />

                    )}

                  </Pressable>

                )
              )}

            </View>

          )}


          <Label
            title="Name of Machinery"
            required
          />

          <InputBox
            icon="construct-outline"
            value={
              nameOfMachinery
            }
            onChangeText={
              setNameOfMachinery
            }
            placeholder="Enter machinery name"
            maxLength={200}
          />

        </FormSection>


        {/* VEHICLE DETAILS */}

        <FormSection
          icon="settings-outline"
          title="Vehicle / Machinery Details"
        >

          <RequiredInput
            label="Make of Vehicle"
            icon="car-sport-outline"
            value={makeOfVehicle}
            setValue={setMakeOfVehicle}
            placeholder="Enter vehicle make"
            maxLength={100}
          />

          <RequiredInput
            label="Model"
            icon="layers-outline"
            value={model}
            setValue={setModel}
            placeholder="Enter model"
            maxLength={100}
          />

          <RequiredInput
            label="Make Year"
            icon="calendar-outline"
            value={makeOfYear}
            setValue={setMakeOfYear}
            placeholder="Enter make year"
            keyboardType="number-pad"
            maxLength={20}
          />

          <RequiredInput
            label="Chassis Number"
            icon="barcode-outline"
            value={chassisNo}
            setValue={setChassisNo}
            placeholder="Enter chassis number"
            maxLength={100}
          />

          <RequiredInput
            label="Engine Number"
            icon="settings-outline"
            value={engineNo}
            setValue={setEngineNo}
            placeholder="Enter engine number"
            maxLength={100}
          />

          <RequiredInput
            label="Engine Model"
            icon="construct-outline"
            value={engineModel}
            setValue={setEngineModel}
            placeholder="Enter engine model"
            maxLength={100}
          />

          <RequiredInput
            label="Make of Engine"
            icon="cog-outline"
            value={makeOfEngine}
            setValue={setMakeOfEngine}
            placeholder="Enter engine make"
            maxLength={100}
          />

          <RequiredInput
            label="Horse Power"
            icon="flash-outline"
            value={horsePower}
            setValue={setHorsePower}
            placeholder="Enter horse power"
            keyboardType="decimal-pad"
          />

          <RequiredInput
            label="Fuel Type"
            icon="flame-outline"
            value={typeOfFuel}
            setValue={setTypeOfFuel}
            placeholder="Example: Diesel"
            maxLength={50}
          />

        </FormSection>


        {/* READING */}

        <FormSection
          icon="speedometer-outline"
          title="Reading & Consumption"
        >

          <Label
            title="Reading Type"
            required
          />


          <View
            style={
              styles.choiceRow
            }
          >

            <ChoiceButton
              title="KM Reading"
              icon="speedometer-outline"
              selected={
                readingType ===
                'km_reading'
              }
              onPress={() =>
                setReadingType(
                  'km_reading'
                )
              }
            />


            <ChoiceButton
              title="Engine HP"
              icon="flash-outline"
              selected={
                readingType ===
                'engine_horse_power'
              }
              onPress={() =>
                setReadingType(
                  'engine_horse_power'
                )
              }
            />

          </View>


          <RequiredInput
            label="Current Reading"
            icon="analytics-outline"
            value={reading}
            setValue={setReading}
            placeholder="Enter reading"
            keyboardType="decimal-pad"
          />


          <Label
            title="Consumption"
          />

          <InputBox
            icon="water-outline"
            value={consumption}
            onChangeText={
              setConsumption
            }
            placeholder="Optional"
            keyboardType="decimal-pad"
          />


          <Label
            title="Standard Consumption"
          />

          <InputBox
            icon="stats-chart-outline"
            value={
              standardConsumption
            }
            onChangeText={
              setStandardConsumption
            }
            placeholder="Optional"
            keyboardType="decimal-pad"
          />


          <RequiredInput
            label="Tank Capacity"
            icon="beaker-outline"
            value={tankerCapacity}
            setValue={
              setTankerCapacity
            }
            placeholder="Enter tank capacity"
            keyboardType="decimal-pad"
          />


          <Label
            title="Last Refill"
          />

          <DateInput
            value={lastRefill}
            onChangeText={
              setLastRefill
            }
          />

        </FormSection>


        {/* GAUGE */}

        <FormSection
          icon="speedometer-outline"
          title="Gauge Information"
        >

          <Label
            title="Has Gauge?"
            required
          />


          <View
            style={
              styles.choiceRow
            }
          >

            <ChoiceButton
              title="Yes"
              icon="checkmark-circle-outline"
              selected={hasGauge}
              onPress={() =>
                setHasGauge(true)
              }
            />


            <ChoiceButton
              title="No"
              icon="close-circle-outline"
              selected={!hasGauge}
              onPress={() => {

                setHasGauge(false);

                setGaugeReading('');

              }}
            />

          </View>


          {hasGauge && (

            <RequiredInput
              label="Gauge Reading"
              icon="speedometer-outline"
              value={gaugeReading}
              setValue={
                setGaugeReading
              }
              placeholder="Enter gauge reading"
              keyboardType="decimal-pad"
            />

          )}

        </FormSection>


        {/* SERVICE */}

        <FormSection
          icon="build-outline"
          title="Service Information"
        >

          <Label
            title="Service Interval"
          />

          <InputBox
            icon="repeat-outline"
            value={
              serviceInterval
            }
            onChangeText={
              setServiceInterval
            }
            placeholder="Optional"
            keyboardType="number-pad"
          />


          <Label
            title="Last Service"
            required
          />

          <DateInput
            value={lastService}
            onChangeText={
              setLastService
            }
          />

        </FormSection>


        {/* DATES */}

        <FormSection
          icon="calendar-outline"
          title="Important Dates"
        >

          <DateField
            title="Purchase Date"
            value={purchaseDate}
            setValue={setPurchaseDate}
          />

          <DateField
            title="Licence Renewal Date"
            value={
              licenceRenewalDate
            }
            setValue={
              setLicenceRenewalDate
            }
          />

          <DateField
            title="Last Inspection Renewal Date"
            value={
              inspectionRenewalDate
            }
            setValue={
              setInspectionRenewalDate
            }
          />

          <DateField
            title="Last Insurance Renewal Date"
            value={
              insuranceRenewalDate
            }
            setValue={
              setInsuranceRenewalDate
            }
          />

        </FormSection>


        {/* PHOTOS */}

        <FormSection
          icon="images-outline"
          title="Asset Photos"
          subtitle="Existing photos are kept unless replaced"
        >

          <ReplacementPhoto
            title="Front View"
            existingUrl={
              assetData.front_view_photo_url
            }
            replacement={
              frontPhoto
            }
            onPick={() =>
              pickImage(
                setFrontPhoto
              )
            }
            onCancelReplacement={() =>
              setFrontPhoto(null)
            }
          />


          <ReplacementPhoto
            title="Rear View"
            existingUrl={
              assetData.rear_view_photo_url
            }
            replacement={
              rearPhoto
            }
            onPick={() =>
              pickImage(
                setRearPhoto
              )
            }
            onCancelReplacement={() =>
              setRearPhoto(null)
            }
          />


          <ReplacementPhoto
            title="Right Side View"
            existingUrl={
              assetData.right_side_view_photo_url
            }
            replacement={
              rightPhoto
            }
            onPick={() =>
              pickImage(
                setRightPhoto
              )
            }
            onCancelReplacement={() =>
              setRightPhoto(null)
            }
          />


          <ReplacementPhoto
            title="Left Side View"
            existingUrl={
              assetData.left_side_view_photo_url
            }
            replacement={
              leftPhoto
            }
            onPick={() =>
              pickImage(
                setLeftPhoto
              )
            }
            onCancelReplacement={() =>
              setLeftPhoto(null)
            }
          />

        </FormSection>


        {/* DOCUMENTS */}

        <FormSection
          icon="documents-outline"
          title="Asset Documents"
          subtitle="Select a PDF only when replacing an existing document"
        >

          <ReplacementDocument
            title="Libre Document"
            existingUrl={
              assetData.libre_document_url
            }
            replacement={
              libreDocument
            }
            onOpenExisting={() =>
              openDocument(
                assetData.libre_document_url
              )
            }
            onPick={() =>
              pickPdf(
                setLibreDocument
              )
            }
            onCancelReplacement={() =>
              setLibreDocument(
                null
              )
            }
          />


          <ReplacementDocument
            title="Inspection Document"
            existingUrl={
              assetData.inspection_document_url
            }
            replacement={
              inspectionDocument
            }
            onOpenExisting={() =>
              openDocument(
                assetData.inspection_document_url
              )
            }
            onPick={() =>
              pickPdf(
                setInspectionDocument
              )
            }
            onCancelReplacement={() =>
              setInspectionDocument(
                null
              )
            }
          />


          <ReplacementDocument
            title="Insurance Document"
            existingUrl={
              assetData.insurance_document_url
            }
            replacement={
              insuranceDocument
            }
            onOpenExisting={() =>
              openDocument(
                assetData.insurance_document_url
              )
            }
            onPick={() =>
              pickPdf(
                setInsuranceDocument
              )
            }
            onCancelReplacement={() =>
              setInsuranceDocument(
                null
              )
            }
          />

        </FormSection>


        {/* OTHER */}

        <FormSection
          icon="information-circle-outline"
          title="Other Information"
        >

          <Label
            title="Asset Condition"
            required
          />


          <View
            style={
              styles.conditionContainer
            }
          >

            {CONDITIONS.map(
              item => {

                const selected =
                  assetCondition ===
                  item.value;


                return (

                  <Pressable
                    key={
                      item.value
                    }

                    style={[
                      styles.conditionOption,

                      selected &&
                        styles.conditionSelected,
                    ]}

                    onPress={() =>
                      setAssetCondition(
                        item.value
                      )
                    }
                  >

                    <Ionicons
                      name={
                        selected
                          ? 'radio-button-on'
                          : 'radio-button-off'
                      }
                      size={18}
                      color={
                        selected
                          ? Colors.primary
                          : Colors.textMuted
                      }
                    />


                    <Text
                      style={[
                        styles.conditionText,

                        selected &&
                          styles.conditionTextSelected,
                      ]}
                    >
                      {item.label}
                    </Text>

                  </Pressable>

                );

              }
            )}

          </View>


          <Label
            title="Current Location"
          />

          <InputBox
            icon="location-outline"
            value={
              currentLocation
            }
            onChangeText={
              setCurrentLocation
            }
            placeholder="Enter current location"
            maxLength={200}
          />


          <Label
            title="Assigned To"
          />

          <InputBox
            icon="person-outline"
            value={assignedTo}
            onChangeText={
              setAssignedTo
            }
            placeholder="Enter assigned person"
            maxLength={200}
          />


          <Label
            title="Remarks"
          />


          <View
            style={
              styles.textAreaBox
            }
          >

            <Ionicons
              name="document-text-outline"
              size={18}
              color={
                Colors.textSecondary
              }
              style={{
                marginTop: 3,
              }}
            />


            <TextInput
              value={remarks}

              onChangeText={
                setRemarks
              }

              placeholder="Enter remarks"

              placeholderTextColor={
                Colors.textMuted
              }

              multiline

              maxLength={5000}

              textAlignVertical="top"

              style={
                styles.textArea
              }
            />

          </View>


          <Label
            title="Status"
            required
          />


          <View
            style={
              styles.choiceRow
            }
          >

            <ChoiceButton
              title="Active"
              icon="checkmark-circle-outline"
              selected={
                status ===
                'active'
              }
              onPress={() =>
                setStatus('active')
              }
            />


            <ChoiceButton
              title="Inactive"
              icon="pause-circle-outline"
              selected={
                status ===
                'inactive'
              }
              onPress={() =>
                setStatus(
                  'inactive'
                )
              }
            />

          </View>

        </FormSection>


        {/* UPDATE */}

        <Pressable
          disabled={saving}

          style={[
            styles.saveButton,

            saving &&
              styles.disabled,
          ]}

          onPress={
            updateAsset
          }
        >

          {saving ? (

            <ActivityIndicator
              size="small"
              color="#FFFFFF"
            />

          ) : (

            <>

              <Ionicons
                name="save-outline"
                size={20}
                color="#FFFFFF"
              />


              <Text
                style={
                  styles.saveText
                }
              >
                Update Fixed Asset
              </Text>

            </>

          )}

        </Pressable>


        {/* CANCEL */}

        <Pressable
          disabled={saving}

          style={
            styles.cancelButton
          }

          onPress={() =>
            router.back()
          }
        >

          <Text
            style={
              styles.cancelText
            }
          >
            Cancel
          </Text>

        </Pressable>

      </ScrollView>

    </SafeAreaView>
  );

}


/*
|--------------------------------------------------------------------------
| Required Input
|--------------------------------------------------------------------------
*/

function RequiredInput({
  label,
  icon,
  value,
  setValue,
  placeholder,
  keyboardType,
  maxLength,
}: {
  label: string;
  icon: string;
  value: string;
  setValue:
    (value: string) => void;
  placeholder: string;
  keyboardType?: any;
  maxLength?: number;
}) {

  return (
    <>

      <Label
        title={label}
        required
      />


      <InputBox
        icon={icon}
        value={value}
        onChangeText={
          setValue
        }
        placeholder={
          placeholder
        }
        keyboardType={
          keyboardType
        }
        maxLength={
          maxLength
        }
      />

    </>
  );

}


/*
|--------------------------------------------------------------------------
| Date Field
|--------------------------------------------------------------------------
*/

function DateField({
  title,
  value,
  setValue,
}: {
  title: string;
  value: string;
  setValue:
    (value: string) => void;
}) {

  return (
    <>

      <Label
        title={title}
        required
      />


      <DateInput
        value={value}
        onChangeText={
          setValue
        }
      />

    </>
  );

}


/*
|--------------------------------------------------------------------------
| Input
|--------------------------------------------------------------------------
*/

function InputBox({
  icon,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  maxLength,
}: {
  icon: string;
  value: string;
  onChangeText:
    (value: string) => void;
  placeholder: string;
  keyboardType?: any;
  maxLength?: number;
}) {

  return (
    <View
      style={
        styles.inputBox
      }
    >

      <Ionicons
        name={icon as any}
        size={18}
        color={
          Colors.textSecondary
        }
      />


      <TextInput
        value={value}
        onChangeText={
          onChangeText
        }
        placeholder={
          placeholder
        }
        placeholderTextColor={
          Colors.textMuted
        }
        keyboardType={
          keyboardType
        }
        maxLength={
          maxLength
        }
        style={
          styles.input
        }
      />

    </View>
  );

}


/*
|--------------------------------------------------------------------------
| Date Input
|--------------------------------------------------------------------------
*/

function DateInput({
  value,
  onChangeText,
}: {
  value: string;
  onChangeText:
    (value: string) => void;
}) {

  return (
    <View
      style={
        styles.inputBox
      }
    >

      <Ionicons
        name="calendar-outline"
        size={18}
        color={
          Colors.textSecondary
        }
      />


      <TextInput
        value={value}
        onChangeText={
          onChangeText
        }
        placeholder="YYYY-MM-DD"
        placeholderTextColor={
          Colors.textMuted
        }
        maxLength={10}
        keyboardType="numbers-and-punctuation"
        style={
          styles.input
        }
      />

    </View>
  );

}


/*
|--------------------------------------------------------------------------
| Label
|--------------------------------------------------------------------------
*/

function Label({
  title,
  required = false,
}: {
  title: string;
  required?: boolean;
}) {

  return (
    <View
      style={
        styles.labelRow
      }
    >

      <Text
        style={
          styles.label
        }
      >
        {title}
      </Text>


      {required && (

        <Text
          style={
            styles.required
          }
        >
          *
        </Text>

      )}

    </View>
  );

}


/*
|--------------------------------------------------------------------------
| Form Section
|--------------------------------------------------------------------------
*/

function FormSection({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: string;
  title: string;
  subtitle?: string;
  children:
    React.ReactNode;
}) {

  return (
    <View
      style={
        styles.formCard
      }
    >

      <View
        style={
          styles.sectionHeader
        }
      >

        <View
          style={
            styles.sectionIcon
          }
        >

          <Ionicons
            name={icon as any}
            size={21}
            color={
              Colors.primary
            }
          />

        </View>


        <View
          style={{
            flex: 1,
          }}
        >

          <Text
            style={
              styles.sectionTitle
            }
          >
            {title}
          </Text>


          {subtitle && (

            <Text
              style={
                styles.sectionSubtitle
              }
            >
              {subtitle}
            </Text>

          )}

        </View>

      </View>


      {children}

    </View>
  );

}


/*
|--------------------------------------------------------------------------
| Choice
|--------------------------------------------------------------------------
*/

function ChoiceButton({
  title,
  icon,
  selected,
  onPress,
}: {
  title: string;
  icon: string;
  selected: boolean;
  onPress: () => void;
}) {

  return (
    <Pressable
      onPress={
        onPress
      }

      style={[
        styles.choiceButton,

        selected &&
          styles.choiceSelected,
      ]}
    >

      <Ionicons
        name={icon as any}
        size={18}
        color={
          selected
            ? Colors.primary
            : Colors.textSecondary
        }
      />


      <Text
        style={[
          styles.choiceText,

          selected &&
            styles.choiceTextSelected,
        ]}
      >
        {title}
      </Text>

    </Pressable>
  );

}


/*
|--------------------------------------------------------------------------
| Replacement Photo
|--------------------------------------------------------------------------
*/

function ReplacementPhoto({
  title,
  existingUrl,
  replacement,
  onPick,
  onCancelReplacement,
}: {
  title: string;
  existingUrl?:
    | string
    | null;
  replacement:
    | UploadFile
    | null;
  onPick: () => void;
  onCancelReplacement:
    () => void;
}) {

  const preview =
    replacement?.uri ??
    existingUrl ??
    null;


  return (
    <View
      style={
        styles.fileBlock
      }
    >

      <Text
        style={
          styles.fileTitle
        }
      >
        {title}
      </Text>


      {preview ? (

        <Image
          source={{
            uri: preview,
          }}
          style={
            styles.photoPreview
          }
          resizeMode="cover"
        />

      ) : (

        <View
          style={
            styles.noExistingPhoto
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
              styles.noExistingText
            }
          >
            No existing photo
          </Text>

        </View>

      )}


      <View
        style={
          styles.replacementActions
        }
      >

        <Pressable
          style={
            styles.replaceButton
          }
          onPress={
            onPick
          }
        >

          <Ionicons
            name="camera-outline"
            size={17}
            color={
              Colors.primary
            }
          />


          <Text
            style={
              styles.replaceText
            }
          >
            {
              replacement
                ? 'Change New Photo'
                : 'Replace Photo'
            }
          </Text>

        </Pressable>


        {replacement && (

          <Pressable
            style={
              styles.cancelReplacement
            }
            onPress={
              onCancelReplacement
            }
          >

            <Ionicons
              name="close-outline"
              size={17}
              color={
                Colors.danger
              }
            />


            <Text
              style={
                styles.cancelReplacementText
              }
            >
              Keep Existing
            </Text>

          </Pressable>

        )}

      </View>


      {replacement && (

        <Text
          style={
            styles.newFileText
          }
          numberOfLines={1}
        >
          New: {replacement.name}
        </Text>

      )}

    </View>
  );

}


/*
|--------------------------------------------------------------------------
| Replacement Document
|--------------------------------------------------------------------------
*/

function ReplacementDocument({
  title,
  existingUrl,
  replacement,
  onOpenExisting,
  onPick,
  onCancelReplacement,
}: {
  title: string;
  existingUrl?:
    | string
    | null;
  replacement:
    | UploadFile
    | null;
  onOpenExisting:
    () => void;
  onPick:
    () => void;
  onCancelReplacement:
    () => void;
}) {

  return (
    <View
      style={
        styles.fileBlock
      }
    >

      <Text
        style={
          styles.fileTitle
        }
      >
        {title}
      </Text>


      <View
        style={
          styles.documentBox
        }
      >

        <View
          style={
            styles.pdfIcon
          }
        >

          <Ionicons
            name="document-text-outline"
            size={21}
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
              styles.documentStatus
            }
          >
            {
              replacement
                ? replacement.name
                : existingUrl
                ? 'Existing PDF available'
                : 'No existing PDF'
            }
          </Text>


          <Text
            style={
              styles.documentHint
            }
          >
            {
              replacement
                ? 'New replacement selected'
                : 'PDF • Max 10 MB'
            }
          </Text>

        </View>


        {!replacement &&
          existingUrl && (

          <Pressable
            style={
              styles.documentOpen
            }
            onPress={
              onOpenExisting
            }
          >

            <Ionicons
              name="open-outline"
              size={17}
              color={
                Colors.primary
              }
            />

          </Pressable>

        )}

      </View>


      <View
        style={
          styles.replacementActions
        }
      >

        <Pressable
          style={
            styles.replaceButton
          }
          onPress={
            onPick
          }
        >

          <Ionicons
            name="document-attach-outline"
            size={17}
            color={
              Colors.primary
            }
          />


          <Text
            style={
              styles.replaceText
            }
          >
            {
              replacement
                ? 'Change PDF'
                : 'Replace PDF'
            }
          </Text>

        </Pressable>


        {replacement && (

          <Pressable
            style={
              styles.cancelReplacement
            }
            onPress={
              onCancelReplacement
            }
          >

            <Ionicons
              name="close-outline"
              size={17}
              color={
                Colors.danger
              }
            />


            <Text
              style={
                styles.cancelReplacementText
              }
            >
              Keep Existing
            </Text>

          </Pressable>

        )}

      </View>

    </View>
  );

}


/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function valueToString(
  value:
    | string
    | number
    | null
    | undefined
) {

  if (
    value === null ||
    value === undefined
  ) {
    return '';
  }


  return String(value);
}


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


function isNonNegativeNumber(
  value: string
) {

  const number =
    Number(value);


  return (
    value.trim() !== '' &&
    !Number.isNaN(number) &&
    number >= 0
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
      paddingBottom: 60,
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

    /*
    |--------------------------------------------------------------------------
    | Sections
    |--------------------------------------------------------------------------
    */

    formCard: {
      marginTop: 18,
      padding: 17,
      borderRadius: 20,
      backgroundColor:
        Colors.surface,
      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 3,
    },

    sectionIcon: {
      width: 42,
      height: 42,
      borderRadius: 13,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10,
      backgroundColor:
        Colors.primaryLight,
    },

    sectionTitle: {
      fontSize: 13,
      fontFamily:
        Fonts.extraBold,
      color:
        Colors.text,
    },

    sectionSubtitle: {
      marginTop: 2,
      fontSize: 9,
      fontFamily:
        Fonts.regular,
      color:
        Colors.textSecondary,
    },

    /*
    |--------------------------------------------------------------------------
    | Labels / Inputs
    |--------------------------------------------------------------------------
    */

    labelRow: {
      marginTop: 18,
      marginBottom: 7,
      flexDirection: 'row',
      alignItems: 'center',
    },

    label: {
      fontSize: 10,
      fontFamily:
        Fonts.semiBold,
      color:
        Colors.text,
    },

    required: {
      marginLeft: 3,
      fontFamily:
        Fonts.bold,
      color:
        Colors.danger,
    },

    inputBox: {
      minHeight: 51,
      paddingHorizontal: 14,
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 14,
      backgroundColor:
        Colors.background,
      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    input: {
      flex: 1,
      marginLeft: 9,
      fontSize: 11,
      fontFamily:
        Fonts.regular,
      color:
        Colors.text,
    },

    readOnlyBox: {
      minHeight: 51,
      paddingHorizontal: 14,
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 14,
      backgroundColor:
        Colors.background,
      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    readOnlyText: {
      marginLeft: 9,
      fontSize: 11,
      fontFamily:
        Fonts.bold,
      color:
        Colors.textSecondary,
    },

    helperText: {
      marginTop: 5,
      fontSize: 8,
      fontFamily:
        Fonts.regular,
      color:
        Colors.textMuted,
    },

    /*
    |--------------------------------------------------------------------------
    | Category
    |--------------------------------------------------------------------------
    */

    selectBox: {
      minHeight: 51,
      paddingHorizontal: 14,
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 14,
      backgroundColor:
        Colors.background,
      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    selectBoxOpen: {
      borderColor:
        Colors.primary,
    },

    selectText: {
      flex: 1,
      marginLeft: 9,
      fontSize: 11,
      fontFamily:
        Fonts.medium,
      color:
        Colors.text,
    },

    placeholder: {
      color:
        Colors.textMuted,
    },

    optionContainer: {
      marginTop: 6,
      maxHeight: 280,
      overflow: 'hidden',
      borderRadius: 14,
      backgroundColor:
        Colors.background,
      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    optionItem: {
      minHeight: 47,
      paddingHorizontal: 13,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'space-between',
      borderBottomWidth: 1,
      borderBottomColor:
        Colors.border,
    },

    optionSelected: {
      backgroundColor:
        Colors.primaryLight,
    },

    optionText: {
      flex: 1,
      fontSize: 10,
      fontFamily:
        Fonts.medium,
      color:
        Colors.text,
    },

    optionTextSelected: {
      color:
        Colors.primary,
      fontFamily:
        Fonts.bold,
    },

    /*
    |--------------------------------------------------------------------------
    | Choice
    |--------------------------------------------------------------------------
    */

    choiceRow: {
      flexDirection: 'row',
      gap: 9,
    },

    choiceButton: {
      flex: 1,
      minHeight: 50,
      paddingHorizontal: 8,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      borderRadius: 14,
      backgroundColor:
        Colors.background,
      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    choiceSelected: {
      borderColor:
        Colors.primary,
      backgroundColor:
        Colors.primaryLight,
    },

    choiceText: {
      fontSize: 9,
      textAlign: 'center',
      fontFamily:
        Fonts.semiBold,
      color:
        Colors.textSecondary,
    },

    choiceTextSelected: {
      color:
        Colors.primary,
      fontFamily:
        Fonts.bold,
    },

    /*
    |--------------------------------------------------------------------------
    | Condition
    |--------------------------------------------------------------------------
    */

    conditionContainer: {
      gap: 7,
    },

    conditionOption: {
      minHeight: 48,
      paddingHorizontal: 13,
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 13,
      backgroundColor:
        Colors.background,
      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    conditionSelected: {
      borderColor:
        Colors.primary,
      backgroundColor:
        Colors.primaryLight,
    },

    conditionText: {
      marginLeft: 9,
      fontSize: 10,
      fontFamily:
        Fonts.medium,
      color:
        Colors.textSecondary,
    },

    conditionTextSelected: {
      color:
        Colors.primary,
      fontFamily:
        Fonts.bold,
    },

    /*
    |--------------------------------------------------------------------------
    | Remarks
    |--------------------------------------------------------------------------
    */

    textAreaBox: {
      minHeight: 110,
      padding: 14,
      flexDirection: 'row',
      alignItems: 'flex-start',
      borderRadius: 14,
      backgroundColor:
        Colors.background,
      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    textArea: {
      flex: 1,
      minHeight: 80,
      marginLeft: 9,
      paddingTop: 0,
      fontSize: 11,
      lineHeight: 18,
      fontFamily:
        Fonts.regular,
      color:
        Colors.text,
    },

    /*
    |--------------------------------------------------------------------------
    | File Replacement
    |--------------------------------------------------------------------------
    */

    fileBlock: {
      marginTop: 17,
    },

    fileTitle: {
      marginBottom: 7,
      fontSize: 10,
      fontFamily:
        Fonts.semiBold,
      color:
        Colors.text,
    },

    photoPreview: {
      width: '100%',
      height: 190,
      borderRadius: 14,
      backgroundColor:
        Colors.background,
    },

    noExistingPhoto: {
      height: 110,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 14,
      backgroundColor:
        Colors.background,
      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    noExistingText: {
      marginTop: 5,
      fontSize: 8,
      fontFamily:
        Fonts.regular,
      color:
        Colors.textMuted,
    },

    replacementActions: {
      marginTop: 8,
      flexDirection: 'row',
      gap: 8,
    },

    replaceButton: {
      flex: 1,
      height: 42,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 5,
      borderRadius: 12,
      backgroundColor:
        Colors.primaryLight,
      borderWidth: 1,
      borderColor:
        Colors.primary,
    },

    replaceText: {
      fontSize: 9,
      fontFamily:
        Fonts.bold,
      color:
        Colors.primary,
    },

    cancelReplacement: {
      flex: 1,
      height: 42,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4,
      borderRadius: 12,
      backgroundColor:
        Colors.background,
      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    cancelReplacementText: {
      fontSize: 9,
      fontFamily:
        Fonts.bold,
      color:
        Colors.danger,
    },

    newFileText: {
      marginTop: 5,
      fontSize: 8,
      fontFamily:
        Fonts.medium,
      color:
        Colors.primary,
    },

    documentBox: {
      minHeight: 61,
      padding: 10,
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 13,
      backgroundColor:
        Colors.background,
      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    pdfIcon: {
      width: 40,
      height: 40,
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

    documentStatus: {
      fontSize: 9,
      fontFamily:
        Fonts.bold,
      color:
        Colors.text,
    },

    documentHint: {
      marginTop: 3,
      fontSize: 8,
      fontFamily:
        Fonts.regular,
      color:
        Colors.textMuted,
    },

    documentOpen: {
      width: 36,
      height: 36,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
      backgroundColor:
        Colors.primaryLight,
    },

    /*
    |--------------------------------------------------------------------------
    | Buttons
    |--------------------------------------------------------------------------
    */

    saveButton: {
      height: 55,
      marginTop: 22,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 7,
      borderRadius: 15,
      backgroundColor:
        Colors.primary,
    },

    saveText: {
      fontSize: 11,
      fontFamily:
        Fonts.bold,
      color: '#FFFFFF',
    },

    cancelButton: {
      height: 50,
      marginTop: 10,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 14,
      backgroundColor:
        Colors.surface,
      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    cancelText: {
      fontSize: 10,
      fontFamily:
        Fonts.bold,
      color:
        Colors.textSecondary,
    },

    disabled: {
      opacity: 0.5,
    },

  });
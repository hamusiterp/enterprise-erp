import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

import {
  useEffect,
  useState,
} from 'react';

import {
  FixedAssetCondition,
  FixedAssetReadingType,
  FixedAssetStatus,
  UploadFile,
  fixedAssetsApi,
} from '../../../../api/fixedAssetsApi';

import {
  CategoryOption,
  categoriesApi,
} from '../../../../api/categoriesApi';

import {
  Colors,
} from '../../../../constants/colors';

import {
  Fonts,
} from '../../../../constants/fonts';


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


export default function CreateFixedAssetScreen() {

  /*
  |--------------------------------------------------------------------------
  | Asset Number
  |--------------------------------------------------------------------------
  */

  const [
    assetNo,
    setAssetNo,
  ] =
    useState('');


  /*
  |--------------------------------------------------------------------------
  | Identification
  |--------------------------------------------------------------------------
  */

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
    categoryOpen,
    setCategoryOpen,
  ] =
    useState(false);


  const [
    categories,
    setCategories,
  ] =
    useState<CategoryOption[]>(
      []
    );


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
  | Reading / Consumption
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
  | Important Dates
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
  | Other Information
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
  | Photos
  |--------------------------------------------------------------------------
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
  | Documents
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
  | Loading
  |--------------------------------------------------------------------------
  */

  const [
    loadingOptions,
    setLoadingOptions,
  ] =
    useState(true);


  const [
    saving,
    setSaving,
  ] =
    useState(false);


  /*
  |--------------------------------------------------------------------------
  | Load Number + Categories
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    const load =
      async () => {

        try {

          const [
            nextNumber,
            categoryOptions,
          ] =
            await Promise.all([

              fixedAssetsApi
                .nextNumber(),

              categoriesApi
                .options(),

            ]);


          setAssetNo(
            nextNumber
          );


          setCategories(
            categoryOptions ??
            []
          );

        } catch (error: any) {

          console.log(
            'FIXED ASSET OPTIONS ERROR:',
            error?.response?.data ??
            error
          );


          Alert.alert(
            'Unable to Load',
            'Unable to load fixed asset form options.'
          );

        } finally {

          setLoadingOptions(
            false
          );

        }

      };


    load();

  }, []);


  const selectedCategory =
    categories.find(
      item =>
        item.id ===
        categoryId
    );


  /*
  |--------------------------------------------------------------------------
  | Pick Image
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


        const asset =
          result.assets[0];


        const name =
          asset.fileName ||
          `photo_${Date.now()}.jpg`;


        const type =
          asset.mimeType ||
          'image/jpeg';


        setter({

          uri:
            asset.uri,

          name,

          type,

        });

      } catch (error) {

        console.log(
          'IMAGE PICKER ERROR:',
          error
        );


        Alert.alert(
          'Unable to Select Photo',
          'The photo could not be selected.'
        );

      }

    };


  /*
  |--------------------------------------------------------------------------
  | Pick PDF
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


        const asset =
          result.assets[0];


        setter({

          uri:
            asset.uri,

          name:
            asset.name,

          type:
            asset.mimeType ||
            'application/pdf',

        });

      } catch (error) {

        console.log(
          'DOCUMENT PICKER ERROR:',
          error
        );


        Alert.alert(
          'Unable to Select PDF',
          'The document could not be selected.'
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
          label: 'Model',
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
          value: reading,
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
            'Last inspection renewal date',
        },

        {
          value:
            insuranceRenewalDate,
          label:
            'Last insurance renewal date',
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
        !isPositiveNumber(
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
        !isPositiveNumber(
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
        !isPositiveNumber(
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
        !isPositiveNumber(
          standardConsumption
        )
      ) {

        Alert.alert(
          'Invalid Consumption',
          'Standard consumption must be zero or greater.'
        );

        return false;

      }


      if (
        !isPositiveNumber(
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
          'Gauge reading is required when the asset has a gauge.'
        );

        return false;

      }


      if (
        hasGauge &&
        !isPositiveNumber(
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
        serviceInterval.trim() &&
        (
          Number.isNaN(
            Number(
              serviceInterval
            )
          ) ||
          Number(
            serviceInterval
          ) < 0
        )
      ) {

        Alert.alert(
          'Invalid Service Interval',
          'Service interval must be zero or greater.'
        );

        return false;

      }


      /*
       * Required files on CREATE
       */

      if (!frontPhoto) {

        Alert.alert(
          'Photo Required',
          'Front view photo is required.'
        );

        return false;

      }


      if (!rearPhoto) {

        Alert.alert(
          'Photo Required',
          'Rear view photo is required.'
        );

        return false;

      }


      if (!rightPhoto) {

        Alert.alert(
          'Photo Required',
          'Right-side view photo is required.'
        );

        return false;

      }


      if (!leftPhoto) {

        Alert.alert(
          'Photo Required',
          'Left-side view photo is required.'
        );

        return false;

      }


      if (!libreDocument) {

        Alert.alert(
          'Document Required',
          'Libre PDF is required.'
        );

        return false;

      }


      if (!inspectionDocument) {

        Alert.alert(
          'Document Required',
          'Inspection PDF is required.'
        );

        return false;

      }


      if (!insuranceDocument) {

        Alert.alert(
          'Document Required',
          'Insurance PDF is required.'
        );

        return false;

      }


      return true;

    };


  /*
  |--------------------------------------------------------------------------
  | Save
  |--------------------------------------------------------------------------
  */

  const saveAsset =
    async () => {

      if (
        saving ||
        !validate() ||
        !categoryId
      ) {
        return;
      }


      try {

        setSaving(
          true
        );


        const created =
          await fixedAssetsApi.create({

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

          });


        Alert.alert(
          'Fixed Asset Created',
          `${created.asset_no} has been registered successfully.`,
          [
            {
              text:
                'View Asset',

              onPress: () =>
                router.replace(
                  `/(app)/management/fixed-assets/${created.id}` as any
                ),
            },
          ]
        );

      } catch (error: any) {

        console.log(
          'CREATE FIXED ASSET ERROR:',
          error?.response?.data ??
          error
        );


        Alert.alert(
          'Unable to Create Asset',
          getApiError(
            error,
            'The fixed asset could not be created.'
          )
        );

      } finally {

        setSaving(
          false
        );

      }

    };


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
              Add Fixed Asset
            </Text>

            <Text
              style={
                styles.subtitle
              }
            >
              Register vehicle or machinery
            </Text>

          </View>

        </View>


        {/* BASIC INFORMATION */}

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


            {loadingOptions ? (

              <ActivityIndicator
                size="small"
                color={
                  Colors.primary
                }
                style={{
                  marginLeft: 9,
                }}
              />

            ) : (

              <Text
                style={
                  styles.readOnlyText
                }
              >
                {
                  assetNo ||
                  'Generated when saved'
                }
              </Text>

            )}

          </View>


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
                    key={
                      item.id
                    }

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


        {/* VEHICLE */}

        <FormSection
          icon="settings-outline"
          title="Vehicle / Machinery Details"
        >

          <Label
            title="Make of Vehicle"
            required
          />

          <InputBox
            icon="car-sport-outline"
            value={
              makeOfVehicle
            }
            onChangeText={
              setMakeOfVehicle
            }
            placeholder="Example: Toyota"
            maxLength={100}
          />


          <Label
            title="Model"
            required
          />

          <InputBox
            icon="layers-outline"
            value={model}
            onChangeText={
              setModel
            }
            placeholder="Enter model"
            maxLength={100}
          />


          <Label
            title="Make Year"
            required
          />

          <InputBox
            icon="calendar-outline"
            value={
              makeOfYear
            }
            onChangeText={
              setMakeOfYear
            }
            placeholder="Example: 2025"
            keyboardType="number-pad"
            maxLength={20}
          />


          <Label
            title="Chassis Number"
            required
          />

          <InputBox
            icon="barcode-outline"
            value={
              chassisNo
            }
            onChangeText={
              setChassisNo
            }
            placeholder="Enter chassis number"
            maxLength={100}
          />


          <Label
            title="Engine Number"
            required
          />

          <InputBox
            icon="settings-outline"
            value={engineNo}
            onChangeText={
              setEngineNo
            }
            placeholder="Enter engine number"
            maxLength={100}
          />


          <Label
            title="Engine Model"
            required
          />

          <InputBox
            icon="construct-outline"
            value={
              engineModel
            }
            onChangeText={
              setEngineModel
            }
            placeholder="Enter engine model"
            maxLength={100}
          />


          <Label
            title="Make of Engine"
            required
          />

          <InputBox
            icon="cog-outline"
            value={
              makeOfEngine
            }
            onChangeText={
              setMakeOfEngine
            }
            placeholder="Enter engine make"
            maxLength={100}
          />


          <Label
            title="Horse Power"
            required
          />

          <InputBox
            icon="flash-outline"
            value={horsePower}
            onChangeText={
              setHorsePower
            }
            placeholder="Enter horse power"
            keyboardType="decimal-pad"
          />


          <Label
            title="Fuel Type"
            required
          />

          <InputBox
            icon="flame-outline"
            value={typeOfFuel}
            onChangeText={
              setTypeOfFuel
            }
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


          <Label
            title="Current Reading"
            required
          />

          <InputBox
            icon="analytics-outline"
            value={reading}
            onChangeText={
              setReading
            }
            placeholder="Enter current reading"
            keyboardType="decimal-pad"
          />


          <Label
            title="Consumption"
          />

          <InputBox
            icon="water-outline"
            value={
              consumption
            }
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


          <Label
            title="Tank Capacity"
            required
          />

          <InputBox
            icon="beaker-outline"
            value={
              tankerCapacity
            }
            onChangeText={
              setTankerCapacity
            }
            placeholder="Enter tank capacity"
            keyboardType="decimal-pad"
          />


          <Label
            title="Last Refill"
          />

          <DateInput
            value={
              lastRefill
            }
            onChangeText={
              setLastRefill
            }
            placeholder="YYYY-MM-DD"
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
                setHasGauge(
                  true
                )
              }
            />


            <ChoiceButton
              title="No"
              icon="close-circle-outline"
              selected={
                !hasGauge
              }
              onPress={() => {

                setHasGauge(
                  false
                );

                setGaugeReading(
                  ''
                );

              }}
            />

          </View>


          {hasGauge && (

            <>

              <Label
                title="Gauge Reading"
                required
              />

              <InputBox
                icon="speedometer-outline"
                value={
                  gaugeReading
                }
                onChangeText={
                  setGaugeReading
                }
                placeholder="Enter gauge reading"
                keyboardType="decimal-pad"
              />

            </>

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
            placeholder="YYYY-MM-DD"
          />

        </FormSection>


        {/* DATES */}

        <FormSection
          icon="calendar-outline"
          title="Important Dates"
        >

          <Label
            title="Purchase Date"
            required
          />

          <DateInput
            value={purchaseDate}
            onChangeText={
              setPurchaseDate
            }
            placeholder="YYYY-MM-DD"
          />


          <Label
            title="Licence Renewal Date"
            required
          />

          <DateInput
            value={
              licenceRenewalDate
            }
            onChangeText={
              setLicenceRenewalDate
            }
            placeholder="YYYY-MM-DD"
          />


          <Label
            title="Last Inspection Renewal Date"
            required
          />

          <DateInput
            value={
              inspectionRenewalDate
            }
            onChangeText={
              setInspectionRenewalDate
            }
            placeholder="YYYY-MM-DD"
          />


          <Label
            title="Last Insurance Renewal Date"
            required
          />

          <DateInput
            value={
              insuranceRenewalDate
            }
            onChangeText={
              setInsuranceRenewalDate
            }
            placeholder="YYYY-MM-DD"
          />

        </FormSection>


        {/* PHOTOS */}

        <FormSection
          icon="images-outline"
          title="Asset Photos"
          subtitle="All four photos are required"
        >

          <PhotoPicker
            title="Front View"
            file={frontPhoto}
            onPick={() =>
              pickImage(
                setFrontPhoto
              )
            }
            onRemove={() =>
              setFrontPhoto(
                null
              )
            }
          />


          <PhotoPicker
            title="Rear View"
            file={rearPhoto}
            onPick={() =>
              pickImage(
                setRearPhoto
              )
            }
            onRemove={() =>
              setRearPhoto(
                null
              )
            }
          />


          <PhotoPicker
            title="Right Side View"
            file={rightPhoto}
            onPick={() =>
              pickImage(
                setRightPhoto
              )
            }
            onRemove={() =>
              setRightPhoto(
                null
              )
            }
          />


          <PhotoPicker
            title="Left Side View"
            file={leftPhoto}
            onPick={() =>
              pickImage(
                setLeftPhoto
              )
            }
            onRemove={() =>
              setLeftPhoto(
                null
              )
            }
          />

        </FormSection>


        {/* DOCUMENTS */}

        <FormSection
          icon="documents-outline"
          title="Asset Documents"
          subtitle="PDF format only"
        >

          <DocumentPickerBox
            title="Libre Document"
            file={
              libreDocument
            }
            onPick={() =>
              pickPdf(
                setLibreDocument
              )
            }
            onRemove={() =>
              setLibreDocument(
                null
              )
            }
          />


          <DocumentPickerBox
            title="Inspection Document"
            file={
              inspectionDocument
            }
            onPick={() =>
              pickPdf(
                setInspectionDocument
              )
            }
            onRemove={() =>
              setInspectionDocument(
                null
              )
            }
          />


          <DocumentPickerBox
            title="Insurance Document"
            file={
              insuranceDocument
            }
            onPick={() =>
              pickPdf(
                setInsuranceDocument
              )
            }
            onRemove={() =>
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
              item => (

                <Pressable
                  key={
                    item.value
                  }

                  style={[
                    styles.conditionOption,

                    assetCondition ===
                      item.value &&
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
                      assetCondition ===
                      item.value
                        ? 'radio-button-on'
                        : 'radio-button-off'
                    }
                    size={18}
                    color={
                      assetCondition ===
                        item.value
                        ? Colors.primary
                        : Colors.textMuted
                    }
                  />


                  <Text
                    style={[
                      styles.conditionText,

                      assetCondition ===
                        item.value &&
                        styles.conditionTextSelected,
                    ]}
                  >
                    {item.label}
                  </Text>

                </Pressable>

              )
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
            value={
              assignedTo
            }
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
                setStatus(
                  'active'
                )
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


        {/* SAVE */}

        <Pressable
          disabled={saving}

          style={[
            styles.saveButton,

            saving &&
              styles.disabled,
          ]}

          onPress={
            saveAsset
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
                Save Fixed Asset
              </Text>

            </>

          )}

        </Pressable>


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
            name={
              icon as any
            }
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
        name={
          icon as any
        }
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
  placeholder,
}: {
  value: string;
  onChangeText:
    (value: string) => void;
  placeholder: string;
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

        placeholder={
          placeholder
        }

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
| Choice Button
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
        name={
          icon as any
        }

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
| Photo Picker
|--------------------------------------------------------------------------
*/

function PhotoPicker({
  title,
  file,
  onPick,
  onRemove,
}: {
  title: string;
  file:
    UploadFile |
    null;
  onPick:
    () => void;
  onRemove:
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
        {title} *
      </Text>


      {file ? (

        <View>

          <Image
            source={{
              uri:
                file.uri,
            }}

            style={
              styles.photoPreview
            }

            resizeMode="cover"
          />


          <View
            style={
              styles.fileSelectedRow
            }
          >

            <Ionicons
              name="checkmark-circle"
              size={18}
              color={
                Colors.primary
              }
            />


            <Text
              style={
                styles.selectedFileName
              }
              numberOfLines={1}
            >
              {file.name}
            </Text>


            <Pressable
              onPress={
                onRemove
              }
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

      ) : (

        <Pressable
          style={
            styles.uploadButton
          }

          onPress={
            onPick
          }
        >

          <Ionicons
            name="image-outline"
            size={22}
            color={
              Colors.primary
            }
          />


          <Text
            style={
              styles.uploadText
            }
          >
            Select Photo
          </Text>


          <Text
            style={
              styles.uploadHint
            }
          >
            JPG, JPEG, PNG or WEBP • Max 5 MB
          </Text>

        </Pressable>

      )}

    </View>
  );

}


/*
|--------------------------------------------------------------------------
| Document Picker
|--------------------------------------------------------------------------
*/

function DocumentPickerBox({
  title,
  file,
  onPick,
  onRemove,
}: {
  title: string;
  file:
    UploadFile |
    null;
  onPick:
    () => void;
  onRemove:
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
        {title} *
      </Text>


      {file ? (

        <View
          style={
            styles.documentSelected
          }
        >

          <View
            style={
              styles.pdfIcon
            }
          >

            <Ionicons
              name="document-text-outline"
              size={22}
              color={
                Colors.primary
              }
            />

          </View>


          <View
            style={{
              flex: 1,
              marginLeft: 10,
            }}
          >

            <Text
              style={
                styles.selectedFileName
              }
              numberOfLines={1}
            >
              {file.name}
            </Text>


            <Text
              style={
                styles.uploadHint
              }
            >
              PDF selected
            </Text>

          </View>


          <Pressable
            onPress={
              onRemove
            }
          >
            <Ionicons
              name="trash-outline"
              size={19}
              color={
                Colors.danger
              }
            />
          </Pressable>

        </View>

      ) : (

        <Pressable
          style={
            styles.uploadButton
          }

          onPress={
            onPick
          }
        >

          <Ionicons
            name="document-attach-outline"
            size={22}
            color={
              Colors.primary
            }
          />


          <Text
            style={
              styles.uploadText
            }
          >
            Select PDF
          </Text>


          <Text
            style={
              styles.uploadHint
            }
          >
            PDF only • Max 10 MB
          </Text>

        </Pressable>

      )}

    </View>
  );

}


/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function isPositiveNumber(
  value: string
) {

  const number =
    Number(value);


  return (
    value.trim() !== '' &&
    !Number.isNaN(
      number
    ) &&
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
    | Form
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

    /*
    |--------------------------------------------------------------------------
    | Select
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
      fontFamily:
        Fonts.regular,
    },

    optionContainer: {
      marginTop: 6,
      maxHeight: 280,
      borderRadius: 14,
      overflow: 'hidden',
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
    | Files
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

    uploadButton: {
      minHeight: 92,
      padding: 15,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 14,
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor:
        Colors.primary,
      backgroundColor:
        Colors.background,
    },

    uploadText: {
      marginTop: 6,
      fontSize: 10,
      fontFamily:
        Fonts.bold,
      color:
        Colors.primary,
    },

    uploadHint: {
      marginTop: 3,
      fontSize: 8,
      fontFamily:
        Fonts.regular,
      color:
        Colors.textMuted,
    },

    photoPreview: {
      width: '100%',
      height: 180,
      borderRadius: 14,
      backgroundColor:
        Colors.background,
    },

    fileSelectedRow: {
      marginTop: 7,
      minHeight: 42,
      paddingHorizontal: 10,
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 11,
      backgroundColor:
        Colors.background,
    },

    selectedFileName: {
      flex: 1,
      marginHorizontal: 8,
      fontSize: 9,
      fontFamily:
        Fonts.medium,
      color:
        Colors.text,
    },

    documentSelected: {
      minHeight: 60,
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
      borderWidth: 1,
      borderColor:
        Colors.border,
      backgroundColor:
        Colors.surface,
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
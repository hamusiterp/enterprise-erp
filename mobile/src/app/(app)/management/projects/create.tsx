import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  Ionicons,
} from '@expo/vector-icons';

import {
  router,
} from 'expo-router';

import {
  useEffect,
  useState,
} from 'react';

import {
  BidOption,
  CustomerOption,
  ProjectPayload,
  ProjectSource,
  WorkOrderOption,
  YesNo,
  projectsApi,
} from '../../../../api/projectsApi';

import {
  Colors,
} from '../../../../constants/colors';

import {
  Fonts,
} from '../../../../constants/fonts';


/*
|--------------------------------------------------------------------------
| Fixed Web ERP Options
|--------------------------------------------------------------------------
*/

const businessUnits = [
  {
    label: 'Civil Work',
    value: 'civil',
  },
  {
    label: 'Road',
    value: 'road',
  },
  {
    label: 'Wood',
    value: 'wood',
  },
  {
    label: 'Steel',
    value: 'steel',
  },
  {
    label: 'Aggregate',
    value: 'agg',
  },
  {
    label: 'Machinery Rental',
    value: 'mr',
  },
  {
    label: 'Concrete Ready Mix',
    value: 'con_mix',
  },
  {
    label: 'Machinery Maintenance',
    value: 'machinery_maintenance',
  },
];

const contractTypes = [
  {
    label: 'Labour Only',
    value: 'labour_only',
  },
  {
    label: 'Turn Key',
    value: 'turn_key',
  },
  {
    label: 'Labour With All Material',
    value: 'labour_w_ma',
  },
  {
    label:
      'Labour With Material Except Described Specific Material',
    value: 'labour_w_ma_ex',
  },
];

const pricingTypes = [
  {
    label: 'Unit Rate',
    value: 'unit_rate',
  },
  {
    label: 'Cost Plus',
    value: 'lost_plus',
  },
  {
    label: 'Lump Sum',
    value: 'lump_sum',
  },
  {
    label: 'Time And Material',
    value: 'time_and_material',
  },
];

const repaymentStarts = [
  {
    label: 'First Payment',
    value: 'first_payment',
  },
  {
    label: 'Second Payment',
    value: 'second_payment',
  },
  {
    label: 'Third Payment',
    value: 'third_payment',
  },
  {
    label: 'Fourth Payment',
    value: 'fourth_payment',
  },
];

const bondTypes = [
  {
    label: 'CPO',
    value: 'cpo',
  },
  {
    label: 'Insurance Bank',
    value: 'insurance_bank',
  },
  {
    label: 'Unconditional Bond',
    value: 'unconditional_bond',
  },
  {
    label: 'Conditional Bond',
    value: 'conditional_bond',
  },
  {
    label: 'Bank Bond',
    value: 'bank_bond',
  },
];

const engineeringOptions = [
  {
    label: 'Vehicle',
    value: 'vehicle',
  },
  {
    label: 'Telephone',
    value: 'telephone',
  },
  {
    label: 'Internet',
    value: 'internet',
  },
  {
    label: 'Office',
    value: 'office',
  },
  {
    label: 'Allowance',
    value: 'allowance',
  },
];

const STEPS = [
  'Basic',
  'Contract',
  'Schedule',
  'Payment',
  'Security',
  'Others',
];


export default function CreateProjectScreen() {

  const [step, setStep] =
    useState(0);

  const [saving, setSaving] =
    useState(false);

  const [loadingOptions, setLoadingOptions] =
    useState(true);

  const [sourceLoading, setSourceLoading] =
    useState(false);

  const [projectNo, setProjectNo] =
    useState('');

  /*
  |--------------------------------------------------------------------------
  | Basic
  |--------------------------------------------------------------------------
  */

  const [
    projectSource,
    setProjectSource,
  ] =
    useState<ProjectSource | ''>('');

  const [
    bidReference,
    setBidReference,
  ] = useState('');

  const [
    workOrderNo,
    setWorkOrderNo,
  ] = useState('');

  const [
    projectName,
    setProjectName,
  ] = useState('');

  const [
    projectDescription,
    setProjectDescription,
  ] = useState('');

  const [
    location,
    setLocation,
  ] = useState('');

  const [
    customerId,
    setCustomerId,
  ] =
    useState<number | null>(
      null
    );

  const [
    employer,
    setEmployer,
  ] = useState('');

  const [
    hasConsultant,
    setHasConsultant,
  ] =
    useState<YesNo>('No');

  const [
    consultant,
    setConsultant,
  ] = useState('');

  const [
    hasSpecifiedArea,
    setHasSpecifiedArea,
  ] =
    useState<YesNo>('No');

  const [
    area,
    setArea,
  ] = useState('');

  const [
    constructionType,
    setConstructionType,
  ] = useState<
    | 'Private Project'
    | 'Federal Project'
    | ''
  >('');

  const [
    status,
    setStatus,
  ] =
    useState<
      'active'
      | 'inactive'
    >('active');


  /*
  |--------------------------------------------------------------------------
  | Contract
  |--------------------------------------------------------------------------
  */

  const [
    businessUnit,
    setBusinessUnit,
  ] = useState('civil');

  const [
    contractType,
    setContractType,
  ] = useState('turn_key');

  const [
    contractAmount,
    setContractAmount,
  ] = useState('');

  const [
    pricingType,
    setPricingType,
  ] = useState('unit_rate');


  /*
  |--------------------------------------------------------------------------
  | Schedule
  |--------------------------------------------------------------------------
  */

  const [
    contractDate,
    setContractDate,
  ] = useState('');

  const [
    hasSiteHandover,
    setHasSiteHandover,
  ] =
    useState<YesNo>('No');

  const [
    siteHandoverDate,
    setSiteHandoverDate,
  ] = useState('');

  const [
    hasCommencement,
    setHasCommencement,
  ] =
    useState<YesNo>('No');

  const [
    commencementDate,
    setCommencementDate,
  ] = useState('');

  const [
    projectDuration,
    setProjectDuration,
  ] = useState('');

  const [
    durationType,
    setDurationType,
  ] =
    useState<
      | 'working_days'
      | 'calendar_days'
      | ''
    >('');

  const [
    holidays,
    setHolidays,
  ] = useState('');


  /*
  |--------------------------------------------------------------------------
  | Payment
  |--------------------------------------------------------------------------
  */

  const [
    paymentTerm,
    setPaymentTerm,
  ] =
    useState<
      | 'cash_on_delivery'
      | 'after_work_executed'
      | ''
    >('');

  const [
    hasAdvancePayment,
    setHasAdvancePayment,
  ] =
    useState<YesNo>('No');

  const [
    advancePercent,
    setAdvancePercent,
  ] = useState('');

  const [
    hasAdvanceRepayment,
    setHasAdvanceRepayment,
  ] =
    useState<YesNo>('No');

  const [
    advanceCompletePercent,
    setAdvanceCompletePercent,
  ] = useState('');

  const [
    advanceRepaymentPercent,
    setAdvanceRepaymentPercent,
  ] = useState('');

  const [
    advanceRepaymentStart,
    setAdvanceRepaymentStart,
  ] = useState('');

  const [
    interimPaymentSchedule,
    setInterimPaymentSchedule,
  ] = useState('');

  const [
    advanceDueDate,
    setAdvanceDueDate,
  ] = useState('');


  /*
  |--------------------------------------------------------------------------
  | Security / Bond
  |--------------------------------------------------------------------------
  */

  const [
    hasAdvanceBond,
    setHasAdvanceBond,
  ] =
    useState<YesNo>('No');

  const [
    advanceBondPercent,
    setAdvanceBondPercent,
  ] = useState('');

  const [
    advanceBondType,
    setAdvanceBondType,
  ] = useState('');

  const [
    advanceBondStart,
    setAdvanceBondStart,
  ] = useState('');

  const [
    advanceBondEnd,
    setAdvanceBondEnd,
  ] = useState('');

  const [
    hasPerformanceBond,
    setHasPerformanceBond,
  ] =
    useState<YesNo>('No');

  const [
    performanceBondPercent,
    setPerformanceBondPercent,
  ] = useState('');

  const [
    performanceBondType,
    setPerformanceBondType,
  ] = useState('');

  const [
    performanceBondStart,
    setPerformanceBondStart,
  ] = useState('');

  const [
    performanceBondEnd,
    setPerformanceBondEnd,
  ] = useState('');


  /*
  |--------------------------------------------------------------------------
  | Others
  |--------------------------------------------------------------------------
  */

  const [
    hasPriceAdjustment,
    setHasPriceAdjustment,
  ] =
    useState<YesNo>('No');

  const [
    priceAdjustmentPercent,
    setPriceAdjustmentPercent,
  ] = useState('');

  const [
    hasRetention,
    setHasRetention,
  ] =
    useState<YesNo>('No');

  const [
    retentionPercent,
    setRetentionPercent,
  ] = useState('');

  const [
    hasPriceIndex,
    setHasPriceIndex,
  ] =
    useState<YesNo>('No');

  const [
    hasLiquidityDamage,
    setHasLiquidityDamage,
  ] =
    useState<YesNo>('No');

  const [
    liquidityPercent,
    setLiquidityPercent,
  ] = useState('');

  const [
    liquidityLimit,
    setLiquidityLimit,
  ] = useState('');

  const [
    minimumPaymentTime,
    setMinimumPaymentTime,
  ] = useState('');

  const [
    engineeringFacilities,
    setEngineeringFacilities,
  ] =
    useState<string[]>([]);


  /*
  |--------------------------------------------------------------------------
  | Options
  |--------------------------------------------------------------------------
  */

  const [
    customers,
    setCustomers,
  ] =
    useState<CustomerOption[]>([]);

  const [
    bids,
    setBids,
  ] =
    useState<BidOption[]>([]);

  const [
    workOrders,
    setWorkOrders,
  ] =
    useState<WorkOrderOption[]>([]);

  const [
    openSelect,
    setOpenSelect,
  ] =
    useState<string | null>(
      null
    );


  /*
  |--------------------------------------------------------------------------
  | Initial Data
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    const load =
      async () => {

        try {

          setLoadingOptions(true);

          const [
            number,
            customerList,
          ] =
            await Promise.all([
              projectsApi
                .nextNumber(),

              projectsApi
                .customerOptions(),
            ]);

          setProjectNo(
            number
          );

          setCustomers(
            customerList
          );

        } catch (error) {

          console.log(
            'CREATE PROJECT OPTIONS:',
            error
          );

        } finally {

          setLoadingOptions(
            false
          );

        }

      };

    load();

  }, []);


  /*
  |--------------------------------------------------------------------------
  | Source Options
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    if (!projectSource) {

      setBids([]);
      setWorkOrders([]);

      return;
    }

    const load =
      async () => {

        try {

          setSourceLoading(
            true
          );

          if (
            projectSource ===
            'Bid'
          ) {

            const data =
              await projectsApi
                .bidOptions();

            setBids(data);
            setWorkOrders([]);

          } else {

            const data =
              await projectsApi
                .workOrderOptions();

            setWorkOrders(data);
            setBids([]);

          }

        } catch (error) {

          console.log(
            'SOURCE OPTIONS:',
            error
          );

        } finally {

          setSourceLoading(
            false
          );

        }

      };

    load();

  }, [projectSource]);


  /*
  |--------------------------------------------------------------------------
  | Source Selection
  |--------------------------------------------------------------------------
  */

  const selectBid =
    (bid: BidOption) => {

      setBidReference(
        bid.value
      );

      setLocation(
        bid.place_of_project ??
        ''
      );

      setOpenSelect(null);

    };


  const selectWorkOrder =
    (
      workOrder:
        WorkOrderOption
    ) => {

      setWorkOrderNo(
        workOrder.work_order_no
      );

      setProjectName(
        workOrder.project ??
        ''
      );

      setProjectDescription(
        workOrder.type_of_work ??
        ''
      );

      setLocation(
        workOrder.work_location ??
        ''
      );

      setOpenSelect(null);

    };


  const selectCustomer =
    (
      customer:
        CustomerOption
    ) => {

      setCustomerId(
        customer.id
      );

      setEmployer(
        customer.name
      );

      setOpenSelect(null);

    };


  /*
  |--------------------------------------------------------------------------
  | Validation Per Step
  |--------------------------------------------------------------------------
  */

  const validateStep =
    (): boolean => {

      if (step === 0) {

        if (!projectSource) {
          return required(
            'Project source'
          );
        }

        if (
          projectSource ===
            'Bid' &&
          !bidReference
        ) {
          return required(
            'Bid reference'
          );
        }

        if (
          projectSource ===
            'Work Order' &&
          !workOrderNo
        ) {
          return required(
            'Work order'
          );
        }

        if (!projectName.trim()) {
          return required(
            'Project name'
          );
        }

        if (
          !projectDescription
            .trim()
        ) {
          return required(
            'Project description'
          );
        }

        if (!location.trim()) {
          return required(
            'Project location'
          );
        }

        if (!customerId) {
          return required(
            'Client/Employer'
          );
        }

        if (
          hasConsultant ===
            'Yes' &&
          !consultant.trim()
        ) {
          return required(
            'Consultant name'
          );
        }

        if (
          hasSpecifiedArea ===
            'Yes' &&
          !area.trim()
        ) {
          return required(
            'Specified area'
          );
        }

        if (!constructionType) {
          return required(
            'Construction project type'
          );
        }

      }


      if (step === 1) {

        if (!businessUnit) {
          return required(
            'Business unit'
          );
        }

        if (!contractType) {
          return required(
            'Contract type'
          );
        }

        if (
          !contractAmount ||
          Number(contractAmount) < 0
        ) {
          return required(
            'Contract amount'
          );
        }

        if (!pricingType) {
          return required(
            'Contract pricing type'
          );
        }

      }


      if (step === 2) {

        if (
          !validDate(
            contractDate
          )
        ) {
          return dateError(
            'Contract date'
          );
        }

        if (
          hasSiteHandover ===
            'Yes' &&
          !validDate(
            siteHandoverDate
          )
        ) {
          return dateError(
            'Site handover date'
          );
        }

        if (
          hasCommencement ===
            'Yes' &&
          !validDate(
            commencementDate
          )
        ) {
          return dateError(
            'Commencement date'
          );
        }

        if (
          Number(
            projectDuration
          ) < 1
        ) {
          return required(
            'Project duration'
          );
        }

        if (!durationType) {
          return required(
            'Duration type'
          );
        }

        if (
          durationType ===
            'working_days' &&
          holidays === ''
        ) {
          return required(
            'Number of holidays and weekends'
          );
        }

      }


      if (step === 3) {

        if (!paymentTerm) {
          return required(
            'Payment term'
          );
        }

        if (
          hasAdvancePayment ===
            'Yes' &&
          !validPercent(
            advancePercent
          )
        ) {
          return percentError(
            'Advance payment'
          );
        }

        if (
          hasAdvanceRepayment ===
          'Yes'
        ) {

          if (
            !validPercent(
              advanceCompletePercent
            )
          ) {
            return percentError(
              'Complete repayment'
            );
          }

          if (
            !validPercent(
              advanceRepaymentPercent
            )
          ) {
            return percentError(
              'Advance repayment'
            );
          }

          if (
            !advanceRepaymentStart
          ) {
            return required(
              'Advance repayment start'
            );
          }

        }

        if (
          Number(
            interimPaymentSchedule
          ) < 1
        ) {
          return required(
            'Interim payment schedule'
          );
        }

        if (
          !validDate(
            advanceDueDate
          )
        ) {
          return dateError(
            'Advance payment due date'
          );
        }

      }


      if (step === 4) {

        if (
          hasAdvanceBond ===
          'Yes'
        ) {

          if (
            !validPercent(
              advanceBondPercent
            )
          ) {
            return percentError(
              'Advance bond'
            );
          }

          if (
            !advanceBondType
          ) {
            return required(
              'Advance bond type'
            );
          }

          if (
            !validDate(
              advanceBondStart
            ) ||
            !validDate(
              advanceBondEnd
            )
          ) {
            return dateError(
              'Advance bond dates'
            );
          }

        }

        if (
          hasPerformanceBond ===
          'Yes'
        ) {

          if (
            !validPercent(
              performanceBondPercent
            )
          ) {
            return percentError(
              'Performance bond'
            );
          }

          if (
            !performanceBondType
          ) {
            return required(
              'Performance bond type'
            );
          }

          if (
            !validDate(
              performanceBondStart
            ) ||
            !validDate(
              performanceBondEnd
            )
          ) {
            return dateError(
              'Performance bond dates'
            );
          }

        }

      }


      if (step === 5) {

        if (
          hasPriceAdjustment ===
            'Yes' &&
          !validPercent(
            priceAdjustmentPercent
          )
        ) {
          return percentError(
            'Price adjustment'
          );
        }

        if (
          hasRetention ===
            'Yes' &&
          !validPercent(
            retentionPercent
          )
        ) {
          return percentError(
            'Retention'
          );
        }

        if (
          hasLiquidityDamage ===
          'Yes'
        ) {

          if (
            !validPercent(
              liquidityPercent
            )
          ) {
            return percentError(
              'Liquidity'
            );
          }

          if (
            Number(
              liquidityLimit
            ) < 0 ||
            liquidityLimit === ''
          ) {
            return required(
              'Liquidity limit'
            );
          }

        }

        if (
          Number(
            minimumPaymentTime
          ) < 1
        ) {
          return required(
            'Minimum payment time'
          );
        }

        if (
          engineeringFacilities
            .length === 0
        ) {
          Alert.alert(
            'Required Field',
            'Select at least one engineering facility.'
          );

          return false;
        }

      }

      return true;

    };


  /*
  |--------------------------------------------------------------------------
  | Navigation
  |--------------------------------------------------------------------------
  */

  const next =
    () => {

      if (!validateStep()) {
        return;
      }

      if (
        step <
        STEPS.length - 1
      ) {
        setStep(
          current =>
            current + 1
        );
      }

    };


  const previous =
    () => {

      if (step > 0) {

        setStep(
          current =>
            current - 1
        );

      } else {

        router.back();

      }

    };


  /*
  |--------------------------------------------------------------------------
  | Save
  |--------------------------------------------------------------------------
  */

  const save =
    async () => {

      if (
        saving ||
        !validateStep()
      ) {
        return;
      }

      if (
        !projectSource ||
        !constructionType ||
        !durationType ||
        !paymentTerm ||
        !customerId
      ) {
        return;
      }

      const payload:
        ProjectPayload = {

        project_source:
          projectSource,

        bid_reference:
          projectSource ===
          'Bid'
            ? bidReference
            : null,

        work_order_no:
          projectSource ===
          'Work Order'
            ? workOrderNo
            : null,

        project_name:
          projectName.trim(),

        project_name_letter:
          null,

        project_description:
          projectDescription.trim(),

        location:
          location.trim(),

        customer_id:
          customerId,

        has_consultant:
          hasConsultant,

        consultant:
          hasConsultant ===
          'Yes'
            ? consultant.trim()
            : null,

        has_specified_area:
          hasSpecifiedArea,

        area:
          hasSpecifiedArea ===
          'Yes'
            ? area.trim()
            : null,

        construction_project_type:
          constructionType,

        business_unit:
          businessUnit,

        contract_type:
          contractType,

        contract_amount_before_vat:
          Number(
            contractAmount
          ),

        contract_pricing_type:
          pricingType,

        contract_date:
          contractDate,

        has_site_handover_date:
          hasSiteHandover,

        site_handover_date:
          hasSiteHandover ===
          'Yes'
            ? siteHandoverDate
            : null,

        has_commencement_date:
          hasCommencement,

        commencement_date:
          hasCommencement ===
          'Yes'
            ? commencementDate
            : null,

        project_duration:
          Number(
            projectDuration
          ),

        duration_type:
          durationType,

        no_of_holidays:
          durationType ===
          'working_days'
            ? Number(
                holidays
              )
            : null,

        payment_term:
          paymentTerm,

        has_advance_payment:
          hasAdvancePayment,

        advance_percent:
          hasAdvancePayment ===
          'Yes'
            ? Number(
                advancePercent
              )
            : null,

        has_advance_repayment:
          hasAdvanceRepayment,

        advance_repayment_complete_percent:
          hasAdvanceRepayment ===
          'Yes'
            ? Number(
                advanceCompletePercent
              )
            : null,

        advance_repayment_percent:
          hasAdvanceRepayment ===
          'Yes'
            ? Number(
                advanceRepaymentPercent
              )
            : null,

        advance_repayment_start:
          hasAdvanceRepayment ===
          'Yes'
            ? advanceRepaymentStart
            : null,

        interim_payment_schedule:
          Number(
            interimPaymentSchedule
          ),

        advance_payment_due_date:
          advanceDueDate,

        has_advance_bond:
          hasAdvanceBond,

        advance_bond_percent:
          hasAdvanceBond ===
          'Yes'
            ? Number(
                advanceBondPercent
              )
            : null,

        advance_bond_type:
          hasAdvanceBond ===
          'Yes'
            ? advanceBondType
            : null,

        advance_bond_start_date:
          hasAdvanceBond ===
          'Yes'
            ? advanceBondStart
            : null,

        advance_bond_end_date:
          hasAdvanceBond ===
          'Yes'
            ? advanceBondEnd
            : null,

        has_performance_bond:
          hasPerformanceBond,

        performance_bond_percent:
          hasPerformanceBond ===
          'Yes'
            ? Number(
                performanceBondPercent
              )
            : null,

        performance_bond_type:
          hasPerformanceBond ===
          'Yes'
            ? performanceBondType
            : null,

        performance_bond_start_date:
          hasPerformanceBond ===
          'Yes'
            ? performanceBondStart
            : null,

        performance_bond_end_date:
          hasPerformanceBond ===
          'Yes'
            ? performanceBondEnd
            : null,

        has_price_adjustment:
          hasPriceAdjustment,

        price_adjustment_percent:
          hasPriceAdjustment ===
          'Yes'
            ? Number(
                priceAdjustmentPercent
              )
            : null,

        has_retention:
          hasRetention,

        retention_percent:
          hasRetention ===
          'Yes'
            ? Number(
                retentionPercent
              )
            : null,

        has_price_index:
          hasPriceIndex,

        has_liquidity_damage:
          hasLiquidityDamage,

        liquidity_percent:
          hasLiquidityDamage ===
          'Yes'
            ? Number(
                liquidityPercent
              )
            : null,

        liquidity_limit:
          hasLiquidityDamage ===
          'Yes'
            ? Number(
                liquidityLimit
              )
            : null,

        minimum_payment_time:
          Number(
            minimumPaymentTime
          ),

        engineering_facilities:
          engineeringFacilities,

        status,
      };


      try {

        setSaving(true);

        const created =
          await projectsApi
            .create(payload);

        Alert.alert(
          'Project Created',
          `${created.project_no} has been created successfully.`,
          [
            {
              text:
                'View Project',

              onPress: () =>
                router.replace(
                  `/(app)/management/projects/${created.id}` as any
                ),
            },
          ]
        );

      } catch (error: any) {

        console.log(
          'CREATE PROJECT ERROR:',
          error?.response?.data ??
          error
        );

        Alert.alert(
          'Unable to Create Project',
          getApiError(
            error,
            'The project could not be created.'
          )
        );

      } finally {

        setSaving(false);

      }

    };


  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (
    <SafeAreaView
      style={
        styles.safeArea
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
          onPress={
            previous
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
            Add Project
          </Text>

          <Text
            style={
              styles.subtitle
            }
          >
            Step {step + 1} of {STEPS.length}
          </Text>
        </View>

      </View>


      {/* STEP INDICATOR */}

      <View
        style={
          styles.steps
        }
      >

        {STEPS.map(
          (
            value,
            index
          ) => (

            <View
              key={value}
              style={
                styles.stepItem
              }
            >

              <View
                style={[
                  styles.stepCircle,

                  index <= step &&
                    styles.stepActive,
                ]}
              >
                <Text
                  style={[
                    styles.stepNumber,

                    index <= step &&
                      styles.stepNumberActive,
                  ]}
                >
                  {index + 1}
                </Text>
              </View>

            </View>

          )
        )}

      </View>


      <Text
        style={
          styles.stepTitle
        }
      >
        {STEPS[step]}
      </Text>


      <ScrollView
        contentContainerStyle={
          styles.form
        }
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={
          false
        }
      >

        {/* ===============================================================
            STEP 1
        =============================================================== */}

        {step === 0 && (
          <>

            <Label
              title="Project Number"
            />

            <ReadOnlyBox
              value={
                loadingOptions
                  ? 'Loading...'
                  : projectNo ||
                    'Generated when saved'
              }
            />


            <Label
              title="Project Source"
              required
            />

            <ChoiceRow
              value={
                projectSource
              }
              options={[
                'Bid',
                'Work Order',
              ]}
              onChange={value => {

                setProjectSource(
                  value as
                    ProjectSource
                );

                setBidReference('');
                setWorkOrderNo('');

              }}
            />


            {projectSource ===
              'Bid' && (
              <>

                <Label
                  title="Bid Reference"
                  required
                />

                <SelectBox
                  value={
                    bids.find(
                      item =>
                        item.value ===
                        bidReference
                    )?.label
                    ?? ''
                  }
                  placeholder={
                    sourceLoading
                      ? 'Loading bids...'
                      : 'Select approved winning bid'
                  }
                  open={
                    openSelect ===
                    'bid'
                  }
                  onPress={() =>
                    setOpenSelect(
                      openSelect ===
                      'bid'
                        ? null
                        : 'bid'
                    )
                  }
                />

                {openSelect ===
                  'bid' && (

                  <OptionList>
                    {bids.map(
                      bid => (
                        <Option
                          key={
                            bid.value
                          }
                          label={
                            bid.label
                          }
                          onPress={() =>
                            selectBid(
                              bid
                            )
                          }
                        />
                      )
                    )}
                  </OptionList>

                )}

              </>
            )}


            {projectSource ===
              'Work Order' && (
              <>

                <Label
                  title="Work Order"
                  required
                />

                <SelectBox
                  value={
                    workOrders.find(
                      item =>
                        item.work_order_no ===
                        workOrderNo
                    )?.label ??
                    ''
                  }
                  placeholder={
                    sourceLoading
                      ? 'Loading work orders...'
                      : 'Select approved work order'
                  }
                  open={
                    openSelect ===
                    'workorder'
                  }
                  onPress={() =>
                    setOpenSelect(
                      openSelect ===
                      'workorder'
                        ? null
                        : 'workorder'
                    )
                  }
                />

                {openSelect ===
                  'workorder' && (

                  <OptionList>
                    {workOrders.map(
                      workOrder => (
                        <Option
                          key={
                            workOrder.work_order_no
                          }
                          label={
                            workOrder.label
                          }
                          onPress={() =>
                            selectWorkOrder(
                              workOrder
                            )
                          }
                        />
                      )
                    )}
                  </OptionList>

                )}

              </>
            )}


            <Label
              title="Project Name"
              required
            />

            <InputBox
              value={projectName}
              onChangeText={
                setProjectName
              }
              placeholder="Enter project name"
            />


            <Label
              title="Project Description"
              required
            />

            <TextArea
              value={
                projectDescription
              }
              onChangeText={
                setProjectDescription
              }
              placeholder="Enter project description"
            />


            <Label
              title="Project Location"
              required
            />

            <InputBox
              value={location}
              onChangeText={
                setLocation
              }
              placeholder="Enter project location"
            />


            <Label
              title="Client / Employer"
              required
            />

            <SelectBox
              value={employer}
              placeholder={
                loadingOptions
                  ? 'Loading customers...'
                  : 'Select client'
              }
              open={
                openSelect ===
                'customer'
              }
              onPress={() =>
                setOpenSelect(
                  openSelect ===
                  'customer'
                    ? null
                    : 'customer'
                )
              }
            />

            {openSelect ===
              'customer' && (

              <OptionList>
                {customers.map(
                  customer => (
                    <Option
                      key={
                        customer.id
                      }
                      label={
                        customer.label
                      }
                      onPress={() =>
                        selectCustomer(
                          customer
                        )
                      }
                    />
                  )
                )}
              </OptionList>

            )}


            <Label
              title="Consultant?"
              required
            />

            <YesNoField
              value={
                hasConsultant
              }
              onChange={value => {

                setHasConsultant(
                  value
                );

                if (
                  value === 'No'
                ) {
                  setConsultant('');
                }

              }}
            />


            {hasConsultant ===
              'Yes' && (
              <>
                <Label
                  title="Consultant Name"
                  required
                />

                <InputBox
                  value={
                    consultant
                  }
                  onChangeText={
                    setConsultant
                  }
                  placeholder="Enter consultant name"
                />
              </>
            )}


            <Label
              title="Specified Area?"
              required
            />

            <YesNoField
              value={
                hasSpecifiedArea
              }
              onChange={value => {

                setHasSpecifiedArea(
                  value
                );

                if (
                  value === 'No'
                ) {
                  setArea('');
                }

              }}
            />


            {hasSpecifiedArea ===
              'Yes' && (
              <>
                <Label
                  title="Specified Area"
                  required
                />

                <InputBox
                  value={area}
                  onChangeText={
                    setArea
                  }
                  placeholder="Example: 2500 m²"
                />
              </>
            )}


            <Label
              title="Construction Project Type"
              required
            />

            <ChoiceRow
              value={
                constructionType
              }
              options={[
                'Private Project',
                'Federal Project',
              ]}
              onChange={value =>
                setConstructionType(
                  value as any
                )
              }
            />


            <Label
              title="Status"
              required
            />

            <ChoiceRow
              value={status}
              options={[
                'active',
                'inactive',
              ]}
              labels={[
                'Active',
                'Inactive',
              ]}
              onChange={value =>
                setStatus(
                  value as any
                )
              }
            />

          </>
        )}


        {/* ===============================================================
            STEP 2 - CONTRACT
        =============================================================== */}

        {step === 1 && (
          <>

            <Label
              title="Business Unit"
              required
            />

            <SimpleDropdown
              id="businessUnit"
              value={businessUnit}
              options={businessUnits}
              openSelect={openSelect}
              setOpenSelect={setOpenSelect}
              onChange={setBusinessUnit}
            />


            <Label
              title="Contract Type"
              required
            />

            <SimpleDropdown
              id="contractType"
              value={contractType}
              options={contractTypes}
              openSelect={openSelect}
              setOpenSelect={setOpenSelect}
              onChange={setContractType}
            />


            <Label
              title="Main Contract Amount B/VAT"
              required
            />

            <NumberInput
              value={
                contractAmount
              }
              onChangeText={
                setContractAmount
              }
              placeholder="Enter contract amount"
              decimal
            />


            <Label
              title="Contract Pricing Type"
              required
            />

            <SimpleDropdown
              id="pricing"
              value={pricingType}
              options={pricingTypes}
              openSelect={openSelect}
              setOpenSelect={setOpenSelect}
              onChange={setPricingType}
            />

          </>
        )}


        {/* ===============================================================
            STEP 3 - SCHEDULE
        =============================================================== */}

        {step === 2 && (
          <>

            <DateField
              label="Contract Date"
              required
              value={
                contractDate
              }
              onChange={
                setContractDate
              }
            />


            <Label
              title="Specified Site Handover Date?"
              required
            />

            <YesNoField
              value={
                hasSiteHandover
              }
              onChange={value => {

                setHasSiteHandover(
                  value
                );

                if (
                  value === 'No'
                ) {
                  setSiteHandoverDate('');
                }

              }}
            />


            {hasSiteHandover ===
              'Yes' && (

              <DateField
                label="Date of Site Handover"
                required
                value={
                  siteHandoverDate
                }
                onChange={
                  setSiteHandoverDate
                }
              />

            )}


            <Label
              title="Commencement Date?"
              required
            />

            <YesNoField
              value={
                hasCommencement
              }
              onChange={value => {

                setHasCommencement(
                  value
                );

                if (
                  value === 'No'
                ) {
                  setCommencementDate('');
                }

              }}
            />


            {hasCommencement ===
              'Yes' && (

              <DateField
                label="Commencement Date"
                required
                value={
                  commencementDate
                }
                onChange={
                  setCommencementDate
                }
              />

            )}


            <Label
              title="Project Duration"
              required
            />

            <NumberInput
              value={
                projectDuration
              }
              onChangeText={
                setProjectDuration
              }
              placeholder="Enter number of days"
            />


            <Label
              title="Duration Type"
              required
            />

            <ChoiceRow
              value={
                durationType
              }
              options={[
                'working_days',
                'calendar_days',
              ]}
              labels={[
                'Working Days',
                'Calendar Days',
              ]}
              onChange={value => {

                setDurationType(
                  value as any
                );

                if (
                  value ===
                  'calendar_days'
                ) {
                  setHolidays('');
                }

              }}
            />


            {durationType ===
              'working_days' && (
              <>
                <Label
                  title="No. of Holidays and Weekends"
                  required
                />

                <NumberInput
                  value={
                    holidays
                  }
                  onChangeText={
                    setHolidays
                  }
                  placeholder="Enter number"
                />
              </>
            )}

          </>
        )}


        {/* ===============================================================
            STEP 4 - PAYMENT
        =============================================================== */}

        {step === 3 && (
          <>

            <Label
              title="Payment Term"
              required
            />

            <ChoiceRow
              value={
                paymentTerm
              }
              options={[
                'cash_on_delivery',
                'after_work_executed',
              ]}
              labels={[
                'Cash on Delivery',
                'After Work Executed',
              ]}
              onChange={value =>
                setPaymentTerm(
                  value as any
                )
              }
            />


            <Label
              title="Advance Payment?"
              required
            />

            <YesNoField
              value={
                hasAdvancePayment
              }
              onChange={
                setHasAdvancePayment
              }
            />


            {hasAdvancePayment ===
              'Yes' && (
              <>
                <Label
                  title="Advance Payment Percentage"
                  required
                />

                <PercentInput
                  value={
                    advancePercent
                  }
                  onChangeText={
                    setAdvancePercent
                  }
                />
              </>
            )}


            <Label
              title="Advance Repayment?"
              required
            />

            <YesNoField
              value={
                hasAdvanceRepayment
              }
              onChange={
                setHasAdvanceRepayment
              }
            />


            {hasAdvanceRepayment ===
              'Yes' && (
              <>

                <Label
                  title="% of Project Where Advance Must Be Repaid Completely"
                  required
                />

                <PercentInput
                  value={
                    advanceCompletePercent
                  }
                  onChangeText={
                    setAdvanceCompletePercent
                  }
                />


                <Label
                  title="Advance Repayment Percentage"
                  required
                />

                <PercentInput
                  value={
                    advanceRepaymentPercent
                  }
                  onChangeText={
                    setAdvanceRepaymentPercent
                  }
                />


                <Label
                  title="Advance Repayment Start @"
                  required
                />

                <SimpleDropdown
                  id="repaymentStart"
                  value={
                    advanceRepaymentStart
                  }
                  options={
                    repaymentStarts
                  }
                  openSelect={
                    openSelect
                  }
                  setOpenSelect={
                    setOpenSelect
                  }
                  onChange={
                    setAdvanceRepaymentStart
                  }
                />

              </>
            )}


            <Label
              title="Interim Payment Schedule"
              required
            />

            <NumberInput
              value={
                interimPaymentSchedule
              }
              onChangeText={
                setInterimPaymentSchedule
              }
              placeholder="Enter payment schedule"
            />


            <DateField
              label="Advance Payment Shall Be Made Up To"
              required
              value={
                advanceDueDate
              }
              onChange={
                setAdvanceDueDate
              }
            />

          </>
        )}


        {/* ===============================================================
            STEP 5 - SECURITY
        =============================================================== */}

        {step === 4 && (
          <>

            <Label
              title="Advance Bond"
              required
            />

            <YesNoField
              value={
                hasAdvanceBond
              }
              onChange={
                setHasAdvanceBond
              }
            />


            {hasAdvanceBond ===
              'Yes' && (
              <>

                <Label
                  title="Advance Bond Percentage"
                  required
                />

                <PercentInput
                  value={
                    advanceBondPercent
                  }
                  onChangeText={
                    setAdvanceBondPercent
                  }
                />


                <Label
                  title="Bond Type"
                  required
                />

                <SimpleDropdown
                  id="advanceBondType"
                  value={
                    advanceBondType
                  }
                  options={
                    bondTypes
                  }
                  openSelect={
                    openSelect
                  }
                  setOpenSelect={
                    setOpenSelect
                  }
                  onChange={
                    setAdvanceBondType
                  }
                />


                <DateField
                  label="Bond Start Date"
                  required
                  value={
                    advanceBondStart
                  }
                  onChange={
                    setAdvanceBondStart
                  }
                />


                <DateField
                  label="Bond End Date"
                  required
                  value={
                    advanceBondEnd
                  }
                  onChange={
                    setAdvanceBondEnd
                  }
                />

              </>
            )}


            <Label
              title="Performance Bond"
              required
            />

            <YesNoField
              value={
                hasPerformanceBond
              }
              onChange={
                setHasPerformanceBond
              }
            />


            {hasPerformanceBond ===
              'Yes' && (
              <>

                <Label
                  title="Performance Bond Percentage"
                  required
                />

                <PercentInput
                  value={
                    performanceBondPercent
                  }
                  onChangeText={
                    setPerformanceBondPercent
                  }
                />


                <Label
                  title="Performance Type"
                  required
                />

                <SimpleDropdown
                  id="performanceBondType"
                  value={
                    performanceBondType
                  }
                  options={
                    bondTypes
                  }
                  openSelect={
                    openSelect
                  }
                  setOpenSelect={
                    setOpenSelect
                  }
                  onChange={
                    setPerformanceBondType
                  }
                />


                <DateField
                  label="Performance Start Date"
                  required
                  value={
                    performanceBondStart
                  }
                  onChange={
                    setPerformanceBondStart
                  }
                />


                <DateField
                  label="Performance End Date"
                  required
                  value={
                    performanceBondEnd
                  }
                  onChange={
                    setPerformanceBondEnd
                  }
                />

              </>
            )}

          </>
        )}


        {/* ===============================================================
            STEP 6 - OTHERS
        =============================================================== */}

        {step === 5 && (
          <>

            <Label
              title="Price Adjustment Allowed?"
              required
            />

            <YesNoField
              value={
                hasPriceAdjustment
              }
              onChange={
                setHasPriceAdjustment
              }
            />


            {hasPriceAdjustment ===
              'Yes' && (
              <>
                <Label
                  title="Price Adjustment Percentage"
                  required
                />

                <PercentInput
                  value={
                    priceAdjustmentPercent
                  }
                  onChangeText={
                    setPriceAdjustmentPercent
                  }
                />
              </>
            )}


            <Label
              title="Retention?"
              required
            />

            <YesNoField
              value={
                hasRetention
              }
              onChange={
                setHasRetention
              }
            />


            {hasRetention ===
              'Yes' && (
              <>
                <Label
                  title="Retention Percentage"
                  required
                />

                <PercentInput
                  value={
                    retentionPercent
                  }
                  onChangeText={
                    setRetentionPercent
                  }
                />
              </>
            )}


            <Label
              title="Does It Have Price Index?"
              required
            />

            <YesNoField
              value={
                hasPriceIndex
              }
              onChange={
                setHasPriceIndex
              }
            />


            <Label
              title="Liquidity Damage?"
              required
            />

            <YesNoField
              value={
                hasLiquidityDamage
              }
              onChange={
                setHasLiquidityDamage
              }
            />


            {hasLiquidityDamage ===
              'Yes' && (
              <>

                <Label
                  title="Liquidity Percentage"
                  required
                />

                <PercentInput
                  value={
                    liquidityPercent
                  }
                  onChangeText={
                    setLiquidityPercent
                  }
                />


                <Label
                  title="Limit of Liquidity Damage"
                  required
                />

                <NumberInput
                  value={
                    liquidityLimit
                  }
                  onChangeText={
                    setLiquidityLimit
                  }
                  placeholder="Enter liquidity damage limit"
                  decimal
                />

              </>
            )}


            <Label
              title="Minimum Time Within Which Payment Must Be Made After Certificate"
              required
            />

            <NumberInput
              value={
                minimumPaymentTime
              }
              onChangeText={
                setMinimumPaymentTime
              }
              placeholder="Enter number of days"
            />


            <Label
              title="Engineering Facility"
              required
            />

            <View
              style={
                styles.facilities
              }
            >

              {engineeringOptions.map(
                option => {

                  const selected =
                    engineeringFacilities
                      .includes(
                        option.value
                      );

                  return (

                    <Pressable
                      key={
                        option.value
                      }
                      onPress={() => {

                        setEngineeringFacilities(
                          current =>
                            selected
                              ? current.filter(
                                  item =>
                                    item !==
                                    option.value
                                )
                              : [
                                  ...current,
                                  option.value,
                                ]
                        );

                      }}
                      style={[
                        styles.facilityButton,

                        selected &&
                          styles.facilitySelected,
                      ]}
                    >

                      <Ionicons
                        name={
                          selected
                            ? 'checkbox-outline'
                            : 'square-outline'
                        }
                        size={19}
                        color={
                          selected
                            ? Colors.primary
                            : Colors.textMuted
                        }
                      />

                      <Text
                        style={[
                          styles.facilityText,

                          selected &&
                            styles.facilityTextSelected,
                        ]}
                      >
                        {option.label}
                      </Text>

                    </Pressable>

                  );

                }
              )}

            </View>

          </>
        )}


        {/* ACTION BUTTONS */}

        <View
          style={
            styles.actions
          }
        >

          <Pressable
            onPress={
              previous
            }
            style={
              styles.previousButton
            }
          >
            <Text
              style={
                styles.previousText
              }
            >
              {
                step === 0
                  ? 'Cancel'
                  : 'Previous'
              }
            </Text>
          </Pressable>


          {step <
            STEPS.length - 1 ? (

            <Pressable
              onPress={
                next
              }
              style={
                styles.nextButton
              }
            >
              <Text
                style={
                  styles.nextText
                }
              >
                Next
              </Text>

              <Ionicons
                name="arrow-forward"
                size={18}
                color="#FFFFFF"
              />
            </Pressable>

          ) : (

            <Pressable
              disabled={
                saving
              }
              onPress={
                save
              }
              style={[
                styles.nextButton,

                saving &&
                  styles.disabled,
              ]}
            >

              {saving ? (

                <ActivityIndicator
                  color="#FFFFFF"
                />

              ) : (

                <>
                  <Ionicons
                    name="save-outline"
                    size={18}
                    color="#FFFFFF"
                  />

                  <Text
                    style={
                      styles.nextText
                    }
                  >
                    Save Project
                  </Text>
                </>

              )}

            </Pressable>

          )}

        </View>

      </ScrollView>

    </SafeAreaView>
  );
}


/*
|--------------------------------------------------------------------------
| Components
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


function InputBox(
  props: any
) {

  return (
    <TextInput
      {...props}
      placeholderTextColor={
        Colors.textMuted
      }
      style={
        styles.input
      }
    />
  );
}


function NumberInput({
  decimal = false,
  ...props
}: any) {

  return (
    <TextInput
      {...props}
      keyboardType={
        decimal
          ? 'decimal-pad'
          : 'number-pad'
      }
      placeholderTextColor={
        Colors.textMuted
      }
      style={
        styles.input
      }
    />
  );
}


function PercentInput(
  props: any
) {

  return (
    <View
      style={
        styles.percentBox
      }
    >
      <TextInput
        {...props}
        keyboardType="decimal-pad"
        placeholder="0 - 100"
        placeholderTextColor={
          Colors.textMuted
        }
        style={
          styles.percentInput
        }
      />

      <Text
        style={
          styles.percentSign
        }
      >
        %
      </Text>
    </View>
  );
}


function TextArea(
  props: any
) {

  return (
    <TextInput
      {...props}
      multiline
      maxLength={5000}
      textAlignVertical="top"
      placeholderTextColor={
        Colors.textMuted
      }
      style={
        styles.textArea
      }
    />
  );
}


function ReadOnlyBox({
  value,
}: {
  value: string;
}) {

  return (
    <View
      style={
        styles.readOnly
      }
    >
      <Ionicons
        name="lock-closed-outline"
        size={16}
        color={
          Colors.textMuted
        }
      />

      <Text
        style={
          styles.readOnlyText
        }
      >
        {value}
      </Text>
    </View>
  );
}


function YesNoField({
  value,
  onChange,
}: {
  value: YesNo;
  onChange:
    (value: YesNo) => void;
}) {

  return (
    <ChoiceRow
      value={value}
      options={[
        'Yes',
        'No',
      ]}
      onChange={value =>
        onChange(
          value as YesNo
        )
      }
    />
  );
}


function ChoiceRow({
  value,
  options,
  labels,
  onChange,
}: {
  value: string;
  options: string[];
  labels?: string[];
  onChange:
    (value: string) => void;
}) {

  return (
    <View
      style={
        styles.choiceRow
      }
    >

      {options.map(
        (
          option,
          index
        ) => {

          const selected =
            value === option;

          return (
            <Pressable
              key={option}
              onPress={() =>
                onChange(option)
              }
              style={[
                styles.choice,

                selected &&
                  styles.choiceSelected,
              ]}
            >
              <Text
                style={[
                  styles.choiceText,

                  selected &&
                    styles.choiceTextSelected,
                ]}
              >
                {labels?.[index] ??
                  option}
              </Text>
            </Pressable>
          );

        }
      )}

    </View>
  );
}


function DateField({
  label,
  required,
  value,
  onChange,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange:
    (value: string) => void;
}) {

  return (
    <>
      <Label
        title={label}
        required={required}
      />

      <View
        style={
          styles.dateBox
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
            onChange
          }
          placeholder="YYYY-MM-DD"
          placeholderTextColor={
            Colors.textMuted
          }
          keyboardType="numbers-and-punctuation"
          maxLength={10}
          style={
            styles.dateInput
          }
        />
      </View>
    </>
  );
}


function SelectBox({
  value,
  placeholder,
  open,
  onPress,
}: {
  value: string;
  placeholder: string;
  open: boolean;
  onPress: () => void;
}) {

  return (
    <Pressable
      onPress={
        onPress
      }
      style={[
        styles.selectBox,

        open &&
          styles.selectOpen,
      ]}
    >
      <Text
        style={[
          styles.selectText,

          !value &&
            styles.placeholder,
        ]}
        numberOfLines={2}
      >
        {value || placeholder}
      </Text>

      <Ionicons
        name={
          open
            ? 'chevron-up'
            : 'chevron-down'
        }
        size={17}
        color={
          Colors.textMuted
        }
      />
    </Pressable>
  );
}


function OptionList({
  children,
}: {
  children:
    React.ReactNode;
}) {

  return (
    <View
      style={
        styles.optionList
      }
    >
      <ScrollView
        nestedScrollEnabled
        style={{
          maxHeight: 240,
        }}
      >
        {children}
      </ScrollView>
    </View>
  );
}


function Option({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {

  return (
    <Pressable
      style={
        styles.option
      }
      onPress={
        onPress
      }
    >
      <Text
        style={
          styles.optionText
        }
      >
        {label}
      </Text>
    </Pressable>
  );
}


function SimpleDropdown({
  id,
  value,
  options,
  openSelect,
  setOpenSelect,
  onChange,
}: {
  id: string;
  value: string;
  options: {
    label: string;
    value: string;
  }[];
  openSelect:
    string | null;
  setOpenSelect:
    (value:
      string | null
    ) => void;
  onChange:
    (value: string) => void;
}) {

  const selected =
    options.find(
      option =>
        option.value ===
        value
    );

  const open =
    openSelect === id;

  return (
    <>
      <SelectBox
        value={
          selected?.label ??
          ''
        }
        placeholder="Select"
        open={open}
        onPress={() =>
          setOpenSelect(
            open
              ? null
              : id
          )
        }
      />

      {open && (
        <OptionList>
          {options.map(
            option => (
              <Option
                key={
                  option.value
                }
                label={
                  option.label
                }
                onPress={() => {
                  onChange(
                    option.value
                  );
                  setOpenSelect(
                    null
                  );
                }}
              />
            )
          )}
        </OptionList>
      )}
    </>
  );
}


/*
|--------------------------------------------------------------------------
| Validation Helpers
|--------------------------------------------------------------------------
*/

function required(
  field: string
) {

  Alert.alert(
    'Required Field',
    `${field} is required.`
  );

  return false;
}


function dateError(
  field: string
) {

  Alert.alert(
    'Invalid Date',
    `${field} must use YYYY-MM-DD format.`
  );

  return false;
}


function percentError(
  field: string
) {

  Alert.alert(
    'Invalid Percentage',
    `${field} percentage must be between 0 and 100.`
  );

  return false;
}


function validPercent(
  value: string
) {

  if (value === '') {
    return false;
  }

  const number =
    Number(value);

  return (
    !Number.isNaN(number) &&
    number >= 0 &&
    number <= 100
  );
}


function validDate(
  value: string
) {

  if (
    !/^\d{4}-\d{2}-\d{2}$/
      .test(value)
  ) {
    return false;
  }

  const [
    year,
    month,
    day,
  ] =
    value
      .split('-')
      .map(Number);

  const date =
    new Date(
      year,
      month - 1,
      day
    );

  return (
    date.getFullYear() ===
      year &&
    date.getMonth() ===
      month - 1 &&
    date.getDate() ===
      day
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

    header: {
      paddingHorizontal: 18,
      paddingTop: 12,

      flexDirection: 'row',
      alignItems: 'center',
    },

    backButton: {
      width: 43,
      height: 43,

      alignItems: 'center',
      justifyContent: 'center',

      borderRadius: 14,

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

    steps: {
      marginTop: 20,
      paddingHorizontal: 18,

      flexDirection: 'row',
      justifyContent:
        'space-between',
    },

    stepItem: {
      flex: 1,
      alignItems: 'center',
    },

    stepCircle: {
      width: 29,
      height: 29,

      alignItems: 'center',
      justifyContent: 'center',

      borderRadius: 10,

      backgroundColor:
        Colors.surface,

      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    stepActive: {
      backgroundColor:
        Colors.primary,
      borderColor:
        Colors.primary,
    },

    stepNumber: {
      fontSize: 9,
      fontFamily:
        Fonts.bold,
      color:
        Colors.textMuted,
    },

    stepNumberActive: {
      color: '#FFFFFF',
    },

    stepTitle: {
      paddingHorizontal: 18,
      marginTop: 15,

      fontSize: 17,
      fontFamily:
        Fonts.extraBold,

      color:
        Colors.text,
    },

    form: {
      paddingHorizontal: 18,
      paddingBottom: 50,
    },

    labelRow: {
      marginTop: 18,
      marginBottom: 7,

      flexDirection: 'row',
    },

    label: {
      fontSize: 11,
      fontFamily:
        Fonts.semiBold,
      color:
        Colors.text,
    },

    required: {
      marginLeft: 3,
      color:
        Colors.danger,
    },

    input: {
      minHeight: 52,
      paddingHorizontal: 14,

      borderRadius: 14,

      backgroundColor:
        Colors.surface,

      borderWidth: 1,
      borderColor:
        Colors.border,

      fontSize: 12,
      fontFamily:
        Fonts.regular,

      color:
        Colors.text,
    },

    textArea: {
      minHeight: 120,

      padding: 14,

      borderRadius: 14,

      backgroundColor:
        Colors.surface,

      borderWidth: 1,
      borderColor:
        Colors.border,

      fontSize: 12,
      lineHeight: 19,

      fontFamily:
        Fonts.regular,

      color:
        Colors.text,
    },

    readOnly: {
      minHeight: 52,

      paddingHorizontal: 14,

      flexDirection: 'row',
      alignItems: 'center',

      borderRadius: 14,

      backgroundColor:
        Colors.surface,

      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    readOnlyText: {
      marginLeft: 9,

      fontSize: 11,
      fontFamily:
        Fonts.medium,

      color:
        Colors.textSecondary,
    },

    choiceRow: {
      flexDirection: 'row',
      gap: 8,
    },

    choice: {
      flex: 1,

      minHeight: 48,

      paddingHorizontal: 8,

      alignItems: 'center',
      justifyContent: 'center',

      borderRadius: 13,

      backgroundColor:
        Colors.surface,

      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    choiceSelected: {
      backgroundColor:
        Colors.primaryLight,

      borderColor:
        Colors.primary,
    },

    choiceText: {
      textAlign: 'center',

      fontSize: 10,

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

    selectBox: {
      minHeight: 52,

      paddingHorizontal: 14,

      flexDirection: 'row',
      alignItems: 'center',

      borderRadius: 14,

      backgroundColor:
        Colors.surface,

      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    selectOpen: {
      borderColor:
        Colors.primary,
    },

    selectText: {
      flex: 1,

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

    optionList: {
      marginTop: 6,

      overflow: 'hidden',

      borderRadius: 13,

      backgroundColor:
        Colors.surface,

      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    option: {
      minHeight: 46,

      paddingHorizontal: 14,

      justifyContent: 'center',

      borderBottomWidth: 1,
      borderBottomColor:
        Colors.border,
    },

    optionText: {
      fontSize: 10,
      lineHeight: 15,

      fontFamily:
        Fonts.medium,

      color:
        Colors.text,
    },

    dateBox: {
      minHeight: 52,

      paddingHorizontal: 14,

      flexDirection: 'row',
      alignItems: 'center',

      borderRadius: 14,

      backgroundColor:
        Colors.surface,

      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    dateInput: {
      flex: 1,

      marginLeft: 9,

      fontSize: 12,

      fontFamily:
        Fonts.regular,

      color:
        Colors.text,
    },

    percentBox: {
      minHeight: 52,

      paddingHorizontal: 14,

      flexDirection: 'row',
      alignItems: 'center',

      borderRadius: 14,

      backgroundColor:
        Colors.surface,

      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    percentInput: {
      flex: 1,

      fontSize: 12,
      fontFamily:
        Fonts.regular,

      color:
        Colors.text,
    },

    percentSign: {
      fontSize: 12,
      fontFamily:
        Fonts.bold,

      color:
        Colors.textSecondary,
    },

    facilities: {
      gap: 8,
    },

    facilityButton: {
      minHeight: 47,

      paddingHorizontal: 13,

      flexDirection: 'row',
      alignItems: 'center',

      borderRadius: 13,

      backgroundColor:
        Colors.surface,

      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    facilitySelected: {
      backgroundColor:
        Colors.primaryLight,

      borderColor:
        Colors.primary,
    },

    facilityText: {
      marginLeft: 8,

      fontSize: 10,
      fontFamily:
        Fonts.medium,

      color:
        Colors.textSecondary,
    },

    facilityTextSelected: {
      color:
        Colors.primary,

      fontFamily:
        Fonts.bold,
    },

    actions: {
      marginTop: 30,

      flexDirection: 'row',

      gap: 10,
    },

    previousButton: {
      flex: 1,
      height: 52,

      alignItems: 'center',
      justifyContent: 'center',

      borderRadius: 14,

      backgroundColor:
        Colors.surface,

      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    previousText: {
      fontSize: 11,

      fontFamily:
        Fonts.bold,

      color:
        Colors.textSecondary,
    },

    nextButton: {
      flex: 1.3,
      height: 52,

      flexDirection: 'row',

      alignItems: 'center',
      justifyContent: 'center',

      gap: 7,

      borderRadius: 14,

      backgroundColor:
        Colors.primary,
    },

    nextText: {
      fontSize: 11,

      fontFamily:
        Fonts.bold,

      color: '#FFFFFF',
    },

    disabled: {
      opacity: 0.55,
    },

  });
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
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

import {
  useEffect,
  useState,
} from 'react';

import { Colors } from '../../../../../constants/colors';
import { Fonts } from '../../../../../constants/fonts';

import {
  Bank,
  BankPayload,
  BankStatus,
  YesNo,
  banksApi,
} from '../../../../../api/banksApi';


export default function EditBankScreen() {

  const { id } =
  useLocalSearchParams<{
    id: string;
  }>();

const bankId =
  Number(id);

  const [
    bank,
    setBank,
  ] = useState<Bank | null>(null);


  /*
  |--------------------------------------------------------------------------
  | Basic Information
  |--------------------------------------------------------------------------
  */

  const [bankName, setBankName] =
    useState('');

  const [
    originalBankName,
    setOriginalBankName,
  ] = useState('');

  const [accountNo, setAccountNo] =
    useState('');

  const [branch, setBranch] =
    useState('');

  const [
    contactAddress,
    setContactAddress,
  ] = useState('');


  /*
  |--------------------------------------------------------------------------
  | Financial Setup
  |--------------------------------------------------------------------------
  */

  const [
    beginningAmount,
    setBeginningAmount,
  ] = useState('');

  const [
    beginningAmountLeft,
    setBeginningAmountLeft,
  ] = useState('');

  const [
    minimumAmount,
    setMinimumAmount,
  ] = useState('');

  const [
    transferRate,
    setTransferRate,
  ] = useState('');


  /*
  |--------------------------------------------------------------------------
  | Overdraft
  |--------------------------------------------------------------------------
  */

  const [
    odAvailable,
    setOdAvailable,
  ] = useState<YesNo>('No');

  const [
    odAmount,
    setOdAmount,
  ] = useState('');

  const [
    odAmountLeft,
    setOdAmountLeft,
  ] = useState('');

  const [
    odLimit,
    setOdLimit,
  ] = useState('');

  const [
    odStatus,
    setOdStatus,
  ] = useState('');

  const [
    odStartDate,
    setOdStartDate,
  ] = useState('');

  const [
    odEndDate,
    setOdEndDate,
  ] = useState('');


  /*
  |--------------------------------------------------------------------------
  | Term Loan
  |--------------------------------------------------------------------------
  */

  const [
    termLoan,
    setTermLoan,
  ] = useState<YesNo>('No');

  const [
    termLoanAmount,
    setTermLoanAmount,
  ] = useState('');

  const [
    loanStatus,
    setLoanStatus,
  ] = useState('');

  const [
    termLoanStartDate,
    setTermLoanStartDate,
  ] = useState('');

  const [
    termLoanEndDate,
    setTermLoanEndDate,
  ] = useState('');

  const [
    repaymentAmount,
    setRepaymentAmount,
  ] = useState('');

  const [
    repaymentAmountLeft,
    setRepaymentAmountLeft,
  ] = useState('');

  const [
    period,
    setPeriod,
  ] = useState('');


  /*
  |--------------------------------------------------------------------------
  | Term Loan Relief
  |--------------------------------------------------------------------------
  */

  const [
    termLoanRelief,
    setTermLoanRelief,
  ] = useState<YesNo>('No');

  const [
    reliefStartDate,
    setReliefStartDate,
  ] = useState('');

  const [
    reliefEndDate,
    setReliefEndDate,
  ] = useState('');


  /*
  |--------------------------------------------------------------------------
  | Other Information
  |--------------------------------------------------------------------------
  */

  const [
    ethiopianDate,
    setEthiopianDate,
  ] = useState('');

  const [
    dateRegistered,
    setDateRegistered,
  ] = useState('');

  const [
    cobBalance,
    setCobBalance,
  ] = useState('');

  const [
    lastActivity,
    setLastActivity,
  ] = useState('');

  const [
    suggestion,
    setSuggestion,
  ] = useState('');

  const [
    endBalance,
    setEndBalance,
  ] = useState('');

  const [
    creditSuggestion,
    setCreditSuggestion,
  ] = useState('');

  const [
    category,
    setCategory,
  ] = useState('');

  const [
    startMonth,
    setStartMonth,
  ] = useState('');


  /*
  |--------------------------------------------------------------------------
  | Status / Loading
  |--------------------------------------------------------------------------
  */

  const [
    status,
    setStatus,
  ] = useState<BankStatus>('active');

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    saving,
    setSaving,
  ] = useState(false);


  /*
  |--------------------------------------------------------------------------
  | Load Bank
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    loadBank();
  }, []);


  const loadBank = async () => {

    try {

      setLoading(true);

      const data =
        await banksApi.get(bankId);

      setBank(data);


      /*
      |--------------------------------------------------------------------------
      | Basic
      |--------------------------------------------------------------------------
      */

      setBankName(
        String(
          data.bank_name ?? ''
        )
      );

      setOriginalBankName(
        String(
          data.bank_name_orginal ?? ''
        )
      );

      setAccountNo(
        String(
          data.account_no ?? ''
        )
      );

      setBranch(
        String(
          data.branch ?? ''
        )
      );

      setContactAddress(
        String(
          data.contact_address ?? ''
        )
      );


      /*
      |--------------------------------------------------------------------------
      | Financial
      |--------------------------------------------------------------------------
      */

      setBeginningAmount(
        valueToString(
          data.begnning_amount
        )
      );

      setBeginningAmountLeft(
        valueToString(
          data.begnning__amount_left
        )
      );

      setMinimumAmount(
        valueToString(
          data.min_amount
        )
      );

      setTransferRate(
        valueToString(
          data.transfer_rate
        )
      );


      /*
      |--------------------------------------------------------------------------
      | OD
      |--------------------------------------------------------------------------
      */

      setOdAvailable(
        data.od_available === 'Yes'
          ? 'Yes'
          : 'No'
      );

      setOdAmount(
        valueToString(
          data.od_amount
        )
      );

      setOdAmountLeft(
        valueToString(
          data.od_amount_left
        )
      );

      setOdLimit(
        String(
          data.od_limit ?? ''
        )
      );

      setOdStatus(
        String(
          data.od_status ?? ''
        )
      );

      setOdStartDate(
        normalizeDate(
          data.start_date
        )
      );

      setOdEndDate(
        normalizeDate(
          data.end_date
        )
      );


      /*
      |--------------------------------------------------------------------------
      | Term Loan
      |--------------------------------------------------------------------------
      */

      setTermLoan(
        data.term_loan === 'Yes'
          ? 'Yes'
          : 'No'
      );

      setTermLoanAmount(
        valueToString(
          data.term_loan_amount
        )
      );

      setLoanStatus(
        String(
          data.loan_status ?? ''
        )
      );

      setTermLoanStartDate(
        normalizeDate(
          data.term_loan_start_date
        )
      );

      setTermLoanEndDate(
        normalizeDate(
          data.term_loan_end_date
        )
      );

      setRepaymentAmount(
        valueToString(
          data.repayment_amount
        )
      );

      setRepaymentAmountLeft(
        String(
          data.repayment_amount_left ??
          ''
        )
      );

      setPeriod(
        String(
          data.period ?? ''
        )
      );


      /*
      |--------------------------------------------------------------------------
      | Relief
      |--------------------------------------------------------------------------
      */

      setTermLoanRelief(
        data.term_loan_relief === 'Yes'
          ? 'Yes'
          : 'No'
      );

      setReliefStartDate(
        normalizeDate(
          data.term_loan_relief_start_date
        )
      );

      setReliefEndDate(
        normalizeDate(
          data.term_loan_relief_end_date
        )
      );


      /*
      |--------------------------------------------------------------------------
      | Other
      |--------------------------------------------------------------------------
      */

      setEthiopianDate(
        String(
          data.ethiopian_date ?? ''
        )
      );

      setDateRegistered(
        normalizeDate(
          data.date_registered
        )
      );

      setCobBalance(
        String(
          data.cob_balance ?? ''
        )
      );

      setLastActivity(
        String(
          data.last_activity ?? ''
        )
      );

      setSuggestion(
        String(
          data.suggestion ?? ''
        )
      );

      setEndBalance(
        String(
          data.end_balance ?? ''
        )
      );

      setCreditSuggestion(
        String(
          data.credit_suggestion ?? ''
        )
      );

      setCategory(
        String(
          data.category ?? ''
        )
      );

      setStartMonth(
        String(
          data.start_month ?? ''
        )
      );


      setStatus(
        data.status === 'inactive'
          ? 'inactive'
          : 'active'
      );

    } catch (error: any) {

      console.log(
        'Edit bank load error:',
        error?.response?.data ??
        error
      );

      Alert.alert(
        'Unable to load bank',
        error?.response?.data?.message ??
        'Bank information could not be loaded.'
      );

    } finally {

      setLoading(false);

    }

  };


  /*
  |--------------------------------------------------------------------------
  | Input Helpers
  |--------------------------------------------------------------------------
  */

  const cleanNumber = (
    value: string
  ): string => {

    /*
     * Prevent multiple decimal points.
     */

    let cleaned =
      value.replace(
        /[^0-9.]/g,
        ''
      );

    const parts =
      cleaned.split('.');

    if (parts.length > 2) {
      cleaned =
        parts.shift() +
        '.' +
        parts.join('');
    }

    return cleaned;
  };


  const toNumber = (
    value: string
  ): number => {

    return Number(
      value.replace(
        /,/g,
        ''
      )
    );
  };


  const isValidDate = (
    value: string
  ): boolean => {

    return /^\d{4}-\d{2}-\d{2}$/.test(
      value
    );
  };


  const endDateBeforeStart = (
    start: string,
    end: string
  ): boolean => {

    return (
      isValidDate(start) &&
      isValidDate(end) &&
      end < start
    );
  };


  /*
  |--------------------------------------------------------------------------
  | Validation
  |--------------------------------------------------------------------------
  */

  const validate =
    (): string | null => {

      if (!bankName.trim()) {
        return 'Bank name is required.';
      }

      if (
        bankName.trim().length >
        100
      ) {
        return 'Bank name cannot exceed 100 characters.';
      }

      if (
        originalBankName
          .trim()
          .length > 200
      ) {
        return 'Original bank name cannot exceed 200 characters.';
      }

      if (!accountNo.trim()) {
        return 'Account number is required.';
      }

      if (
        accountNo.trim().length >
        50
      ) {
        return 'Account number cannot exceed 50 characters.';
      }

      if (!branch.trim()) {
        return 'Branch is required.';
      }

      if (
        branch.trim().length >
        50
      ) {
        return 'Branch cannot exceed 50 characters.';
      }

      if (
        contactAddress
          .trim()
          .length > 50
      ) {
        return 'Contact address cannot exceed 50 characters.';
      }


      const financialFields = [
        {
          name: 'Beginning amount',
          value:
            beginningAmount,
        },
        {
          name:
            'Beginning amount left',
          value:
            beginningAmountLeft,
        },
        {
          name: 'Minimum amount',
          value:
            minimumAmount,
        },
        {
          name: 'Transfer rate',
          value:
            transferRate,
        },
      ];


      for (
        const field of
        financialFields
      ) {

        if (
          field.value.trim() ===
          ''
        ) {
          return `${field.name} is required.`;
        }

        const number =
          toNumber(
            field.value
          );

        if (
          Number.isNaN(number) ||
          number < 0
        ) {
          return `${field.name} must be a valid non-negative number.`;
        }
      }


      /*
      |--------------------------------------------------------------------------
      | OD
      |--------------------------------------------------------------------------
      */

      if (
        odAvailable ===
        'Yes'
      ) {

        if (!odAmount.trim()) {
          return 'OD amount is required.';
        }

        if (
          !odAmountLeft.trim()
        ) {
          return 'OD amount left is required.';
        }

        if (!odLimit.trim()) {
          return 'OD limit is required.';
        }

        if (!odStatus.trim()) {
          return 'OD status is required.';
        }

        if (
          odLimit.trim()
            .length > 20
        ) {
          return 'OD limit cannot exceed 20 characters.';
        }

        if (
          odStatus.trim()
            .length > 30
        ) {
          return 'OD status cannot exceed 30 characters.';
        }

        if (
          !isValidDate(
            odStartDate
          )
        ) {
          return 'OD start date must use YYYY-MM-DD.';
        }

        if (
          !isValidDate(
            odEndDate
          )
        ) {
          return 'OD end date must use YYYY-MM-DD.';
        }

        if (
          endDateBeforeStart(
            odStartDate,
            odEndDate
          )
        ) {
          return 'OD end date must be on or after the start date.';
        }


        const odValues = [
          {
            name: 'OD amount',
            value: odAmount,
          },
          {
            name:
              'OD amount left',
            value:
              odAmountLeft,
          },
        ];


        for (
          const field of
          odValues
        ) {

          const number =
            toNumber(
              field.value
            );

          if (
            Number.isNaN(
              number
            ) ||
            number < 0
          ) {
            return `${field.name} must be a valid non-negative number.`;
          }
        }

      }


      /*
      |--------------------------------------------------------------------------
      | Term Loan
      |--------------------------------------------------------------------------
      */

      if (
        termLoan === 'Yes'
      ) {

        if (
          !termLoanAmount.trim()
        ) {
          return 'Term loan amount is required.';
        }

        if (
          !loanStatus.trim()
        ) {
          return 'Loan status is required.';
        }

        if (
          !isValidDate(
            termLoanStartDate
          )
        ) {
          return 'Term loan start date must use YYYY-MM-DD.';
        }

        if (
          !isValidDate(
            termLoanEndDate
          )
        ) {
          return 'Term loan end date must use YYYY-MM-DD.';
        }

        if (
          endDateBeforeStart(
            termLoanStartDate,
            termLoanEndDate
          )
        ) {
          return 'Term loan end date must be on or after the start date.';
        }

        if (
          !repaymentAmount.trim()
        ) {
          return 'Repayment amount is required.';
        }

        if (
          !repaymentAmountLeft
            .trim()
        ) {
          return 'Repayment amount left is required.';
        }

        if (!period.trim()) {
          return 'Period is required.';
        }

        if (
          loanStatus.trim()
            .length > 20
        ) {
          return 'Loan status cannot exceed 20 characters.';
        }

        if (
          repaymentAmountLeft
            .trim()
            .length > 20
        ) {
          return 'Repayment amount left cannot exceed 20 characters.';
        }

        if (
          period.trim()
            .length > 20
        ) {
          return 'Period cannot exceed 20 characters.';
        }


        const loanValues = [
          {
            name:
              'Term loan amount',
            value:
              termLoanAmount,
          },
          {
            name:
              'Repayment amount',
            value:
              repaymentAmount,
          },
        ];


        for (
          const field of
          loanValues
        ) {

          const number =
            toNumber(
              field.value
            );

          if (
            Number.isNaN(
              number
            ) ||
            number < 0
          ) {
            return `${field.name} must be a valid non-negative number.`;
          }
        }

      }


      /*
      |--------------------------------------------------------------------------
      | Relief
      |--------------------------------------------------------------------------
      */

      if (
        termLoanRelief ===
        'Yes'
      ) {

        if (
          !isValidDate(
            reliefStartDate
          )
        ) {
          return 'Relief start date must use YYYY-MM-DD.';
        }

        if (
          !isValidDate(
            reliefEndDate
          )
        ) {
          return 'Relief end date must use YYYY-MM-DD.';
        }

        if (
          endDateBeforeStart(
            reliefStartDate,
            reliefEndDate
          )
        ) {
          return 'Relief end date must be on or after the start date.';
        }

      }


      if (
        dateRegistered.trim() &&
        !isValidDate(
          dateRegistered
        )
      ) {
        return 'Date registered must use YYYY-MM-DD.';
      }


      /*
       * Optional field limits from BankRequest
       */

      if (
        ethiopianDate
          .trim()
          .length > 10
      ) {
        return 'Ethiopian date cannot exceed 10 characters.';
      }

      if (
        cobBalance
          .trim()
          .length > 20
      ) {
        return 'COB balance cannot exceed 20 characters.';
      }

      if (
        lastActivity
          .trim()
          .length > 100
      ) {
        return 'Last activity cannot exceed 100 characters.';
      }

      if (
        suggestion
          .trim()
          .length > 20
      ) {
        return 'Suggestion cannot exceed 20 characters.';
      }

      if (
        endBalance
          .trim()
          .length > 20
      ) {
        return 'End balance cannot exceed 20 characters.';
      }

      if (
        creditSuggestion
          .trim()
          .length > 20
      ) {
        return 'Credit suggestion cannot exceed 20 characters.';
      }

      if (
        category.trim()
          .length > 500
      ) {
        return 'Category cannot exceed 500 characters.';
      }

      if (
        startMonth
          .trim()
          .length > 50
      ) {
        return 'Start month cannot exceed 50 characters.';
      }


      return null;
    };


  /*
  |--------------------------------------------------------------------------
  | Save
  |--------------------------------------------------------------------------
  */

  const handleSave =
    async () => {

      const errorMessage =
        validate();

      if (errorMessage) {

        Alert.alert(
          'Check form',
          errorMessage
        );

        return;
      }


      const payload:
        BankPayload = {

        /*
        |--------------------------------------------------------------------------
        | Basic
        |--------------------------------------------------------------------------
        */

        bank_name:
          bankName.trim(),

        bank_name_orginal:
          originalBankName
            .trim() ||
          null,

        account_no:
          accountNo.trim(),

        branch:
          branch.trim(),

        contact_address:
          contactAddress
            .trim() ||
          null,


        /*
        |--------------------------------------------------------------------------
        | Financial
        |--------------------------------------------------------------------------
        */

        begnning_amount:
          toNumber(
            beginningAmount
          ),

        begnning__amount_left:
          toNumber(
            beginningAmountLeft
          ),

        min_amount:
          toNumber(
            minimumAmount
          ),

        transfer_rate:
          toNumber(
            transferRate
          ),


        /*
        |--------------------------------------------------------------------------
        | OD
        |--------------------------------------------------------------------------
        */

        od_available:
          odAvailable,

        od_amount:
          odAvailable ===
          'Yes'
            ? toNumber(
                odAmount
              )
            : null,

        od_amount_left:
          odAvailable ===
          'Yes'
            ? toNumber(
                odAmountLeft
              )
            : null,

        od_limit:
          odAvailable ===
          'Yes'
            ? odLimit.trim()
            : null,

        od_status:
          odAvailable ===
          'Yes'
            ? odStatus.trim()
            : null,

        start_date:
          odAvailable ===
          'Yes'
            ? odStartDate.trim()
            : null,

        end_date:
          odAvailable ===
          'Yes'
            ? odEndDate.trim()
            : null,


        /*
        |--------------------------------------------------------------------------
        | Term Loan
        |--------------------------------------------------------------------------
        */

        term_loan:
          termLoan,

        term_loan_amount:
          termLoan ===
          'Yes'
            ? toNumber(
                termLoanAmount
              )
            : null,

        loan_status:
          termLoan ===
          'Yes'
            ? loanStatus.trim()
            : null,

        term_loan_start_date:
          termLoan ===
          'Yes'
            ? termLoanStartDate
                .trim()
            : null,

        term_loan_end_date:
          termLoan ===
          'Yes'
            ? termLoanEndDate
                .trim()
            : null,

        repayment_amount:
          termLoan ===
          'Yes'
            ? toNumber(
                repaymentAmount
              )
            : null,

        repayment_amount_left:
          termLoan ===
          'Yes'
            ? repaymentAmountLeft
                .trim()
            : null,

        period:
          termLoan ===
          'Yes'
            ? period.trim()
            : null,


        /*
        |--------------------------------------------------------------------------
        | Relief
        |--------------------------------------------------------------------------
        */

        term_loan_relief:
          termLoanRelief,

        term_loan_relief_start_date:
          termLoanRelief ===
          'Yes'
            ? reliefStartDate
                .trim()
            : null,

        term_loan_relief_end_date:
          termLoanRelief ===
          'Yes'
            ? reliefEndDate
                .trim()
            : null,


        /*
        |--------------------------------------------------------------------------
        | Other
        |--------------------------------------------------------------------------
        */

        ethiopian_date:
          ethiopianDate
            .trim() ||
          null,

        date_registered:
          dateRegistered
            .trim() ||
          null,

        cob_balance:
          cobBalance.trim() ||
          null,

        status,

        last_activity:
          lastActivity
            .trim() ||
          null,

        suggestion:
          suggestion.trim() ||
          null,

        end_balance:
          endBalance.trim() ||
          null,

        credit_suggestion:
          creditSuggestion
            .trim() ||
          null,

        category:
          category.trim() ||
          null,

        start_month:
          startMonth.trim() ||
          null,
      };


      try {

        setSaving(true);

        await banksApi.update(
          bankId,
          payload
        );


        Alert.alert(
          'Bank updated',
          'The bank has been updated successfully.',
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
          'Bank update error:',
          error?.response?.data ??
          error
        );


        Alert.alert(
          'Update failed',
          getApiErrorMessage(
            error,
            'Unable to update bank.'
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
            styles.loadingContainer
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
            Loading bank...
          </Text>
        </View>
      </SafeAreaView>
    );

  }


  if (!bank) {

    return (
      <SafeAreaView
        style={
          styles.safeArea
        }
      >
        <View
          style={
            styles.loadingContainer
          }
        >
          <Ionicons
            name="business-outline"
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
            Bank not found
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
  | UI
  |--------------------------------------------------------------------------
  */

  return (
    <SafeAreaView
      style={
        styles.safeArea
      }
    >

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }
      >

        <ScrollView
          contentContainerStyle={
            styles.container
          }
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={
            false
          }
        >

          {/* HEADER */}

          <View
            style={styles.header}
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
                size={22}
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
                style={styles.title}
              >
                Edit Bank
              </Text>

              <Text
                style={
                  styles.subtitle
                }
              >
                Update banking & credit setup
              </Text>
            </View>
          </View>


          {/* BANK ID */}

          <View
            style={styles.bankIdCard}
          >
            <View
              style={
                styles.bankIdIcon
              }
            >
              <Ionicons
                name="business-outline"
                size={24}
                color={
                  Colors.primary
                }
              />
            </View>

            <View
              style={{
                flex: 1,
                marginLeft: 12,
              }}
            >
              <Text
                style={
                  styles.bankIdLabel
                }
              >
                Bank ID
              </Text>

              <Text
                style={
                  styles.bankIdValue
                }
              >
                {bank.bank_id}
              </Text>

              <Text
                style={
                  styles.bankIdHelp
                }
              >
                Generated automatically and cannot be changed.
              </Text>
            </View>
          </View>


          {/* BASIC */}

          <SectionTitle
            title="Basic Information"
          />

          <View
            style={styles.formCard}
          >

            <FormInput
              label="Bank Name"
              required
              icon="business-outline"
              value={bankName}
              onChangeText={
                setBankName
              }
              maxLength={100}
              placeholder="Bank name"
            />

            <FormInput
              label="Original Bank Name"
              icon="text-outline"
              value={
                originalBankName
              }
              onChangeText={
                setOriginalBankName
              }
              maxLength={200}
              placeholder="Optional"
            />

            <FormInput
              label="Account Number"
              required
              icon="card-outline"
              value={accountNo}
              onChangeText={
                setAccountNo
              }
              maxLength={50}
              placeholder="Account number"
            />

            <FormInput
              label="Branch"
              required
              icon="location-outline"
              value={branch}
              onChangeText={
                setBranch
              }
              maxLength={50}
              placeholder="Branch"
            />

            <FormInput
              label="Contact Address"
              icon="call-outline"
              value={
                contactAddress
              }
              onChangeText={
                setContactAddress
              }
              maxLength={50}
              placeholder="Optional"
              last
            />

          </View>


          {/* FINANCIAL */}

          <SectionTitle
            title="Financial Setup"
          />

          <View
            style={styles.formCard}
          >

            <MoneyInput
              label="Beginning Amount"
              value={
                beginningAmount
              }
              onChangeText={
                setBeginningAmount
              }
              onClean={
                cleanNumber
              }
            />

            <MoneyInput
              label="Beginning Amount Left"
              value={
                beginningAmountLeft
              }
              onChangeText={
                setBeginningAmountLeft
              }
              onClean={
                cleanNumber
              }
            />

            <MoneyInput
              label="Minimum Amount"
              value={
                minimumAmount
              }
              onChangeText={
                setMinimumAmount
              }
              onClean={
                cleanNumber
              }
            />

            <MoneyInput
              label="Transfer Rate"
              value={
                transferRate
              }
              onChangeText={
                setTransferRate
              }
              onClean={
                cleanNumber
              }
              last
            />

          </View>


          {/* OD */}

          <SectionTitle
            title="Overdraft Facility"
          />

          <View
            style={styles.formCard}
          >

            <YesNoSelector
              label="OD Available"
              value={
                odAvailable
              }
              onChange={
                setOdAvailable
              }
            />


            {odAvailable ===
            'Yes' && (
              <>
                <MoneyInput
                  label="OD Amount"
                  value={
                    odAmount
                  }
                  onChangeText={
                    setOdAmount
                  }
                  onClean={
                    cleanNumber
                  }
                />

                <MoneyInput
                  label="OD Amount Left"
                  value={
                    odAmountLeft
                  }
                  onChangeText={
                    setOdAmountLeft
                  }
                  onClean={
                    cleanNumber
                  }
                />

                <FormInput
                  label="OD Limit"
                  required
                  icon="speedometer-outline"
                  value={odLimit}
                  onChangeText={
                    setOdLimit
                  }
                  maxLength={20}
                  placeholder="OD limit"
                />

                <FormInput
                  label="OD Status"
                  required
                  icon="information-circle-outline"
                  value={odStatus}
                  onChangeText={
                    setOdStatus
                  }
                  maxLength={30}
                  placeholder="OD status"
                />

                <DateInput
                  label="OD Start Date"
                  value={
                    odStartDate
                  }
                  onChangeText={
                    setOdStartDate
                  }
                />

                <DateInput
                  label="OD End Date"
                  value={
                    odEndDate
                  }
                  onChangeText={
                    setOdEndDate
                  }
                  last
                />
              </>
            )}

          </View>


          {/* TERM LOAN */}

          <SectionTitle
            title="Term Loan"
          />

          <View
            style={styles.formCard}
          >

            <YesNoSelector
              label="Term Loan"
              value={termLoan}
              onChange={
                setTermLoan
              }
            />


            {termLoan ===
            'Yes' && (
              <>
                <MoneyInput
                  label="Term Loan Amount"
                  value={
                    termLoanAmount
                  }
                  onChangeText={
                    setTermLoanAmount
                  }
                  onClean={
                    cleanNumber
                  }
                />

                <FormInput
                  label="Loan Status"
                  required
                  icon="information-circle-outline"
                  value={
                    loanStatus
                  }
                  onChangeText={
                    setLoanStatus
                  }
                  maxLength={20}
                  placeholder="Loan status"
                />

                <DateInput
                  label="Loan Start Date"
                  value={
                    termLoanStartDate
                  }
                  onChangeText={
                    setTermLoanStartDate
                  }
                />

                <DateInput
                  label="Loan End Date"
                  value={
                    termLoanEndDate
                  }
                  onChangeText={
                    setTermLoanEndDate
                  }
                />

                <MoneyInput
                  label="Repayment Amount"
                  value={
                    repaymentAmount
                  }
                  onChangeText={
                    setRepaymentAmount
                  }
                  onClean={
                    cleanNumber
                  }
                />

                <FormInput
                  label="Repayment Amount Left"
                  required
                  icon="wallet-outline"
                  value={
                    repaymentAmountLeft
                  }
                  onChangeText={
                    setRepaymentAmountLeft
                  }
                  maxLength={20}
                  placeholder="Amount left"
                />

                <FormInput
                  label="Period"
                  required
                  icon="time-outline"
                  value={period}
                  onChangeText={
                    setPeriod
                  }
                  maxLength={20}
                  placeholder="Period"
                  last
                />
              </>
            )}

          </View>


          {/* RELIEF */}

          <SectionTitle
            title="Term Loan Relief"
          />

          <View
            style={styles.formCard}
          >

            <YesNoSelector
              label="Relief Available"
              value={
                termLoanRelief
              }
              onChange={
                setTermLoanRelief
              }
            />

            {termLoanRelief ===
            'Yes' && (
              <>
                <DateInput
                  label="Relief Start Date"
                  value={
                    reliefStartDate
                  }
                  onChangeText={
                    setReliefStartDate
                  }
                />

                <DateInput
                  label="Relief End Date"
                  value={
                    reliefEndDate
                  }
                  onChangeText={
                    setReliefEndDate
                  }
                  last
                />
              </>
            )}

          </View>


          {/* OTHER */}

          <SectionTitle
            title="Other Information"
          />

          <View
            style={styles.formCard}
          >

            <FormInput
              label="Ethiopian Date"
              icon="calendar-outline"
              value={
                ethiopianDate
              }
              onChangeText={
                setEthiopianDate
              }
              maxLength={10}
              placeholder="Optional"
            />

            <DateInput
              label="Date Registered"
              value={
                dateRegistered
              }
              onChangeText={
                setDateRegistered
              }
              required={false}
            />

            <FormInput
              label="COB Balance"
              icon="wallet-outline"
              value={
                cobBalance
              }
              onChangeText={
                setCobBalance
              }
              maxLength={20}
              placeholder="Optional"
            />

            <FormInput
              label="Last Activity"
              icon="time-outline"
              value={
                lastActivity
              }
              onChangeText={
                setLastActivity
              }
              maxLength={100}
              placeholder="Optional"
            />

            <FormInput
              label="Suggestion"
              icon="bulb-outline"
              value={
                suggestion
              }
              onChangeText={
                setSuggestion
              }
              maxLength={20}
              placeholder="Optional"
            />

            <FormInput
              label="End Balance"
              icon="cash-outline"
              value={
                endBalance
              }
              onChangeText={
                setEndBalance
              }
              maxLength={20}
              placeholder="Optional"
            />

            <FormInput
              label="Credit Suggestion"
              icon="chatbox-outline"
              value={
                creditSuggestion
              }
              onChangeText={
                setCreditSuggestion
              }
              maxLength={20}
              placeholder="Optional"
            />

            <FormInput
              label="Category"
              icon="folder-outline"
              value={
                category
              }
              onChangeText={
                setCategory
              }
              maxLength={500}
              placeholder="Optional"
            />

            <FormInput
              label="Start Month"
              icon="calendar-outline"
              value={
                startMonth
              }
              onChangeText={
                setStartMonth
              }
              maxLength={50}
              placeholder="Optional"
              last
            />

          </View>


          {/* STATUS */}

          <SectionTitle
            title="Status"
          />

          <View
            style={
              styles.statusSection
            }
          >

            <StatusOption
              title="Active"
              subtitle="Bank is available throughout the system"
              selected={
                status === 'active'
              }
              onPress={() =>
                setStatus('active')
              }
            />

            <StatusOption
              title="Inactive"
              subtitle="Bank stays stored but is disabled"
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


          {/* SAVE */}

          <Pressable
            disabled={saving}
            onPress={
              handleSave
            }
            style={[
              styles.saveButton,

              saving &&
                styles.disabled,
            ]}
          >

            {saving ? (
              <ActivityIndicator
                color={
                  Colors.white
                }
              />
            ) : (
              <>
                <Ionicons
                  name="save-outline"
                  size={20}
                  color={
                    Colors.white
                  }
                />

                <Text
                  style={
                    styles.saveText
                  }
                >
                  Save Changes
                </Text>
              </>
            )}

          </Pressable>

        </ScrollView>

      </KeyboardAvoidingView>

    </SafeAreaView>
  );
}


/*
|--------------------------------------------------------------------------
| Shared Components
|--------------------------------------------------------------------------
*/

function SectionTitle({
  title,
}: {
  title: string;
}) {
  return (
    <Text
      style={
        styles.sectionTitle
      }
    >
      {title}
    </Text>
  );
}


function FormInput({
  label,
  value,
  onChangeText,
  icon,
  placeholder,
  maxLength,
  required = false,
  last = false,
}: {
  label: string;
  value: string;
  onChangeText:
    (value: string) => void;
  icon: any;
  placeholder?: string;
  maxLength?: number;
  required?: boolean;
  last?: boolean;
}) {

  return (
    <View
      style={
        last
          ? undefined
          : styles.field
      }
    >
      <Text
        style={styles.label}
      >
        {label}

        {required && (
          <Text
            style={
              styles.required
            }
          >
            {' '}*
          </Text>
        )}
      </Text>

      <View
        style={
          styles.inputBox
        }
      >
        <Ionicons
          name={icon}
          size={19}
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
          maxLength={
            maxLength
          }
          style={
            styles.input
          }
        />
      </View>
    </View>
  );
}


function MoneyInput({
  label,
  value,
  onChangeText,
  onClean,
  last = false,
}: {
  label: string;
  value: string;
  onChangeText:
    (value: string) => void;
  onClean:
    (value: string) => string;
  last?: boolean;
}) {

  return (
    <View
      style={
        last
          ? undefined
          : styles.field
      }
    >
      <Text
        style={styles.label}
      >
        {label}

        <Text
          style={
            styles.required
          }
        >
          {' '}*
        </Text>
      </Text>

      <View
        style={
          styles.inputBox
        }
      >
        <Ionicons
          name="cash-outline"
          size={19}
          color={
            Colors.textSecondary
          }
        />

        <TextInput
          value={value}
          onChangeText={
            (text) =>
              onChangeText(
                onClean(text)
              )
          }
          keyboardType="decimal-pad"
          placeholder="0.00"
          placeholderTextColor={
            Colors.textMuted
          }
          style={
            styles.input
          }
        />
      </View>
    </View>
  );
}


function DateInput({
  label,
  value,
  onChangeText,
  required = true,
  last = false,
}: {
  label: string;
  value: string;
  onChangeText:
    (value: string) => void;
  required?: boolean;
  last?: boolean;
}) {

  return (
    <View
      style={
        last
          ? undefined
          : styles.field
      }
    >
      <Text
        style={styles.label}
      >
        {label}

        {required && (
          <Text
            style={
              styles.required
            }
          >
            {' '}*
          </Text>
        )}
      </Text>

      <View
        style={
          styles.inputBox
        }
      >
        <Ionicons
          name="calendar-outline"
          size={19}
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
    </View>
  );
}


function YesNoSelector({
  label,
  value,
  onChange,
}: {
  label: string;
  value: YesNo;
  onChange:
    (value: YesNo) => void;
}) {

  return (
    <View
      style={styles.field}
    >
      <Text
        style={styles.label}
      >
        {label}
        <Text
          style={
            styles.required
          }
        >
          {' '}*
        </Text>
      </Text>

      <View
        style={
          styles.choiceRow
        }
      >

        <ChoiceButton
          title="Yes"
          selected={
            value === 'Yes'
          }
          onPress={() =>
            onChange('Yes')
          }
        />

        <ChoiceButton
          title="No"
          selected={
            value === 'No'
          }
          onPress={() =>
            onChange('No')
          }
        />

      </View>
    </View>
  );
}


function ChoiceButton({
  title,
  selected,
  onPress,
}: {
  title: string;
  selected: boolean;
  onPress: () => void;
}) {

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.choiceButton,

        selected &&
          styles.choiceSelected,
      ]}
    >
      <View
        style={[
          styles.radioOuter,

          selected &&
            styles.radioOuterSelected,
        ]}
      >
        {selected && (
          <View
            style={
              styles.radioInner
            }
          />
        )}
      </View>

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


function StatusOption({
  title,
  subtitle,
  selected,
  onPress,
}: {
  title: string;
  subtitle: string;
  selected: boolean;
  onPress: () => void;
}) {

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.statusOption,

        selected &&
          styles.statusSelected,
      ]}
    >

      <View
        style={styles.statusIcon}
      >
        <Ionicons
          name={
            title === 'Active'
              ? 'checkmark-circle-outline'
              : 'pause-circle-outline'
          }
          size={22}
          color={
            selected
              ? Colors.primary
              : Colors.textSecondary
          }
        />
      </View>

      <View
        style={
          styles.statusContent
        }
      >
        <Text
          style={
            styles.statusTitle
          }
        >
          {title}
        </Text>

        <Text
          style={
            styles.statusSubtitle
          }
        >
          {subtitle}
        </Text>
      </View>

      <View
        style={[
          styles.radioOuter,

          selected &&
            styles.radioOuterSelected,
        ]}
      >
        {selected && (
          <View
            style={
              styles.radioInner
            }
          />
        )}
      </View>

    </Pressable>
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
): string {

  if (
    value === null ||
    value === undefined
  ) {
    return '';
  }

  return String(value);
}


function normalizeDate(
  value:
    | string
    | null
    | undefined
): string {

  if (!value) {
    return '';
  }

  /*
   * Handles values such as:
   * 2026-08-11
   * 2026-08-11T00:00:00.000000Z
   */

  return String(value)
    .substring(0, 10);
}


function getApiErrorMessage(
  error: any,
  fallback: string
): string {

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
      paddingHorizontal: 20,
      paddingTop: 12,
      paddingBottom: 55,
    },

    header: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    backButton: {
      width: 44,
      height: 44,
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
      marginLeft: 13,
    },

    title: {
      fontSize: 22,
      fontFamily:
        Fonts.extraBold,
      color:
        Colors.text,
    },

    subtitle: {
      marginTop: 2,
      fontSize: 12,
      fontFamily:
        Fonts.regular,
      color:
        Colors.textSecondary,
    },

    bankIdCard: {
      marginTop: 24,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 19,
      backgroundColor:
        Colors.surface,
      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    bankIdIcon: {
      width: 50,
      height: 50,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        Colors.primaryLight,
    },

    bankIdLabel: {
      fontSize: 10,
      fontFamily:
        Fonts.medium,
      color:
        Colors.textMuted,
    },

    bankIdValue: {
      marginTop: 2,
      fontSize: 15,
      fontFamily:
        Fonts.bold,
      color:
        Colors.text,
    },

    bankIdHelp: {
      marginTop: 3,
      fontSize: 9,
      fontFamily:
        Fonts.regular,
      color:
        Colors.textSecondary,
    },

    sectionTitle: {
      marginTop: 27,
      marginBottom: 12,
      fontSize: 17,
      fontFamily:
        Fonts.extraBold,
      color:
        Colors.text,
    },

    formCard: {
      padding: 17,
      borderRadius: 20,
      backgroundColor:
        Colors.surface,
      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    field: {
      marginBottom: 18,
    },

    label: {
      marginBottom: 8,
      fontSize: 12,
      fontFamily:
        Fonts.semiBold,
      color:
        Colors.text,
    },

    required: {
      color:
        Colors.danger,
    },

    inputBox: {
      height: 54,
      paddingHorizontal: 14,
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 15,
      backgroundColor:
        Colors.background,
      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    input: {
      flex: 1,
      height: '100%',
      marginLeft: 10,
      fontSize: 14,
      fontFamily:
        Fonts.regular,
      color:
        Colors.text,
    },

    choiceRow: {
      flexDirection: 'row',
      gap: 10,
    },

    choiceButton: {
      flex: 1,
      height: 52,
      paddingHorizontal: 14,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 15,
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
      marginLeft: 8,
      fontSize: 12,
      fontFamily:
        Fonts.medium,
      color:
        Colors.textSecondary,
    },

    choiceTextSelected: {
      color:
        Colors.primary,
      fontFamily:
        Fonts.bold,
    },

    radioOuter: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor:
        Colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },

    radioOuterSelected: {
      borderColor:
        Colors.primary,
    },

    radioInner: {
      width: 9,
      height: 9,
      borderRadius: 5,
      backgroundColor:
        Colors.primary,
    },

    statusSection: {
      gap: 10,
    },

    statusOption: {
      minHeight: 78,
      padding: 14,
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 18,
      backgroundColor:
        Colors.surface,
      borderWidth: 1.5,
      borderColor:
        Colors.border,
    },

    statusSelected: {
      borderColor:
        Colors.primary,
      backgroundColor:
        Colors.primaryLight,
    },

    statusIcon: {
      width: 45,
      height: 45,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        Colors.background,
    },

    statusContent: {
      flex: 1,
      marginLeft: 12,
      marginRight: 10,
    },

    statusTitle: {
      fontSize: 13,
      fontFamily:
        Fonts.bold,
      color:
        Colors.text,
    },

    statusSubtitle: {
      marginTop: 3,
      fontSize: 10,
      lineHeight: 15,
      fontFamily:
        Fonts.regular,
      color:
        Colors.textSecondary,
    },

    saveButton: {
      height: 56,
      marginTop: 28,
      borderRadius: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 9,
      backgroundColor:
        Colors.primary,
    },

    saveText: {
      fontSize: 14,
      fontFamily:
        Fonts.bold,
      color:
        Colors.white,
    },

    disabled: {
      opacity: 0.7,
    },

    loadingContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },

    loadingText: {
      marginTop: 12,
      fontSize: 13,
      fontFamily:
        Fonts.medium,
      color:
        Colors.textSecondary,
    },

    notFoundTitle: {
      marginTop: 13,
      fontSize: 17,
      fontFamily:
        Fonts.bold,
      color:
        Colors.text,
    },

    goBackButton: {
      marginTop: 20,
      paddingHorizontal: 22,
      paddingVertical: 12,
      borderRadius: 14,
      backgroundColor:
        Colors.primary,
    },

    goBackText: {
      fontFamily:
        Fonts.bold,
      color:
        Colors.white,
    },

  });
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
import { router } from 'expo-router';
import { useState } from 'react';

import { Colors } from '../../../../constants/colors';
import { Fonts } from '../../../../constants/fonts';

import {
  BankPayload,
  BankStatus,
  YesNo,
  banksApi,
} from '../../../../api/banksApi';


export default function CreateBankScreen() {

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

  const [odAmount, setOdAmount] =
    useState('');

  const [
    odAmountLeft,
    setOdAmountLeft,
  ] = useState('');

  const [odLimit, setOdLimit] =
    useState('');

  const [odStatus, setOdStatus] =
    useState('');

  const [odStartDate, setOdStartDate] =
    useState('');

  const [odEndDate, setOdEndDate] =
    useState('');


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

  const [period, setPeriod] =
    useState('');


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

  const [cobBalance, setCobBalance] =
    useState('');

  const [
    lastActivity,
    setLastActivity,
  ] = useState('');

  const [suggestion, setSuggestion] =
    useState('');

  const [endBalance, setEndBalance] =
    useState('');

  const [
    creditSuggestion,
    setCreditSuggestion,
  ] = useState('');

  const [category, setCategory] =
    useState('');

  const [startMonth, setStartMonth] =
    useState('');


  /*
  |--------------------------------------------------------------------------
  | Status
  |--------------------------------------------------------------------------
  */

  const [status, setStatus] =
    useState<BankStatus>('active');

  const [saving, setSaving] =
    useState(false);


  /*
  |--------------------------------------------------------------------------
  | Helpers
  |--------------------------------------------------------------------------
  */

  const cleanNumber = (
    value: string
  ): string => {
    return value.replace(
      /[^0-9.]/g,
      ''
    );
  };


  const toNumber = (
    value: string
  ): number => {
    return Number(
      value.replace(/,/g, '')
    );
  };


  const isValidDate = (
    value: string
  ): boolean => {
    return /^\d{4}-\d{2}-\d{2}$/.test(
      value
    );
  };


  /*
  |--------------------------------------------------------------------------
  | Validation
  |--------------------------------------------------------------------------
  */

  const validate = (): string | null => {

    if (!bankName.trim()) {
      return 'Bank name is required.';
    }

    if (bankName.trim().length > 100) {
      return 'Bank name cannot exceed 100 characters.';
    }

    if (
      originalBankName.trim().length >
      200
    ) {
      return 'Original bank name cannot exceed 200 characters.';
    }

    if (!accountNo.trim()) {
      return 'Account number is required.';
    }

    if (accountNo.trim().length > 50) {
      return 'Account number cannot exceed 50 characters.';
    }

    if (!branch.trim()) {
      return 'Branch is required.';
    }

    if (branch.trim().length > 50) {
      return 'Branch cannot exceed 50 characters.';
    }

    if (
      contactAddress.trim().length >
      50
    ) {
      return 'Contact address cannot exceed 50 characters.';
    }


    const requiredNumbers = [
      {
        label: 'Beginning amount',
        value: beginningAmount,
      },
      {
        label:
          'Beginning amount left',
        value:
          beginningAmountLeft,
      },
      {
        label: 'Minimum amount',
        value: minimumAmount,
      },
      {
        label: 'Transfer rate',
        value: transferRate,
      },
    ];


    for (
      const field of
      requiredNumbers
    ) {

      if (
        field.value.trim() === ''
      ) {
        return `${field.label} is required.`;
      }

      const number =
        toNumber(field.value);

      if (
        Number.isNaN(number) ||
        number < 0
      ) {
        return `${field.label} must be a valid non-negative number.`;
      }
    }


    /*
    |--------------------------------------------------------------------------
    | OD validation
    |--------------------------------------------------------------------------
    */

    if (
      odAvailable === 'Yes'
    ) {

      if (!odAmount.trim()) {
        return 'OD amount is required.';
      }

      if (!odAmountLeft.trim()) {
        return 'OD amount left is required.';
      }

      if (!odLimit.trim()) {
        return 'OD limit is required.';
      }

      if (!odStatus.trim()) {
        return 'OD status is required.';
      }

      if (!odStartDate.trim()) {
        return 'OD start date is required.';
      }

      if (!odEndDate.trim()) {
        return 'OD end date is required.';
      }

      if (
        !isValidDate(
          odStartDate
        )
      ) {
        return 'OD start date must be YYYY-MM-DD.';
      }

      if (
        !isValidDate(
          odEndDate
        )
      ) {
        return 'OD end date must be YYYY-MM-DD.';
      }

      if (
        toNumber(odAmount) < 0 ||
        Number.isNaN(
          toNumber(odAmount)
        )
      ) {
        return 'OD amount must be valid.';
      }

      if (
        toNumber(
          odAmountLeft
        ) < 0 ||
        Number.isNaN(
          toNumber(
            odAmountLeft
          )
        )
      ) {
        return 'OD amount left must be valid.';
      }

      if (
        odLimit.trim().length >
        20
      ) {
        return 'OD limit cannot exceed 20 characters.';
      }

      if (
        odStatus.trim().length >
        30
      ) {
        return 'OD status cannot exceed 30 characters.';
      }
    }


    /*
    |--------------------------------------------------------------------------
    | Term Loan validation
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

      if (!loanStatus.trim()) {
        return 'Loan status is required.';
      }

      if (
        !termLoanStartDate.trim()
      ) {
        return 'Term loan start date is required.';
      }

      if (
        !termLoanEndDate.trim()
      ) {
        return 'Term loan end date is required.';
      }

      if (
        !repaymentAmount.trim()
      ) {
        return 'Repayment amount is required.';
      }

      if (
        !repaymentAmountLeft.trim()
      ) {
        return 'Repayment amount left is required.';
      }

      if (!period.trim()) {
        return 'Period is required.';
      }

      if (
        !isValidDate(
          termLoanStartDate
        )
      ) {
        return 'Term loan start date must be YYYY-MM-DD.';
      }

      if (
        !isValidDate(
          termLoanEndDate
        )
      ) {
        return 'Term loan end date must be YYYY-MM-DD.';
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
        period.trim().length >
        20
      ) {
        return 'Period cannot exceed 20 characters.';
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
        !reliefStartDate.trim()
      ) {
        return 'Relief start date is required.';
      }

      if (
        !reliefEndDate.trim()
      ) {
        return 'Relief end date is required.';
      }

      if (
        !isValidDate(
          reliefStartDate
        )
      ) {
        return 'Relief start date must be YYYY-MM-DD.';
      }

      if (
        !isValidDate(
          reliefEndDate
        )
      ) {
        return 'Relief end date must be YYYY-MM-DD.';
      }
    }


    if (
      dateRegistered.trim() &&
      !isValidDate(
        dateRegistered
      )
    ) {
      return 'Date registered must be YYYY-MM-DD.';
    }


    return null;
  };


  /*
  |--------------------------------------------------------------------------
  | Create
  |--------------------------------------------------------------------------
  */

  const handleCreate =
    async () => {

      const validationError =
        validate();

      if (
        validationError
      ) {
        Alert.alert(
          'Check form',
          validationError
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
          originalBankName.trim() ||
          null,

        account_no:
          accountNo.trim(),

        branch:
          branch.trim(),

        contact_address:
          contactAddress.trim() ||
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
          odAvailable === 'Yes'
            ? toNumber(
                odAmount
              )
            : null,

        od_amount_left:
          odAvailable === 'Yes'
            ? toNumber(
                odAmountLeft
              )
            : null,

        od_limit:
          odAvailable === 'Yes'
            ? odLimit.trim()
            : null,

        od_status:
          odAvailable === 'Yes'
            ? odStatus.trim()
            : null,

        start_date:
          odAvailable === 'Yes'
            ? odStartDate.trim()
            : null,

        end_date:
          odAvailable === 'Yes'
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
          termLoan === 'Yes'
            ? toNumber(
                termLoanAmount
              )
            : null,

        loan_status:
          termLoan === 'Yes'
            ? loanStatus.trim()
            : null,

        term_loan_start_date:
          termLoan === 'Yes'
            ? termLoanStartDate
                .trim()
            : null,

        term_loan_end_date:
          termLoan === 'Yes'
            ? termLoanEndDate
                .trim()
            : null,

        repayment_amount:
          termLoan === 'Yes'
            ? toNumber(
                repaymentAmount
              )
            : null,

        repayment_amount_left:
          termLoan === 'Yes'
            ? repaymentAmountLeft
                .trim()
            : null,

        period:
          termLoan === 'Yes'
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
            ? reliefStartDate.trim()
            : null,

        term_loan_relief_end_date:
          termLoanRelief ===
          'Yes'
            ? reliefEndDate.trim()
            : null,


        /*
        |--------------------------------------------------------------------------
        | Other
        |--------------------------------------------------------------------------
        */

        ethiopian_date:
          ethiopianDate.trim() ||
          null,

        date_registered:
          dateRegistered.trim() ||
          null,

        cob_balance:
          cobBalance.trim() ||
          null,

        status,

        last_activity:
          lastActivity.trim() ||
          null,

        suggestion:
          suggestion.trim() ||
          null,

        end_balance:
          endBalance.trim() ||
          null,

        credit_suggestion:
          creditSuggestion.trim() ||
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

        await banksApi.create(
          payload
        );


        Alert.alert(
          'Bank created',
          'The bank has been created successfully.',
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
          'Bank create error:',
          error?.response?.data ??
          error
        );

        Alert.alert(
          'Create failed',
          getApiErrorMessage(
            error,
            'Unable to create bank.'
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
                style={
                  styles.title
                }
              >
                Add Bank
              </Text>

              <Text
                style={
                  styles.subtitle
                }
              >
                Banking & credit setup
              </Text>

            </View>

          </View>


          {/* BASIC */}

          <SectionTitle
            title="Basic Information"
          />

          <View
            style={
              styles.formCard
            }
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
            style={
              styles.formCard
            }
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
            style={
              styles.formCard
            }
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
                  value={odAmount}
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
            style={
              styles.formCard
            }
          >

            <YesNoSelector
              label="Term Loan"
              value={
                termLoan
              }
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
            style={
              styles.formCard
            }
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
            style={
              styles.formCard
            }
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
              handleCreate
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
                  name="add-circle-outline"
                  size={21}
                  color={
                    Colors.white
                  }
                />

                <Text
                  style={
                    styles.saveText
                  }
                >
                  Create Bank
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
| Section
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


/*
|--------------------------------------------------------------------------
| Form Input
|--------------------------------------------------------------------------
*/

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


/*
|--------------------------------------------------------------------------
| Money Input
|--------------------------------------------------------------------------
*/

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


/*
|--------------------------------------------------------------------------
| Date Input
|--------------------------------------------------------------------------
*/

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


/*
|--------------------------------------------------------------------------
| Yes / No Selector
|--------------------------------------------------------------------------
*/

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
      onPress={
        onPress
      }

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


/*
|--------------------------------------------------------------------------
| Status
|--------------------------------------------------------------------------
*/

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
      onPress={
        onPress
      }

      style={[
        styles.statusOption,

        selected &&
          styles.statusSelected,
      ]}
    >

      <View
        style={
          styles.statusIcon
        }
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
| API Validation Error
|--------------------------------------------------------------------------
*/

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

  });
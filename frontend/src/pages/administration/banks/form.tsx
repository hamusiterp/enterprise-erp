import {
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Tabs,
} from 'antd';

import type {
  FormInstance,
  TabsProps,
} from 'antd';

import type {
  BankFormValues,
} from '../../../types/bank';

interface BankFormProps {
  form: FormInstance<BankFormValues>;
  disabled?: boolean;
}

const yesNoOptions = [
  {
    label: 'Yes',
    value: 'Yes',
  },
  {
    label: 'No',
    value: 'No',
  },
];

const statusOptions = [
  {
    label: 'Active',
    value: 'active',
  },
  {
    label: 'Inactive',
    value: 'inactive',
  },
];

const loanStatusOptions = [
  {
    label: 'Active',
    value: 'Active',
  },
  {
    label: 'Completed',
    value: 'Completed',
  },
  {
    label: 'Pending',
    value: 'Pending',
  },
  {
    label: 'Not Available',
    value: 'Not Available',
  },
];

const fullWidth = {
  width: '100%',
};

function BankForm({
  form,
  disabled = false,
}: BankFormProps) {
  const odAvailable = Form.useWatch(
    'od_available',
    form,
  );

  const termLoan = Form.useWatch(
    'term_loan',
    form,
  );

  const termLoanRelief = Form.useWatch(
    'term_loan_relief',
    form,
  );

  const odRequired = odAvailable === 'Yes';
  const termLoanRequired = termLoan === 'Yes';
  const reliefRequired =
    termLoanRelief === 'Yes';

  const generalTab = (
    <Row gutter={[16, 0]}>
      <Col xs={24} md={8}>
        <Form.Item
          name="bank_id"
          label="Bank ID"
        >
          <Input
            placeholder="Generated automatically"
            disabled
          />
        </Form.Item>
      </Col>

      <Col xs={24} md={8}>
        <Form.Item
          name="bank_name"
          label="Bank Name"
          rules={[
            {
              required: true,
              message: 'Bank name is required.',
            },
            {
              max: 100,
              message:
                'Bank name cannot exceed 100 characters.',
            },
          ]}
        >
          <Input
            placeholder="Enter bank name"
            disabled={disabled}
          />
        </Form.Item>
      </Col>

      <Col xs={24} md={8}>
        <Form.Item
          name="bank_name_orginal"
          label="Original Bank Name"
          rules={[
            {
              required: true,
              message: 'Bank name is required.',
             
              
            },
          ]}
        >
          <Input
            placeholder="Enter original bank name"
            disabled={disabled}
          />
        </Form.Item>
      </Col>

      <Col xs={24} md={8}>
        <Form.Item
          name="account_no"
          label="Account Number"
          rules={[
            {
              required: true,
              message: 'Account number is required.',
            },
            {
              max: 50,
              message:
                'Account number cannot exceed 50 characters.',
            },
          ]}
        >
          <Input
            placeholder="Enter account number"
            disabled={disabled}
          />
        </Form.Item>
      </Col>

      <Col xs={24} md={8}>
        <Form.Item
          name="branch"
          label="Branch"
          rules={[
            {
              required: true,
              message: 'Branch is required.',
            },
            {
              max: 50,
              message:
                'Branch cannot exceed 50 characters.',
            },
          ]}
        >
          <Input
            placeholder="Enter branch"
            disabled={disabled}
          />
        </Form.Item>
      </Col>

      <Col xs={24} md={8}>
        <Form.Item
          name="contact_address"
          label="Contact Address"
          rules={[
            {
              max: 50,
              message:
                'Contact address cannot exceed 50 characters.',
            },
          ]}
        >
          <Input
            placeholder="Enter contact address"
            disabled={disabled}
          />
        </Form.Item>
      </Col>

      <Col xs={24} md={8}>
        <Form.Item
          name="status"
          label="Status"
          rules={[
            {
              required: true,
              message: 'Status is required.',
            },
          ]}
        >
          <Select
            options={statusOptions}
            placeholder="Select status"
            disabled={disabled}
          />
        </Form.Item>
      </Col>

      <Col xs={24} md={8}>
        <Form.Item
          name="category"
          label="Category"
          rules={[
            {
              max: 500,
              message:
                'Category cannot exceed 500 characters.',
            },
          ]}
        >
          <Input
            placeholder="Enter category"
            disabled={disabled}
          />
        </Form.Item>
      </Col>

      <Col xs={24} md={8}>
        <Form.Item
          name="start_month"
          label="Start Month"
          rules={[
            {
              max: 50,
            },
          ]}
        >
          <Input
            placeholder="Enter start month"
            disabled={disabled}
          />
        </Form.Item>
      </Col>

      <Col xs={24} md={8}>
        <Form.Item
          name="ethiopian_date"
          label="Ethiopian Date"
          rules={[
            {
              max: 10,
            },
          ]}
        >
          <Input
            placeholder="YYYY-MM-DD"
            maxLength={10}
            disabled={disabled}
          />
        </Form.Item>
      </Col>

      <Col xs={24} md={8}>
        <Form.Item
          name="date_registered"
          label="Date Registered"
          rules={[
            {
              max: 10,
            },
          ]}
        >
          <Input
            placeholder="YYYY-MM-DD"
            maxLength={10}
            disabled={disabled}
          />
        </Form.Item>
      </Col>
    </Row>
  );

  const balanceTab = (
    <Row gutter={[16, 0]}>
      <Col xs={24} md={8}>
        <Form.Item
  name="begnning_amount"
  label="Beginning Amount"
  rules={[
    {
      validator: async (_, value) => {
        if (
          value === undefined ||
          value === null ||
          value === ''
        ) {
          throw new Error(
            'Beginning amount is required.',
          );
        }
      },
    },
  ]}
>
  <InputNumber
    style={{ width: '100%' }}
    min={0}
    precision={2}
    placeholder="0.00"
    disabled={disabled}
  />
</Form.Item>
      </Col>

      <Col xs={24} md={8}>
        <Form.Item
  name="begnning__amount_left"
  label="Beginning Amount Left"
  rules={[
    {
      validator: async (_, value) => {
        if (
          value === undefined ||
          value === null ||
          value === ''
        ) {
          throw new Error(
            'Beginning amount left is required.',
          );
        }
      },
    },
  ]}
>
  <InputNumber
    style={{ width: '100%' }}
    min={0}
    precision={2}
    placeholder="0.00"
    disabled={disabled}
  />
</Form.Item>
      </Col>

      <Col xs={24} md={8}>
        <Form.Item
          name="min_amount"
          label="Minimum Amount"
          rules={[
            {
              required: true,
              message:
                'Minimum amount is required.',
            },
          ]}
        >
          <InputNumber
            style={fullWidth}
            min={0}
            precision={2}
            stringMode
            placeholder="0.00"
            disabled={disabled}
          />
        </Form.Item>
      </Col>

      <Col xs={24} md={8}>
        <Form.Item
          name="cob_balance"
          label="COB Balance"
          rules={[
            {
              max: 20,
            },
          ]}
        >
          <Input
            placeholder="Enter COB balance"
            disabled={disabled}
          />
        </Form.Item>
      </Col>

      <Col xs={24} md={8}>
        <Form.Item
          name="end_balance"
          label="End Balance"
          rules={[
            {
              max: 20,
            },
          ]}
        >
          <Input
            placeholder="Enter end balance"
            disabled={disabled}
          />
        </Form.Item>
      </Col>

      <Col xs={24} md={8}>
        <Form.Item
          name="transfer_rate"
          label="Transfer Rate"
          rules={[
            {
              required: true,
              message:
                'Transfer rate is required.',
            },
          ]}
        >
          <InputNumber
            style={fullWidth}
            min={0}
            precision={2}
            stringMode
            placeholder="0.00"
            disabled={disabled}
          />
        </Form.Item>
      </Col>
    </Row>
  );

  const overdraftTab = (
    <Row gutter={[16, 0]}>
      <Col xs={24} md={8}>
        <Form.Item
          name="od_available"
          label="OD Available"
        rules={[
            {
              required: true,
              message: 'OD availability is required.',
            },
          ]}
        >
          <Select
            allowClear
            options={yesNoOptions}
            placeholder="Select availability"
            disabled={disabled}
          />
        </Form.Item>
      </Col>

      <Col xs={24} md={8}>
        <Form.Item
          name="od_amount"
          label="OD Amount"
        rules={[
            {
              required: odRequired,
              message: 'OD amount is required.',
            },
          ]}
        >
          <InputNumber
            style={fullWidth}
            min={0}
            precision={2}
            stringMode
            placeholder="0.00"
            disabled={disabled || !odRequired}
          />
        </Form.Item>
      </Col>

      <Col xs={24} md={8}>
        <Form.Item
          name="od_amount_left"
          label="OD Amount Left"
        rules={[
            {
              required: odRequired,
              message: 'OD amount left is required.',
            },
          ]}
        >
          <InputNumber
            style={fullWidth}
            min={0}
            precision={2}
            stringMode
            placeholder="0.00"
            disabled={disabled || !odRequired}
          />
        </Form.Item>
      </Col>

      <Col xs={24} md={8}>
        <Form.Item
          name="od_limit"
          label="OD Limit"
          rules={[
            {
              required: odRequired,
              whitespace: true,
              message: 'OD limit is required.',
            },
            {
              max: 20,
            },
          ]}
        >
          <Input
            placeholder="Enter OD limit"
            disabled={disabled || !odRequired}
          />
        </Form.Item>
      </Col>

      <Col xs={24} md={8}>
        <Form.Item
          name="od_status"
          label="OD Status"
        rules={[
            {
              required: odRequired,
              message: 'OD status is required.',
            },
          ]}
        >
          <Select
            allowClear
            placeholder="Select OD status"
            disabled={disabled || !odRequired}
            options={[
              {
                label: 'Active',
                value: 'Active',
              },
              {
                label: 'Inactive',
                value: 'Inactive',
              },
              {
                label: 'Expired',
                value: 'Expired',
              },
              {
                label: 'Not Available',
                value: 'Not Available',
              },
            ]}
          />
        </Form.Item>
      </Col>

      <Col xs={24} md={8}>
        <Form.Item
          name="start_date"
          label="OD Start Date"
        rules={[
            {
              required: odRequired,
              message: 'OD start date is required.',
            },
          ]}
        >
          <Input
            placeholder="YYYY-MM-DD"
            maxLength={10}
            disabled={disabled || !odRequired}
          />
        </Form.Item>
      </Col>

      <Col xs={24} md={8}>
        <Form.Item
          name="end_date"
          label="OD End Date"
        rules={[
            {
              required: odRequired,
              message: 'OD end date is required.',
            },
          ]}
        >
          <Input
            placeholder="YYYY-MM-DD"
            maxLength={10}
            disabled={disabled || !odRequired}
          />
        </Form.Item>
      </Col>
    </Row>
  );

  const termLoanTab = (
    <Row gutter={[16, 0]}>
      <Col xs={24} md={8}>
        <Form.Item
          name="term_loan"
          label="Term Loan"
        rules={[
            {
              required: true,
              message: 'Term loan selection is required.',
            },
          ]}
        >
          <Select
            allowClear
            options={yesNoOptions}
            placeholder="Select term loan"
            disabled={disabled}
          />
        </Form.Item>
      </Col>

      <Col xs={24} md={8}>
        <Form.Item
          name="term_loan_amount"
          label="Term Loan Amount"
        rules={[
            {
              required: termLoanRequired,
              message: 'Term loan amount is required.',
            },
          ]}
        >
          <InputNumber
            style={fullWidth}
            min={0}
            precision={2}
            stringMode
            placeholder="0.00"
            disabled={disabled || !termLoanRequired}
          />
        </Form.Item>
      </Col>

      <Col xs={24} md={8}>
        <Form.Item
          name="loan_status"
          label="Loan Status"
          rules={[
            {
              required: termLoanRequired,
              message: 'Loan status is required.',
            },
          ]}
        >
          <Select
            options={loanStatusOptions}
            placeholder="Select loan status"
            disabled={disabled || !termLoanRequired}
          />
        </Form.Item>
      </Col>

      <Col xs={24} md={8}>
        <Form.Item
          name="term_loan_start_date"
          label="Loan Start Date"
        rules={[
            {
              required: termLoanRequired,
              message: 'Loan start date is required.',
            },
          ]}
        >
          <Input
            placeholder="YYYY-MM-DD"
            maxLength={10}
            disabled={disabled || !termLoanRequired}
          />
        </Form.Item>
      </Col>

      <Col xs={24} md={8}>
        <Form.Item
          name="term_loan_end_date"
          label="Loan End Date"
        rules={[
            {
              required: termLoanRequired,
              message: 'Loan end date is required.',
            },
          ]}
        >
          <Input
            placeholder="YYYY-MM-DD"
            maxLength={10}
            disabled={disabled || !termLoanRequired}
          />
        </Form.Item>
      </Col>

      <Col xs={24} md={8}>
        <Form.Item
          name="repayment_amount"
          label="Repayment Amount"
        rules={[
            {
              required: termLoanRequired,
              message: 'Repayment amount is required.',
            },
          ]}
        >
          <InputNumber
            style={fullWidth}
            min={0}
            precision={2}
            stringMode
            placeholder="0.00"
            disabled={disabled || !termLoanRequired}
          />
        </Form.Item>
      </Col>

      <Col xs={24} md={8}>
        <Form.Item
          name="repayment_amount_left"
          label="Repayment Amount Left"
          rules={[
            {
              required: termLoanRequired,
              whitespace: true,
              message: 'Repayment amount left is required.',
            },
            {
              max: 20,
            },
          ]}
        >
          <Input
            placeholder="Enter amount left"
            disabled={disabled || !termLoanRequired}
          />
        </Form.Item>
      </Col>

      <Col xs={24} md={8}>
        <Form.Item
          name="period"
          label="Period"
          rules={[
            {
              required: termLoanRequired,
              message: 'Period is required.',
            },
            {
              max: 20,
            },
          ]}
        >
          <Input
            placeholder="Enter loan period"
            disabled={disabled || !termLoanRequired}
          />
        </Form.Item>
      </Col>
    </Row>
  );

  const reliefTab = (
    <Row gutter={[16, 0]}>
      <Col xs={24} md={8}>
        <Form.Item
          name="term_loan_relief"
          label="Term Loan Relief"
          rules={[
            {
              required: true,
              message:
                'Term loan relief is required.',
            },
          ]}
        >
          <Select
            options={yesNoOptions}
            placeholder="Select relief"
            disabled={disabled}
          />
        </Form.Item>
      </Col>

      <Col xs={24} md={8}>
        <Form.Item
          name="term_loan_relief_start_date"
          label="Relief Start Date"
          rules={[
            {
              required: reliefRequired,
              whitespace: true,
              message: 'Relief start date is required.',
            },
            {
              max: 20,
            },
          ]}
        >
          <Input
            placeholder="YYYY-MM-DD"
            disabled={disabled || !reliefRequired}
          />
        </Form.Item>
      </Col>

      <Col xs={24} md={8}>
        <Form.Item
          name="term_loan_relief_end_date"
          label="Relief End Date"
          rules={[
            {
              required: reliefRequired,
              whitespace: true,
              message: 'Relief end date is required.',
            },
            {
              max: 20,
            },
          ]}
        >
          <Input
            placeholder="YYYY-MM-DD"
            disabled={disabled || !reliefRequired}
          />
        </Form.Item>
      </Col>
    </Row>
  );

  const monitoringTab = (
    <Row gutter={[16, 0]}>
      <Col xs={24} md={8}>
        <Form.Item
          name="last_activity"
          label="Last Activity"
          rules={[
            {
              max: 100,
            },
          ]}
        >
          <Input
            placeholder="Enter last activity"
            disabled={disabled}
          />
        </Form.Item>
      </Col>

      <Col xs={24} md={8}>
        <Form.Item
          name="suggestion"
          label="Suggestion"
          rules={[
            {
              max: 20,
            },
          ]}
        >
          <Input
            placeholder="Enter suggestion"
            disabled={disabled}
          />
        </Form.Item>
      </Col>

      <Col xs={24} md={8}>
        <Form.Item
          name="credit_suggestion"
          label="Credit Suggestion"
          rules={[
            {
              max: 20,
            },
          ]}
        >
          <Input
            placeholder="Enter credit suggestion"
            disabled={disabled}
          />
        </Form.Item>
      </Col>
    </Row>
  );

  const tabItems: TabsProps['items'] = [
    {
      key: 'general',
      label: 'General',
      children: generalTab,
    },
    {
      key: 'balances',
      label: 'Balances',
      forceRender: true,
      children: balanceTab,
    },
    {
      key: 'overdraft',
      label: 'Overdraft',
      forceRender: true,
      children: overdraftTab,
    },
    {
      key: 'term-loan',
      label: 'Term Loan',
      forceRender: true,
      children: termLoanTab,
    },
    {
      key: 'relief',
      label: 'Relief',
      forceRender: true,
      children: reliefTab,
    },
    {
      key: 'monitoring',
      label: 'Monitoring',
      children: monitoringTab,
    },
  ];

  return (
    <Form<BankFormValues>
      form={form}
      layout="vertical"
      requiredMark
      initialValues={{
        status: 'active',
        min_amount: '0.00',
        transfer_rate: '0.00',
        od_limit: '',
        repayment_amount_left: '',
        od_available: 'No',
        term_loan: 'No',
        term_loan_relief: 'No',
        term_loan_relief_start_date: '',
        term_loan_relief_end_date: '',
        cob_balance: '',
        last_activity: '',
        suggestion: '',
        end_balance: '',
        loan_status: 'Not Available',
        credit_suggestion: '',
        category: '',
        start_month: '',
      }}
    >
      <Tabs
        items={tabItems}
        destroyOnHidden={false}
      />
    </Form>
  );
}

export default BankForm;
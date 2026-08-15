import {
  Col,
  Form,
  Input,
  Row,
  Select,
} from 'antd';

import type {
  FormInstance,
} from 'antd';

import type {
  ChequeFormValues,
} from '../../types/cheque';

interface BankOption {
  id: number;
  name: string;
  branch: string | null;
}

interface ChequeFormProps {
  form: FormInstance<ChequeFormValues>;
  banks: BankOption[];
  banksLoading?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
}

const signatureOptions = [
  {
    label: 'Fully',
    value: 'fully',
  },
  {
    label: 'Partially',
    value: 'partially',
  },
];

const statusOptions = [
  {
    label: 'Active',
    value: 'active',
  },
  {
    label: 'Void',
    value: 'void',
  },
];

function ChequeForm({
  form,
  banks,
  banksLoading = false,
  disabled = false,
  readOnly = false,
}: ChequeFormProps) {
  const handleBankChange = (
    bankId: number | undefined,
  ) => {
    const selectedBank = banks.find(
      (bank) => bank.id === bankId,
    );

    form.setFieldValue(
      'branch',
      selectedBank?.branch ?? '',
    );
  };

  return (
    <Form<ChequeFormValues>
      form={form}
      layout="vertical"
      requiredMark
      initialValues={{
        signature_status: 'fully',
        status: 'active',
      }}
    >
      <Row gutter={[16, 0]}>
        <Col xs={24} md={12}>
          <Form.Item
            name="bank_id"
            label="Bank"
            rules={[
              {
                required: true,
                message:
                  'Bank is required.',
              },
            ]}
          >
            <Select
              showSearch
              allowClear
              optionFilterProp="label"
              loading={banksLoading}
              disabled={
                disabled || readOnly
              }
              placeholder="Select bank"
              options={banks.map(
                (bank) => ({
                  label: bank.name,
                  value: bank.id,
                }),
              )}
              onChange={
                handleBankChange
              }
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            name="branch"
            label="Branch"
            rules={[
              {
                required: true,
                whitespace: true,
                message:
                  'Bank branch is required.',
              },
              {
                max: 100,
                message:
                  'Branch cannot exceed 100 characters.',
              },
            ]}
          >
            <Input
              disabled
              placeholder="Filled automatically"
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            name="cheque_no"
            label="Cheque Number"
            rules={[
              {
                required: true,
                whitespace: true,
                message:
                  'Cheque number is required.',
              },
              {
                max: 50,
                message:
                  'Cheque number cannot exceed 50 characters.',
              },
            ]}
          >
            <Input
              disabled={
                disabled || readOnly
              }
              placeholder="Enter bank-issued cheque number"
              maxLength={50}
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            name="signature_status"
            label="Signature Status"
            rules={[
              {
                required: true,
                message:
                  'Signature status is required.',
              },
            ]}
          >
            <Select
              disabled={
                disabled || readOnly
              }
              placeholder="Select signature status"
              options={
                signatureOptions
              }
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            name="status"
            label="Status"
            rules={[
              {
                required: true,
                message:
                  'Status is required.',
              },
            ]}
          >
            <Select
              disabled={
                disabled || readOnly
              }
              placeholder="Select status"
              options={statusOptions}
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}

export default ChequeForm;
import {
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
} from 'antd';

import type {
  FormInstance,
} from 'antd';

import type {
  CustomerFormValues,
} from '../../../types/customer';

interface CustomerFormProps {
  form: FormInstance<CustomerFormValues>;
  disabled?: boolean;
}

const customerTypeOptions = [
  {
    label: 'Individual',
    value: 'individual',
  },
  {
    label: 'Company',
    value: 'company',
  },
];

const yesNoOptions = [
  {
    label: 'Yes',
    value: true,
  },
  {
    label: 'No',
    value: false,
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

function CustomerForm({
  form,
  disabled = false,
}: CustomerFormProps) {
  const customerType = Form.useWatch(
    'customer_type',
    form,
  );

  const withhold = Form.useWatch(
    'withhold',
    form,
  );

  const handleCustomerTypeChange = (
    value: 'individual' | 'company',
  ) => {
    if (value === 'individual') {
      form.setFieldsValue({
        company_name: null,
        tin_number: null,
      });
    }

    if (value === 'company') {
      form.setFieldsValue({
        firstname: null,
        lastname: null,
      });
    }
  };

  const handleWithholdChange = (
    value: boolean,
  ) => {
    if (!value) {
      form.setFieldValue(
        'withhold_percent',
        null,
      );
    }
  };

  return (
    <Form<CustomerFormValues>
      form={form}
      layout="vertical"
      requiredMark
      initialValues={{
        withhold: false,
        withhold_from_advance: false,
        customer_status: 'active',
      }}
    >
      <Row gutter={[16, 0]}>
        <Col xs={24} md={12}>
          <Form.Item
            name="customer_no"
            label="Customer Number"
          >
            <Input
              disabled
              placeholder="Generated automatically"
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            name="customer_type"
            label="Customer Type"
            rules={[
              {
                required: true,
                message:
                  'Customer type is required.',
              },
            ]}
          >
            <Select
              options={customerTypeOptions}
              placeholder="Select customer type"
              disabled={disabled}
              onChange={
                handleCustomerTypeChange
              }
            />
          </Form.Item>
        </Col>

        {customerType === 'individual' && (
          <>
            <Col xs={24} md={12}>
              <Form.Item
                name="firstname"
                label="First Name"
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message:
                      'First name is required.',
                  },
                  {
                    max: 50,
                    message:
                      'First name cannot exceed 50 characters.',
                  },
                ]}
              >
                <Input
                  placeholder="Enter first name"
                  disabled={disabled}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="lastname"
                label="Last Name"
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message:
                      'Last name is required.',
                  },
                  {
                    max: 50,
                    message:
                      'Last name cannot exceed 50 characters.',
                  },
                ]}
              >
                <Input
                  placeholder="Enter last name"
                  disabled={disabled}
                />
              </Form.Item>
            </Col>
          </>
        )}

        {customerType === 'company' && (
          <>
            <Col xs={24} md={12}>
              <Form.Item
                name="company_name"
                label="Company Name"
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message:
                      'Company name is required.',
                  },
                  {
                    max: 200,
                    message:
                      'Company name cannot exceed 200 characters.',
                  },
                ]}
              >
                <Input
                  placeholder="Enter company name"
                  disabled={disabled}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="tin_number"
                label="TIN Number"
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message:
                      'TIN number is required.',
                  },
                  {
                    max: 50,
                    message:
                      'TIN number cannot exceed 50 characters.',
                  },
                ]}
              >
                <Input
                  placeholder="Enter TIN number"
                  disabled={disabled}
                />
              </Form.Item>
            </Col>
          </>
        )}

        <Col xs={24} md={12}>
          <Form.Item
            name="email_address"
            label="Email Address"
            rules={[
              {
                type: 'email',
                message:
                  'Enter a valid email address.',
              },
              {
                max: 100,
                message:
                  'Email address cannot exceed 100 characters.',
              },
            ]}
          >
            <Input
              placeholder="Enter email address"
              disabled={disabled}
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            name="phone_number"
            label="Phone Number"
            rules={[
              {
                required: true,
                whitespace: true,
                message:
                  'Phone number is required.',
              },
              {
                max: 50,
                message:
                  'Phone number cannot exceed 50 characters.',
              },
            ]}
          >
            <Input
              placeholder="Enter phone number"
              disabled={disabled}
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            name="contact_person"
            label="Contact Person"
            rules={[
              {
                max: 100,
                message:
                  'Contact person cannot exceed 100 characters.',
              },
            ]}
          >
            <Input
              placeholder="Enter contact person"
              disabled={disabled}
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            name="location"
            label="Location"
            rules={[
              {
                required: true,
                whitespace: true,
                message:
                  'Location is required.',
              },
              {
                max: 100,
                message:
                  'Location cannot exceed 100 characters.',
              },
            ]}
          >
            <Input
              placeholder="Enter location"
              disabled={disabled}
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            name="withhold"
            label="Withhold?"
            rules={[
              {
                required: true,
                message:
                  'Please select Yes or No.',
              },
            ]}
          >
            <Select
              options={yesNoOptions}
              placeholder="Select"
              disabled={disabled}
              onChange={
                handleWithholdChange
              }
            />
          </Form.Item>
        </Col>

        {withhold === true && (
          <Col xs={24} md={12}>
            <Form.Item
              name="withhold_percent"
              label="Withhold Percentage"
              rules={[
                {
                  required: true,
                  message:
                    'Withhold percentage is required.',
                },
                {
                  validator: async (
                    _rule,
                    value,
                  ) => {
                    if (
                      value !== undefined
                      && value !== null
                      && value !== ''
                      && (
                        Number(value) < 0
                        || Number(value) > 100
                      )
                    ) {
                      throw new Error(
                        'Withhold percentage must be between 0 and 100.',
                      );
                    }
                  },
                },
              ]}
            >
              <InputNumber
                style={{
                  width: '100%',
                }}
                min={0}
                max={100}
                precision={2}
                stringMode
                addonAfter="%"
                placeholder="Enter withhold percentage"
                disabled={disabled}
              />
            </Form.Item>
          </Col>
        )}

        <Col xs={24} md={12}>
          <Form.Item
            name="withhold_from_advance"
            label="Withhold From Advance?"
            rules={[
              {
                required: true,
                message:
                  'Please select Yes or No.',
              },
            ]}
          >
            <Select
              options={yesNoOptions}
              placeholder="Select"
              disabled={disabled}
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            name="customer_status"
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
              options={statusOptions}
              placeholder="Select status"
              disabled={disabled}
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}

export default CustomerForm;
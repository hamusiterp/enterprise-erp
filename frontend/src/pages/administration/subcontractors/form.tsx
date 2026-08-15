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
  SubcontractorFormValues,
  SubcontractorType,
} from '../../../types/subcontractor';

const {
  TextArea,
} = Input;

interface CategoryOption {
  id: number;
  name: string;
}

interface SubcontractorFormProps {
  form: FormInstance<SubcontractorFormValues>;

  categories: CategoryOption[];

  categoriesLoading?: boolean;

  disabled?: boolean;

  readOnly?: boolean;
}

const typeOptions = [
  {
    label: 'Company',
    value: 'company',
  },
  {
    label: 'Individual',
    value: 'individual',
  },
];

const taxOptions = [
  {
    label: '0%',
    value: 0,
  },
  {
    label: '2%',
    value: 2,
  },
  {
    label: '10%',
    value: 10,
  },
  {
    label: '15%',
    value: 15,
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

function SubcontractorForm({
  form,
  categories,
  categoriesLoading = false,
  disabled = false,
  readOnly = false,
}: SubcontractorFormProps) {
  const subcontractorType =
    Form.useWatch(
      'type',
      form,
    ) as SubcontractorType | undefined;

  const isCompany =
    subcontractorType === 'company';

  const isIndividual =
    subcontractorType === 'individual';

  const handleTypeChange = (
    type: SubcontractorType,
  ) => {
    if (type === 'company') {
      form.setFieldsValue({
        firstname: null,
        lastname: null,
      });

      form.setFields([
        {
          name: 'firstname',
          errors: [],
        },
        {
          name: 'lastname',
          errors: [],
        },
      ]);
    }

    if (type === 'individual') {
      form.setFieldsValue({
        company_name: null,
        tin_no: null,
      });

      form.setFields([
        {
          name: 'company_name',
          errors: [],
        },
        {
          name: 'tin_no',
          errors: [],
        },
      ]);
    }
  };

  return (
    <Form<SubcontractorFormValues>
      form={form}
      layout="vertical"
      requiredMark
      initialValues={{
        type: 'company',
        tax_percent: 0,
        status: 'active',
      }}
    >
      <Row gutter={[16, 0]}>
        {/* Type */}

        <Col
          xs={24}
          md={12}
        >
          <Form.Item
            name="type"
            label="Type"
            rules={[
              {
                required: true,
                message:
                  'Subcontractor type is required.',
              },
            ]}
          >
            <Select
              placeholder="Select type"
              options={typeOptions}
              disabled={
                disabled || readOnly
              }
              onChange={
                handleTypeChange
              }
            />
          </Form.Item>
        </Col>

        {/* Category */}

        <Col
          xs={24}
          md={12}
        >
          <Form.Item
            name="category_id"
            label="Category"
            rules={[
              {
                required: true,
                message:
                  'Category is required.',
              },
            ]}
          >
            <Select
              showSearch
              allowClear
              optionFilterProp="label"
              placeholder="Select category"
              loading={
                categoriesLoading
              }
              disabled={
                disabled || readOnly
              }
              options={categories.map(
                (category) => ({
                  label:
                    category.name,
                  value:
                    category.id,
                }),
              )}
            />
          </Form.Item>
        </Col>

        {/* First Name */}

        <Col
          xs={24}
          md={12}
        >
          <Form.Item
            name="firstname"
            label="First Name"
            rules={[
              {
                required:
                  isIndividual,
                message:
                  'First name is required.',
              },
              {
                max: 100,
                message:
                  'First name cannot exceed 100 characters.',
              },
            ]}
          >
            <Input
              placeholder={
                isCompany
                  ? 'Not applicable for company'
                  : 'Enter first name'
              }
              disabled={
                disabled
                || readOnly
                || isCompany
              }
              maxLength={100}
            />
          </Form.Item>
        </Col>

        {/* Last Name */}

        <Col
          xs={24}
          md={12}
        >
          <Form.Item
            name="lastname"
            label="Last Name"
            rules={[
              {
                required:
                  isIndividual,
                message:
                  'Last name is required.',
              },
              {
                max: 100,
                message:
                  'Last name cannot exceed 100 characters.',
              },
            ]}
          >
            <Input
              placeholder={
                isCompany
                  ? 'Not applicable for company'
                  : 'Enter last name'
              }
              disabled={
                disabled
                || readOnly
                || isCompany
              }
              maxLength={100}
            />
          </Form.Item>
        </Col>

        {/* Company Name */}

        <Col
          xs={24}
          md={12}
        >
          <Form.Item
            name="company_name"
            label="Company Name"
            rules={[
              {
                required:
                  isCompany,
                message:
                  'Company name is required.',
              },
              {
                max: 150,
                message:
                  'Company name cannot exceed 150 characters.',
              },
            ]}
          >
            <Input
              placeholder={
                isIndividual
                  ? 'Not applicable for individual'
                  : 'Enter company name'
              }
              disabled={
                disabled
                || readOnly
                || isIndividual
              }
              maxLength={150}
            />
          </Form.Item>
        </Col>

        {/* TIN */}

        <Col
          xs={24}
          md={12}
        >
          <Form.Item
            name="tin_no"
            label="TIN Number"
            rules={[
              {
                required:
                  isCompany,
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
              placeholder={
                isIndividual
                  ? 'Not applicable for individual'
                  : 'Enter TIN number'
              }
              disabled={
                disabled
                || readOnly
                || isIndividual
              }
              maxLength={50}
            />
          </Form.Item>
        </Col>

        {/* Contact Person */}

        <Col
          xs={24}
          md={12}
        >
          <Form.Item
            name="contact_person"
            label="Contact Person"
            rules={[
              {
                required: true,
                whitespace: true,
                message:
                  'Contact person is required.',
              },
              {
                max: 100,
                message:
                  'Contact person cannot exceed 100 characters.',
              },
            ]}
          >
            <Input
              placeholder="Enter contact person"
              disabled={
                disabled || readOnly
              }
              maxLength={100}
            />
          </Form.Item>
        </Col>

        {/* Phone */}

        <Col
          xs={24}
          md={12}
        >
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
                max: 100,
                message:
                  'Phone number cannot exceed 100 characters.',
              },
            ]}
          >
            <Input
              placeholder="Enter phone number"
              disabled={
                disabled || readOnly
              }
              maxLength={100}
            />
          </Form.Item>
        </Col>

        {/* Tax */}

        <Col
          xs={24}
          md={12}
        >
          <Form.Item
            name="tax_percent"
            label="Tax Percent"
            rules={[
              {
                required: true,
                message:
                  'Tax percent is required.',
              },
            ]}
          >
            <Select
              placeholder="Select tax percent"
              options={taxOptions}
              disabled={
                disabled || readOnly
              }
            />
          </Form.Item>
        </Col>

        {/* Status */}

        <Col
          xs={24}
          md={12}
        >
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
              placeholder="Select status"
              options={statusOptions}
              disabled={
                disabled || readOnly
              }
            />
          </Form.Item>
        </Col>

        {/* Address */}

        <Col xs={24}>
          <Form.Item
            name="address"
            label="Address"
            rules={[
              {
                required: true,
                whitespace: true,
                message:
                  'Address is required.',
              },
            ]}
          >
            <TextArea
              rows={3}
              placeholder="Enter address"
              disabled={
                disabled || readOnly
              }
              maxLength={1000}
              showCount={
                !readOnly
              }
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}

export default SubcontractorForm;
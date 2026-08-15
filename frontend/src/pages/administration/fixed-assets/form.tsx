import {
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  Typography,
  Upload,
} from 'antd';

import {
  FilePdfOutlined,
  InboxOutlined,
} from '@ant-design/icons';

import type {
  FormInstance,
  UploadFile,
  UploadProps,
} from 'antd';

import dayjs from 'dayjs';

import type {
  FixedAssetCategory,
  FixedAssetFormValues,
} from '../../../types/fixedAsset';

const {
  Text,
  Title,
} = Typography;

const {
  Dragger,
} = Upload;

interface FixedAssetFormProps {
  form: FormInstance<FixedAssetFormValues>;
  categories: FixedAssetCategory[];
  categoriesLoading?: boolean;
  disabled?: boolean;
  requireFiles?: boolean;
}

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

const assetConditionOptions = [
  {
    label: 'Excellent',
    value: 'excellent',
  },
  {
    label: 'Good',
    value: 'good',
  },
  {
    label: 'Fair',
    value: 'fair',
  },
  {
    label: 'Poor',
    value: 'poor',
  },
  {
    label: 'Out of Service',
    value: 'out_of_service',
  },
];

const readingTypeOptions = [
  {
    label: 'Engine Horse Power',
    value: 'engine_horse_power',
  },
  {
    label: 'KM Reading',
    value: 'km_reading',
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

const fuelTypeOptions = [
  {
    label: 'Diesel',
    value: 'Diesel',
  },
  {
    label: 'Petrol',
    value: 'Petrol',
  },
  {
    label: 'Electric',
    value: 'Electric',
  },
  {
    label: 'Hybrid',
    value: 'Hybrid',
  },
  {
    label: 'Gas',
    value: 'Gas',
  },
  {
    label: 'Other',
    value: 'Other',
  },
];

const fullWidth = {
  width: '100%',
};

function normalizeUploadEvent(
  event:
    | {
        fileList?: UploadFile[];
      }
    | UploadFile[],
): UploadFile[] {
  if (Array.isArray(event)) {
    return event;
  }

  return event?.fileList ?? [];
}

function disableFutureDates(
  currentDate: dayjs.Dayjs,
): boolean {
  return currentDate.isAfter(
    dayjs().endOf('day'),
  );
}

const imageUploadProps: UploadProps = {
  beforeUpload: () => false,
  maxCount: 1,
  listType: 'picture',
  accept: '.jpg,.jpeg,.png,.webp,image/*',
};

const pdfUploadProps: UploadProps = {
  beforeUpload: () => false,
  maxCount: 1,
  accept: '.pdf,application/pdf',
};

function SectionTitle({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div
      style={{
        marginBottom: 18,
      }}
    >
      <Title
        level={4}
        style={{
          marginBottom: 2,
        }}
      >
        {title}
      </Title>

      {description && (
        <Text type="secondary">
          {description}
        </Text>
      )}
    </div>
  );
}

function FixedAssetForm({
  form,
  categories,
  categoriesLoading = false,
  disabled = false,
  requireFiles = false,
}: FixedAssetFormProps) {
  const hasGauge = Form.useWatch(
    'has_gauge',
    form,
  );

  const readingType = Form.useWatch(
    'reading_type',
    form,
  );

  const handleGaugeChange = (
    value: boolean,
  ) => {
    if (!value) {
      form.setFieldValue(
        'gauge_reading',
        null,
      );
    }
  };

  return (
    <Form<FixedAssetFormValues>
      form={form}
      layout="vertical"
      requiredMark
      initialValues={{
        status: 'active',
        asset_condition: 'good',
        has_gauge: false,
        reading_type: 'km_reading',
      }}
    >
      <Space
        direction="vertical"
        size={20}
        style={{
          width: '100%',
        }}
      >
        <Card>
          <SectionTitle
            title="General Information"
            description="Basic identification and classification of the fixed asset."
          />

          <Row gutter={[16, 0]}>
            <Col xs={24} md={8}>
              <Form.Item
                name="asset_no"
                label="Asset Number"
              >
                <Input
                  disabled
                  placeholder="Generated automatically"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                name="tag_no"
                label="Tag Number"
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message:
                      'Tag number is required.',
                  },
                  {
                    max: 50,
                    message:
                      'Tag number cannot exceed 50 characters.',
                  },
                ]}
              >
                <Input
                  disabled={disabled}
                  placeholder="Enter tag number"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                name="vehicle_no"
                label="Vehicle Number"
                rules={[
                    {
                    required: true,
                    whitespace: true,
                    message: 'Vehicle number is required.',
                    },
                  {
                    max: 50,
                    message:
                      'Vehicle number cannot exceed 50 characters.',
                  },
                ]}
              >
                <Input
                  disabled={disabled}
                  placeholder="Enter vehicle number"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                name="plate_no"
                label="Plate Number"
                rules={[
                    {
                    required: true,
                    whitespace: true,
                    message: 'Plate number is required.',
                    },
                  {
                    max: 50,
                    message:
                      'Plate number cannot exceed 50 characters.',
                  },
                ]}
              >
                <Input
                  disabled={disabled}
                  placeholder="Enter plate number"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                name="category_id"
                label="Category"
                rules={[
                  {
                    required: true,
                    message:
                      'Fixed asset category is required.',
                  },
                ]}
              >
                <Select
                  showSearch
                  allowClear
                  optionFilterProp="label"
                  loading={categoriesLoading}
                  disabled={disabled}
                  placeholder="Select machine category"
                  options={categories.map(
                    (category) => ({
                      label: category.name,
                      value: category.id,
                    }),
                  )}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                name="name_of_machinery"
                label="Name of Machinery"
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message:
                      'Name of machinery is required.',
                  },
                  {
                    max: 200,
                    message:
                      'Name cannot exceed 200 characters.',
                  },
                ]}
              >
                <Input
                  disabled={disabled}
                  placeholder="Enter machinery or vehicle name"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                name="make_of_vehicle"
                label="Make of Vehicle"
                rules={[
                    {
                    required: true,
                    whitespace: true,
                    message:
                        'Make of vehicle is required.',
                    },
                  {
                    max: 100,
                  },
                ]}
              >
                <Input
                  disabled={disabled}
                  placeholder="Example: Toyota"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                name="model"
                label="Model"
                rules={[
                    {
      required: true,
      whitespace: true,
      message: 'Model is required.',
    },
                  {
                    max: 100,
                  },
                ]}
              >
                <Input
                  disabled={disabled}
                  placeholder="Enter model"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                name="make_of_year"
                label="Make Year"
                rules={[
                    {
      required: true,
      whitespace: true,
      message: 'Make year is required.',
    },
                  {
                    max: 20,
                  },
                ]}
              >
                <Input
                  disabled={disabled}
                  placeholder="Example: 2024"
                  maxLength={20}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                name="asset_condition"
                label="Asset Condition"
                rules={[
                  {
                    required: true,
                    message:
                      'Asset condition is required.',
                  },
                ]}
              >
                <Select
                  disabled={disabled}
                  options={
                    assetConditionOptions
                  }
                  placeholder="Select condition"
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
                    message:
                      'Status is required.',
                  },
                ]}
              >
                <Select
                  disabled={disabled}
                  options={statusOptions}
                  placeholder="Select status"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                name="current_location"
                label="Current Location"
                rules={[
                  {
                    max: 200,
                  },
                ]}
              >
                <Input
                  disabled={disabled}
                  placeholder="Enter current location"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                name="assigned_to"
                label="Assigned To"
                rules={[
                  {
                    max: 200,
                  },
                ]}
              >
                <Input
                  disabled={disabled}
                  placeholder="Enter employee, project or department"
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card>
          <SectionTitle
            title="Engine and Technical Information"
            description="Engine, chassis, horsepower and fuel details."
          />

          <Row gutter={[16, 0]}>
            <Col xs={24} md={8}>
              <Form.Item
                name="chassis_no"
                label="Chassis Number"
                rules={[
                    {
    required: true,
    whitespace: true,
    message: 'Chassis number is required.',
  },
                  {
                    max: 100,
                  },
                ]}
              >
                <Input
                  disabled={disabled}
                  placeholder="Enter chassis number"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                name="engine_no"
                label="Engine Number"
                rules={[
                    {
    required: true,
    whitespace: true,
    message: 'Engine number is required.',
  },
                  {
                    max: 100,
                  },
                ]}
              >
                <Input
                  disabled={disabled}
                  placeholder="Enter engine number"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                name="engine_model"
                label="Engine Model"
                rules={[
                    {
    required: true,
    whitespace: true,
    message: 'Engine Model is required.',
  },
                  {
                    max: 100,
                  },
                ]}
              >
                <Input
                  disabled={disabled}
                  placeholder="Enter engine model"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                name="make_of_engine"
                label="Make of Engine"
                rules={[
                    {
    required: true,
    whitespace: true,
    message: 'Make of Engine is required.',
  },
                  {
                    max: 100,
                  },
                ]}
              >
                <Input
                  disabled={disabled}
                  placeholder="Enter engine manufacturer"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                name="horse_power"
                label="Horse Power"
                rules={[
  {
    required: true,
    message: 'Horse power is required.',
  },
]}
              >
                <InputNumber
                  style={fullWidth}
                  min={0}
                  precision={2}
                  stringMode
                  disabled={disabled}
                  placeholder="Enter horse power"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                name="type_of_fuel"
                label="Fuel Type"
                rules={[
  {
    required: true,
    message: 'Fuel type is required.',
  },
]}
              >
                <Select
                  showSearch
                  allowClear
                  disabled={disabled}
                  options={fuelTypeOptions}
                  placeholder="Select fuel type"
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card>
          <SectionTitle
            title="Reading, Fuel and Gauge"
            description="Current reading, fuel consumption and gauge information."
          />

          <Row gutter={[16, 0]}>
            <Col xs={24} md={8}>
              <Form.Item
                name="reading_type"
                label="Reading Type"
                rules={[
                  {
                    required: true,
                    message:
                      'Reading type is required.',
                  },
                ]}
              >
                <Select
                  disabled={disabled}
                  options={readingTypeOptions}
                  placeholder="Select reading type"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                name="reading"
                label={
                  readingType ===
                  'engine_horse_power'
                    ? 'Engine Horse Power Reading'
                    : 'KM Reading'
                }
                rules={[
                  {
                    required: true,
                    message:
                      'Current reading is required.',
                  },
                ]}
              >
                <InputNumber
                  style={fullWidth}
                  min={0}
                  precision={2}
                  stringMode
                  disabled={disabled}
                  addonAfter={
                    readingType ===
                    'engine_horse_power'
                      ? 'HP'
                      : 'KM'
                  }
                  placeholder="Enter current reading"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                name="consumption"
                label="Current Consumption"
              >
                <InputNumber
                  style={fullWidth}
                  min={0}
                  precision={2}
                  stringMode
                  disabled={disabled}
                  placeholder="Enter consumption"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                name="standard_consumption"
                label="Standard Consumption"
              >
                <InputNumber
                  style={fullWidth}
                  min={0}
                  precision={2}
                  stringMode
                  disabled={disabled}
                  placeholder="Enter standard consumption"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                name="tanker_capacity"
                label="Tank Capacity"
                rules={[
  {
    required: true,
    message: 'Tank capacity is required.',
  },
]}
              >
                <InputNumber
                  style={fullWidth}
                  min={0}
                  precision={2}
                  stringMode
                  disabled={disabled}
                  addonAfter="Litre"
                  placeholder="Enter tank capacity"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                name="last_refill"
                label="Last Refill Date"
                getValueProps={(value) => ({
                  value: value
                    ? dayjs(value)
                    : null,
                })}
                normalize={(value) =>
                  value
                    ? value.format(
                        'YYYY-MM-DD',
                      )
                    : null
                }
              >
                <DatePicker
                  style={fullWidth}
                  format="YYYY-MM-DD"
                  disabledDate={
                    disableFutureDates
                  }
                  disabled={disabled}
                  placeholder="Select last refill date"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                name="has_gauge"
                label="Have Gauge?"
                rules={[
                  {
                    required: true,
                    message:
                      'Please select Yes or No.',
                  },
                ]}
              >
                <Select
                  disabled={disabled}
                  options={yesNoOptions}
                  placeholder="Select"
                  onChange={
                    handleGaugeChange
                  }
                />
              </Form.Item>
            </Col>

            {hasGauge === true && (
              <Col xs={24} md={8}>
                <Form.Item
                  name="gauge_reading"
                  label="Gauge Reading"
                  rules={[
                    {
                      required: true,
                      message:
                        'Gauge reading is required.',
                    },
                  ]}
                >
                  <InputNumber
                    style={fullWidth}
                    min={0}
                    precision={2}
                    stringMode
                    disabled={disabled}
                    placeholder="Enter gauge reading"
                  />
                </Form.Item>
              </Col>
            )}
          </Row>
        </Card>

        <Card>
          <SectionTitle
            title="Service and Important Dates"
            description="Purchase, service, licence, inspection and insurance dates."
          />

          <Row gutter={[16, 0]}>
            <Col xs={24} md={8}>
              <Form.Item
                name="purchase_date"
                label="Purchase Date"
                rules={[
                  {
                    required: true,
                    message:
                      'Purchase date is required.',
                  },
                ]}
                getValueProps={(value) => ({
                  value: value
                    ? dayjs(value)
                    : null,
                })}
                normalize={(value) =>
                  value
                    ? value.format(
                        'YYYY-MM-DD',
                      )
                    : null
                }
              >
                <DatePicker
                  style={fullWidth}
                  format="YYYY-MM-DD"
                  disabledDate={
                    disableFutureDates
                  }
                  disabled={disabled}
                  placeholder="Select purchase date"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                name="licence_renewal_date"
                label="Licence Renewal Date"
                rules={[
  {
    required: true,
    message: 'This date is required.',
  },
]}
                getValueProps={(value) => ({
                  value: value
                    ? dayjs(value)
                    : null,
                })}
                normalize={(value) =>
                  value
                    ? value.format(
                        'YYYY-MM-DD',
                      )
                    : null
                }
              >
                <DatePicker
                  style={fullWidth}
                  format="YYYY-MM-DD"
                  disabled={disabled}
                  placeholder="Select licence renewal date"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                name="last_inspection_renewal_date"
                label="Last Inspection Renewal Date"
                rules={[
  {
    required: true,
    message: 'This date is required.',
  },
]}
                getValueProps={(value) => ({
                  value: value
                    ? dayjs(value)
                    : null,
                })}
                normalize={(value) =>
                  value
                    ? value.format(
                        'YYYY-MM-DD',
                      )
                    : null
                }
              >
                <DatePicker
                  style={fullWidth}
                  format="YYYY-MM-DD"
                  disabledDate={
                    disableFutureDates
                  }
                  disabled={disabled}
                  placeholder="Select last inspection date"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                name="last_insurance_renewal_date"
                label="Last Insurance Renewal Date"
                rules={[
  {
    required: true,
    message: 'This date is required.',
  },
]}
                getValueProps={(value) => ({
                  value: value
                    ? dayjs(value)
                    : null,
                })}
                normalize={(value) =>
                  value
                    ? value.format(
                        'YYYY-MM-DD',
                      )
                    : null
                }
              >
                <DatePicker
                  style={fullWidth}
                  format="YYYY-MM-DD"
                  disabledDate={
                    disableFutureDates
                  }
                  disabled={disabled}
                  placeholder="Select last insurance date"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                name="service_interval"
                label="Service Interval"
                extra="Enter service interval in KM or operating hours."
              >
                <InputNumber
                  style={fullWidth}
                  min={0}
                  precision={0}
                  disabled={disabled}
                  placeholder="Enter service interval"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                name="last_service"
                label="Last Service Date"
                rules={[
  {
    required: true,
    message: 'This date is required.',
  },
]}
                getValueProps={(value) => ({
                  value: value
                    ? dayjs(value)
                    : null,
                })}
                normalize={(value) =>
                  value
                    ? value.format(
                        'YYYY-MM-DD',
                      )
                    : null
                }
              >
                <DatePicker
                  style={fullWidth}
                  format="YYYY-MM-DD"
                  disabledDate={
                    disableFutureDates
                  }
                  disabled={disabled}
                  placeholder="Select last service date"
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card>
          <SectionTitle
            title="Asset Photos"
            description="Upload one image for each side of the asset. Maximum size is 5 MB per image."
          />

          <Row gutter={[16, 16]}>
            {[
              {
                name: 'front_view_photo',
                label: 'Front View Photo',
              },
              {
                name: 'rear_view_photo',
                label: 'Rear View Photo',
              },
              {
                name: 'right_side_view_photo',
                label: 'Right-Side View Photo',
              },
              {
                name: 'left_side_view_photo',
                label: 'Left-Side View Photo',
              },
            ].map((item) => (
              <Col
                xs={24}
                md={12}
                key={item.name}
              >
                <Form.Item
                  name={item.name}
                  label={item.label}
                  valuePropName="fileList"
                  getValueFromEvent={
                    normalizeUploadEvent
                  }
                  rules={[
  {
    validator: async (_, fileList) => {
      if (
        requireFiles &&
        (!fileList || fileList.length === 0)
      ) {
        throw new Error(
          `${item.label} is required.`,
        );
      }
    },
  },
]}
                >
                  <Dragger
                    {...imageUploadProps}
                    disabled={disabled}
                  >
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>

                    <p className="ant-upload-text">
                      Click or drag image here
                    </p>

                    <p className="ant-upload-hint">
                      JPG, PNG or WEBP — maximum 5 MB
                    </p>
                  </Dragger>
                </Form.Item>
              </Col>
            ))}
          </Row>
        </Card>

        <Card>
          <SectionTitle
            title="Asset Documents"
            description="Upload PDF copies of the Libre, inspection and insurance documents."
          />

          <Row gutter={[16, 16]}>
            {[
              {
                name: 'libre_document',
                label: 'Libre Document',
              },
              {
                name: 'inspection_document',
                label: 'Inspection Document',
              },
              {
                name: 'insurance_document',
                label: 'Insurance Document',
              },
            ].map((item) => (
              <Col
                xs={24}
                md={8}
                key={item.name}
              >
                <Form.Item
                  name={item.name}
                  label={item.label}
                  valuePropName="fileList"
                  getValueFromEvent={
                    normalizeUploadEvent
                  }
                  rules={[
  {
    validator: async (_, fileList) => {
      if (
        requireFiles &&
        (!fileList || fileList.length === 0)
      ) {
        throw new Error(
          `${item.label} is required.`,
        );
      }
    },
  },
]}
                >
                  <Dragger
                    {...pdfUploadProps}
                    disabled={disabled}
                  >
                    <p className="ant-upload-drag-icon">
                      <FilePdfOutlined />
                    </p>

                    <p className="ant-upload-text">
                      Upload PDF
                    </p>

                    <p className="ant-upload-hint">
                      PDF only — maximum 10 MB
                    </p>
                  </Dragger>
                </Form.Item>
              </Col>
            ))}
          </Row>
        </Card>

        <Card>
          <SectionTitle
            title="Remarks"
          />

          <Form.Item
            name="remarks"
            label="Additional Remarks"
            rules={[
              {
                max: 5000,
                message:
                  'Remarks cannot exceed 5,000 characters.',
              },
            ]}
          >
            <Input.TextArea
              rows={5}
              disabled={disabled}
              placeholder="Enter additional asset information"
            />
          </Form.Item>
        </Card>
      </Space>
    </Form>
  );
}

export default FixedAssetForm;
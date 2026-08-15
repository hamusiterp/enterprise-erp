import {
  Col,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Select,
  Spin,
  Tabs,
  DatePicker,
  Checkbox,
} from 'antd';

import type {
  FormInstance,
  TabsProps,
} from 'antd';

import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  projectsApi,
} from '../../../api/projects';

import type {
  BidProjectOption,
  CustomerOption,
  ProjectFormValues,
  ProjectSource,
  WorkOrderProjectOption,
} from '../../../types/project';

import dayjs from 'dayjs';

interface ProjectFormProps {
  form: FormInstance<ProjectFormValues>;
  disabled?: boolean;
}

const projectSourceOptions = [
  {
    label: 'Bid',
    value: 'Bid',
  },
  {
    label: 'Work Order',
    value: 'Work Order',
  },
];

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

const constructionProjectTypeOptions = [
  {
    label: 'Private Project',
    value: 'Private Project',
  },
  {
    label: 'Federal Project',
    value: 'Federal Project',
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

const businessUnitOptions = [
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

const contractTypeOptions = [
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

const contractPricingTypeOptions = [
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

const paymentTermOptions = [
  {
    label: 'Cash on Delivery',
    value: 'cash_on_delivery',
  },
  {
    label: 'Payment After Work Executed',
    value: 'after_work_executed',
  },
];

const advanceRepaymentStartOptions = [
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

const bondTypeOptions = [
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

const engineeringFacilityOptions = [
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

function ProjectForm({
  form,
  disabled = false,
}: ProjectFormProps) {
  const [
    bidOptions,
    setBidOptions,
  ] = useState<BidProjectOption[]>([]);

  const [
    workOrderOptions,
    setWorkOrderOptions,
  ] = useState<
    WorkOrderProjectOption[]
  >([]);

  const [
    customerOptions,
    setCustomerOptions,
  ] = useState<CustomerOption[]>([]);

  const [
    sourceLoading,
    setSourceLoading,
  ] = useState(false);

  const [
    customerLoading,
    setCustomerLoading,
  ] = useState(false);

  const projectSource =
    Form.useWatch(
      'project_source',
      form,
    );

  const hasConsultant =
    Form.useWatch(
      'has_consultant',
      form,
    );

  const hasSpecifiedArea =
    Form.useWatch(
      'has_specified_area',
      form,
    );

    const hasSiteHandoverDate =
  Form.useWatch(
    'has_site_handover_date',
    form,
  );

const hasCommencementDate =
  Form.useWatch(
    'has_commencement_date',
    form,
  );

const durationType =
  Form.useWatch(
    'duration_type',
    form,
  );

  const hasAdvancePayment =
  Form.useWatch(
    'has_advance_payment',
    form,
  );

const hasAdvanceRepayment =
  Form.useWatch(
    'has_advance_repayment',
    form,
  );

  const hasAdvanceBond =
  Form.useWatch(
    'has_advance_bond',
    form,
  );

const hasPerformanceBond =
  Form.useWatch(
    'has_performance_bond',
    form,
  );

  const hasPriceAdjustment =
  Form.useWatch(
    'has_price_adjustment',
    form,
  );

const hasRetention =
  Form.useWatch(
    'has_retention',
    form,
  );

const hasLiquidityDamage =
  Form.useWatch(
    'has_liquidity_damage',
    form,
  );

  const loadCustomers =
    useCallback(async () => {
      setCustomerLoading(true);

      try {
        const customers =
          await projectsApi
            .customerOptions();

        setCustomerOptions(
          customers,
        );
      } catch (error) {
        console.error(
          'Unable to load customers.',
          error,
        );

        setCustomerOptions([]);
      } finally {
        setCustomerLoading(false);
      }
    }, []);

  useEffect(() => {
    void loadCustomers();
  }, [loadCustomers]);

  useEffect(() => {
    const loadSourceOptions =
      async () => {
        if (!projectSource) {
          setBidOptions([]);
          setWorkOrderOptions([]);
          return;
        }

        setSourceLoading(true);

        try {
          if (
            projectSource === 'Bid'
          ) {
            const options =
              await projectsApi
                .bidOptions();

            setBidOptions(options);
            setWorkOrderOptions([]);
          }

          if (
            projectSource ===
            'Work Order'
          ) {
            const options =
              await projectsApi
                .workOrderOptions();

            setWorkOrderOptions(
              options,
            );

            setBidOptions([]);
          }
        } catch (error) {
          console.error(
            'Unable to load project source options.',
            error,
          );

          setBidOptions([]);
          setWorkOrderOptions([]);
        } finally {
          setSourceLoading(false);
        }
      };

    void loadSourceOptions();
  }, [projectSource]);

  const handleSiteHandoverChange = (
  value: 'Yes' | 'No',
) => {
  if (value === 'No') {
    form.setFieldValue(
      'site_handover_date',
      null,
    );
  }
};

const handleCommencementChange = (
  value: 'Yes' | 'No',
) => {
  if (value === 'No') {
    form.setFieldValue(
      'commencement_date',
      null,
    );
  }
};

const handleDurationTypeChange = (
  value:
    | 'working_days'
    | 'calendar_days',
) => {
  if (value === 'calendar_days') {
    form.setFieldValue(
      'no_of_holidays',
      null,
    );
  }
};

  const handleSourceChange = (
    source: ProjectSource,
  ) => {
    form.setFieldsValue({
      project_source: source,
      bid_reference: null,
      work_order_no: null,
    });
  };

  const handleBidChange = (
    bidId?: string,
  ) => {
    if (!bidId) {
      form.setFieldValue(
        'bid_reference',
        null,
      );

      return;
    }

    const selectedBid =
      bidOptions.find(
        (bid) =>
          bid.value === bidId,
      );

    if (!selectedBid) {
      return;
    }

    form.setFieldsValue({
      bid_reference:
        selectedBid.value,

      location:
        selectedBid
          .place_of_project
        || '',
    });
  };

  const handleAdvanceBondChange = (
  value: 'Yes' | 'No',
) => {
  if (value === 'No') {
    form.setFieldsValue({
      advance_bond_percent: null,
      advance_bond_type: null,
      advance_bond_start_date: null,
      advance_bond_end_date: null,
    });
  }
};

const handlePerformanceBondChange = (
  value: 'Yes' | 'No',
) => {
  if (value === 'No') {
    form.setFieldsValue({
      performance_bond_percent: null,
      performance_bond_type: null,
      performance_bond_start_date: null,
      performance_bond_end_date: null,
    });
  }
};

  const handleWorkOrderChange = (
    workOrderNumber?: string,
  ) => {
    if (!workOrderNumber) {
      form.setFieldValue(
        'work_order_no',
        null,
      );

      return;
    }

    const selectedWorkOrder =
      workOrderOptions.find(
        (workOrder) =>
          workOrder.work_order_no
          === workOrderNumber,
      );

    if (!selectedWorkOrder) {
      return;
    }

    form.setFieldsValue({
      work_order_no:
        selectedWorkOrder
          .work_order_no,

      project_name:
        selectedWorkOrder.project
        || '',

      project_description:
        selectedWorkOrder
          .type_of_work
        || '',

      location:
        selectedWorkOrder
          .work_location
        || '',
    });
  };

  const handlePriceAdjustmentChange = (
  value: 'Yes' | 'No',
) => {
  if (value === 'No') {
    form.setFieldValue(
      'price_adjustment_percent',
      null,
    );
  }
};

const handleRetentionChange = (
  value: 'Yes' | 'No',
) => {
  if (value === 'No') {
    form.setFieldValue(
      'retention_percent',
      null,
    );
  }
};

const handleLiquidityDamageChange = (
  value: 'Yes' | 'No',
) => {
  if (value === 'No') {
    form.setFieldsValue({
      liquidity_percent: null,
      liquidity_limit: null,
    });
  }
};

  const handleCustomerChange = (
    customerId?: number,
  ) => {
    if (!customerId) {
      form.setFieldsValue({
        customer_id: undefined,
        employer: '',
      });

      return;
    }

    const selectedCustomer =
      customerOptions.find(
        (customer) =>
          customer.id === customerId,
      );

    form.setFieldsValue({
      customer_id: customerId,

      employer:
        selectedCustomer?.name
        ?? '',
    });
  };

  const handleConsultantChange = (
    value: 'Yes' | 'No',
  ) => {
    if (value === 'No') {
      form.setFieldValue(
        'consultant',
        null,
      );
    }
  };

  const handleSpecifiedAreaChange = (
    value: 'Yes' | 'No',
  ) => {
    if (value === 'No') {
      form.setFieldValue(
        'area',
        null,
      );
    }
  };

  const handleAdvancePaymentChange = (
  value: 'Yes' | 'No',
) => {
  if (value === 'No') {
    form.setFieldValue(
      'advance_percent',
      null,
    );
  }
};

const handleAdvanceRepaymentChange = (
  value: 'Yes' | 'No',
) => {
  if (value === 'No') {
    form.setFieldsValue({
      advance_repayment_complete_percent:
        null,

      advance_repayment_percent:
        null,

      advance_repayment_start:
        null,
    });
  }
};

  const basicInformationTab = (
    <Row gutter={[16, 0]}>
      <Col xs={24} md={8}>
        <Form.Item
          name="project_no"
          label="Project Number"
        >
          <Input
            placeholder="Generated automatically"
            disabled
          />
        </Form.Item>
      </Col>

      <Col xs={24} md={8}>
        <Form.Item
          name="project_source"
          label="Project Source"
          rules={[
            {
              required: true,
              message:
                'Project source is required.',
            },
          ]}
        >
          <Select
            options={
              projectSourceOptions
            }
            placeholder="Select project source"
            disabled={disabled}
            onChange={
              handleSourceChange
            }
          />
        </Form.Item>
      </Col>

      {projectSource === 'Bid' && (
        <Col xs={24} md={8}>
          <Form.Item
            name="bid_reference"
            label="Bid Reference"
            rules={[
              {
                required: true,
                message:
                  'Bid reference is required.',
              },
            ]}
          >
            <Select
              showSearch
              allowClear
              options={bidOptions}
              optionFilterProp="label"
              placeholder="Select approved winning bid"
              loading={sourceLoading}
              disabled={disabled}
              onChange={
                handleBidChange
              }
              notFoundContent={
                sourceLoading
                  ? <Spin size="small" />
                  : 'No eligible bids found'
              }
            />
          </Form.Item>
        </Col>
      )}

      {projectSource ===
        'Work Order' && (
        <Col xs={24} md={8}>
          <Form.Item
            name="work_order_no"
            label="Work Order"
            rules={[
              {
                required: true,
                message:
                  'Work order is required.',
              },
            ]}
          >
            <Select
              showSearch
              allowClear
              options={
                workOrderOptions
              }
              optionFilterProp="label"
              placeholder="Select approved work order"
              loading={sourceLoading}
              disabled={disabled}
              onChange={
                handleWorkOrderChange
              }
              notFoundContent={
                sourceLoading
                  ? <Spin size="small" />
                  : 'No eligible work orders found'
              }
            />
          </Form.Item>
        </Col>
      )}

      <Col xs={24}>
        <Form.Item
          name="project_name"
          label="Project Name"
          rules={[
            {
              required: true,
              whitespace: true,
              message:
                'Project name is required.',
            },
            {
              max: 1000,
              message:
                'Project name cannot exceed 1000 characters.',
            },
          ]}
        >
          <Input
            placeholder="Enter project name"
            disabled={disabled}
          />
        </Form.Item>
      </Col>

      <Col xs={24}>
        <Form.Item
          name="project_description"
          label="Project Description"
          rules={[
            {
              required: true,
              whitespace: true,
              message:
                'Project description is required.',
            },
            {
              max: 5000,
              message:
                'Project description cannot exceed 5000 characters.',
            },
          ]}
        >
          <Input.TextArea
            rows={4}
            showCount
            maxLength={5000}
            placeholder="Enter project description"
            disabled={disabled}
          />
        </Form.Item>
      </Col>

      <Col xs={24}>
        <Form.Item
          name="location"
          label="Project Location"
          rules={[
            {
              required: true,
              whitespace: true,
              message:
                'Project location is required.',
            },
            {
              max: 2000,
              message:
                'Project location cannot exceed 2000 characters.',
            },
          ]}
          extra="Enter Project Location"
        >
          <Input
            placeholder="Enter project location"
            disabled={disabled}
          />
        </Form.Item>
      </Col>

      <Col xs={24}>
        <Form.Item
          name="customer_id"
          label="Client/Employer"
          rules={[
            {
              required: true,
              message:
                'Client/Employer is required.',
            },
          ]}
        >
          <Select
            showSearch
            allowClear
            options={
              customerOptions
            }
            optionFilterProp="label"
            placeholder="Select client"
            loading={customerLoading}
            disabled={disabled}
            onChange={
              handleCustomerChange
            }
            notFoundContent={
              customerLoading
                ? <Spin size="small" />
                : 'No customers found'
            }
          />
        </Form.Item>
      </Col>

      <Form.Item
        name="employer"
        hidden
      >
        <Input />
      </Form.Item>

      <Col xs={24} md={8}>
        <Form.Item
          name="has_consultant"
          label="Consultant?"
          rules={[
            {
              required: true,
              message:
                'Consultant selection is required.',
            },
          ]}
        >
          <Radio.Group
            options={yesNoOptions}
            disabled={disabled}
            onChange={(event) =>
              handleConsultantChange(
                event.target.value,
              )
            }
          />
        </Form.Item>
      </Col>

      {hasConsultant === 'Yes' && (
        <Col xs={24} md={16}>
          <Form.Item
            name="consultant"
            label="Consultant Name"
            rules={[
              {
                required: true,
                whitespace: true,
                message:
                  'Consultant name is required.',
              },
              {
                max: 1000,
                message:
                  'Consultant name cannot exceed 1000 characters.',
              },
            ]}
          >
            <Input
              placeholder="Enter consultant name"
              disabled={disabled}
            />
          </Form.Item>
        </Col>
      )}

      <Col xs={24} md={8}>
        <Form.Item
          name="has_specified_area"
          label="Specified Area?"
          rules={[
            {
              required: true,
              message:
                'Specified area selection is required.',
            },
          ]}
        >
          <Radio.Group
            options={yesNoOptions}
            disabled={disabled}
            onChange={(event) =>
              handleSpecifiedAreaChange(
                event.target.value,
              )
            }
          />
        </Form.Item>
      </Col>

      {hasSpecifiedArea ===
        'Yes' && (
        <Col xs={24} md={16}>
          <Form.Item
            name="area"
            label="Specified Area"
            rules={[
              {
                required: true,
                whitespace: true,
                message:
                  'Specified area is required.',
              },
              {
                max: 100,
                message:
                  'Specified area cannot exceed 100 characters.',
              },
            ]}
          >
            <Input
              placeholder="Example: 2500 m²"
              disabled={disabled}
            />
          </Form.Item>
        </Col>
      )}

      <Col xs={24} md={12}>
        <Form.Item
          name={
            'construction_project_type'
          }
          label="Construction Project Type"
          rules={[
            {
              required: true,
              message:
                'Construction project type is required.',
            },
          ]}
        >
          <Select
            options={
              constructionProjectTypeOptions
            }
            placeholder="Select construction project type"
            disabled={disabled}
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
            options={statusOptions}
            placeholder="Select status"
            disabled={disabled}
          />
        </Form.Item>
      </Col>
    </Row>
  );

  const contractTab = (
    <Row gutter={[16, 0]}>
      <Col xs={24}>
        <Form.Item
          name="business_unit"
          label="Business Unit"
          rules={[
            {
              required: true,
              message:
                'Business unit is required.',
            },
          ]}
        >
          <Select
            showSearch
            allowClear
            options={
              businessUnitOptions
            }
            optionFilterProp="label"
            placeholder="Select type of business"
            disabled={disabled}
          />
        </Form.Item>
      </Col>

      <Col xs={24}>
        <Form.Item
          name="contract_type"
          label="Contract Type"
          rules={[
            {
              required: true,
              message:
                'Contract type is required.',
            },
          ]}
          extra="Construction project contract type"
        >
          <Select
            showSearch
            allowClear
            options={
              contractTypeOptions
            }
            optionFilterProp="label"
            placeholder="Select contract type"
            disabled={disabled}
          />
        </Form.Item>
      </Col>

      <Col xs={24}>
        <Form.Item
          name="contract_amount_before_vat"
          label="Main Contract Amount B/VAT"
          rules={[
            {
              required: true,
              message:
                'Main contract amount before VAT is required.',
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
                  && Number(value) < 0
                ) {
                  throw new Error(
                    'Contract amount cannot be negative.',
                  );
                }
              },
            },
          ]}
        >
          <InputNumber<string>
            style={{
              width: '100%',
            }}
            min="0"
            precision={2}
            stringMode
            controls={false}
            placeholder="Enter main contract amount before VAT"
            disabled={disabled}
            formatter={(value) => {
                if (!value) {
                    return '';
                }

                return String(value).replace(
                    /\B(?=(\d{3})+(?!\d))/g,
                    ',',
                );
            }}
            parser={(value) =>
              value?.replace(
                /,/g,
                '',
              ) ?? ''
            }
          />
        </Form.Item>
      </Col>

      <Col xs={24}>
        <Form.Item
          name="contract_pricing_type"
          label="Contract Pricing Type"
          rules={[
            {
              required: true,
              message:
                'Contract pricing type is required.',
            },
          ]}
          extra="Select contract pricing type"
        >
          <Select
            showSearch
            allowClear
            options={
              contractPricingTypeOptions
            }
            optionFilterProp="label"
            placeholder="Select contract pricing type"
            disabled={disabled}
          />
        </Form.Item>
      </Col>
    </Row>
  );

  const scheduleTab = (
  <Row gutter={[16, 0]}>
    <Col xs={24} md={12}>
      <Form.Item
        name="contract_date"
        label="Contract Date"
        rules={[
          {
            required: true,
            message:
              'Contract date is required.',
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
          style={{
            width: '100%',
          }}
          format="YYYY-MM-DD"
          placeholder="Select contract date"
          disabled={disabled}
        />
      </Form.Item>
    </Col>

    <Col xs={24} md={12}>
      <Form.Item
        name="has_site_handover_date"
        label="Specified Site Handover Date?"
        rules={[
          {
            required: true,
            message:
              'Please select Yes or No.',
          },
        ]}
      >
        <Radio.Group
          options={yesNoOptions}
          disabled={disabled}
          onChange={(event) =>
            handleSiteHandoverChange(
              event.target.value,
            )
          }
        />
      </Form.Item>
    </Col>

    {hasSiteHandoverDate === 'Yes' && (
      <Col xs={24} md={12}>
        <Form.Item
          name="site_handover_date"
          label="Date of Site Handover"
          rules={[
            {
              required: true,
              message:
                'Site handover date is required.',
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
            style={{
              width: '100%',
            }}
            format="YYYY-MM-DD"
            placeholder="Select site handover date"
            disabled={disabled}
          />
        </Form.Item>
      </Col>
    )}

    <Col xs={24} md={12}>
      <Form.Item
        name="has_commencement_date"
        label="Commencement Date?"
        rules={[
          {
            required: true,
            message:
              'Please select Yes or No.',
          },
        ]}
      >
        <Radio.Group
          options={yesNoOptions}
          disabled={disabled}
          onChange={(event) =>
            handleCommencementChange(
              event.target.value,
            )
          }
        />
      </Form.Item>
    </Col>

    {hasCommencementDate === 'Yes' && (
      <Col xs={24} md={12}>
        <Form.Item
          name="commencement_date"
          label="Commencement Date"
          rules={[
            {
              required: true,
              message:
                'Commencement date is required.',
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
            style={{
              width: '100%',
            }}
            format="YYYY-MM-DD"
            placeholder="Select commencement date"
            disabled={disabled}
          />
        </Form.Item>
      </Col>
    )}

    <Col xs={24} md={12}>
      <Form.Item
        name="project_duration"
        label="Project Duration"
        extra="Project duration in days"
        rules={[
          {
            required: true,
            message:
              'Project duration is required.',
          },
        ]}
      >
        <InputNumber
          style={{
            width: '100%',
          }}
          min={1}
          precision={0}
          placeholder="Enter number of days"
          disabled={disabled}
        />
      </Form.Item>
    </Col>

    <Col xs={24} md={12}>
      <Form.Item
        name="duration_type"
        label="Is Project Duration Working Days or Calendar Days?"
        rules={[
          {
            required: true,
            message:
              'Please select the duration type.',
          },
        ]}
      >
        <Radio.Group
          disabled={disabled}
          onChange={(event) =>
            handleDurationTypeChange(
              event.target.value,
            )
          }
          options={[
            {
              label: 'Working Days',
              value: 'working_days',
            },
            {
              label: 'Calendar Days',
              value: 'calendar_days',
            },
          ]}
        />
      </Form.Item>
    </Col>

    {durationType ===
      'working_days' && (
      <Col xs={24} md={12}>
        <Form.Item
          name="no_of_holidays"
          label="No. of Holidays and Weekends"
          rules={[
            {
              required: true,
              message:
                'Number of holidays and weekends is required.',
            },
          ]}
        >
          <InputNumber
            style={{
              width: '100%',
            }}
            min={0}
            precision={0}
            placeholder="Enter holidays and weekends"
            disabled={disabled}
          />
        </Form.Item>
      </Col>
    )}
  </Row>
);

const paymentTab = (
  <Row gutter={[16, 0]}>
    <Col xs={24}>
      <Form.Item
        name="payment_term"
        label="Payment Term"
        rules={[
          {
            required: true,
            message:
              'Payment term is required.',
          },
        ]}
      >
        <Radio.Group
          options={
            paymentTermOptions
          }
          disabled={disabled}
        />
      </Form.Item>
    </Col>

    <Col xs={24} md={8}>
      <Form.Item
        name="has_advance_payment"
        label="Advance Payment?"
        rules={[
          {
            required: true,
            message:
              'Please select Yes or No.',
          },
        ]}
      >
        <Radio.Group
          options={yesNoOptions}
          disabled={disabled}
          onChange={(event) =>
            handleAdvancePaymentChange(
              event.target.value,
            )
          }
        />
      </Form.Item>
    </Col>

    {hasAdvancePayment === 'Yes' && (
      <Col xs={24} md={16}>
        <Form.Item
          name="advance_percent"
          label="Advance Payment Percentage"
          rules={[
            {
              required: true,
              message:
                'Advance payment percentage is required.',
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
                    'Percentage must be between 0 and 100.',
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
            placeholder="Enter advance percentage"
            disabled={disabled}
          />
        </Form.Item>
      </Col>
    )}

    <Col xs={24} md={8}>
      <Form.Item
        name="has_advance_repayment"
        label="Advance Repayment?"
        rules={[
          {
            required: true,
            message:
              'Please select Yes or No.',
          },
        ]}
      >
        <Radio.Group
          options={yesNoOptions}
          disabled={disabled}
          onChange={(event) =>
            handleAdvanceRepaymentChange(
              event.target.value,
            )
          }
        />
      </Form.Item>
    </Col>

    {hasAdvanceRepayment === 'Yes' && (
      <>
        <Col xs={24} md={16}>
          <Form.Item
            name="advance_repayment_complete_percent"
            label="% of Project Where Advance Must Be Repaid Completely"
            rules={[
              {
                required: true,
                message:
                  'Project percentage for complete repayment is required.',
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
              placeholder="Enter project completion percentage"
              disabled={disabled}
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            name="advance_repayment_percent"
            label="Advance Repayment Percentage"
            rules={[
              {
                required: true,
                message:
                  'Advance repayment percentage is required.',
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
              placeholder="Enter repayment percentage"
              disabled={disabled}
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            name="advance_repayment_start"
            label="Advance Repayment Start @"
            rules={[
              {
                required: true,
                message:
                  'Advance repayment start is required.',
              },
            ]}
          >
            <Select
              options={
                advanceRepaymentStartOptions
              }
              placeholder="Select repayment start"
              disabled={disabled}
            />
          </Form.Item>
        </Col>
      </>
    )}

    <Col xs={24} md={12}>
      <Form.Item
        name="interim_payment_schedule"
        label="Interim Payment Schedule"
        extra="Enter interim payment schedule as a number"
        rules={[
          {
            required: true,
            message:
              'Interim payment schedule is required.',
          },
        ]}
      >
        <InputNumber
          style={{
            width: '100%',
          }}
          min={1}
          precision={0}
          placeholder="Enter payment schedule"
          disabled={disabled}
        />
      </Form.Item>
    </Col>

    <Col xs={24} md={12}>
      <Form.Item
        name="advance_payment_due_date"
        label="Advance Payment Shall Be Made Up To"
        rules={[
          {
            required: true,
            message:
              'Advance payment due date is required.',
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
          style={{
            width: '100%',
          }}
          format="YYYY-MM-DD"
          placeholder="Select advance payment due date"
          disabled={disabled}
        />
      </Form.Item>
    </Col>
  </Row>
);

const securityBondTab = (
  <Row gutter={[16, 0]}>
    <Col xs={24}>
      <Form.Item
        name="has_advance_bond"
        label="Advance Bond"
        rules={[
          {
            required: true,
            message:
              'Please select Yes or No.',
          },
        ]}
      >
        <Radio.Group
          options={yesNoOptions}
          disabled={disabled}
          onChange={(event) =>
            handleAdvanceBondChange(
              event.target.value,
            )
          }
        />
      </Form.Item>
    </Col>

    {hasAdvanceBond === 'Yes' && (
      <>
        <Col xs={24} md={12}>
          <Form.Item
            name="advance_bond_percent"
            label="Advance Bond Percentage"
            rules={[
              {
                required: true,
                message:
                  'Advance bond percentage is required.',
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
              placeholder="Enter advance bond percentage"
              disabled={disabled}
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            name="advance_bond_type"
            label="Bond Type"
            rules={[
              {
                required: true,
                message:
                  'Advance bond type is required.',
              },
            ]}
          >
            <Select
              showSearch
              options={bondTypeOptions}
              optionFilterProp="label"
              placeholder="Select bond type"
              disabled={disabled}
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            name="advance_bond_start_date"
            label="Bond Start Date"
            rules={[
              {
                required: true,
                message:
                  'Bond start date is required.',
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
              style={{
                width: '100%',
              }}
              format="YYYY-MM-DD"
              placeholder="Select bond start date"
              disabled={disabled}
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            name="advance_bond_end_date"
            label="Bond End Date"
            dependencies={[
              'advance_bond_start_date',
            ]}
            rules={[
              {
                required: true,
                message:
                  'Bond end date is required.',
              },
              ({ getFieldValue }) => ({
                validator: async (
                  _rule,
                  value,
                ) => {
                  const startDate =
                    getFieldValue(
                      'advance_bond_start_date',
                    );

                  if (
                    !value
                    || !startDate
                    || !dayjs(value).isBefore(
                      dayjs(startDate),
                      'day',
                    )
                  ) {
                    return;
                  }

                  throw new Error(
                    'Bond end date cannot be before the start date.',
                  );
                },
              }),
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
              style={{
                width: '100%',
              }}
              format="YYYY-MM-DD"
              placeholder="Select bond end date"
              disabled={disabled}
            />
          </Form.Item>
        </Col>
      </>
    )}

    <Col xs={24}>
      <Form.Item
        name="has_performance_bond"
        label="Performance Bond"
        rules={[
          {
            required: true,
            message:
              'Please select Yes or No.',
          },
        ]}
      >
        <Radio.Group
          options={yesNoOptions}
          disabled={disabled}
          onChange={(event) =>
            handlePerformanceBondChange(
              event.target.value,
            )
          }
        />
      </Form.Item>
    </Col>

    {hasPerformanceBond === 'Yes' && (
      <>
        <Col xs={24} md={12}>
          <Form.Item
            name="performance_bond_percent"
            label="Performance Bond Percentage"
            rules={[
              {
                required: true,
                message:
                  'Performance bond percentage is required.',
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
              placeholder="Enter performance bond percentage"
              disabled={disabled}
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            name="performance_bond_type"
            label="Performance Type"
            rules={[
              {
                required: true,
                message:
                  'Performance type is required.',
              },
            ]}
          >
            <Select
              showSearch
              options={bondTypeOptions}
              optionFilterProp="label"
              placeholder="Select performance type"
              disabled={disabled}
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            name="performance_bond_start_date"
            label="Performance Start Date"
            rules={[
              {
                required: true,
                message:
                  'Performance start date is required.',
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
              style={{
                width: '100%',
              }}
              format="YYYY-MM-DD"
              placeholder="Select performance start date"
              disabled={disabled}
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            name="performance_bond_end_date"
            label="Performance End Date"
            dependencies={[
              'performance_bond_start_date',
            ]}
            rules={[
              {
                required: true,
                message:
                  'Performance end date is required.',
              },
              ({ getFieldValue }) => ({
                validator: async (
                  _rule,
                  value,
                ) => {
                  const startDate =
                    getFieldValue(
                      'performance_bond_start_date',
                    );

                  if (
                    !value
                    || !startDate
                    || !dayjs(value).isBefore(
                      dayjs(startDate),
                      'day',
                    )
                  ) {
                    return;
                  }

                  throw new Error(
                    'Performance end date cannot be before the start date.',
                  );
                },
              }),
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
              style={{
                width: '100%',
              }}
              format="YYYY-MM-DD"
              placeholder="Select performance end date"
              disabled={disabled}
            />
          </Form.Item>
        </Col>
      </>
    )}
  </Row>
);


const othersTab = (
  <Row gutter={[16, 0]}>
    <Col xs={24} md={8}>
      <Form.Item
        name="has_price_adjustment"
        label="Price Adjustment Allowed?"
        rules={[
          {
            required: true,
            message:
              'Please select Yes or No.',
          },
        ]}
      >
        <Radio.Group
          options={yesNoOptions}
          disabled={disabled}
          onChange={(event) =>
            handlePriceAdjustmentChange(
              event.target.value,
            )
          }
        />
      </Form.Item>
    </Col>

    {hasPriceAdjustment === 'Yes' && (
      <Col xs={24} md={16}>
        <Form.Item
          name="price_adjustment_percent"
          label="Price Adjustment Percentage"
          rules={[
            {
              required: true,
              message:
                'Price adjustment percentage is required.',
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
            placeholder="Enter price adjustment percentage"
            disabled={disabled}
          />
        </Form.Item>
      </Col>
    )}

    <Col xs={24} md={8}>
      <Form.Item
        name="has_retention"
        label="Retention?"
        rules={[
          {
            required: true,
            message:
              'Please select Yes or No.',
          },
        ]}
      >
        <Radio.Group
          options={yesNoOptions}
          disabled={disabled}
          onChange={(event) =>
            handleRetentionChange(
              event.target.value,
            )
          }
        />
      </Form.Item>
    </Col>

    {hasRetention === 'Yes' && (
      <Col xs={24} md={16}>
        <Form.Item
          name="retention_percent"
          label="Retention Percentage"
          rules={[
            {
              required: true,
              message:
                'Retention percentage is required.',
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
            placeholder="Enter retention percentage"
            disabled={disabled}
          />
        </Form.Item>
      </Col>
    )}

    <Col xs={24} md={12}>
      <Form.Item
        name="has_price_index"
        label="Does It Have Price Index?"
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

    <Col xs={24} md={8}>
      <Form.Item
        name="has_liquidity_damage"
        label="Liquidity Damage?"
        rules={[
          {
            required: true,
            message:
              'Please select Yes or No.',
          },
        ]}
      >
        <Radio.Group
          options={yesNoOptions}
          disabled={disabled}
          onChange={(event) =>
            handleLiquidityDamageChange(
              event.target.value,
            )
          }
        />
      </Form.Item>
    </Col>

    {hasLiquidityDamage === 'Yes' && (
      <>
        <Col xs={24} md={8}>
          <Form.Item
            name="liquidity_percent"
            label="Liquidity Percentage"
            rules={[
              {
                required: true,
                message:
                  'Liquidity percentage is required.',
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
              placeholder="Enter liquidity percentage"
              disabled={disabled}
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <Form.Item
            name="liquidity_limit"
            label="Limit of Liquidity Damage"
            rules={[
              {
                required: true,
                message:
                  'Limit of liquidity damage is required.',
              },
            ]}
          >
            <InputNumber<string>
              style={{
                width: '100%',
              }}
              min="0"
              precision={2}
              stringMode
              controls={false}
              placeholder="Enter liquidity damage limit"
              disabled={disabled}
              formatter={(value) => {
                if (!value) {
                    return '';
                }

                return String(value).replace(
                    /\B(?=(\d{3})+(?!\d))/g,
                    ',',
                );
            }}
              parser={(value) =>
                value?.replace(/,/g, '') ?? ''
              }
            />
          </Form.Item>
        </Col>
      </>
    )}

    <Col xs={24} md={12}>
      <Form.Item
        name="minimum_payment_time"
        label="Minimum Time Within Which Payment Must Be Made After Certificate"
        extra="Enter the number of days"
        rules={[
          {
            required: true,
            message:
              'Minimum payment time is required.',
          },
        ]}
      >
        <InputNumber
          style={{
            width: '100%',
          }}
          min={1}
          precision={0}
          addonAfter="Days"
          placeholder="Enter number of days"
          disabled={disabled}
        />
      </Form.Item>
    </Col>

    <Col xs={24}>
      <Form.Item
        name="engineering_facilities"
        label="Engineering Facility"
        rules={[
          {
            required: true,
            message:
              'Select at least one engineering facility.',
          },
        ]}
      >
        <Checkbox.Group
          options={
            engineeringFacilityOptions
          }
          disabled={disabled}
        />
      </Form.Item>
    </Col>
  </Row>
);

  const tabItems:
    TabsProps['items'] = [
      {
        key: 'basic-information',
        label: '1. Basic Information',
        children:
          basicInformationTab,
        forceRender: true,
      },
      {
        key: 'contract',
        label: '2. Contract',
        children: contractTab,
        forceRender: true,
      },
      {
  key: 'schedule',
  label: '3. Schedule',
  children: scheduleTab,
  forceRender: true,
},
      {
  key: 'payment',
  label: '4. Payment',
  children: paymentTab,
  forceRender: true,
},
      {
  key: 'security-bond',
  label: '5. Security/Bond',
  children: securityBondTab,
  forceRender: true,
},
      {
  key: 'others',
  label: '6. Others',
  children: othersTab,
  forceRender: true,
},
    ];

  return (
    <Form<ProjectFormValues>
      form={form}
      layout="vertical"
      requiredMark
      initialValues={{
        has_consultant: 'No',
        has_specified_area: 'No',
        status: 'active',

        has_site_handover_date: 'No',
  has_commencement_date: 'No',

  has_advance_payment: 'No',
has_advance_repayment: 'No',

has_advance_bond: 'No',
has_performance_bond: 'No',

        business_unit: 'civil',
        contract_type:
          'turn_key',

        contract_pricing_type:
          'unit_rate',
          has_price_adjustment: 'No',
has_retention: 'No',
has_price_index: 'No',
has_liquidity_damage: 'No',
engineering_facilities: [],
      }}
    >
      <Tabs
        items={tabItems}
        destroyOnHidden={false}
      />
    </Form>
  );
}

export default ProjectForm;
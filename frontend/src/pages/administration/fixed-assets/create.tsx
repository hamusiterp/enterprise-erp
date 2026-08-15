import {
  App,
  Button,
  Card,
  Form,
  Space,
  Spin,
  Typography,
} from 'antd';

import {
  ArrowLeftOutlined,
  SaveOutlined,
} from '@ant-design/icons';

import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  useNavigate,
} from 'react-router';

import {
  categoriesApi,
} from '../../../api/categories';

import {
  fixedAssetsApi,
} from '../../../api/fixedAssets';

import FixedAssetForm from './form';

import type {
  FixedAssetCategory,
  FixedAssetFormValues,
} from '../../../types/fixedAsset';

const {
  Title,
  Text,
} = Typography;

const defaultFormValues:
  Partial<FixedAssetFormValues> = {
    asset_no: '',
    vehicle_no: '',
    tag_no: '',
    plate_no: '',
    category_id: undefined,

    name_of_machinery: '',

    make_of_vehicle: '',
    model: '',
    make_of_year: '',

    chassis_no: '',
    engine_no: '',
    engine_model: '',
    make_of_engine: '',

    horse_power: null,
    type_of_fuel: undefined,

    reading_type: 'km_reading',
    reading: null,

    consumption: null,
    standard_consumption: null,
    tanker_capacity: null,
    last_refill: null,

    has_gauge: false,
    gauge_reading: null,

    service_interval: null,
    last_service: null,

    purchase_date: null,
    licence_renewal_date: null,

    last_inspection_renewal_date:
      null,

    last_insurance_renewal_date:
      null,

    front_view_photo: [],
    rear_view_photo: [],
    right_side_view_photo: [],
    left_side_view_photo: [],

    libre_document: [],
    inspection_document: [],
    insurance_document: [],

    asset_condition: 'good',

    current_location: '',
    assigned_to: '',
    remarks: '',

    status: 'active',
  };

function normalizeText(
  value?: string | null,
): string {
  return value?.trim() ?? '';
}

function CreateFixedAssetPage() {
  const {
    message,
  } = App.useApp();

  const navigate =
    useNavigate();

  const [form] =
    Form.useForm<FixedAssetFormValues>();

  const [
    categories,
    setCategories,
  ] = useState<FixedAssetCategory[]>(
    [],
  );

  const [
    pageLoading,
    setPageLoading,
  ] = useState(true);

  const [
    categoriesLoading,
    setCategoriesLoading,
  ] = useState(false);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const loadCategories =
    useCallback(async () => {
      setCategoriesLoading(true);

      try {
        const options =
          await categoriesApi.options(
            'machine',
          );

        const mappedCategories:
          FixedAssetCategory[] =
          options.map((item) => ({
            id:
              item.id
              ?? item.value,

            name:
              item.name
              ?? item.category
              ?? item.label,

            type:
              item.type,
          }));

        setCategories(
          mappedCategories,
        );
      } catch (error) {
        console.error(
          'Unable to load fixed asset categories:',
          error,
        );

        message.error(
          'Unable to load machine categories.',
        );
      } finally {
        setCategoriesLoading(false);
      }
    }, [message]);

  const initializePage =
    useCallback(async () => {
      setPageLoading(true);

      form.resetFields();

      try {
        const [
          assetNumber,
        ] = await Promise.all([
          fixedAssetsApi
            .nextAssetNumber(),

          loadCategories(),
        ]);

        form.setFieldsValue({
          ...defaultFormValues,

          asset_no:
            assetNumber,
        });
      } catch (error) {
        console.error(
          'Unable to initialize fixed asset page:',
          error,
        );

        form.setFieldsValue({
          ...defaultFormValues,
        });

        message.warning(
          'Asset number will be generated when the asset is saved.',
        );
      } finally {
        setPageLoading(false);
      }
    }, [
      form,
      loadCategories,
      message,
    ]);

  useEffect(() => {
    void initializePage();
  }, [initializePage]);

  const handleCancel = () => {
    navigate(
      '/administration/fixed-assets',
    );
  };

  const handleSave = async () => {
    try {
      const values =
        await form.validateFields();

      setSaving(true);

      const payload:
        FixedAssetFormValues = {
          ...values,

          asset_no: '',

          vehicle_no:
            normalizeText(
              values.vehicle_no,
            ),

          tag_no:
            normalizeText(
              values.tag_no,
            ),

          plate_no:
            normalizeText(
              values.plate_no,
            ),

          category_id:
            values.category_id,

          name_of_machinery:
            normalizeText(
              values.name_of_machinery,
            ),

          make_of_vehicle:
            normalizeText(
              values.make_of_vehicle,
            ),

          model:
            normalizeText(
              values.model,
            ),

          make_of_year:
            normalizeText(
              values.make_of_year,
            ),

          chassis_no:
            normalizeText(
              values.chassis_no,
            ),

          engine_no:
            normalizeText(
              values.engine_no,
            ),

          engine_model:
            normalizeText(
              values.engine_model,
            ),

          make_of_engine:
            normalizeText(
              values.make_of_engine,
            ),

          type_of_fuel:
            normalizeText(
              values.type_of_fuel,
            ),

          horse_power:
            values.horse_power,

          reading_type:
            values.reading_type,

          reading:
            values.reading,

          consumption:
            values.consumption,

          standard_consumption:
            values.standard_consumption,

          tanker_capacity:
            values.tanker_capacity,

          last_refill:
            values.last_refill,

          has_gauge:
            values.has_gauge,

          gauge_reading:
            values.has_gauge
              ? values.gauge_reading
              : null,

          service_interval:
            values.service_interval,

          last_service:
            values.last_service,

          purchase_date:
            values.purchase_date,

          licence_renewal_date:
            values.licence_renewal_date,

          last_inspection_renewal_date:
            values
              .last_inspection_renewal_date,

          last_insurance_renewal_date:
            values
              .last_insurance_renewal_date,

          front_view_photo:
            values.front_view_photo
            ?? [],

          rear_view_photo:
            values.rear_view_photo
            ?? [],

          right_side_view_photo:
            values
              .right_side_view_photo
            ?? [],

          left_side_view_photo:
            values
              .left_side_view_photo
            ?? [],

          libre_document:
            values.libre_document
            ?? [],

          inspection_document:
            values.inspection_document
            ?? [],

          insurance_document:
            values.insurance_document
            ?? [],

          asset_condition:
            values.asset_condition,

          current_location:
            normalizeText(
              values.current_location,
            ),

          assigned_to:
            normalizeText(
              values.assigned_to,
            ),

          remarks:
            normalizeText(
              values.remarks,
            ),

          status:
            values.status,
        };

      const createdAsset =
        await fixedAssetsApi.create(
          payload,
        );

      message.success(
        'Fixed asset created successfully.',
      );

      navigate(
        `/administration/fixed-assets/${createdAsset.id}`,
      );
    } catch (error: unknown) {
      if (
        typeof error === 'object'
        && error !== null
        && 'errorFields' in error
      ) {
        return;
      }

      console.error(error);

      const responseError =
        error as {
          response?: {
            status?: number;

            data?: {
              message?: string;

              errors?: Record<
                string,
                string[]
              >;
            };
          };
        };

      const validationErrors =
        responseError.response
          ?.data?.errors;

      if (
        responseError.response
          ?.status === 422
        && validationErrors
      ) {
        const firstError =
          Object.values(
            validationErrors,
          ).flat()[0];

        message.error(
          firstError
          ?? 'Please check the required fields.',
        );

        return;
      }

      message.error(
        responseError.response
          ?.data?.message
        ?? 'Unable to create fixed asset.',
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Spin
      spinning={pageLoading}
      tip="Preparing fixed asset form..."
    >
      <Space
        direction="vertical"
        size={20}
        style={{
          width: '100%',
        }}
      >
        <Card>
          <div
            style={{
              display: 'flex',
              justifyContent:
                'space-between',
              alignItems: 'center',
              gap: 16,
              flexWrap: 'wrap',
            }}
          >
            <div>
              <Title
                level={3}
                style={{
                  margin: 0,
                }}
              >
                Add Fixed Asset
              </Title>

              <Text type="secondary">
                Register vehicle,
                machinery or equipment
                with photos, documents and
                service information.
              </Text>
            </div>

            <Space>
              <Button
                icon={
                  <ArrowLeftOutlined />
                }
                disabled={saving}
                onClick={
                  handleCancel
                }
              >
                Back
              </Button>

              <Button
                type="primary"
                icon={
                  <SaveOutlined />
                }
                loading={saving}
                onClick={() =>
                  void handleSave()
                }
              >
                Save Fixed Asset
              </Button>
            </Space>
          </div>
        </Card>

        <FixedAssetForm
  form={form}
  categories={categories}
  categoriesLoading={categoriesLoading}
  disabled={saving}
  requireFiles
/>

        <Card>
          <div
            style={{
              display: 'flex',
              justifyContent:
                'flex-end',
            }}
          >
            <Space>
              <Button
                disabled={saving}
                onClick={
                  handleCancel
                }
              >
                Cancel
              </Button>

              <Button
                type="primary"
                icon={
                  <SaveOutlined />
                }
                loading={saving}
                onClick={() =>
                  void handleSave()
                }
              >
                Save Fixed Asset
              </Button>
            </Space>
          </div>
        </Card>
      </Space>
    </Spin>
  );
}

export default CreateFixedAssetPage;
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
  useParams,
} from 'react-router';

import {
  categoriesApi,
} from '../../../api/categories';

import {
  fixedAssetsApi,
} from '../../../api/fixedAssets';

import FixedAssetForm from './form';

import type {
  FixedAsset,
  FixedAssetCategory,
  FixedAssetFormValues,
} from '../../../types/fixedAsset';

const {
  Title,
  Text,
} = Typography;

function normalizeText(
  value?: string | null,
): string {
  return value?.trim() ?? '';
}

function EditFixedAssetPage() {
  const {
    message,
  } = App.useApp();

  const navigate =
    useNavigate();

  const {
    id,
  } = useParams<{
    id: string;
  }>();

  const assetId =
    Number(id);

  const [form] =
    Form.useForm<FixedAssetFormValues>();

  const [
    asset,
    setAsset,
  ] = useState<FixedAsset | null>(
    null,
  );

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

  const mapAssetToFormValues = (
    currentAsset: FixedAsset,
  ): FixedAssetFormValues => {
    return {
      asset_no:
        currentAsset.asset_no,

      vehicle_no:
        currentAsset.vehicle_no
        ?? '',

      tag_no:
        currentAsset.tag_no,

      plate_no:
        currentAsset.plate_no
        ?? '',

      category_id:
        currentAsset.category_id,

      name_of_machinery:
        currentAsset
          .name_of_machinery,

      make_of_vehicle:
        currentAsset
          .make_of_vehicle
        ?? '',

      model:
        currentAsset.model
        ?? '',

      make_of_year:
        currentAsset.make_of_year
        ?? '',

      chassis_no:
        currentAsset.chassis_no
        ?? '',

      engine_no:
        currentAsset.engine_no
        ?? '',

      engine_model:
        currentAsset.engine_model
        ?? '',

      make_of_engine:
        currentAsset.make_of_engine
        ?? '',

      horse_power:
        currentAsset.horse_power
        !== null
        ? Number(
            currentAsset.horse_power,
          )
        : null,

      type_of_fuel:
        currentAsset.type_of_fuel
        ?? '',

      reading_type:
        currentAsset.reading_type,

      reading:
        currentAsset.reading
        !== null
        ? Number(
            currentAsset.reading,
          )
        : null,

      consumption:
        currentAsset.consumption
        !== null
        ? Number(
            currentAsset.consumption,
          )
        : null,

      standard_consumption:
        currentAsset
          .standard_consumption
        !== null
        ? Number(
            currentAsset
              .standard_consumption,
          )
        : null,

      tanker_capacity:
        currentAsset.tanker_capacity
        !== null
        ? Number(
            currentAsset
              .tanker_capacity,
          )
        : null,

      last_refill:
        currentAsset.last_refill,

      has_gauge:
        currentAsset.has_gauge,

      gauge_reading:
        currentAsset.gauge_reading
        !== null
        ? Number(
            currentAsset
              .gauge_reading,
          )
        : null,

      service_interval:
        currentAsset
          .service_interval,

      last_service:
        currentAsset.last_service,

      purchase_date:
        currentAsset.purchase_date,

      licence_renewal_date:
        currentAsset
          .licence_renewal_date,

      last_inspection_renewal_date:
        currentAsset
          .last_inspection_renewal_date,

      last_insurance_renewal_date:
        currentAsset
          .last_insurance_renewal_date,

      /*
       * Existing files are not added to Upload lists.
       * If the user selects a new file, the backend
       * replaces the existing one.
       */
      front_view_photo: [],
      rear_view_photo: [],
      right_side_view_photo: [],
      left_side_view_photo: [],

      libre_document: [],
      inspection_document: [],
      insurance_document: [],

      asset_condition:
        currentAsset
          .asset_condition,

      current_location:
        currentAsset
          .current_location
        ?? '',

      assigned_to:
        currentAsset.assigned_to
        ?? '',

      remarks:
        currentAsset.remarks
        ?? '',

      status:
        currentAsset.status,
    };
  };

  const initializePage =
    useCallback(async () => {
      if (
        !Number.isInteger(assetId)
        || assetId < 1
      ) {
        message.error(
          'Invalid fixed asset ID.',
        );

        navigate(
          '/administration/fixed-assets',
          {
            replace: true,
          },
        );

        return;
      }

      setPageLoading(true);

      try {
        const [
          loadedAsset,
        ] = await Promise.all([
          fixedAssetsApi.show(
            assetId,
          ),

          loadCategories(),
        ]);

        setAsset(
          loadedAsset,
        );

        form.resetFields();

        form.setFieldsValue(
          mapAssetToFormValues(
            loadedAsset,
          ),
        );
      } catch (error) {
        console.error(
          'Unable to load fixed asset:',
          error,
        );

        message.error(
          'Unable to load fixed asset.',
        );

        navigate(
          '/administration/fixed-assets',
          {
            replace: true,
          },
        );
      } finally {
        setPageLoading(false);
      }
    }, [
      assetId,
      form,
      loadCategories,
      message,
      navigate,
    ]);

  useEffect(() => {
    void initializePage();
  }, [initializePage]);

  const handleCancel = () => {
    navigate(
      `/administration/fixed-assets/${assetId}`,
    );
  };

  const handleBackToList = () => {
    navigate(
      '/administration/fixed-assets',
    );
  };

  const handleSave = async () => {
    if (!asset) {
      return;
    }

    try {
      const values =
        await form.validateFields();

      setSaving(true);

      const payload:
        FixedAssetFormValues = {
          ...values,

          asset_no:
            asset.asset_no,

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

          horse_power:
            values.horse_power,

          type_of_fuel:
            normalizeText(
              values.type_of_fuel,
            ),

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

      const updatedAsset =
        await fixedAssetsApi.update(
          asset.id,
          payload,
        );

      message.success(
        'Fixed asset updated successfully.',
      );

      navigate(
        `/administration/fixed-assets/${updatedAsset.id}`,
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
        ?? 'Unable to update fixed asset.',
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Spin
      spinning={pageLoading}
      tip="Loading fixed asset..."
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
                Edit Fixed Asset
              </Title>

              <Text type="secondary">
                {asset
                  ? `${asset.asset_no} - ${asset.name_of_machinery}`
                  : 'Update fixed asset information.'}
              </Text>
            </div>

            <Space>
              <Button
                icon={
                  <ArrowLeftOutlined />
                }
                disabled={saving}
                onClick={
                  handleBackToList
                }
              >
                Asset List
              </Button>

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
                Update Fixed Asset
              </Button>
            </Space>
          </div>
        </Card>

        <FixedAssetForm
  form={form}
  categories={categories}
  categoriesLoading={categoriesLoading}
  disabled={saving}
  requireFiles={false}
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
                Update Fixed Asset
              </Button>
            </Space>
          </div>
        </Card>
      </Space>
    </Spin>
  );
}

export default EditFixedAssetPage;
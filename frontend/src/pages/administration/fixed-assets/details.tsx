import {
  App,
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Empty,
  Image,
  Popconfirm,
  Row,
  Space,
  Spin,
  Tag,
  Typography,
} from 'antd';

import {
  ArrowLeftOutlined,
  DeleteOutlined,
  EditOutlined,
  FilePdfOutlined,
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
  fixedAssetsApi,
} from '../../../api/fixedAssets';

import type {
  FixedAsset,
} from '../../../types/fixedAsset';

const {
  Title,
  Text,
  Link,
} = Typography;

function formatLabel(
  value?: string | null,
): string {
  if (!value) {
    return '-';
  }

  return value
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase(),
    );
}

function formatNumber(
  value?: string | number | null,
  suffix?: string,
): string {
  if (
    value === null
    || value === undefined
    || value === ''
  ) {
    return '-';
  }

  const numericValue = Number(value);

  if (Number.isNaN(numericValue)) {
    return String(value);
  }

  const formatted =
    new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 2,
    }).format(numericValue);

  return suffix
    ? `${formatted} ${suffix}`
    : formatted;
}

function FixedAssetDetailsPage() {
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

  const [
    asset,
    setAsset,
  ] = useState<FixedAsset | null>(
    null,
  );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    deleting,
    setDeleting,
  ] = useState(false);

  const loadAsset =
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

      setLoading(true);

      try {
        const loadedAsset =
          await fixedAssetsApi.show(
            assetId,
          );

        setAsset(
          loadedAsset,
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
        setLoading(false);
      }
    }, [
      assetId,
      message,
      navigate,
    ]);

  useEffect(() => {
    void loadAsset();
  }, [loadAsset]);

  const handleDelete =
    async () => {
      if (!asset) {
        return;
      }

      setDeleting(true);

      try {
        await fixedAssetsApi.remove(
          asset.id,
        );

        message.success(
          'Fixed asset deleted successfully.',
        );

        navigate(
          '/administration/fixed-assets',
          {
            replace: true,
          },
        );
      } catch (error) {
        console.error(error);

        message.error(
          'Unable to delete fixed asset.',
        );
      } finally {
        setDeleting(false);
      }
    };

  const photoItems = asset
    ? [
        {
          label: 'Front View',
          url:
            asset.front_view_photo_url,
        },
        {
          label: 'Rear View',
          url:
            asset.rear_view_photo_url,
        },
        {
          label: 'Right-Side View',
          url:
            asset.right_side_view_photo_url,
        },
        {
          label: 'Left-Side View',
          url:
            asset.left_side_view_photo_url,
        },
      ]
    : [];

  const documentItems = asset
    ? [
        {
          label: 'Libre Document',
          url:
            asset.libre_document_url,
        },
        {
          label: 'Inspection Document',
          url:
            asset.inspection_document_url,
        },
        {
          label: 'Insurance Document',
          url:
            asset.insurance_document_url,
        },
      ]
    : [];

  return (
    <Spin
      spinning={loading}
      tip="Loading fixed asset..."
    >
      {!asset && !loading ? (
        <Card>
          <Empty
            description="Fixed asset not found."
          />
        </Card>
      ) : null}

      {asset && (
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
                <Space
                  size={10}
                  wrap
                >
                  <Title
                    level={3}
                    style={{
                      margin: 0,
                    }}
                  >
                    {
                      asset
                        .name_of_machinery
                    }
                  </Title>

                  <Tag color="blue">
                    {asset.asset_no}
                  </Tag>

                  <Tag
                    color={
                      asset.status ===
                      'active'
                        ? 'green'
                        : 'red'
                    }
                  >
                    {formatLabel(
                      asset.status,
                    )}
                  </Tag>

                  <Tag>
                    {formatLabel(
                      asset
                        .asset_condition,
                    )}
                  </Tag>
                </Space>

                <Text type="secondary">
                  {asset.category?.name
                    ?? 'Uncategorized'}
                  {' • '}
                  {asset.plate_no
                    || asset.tag_no}
                </Text>
              </div>

              <Space wrap>
                <Button
                  icon={
                    <ArrowLeftOutlined />
                  }
                  onClick={() =>
                    navigate(
                      '/administration/fixed-assets',
                    )
                  }
                >
                  Asset List
                </Button>

                <Button
                  type="primary"
                  icon={
                    <EditOutlined />
                  }
                  onClick={() =>
                    navigate(
                      `/administration/fixed-assets/${asset.id}/edit`,
                    )
                  }
                >
                  Edit
                </Button>

                <Popconfirm
                  title="Delete Fixed Asset"
                  description={`Delete ${asset.asset_no} - ${asset.name_of_machinery}?`}
                  okText="Delete"
                  cancelText="Cancel"
                  okButtonProps={{
                    danger: true,
                    loading: deleting,
                  }}
                  onConfirm={() =>
                    void handleDelete()
                  }
                >
                  <Button
                    danger
                    icon={
                      <DeleteOutlined />
                    }
                    loading={deleting}
                  >
                    Delete
                  </Button>
                </Popconfirm>
              </Space>
            </div>
          </Card>

          <Card
            title="General Information"
          >
            <Descriptions
              bordered
              column={{
                xs: 1,
                sm: 1,
                md: 2,
                lg: 3,
              }}
            >
              <Descriptions.Item label="Asset Number">
                {asset.asset_no}
              </Descriptions.Item>

              <Descriptions.Item label="Tag Number">
                {asset.tag_no}
              </Descriptions.Item>

              <Descriptions.Item label="Vehicle Number">
                {asset.vehicle_no
                  || '-'}
              </Descriptions.Item>

              <Descriptions.Item label="Plate Number">
                {asset.plate_no
                  || '-'}
              </Descriptions.Item>

              <Descriptions.Item label="Category">
                {asset.category?.name
                  || '-'}
              </Descriptions.Item>

              <Descriptions.Item label="Name of Machinery">
                {
                  asset
                    .name_of_machinery
                }
              </Descriptions.Item>

              <Descriptions.Item label="Make of Vehicle">
                {asset.make_of_vehicle
                  || '-'}
              </Descriptions.Item>

              <Descriptions.Item label="Model">
                {asset.model || '-'}
              </Descriptions.Item>

              <Descriptions.Item label="Make Year">
                {asset.make_of_year
                  || '-'}
              </Descriptions.Item>

              <Descriptions.Item label="Current Location">
                {asset.current_location
                  || '-'}
              </Descriptions.Item>

              <Descriptions.Item label="Assigned To">
                {asset.assigned_to
                  || '-'}
              </Descriptions.Item>

              <Descriptions.Item label="Condition">
                {formatLabel(
                  asset.asset_condition,
                )}
              </Descriptions.Item>

              <Descriptions.Item label="Status">
                {formatLabel(
                  asset.status,
                )}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card
            title="Engine and Technical Information"
          >
            <Descriptions
              bordered
              column={{
                xs: 1,
                sm: 1,
                md: 2,
                lg: 3,
              }}
            >
              <Descriptions.Item label="Chassis Number">
                {asset.chassis_no
                  || '-'}
              </Descriptions.Item>

              <Descriptions.Item label="Engine Number">
                {asset.engine_no
                  || '-'}
              </Descriptions.Item>

              <Descriptions.Item label="Engine Model">
                {asset.engine_model
                  || '-'}
              </Descriptions.Item>

              <Descriptions.Item label="Make of Engine">
                {asset.make_of_engine
                  || '-'}
              </Descriptions.Item>

              <Descriptions.Item label="Horse Power">
                {formatNumber(
                  asset.horse_power,
                  'HP',
                )}
              </Descriptions.Item>

              <Descriptions.Item label="Fuel Type">
                {asset.type_of_fuel
                  || '-'}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card
            title="Reading, Fuel and Gauge"
          >
            <Descriptions
              bordered
              column={{
                xs: 1,
                sm: 1,
                md: 2,
                lg: 3,
              }}
            >
              <Descriptions.Item label="Reading Type">
                {formatLabel(
                  asset.reading_type,
                )}
              </Descriptions.Item>

              <Descriptions.Item label="Current Reading">
                {formatNumber(
                  asset.reading,
                  asset.reading_type ===
                  'km_reading'
                    ? 'KM'
                    : 'HP',
                )}
              </Descriptions.Item>

              <Descriptions.Item label="Current Consumption">
                {formatNumber(
                  asset.consumption,
                )}
              </Descriptions.Item>

              <Descriptions.Item label="Standard Consumption">
                {formatNumber(
                  asset
                    .standard_consumption,
                )}
              </Descriptions.Item>

              <Descriptions.Item label="Tank Capacity">
                {formatNumber(
                  asset.tanker_capacity,
                  'Litre',
                )}
              </Descriptions.Item>

              <Descriptions.Item label="Last Refill">
                {asset.last_refill
                  || '-'}
              </Descriptions.Item>

              <Descriptions.Item label="Has Gauge">
                {asset.has_gauge
                  ? 'Yes'
                  : 'No'}
              </Descriptions.Item>

              <Descriptions.Item label="Gauge Reading">
                {asset.has_gauge
                  ? formatNumber(
                      asset
                        .gauge_reading,
                    )
                  : '-'}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card
            title="Service and Important Dates"
          >
            <Descriptions
              bordered
              column={{
                xs: 1,
                sm: 1,
                md: 2,
                lg: 3,
              }}
            >
              <Descriptions.Item label="Purchase Date">
                {asset.purchase_date
                  || '-'}
              </Descriptions.Item>

              <Descriptions.Item label="Licence Renewal Date">
                {
                  asset
                    .licence_renewal_date
                  || '-'
                }
              </Descriptions.Item>

              <Descriptions.Item label="Last Inspection Renewal Date">
                {
                  asset
                    .last_inspection_renewal_date
                  || '-'
                }
              </Descriptions.Item>

              <Descriptions.Item label="Last Insurance Renewal Date">
                {
                  asset
                    .last_insurance_renewal_date
                  || '-'
                }
              </Descriptions.Item>

              <Descriptions.Item label="Service Interval">
                {asset.service_interval
                  !== null
                  ? `${asset.service_interval}`
                  : '-'}
              </Descriptions.Item>

              <Descriptions.Item label="Last Service">
                {asset.last_service
                  || '-'}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card
            title="Asset Photos"
          >
            <Image.PreviewGroup>
              <Row gutter={[16, 16]}>
                {photoItems.map(
                  (photo) => (
                    <Col
                      xs={24}
                      sm={12}
                      lg={6}
                      key={photo.label}
                    >
                      <Card
                        size="small"
                        title={
                          photo.label
                        }
                      >
                        {photo.url ? (
                          <Image
                            src={
                              photo.url
                            }
                            alt={
                              photo.label
                            }
                            width="100%"
                            height={190}
                            style={{
                              objectFit:
                                'cover',
                              borderRadius:
                                6,
                            }}
                          />
                        ) : (
                          <Empty
                            image={
                              Empty
                                .PRESENTED_IMAGE_SIMPLE
                            }
                            description="No photo"
                          />
                        )}
                      </Card>
                    </Col>
                  ),
                )}
              </Row>
            </Image.PreviewGroup>
          </Card>

          <Card
            title="Documents"
          >
            <Row gutter={[16, 16]}>
              {documentItems.map(
                (document) => (
                  <Col
                    xs={24}
                    md={8}
                    key={
                      document.label
                    }
                  >
                    <Card
                      size="small"
                    >
                      <Space
                        direction="vertical"
                        align="center"
                        style={{
                          width: '100%',
                        }}
                      >
                        <FilePdfOutlined
                          style={{
                            fontSize: 42,
                          }}
                        />

                        <Text strong>
                          {
                            document.label
                          }
                        </Text>

                        {document.url ? (
                          <Link
                            href={
                              document.url
                            }
                            target="_blank"
                            rel="noreferrer"
                          >
                            Open PDF
                          </Link>
                        ) : (
                          <Text type="secondary">
                            Not uploaded
                          </Text>
                        )}
                      </Space>
                    </Card>
                  </Col>
                ),
              )}
            </Row>
          </Card>

          <Card title="Remarks">
            {asset.remarks ? (
              <Text>
                {asset.remarks}
              </Text>
            ) : (
              <Text type="secondary">
                No remarks recorded.
              </Text>
            )}
          </Card>

          <Card
            title="Registration and Audit"
          >
            <Descriptions
              bordered
              column={{
                xs: 1,
                sm: 1,
                md: 2,
                lg: 3,
              }}
            >
              <Descriptions.Item label="Registered By">
                {asset.registered_by
                  || 'System'}
              </Descriptions.Item>

              <Descriptions.Item label="Registered Date">
                {
                  asset
                    .registered_date
                  || '-'
                }
              </Descriptions.Item>

              <Descriptions.Item label="Edited By">
                {asset.edited_by
                  || '-'}
              </Descriptions.Item>

              <Descriptions.Item label="Created At">
                {asset.created_at
                  || '-'}
              </Descriptions.Item>

              <Descriptions.Item label="Updated At">
                {asset.updated_at
                  || '-'}
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            <Space>
              <Button
                icon={
                  <ArrowLeftOutlined />
                }
                onClick={() =>
                  navigate(
                    '/administration/fixed-assets',
                  )
                }
              >
                Back to Asset List
              </Button>

              <Button
                type="primary"
                icon={
                  <EditOutlined />
                }
                onClick={() =>
                  navigate(
                    `/administration/fixed-assets/${asset.id}/edit`,
                  )
                }
              >
                Edit Fixed Asset
              </Button>
            </Space>
          </Card>
        </Space>
      )}
    </Spin>
  );
}

export default FixedAssetDetailsPage;
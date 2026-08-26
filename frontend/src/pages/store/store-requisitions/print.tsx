import {
  Button,
  Card,
  Descriptions,
  Space,
  Table,
  Typography,
} from 'antd';

import {
  ArrowLeftOutlined,
  PrinterOutlined,
} from '@ant-design/icons';

import {
  useEffect,
  useState,
} from 'react';



import {
  fetchStoreRequisition,
} from '../../../api/storeRequisitions';

import type {
  StoreRequisition,
  StoreRequisitionLine,
} from './types';

import {
  getCompanySettings,
} from '../../../api/companySettings';

import type {
  CompanySetting,
} from '../../../api/companySettings';

const {
  Title,
  Text,
} = Typography;

const formatDate = (
  value?: string | null,
): string => {
  if (!value) {
    return '-';
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return value;
  }

  return date
    .toISOString()
    .slice(0, 10);
};

function StoreRequisitionPrintPage() {
  
  const getRequisitionId = (): number | null => {
  const match =
    window.location.pathname.match(
      /\/store\/store-requisitions\/(\d+)\/print\/?$/
    );

  if (!match) {
    return null;
  }

  return Number(match[1]);
};

const [
  company,
  setCompany,
] = useState<CompanySetting | null>(
  null,
);

const id =
  getRequisitionId();

  const [
    requisition,
    setRequisition,
  ] =
    useState<StoreRequisition | null>(
      null,
    );

  const [
    loading,
    setLoading,
  ] =
    useState(false);

  useEffect(() => {
  const load =
    async () => {
      if (!id) {
        return;
      }

      try {
        setLoading(true);

        const [
          requisitionResult,
          companyResult,
        ] = await Promise.all([
          fetchStoreRequisition(
            id,
          ),

          getCompanySettings(),
        ]);

        setRequisition(
          requisitionResult,
        );

        setCompany(
          companyResult,
        );
      } catch (error) {
        console.error(
          error,
        );
      } finally {
        setLoading(false);
      }
    };

  void load();
}, [id]);

  const handlePrint = () => {
    window.print();
  };

  const columns = [
    {
      title: '#',
      key: 'line_no',
      width: 35,

      render: (
        _: unknown,
        __:
          StoreRequisitionLine,
        index: number,
      ) =>
        index + 1,
    },

    {
      title: 'MR No.',
      dataIndex:
        'mr_no',
      key: 'mr_no',
      width: 65,

      render: (
        value:
          string | null,
      ) =>
        value || '-',
    },

    {
      title:
        'Description',
      key:
        'description',
        width: 130,

      render: (
        _: unknown,
        line:
          StoreRequisitionLine,
      ) =>
        line.item
          ?.item_description ??
        '-',
    },

    {
      title: 'Unit',
      key: 'unit',
      width: 55,

      render: (
        _: unknown,
        line:
          StoreRequisitionLine,
      ) =>
        line.unit_of_measurement
  ? (
      line.unit_of_measurement.symbol
      || line.unit_of_measurement.code
      || line.unit_of_measurement.name
    )
  : (
      line.uom?.symbol
      || line.uom?.code
      || line.uom?.name
      || '-'
    )
    },

    {
      title:
        'SR Qty',
      dataIndex:
        'sr_qty',
      key:
        'sr_qty',
      width: 55,
    },

    {
  title:
    'Expected Delivery Date',

  dataIndex:
    'expected_delivery_date',

  key:
    'expected_delivery_date',

  width: 80,

  render: (
    value: string | null,
  ) =>
    formatDate(value),
},

    {
      title:
        'Priority',
      key:
        'priority',
      width: 60,

      render: (
        _: unknown,
        line:
          StoreRequisitionLine,
      ) =>
        line.priority
          ? line.priority
              .charAt(0)
              .toUpperCase() +
            line.priority.slice(
              1,
            )
          : '-',
    },

    {
      title:
        'Delivery Type',
      key:
        'delivery_type',
      width: 80,

      render: (
        _: unknown,
        line:
          StoreRequisitionLine,
      ) =>
        line.delivery_type ===
        'over_qty_based'
          ? 'Over Qty Based'
          : 'At Any Time',
    },

    {
      title: 'Remark',
      dataIndex:
        'remark',
      key:
        'remark',
      width: 90,

      render: (
        value:
          string | null,
      ) =>
        value || '-',
    },
  ];

  const urgencyReasons =
    requisition?.items
      ?.filter(
        (line) =>
          line.priority ===
            'urgent' &&
          line.urgency_reason,
      )
      .map(
        (line) =>
          `${line.item?.item_description ?? 'Item'}: ${line.urgency_reason}`,
      )
      .join('\n');

const renderSrCopy = (
  copyLabel: string,
) => (
  <div className="sr-copy">
    <div className="sr-copy-label">
      {copyLabel}
    </div>

    <div className="sr-print-header">
      <div className="sr-print-header-top">
        <div className="sr-print-logo">
          {company?.logo_url ? (
            <img
              src={company.logo_url}
              alt={company.company_name}
              style={{
                maxWidth: 70,
                maxHeight: 48,
                objectFit: 'contain',
              }}
            />
          ) : (
            <strong>
              {company?.company_name ?? ''}
            </strong>
          )}
        </div>

        <div className="sr-print-title">
          <Text
            strong
            style={{
              fontSize: 11,
            }}
          >
            {company?.company_name ?? ''}
          </Text>

          <div
            style={{
              fontSize: 9,
              fontWeight: 700,
              marginTop: 3,
            }}
          >
            STORE REQUISITION
          </div>
        </div>

        <div className="sr-print-docinfo">
          <div>
            <strong>
              Document No:
            </strong>{' '}
            {requisition?.sr_no}
          </div>

          <div>
            <strong>
              Issued:
            </strong>{' '}
            {formatDate(
              requisition?.sr_date,
            )}
          </div>
        </div>
      </div>
    </div>

    <Descriptions
      bordered
      size="small"
      column={4}
      className="sr-details"
    >
      <Descriptions.Item
        label="SR No."
      >
        {requisition?.sr_no}
      </Descriptions.Item>

      <Descriptions.Item
        label="SR Date"
      >
        {formatDate(
          requisition?.sr_date,
        )}
      </Descriptions.Item>

      <Descriptions.Item
        label="From"
      >
        {requisition
          ?.from_department
          ?.department_name ?? '-'}
      </Descriptions.Item>

      <Descriptions.Item
        label="To"
      >
        {requisition?.to_location}
      </Descriptions.Item>

      <Descriptions.Item
        label="Used For"
        span={2}
      >
        {requisition?.used_for === 'project'
          ? requisition.project
            ? `${requisition.project.project_no} - ${requisition.project.project_name}`
            : '-'
          : requisition?.used_for === 'department'
            ? requisition.used_for_department
                ?.department_name ?? '-'
            : '-'}
      </Descriptions.Item>

      <Descriptions.Item
        label="Voucher Type"
      >
        {requisition?.voucher_sr_type ===
        'fuel_oil'
          ? 'Fuel & Oil'
          : 'Goods'}
      </Descriptions.Item>

      <Descriptions.Item
        label="MR"
      >
        {requisition?.mr_requested
          ? 'Yes'
          : 'No'}
      </Descriptions.Item>
    </Descriptions>

    <Table
      rowKey={(record) =>
        record.key ??
        `${record.item_id}`
      }
      dataSource={
        requisition?.items ?? []
      }
      columns={columns}
      pagination={false}
      bordered
      size="small"
      tableLayout="fixed"
    />

    <div className="urgency-box">
      <strong>
        Reason for Urgency:
      </strong>{' '}
      {urgencyReasons || '-'}
    </div>

    <div className="signature-grid">
      <div className="signature-box">
        <strong>
          Prepared By
        </strong>

        <div>
          {requisition?.requester
            ?.name ?? '-'}
        </div>

        <div className="signature-line">
          Signature: __________
        </div>
      </div>

      <div className="signature-box">
        <strong>
          Checked By
        </strong>

        <div className="signature-space">
          &nbsp;
        </div>

        <div>
          Signature: __________
        </div>
      </div>

      <div className="signature-box">
        <strong>
          Approved By
        </strong>

        <div className="signature-space">
          &nbsp;
        </div>

        <div>
          Signature: __________
        </div>
      </div>

      <div className="signature-box">
        <strong>
          SR Received
        </strong>

        <div className="signature-space">
          &nbsp;
        </div>

        <div>
          Date: __________
        </div>
      </div>
    </div>
  </div>
);

  return (
    <>
      <style>
  {`
    @media print {
      html,
      body {
        width: 100%;
        margin: 0 !important;
        padding: 0 !important;
        overflow: visible !important;
        background: #fff !important;
      }

      .no-print {
        display: none !important;
      }

      .ant-layout,
      .ant-layout-content,
      main {
        margin: 0 !important;
        padding: 0 !important;
        background: #fff !important;
      }

      .ant-layout-sider,
      .ant-layout-header {
        display: none !important;
      }

      .print-card {
        width: 100% !important;
        max-width: none !important;
        margin: 0 !important;
        padding: 0 !important;
        border: none !important;
        box-shadow: none !important;
      }

      .print-card .ant-card-body {
        padding: 0 !important;
      }

      /*
       * Remove Ant Design table scroll containers.
       */
      .print-card .ant-table-wrapper,
      .print-card .ant-spin-nested-loading,
      .print-card .ant-spin-container,
      .print-card .ant-table,
      .print-card .ant-table-container,
      .print-card .ant-table-content,
      .print-card .ant-table-body {
        width: 100% !important;
        max-width: 100% !important;
        overflow: visible !important;
      }

      .print-card .ant-table table {
        width: 100% !important;
        table-layout: fixed !important;
      }

      .print-card .ant-table-cell {
        padding: 5px 4px !important;
        font-size: 9px !important;
        line-height: 1.25 !important;

        white-space: normal !important;
        word-break: break-word !important;
        overflow-wrap: anywhere !important;
      }

      .print-card .ant-table-thead > tr > th {
        font-size: 9px !important;
        font-weight: 700 !important;
      }

      /*
       * Hide Ant Design scrollbar elements.
       */
      .print-card .ant-table-sticky-scroll,
      .print-card .ant-table-cell-scrollbar {
        display: none !important;
      }

      /*
       * Keep rows together where possible.
       */
      .print-card tr {
        break-inside: avoid;
        page-break-inside: avoid;
      }

      .sr-print-header {
        break-inside: avoid;
        page-break-inside: avoid;
      }

      .signature-grid {
        break-inside: avoid;
        page-break-inside: avoid;
      }

      @page {
        size: A4 portrait;
        margin: 8mm;
      }
    }

    .sr-print-header {
      border: 1px solid #000;
      margin-bottom: 12px;
    }

    .sr-print-header-top {
      display: grid;
      grid-template-columns: 150px 1fr 220px;
      align-items: stretch;
      min-height: 110px;
    }

    .sr-print-logo {
      padding: 10px;
      text-align: center;
      font-weight: 700;

      display: flex;
      align-items: center;
      justify-content: center;
    }

    .sr-print-title {
      text-align: center;
      border-left: 1px solid #000;
      border-right: 1px solid #000;

      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;

      padding: 8px;
    }

    .sr-print-docinfo {
      font-size: 12px;
    }

    .sr-print-docinfo > div {
      padding: 5px 8px;
      border-bottom: 1px solid #000;
    }

    .sr-print-docinfo > div:last-child {
      border-bottom: none;
    }

    .signature-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);

      border: 1px solid #000;
      margin-top: 20px;
    }

    .signature-box {
      min-height: 95px;
      padding: 8px;
      border-right: 1px solid #000;
    }

    .signature-box:last-child {
      border-right: none;
    }

    .signature-title {
      font-weight: 700;
      margin-bottom: 38px;
    }

    @media print {
      .sr-print-header-top {
        grid-template-columns:
          18% 52% 30%;
      }

      .sr-print-docinfo {
        font-size: 9px;
      }

      .signature-box {
        min-height: 75px;
        padding: 5px;
        font-size: 9px;
      }

      .signature-title {
        margin-bottom: 25px;
      }

      
    }
  `}
</style>

      <div
        className="no-print"
        style={{
          marginBottom: 16,
        }}
      >
        <Space>
          <Button
            icon={
              <ArrowLeftOutlined />
            }
            onClick={() =>
  window.history.back()
}
          >
            Back
          </Button>

          <Button
            type="primary"
            icon={
              <PrinterOutlined />
            }
            onClick={
              handlePrint
            }
            disabled={
              !requisition
            }
          >
            Print
          </Button>
        </Space>
      </div>

      <Card
        loading={loading}
        className="print-card"
      >
        {requisition && (
          <>
            <div
              className="sr-print-header"
            >
              <div
                className="sr-print-header-top"
              >
                <div
  className="sr-print-logo"
>
  {company?.logo_url ? (
    <img
      src={company.logo_url}
      alt={
        company.company_name
      }
      style={{
        maxWidth: 95,
        maxHeight: 75,
        objectFit:
          'contain',
      }}
    />
  ) : (
    <strong>
      {company?.company_name ??
        ''}
    </strong>
  )}
</div>

                <div
  className="sr-print-title"
>
  <Text
    strong
    style={{
      fontSize: 17,
    }}
  >
    {company?.company_name ??
      ''}
  </Text>

  {company?.trading_name && (
    <Text
      style={{
        marginTop: 2,
      }}
    >
      {company.trading_name}
    </Text>
  )}

  <Title
    level={4}
    style={{
      margin:
        '10px 0 0',
    }}
  >
    STORE REQUISITION
  </Title>

  <Text>
    Store Request Voucher
  </Text>
</div>

                <div
                  className="sr-print-docinfo"
                >
                  <div>
                    <strong>
                      Document No:
                    </strong>
                    <br />
                    {
                      requisition
                        .sr_no
                    }
                  </div>

                  <div>
                    <strong>
                      Issued Date:
                    </strong>
                    <br />
                    {
                      formatDate(
  requisition.sr_date,
)
                    }
                  </div>

                  <div>
                    <strong>
                      Page:
                    </strong>
                    <br />
                    1
                  </div>
                </div>
              </div>
            </div>

            <Descriptions
              bordered
              size="small"
              column={2}
              style={{
                marginBottom: 16,
              }}
            >
              <Descriptions.Item
                label="SR No."
              >
                <Text strong>
                  {
                    requisition
                      .sr_no
                  }
                </Text>
              </Descriptions.Item>

              <Descriptions.Item
                label="SR Date"
              >
                {formatDate(requisition.sr_date)}
              </Descriptions.Item>

              <Descriptions.Item
                label="From"
              >
                {
                  requisition.from_department
  ?.department_name ?? '-'
                }
              </Descriptions.Item>

              <Descriptions.Item
                label="To"
              >
                {
                  requisition
                    .to_location
                }
              </Descriptions.Item>

              <Descriptions.Item
  label="Used For"
>
  {requisition.used_for === 'project'
    ? (
        requisition.project
          ? `${requisition.project.project_no} - ${requisition.project.project_name}`
          : '-'
      )
    : requisition.used_for === 'department'
      ? (
          requisition.used_for_department
            ?.department_name ?? '-'
        )
      : '-'}
</Descriptions.Item>

              <Descriptions.Item
                label="Voucher SR Type"
              >
                {
                  requisition
                    .voucher_sr_type ===
                  'fuel_oil'
                    ? 'Fuel & Oil'
                    : 'Goods'
                }
              </Descriptions.Item>

              <Descriptions.Item
                label="MR Requested"
              >
                {
                  requisition
                    .mr_requested
                    ? 'Yes'
                    : 'No'
                }
              </Descriptions.Item>

              <Descriptions.Item
                label="Status"
              >
                {
                  requisition
                    .status
                }
              </Descriptions.Item>
            </Descriptions>

            <Table
  rowKey="key"
  dataSource={
    requisition.items
  }
  columns={
    columns
  }
  pagination={false}
  bordered
  size="small"
  tableLayout="fixed"
/>

            <div
              style={{
                marginTop: 18,
                border:
                  '1px solid #000',
                minHeight: 80,
                padding: 10,
                whiteSpace:
                  'pre-wrap',
              }}
            >
              <strong>
                Reason for
                Urgency:
              </strong>

              <div
                style={{
                  marginTop: 6,
                }}
              >
                {
                  urgencyReasons ||
                  '-'
                }
              </div>
            </div>

            <div
              className="signature-grid"
            >
              <div
                className="signature-box"
              >
                <div
                  className="signature-title"
                >
                  Prepared By
                </div>

                <div>
  <strong>
    {requisition.requester?.name ?? '-'}
  </strong>
</div>

<div
  style={{
    marginTop: 18,
  }}
>
  Signature:
  __________________
</div>
              </div>

              <div
                className="signature-box"
              >
                <div
                  className="signature-title"
                >
                  Checked By
                </div>

                Name:
                ____________
                <br />
                Signature:
                ____________
              </div>

              <div
                className="signature-box"
              >
                <div
                  className="signature-title"
                >
                  Approved By
                </div>

                Name:
                ____________
                <br />
                Signature:
                ____________
              </div>

              <div
                className="signature-box"
              >
                <div
                  className="signature-title"
                >
                  SR Received
                  Date
                </div>

                Date:
                ____________
                <br />
                Signature:
                ____________
              </div>
            </div>
          </>
        )}
      </Card>
    </>
  );
}

export default StoreRequisitionPrintPage;
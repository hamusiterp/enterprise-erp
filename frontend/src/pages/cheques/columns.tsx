import {
  Space,
  Tag,
  Tooltip,
} from 'antd';

import type {
  ColumnsType,
} from 'antd/es/table';

import {

  EyeOutlined,

  EditOutlined,

  StopOutlined,

  CheckCircleOutlined,

  DeleteOutlined,

} from '@ant-design/icons';

import type {

  Cheque,

} from '../../types/cheque';

interface ColumnProps {

  onView(
    cheque: Cheque,
  ): void;

  onEdit(
    cheque: Cheque,
  ): void;

  onVoid(
    cheque: Cheque,
  ): void;

  onActivate(
    cheque: Cheque,
  ): void;

  onDelete(
    cheque: Cheque,
  ): void;

}

function statusTag(
  status: string,
) {

  switch (status) {

    case 'active':

      return (

        <Tag color="green">

          Active

        </Tag>

      );

    case 'void':

      return (

        <Tag color="red">

          Void

        </Tag>

      );

    default:

      return (

        <Tag>

          {status}

        </Tag>

      );

  }

}

function signatureTag(
  signature: string,
) {

  return signature === 'fully'

    ? (

      <Tag color="blue">

        Fully

      </Tag>

    )

    : (

      <Tag color="orange">

        Partially

      </Tag>

    );

}

export const chequeColumns = ({

  onView,

  onEdit,

  onVoid,

  onActivate,

  onDelete,

}: ColumnProps): ColumnsType<Cheque> => [

  {

    title: 'Cheque Number',

    dataIndex: 'cheque_no',

    key: 'cheque_no',

    width: 180,

    sorter: true,

  },

  {

    title: 'Bank',

    key: 'bank',

    width: 220,

    render: (_, row) =>

      row.bank?.name ?? '-',

  },

  {

    title: 'Branch',

    dataIndex: 'branch',

    key: 'branch',

    width: 180,

  },

  {

    title: 'Signature',

    dataIndex: 'signature_status',

    key: 'signature_status',

    width: 140,

    render: signatureTag,

  },

  {

    title: 'Status',

    dataIndex: 'status',

    key: 'status',

    width: 120,

    render: statusTag,

  },

  {

    title: 'Registered',

    dataIndex: 'date_registered',

    key: 'date_registered',

    width: 130,

    sorter: true,

  },

  {

    title: 'Actions',

    key: 'actions',

    fixed: 'right',

    width: 220,

    render: (_, cheque) => (

      <Space>

        <Tooltip title="View">

          <EyeOutlined

            style={{

              color: '#1677ff',

              cursor: 'pointer',

            }}

            onClick={() =>

              onView(cheque)

            }

          />

        </Tooltip>

        {

          cheque.can_edit && (

            <Tooltip title="Edit">

              <EditOutlined

                style={{

                  color: '#52c41a',

                  cursor: 'pointer',

                }}

                onClick={() =>

                  onEdit(cheque)

                }

              />

            </Tooltip>

          )

        }

        {

          cheque.can_void && (

            <Tooltip title="Void">

              <StopOutlined

                style={{

                  color: '#fa541c',

                  cursor: 'pointer',

                }}

                onClick={() =>

                  onVoid(cheque)

                }

              />

            </Tooltip>

          )

        }

        {

          cheque.can_activate && (

            <Tooltip title="Activate">

              <CheckCircleOutlined

                style={{

                  color: '#13c2c2',

                  cursor: 'pointer',

                }}

                onClick={() =>

                  onActivate(cheque)

                }

              />

            </Tooltip>

          )

        }

        {

          !cheque.is_used && (

            <Tooltip title="Delete">

              <DeleteOutlined

                style={{

                  color: '#ff4d4f',

                  cursor: 'pointer',

                }}

                onClick={() =>

                  onDelete(cheque)

                }

              />

            </Tooltip>

          )

        }

      </Space>

    ),

  },

];
import {
    Button,
    Card,
    Descriptions,
   
    Space,
    Table,
    Tag,
    message,
} from 'antd';

import {
    BankOutlined,
    EditOutlined,
    PlusOutlined,
    StarFilled,
} from '@ant-design/icons';

import {
    useEffect,
    useState,
} from 'react';

import {
    useNavigate,
    useParams,
} from 'react-router';

import { purchasersApi } from '../../../api/purchasers';
import { purchaserAccountsApi } from '../../../api/purchaserAccounts';

import type {
    Purchaser,
    PurchaserAccount,
} from '../../../types/purchaser';

import AccountDrawer from './accountDrawer';

export default function PurchaserDetailsPage() {

    const navigate = useNavigate();

    const { id } = useParams();

    const [loading, setLoading] =
        useState(true);

    const [purchaser, setPurchaser] =
        useState<Purchaser>();

    const [accounts, setAccounts] =
        useState<PurchaserAccount[]>([]);

        const [drawerOpen, setDrawerOpen] = useState(false);

    const [, setSelectedAccount] =
    useState<PurchaserAccount>();

    useEffect(() => {

        if (id) {

            loadData();

        }

    }, [id]);

    async function loadData() {

        try {

            setLoading(true);

            const purchaserData =
                await purchasersApi.get(
                    Number(id),
                );

            const accountData =
                await purchaserAccountsApi.list(
                    Number(id)
                );

            setPurchaser(
                purchaserData.data
            );

            setAccounts(
                accountData
            );

        } catch {

            message.error(
                'Unable to load purchaser.'
            );

        } finally {

            setLoading(false);

        }

    }

    async function setPrimary(
        accountId: number
    ) {

        try {

            await purchaserAccountsApi.setPrimary(

                Number(id),

                accountId

            );

            message.success(
                'Primary account updated.'
            );

            loadData();

        } catch {

            message.error(
                'Unable to update primary account.'
            );

        }

    }

    async function deleteAccount(
        accountId: number
    ) {

        try {

            await purchaserAccountsApi.remove(

                Number(id),

                accountId

            );

            message.success(
                'Account deleted.'
            );

            loadData();

        } catch {

            message.error(
                'Unable to delete account.'
            );

        }

    }

    const columns = [

        {

            title: 'Bank',

            render: (_: any, row: PurchaserAccount) =>

                row.bank?.name,

        },

        {

            title: 'Account Number',

            dataIndex: 'account_number',

        },

        {

            title: 'Account Name',

            dataIndex: 'account_name',

        },

        {

            title: 'Currency',

            dataIndex: 'currency',

        },

        {

            title: 'Primary',

            render: (_: any, row: PurchaserAccount) =>

                row.is_primary

                    ?

                    <Tag color="green">

                        Primary

                    </Tag>

                    :

                    '-',

        },

        {

            title: 'Status',

            render: (_: any, row: PurchaserAccount) =>

                row.status,

        },

        {

            title: 'Actions',

            render: (_: any, row: PurchaserAccount) => (

                <Space>

                    {

                        !row.is_primary &&

                        <Button

                            icon={<StarFilled />}

                            onClick={() =>

                                setPrimary(

                                    row.id

                                )

                            }

                        >

                            Set Primary

                        </Button>

                    }

                    <Button
    icon={<EditOutlined />}
    onClick={() => {

        setSelectedAccount(row);

        setDrawerOpen(true);

    }}
>
    Edit
</Button>

                    <Button

                        danger

                        onClick={() =>

                            deleteAccount(

                                row.id

                            )

                        }

                    >

                        Delete

                    </Button>

                </Space>

            ),

        },

    ];

    return (

        <Space

            direction="vertical"

            size="large"

            style={{ width: '100%' }}

        >

            <Card

                loading={loading}

                title="Purchaser Information"

                extra={

                    <Button

                        icon={<EditOutlined />}

                        onClick={() =>

                            navigate(

                                `/administration/purchasers/${id}/edit`

                            )

                        }

                    >

                        Edit Purchaser

                    </Button>

                }

            >

                <Descriptions

                    bordered

                    column={2}

                >

                    <Descriptions.Item label="Purchaser No">

                        {purchaser?.purchaser_no}

                    </Descriptions.Item>

                    <Descriptions.Item label="Status">

                        <Tag color="green">

                            {purchaser?.status}

                        </Tag>

                    </Descriptions.Item>

                    <Descriptions.Item label="Purchaser Name">

                        {purchaser?.purchaser_name}

                    </Descriptions.Item>

                    <Descriptions.Item label="Registered">

                        {purchaser?.date_registered}

                    </Descriptions.Item>

                </Descriptions>

            </Card>

            <Card

                title={

                    <Space>

                        <BankOutlined />

                        Bank Accounts

                    </Space>

                }

                extra={

                    <Button
    type="primary"
    icon={<PlusOutlined />}
    onClick={() => {

        setSelectedAccount(undefined);

        setDrawerOpen(true);

    }}
>
    Add Account
</Button>

                }

            >

                <Table

                    rowKey="id"

                    columns={columns}

                    dataSource={accounts}

                    pagination={false}

                />

            </Card>
            <AccountDrawer
            open={drawerOpen}
            purchaser={purchaser ?? null}
            onClose={() => {
                setDrawerOpen(false);
            }}
        />

        </Space>

    );

}
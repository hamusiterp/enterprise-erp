import {
    Button,
    Card,
    Form,
    Space,
    message,
} from 'antd';

import {
    ArrowLeftOutlined,
    SaveOutlined,
} from '@ant-design/icons';

import {
    useEffect,
    useState,
} from 'react';

import {
    useNavigate,
} from 'react-router';

import PurchaserForm from './form';

import {
    purchasersApi,
} from '../../../api/purchasers';

import type {
    PurchaserFormValues,
} from '../../../types/purchaser';

export default function CreatePurchaserPage() {

    const navigate = useNavigate();

    const [form] =
        Form.useForm<PurchaserFormValues>();

    const [saving, setSaving] =
        useState(false);

    const [purchaserNumber, setPurchaserNumber] =
        useState('');

    useEffect(() => {

        loadNextNumber();

    }, []);

    async function loadNextNumber() {

        try {

            const number =
                await purchasersApi.nextPurchaserNumber();

            setPurchaserNumber(number);

        } catch {

            message.error(
                'Unable to generate purchaser number.'
            );

        }

    }

    async function handleSubmit(
        values: PurchaserFormValues
    ) {

        try {

            setSaving(true);

            const purchaser =
                await purchasersApi.create(values);

            message.success(
                'Purchaser created successfully.'
            );

            navigate(
                `/administration/purchasers/${purchaser.data.id}`
            );

        } catch {

            message.error(
                'Unable to save purchaser.'
            );

        } finally {

            setSaving(false);

        }

    }

    return (

        <Card
            title="Add Purchaser"
        >

            <Form

                form={form}

                layout="vertical"

                onFinish={handleSubmit}

                initialValues={{

                    status: 'active',

                }}

            >

                <PurchaserForm

                    form={form}

                    purchaserNumber={
                        purchaserNumber
                    }

                    disabled={saving}

                />

                <Space>

                    <Button

                        icon={
                            <ArrowLeftOutlined />
                        }

                        onClick={() =>
                            navigate(
                                '/administration/purchasers'
                            )
                        }

                    >

                        Back

                    </Button>

                    <Button

                        type="primary"

                        htmlType="submit"

                        loading={saving}

                        icon={
                            <SaveOutlined />
                        }

                    >

                        Save Purchaser

                    </Button>

                </Space>

            </Form>

        </Card>

    );

}
import {
    Button,
    Card,
    Form,
    Skeleton,
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
    useParams,
} from 'react-router';

import PurchaserForm from './form';

import {
    purchasersApi,
} from '../../../api/purchasers';

import type {
    Purchaser,
    PurchaserFormValues,
} from '../../../types/purchaser';

export default function EditPurchaserPage() {

    const navigate = useNavigate();

    const { id } = useParams();

    const [form] =
        Form.useForm<PurchaserFormValues>();

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [purchaser, setPurchaser] =
        useState<Purchaser>();

    useEffect(() => {

        loadPurchaser();

    }, [id]);

    async function loadPurchaser() {

        try {

            setLoading(true);

            const response =
            await purchasersApi.get(
                Number(id),
            );

        const data =
            response.data;

        setPurchaser(data);

        form.setFieldsValue({
            purchaser_no:
                data.purchaser_no,
            purchaser_name:
                data.purchaser_name,
            status:
                data.status,
        });

        } catch {

            message.error(
                'Unable to load purchaser.'
            );

        } finally {

            setLoading(false);

        }

    }

    async function handleSubmit(
        values: PurchaserFormValues
    ) {

        try {

            setSaving(true);

            await purchasersApi.update(

                Number(id),

                values

            );

            message.success(
                'Purchaser updated successfully.'
            );

            navigate(
                `/administration/purchasers/${id}`
            );

        } catch {

            message.error(
                'Unable to update purchaser.'
            );

        } finally {

            setSaving(false);

        }

    }

    if (loading) {

        return <Skeleton active />;

    }

    return (

        <Card
            title="Edit Purchaser"
        >

            <Form

                form={form}

                layout="vertical"

                onFinish={handleSubmit}

            >

                <PurchaserForm

                    form={form}

                    purchaserNumber={
                        purchaser?.purchaser_no
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
                                `/administration/purchasers/${id}`
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

                        Update Purchaser

                    </Button>

                </Space>

            </Form>

        </Card>

    );

}
import {
    CheckCircleOutlined,
    DatabaseOutlined,
    DeleteOutlined,
    StopOutlined,
} from '@ant-design/icons';

import {
    Card,
    Col,
    Row,
    Skeleton,
    Statistic,
} from 'antd';

export interface CrudStatisticsData {
    total: number;
    active: number;
    inactive: number;
    deleted: number;
}

interface CrudStatisticsProps {
    data?: CrudStatisticsData | null;
    loading?: boolean;
}

export default function CrudStatistics({
    data,
    loading = false,
}: CrudStatisticsProps) {
    const statistics = [
        {
            title: 'Total',
            value: data?.total ?? 0,
            icon: <DatabaseOutlined />,
        },
        {
            title: 'Active',
            value: data?.active ?? 0,
            icon: <CheckCircleOutlined />,
        },
        {
            title: 'Inactive',
            value: data?.inactive ?? 0,
            icon: <StopOutlined />,
        },
        {
            title: 'Deleted',
            value: data?.deleted ?? 0,
            icon: <DeleteOutlined />,
        },
    ];

    return (
        <Row gutter={[16, 16]}>
            {statistics.map((item) => (
                <Col
                    key={item.title}
                    xs={24}
                    sm={12}
                    lg={6}
                >
                    <Card variant="borderless">
                        {loading ? (
                            <Skeleton
                                active
                                paragraph={false}
                            />
                        ) : (
                            <Statistic
                                title={item.title}
                                value={item.value}
                                prefix={item.icon}
                            />
                        )}
                    </Card>
                </Col>
            ))}
        </Row>
    );
}
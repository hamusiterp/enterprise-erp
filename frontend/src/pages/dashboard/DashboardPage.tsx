import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  FileDoneOutlined,
  MoreOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Progress,
  Row,
  Space,
  Statistic,
  Table,
  Tag,
  Typography,
} from 'antd';
import '../../styles/dashboard.css';

const { Title, Text } = Typography;

const recentRequests = [
  {
    key: '1',
    requestNo: 'PR-2026-0048',
    requester: 'Samuel Bekele',
    department: 'Information Technology',
    type: 'Purchase Request',
    amount: '125,000.00',
    status: 'Pending',
  },
  {
    key: '2',
    requestNo: 'SR-2026-0132',
    requester: 'Meron Tesfaye',
    department: 'General Services',
    type: 'Store Request',
    amount: '18,450.00',
    status: 'Approved',
  },
  {
    key: '3',
    requestNo: 'TR-2026-0074',
    requester: 'Dawit Solomon',
    department: 'Finance',
    type: 'Transport Request',
    amount: '—',
    status: 'In Review',
  },
  {
    key: '4',
    requestNo: 'BR-2026-0021',
    requester: 'Selamawit Alemu',
    department: 'Marketing',
    type: 'Budget Request',
    amount: '78,600.00',
    status: 'Rejected',
  },
];

function DashboardPage() {
  return (
  <div className="dashboard-page">
      <div className="dashboard-heading">
        <div>
          <Text className="dashboard-eyebrow">OVERVIEW</Text>
          <Title level={2}>Good evening, Biniam</Title>
          <Text type="secondary">
            Here is what is happening across your organization today.
          </Text>
        </div>

        <Button type="primary" icon={<FileDoneOutlined />}>
          Create request
        </Button>
      </div>

      <Row gutter={[18, 18]}>
        <Col xs={24} sm={12} xl={6}>
          <Card className="stat-card">
            <Statistic
              title="Pending approvals"
              value={24}
              prefix={
                <span className="stat-icon stat-icon-warning">
                  <ClockCircleOutlined />
                </span>
              }
            />

            <div className="stat-footer">
              <span className="stat-up">
                <ArrowUpOutlined /> 8.2%
              </span>
              <Text type="secondary">from last week</Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} xl={6}>
          <Card className="stat-card">
            <Statistic
              title="Completed requests"
              value={186}
              prefix={
                <span className="stat-icon stat-icon-success">
                  <CheckCircleOutlined />
                </span>
              }
            />

            <div className="stat-footer">
              <span className="stat-up">
                <ArrowUpOutlined /> 12.5%
              </span>
              <Text type="secondary">from last month</Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} xl={6}>
          <Card className="stat-card">
            <Statistic
              title="Purchase requests"
              value={47}
              prefix={
                <span className="stat-icon stat-icon-primary">
                  <ShoppingCartOutlined />
                </span>
              }
            />

            <div className="stat-footer">
              <span className="stat-down">
                <ArrowDownOutlined /> 3.1%
              </span>
              <Text type="secondary">from last month</Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} xl={6}>
          <Card className="stat-card">
            <Statistic
              title="Active users"
              value={328}
              prefix={
                <span className="stat-icon stat-icon-purple">
                  <TeamOutlined />
                </span>
              }
            />

            <div className="stat-footer">
              <span className="stat-up">
                <ArrowUpOutlined /> 4.6%
              </span>
              <Text type="secondary">this quarter</Text>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[18, 18]} className="dashboard-main-row">
        <Col xs={24} xl={16}>
          <Card
            className="dashboard-card"
            title={
              <div>
                <Text className="card-heading">Recent requests</Text>
                <Text className="card-subheading">
                  Latest activity requiring attention
                </Text>
              </div>
            }
            extra={<Button type="link">View all</Button>}
          >
            <Table
              dataSource={recentRequests}
              pagination={false}
              scroll={{ x: 760 }}
              columns={[
                {
                  title: 'Request',
                  dataIndex: 'requestNo',
                  key: 'requestNo',
                  render: (value: string) => (
                    <Text strong className="request-number">
                      {value}
                    </Text>
                  ),
                },
                {
                  title: 'Requester',
                  dataIndex: 'requester',
                  key: 'requester',
                },
                {
                  title: 'Department',
                  dataIndex: 'department',
                  key: 'department',
                },
                {
                  title: 'Type',
                  dataIndex: 'type',
                  key: 'type',
                },
                {
                  title: 'Amount',
                  dataIndex: 'amount',
                  key: 'amount',
                  render: (value: string) =>
                    value === '—' ? value : `$${value}`,
                },
                {
                  title: 'Status',
                  dataIndex: 'status',
                  key: 'status',
                  render: (status: string) => {
                    const statusColor: Record<string, string> = {
                      Pending: 'gold',
                      Approved: 'green',
                      'In Review': 'blue',
                      Rejected: 'red',
                    };

                    return <Tag color={statusColor[status]}>{status}</Tag>;
                  },
                },
                {
                  title: '',
                  key: 'action',
                  width: 45,
                  render: () => (
                    <Button type="text" icon={<MoreOutlined />} />
                  ),
                },
              ]}
            />
          </Card>
        </Col>

        <Col xs={24} xl={8}>
          <Card
            className="dashboard-card"
            title={
              <div>
                <Text className="card-heading">Budget utilization</Text>
                <Text className="card-subheading">
                  Current fiscal year overview
                </Text>
              </div>
            }
            extra={<DollarOutlined />}
          >
            <div className="budget-total">
              <Text type="secondary">Total utilized</Text>
              <Title level={2}>$4,286,450</Title>
              <Text type="secondary">of $6,500,000 approved budget</Text>
            </div>

            <Progress percent={66} showInfo={false} strokeWidth={10} />

            <Space direction="vertical" size={20} className="budget-list">
              <div>
                <div className="budget-label">
                  <Text>Operations</Text>
                  <Text strong>78%</Text>
                </div>
                <Progress percent={78} showInfo={false} />
              </div>

              <div>
                <div className="budget-label">
                  <Text>Technology</Text>
                  <Text strong>64%</Text>
                </div>
                <Progress percent={64} showInfo={false} />
              </div>

              <div>
                <div className="budget-label">
                  <Text>Administration</Text>
                  <Text strong>52%</Text>
                </div>
                <Progress percent={52} showInfo={false} />
              </div>

              <div>
                <div className="budget-label">
                  <Text>Marketing</Text>
                  <Text strong>43%</Text>
                </div>
                <Progress percent={43} showInfo={false} />
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default DashboardPage;
import {
  ArrowRightOutlined,
  LockOutlined,
  MailOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import {
  App,
  Button,
  Checkbox,
  Form,
  Input,
  Typography,
} from 'antd';
import '../../styles/login.css';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../features/auth/AuthContext';

const { Title, Paragraph, Text } = Typography;

interface LoginFormValues {
  email: string;
  password: string;
  remember: boolean;
}

function LoginPage() {
  const navigate = useNavigate();

  const { message } = App.useApp();
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: LoginFormValues) => {
  setIsSubmitting(true);

  try {
    await login(values);

    message.success('Welcome back.');

    navigate('/dashboard', {
      replace: true,
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const validationMessage =
        error.response?.data?.errors?.email?.[0];

      message.error(
        validationMessage ??
          'Unable to sign in. Please verify your credentials.',
      );
    } else {
      message.error('An unexpected error occurred.');
    }
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <main className="login-page">
      <section className="login-brand-panel">
        <div className="login-brand-overlay" />

        <div className="login-brand-content">
          <div className="login-brand">
            <div className="login-brand-logo">E</div>

            <div>
              <Text className="login-brand-name">Enterprise ERP</Text>
              <Text className="login-brand-subtitle">
                Unified business management
              </Text>
            </div>
          </div>

          <div className="login-hero-content">
            <div className="login-security-label">
              <SafetyCertificateOutlined />
              Enterprise-grade platform
            </div>

            <Title className="login-hero-title">
              Manage your business from one intelligent platform.
            </Title>
            

            <div className="login-features">
              <div>
                <strong>Centralized</strong>
                <span>One platform for all departments</span>
              </div>

              <div>
                <strong>Secure</strong>
                <span>Permission and audit-controlled access</span>
              </div>

              <div>
                <strong>Scalable</strong>
                <span>Built for future web and mobile growth</span>
              </div>
            </div>
          </div>

          <Text className="login-brand-footer">
            © {new Date().getFullYear()} Enterprise ERP
          </Text>
        </div>
      </section>

      <section className="login-form-panel">
        <div className="login-form-container">
          <div className="login-mobile-brand">
            <div className="login-brand-logo">E</div>
            <Text className="login-brand-name">Enterprise ERP</Text>
          </div>

          <div className="login-heading">
            <Text className="login-eyebrow">WELCOME BACK</Text>

            <Title level={1}>Sign in to your account</Title>

            <Paragraph>
              Enter your account details to access the ERP workspace.
            </Paragraph>
          </div>

          <Form<LoginFormValues>
            layout="vertical"
            requiredMark={false}
            initialValues={{
              remember: true,
            }}
            onFinish={handleSubmit}
          >
            <Form.Item
              label="Email address"
              name="email"
              rules={[
                {
                  required: true,
                  message: 'Please enter your email address.',
                },
                {
                  type: 'email',
                  message: 'Please enter a valid email address.',
                },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="name@company.com"
                autoComplete="email"
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: 'Please enter your password.',
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </Form.Item>

            <div className="login-form-options">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>

              <Button type="link" className="login-forgot-button">
                Forgot password?
              </Button>
            </div>

            <Button
  type="primary"
  htmlType="submit"
  block
  loading={isSubmitting}
  icon={<ArrowRightOutlined />}
  iconPlacement="end"
  className="login-submit-button"
>
  Sign in
</Button>
          </Form>

          <div className="login-help">
            <Text type="secondary">
              Need account support? Contact your system administrator.
            </Text>
          </div>
        </div>
      </section>
    </main>
  );
}

export default LoginPage;
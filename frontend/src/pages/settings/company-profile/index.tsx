import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Image,
  Input,
  Row,
  Select,
  Space,
  Spin,
  Switch,
  Upload,
  message,
  Radio,
} from 'antd';
import {
  SaveOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';

import {
  getCompanySettings,
  updateCompanySettings,
  uploadCompanyBranding,
} from '../../../api/companySettings';

import type {
  CompanySetting,
} from '../../../api/companySettings';

const CompanySettingsPage: React.FC = () => {
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [settings, setSettings] =
    useState<CompanySetting | null>(null);

  const [logoFileList, setLogoFileList] =
    useState<UploadFile[]>([]);

  const [faviconFileList, setFaviconFileList] =
    useState<UploadFile[]>([]);

const loadSettings = async () => {
  try {
    setLoading(true);

    const data = await getCompanySettings();

    setSettings(data);

    form.setFieldsValue({
      ...data,

      stock_management_enabled:
        data.stock_management_enabled
          ? 'yes'
          : 'no',
    });
  } catch (error: any) {
    message.error(
      error?.response?.data?.message ||
        'Failed to load company settings.'
    );
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    loadSettings();
  }, []);

const handleSave = async () => {
  try {
    const values =
      await form.validateFields();

    setSaving(true);

    const payload = {
      ...values,

      stock_management_enabled:
        values.stock_management_enabled ===
        'yes',
    };

    const updated =
      await updateCompanySettings(
        payload
      );

    setSettings(updated);

    // Keep Select synchronized after save
    form.setFieldsValue({
      ...updated,

      stock_management_enabled:
        updated.stock_management_enabled
          ? 'yes'
          : 'no',
    });

    message.success(
      'Company settings updated successfully.'
    );
  } catch (error: any) {
    if (error?.errorFields) {
      return;
    }

    console.error(
      'Company settings save error:',
      error
    );

    message.error(
      error?.response?.data?.message ||
        'Failed to update company settings.'
    );
  } finally {
    setSaving(false);
  }
};

  const handleBrandingUpload = async () => {
    const logoFile =
      logoFileList.length > 0
        ? (logoFileList[0].originFileObj as File)
        : undefined;

    const faviconFile =
      faviconFileList.length > 0
        ? (faviconFileList[0].originFileObj as File)
        : undefined;

    if (!logoFile && !faviconFile) {
      message.warning(
        'Please select a logo or favicon first.'
      );

      return;
    }

    try {
      setUploading(true);

      const updated =
        await uploadCompanyBranding(
          logoFile,
          faviconFile
        );

      setSettings(updated);

      setLogoFileList([]);
      setFaviconFileList([]);

      message.success(
        'Company branding updated successfully.'
      );
    } catch (error: any) {
      message.error(
        error?.response?.data?.message ||
          'Failed to upload company branding.'
      );
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          padding: 80,
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <Card
    title="Company Profile & Branding"
    variant="borderless"
>
        <Form
          form={form}
          layout="vertical"
        >
          <Divider>
            Company Information
          </Divider>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="company_name"
                label="Company Name"
                rules={[
                  {
                    required: true,
                    message: 'Company name is required.',
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="trading_name"
                label="Trading Name"
              >
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                name="company_code"
                label="Company Code"
              >
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                name="tin_number"
                label="TIN Number"
              >
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                name="vat_number"
                label="VAT Number"
              >
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="registration_number"
                label="Registration Number"
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Divider>
            Contact Information
          </Divider>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  {
                    type: 'email',
                    message:
                      'Please enter a valid email address.',
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24} md={6}>
              <Form.Item
                name="phone"
                label="Phone"
              >
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24} md={6}>
              <Form.Item
                name="phone_2"
                label="Alternative Phone"
              >
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="website"
                label="Website"
              >
                <Input placeholder="https://example.com" />
              </Form.Item>
            </Col>
          </Row>

          <Divider>
            Address
          </Divider>

          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                name="country"
                label="Country"
              >
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                name="country_code"
                label="Country Code"
              >
                <Input placeholder="ET" />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                name="city"
                label="City"
              >
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="state_region"
                label="State / Region"
              >
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="postal_code"
                label="Postal Code"
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name="address"
                label="Address"
              >
                <Input.TextArea rows={3} />
              </Form.Item>
            </Col>
          </Row>

          <Divider>
            Localization
          </Divider>

          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                name="default_currency"
                label="Default Currency"
                rules={[
                  {
                    required: true,
                    message:
                      'Default currency is required.',
                  },
                ]}
              >
                <Input placeholder="ETB" />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                name="timezone"
                label="Timezone"
                rules={[
                  {
                    required: true,
                    message: 'Timezone is required.',
                  },
                ]}
              >
                <Select
                  showSearch
                  options={[
                    {
                      label: 'Africa/Addis_Ababa',
                      value: 'Africa/Addis_Ababa',
                    },
                    {
                      label: 'UTC',
                      value: 'UTC',
                    },
                    {
                      label: 'Europe/London',
                      value: 'Europe/London',
                    },
                    {
                      label: 'America/New_York',
                      value: 'America/New_York',
                    },
                  ]}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                name="date_format"
                label="Date Format"
                rules={[
                  {
                    required: true,
                    message: 'Date format is required.',
                  },
                ]}
              >
                <Select
                  options={[
                    {
                      label: 'YYYY-MM-DD',
                      value: 'Y-m-d',
                    },
                    {
                      label: 'DD-MM-YYYY',
                      value: 'd-m-Y',
                    },
                    {
                      label: 'DD/MM/YYYY',
                      value: 'd/m/Y',
                    },
                    {
                      label: 'MM/DD/YYYY',
                      value: 'm/d/Y',
                    },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider>
            Print Settings
          </Divider>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="print_header"
                label="Print Header"
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name="print_footer"
                label="Print Footer"
              >
                <Input.TextArea rows={3} />
              </Form.Item>
            </Col>
          </Row>

          <Divider>
            Company Status
          </Divider>

          <Form.Item
            name="is_active"
            label="Active"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
  name="stock_management_enabled"
  label="Stock Available?"
  rules={[
    {
      required: true,
      message: 'Select whether stock management is available.',
    },
  ]}
>
  <Select
    placeholder="Select Yes or No"
    options={[
      {
        label: 'Yes',
        value: 'yes',
      },
      {
        label: 'No',
        value: 'no',
      },
    ]}
  />
</Form.Item>

          <Button
            type="primary"
            icon={<SaveOutlined />}
            loading={saving}
            onClick={handleSave}
          >
            Save Company Settings
          </Button>
        </Form>

        <Divider>
          Branding
        </Divider>

        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Card
              size="small"
              title="Company Logo"
            >
              {settings?.logo_url && (
                <div style={{ marginBottom: 16 }}>
                  <Image
                    src={settings.logo_url}
                    width={160}
                    preview
                  />
                </div>
              )}

              <Upload
                accept=".png,.jpg,.jpeg,.webp"
                beforeUpload={() => false}
                fileList={logoFileList}
                maxCount={1}
                onChange={({ fileList }) =>
                  setLogoFileList(fileList)
                }
              >
                <Button icon={<UploadOutlined />}>
                  Select Logo
                </Button>
              </Upload>
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card
              size="small"
              title="Favicon"
            >
              {settings?.favicon_url && (
                <div style={{ marginBottom: 16 }}>
                  <Image
                    src={settings.favicon_url}
                    width={64}
                    preview
                  />
                </div>
              )}

              <Upload
                accept=".png,.jpg,.jpeg,.webp,.ico"
                beforeUpload={() => false}
                fileList={faviconFileList}
                maxCount={1}
                onChange={({ fileList }) =>
                  setFaviconFileList(fileList)
                }
              >
                <Button icon={<UploadOutlined />}>
                  Select Favicon
                </Button>
              </Upload>
            </Card>
          </Col>
        </Row>

        <div style={{ marginTop: 20 }}>
          <Space>
            <Button
              type="primary"
              icon={<UploadOutlined />}
              loading={uploading}
              onClick={handleBrandingUpload}
            >
              Upload Branding
            </Button>
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default CompanySettingsPage;
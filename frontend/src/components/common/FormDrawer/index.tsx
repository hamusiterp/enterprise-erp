import type { ReactNode } from 'react';

import {
  Button,
  Drawer,
  Flex,
  Space,
} from 'antd';

interface FormDrawerProps {
  title: string;
  open: boolean;
  loading?: boolean;
  submitText?: string;
  width?: number | string;
  children: ReactNode;
  onClose: () => void;
  onSubmit: () => void;
}

function FormDrawer({
  title,
  open,
  loading = false,
  submitText = 'Save',
  width = 520,
  children,
  onClose,
  onSubmit,
}: FormDrawerProps) {
  return (
    <Drawer
      title={title}
      open={open}
      width={width}
      size="large"
      destroyOnHidden
      maskClosable={!loading}
      closable={!loading}
      onClose={onClose}
      footer={
        <Flex justify="flex-end">
          <Space>
            <Button
              disabled={loading}
              onClick={onClose}
            >
              Cancel
            </Button>

            <Button
              type="primary"
              loading={loading}
              onClick={onSubmit}
            >
              {submitText}
            </Button>
          </Space>
        </Flex>
      }
    >
      {children}
    </Drawer>
  );
}

export default FormDrawer;
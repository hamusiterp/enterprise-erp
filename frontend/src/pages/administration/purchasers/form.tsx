import {
  Col,
  Form,
  Input,
  Row,
  Select,
} from 'antd';

import type {
  FormInstance,
} from 'antd';

import type {
  PurchaserFormValues,
} from '../../../types/purchaser';

interface PurchaserFormProps {
  form: FormInstance<PurchaserFormValues>;
  purchaserNumber?: string;
  disabled?: boolean;
}

const statusOptions = [

  {

    label: 'Active',

    value: 'active',

  },

  {

    label: 'Inactive',

    value: 'inactive',

  },

];

function PurchaserForm({
  form,
  purchaserNumber,
  disabled = false,
}: PurchaserFormProps) {

  return (

    <Form<PurchaserFormValues>

      form={form}

      layout="vertical"

      requiredMark

      initialValues={{

        status: 'active',

      }}

    >

      <Row gutter={[16, 0]}>

        <Col xs={24} md={12}>

          <Form.Item

            name="purchaser_no"

            label="Purchaser Number"

          >

            <Input
            disabled
            value={purchaserNumber}
            placeholder="Generated automatically"
          />

          </Form.Item>

        </Col>

        <Col xs={24} md={12}>

          <Form.Item

            name="status"

            label="Status"

            rules={[

              {

                required: true,

                message:
                  'Status is required.',

              },

            ]}

          >

            <Select

              options={statusOptions}

              placeholder="Select status"

              disabled={disabled}

            />

          </Form.Item>

        </Col>

        <Col xs={24}>

          <Form.Item

            name="purchaser_name"

            label="Purchaser Name"

            rules={[

              {

                required: true,

                whitespace: true,

                message:
                  'Purchaser name is required.',

              },

              {

                max: 100,

                message:
                  'Purchaser name cannot exceed 100 characters.',

              },

            ]}

          >

            <Input

              placeholder="Enter purchaser name"

              disabled={disabled}

            />

          </Form.Item>

        </Col>

      </Row>

    </Form>

  );

}

export default PurchaserForm;
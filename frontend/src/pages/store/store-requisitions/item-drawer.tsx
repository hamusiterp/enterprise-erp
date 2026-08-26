import {
  App,
  Button,
  Col,
  DatePicker,
  Drawer,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
} from 'antd';

import {
  PlusOutlined,
} from '@ant-design/icons';

import dayjs, {
  type Dayjs,
} from 'dayjs';

import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  itemsApi,
} from '../../../api/items';

import {
  createUnitOfMeasurement,
  fetchUnitsOfMeasurement,
} from '../../../api/unitsOfMeasurement';

import type {
  UnitOfMeasurement,
  UnitOfMeasurementPayload,
} from '../../../api/unitsOfMeasurement';

import type {
  Item,
  ItemFormValues,
} from '../../../types/item';

import ItemForm from '../../administration/items/form';

import type {
  SrDeliveryType,
  SrPriority,
  StoreRequisitionLine,
} from './types';

interface SrItemDrawerProps {
  open: boolean;

  mrRequested: boolean;

  initialValue?: StoreRequisitionLine | null;

  onClose: () => void;

  onSave: (
    line: StoreRequisitionLine,
  ) => void;
}

interface SrLineFormValues {
  item_id: number;

  uom_id: number;

  mr_date?: Dayjs | null;
  mr_no?: string | null;
  mr_qty?: number | null;

  sr_qty: number;

  expected_delivery_date: Dayjs;

  delivery_type: SrDeliveryType;

  priority: SrPriority;

  urgency_reason?: string | null;

  remark?: string | null;
}

function SrItemDrawer({
  open,
  mrRequested,
  initialValue,
  onClose,
  onSave,
}: SrItemDrawerProps) {
  const {
    message,
  } = App.useApp();

  const [
    form,
  ] = Form.useForm<SrLineFormValues>();

  const [
    itemForm,
  ] = Form.useForm<ItemFormValues>();

  const [
    uomForm,
  ] = Form.useForm<UnitOfMeasurementPayload>();

  const [
    items,
    setItems,
  ] = useState<Item[]>([]);

  const [
    units,
    setUnits,
  ] = useState<UnitOfMeasurement[]>([]);

  const [
    loadingItems,
    setLoadingItems,
  ] = useState(false);

  const [
    loadingUnits,
    setLoadingUnits,
  ] = useState(false);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    itemDrawerOpen,
    setItemDrawerOpen,
  ] = useState(false);

  const [
    uomDrawerOpen,
    setUomDrawerOpen,
  ] = useState(false);

  const [
    creatingItem,
    setCreatingItem,
  ] = useState(false);

  const [
    creatingUom,
    setCreatingUom,
  ] = useState(false);

  const priority =
    Form.useWatch(
      'priority',
      form,
    );

  const selectedItemId =
    Form.useWatch(
      'item_id',
      form,
    );

  const selectedItem =
    useMemo(
      () =>
        items.find(
          (item) =>
            item.id ===
            selectedItemId,
        ) ?? null,
      [
        items,
        selectedItemId,
      ],
    );

  const loadItems = async () => {
    try {
      setLoadingItems(true);

      const response =
        await itemsApi.list({
          page: 1,
          per_page: 100,
          status: 'active',
          sort_by: 'item_description',
          sort_direction: 'asc',
        });

      setItems(
        response.data ?? [],
      );
    } catch (error) {
      console.error(error);

      message.error(
        'Unable to load items.',
      );
    } finally {
      setLoadingItems(false);
    }
  };

  const loadUnits = async () => {
    try {
      setLoadingUnits(true);

      const response =
        await fetchUnitsOfMeasurement();

      setUnits(
        response.filter(
          (unit) =>
            unit.is_active,
        ),
      );
    } catch (error) {
      console.error(error);

      message.error(
        'Unable to load units of measurement.',
      );
    } finally {
      setLoadingUnits(false);
    }
  };

  useEffect(() => {
    if (!open) {
      return;
    }

    void loadItems();
    void loadUnits();
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    form.resetFields();

    if (initialValue) {
      form.setFieldsValue({
        item_id:
          initialValue.item_id,

        uom_id:
          initialValue.uom_id,

        mr_date:
          initialValue.mr_date
            ? dayjs(
                initialValue.mr_date,
              )
            : null,

        mr_no:
          initialValue.mr_no ??
          null,

        mr_qty:
          initialValue.mr_qty ??
          null,

        sr_qty:
          initialValue.sr_qty,

        expected_delivery_date:
          dayjs(
            initialValue
              .expected_delivery_date,
          ),

        delivery_type:
          initialValue.delivery_type,

        priority:
          initialValue.priority,

        urgency_reason:
          initialValue
            .urgency_reason ??
          null,

        remark:
          initialValue.remark ??
          null,
      });

      return;
    }

    form.setFieldsValue({
      delivery_type:
        'at_any_time',

      priority:
        'normal',

      mr_date:
        null,

      mr_no:
        null,

      mr_qty:
        null,

      urgency_reason:
        null,

      remark:
        null,
    });
  }, [
    open,
    initialValue,
    form,
  ]);

  useEffect(() => {
    if (!open) {
      return;
    }

    /*
     * When MR Requested = No,
     * force-clear all MR fields.
     */
    if (!mrRequested) {
      form.setFieldsValue({
        mr_date: null,
        mr_no: null,
        mr_qty: null,
      });
    }
  }, [
    mrRequested,
    open,
    form,
  ]);

  useEffect(() => {
    /*
     * Urgency reason belongs only
     * to urgent requests.
     */
    if (
      priority &&
      priority !== 'urgent'
    ) {
      form.setFieldValue(
        'urgency_reason',
        null,
      );
    }
  }, [
    priority,
    form,
  ]);

  const handleItemChange = (
    itemId: number,
  ) => {
    const item =
      items.find(
        (record) =>
          record.id === itemId,
      );

    /*
     * Automatically select the UOM
     * registered against the Item.
     */
    if (item?.uom_id) {
      form.setFieldValue(
        'uom_id',
        item.uom_id,
      );
    } else {
      form.setFieldValue(
        'uom_id',
        undefined,
      );
    }
  };

  const disabledDeliveryDate = (
    current: Dayjs,
  ) => {
    /*
     * Today and past dates cannot
     * be selected.
     */
    return current.isBefore(
      dayjs().add(1, 'day')
        .startOf('day'),
    );
  };

  const validateUrgentDate = async (
    _rule: unknown,
    value?: Dayjs,
  ) => {
    if (!value) {
      return Promise.resolve();
    }

    if (
      form.getFieldValue(
        'priority',
      ) !== 'urgent'
    ) {
      return Promise.resolve();
    }

    const latestUrgentDate =
      dayjs()
        .startOf('day')
        .add(3, 'day');

    if (
      value
        .startOf('day')
        .isAfter(
          latestUrgentDate,
        )
    ) {
      return Promise.reject(
        new Error(
          'Urgent requests must have an expected delivery date within 3 days.',
        ),
      );
    }

    return Promise.resolve();
  };

  const handleSaveLine = async () => {
    try {
      const values =
        await form.validateFields();

      setSaving(true);

      const item =
        items.find(
          (record) =>
            record.id ===
            values.item_id,
        );

      const uom =
        units.find(
          (record) =>
            record.id ===
            values.uom_id,
        );

      if (!item) {
        message.error(
          'Selected item could not be found.',
        );

        return;
      }

      if (!uom) {
        message.error(
          'Selected unit of measurement could not be found.',
        );

        return;
      }

      const line:
        StoreRequisitionLine = {
        key:
          initialValue?.key ??
          `${Date.now()}-${Math.random()
            .toString(36)
            .slice(2)}`,

        item_id:
          values.item_id,

        item: {
          id:
            item.id,

          item_no:
            item.item_no,

          item_description:
            item.item_description,

          category:
            item.category,

          uom_id:
            item.uom_id,

          uom:
            item.uom,
        },

        uom_id:
          values.uom_id,

        uom: {
          id:
            uom.id,

          code:
            uom.code,

          name:
            uom.name,

          symbol:
            uom.symbol,

          decimal_places:
            uom.decimal_places,
        },

        mr_date:
          mrRequested &&
          values.mr_date
            ? values.mr_date.format(
                'YYYY-MM-DD',
              )
            : null,

        mr_no:
          mrRequested
            ? values.mr_no
                ?.trim() ||
              null
            : null,

        mr_qty:
          mrRequested
            ? values.mr_qty ??
              null
            : null,

        sr_qty:
          Number(
            values.sr_qty,
          ),

        expected_delivery_date:
          values
            .expected_delivery_date
            .format(
              'YYYY-MM-DD',
            ),

        delivery_type:
          values.delivery_type,

        priority:
          values.priority,

        urgency_reason:
          values.priority ===
          'urgent'
            ? values
                .urgency_reason
                ?.trim() ||
              null
            : null,

        remark:
          values.remark
            ?.trim() ||
          null,
      };

      onSave(line);

      form.resetFields();

      onClose();
    } catch (error: unknown) {
      if (
        typeof error ===
          'object' &&
        error !== null &&
        'errorFields' in error
      ) {
        return;
      }

      console.error(error);

      message.error(
        'Unable to add the requisition item.',
      );
    } finally {
      setSaving(false);
    }
  };

  const openNewItemDrawer = () => {
    itemForm.resetFields();

    itemForm.setFieldsValue({
      status: 'active',
      inventory: 'Stock',
      product_date: null,
    });

    setItemDrawerOpen(true);
  };

  const handleCreateItem = async () => {
  try {
    const values =
      await itemForm.validateFields();

    setCreatingItem(true);

    await itemsApi.create({
      item_no: '',

      item_description:
        values.item_description.trim(),

      category:
        values.category,

      uom_id:
        values.uom_id,

      type:
        values.type,

      inventory:
        values.inventory,

      product_date:
        values.product_date || null,

      status:
        values.status,
    });

    message.success(
      'Item created successfully.',
    );

    setItemDrawerOpen(false);

    itemForm.resetFields();

    await loadItems();
  } catch (error: unknown) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'errorFields' in error
    ) {
      return;
    }

    console.error(error);

    message.error(
      'Unable to create item.',
    );
  } finally {
    setCreatingItem(false);
  }
};

  const openNewUomDrawer = () => {
    uomForm.resetFields();

    uomForm.setFieldsValue({
      decimal_places: 0,
      is_active: true,
    });

    setUomDrawerOpen(true);
  };

  const handleCreateUom = async () => {
    try {
      const values =
        await uomForm.validateFields();

      setCreatingUom(true);

      const created =
        await createUnitOfMeasurement(
          {
            code:
              values.code
                .trim()
                .toUpperCase(),

            name:
              values.name
                .trim(),

            symbol:
              values.symbol
                ?.trim() ||
              null,

            category:
              values.category ||
              null,

            decimal_places:
              Number(
                values.decimal_places,
              ),

            is_active:
              values.is_active,

            description:
              values.description
                ?.trim() ||
              null,
          },
        );

      message.success(
        'Unit of measurement created successfully.',
      );

      setUomDrawerOpen(false);

      await loadUnits();

      form.setFieldValue(
        'uom_id',
        created.id,
      );
    } catch (error: unknown) {
      if (
        typeof error ===
          'object' &&
        error !== null &&
        'errorFields' in error
      ) {
        return;
      }

      console.error(error);

      message.error(
        'Unable to create unit of measurement.',
      );
    } finally {
      setCreatingUom(false);
    }
  };

  return (
    <>
      <Drawer
        title={
          initialValue
            ? 'Edit SR Item'
            : 'Add SR Item'
        }
        open={open}
        width={680}
        destroyOnHidden
        onClose={onClose}
        extra={
          <Space>
            <Button
              onClick={onClose}
            >
              Cancel
            </Button>

            <Button
              type="primary"
              loading={saving}
              onClick={() =>
                void handleSaveLine()
              }
            >
              {initialValue
                ? 'Update Item'
                : 'Add Item'}
            </Button>
          </Space>
        }
      >
        <Form<SrLineFormValues>
          form={form}
          layout="vertical"
          requiredMark
        >
          {mrRequested && (
            <Row gutter={16}>
              <Col
                xs={24}
                md={8}
              >
                <Form.Item
                  name="mr_date"
                  label="MR Date"
                  rules={[
                    {
                      required:
                        true,

                      message:
                        'MR Date is required.',
                    },
                  ]}
                >
                  <DatePicker
                    style={{
                      width:
                        '100%',
                    }}
                    format="YYYY-MM-DD"
                  />
                </Form.Item>
              </Col>

              <Col
                xs={24}
                md={8}
              >
                <Form.Item
                  name="mr_no"
                  label="MR Number"
                  rules={[
                    {
                      required:
                        true,

                      whitespace:
                        true,

                      message:
                        'MR Number is required.',
                    },
                    {
                      max: 100,
                    },
                  ]}
                >
                  <Input
                    placeholder="Enter MR number"
                  />
                </Form.Item>
              </Col>

              <Col
                xs={24}
                md={8}
              >
                <Form.Item
                  name="mr_qty"
                  label="MR Quantity"
                  rules={[
                    {
                      required:
                        true,

                      message:
                        'MR Quantity is required.',
                    },
                  ]}
                >
                  <InputNumber
                    min={0.0001}
                    precision={4}
                    style={{
                      width:
                        '100%',
                    }}
                    placeholder="Enter MR quantity"
                  />
                </Form.Item>
              </Col>
            </Row>
          )}

          <Row gutter={16}>
            <Col
              xs={24}
              md={12}
            >
              <Form.Item
                name="item_id"
                label="Item"
                rules={[
                  {
                    required:
                      true,

                    message:
                      'Please select an item.',
                  },
                ]}
              >
                <Select
                  showSearch
                  allowClear
                  loading={
                    loadingItems
                  }
                  placeholder="Select item"
                  optionFilterProp="label"
                  onChange={
                    handleItemChange
                  }
                  options={items.map(
                    (item) => ({
                      value:
                        item.id,

                      label:
                        `${item.item_no} - ${item.item_description}`,
                    }),
                  )}
                  dropdownRender={(
                    menu,
                  ) => (
                    <>
                      {menu}

                      <div
                        style={{
                          padding:
                            8,
                        }}
                      >
                        <Button
                          type="text"
                          block
                          icon={
                            <PlusOutlined />
                          }
                          onClick={
                            openNewItemDrawer
                          }
                        >
                          Add New Item
                        </Button>
                      </div>
                    </>
                  )}
                />
              </Form.Item>
            </Col>

            <Col
              xs={24}
              md={12}
            >
              <Form.Item
                name="uom_id"
                label="Unit of Measurement"
                rules={[
                  {
                    required:
                      true,

                    message:
                      'Please select a unit of measurement.',
                  },
                ]}
              >
                <Select
                  showSearch
                  allowClear
                  loading={
                    loadingUnits
                  }
                  placeholder="Select unit"
                  optionFilterProp="label"
                  options={units.map(
                    (unit) => ({
                      value:
                        unit.id,

                      label:
                        `${unit.code} - ${unit.name}`,
                    }),
                  )}
                  dropdownRender={(
                    menu,
                  ) => (
                    <>
                      {menu}

                      <div
                        style={{
                          padding:
                            8,
                        }}
                      >
                        <Button
                          type="text"
                          block
                          icon={
                            <PlusOutlined />
                          }
                          onClick={
                            openNewUomDrawer
                          }
                        >
                          Add Unit of Measurement
                        </Button>
                      </div>
                    </>
                  )}
                />
              </Form.Item>
            </Col>
          </Row>

          {selectedItem && (
            <div
              style={{
                marginTop: -8,
                marginBottom: 16,
                padding: 12,
                background:
                  '#fafafa',
                borderRadius: 6,
              }}
            >
              <strong>
                Selected Item:
              </strong>{' '}

              {
                selectedItem
                  .item_description
              }

              {selectedItem.category && (
                <>
                  {' '}
                  | Category:{' '}
                  {
                    selectedItem
                      .category
                  }
                </>
              )}
            </div>
          )}

          <Row gutter={16}>
            <Col
              xs={24}
              md={12}
            >
              <Form.Item
                name="sr_qty"
                label="SR Quantity"
                rules={[
                  {
                    required:
                      true,

                    message:
                      'SR Quantity is required.',
                  },

                  {
                    validator:
                      async (
                        _,
                        value,
                      ) => {
                        if (
                          value ===
                            undefined ||
                          value ===
                            null
                        ) {
                          return;
                        }

                        if (
                          Number(
                            value,
                          ) <= 0
                        ) {
                          throw new Error(
                            'SR Quantity must be greater than zero.',
                          );
                        }

                        if (
                          mrRequested
                        ) {
                          const mrQty =
                            form.getFieldValue(
                              'mr_qty',
                            );

                          if (
                            mrQty &&
                            Number(
                              value,
                            ) >
                              Number(
                                mrQty,
                              )
                          ) {
                            throw new Error(
                              'SR Quantity cannot be greater than MR Quantity.',
                            );
                          }
                        }
                      },
                  },
                ]}
              >
                <InputNumber
                  min={0.0001}
                  precision={4}
                  style={{
                    width:
                      '100%',
                  }}
                  placeholder="Enter requested quantity"
                />
              </Form.Item>
            </Col>

            <Col
              xs={24}
              md={12}
            >
              <Form.Item
                name="expected_delivery_date"
                label="Expected Delivery Date"
                dependencies={[
                  'priority',
                ]}
                rules={[
                  {
                    required:
                      true,

                    message:
                      'Expected Delivery Date is required.',
                  },

                  {
                    validator:
                      validateUrgentDate,
                  },
                ]}
              >
                <DatePicker
                  style={{
                    width:
                      '100%',
                  }}
                  format="YYYY-MM-DD"
                  disabledDate={
                    disabledDeliveryDate
                  }
                  placeholder="Select future date"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col
              xs={24}
              md={12}
            >
              <Form.Item
                name="delivery_type"
                label="Delivery Type"
                rules={[
                  {
                    required:
                      true,

                    message:
                      'Delivery Type is required.',
                  },
                ]}
              >
                <Select
                  options={[
                    {
                      label:
                        'Over Qty Based',

                      value:
                        'over_qty_based',
                    },

                    {
                      label:
                        'At Any Time',

                      value:
                        'at_any_time',
                    },
                  ]}
                />
              </Form.Item>
            </Col>

            <Col
              xs={24}
              md={12}
            >
              <Form.Item
                name="priority"
                label="Priority"
                rules={[
                  {
                    required:
                      true,

                    message:
                      'Priority is required.',
                  },
                ]}
              >
                <Select
                  options={[
                    {
                      label:
                        'Urgent',
                      value:
                        'urgent',
                    },

                    {
                      label:
                        'High',
                      value:
                        'high',
                    },

                    {
                      label:
                        'Normal',
                      value:
                        'normal',
                    },

                    {
                      label:
                        'Low',
                      value:
                        'low',
                    },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          {priority ===
            'urgent' && (
            <Form.Item
              name="urgency_reason"
              label="Urgency Reason"
              rules={[
                {
                  required:
                    true,

                  whitespace:
                    true,

                  message:
                    'Urgency Reason is required for an urgent request.',
                },

                {
                  max: 255,
                },
              ]}
            >
              <Input.TextArea
                rows={3}
                maxLength={255}
                showCount
                placeholder="Explain why this item is urgently required"
              />
            </Form.Item>
          )}

          <Form.Item
            name="remark"
            label="Remark"
            rules={[
              {
                max: 2000,
              },
            ]}
          >
            <Input.TextArea
              rows={4}
              maxLength={2000}
              showCount
              placeholder="Optional remark"
            />
          </Form.Item>
        </Form>
      </Drawer>

      {/* ===============================
          QUICK ADD ITEM DRAWER
      ================================ */}
      <Drawer
        title="Add New Item"
        open={itemDrawerOpen}
        width={700}
        destroyOnHidden
        onClose={() =>
          setItemDrawerOpen(
            false,
          )
        }
        extra={
          <Space>
            <Button
              onClick={() =>
                setItemDrawerOpen(
                  false,
                )
              }
            >
              Cancel
            </Button>

            <Button
              type="primary"
              loading={
                creatingItem
              }
              onClick={() =>
                void handleCreateItem()
              }
            >
              Create Item
            </Button>
          </Space>
        }
      >
        <ItemForm
          form={itemForm}
          disabled={
            creatingItem
          }
        />
      </Drawer>

      {/* ===============================
          QUICK ADD UOM DRAWER
      ================================ */}
      <Drawer
        title="Add Unit of Measurement"
        open={uomDrawerOpen}
        width={520}
        destroyOnHidden
        onClose={() =>
          setUomDrawerOpen(
            false,
          )
        }
        extra={
          <Space>
            <Button
              onClick={() =>
                setUomDrawerOpen(
                  false,
                )
              }
            >
              Cancel
            </Button>

            <Button
              type="primary"
              loading={
                creatingUom
              }
              onClick={() =>
                void handleCreateUom()
              }
            >
              Create Unit
            </Button>
          </Space>
        }
      >
        <Form<UnitOfMeasurementPayload>
          form={uomForm}
          layout="vertical"
        >
          <Form.Item
            name="code"
            label="Code"
            rules={[
              {
                required:
                  true,

                message:
                  'Code is required.',
              },
            ]}
          >
            <Input
              placeholder="PCS"
            />
          </Form.Item>

          <Form.Item
            name="name"
            label="Name"
            rules={[
              {
                required:
                  true,

                message:
                  'Name is required.',
              },
            ]}
          >
            <Input
              placeholder="Pieces"
            />
          </Form.Item>

          <Form.Item
            name="symbol"
            label="Symbol"
          >
            <Input
              placeholder="pcs"
            />
          </Form.Item>

          <Form.Item
            name="category"
            label="Category"
          >
            <Select
              allowClear
              options={[
                {
                  label:
                    'Quantity',
                  value:
                    'quantity',
                },
                {
                  label:
                    'Weight',
                  value:
                    'weight',
                },
                {
                  label:
                    'Volume',
                  value:
                    'volume',
                },
                {
                  label:
                    'Length',
                  value:
                    'length',
                },
                {
                  label:
                    'Area',
                  value:
                    'area',
                },
                {
                  label:
                    'Package',
                  value:
                    'package',
                },
                {
                  label:
                    'Other',
                  value:
                    'other',
                },
              ]}
            />
          </Form.Item>

          <Form.Item
            name="decimal_places"
            label="Decimal Places"
            rules={[
              {
                required:
                  true,
              },
            ]}
          >
            <InputNumber
              min={0}
              max={6}
              style={{
                width:
                  '100%',
              }}
            />
          </Form.Item>

          <Form.Item
            name="is_active"
            label="Active"
            valuePropName="checked"
          >
            <Select
              options={[
                {
                  label:
                    'Yes',
                  value:
                    true,
                },
                {
                  label:
                    'No',
                  value:
                    false,
                },
              ]}
            />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
          >
            <Input.TextArea
              rows={3}
            />
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
}

export default SrItemDrawer;
import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  App,
  Button,
  Card,
  Col,
  Flex,
  Form,
  Input,
  Popconfirm,
  Row,
  Select,
  Space,
  Statistic,
  Typography,
} from 'antd';

import {
  
  DownloadOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons';

import {
  banksApi,
} from '../../api/banks';

import {
  chequesApi,
} from '../../api/cheques';

import DataTable, {
  type DataTableChangeParams,
} from '../../components/common/DataTable';

import FormDrawer
  from '../../components/common/FormDrawer';

import {
  chequeColumns,
} from './columns';

import ChequeForm
  from './form';

import type {
  Cheque,
  ChequeFilters,
  ChequeFormValues,
  ChequeStatistics,
} from '../../types/cheque';

const {
  Title,
  Text,
} = Typography;

type DrawerMode =
  | 'create'
  | 'edit'
  | 'view';

interface BankOption {
  id: number;
  name: string;
  branch: string | null;
}

const emptyStatistics: ChequeStatistics = {
  total: 0,
  active: 0,
  void: 0,
  deleted: 0,
  fully_signed: 0,
  partially_signed: 0,
  used: 0,
  unused: 0,
};

const defaultFormValues:
  Partial<ChequeFormValues> = {
    bank_id: undefined,
    branch: '',
    cheque_no: '',
    signature_status: 'fully',
    status: 'active',
  };

function normalizeText(
  value?: string | null,
): string {
  return value?.trim() ?? '';
}

function ChequesPage() {
  const {
    message,
  } = App.useApp();

  const [form] =
    Form.useForm<ChequeFormValues>();

  const [
    cheques,
    setCheques,
  ] = useState<Cheque[]>([]);

  const [
    banks,
    setBanks,
  ] = useState<BankOption[]>([]);

  const [
    statistics,
    setStatistics,
  ] = useState<ChequeStatistics>(
    emptyStatistics,
  );

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    banksLoading,
    setBanksLoading,
  ] = useState(false);

  const [
    statisticsLoading,
    setStatisticsLoading,
  ] = useState(false);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    exporting,
    setExporting,
  ] = useState(false);

  const [
    drawerOpen,
    setDrawerOpen,
  ] = useState(false);

  const [
    drawerMode,
    setDrawerMode,
  ] = useState<DrawerMode>(
    'create',
  );

  const [
    editingCheque,
    setEditingCheque,
  ] = useState<Cheque | null>(
    null,
  );

  const [
    selectedCheque,
    setSelectedCheque,
  ] = useState<Cheque | null>(
    null,
  );

  const [
    deleteOpen,
    setDeleteOpen,
  ] = useState(false);

  const [
    voidOpen,
    setVoidOpen,
  ] = useState(false);

  const [
    activateOpen,
    setActivateOpen,
  ] = useState(false);

  const [
    searchValue,
    setSearchValue,
  ] = useState('');

  const [
    filters,
    setFilters,
  ] = useState<ChequeFilters>({
    page: 1,
    per_page: 10,
    sort_by: 'id',
    sort_direction: 'desc',
  });

  const [
    pagination,
    setPagination,
  ] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const loadBanks =
    useCallback(async () => {
      setBanksLoading(true);

      try {
        const response =
          await banksApi.list({
            page: 1,
            per_page: 100,
            status: 'active',
          });

        const mappedBanks:
          BankOption[] =
          (response.data ?? [])
            .map((bank) => ({
              id: bank.id,

              name:
                bank.bank_name_orginal
                ?? bank.bank_name_orginal
                ?? bank.bank_name
                
                ?? `Bank ${bank.id}`,

              branch:
                bank.branch ?? null,
            }));

        setBanks(mappedBanks);
      } catch (error) {
        console.error(error);

        message.error(
          'Unable to load banks.',
        );
      } finally {
        setBanksLoading(false);
      }
    }, [message]);

  const loadStatistics =
    useCallback(async () => {
      setStatisticsLoading(true);

      try {
        const response =
          await chequesApi.statistics();

        setStatistics(response);
      } catch (error) {
        console.error(error);

        setStatistics(
          emptyStatistics,
        );
      } finally {
        setStatisticsLoading(false);
      }
    }, []);

  const loadCheques =
    useCallback(async () => {
      setLoading(true);

      try {
        const response =
          await chequesApi.list(
            filters,
          );

        setCheques(
          response.data ?? [],
        );

        setPagination({
          current:
            response.pagination
              ?.current_page ?? 1,

          pageSize:
            response.pagination
              ?.per_page
            ?? filters.per_page
            ?? 10,

          total:
            response.pagination
              ?.total ?? 0,
        });
      } catch (error) {
        console.error(error);

        message.error(
          'Unable to load cheques.',
        );
      } finally {
        setLoading(false);
      }
    }, [
      filters,
      message,
    ]);

  useEffect(() => {
    void loadBanks();
    void loadStatistics();
  }, [
    loadBanks,
    loadStatistics,
  ]);

  useEffect(() => {
    void loadCheques();
  }, [loadCheques]);

  const setChequeFormValues = (
    cheque: Cheque,
  ) => {
    form.setFieldsValue({
      bank_id:
        cheque.bank_id,

      branch:
        cheque.branch,

      cheque_no:
        cheque.cheque_no,

      signature_status:
        cheque.signature_status,

      status:
        cheque.status,
    });
  };

  const handleTableChange = (
    params:
      DataTableChangeParams<Cheque>,
  ) => {
    setFilters((current) => ({
      ...current,

      page:
        params.page,

      per_page:
        params.pageSize,

      sort_by:
        params.sortField
        ?? current.sort_by,

      sort_direction:
        params.sortDirection
        ?? current.sort_direction,
    }));
  };

  const handleSearch = () => {
    setFilters((current) => ({
      ...current,

      page: 1,

      search:
        searchValue.trim()
        || undefined,
    }));
  };

  const handleResetFilters = () => {
    setSearchValue('');

    setFilters({
      page: 1,

      per_page:
        pagination.pageSize,

      sort_by: 'id',

      sort_direction: 'desc',
    });
  };
    const handleCreate = () => {
    setEditingCheque(null);
    setDrawerMode('create');

    form.resetFields();

    form.setFieldsValue({
      ...defaultFormValues,
    });

    setDrawerOpen(true);
  };

  const handleView = (
    cheque: Cheque,
  ) => {
    setEditingCheque(cheque);
    setDrawerMode('view');
    setDrawerOpen(true);

    setTimeout(() => {
      form.resetFields();

      setChequeFormValues(
        cheque,
      );
    }, 0);
  };

  const handleEdit = (
    cheque: Cheque,
  ) => {
    if (!cheque.can_edit) {
      message.warning(
        cheque.is_used
          ? 'A used cheque cannot be edited.'
          : 'This cheque cannot be edited.',
      );

      return;
    }

    setEditingCheque(cheque);
    setDrawerMode('edit');
    setDrawerOpen(true);

    setTimeout(() => {
      form.resetFields();

      setChequeFormValues(
        cheque,
      );
    }, 0);
  };

  const handleDrawerClose = () => {
    if (saving) {
      return;
    }

    setDrawerOpen(false);
    setEditingCheque(null);
    setDrawerMode('create');

    form.resetFields();
  };

  const handleSave = async () => {
    if (drawerMode === 'view') {
      handleDrawerClose();
      return;
    }

    try {
      const values =
        await form.validateFields();

      setSaving(true);

      const payload:
        ChequeFormValues = {
          bank_id:
            values.bank_id,

          branch:
            normalizeText(
              values.branch,
            ),

          cheque_no:
            normalizeText(
              values.cheque_no,
            ),

          signature_status:
            values.signature_status,

          /*
           * Status changes should normally happen
           * through Void and Activate actions.
           */
          status: 'active',
        };

      if (
        drawerMode === 'edit'
        && editingCheque
      ) {
        await chequesApi.update(
          editingCheque.id,
          payload,
        );

        message.success(
          'Cheque updated successfully.',
        );
      } else {
        await chequesApi.create(
          payload,
        );

        message.success(
          'Cheque created successfully.',
        );
      }

      setDrawerOpen(false);
      setEditingCheque(null);
      setDrawerMode('create');

      form.resetFields();

      await Promise.all([
        loadCheques(),
        loadStatistics(),
      ]);
    } catch (error: unknown) {
      if (
        typeof error === 'object'
        && error !== null
        && 'errorFields' in error
      ) {
        return;
      }

      console.error(error);

      const responseError =
        error as {
          response?: {
            status?: number;

            data?: {
              message?: string;

              errors?: Record<
                string,
                string[]
              >;
            };
          };
        };

      const validationErrors =
        responseError.response
          ?.data?.errors;

      if (
        responseError.response
          ?.status === 422
        && validationErrors
      ) {
        const firstError =
          Object.values(
            validationErrors,
          ).flat()[0];

        message.error(
          firstError
          ?? 'Please check the required fields.',
        );

        return;
      }

      message.error(
        responseError.response
          ?.data?.message
        ?? (
          drawerMode === 'edit'
            ? 'Unable to update cheque.'
            : 'Unable to create cheque.'
        ),
      );
    } finally {
      setSaving(false);
    }
  };

  const requestVoid = (
    cheque: Cheque,
  ) => {
    if (!cheque.can_void) {
      message.warning(
        cheque.is_used
          ? 'A used cheque cannot be voided.'
          : 'This cheque cannot be voided.',
      );

      return;
    }

    setSelectedCheque(cheque);
    setVoidOpen(true);
  };

  const handleVoid = async () => {
    if (!selectedCheque) {
      return;
    }

    try {
      await chequesApi.void(
        selectedCheque.id,
      );

      message.success(
        'Cheque voided successfully.',
      );

      setVoidOpen(false);
      setSelectedCheque(null);

      await Promise.all([
        loadCheques(),
        loadStatistics(),
      ]);
    } catch (error: unknown) {
      console.error(error);

      const responseError =
        error as {
          response?: {
            data?: {
              message?: string;
            };
          };
        };

      message.error(
        responseError.response
          ?.data?.message
        ?? 'Unable to void cheque.',
      );
    }
  };

  const requestActivate = (
    cheque: Cheque,
  ) => {
    if (!cheque.can_activate) {
      message.warning(
        cheque.is_used
          ? 'A used cheque cannot be activated.'
          : 'This cheque cannot be activated.',
      );

      return;
    }

    setSelectedCheque(cheque);
    setActivateOpen(true);
  };

  const handleActivate =
    async () => {
      if (!selectedCheque) {
        return;
      }

      try {
        await chequesApi.activate(
          selectedCheque.id,
        );

        message.success(
          'Cheque activated successfully.',
        );

        setActivateOpen(false);
        setSelectedCheque(null);

        await Promise.all([
          loadCheques(),
          loadStatistics(),
        ]);
      } catch (error: unknown) {
        console.error(error);

        const responseError =
          error as {
            response?: {
              data?: {
                message?: string;
              };
            };
          };

        message.error(
          responseError.response
            ?.data?.message
          ?? 'Unable to activate cheque.',
        );
      }
    };

  const requestDelete = (
    cheque: Cheque,
  ) => {
    if (cheque.is_used) {
      message.warning(
        'A used cheque cannot be deleted.',
      );

      return;
    }

    setSelectedCheque(cheque);
    setDeleteOpen(true);
  };

  const handleDelete =
    async () => {
      if (!selectedCheque) {
        return;
      }

      try {
        await chequesApi.remove(
          selectedCheque.id,
        );

        message.success(
          'Cheque moved to the recycle bin.',
        );

        setDeleteOpen(false);
        setSelectedCheque(null);

        await Promise.all([
          loadCheques(),
          loadStatistics(),
        ]);
      } catch (error: unknown) {
        console.error(error);

        const responseError =
          error as {
            response?: {
              data?: {
                message?: string;
              };
            };
          };

        message.error(
          responseError.response
            ?.data?.message
          ?? 'Unable to delete cheque.',
        );
      }
    };

  const handleExport =
    async () => {
      setExporting(true);

      try {
        await chequesApi.exportFile(
          filters,
        );

        message.success(
          'Cheque export downloaded successfully.',
        );
      } catch (error) {
        console.error(error);

        message.error(
          'Unable to export cheques.',
        );
      } finally {
        setExporting(false);
      }
    };

  const columns =
    chequeColumns({
      onView:
        handleView,

      onEdit:
        handleEdit,

      onVoid:
        requestVoid,

      onActivate:
        requestActivate,

      onDelete:
        requestDelete,
    });

  const drawerTitle =
    drawerMode === 'view'
      ? 'View Cheque'
      : drawerMode === 'edit'
        ? 'Edit Cheque'
        : 'Register Cheque';

  const submitText =
    drawerMode === 'view'
      ? 'Close'
      : drawerMode === 'edit'
        ? 'Update Cheque'
        : 'Save Cheque';
          return (
    <Space
      direction="vertical"
      size={20}
      style={{
        width: '100%',
      }}
    >
      <Card
        style={{
          borderTop:
            '4px solid #237804',
        }}
      >
        <Flex
          justify="space-between"
          align="center"
          gap={16}
          wrap="wrap"
        >
          <div>
            <Title
              level={3}
              style={{
                margin: 0,
                color: '#135200',
              }}
            >
              Cheque Register
            </Title>

            <Text type="secondary">
              Register, track, void,
              activate and manage bank
              cheques.
            </Text>
          </div>

          <Space wrap>
            <Button
              icon={
                <DownloadOutlined />
              }
              loading={exporting}
              onClick={() =>
                void handleExport()
              }
            >
              Export
            </Button>

            <Button
              type="primary"
              icon={
                <PlusOutlined />
              }
              style={{
                background:
                  '#237804',
              }}
              onClick={
                handleCreate
              }
            >
              Register Cheque
            </Button>
          </Space>
        </Flex>
      </Card>

      <Row gutter={[16, 16]}>
        <Col
          xs={24}
          sm={12}
          md={8}
          lg={6}
        >
          <Card
            loading={
              statisticsLoading
            }
            hoverable
            onClick={() => {
              setFilters(
                (current) => ({
                  ...current,
                  page: 1,
                  status: undefined,
                }),
              );
            }}
          >
            <Statistic
              title="Total Cheques"
              value={
                statistics.total
              }
              valueStyle={{
                color: '#135200',
              }}
            />
          </Card>
        </Col>

        <Col
          xs={24}
          sm={12}
          md={8}
          lg={6}
        >
          <Card
            loading={
              statisticsLoading
            }
            hoverable
            onClick={() => {
              setFilters(
                (current) => ({
                  ...current,
                  page: 1,
                  status: 'active',
                }),
              );
            }}
          >
            <Statistic
              title="Active"
              value={
                statistics.active
              }
              valueStyle={{
                color: '#389e0d',
              }}
            />
          </Card>
        </Col>

        <Col
          xs={24}
          sm={12}
          md={8}
          lg={6}
        >
          <Card
            loading={
              statisticsLoading
            }
            hoverable
            onClick={() => {
              setFilters(
                (current) => ({
                  ...current,
                  page: 1,
                  status: 'void',
                }),
              );
            }}
          >
            <Statistic
              title="Void"
              value={
                statistics.void
              }
              valueStyle={{
                color: '#cf1322',
              }}
            />
          </Card>
        </Col>

        <Col
          xs={24}
          sm={12}
          md={8}
          lg={6}
        >
          <Card
            loading={
              statisticsLoading
            }
          >
            <Statistic
              title="Used"
              value={
                statistics.used
              }
              valueStyle={{
                color: '#1677ff',
              }}
            />
          </Card>
        </Col>

        <Col
          xs={24}
          sm={12}
          md={8}
          lg={6}
        >
          <Card
            loading={
              statisticsLoading
            }
          >
            <Statistic
              title="Unused"
              value={
                statistics.unused
              }
              valueStyle={{
                color: '#52c41a',
              }}
            />
          </Card>
        </Col>

        <Col
          xs={24}
          sm={12}
          md={8}
          lg={6}
        >
          <Card
            loading={
              statisticsLoading
            }
            hoverable
            onClick={() => {
              setFilters(
                (current) => ({
                  ...current,
                  page: 1,
                  signature_status:
                    'fully',
                }),
              );
            }}
          >
            <Statistic
              title="Fully Signed"
              value={
                statistics
                  .fully_signed
              }
              valueStyle={{
                color: '#096dd9',
              }}
            />
          </Card>
        </Col>

        <Col
          xs={24}
          sm={12}
          md={8}
          lg={6}
        >
          <Card
            loading={
              statisticsLoading
            }
            hoverable
            onClick={() => {
              setFilters(
                (current) => ({
                  ...current,
                  page: 1,
                  signature_status:
                    'partially',
                }),
              );
            }}
          >
            <Statistic
              title="Partially Signed"
              value={
                statistics
                  .partially_signed
              }
              valueStyle={{
                color: '#d46b08',
              }}
            />
          </Card>
        </Col>

        <Col
          xs={24}
          sm={12}
          md={8}
          lg={6}
        >
          <Card
            loading={
              statisticsLoading
            }
          >
            <Statistic
              title="Deleted"
              value={
                statistics.deleted
              }
              valueStyle={{
                color: '#8c8c8c',
              }}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <Flex
          gap={12}
          wrap="wrap"
          style={{
            marginBottom: 20,
          }}
        >
          <Input
            allowClear
            value={searchValue}
            prefix={
              <SearchOutlined />
            }
            placeholder="Search cheque number, bank or branch"
            style={{
              width: 360,
            }}
            onChange={(event) =>
              setSearchValue(
                event.target.value,
              )
            }
            onPressEnter={
              handleSearch
            }
          />

          <Select
            allowClear
            showSearch
            optionFilterProp="label"
            loading={
              banksLoading
            }
            placeholder="Bank"
            style={{
              width: 220,
            }}
            value={
              filters.bank_id
            }
            options={banks.map(
              (bank) => ({
                label: bank.name,
                value: bank.id,
              }),
            )}
            onChange={(bankId) => {
              setFilters(
                (current) => ({
                  ...current,
                  page: 1,
                  bank_id:
                    bankId,
                }),
              );
            }}
          />

          <Select
            allowClear
            placeholder="Signature"
            style={{
              width: 170,
            }}
            value={
              filters
                .signature_status
            }
            options={[
              {
                label: 'Fully',
                value: 'fully',
              },
              {
                label: 'Partially',
                value:
                  'partially',
              },
            ]}
            onChange={(
              signatureStatus,
            ) => {
              setFilters(
                (current) => ({
                  ...current,
                  page: 1,
                  signature_status:
                    signatureStatus,
                }),
              );
            }}
          />

          <Select
            allowClear
            placeholder="Status"
            style={{
              width: 150,
            }}
            value={
              filters.status
            }
            options={[
              {
                label: 'Active',
                value: 'active',
              },
              {
                label: 'Void',
                value: 'void',
              },
            ]}
            onChange={(status) => {
              setFilters(
                (current) => ({
                  ...current,
                  page: 1,
                  status,
                }),
              );
            }}
          />

          <Space>
            <Button
              type="primary"
              icon={
                <SearchOutlined />
              }
              style={{
                background:
                  '#237804',
              }}
              onClick={
                handleSearch
              }
            >
              Search
            </Button>

            <Button
              icon={
                <ReloadOutlined />
              }
              onClick={
                handleResetFilters
              }
            >
              Reset
            </Button>
          </Space>
        </Flex>

        <Popconfirm
          title="Void cheque"
          description={`Void cheque ${
            selectedCheque
              ?.cheque_no
            ?? ''
          }?`}
          open={voidOpen}
          okText="Void Cheque"
          cancelText="Cancel"
          okButtonProps={{
            danger: true,
          }}
          onConfirm={() =>
            void handleVoid()
          }
          onCancel={() => {
            setVoidOpen(false);
            setSelectedCheque(null);
          }}
        >
          <span />
        </Popconfirm>

        <Popconfirm
          title="Activate cheque"
          description={`Activate cheque ${
            selectedCheque
              ?.cheque_no
            ?? ''
          }?`}
          open={activateOpen}
          okText="Activate"
          cancelText="Cancel"
          onConfirm={() =>
            void handleActivate()
          }
          onCancel={() => {
            setActivateOpen(false);
            setSelectedCheque(null);
          }}
        >
          <span />
        </Popconfirm>

        <Popconfirm
          title="Delete cheque"
          description={`Move cheque ${
            selectedCheque
              ?.cheque_no
            ?? ''
          } to the recycle bin?`}
          open={deleteOpen}
          okText="Delete"
          cancelText="Cancel"
          okButtonProps={{
            danger: true,
          }}
          onConfirm={() =>
            void handleDelete()
          }
          onCancel={() => {
            setDeleteOpen(false);
            setSelectedCheque(null);
          }}
        >
          <span />
        </Popconfirm>

        <DataTable<Cheque>
          columns={columns}
          data={cheques}
          loading={loading}
          rowKey="id"
          pagination={pagination}
          onChange={
            handleTableChange
          }
          scroll={{
            x: 1300,
          }}
        />
      </Card>

      <FormDrawer
        title={drawerTitle}
        open={drawerOpen}
        loading={saving}
        submitText={submitText}
        onClose={
          handleDrawerClose
        }
        onSubmit={() =>
          void handleSave()
        }
      >
        <ChequeForm
          form={form}
          banks={banks}
          banksLoading={
            banksLoading
          }
          disabled={saving}
          readOnly={
            drawerMode === 'view'
          }
        />
      </FormDrawer>
    </Space>
  );
}

export default ChequesPage;
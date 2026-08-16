import { useEffect, useMemo, useState } from 'react';
import {
    ApartmentOutlined,
    BankOutlined,
    BellOutlined,
    DashboardOutlined,
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    SafetyCertificateOutlined,
    SettingOutlined,
    TeamOutlined,
    UserOutlined,
    IdcardOutlined,
    ShoppingOutlined,
    ProjectOutlined,
    CarOutlined,
    UserSwitchOutlined,
    FileProtectOutlined,

} from '@ant-design/icons';

import {
    Avatar,
    Badge,
    Button,
    Dropdown,
    Layout,
    Menu,
    Space,
    Typography,
} from 'antd';

import type { MenuProps } from 'antd';

import {
    Outlet,
    useLocation,
    useNavigate,
} from 'react-router';

import { useAuth } from '../../features/auth/AuthContext';

import { TagsOutlined } from '@ant-design/icons';

import {
  ShopOutlined,
}from '@ant-design/icons';

const {
    Header,
    Sider,
    Content,
} = Layout;

const {
    Text,
    Title,
} = Typography;

type MenuItem = Required<
    MenuProps
>['items'][number];

const rootSubmenuKeys = [
    'administration',
    'organization',
    'settings',
];

function getParentMenuKey(
    pathname: string
): string | null {
    if (
        pathname.startsWith(
            '/administration'
        )
    ) {
        return 'administration';
    }

    if (
        pathname.startsWith(
            '/organization'
        )
    ) {
        return 'organization';
    }

    if (
    pathname.startsWith(
        '/settings'
    )
    ) {
        return 'settings';
    }

    return null;
}

export default function MainLayout() {
    const navigate = useNavigate();
    const location = useLocation();

    const {
        user,
        logout,
    } = useAuth();

    const [collapsed, setCollapsed] =
        useState(false);

    const [mobileOpen, setMobileOpen] =
        useState(false);

    const [openKeys, setOpenKeys] =
        useState<string[]>([]);

    const [isMobile, setIsMobile] =
        useState(
            window.innerWidth < 768
        );

    const selectedKeys = [
        location.pathname,
    ];

    const menuItems: MenuItem[] =
        useMemo(
            () => [
                {
                    key: '/dashboard',
                    icon: (
                        <DashboardOutlined />
                    ),
                    label: 'Dashboard',
                },

                {
                    key: 'administration',
                    icon: (
                        <SettingOutlined />
                    ),
                    label: 'Administration',

                    children: [
                        {
                            key:
                                '/administration/users',
                            icon: (
                                <UserOutlined />
                            ),
                            label: 'Users',
                        },

                        {
                            key:
                                '/administration/roles',
                            icon: (
                                <TeamOutlined />
                            ),
                            label: 'Roles',
                        },

                        {
                            key:
                                '/administration/permissions',
                            icon: (
                                <SafetyCertificateOutlined />
                            ),
                            label:
                                'Permissions',
                        },

                        {
                        key: '/administration/categories',
                        icon: <TagsOutlined />,
                        label: 'Categories',
                    },

                        {
                        key: '/administration/banks',
                        icon: <BankOutlined />,
                        label: 'Banks',
                        },
                        {
                            key: '/administration/items',
                            icon: <ShoppingOutlined />,
                            label: 'Items',
                        },

                        {
                        key: '/administration/projects',
                        icon: <ProjectOutlined />,
                        label: 'Projects',
                        },

                        {
                        key: '/administration/suppliers',
                        icon: <ShopOutlined />,
                        label: 'Suppliers',
                        },
                        {
                        key: '/administration/customers',
                        icon: <TeamOutlined />,
                        label: 'Customers',
                        },
                        {
                        key: '/administration/fixed-assets',
                        icon: <CarOutlined />,
                        label: 'Fixed Assets',
                        },
                        {
                        key: '/administration/purchasers',
                        icon: <UserSwitchOutlined />,
                        label: 'Purchasers',
                        },
                        {
                        key: '/administration/subcontractors',
                        icon: <TeamOutlined />,
                        label: 'Subcontractors',
                        }
                        
                    ],
                },

                {
                    key: 'organization',
                    icon: (
                        <ApartmentOutlined />
                    ),
                    label: 'Organization',

                    children: [
                        {
                            key:
                                '/organization/branches',
                            icon: (
                                <BankOutlined />
                            ),
                            label: 'Branches',
                        },

                        {
                            key:
                                '/organization/departments',
                            icon: (
                                <ApartmentOutlined />
                            ),
                            label:
                                'Departments',
                        },

                        {
                            key: '/organization/designations',
                            icon: <IdcardOutlined />,
                            label: 'Designations',
                        },

                        
                    ],
                },

                {
                    key: 'cheques',
                    icon: (
                        <ApartmentOutlined />
                    ),
                    label: 'Cheques',

                    children: [
                        
                        {
                        key: '/cheques',
                        icon: <FileProtectOutlined />,
                        label: 'Cheques',
                        },

                        
                    ],
                },

                {
    key: 'settings',
    icon: (
        <SettingOutlined />
    ),
    label: 'Settings',

    children: [
    {
        key: '/settings/company-profile',
        icon: (
            <BankOutlined />
        ),
        label: 'Company Profile',
    },

    {
        key: '/settings/fiscal-years',
        icon: (
            <SettingOutlined />
        ),
        label: 'Fiscal Years',
    },
],
},
            ],
            []
        );

    useEffect(() => {
        const handleResize = () => {
            const mobile =
                window.innerWidth < 768;

            setIsMobile(mobile);

            if (!mobile) {
                setMobileOpen(false);
            }
        };

        window.addEventListener(
            'resize',
            handleResize
        );

        return () => {
            window.removeEventListener(
                'resize',
                handleResize
            );
        };
    }, []);

    useEffect(() => {
        const parentKey =
            getParentMenuKey(
                location.pathname
            );

        if (
            parentKey &&
            !collapsed
        ) {
            setOpenKeys((currentKeys) => {
                if (
                    currentKeys.includes(
                        parentKey
                    )
                ) {
                    return currentKeys;
                }

                return [
                    ...currentKeys,
                    parentKey,
                ];
            });
        }
    }, [
        location.pathname,
        collapsed,
    ]);

    const handleOpenChange = (
        keys: string[]
    ) => {
        const latestOpenKey =
            keys.find(
                (key) =>
                    !openKeys.includes(
                        key
                    )
            );

        if (
            latestOpenKey &&
            rootSubmenuKeys.includes(
                latestOpenKey
            )
        ) {
            setOpenKeys([
                latestOpenKey,
            ]);

            return;
        }

        setOpenKeys(keys);
    };

    const handleMenuClick: MenuProps['onClick'] =
        ({ key }) => {
            if (
                key.startsWith('/')
            ) {
                navigate(key);

                if (isMobile) {
                    setMobileOpen(false);
                }
            }
        };

    const handleCollapse = () => {
        if (isMobile) {
            setMobileOpen(
                (current) => !current
            );

            return;
        }

        setCollapsed(
            (current) => !current
        );
    };

    const handleLogout =
        async () => {
            try {
                await logout();
            } finally {
                navigate(
                    '/login',
                    {
                        replace: true,
                    }
                );
            }
        };

    const userMenuItems:
        MenuProps['items'] = [
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: 'My Profile',
        },

        {
            type: 'divider',
        },

        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Logout',
            danger: true,
        },
    ];

    const handleUserMenuClick:
        MenuProps['onClick'] =
        ({ key }) => {
            if (key === 'logout') {
                void handleLogout();
            }

            if (key === 'profile') {
                navigate('/profile');
            }
        };

    const userInitial =
        user?.name
            ?.trim()
            .charAt(0)
            .toUpperCase() || 'U';

    const siderContent = (
        <>
            <div
                style={{
                    height: 64,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent:
                        collapsed &&
                        !isMobile
                            ? 'center'
                            : 'flex-start',
                    padding:
                        collapsed &&
                        !isMobile
                            ? 0
                            : '0 20px',
                    borderBottom:
                        '1px solid rgba(255,255,255,0.12)',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                }}
            >
                <div
                    style={{
                        width: 38,
                        height: 38,
                        minWidth: 38,
                        borderRadius: 10,
                        background:
                            '#1677ff',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems:
                            'center',
                        justifyContent:
                            'center',
                        fontWeight: 700,
                        fontSize: 18,
                    }}
                >
                    E
                </div>

                {(!collapsed ||
                    isMobile) && (
                    <div
                        style={{
                            marginLeft: 12,
                        }}
                    >
                        <Title
                            level={5}
                            style={{
                                color:
                                    '#ffffff',
                                margin: 0,
                                lineHeight:
                                    1.2,
                            }}
                        >
                            Enterprise ERP
                        </Title>

                        <Text
                            style={{
                                color:
                                    'rgba(255,255,255,0.65)',
                                fontSize: 11,
                            }}
                        >
                            Management System
                        </Text>
                    </div>
                )}
            </div>

            <Menu
                theme="dark"
                mode="inline"
                items={menuItems}
                selectedKeys={
                    selectedKeys
                }
                openKeys={
                    collapsed &&
                    !isMobile
                        ? []
                        : openKeys
                }
                onOpenChange={
                    handleOpenChange
                }
                onClick={
                    handleMenuClick
                }
                inlineCollapsed={
                    collapsed &&
                    !isMobile
                }
                style={{
                    borderInlineEnd: 0,
                    paddingTop: 8,
                }}
            />
        </>
    );

    return (
        <Layout
            style={{
                minHeight: '100vh',
            }}
        >
            {!isMobile && (
                <Sider
                    width={260}
                    collapsedWidth={80}
                    collapsible
                    collapsed={
                        collapsed
                    }
                    trigger={null}
                    theme="dark"
                    style={{
                        position:
                            'fixed',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        height:
                            '100vh',
                        overflowY:
                            'auto',
                        zIndex: 100,
                    }}
                >
                    {siderContent}
                </Sider>
            )}

            {isMobile &&
                mobileOpen && (
                    <>
                        <div
                            onClick={() =>
                                setMobileOpen(
                                    false
                                )
                            }
                            style={{
                                position:
                                    'fixed',
                                inset: 0,
                                background:
                                    'rgba(0,0,0,0.45)',
                                zIndex:
                                    998,
                            }}
                        />

                        <Sider
                            width={260}
                            theme="dark"
                            style={{
                                position:
                                    'fixed',
                                left: 0,
                                top: 0,
                                bottom: 0,
                                height:
                                    '100vh',
                                overflowY:
                                    'auto',
                                zIndex:
                                    999,
                            }}
                        >
                            {siderContent}
                        </Sider>
                    </>
                )}

            <Layout
                style={{
                    marginLeft:
                        isMobile
                            ? 0
                            : collapsed
                              ? 80
                              : 260,
                    transition:
                        'margin-left 0.2s',
                    minHeight:
                        '100vh',
                }}
            >
                <Header
                    style={{
                        position:
                            'sticky',
                        top: 0,
                        zIndex: 90,
                        height: 64,
                        padding:
                            '0 20px',
                        background:
                            '#ffffff',
                        display: 'flex',
                        alignItems:
                            'center',
                        justifyContent:
                            'space-between',
                        borderBottom:
                            '1px solid #f0f0f0',
                        boxShadow:
                            '0 1px 4px rgba(0,0,0,0.04)',
                    }}
                >
                    <Button
                        type="text"
                        onClick={
                            handleCollapse
                        }
                        icon={
                            isMobile ||
                            collapsed ? (
                                <MenuUnfoldOutlined />
                            ) : (
                                <MenuFoldOutlined />
                            )
                        }
                        style={{
                            width: 44,
                            height: 44,
                            fontSize: 18,
                        }}
                    />

                    <Space
                        size="middle"
                        align="center"
                    >
                        <Badge
                            count={0}
                            size="small"
                        >
                            <Button
                                type="text"
                                shape="circle"
                                icon={
                                    <BellOutlined />
                                }
                            />
                        </Badge>

                        <Dropdown
                            menu={{
                                items:
                                    userMenuItems,
                                onClick:
                                    handleUserMenuClick,
                            }}
                            placement="bottomRight"
                            trigger={[
                                'click',
                            ]}
                        >
                            <Space
                                style={{
                                    cursor:
                                        'pointer',
                                }}
                            >
                                <Avatar
                                    icon={
                                        <UserOutlined />
                                    }
                                    style={{
                                        background:
                                            '#1677ff',
                                    }}
                                >
                                    {
                                        userInitial
                                    }
                                </Avatar>

                                {!isMobile && (
                                    <div
                                        style={{
                                            lineHeight:
                                                1.25,
                                        }}
                                    >
                                        <Text
                                            strong
                                            style={{
                                                display:
                                                    'block',
                                            }}
                                        >
                                            {user?.name ||
                                                'User'}
                                        </Text>

                                        <Text
                                            type="secondary"
                                            style={{
                                                fontSize:
                                                    12,
                                            }}
                                        >
                                            {user
                                                ?.email ||
                                                ''}
                                        </Text>
                                    </div>
                                )}
                            </Space>
                        </Dropdown>
                    </Space>
                </Header>

                <Content
                    style={{
                        margin: 0,
                        padding:
                            isMobile
                                ? 16
                                : 24,
                        background:
                            '#f5f7fa',
                        minHeight:
                            'calc(100vh - 64px)',
                        overflowX:
                            'hidden',
                    }}
                >
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
}
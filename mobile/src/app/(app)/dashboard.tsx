import {
  Alert,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';

import {
  Ionicons,
} from '@expo/vector-icons';

import {
  router,
} from 'expo-router';

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  Colors,
} from '../../constants/colors';

import {
  useAuth,
} from '../../hooks/useAuth';

import {
  dashboardApi,
  DashboardData,
} from '../../api/dashboardApi';

import {
  mobileModules,
  MobileModule,
} from '../../constants/modules';

import {
  canAccessModule,
} from '../../utils/permissions';
import { Fonts } from '../../constants/fonts';


const EMPTY_DATA: DashboardData = {
  projects: 0,
  items: 0,
  suppliers: 0,
  customers: 0,
  purchasers: 0,
  cheques: 0,
};


export default function DashboardScreen() {

  const {
    user,
    logout,
  } = useAuth();

  const [
    dashboard,
    setDashboard,
  ] = useState<DashboardData>(
    EMPTY_DATA
  );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);


  /*
  |--------------------------------------------------------------------------
  | Visible Modules
  |--------------------------------------------------------------------------
  */

  const visibleModules =
    useMemo(() => {

      return mobileModules.filter(
        (module) =>
          canAccessModule(
            user?.permissions,
            user?.roles,
            module
          )
      );

    }, [
      user?.permissions,
      user?.roles,
    ]);


  /*
  |--------------------------------------------------------------------------
  | Load Dashboard
  |--------------------------------------------------------------------------
  */

  const loadDashboard =
    useCallback(
      async (
        isRefresh = false
      ) => {

        try {

          if (isRefresh) {
            setRefreshing(true);
          } else {
            setLoading(true);
          }

          const data =
            await dashboardApi
              .getDashboard();

          setDashboard(data);

        } catch (error) {

          console.log(
            'Dashboard error:',
            error
          );

        } finally {

          setLoading(false);
          setRefreshing(false);

        }

      },
      []
    );


  useEffect(() => {

    loadDashboard();

  }, [loadDashboard]);


  /*
  |--------------------------------------------------------------------------
  | Logout
  |--------------------------------------------------------------------------
  */

  const handleLogout = () => {

    Alert.alert(
      'Sign out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },

        {
          text: 'Sign Out',
          style: 'destructive',

          onPress: async () => {

            await logout();

            router.replace(
              '/(auth)/login'
            );

          },
        },
      ]
    );

  };


  /*
  |--------------------------------------------------------------------------
  | Greeting
  |--------------------------------------------------------------------------
  */

  const firstName =
    user?.name
      ?.trim()
      .split(' ')[0]
      ?? 'User';


  return (
    <SafeAreaView
      style={styles.safeArea}
    >

      <ScrollView
        contentContainerStyle={
          styles.container
        }

        showsVerticalScrollIndicator={
          false
        }

        refreshControl={
          <RefreshControl
            refreshing={refreshing}

            onRefresh={() =>
              loadDashboard(true)
            }

            tintColor={
              Colors.primary
            }
          />
        }
      >

        {/* HEADER */}

        <View
          style={styles.header}
        >

          <View>

            <Text
              style={
                styles.smallGreeting
              }
            >
              Good day,
            </Text>

            <Text
              style={
                styles.userName
              }
            >
              {firstName}
            </Text>

          </View>


          <Pressable
            style={
              styles.profileButton
            }

            onPress={
              handleLogout
            }
          >

            <View
              style={
                styles.avatar
              }
            >

              <Text
                style={
                  styles.avatarText
                }
              >

                {firstName
                  .charAt(0)
                  .toUpperCase()}

              </Text>

            </View>

          </Pressable>

        </View>


        {/* BRAND */}

        <View style={styles.hero}>

  <View style={styles.heroTop}>

    <Image
      source={require('../../../assets/images/mefthe-wordmark.png')}
      style={styles.heroLogo}
      resizeMode="contain"
    />

  </View>

  <Text style={styles.heroSubtitle}>
    Enterprise workspace
  </Text>

  <View style={styles.heroFooter}>

    <Ionicons
      name="shield-checkmark-outline"
      size={15}
      color="rgba(255,255,255,0.80)"
    />

    <Text style={styles.heroFooterText}>
      Secure mobile workspace
    </Text>

  </View>

</View>


        {/* OVERVIEW */}

        <View
          style={
            styles.sectionHeader
          }
        >

          <Text
            style={
              styles.sectionTitle
            }
          >
            Overview
          </Text>

          {loading && (
            <Text
              style={
                styles.loadingText
              }
            >
              Updating...
            </Text>
          )}

        </View>


        <View
          style={
            styles.statGrid
          }
        >

          <StatCard
            title="Projects"
            value={
              dashboard.projects
            }
            icon="briefcase-outline"
          />

          <StatCard
            title="Customers"
            value={
              dashboard.customers
            }
            icon="people-outline"
          />

          <StatCard
            title="Suppliers"
            value={
              dashboard.suppliers
            }
            icon="cube-outline"
          />

          <StatCard
            title="Items"
            value={
              dashboard.items
            }
            icon="layers-outline"
          />

        </View>


        {/* MODULES */}

        <View
          style={
            styles.sectionHeader
          }
        >

          <Text
            style={
              styles.sectionTitle
            }
          >
            Modules
          </Text>

          <Text
            style={
              styles.moduleCount
            }
          >
            {visibleModules.length}
          </Text>

        </View>


        <View
          style={
            styles.moduleList
          }
        >

          {visibleModules.map(
            (module) => (

              <ModuleRow
                key={module.key}
                module={module}
              />

            )
          )}

        </View>


        {/* EXTRA STATS */}

        <Text
          style={[
            styles.sectionTitle,
            styles.activityTitle,
          ]}
        >
          Finance & Sales
        </Text>


        <View
          style={
            styles.secondaryStats
          }
        >

          <SmallStat
            title="Purchasers"
            value={
              dashboard.purchasers
            }
            icon="cart-outline"
          />

          <SmallStat
            title="Cheques"
            value={
              dashboard.cheques
            }
            icon="wallet-outline"
          />

        </View>


        {/* ACCOUNT */}

        <Text
          style={[
            styles.sectionTitle,
            styles.accountTitle,
          ]}
        >
          My Account
        </Text>


        <View
          style={
            styles.accountCard
          }
        >

          <AccountRow
            icon="mail-outline"
            label="Email"
            value={
              user?.email ?? '-'
            }
          />

          <Divider />

          <AccountRow
            icon="shield-outline"
            label="Role"
            value={
              user?.roles?.join(', ')
              || 'User'
            }
          />

          <Divider />

          <AccountRow
            icon="checkmark-circle-outline"
            label="Status"
            value={
              user?.status
              || 'Active'
            }
          />

        </View>


        <Text
          style={
            styles.versionText
          }
        >
          Mefthe+
        </Text>

      </ScrollView>

    </SafeAreaView>
  );
}


/*
|--------------------------------------------------------------------------
| Statistic Card
|--------------------------------------------------------------------------
*/

interface StatCardProps {
  title: string;
  value: number;
  icon: any;
}

function StatCard({
  title,
  value,
  icon,
}: StatCardProps) {

  return (
    <View
      style={styles.statCard}
    >

      <View
        style={styles.statIcon}
      >

        <Ionicons
          name={icon}
          size={22}
          color={Colors.primary}
        />

      </View>

      <Text
        style={styles.statValue}
      >
        {value.toLocaleString()}
      </Text>

      <Text
        style={styles.statTitle}
      >
        {title}
      </Text>

    </View>
  );
}


/*
|--------------------------------------------------------------------------
| Module Row
|--------------------------------------------------------------------------
*/

function ModuleRow({
  module,
}: {
  module: MobileModule;
}) {

  const openModule = () => {

    if (!module.route) {
      return;
    }

    router.push(
      module.route as any
    );

  };


  return (
    <Pressable
      onPress={openModule}

      style={({ pressed }) => [
        styles.moduleRow,

        pressed &&
          styles.modulePressed,
      ]}
    >

      <View
        style={
          styles.moduleIcon
        }
      >

        <Ionicons
          name={
            module.icon as any
          }
          size={22}
          color={
            Colors.primary
          }
        />

      </View>


      <View
        style={
          styles.moduleContent
        }
      >

        <Text
          style={
            styles.moduleTitle
          }
        >
          {module.title}
        </Text>

        <Text
          style={
            styles.moduleSubtitle
          }
        >
          {module.subtitle}
        </Text>

      </View>


      <Ionicons
        name="chevron-forward"
        size={19}
        color={
          Colors.textMuted
        }
      />

    </Pressable>
  );
}


/*
|--------------------------------------------------------------------------
| Small Statistic
|--------------------------------------------------------------------------
*/

function SmallStat({
  title,
  value,
  icon,
}: StatCardProps) {

  return (
    <View
      style={
        styles.smallStat
      }
    >

      <View
        style={
          styles.smallStatIcon
        }
      >

        <Ionicons
          name={icon}
          size={20}
          color={
            Colors.primary
          }
        />

      </View>


      <View>

        <Text
          style={
            styles.smallStatValue
          }
        >
          {value.toLocaleString()}
        </Text>

        <Text
          style={
            styles.smallStatLabel
          }
        >
          {title}
        </Text>

      </View>

    </View>
  );
}


/*
|--------------------------------------------------------------------------
| Account
|--------------------------------------------------------------------------
*/

function AccountRow({
  icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {

  return (
    <View
      style={
        styles.accountRow
      }
    >

      <View
        style={
          styles.accountIcon
        }
      >

        <Ionicons
          name={icon}
          size={19}
          color={
            Colors.primary
          }
        />

      </View>


      <View
        style={
          styles.accountContent
        }
      >

        <Text
          style={
            styles.accountLabel
          }
        >
          {label}
        </Text>

        <Text
          style={
            styles.accountValue
          }
        >
          {value}
        </Text>

      </View>

    </View>
  );
}


function Divider() {

  return (
    <View
      style={styles.divider}
    />
  );

}


/*
|--------------------------------------------------------------------------
| Styles
|--------------------------------------------------------------------------
*/

const styles =
  StyleSheet.create({

    safeArea: {
      flex: 1,
      backgroundColor:
        Colors.background,
    },

    heroBrandContainer: {
  flex: 1,
},

hero: {
  marginTop: 22,
  padding: 18,
  borderRadius: 22,
  backgroundColor: Colors.primary,
},

heroTop: {
  width: '100%',
  alignItems: 'flex-start',
  justifyContent: 'center',
},

heroLogo: {
  width: 190,
  height: 70,
},

heroSubtitle: {
  marginTop: 3,
  color: 'rgba(255,255,255,0.78)',
  fontSize: 13,
  fontFamily: Fonts.medium,
},

heroFooter: {
  marginTop: 15,
  paddingTop: 12,
  borderTopWidth: 1,
  borderTopColor: 'rgba(255,255,255,0.12)',
  flexDirection: 'row',
  alignItems: 'center',
},

heroFooterText: {
  marginLeft: 6,
  color: 'rgba(255,255,255,0.80)',
  fontSize: 12,
  fontFamily: Fonts.regular,
},



heroLogoBox: {
  
  borderRadius: 14,
  paddingHorizontal: 10,
  paddingVertical: 5,
},


heroBrandRow: {
  width: '100%',
  alignItems: 'flex-start',
  justifyContent: 'center',
},



    container: {
      paddingHorizontal: 20,
      paddingTop: 18,
      paddingBottom: 45,
    },

    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'space-between',
    },

    smallGreeting: {
      fontSize: 13,
      color:
        Colors.textSecondary,
    },

    userName: {
      marginTop: 2,
      fontSize: 24,
      fontWeight: '800',
      color: Colors.text,
    },

    profileButton: {
      borderRadius: 18,
    },

    avatar: {
      width: 48,
      height: 48,
      borderRadius: 16,

      backgroundColor:
        Colors.primaryLight,

      alignItems: 'center',
      justifyContent: 'center',

      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    avatarText: {
      color: Colors.primary,
      fontSize: 20,
      fontWeight: '800',
    },

    
    heroIcon: {
      width: 48,
      height: 48,
      borderRadius: 15,

      backgroundColor:
        'rgba(255,255,255,0.14)',

      alignItems: 'center',
      justifyContent: 'center',
    },

    heroText: {
      marginLeft: 14,
      flex: 1,
    },

    heroTitle: {
      color: Colors.white,
      fontSize: 17,
      fontWeight: '700',
    },

    

    sectionHeader: {
      marginTop: 27,
      marginBottom: 13,

      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'space-between',
    },

    sectionTitle: {
      fontSize: 18,
      fontWeight: '800',
      color: Colors.text,
    },

    loadingText: {
      fontSize: 12,
      color:
        Colors.textSecondary,
    },

    statGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent:
        'space-between',
    },

    statCard: {
      width: '48%',

      backgroundColor:
        Colors.surface,

      borderWidth: 1,
      borderColor:
        Colors.border,

      borderRadius: 19,

      padding: 16,
      marginBottom: 13,
    },

    statIcon: {
      width: 40,
      height: 40,
      borderRadius: 12,

      backgroundColor:
        Colors.primaryLight,

      alignItems: 'center',
      justifyContent: 'center',
    },

    statValue: {
      marginTop: 15,

      fontSize: 24,
      fontWeight: '800',

      color: Colors.text,
    },

    statTitle: {
      marginTop: 3,

      fontSize: 13,
      color:
        Colors.textSecondary,
    },

    moduleCount: {
      minWidth: 27,
      height: 27,

      borderRadius: 9,

      textAlign: 'center',
      textAlignVertical:
        'center',

      fontSize: 12,
      fontWeight: '700',

      color: Colors.primary,

      backgroundColor:
        Colors.primaryLight,
    },

    moduleList: {
      backgroundColor:
        Colors.surface,

      borderRadius: 20,

      borderWidth: 1,
      borderColor:
        Colors.border,

      overflow: 'hidden',
    },

    moduleRow: {
      minHeight: 76,

      paddingHorizontal: 15,
      paddingVertical: 13,

      flexDirection: 'row',
      alignItems: 'center',

      borderBottomWidth: 1,
      borderBottomColor:
        Colors.border,
    },

    modulePressed: {
      backgroundColor:
        Colors.primaryLight,
    },

    moduleIcon: {
      width: 45,
      height: 45,

      borderRadius: 14,

      backgroundColor:
        Colors.primaryLight,

      alignItems: 'center',
      justifyContent: 'center',
    },

    moduleContent: {
      flex: 1,
      marginLeft: 13,
    },

    moduleTitle: {
      color: Colors.text,

      fontSize: 15,
      fontWeight: '700',
    },

    moduleSubtitle: {
      marginTop: 3,

      fontSize: 12,
      color:
        Colors.textSecondary,
    },

    activityTitle: {
      marginTop: 28,
      marginBottom: 13,
    },

    secondaryStats: {
      flexDirection: 'row',
      gap: 12,
    },

    smallStat: {
      flex: 1,

      padding: 15,

      flexDirection: 'row',
      alignItems: 'center',

      backgroundColor:
        Colors.surface,

      borderRadius: 18,

      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    smallStatIcon: {
      width: 42,
      height: 42,

      borderRadius: 13,

      alignItems: 'center',
      justifyContent: 'center',

      backgroundColor:
        Colors.primaryLight,
    },

    smallStatValue: {
      marginLeft: 11,

      fontSize: 18,
      fontWeight: '800',

      color: Colors.text,
    },

    smallStatLabel: {
      marginLeft: 11,
      marginTop: 2,

      fontSize: 11,
      color:
        Colors.textSecondary,
    },

    accountTitle: {
      marginTop: 29,
      marginBottom: 13,
    },

    accountCard: {
      paddingHorizontal: 16,

      borderRadius: 20,

      backgroundColor:
        Colors.surface,

      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    accountRow: {
      paddingVertical: 15,

      flexDirection: 'row',
      alignItems: 'center',
    },

    accountIcon: {
      width: 40,
      height: 40,

      borderRadius: 12,

      alignItems: 'center',
      justifyContent: 'center',

      backgroundColor:
        Colors.primaryLight,
    },

    accountContent: {
      flex: 1,
      marginLeft: 12,
    },

    accountLabel: {
      color:
        Colors.textSecondary,

      fontSize: 11,
    },

    accountValue: {
      marginTop: 3,

      color: Colors.text,

      fontSize: 14,
      fontWeight: '600',
    },

    divider: {
      height: 1,
      backgroundColor:
        Colors.border,
    },

    versionText: {
      marginTop: 30,

      textAlign: 'center',

      color:
        Colors.textMuted,

      fontSize: 11,
    },

  });
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  Ionicons,
} from '@expo/vector-icons';

import {
  router,
} from 'expo-router';



import {
  Colors,
} from '../../../constants/colors';

import {
  Fonts,
} from '../../../constants/fonts';



import type {
  MobileModule,
} from '../../../constants/modules';


/*
|--------------------------------------------------------------------------
| Management Modules
|--------------------------------------------------------------------------
*/

const managementModules:
  MobileModule[] = [
    {
  key: 'categories',
  title: 'Categories',
  subtitle: 'Category & classification master data',
  icon: 'folder-outline',
  route: '/(app)/management/categories',
},
  {
    key: 'banks',
    title: 'Banks',
    subtitle:
      'Banking & credit facilities',
    icon: 'business-outline',
    route:
      '/(app)/management/banks',
    permissionKeywords: [
      'bank',
    ],
  },

  {
    key: 'items',
    title: 'Items',
    subtitle:
      'Product & inventory master data',
    icon: 'cube-outline',
    route:
      '/(app)/management/items',
    permissionKeywords: [
      'item',
    ],
  },

  {
  key: 'projects',
  title: 'Projects',
  subtitle: 'Project & contract management',
  icon: 'briefcase-outline',
  route: '/(app)/management/projects',
},

{
  key: 'suppliers',
  title: 'Suppliers',
  subtitle: 'Supplier & vendor master data',
  icon: 'people-outline',
  route: '/(app)/management/suppliers',
},

{
  key: 'customers',
  title: 'Customers',
  subtitle: 'Customer master data',
  icon: 'person-outline',
  route: '/(app)/management/customers',
},

{
  key: 'fixed-assets',
  title: 'Fixed Assets',
  subtitle: 'Vehicles, machinery & asset records',
  icon: 'car-outline',
  route: '/(app)/management/fixed-assets',
},

{
  key: 'purchasers',
  title: 'Purchasers',
  subtitle: 'Purchasers and bank accounts',
  icon: 'people-outline',
  route: '/(app)/management/purchasers',
},

{
  key: 'subcontractors',
  title: 'Subcontractors',
  subtitle: 'Companies & individual subcontractors',
  icon: 'construct-outline',
  route: '/(app)/management/subcontractors',
},

];


export default function ManagementScreen() {

  

  /*
  |--------------------------------------------------------------------------
  | Permission Filtering
  |--------------------------------------------------------------------------
  */

  const visibleModules = managementModules;


  return (
    <SafeAreaView
      style={
        styles.safeArea
      }
    >

      <ScrollView
        contentContainerStyle={
          styles.container
        }

        showsVerticalScrollIndicator={
          false
        }
      >

        {/* HEADER */}

        <View
          style={
            styles.header
          }
        >

          <Pressable
            style={
              styles.backButton
            }

            onPress={() =>
              router.back()
            }
          >

            <Ionicons
              name="arrow-back"
              size={22}
              color={
                Colors.text
              }
            />

          </Pressable>


          <View
            style={
              styles.headerContent
            }
          >

            <Text
              style={
                styles.title
              }
            >
              Management
            </Text>

            <Text
              style={
                styles.subtitle
              }
            >
              Core operational master data
            </Text>

          </View>


          <View
            style={
              styles.countBadge
            }
          >

            <Text
              style={
                styles.countText
              }
            >
              {
                visibleModules.length
              }
            </Text>

          </View>

        </View>


        {/* HERO */}

        <View
          style={
            styles.heroCard
          }
        >

          <View
            style={
              styles.heroIcon
            }
          >

            <Ionicons
              name="grid-outline"
              size={29}
              color={
                Colors.primary
              }
            />

          </View>


          <View
            style={
              styles.heroContent
            }
          >

            <Text
              style={
                styles.heroTitle
              }
            >
              Management Workspace
            </Text>

            <Text
              style={
                styles.heroSubtitle
              }
            >
              Access banking, inventory and other operational master-data modules.
            </Text>

          </View>

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
              styles.sectionCount
            }
          >
            {
              visibleModules.length
            }
          </Text>

        </View>


        {visibleModules.length ===
        0 ? (

          <View
            style={
              styles.emptyCard
            }
          >

            <View
              style={
                styles.emptyIcon
              }
            >

              <Ionicons
                name="lock-closed-outline"
                size={30}
                color={
                  Colors.textMuted
                }
              />

            </View>


            <Text
              style={
                styles.emptyTitle
              }
            >
              No modules available
            </Text>


            <Text
              style={
                styles.emptyText
              }
            >
              Your account does not currently have access to any Management modules.
            </Text>

          </View>

        ) : (

          <View
            style={
              styles.moduleList
            }
          >

            {visibleModules.map(
              module => (

                <ManagementRow
                  key={
                    module.key
                  }
                  module={
                    module
                  }
                />

              )
            )}

          </View>

        )}

      </ScrollView>

    </SafeAreaView>
  );
}


/*
|--------------------------------------------------------------------------
| Management Row
|--------------------------------------------------------------------------
*/

function ManagementRow({
  module,
}: {
  module: MobileModule;
}) {

  const openModule =
    () => {

      if (!module.route) {
        return;
      }

      router.push(
        module.route as any
      );

    };


  return (
    <Pressable
      onPress={
        openModule
      }

      style={({
        pressed,
      }) => [
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
          size={24}
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
          {
            module.title
          }
        </Text>


        <Text
          style={
            styles.moduleSubtitle
          }
        >
          {
            module.subtitle
          }
        </Text>

      </View>


      <Ionicons
        name="chevron-forward"
        size={20}
        color={
          Colors.textMuted
        }
      />

    </Pressable>
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

    container: {
      paddingHorizontal: 20,
      paddingTop: 12,
      paddingBottom: 50,
    },

    /*
    |--------------------------------------------------------------------------
    | Header
    |--------------------------------------------------------------------------
    */

    header: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    backButton: {
      width: 44,
      height: 44,

      borderRadius: 14,

      alignItems: 'center',
      justifyContent: 'center',

      backgroundColor:
        Colors.surface,

      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    headerContent: {
      flex: 1,
      marginLeft: 13,
    },

    title: {
      fontSize: 22,

      fontFamily:
        Fonts.extraBold,

      color:
        Colors.text,
    },

    subtitle: {
      marginTop: 2,

      fontSize: 10,

      fontFamily:
        Fonts.regular,

      color:
        Colors.textSecondary,
    },

    countBadge: {
      minWidth: 38,
      height: 38,

      paddingHorizontal: 10,

      borderRadius: 12,

      alignItems: 'center',
      justifyContent: 'center',

      backgroundColor:
        Colors.primaryLight,
    },

    countText: {
      fontSize: 13,

      fontFamily:
        Fonts.bold,

      color:
        Colors.primary,
    },

    /*
    |--------------------------------------------------------------------------
    | Hero
    |--------------------------------------------------------------------------
    */

    heroCard: {
      marginTop: 24,

      padding: 17,

      flexDirection: 'row',
      alignItems: 'center',

      borderRadius: 20,

      backgroundColor:
        Colors.surface,

      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    heroIcon: {
      width: 55,
      height: 55,

      borderRadius: 18,

      alignItems: 'center',
      justifyContent: 'center',

      backgroundColor:
        Colors.primaryLight,
    },

    heroContent: {
      flex: 1,
      marginLeft: 13,
    },

    heroTitle: {
      fontSize: 14,

      fontFamily:
        Fonts.bold,

      color:
        Colors.text,
    },

    heroSubtitle: {
      marginTop: 4,

      fontSize: 9,
      lineHeight: 14,

      fontFamily:
        Fonts.regular,

      color:
        Colors.textSecondary,
    },

    /*
    |--------------------------------------------------------------------------
    | Section
    |--------------------------------------------------------------------------
    */

    sectionHeader: {
      marginTop: 28,
      marginBottom: 13,

      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'space-between',
    },

    sectionTitle: {
      fontSize: 17,

      fontFamily:
        Fonts.extraBold,

      color:
        Colors.text,
    },

    sectionCount: {
      minWidth: 27,
      height: 27,

      textAlign: 'center',
      textAlignVertical:
        'center',

      borderRadius: 9,

      fontSize: 11,

      fontFamily:
        Fonts.bold,

      color:
        Colors.primary,

      backgroundColor:
        Colors.primaryLight,
    },

    /*
    |--------------------------------------------------------------------------
    | Modules
    |--------------------------------------------------------------------------
    */

    moduleList: {
      overflow: 'hidden',

      borderRadius: 20,

      backgroundColor:
        Colors.surface,

      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    moduleRow: {
      minHeight: 82,

      paddingHorizontal: 15,
      paddingVertical: 14,

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
      width: 48,
      height: 48,

      borderRadius: 15,

      alignItems: 'center',
      justifyContent: 'center',

      backgroundColor:
        Colors.primaryLight,
    },

    moduleContent: {
      flex: 1,
      marginLeft: 13,
    },

    moduleTitle: {
      fontSize: 15,

      fontFamily:
        Fonts.bold,

      color:
        Colors.text,
    },

    moduleSubtitle: {
      marginTop: 3,

      fontSize: 10,
      lineHeight: 15,

      fontFamily:
        Fonts.regular,

      color:
        Colors.textSecondary,
    },

    /*
    |--------------------------------------------------------------------------
    | Empty
    |--------------------------------------------------------------------------
    */

    emptyCard: {
      paddingVertical: 42,
      paddingHorizontal: 25,

      alignItems: 'center',

      borderRadius: 20,

      backgroundColor:
        Colors.surface,

      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    emptyIcon: {
      width: 66,
      height: 66,

      borderRadius: 22,

      alignItems: 'center',
      justifyContent: 'center',

      backgroundColor:
        Colors.background,
    },

    emptyTitle: {
      marginTop: 15,

      fontSize: 14,

      fontFamily:
        Fonts.bold,

      color:
        Colors.text,
    },

    emptyText: {
      marginTop: 5,

      textAlign: 'center',

      fontSize: 10,
      lineHeight: 16,

      fontFamily:
        Fonts.regular,

      color:
        Colors.textSecondary,
    },

  });
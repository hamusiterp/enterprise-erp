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


const administrationModules = [
  {
  title: 'Users',
  subtitle: 'Manage system users',
  icon: 'people-outline',
  route: '/(app)/administration/users',
},

  {
  title: 'Roles',
  subtitle: 'Roles and access',
  icon: 'shield-outline',
  route: '/(app)/administration/roles',
},

  {
  title: 'Permissions',
  subtitle: 'System access permissions',
  icon: 'key-outline',
  route: '/(app)/administration/permissions',
},

  {
  title: 'Departments',
  subtitle: 'Organization departments',
  icon: 'business-outline',
  route: '/(app)/administration/departments',
},

  {
  title: 'Designations',
  subtitle: 'Positions & job titles',
  icon: 'ribbon-outline',
  route: '/(app)/administration/designations',
},


];


export default function AdministrationScreen() {

  return (
    <SafeAreaView
      style={styles.safeArea}
    >

      <ScrollView
        contentContainerStyle={
          styles.container
        }
      >

        <View
          style={styles.header}
        >

          <Pressable
            style={styles.backButton}
            onPress={() =>
              router.back()
            }
          >

            <Ionicons
              name="arrow-back"
              size={22}
              color={Colors.text}
            />

          </Pressable>


          <View
            style={styles.headerText}
          >

            <Text
              style={styles.title}
            >
              Administration
            </Text>

            <Text
              style={styles.subtitle}
            >
              System configuration
            </Text>

          </View>

        </View>


        <View
          style={styles.list}
        >

          {administrationModules.map(
            (item) => (

              <Pressable
  key={item.title}

  onPress={() => {
    if (item.route) {
      router.push(
        item.route as any
      );
    }
  }}

  style={({ pressed }) => [
    styles.row,

    pressed &&
      styles.rowPressed,
  ]}
>

                <View
                  style={styles.icon}
                >

                  <Ionicons
                    name={
                      item.icon as any
                    }
                    size={23}
                    color={
                      Colors.primary
                    }
                  />

                </View>


                <View
                  style={styles.content}
                >

                  <Text
                    style={
                      styles.rowTitle
                    }
                  >
                    {item.title}
                  </Text>

                  <Text
                    style={
                      styles.rowSubtitle
                    }
                  >
                    {item.subtitle}
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

            )
          )}

        </View>

      </ScrollView>

    </SafeAreaView>
  );
}


const styles =
  StyleSheet.create({

    safeArea: {
      flex: 1,
      backgroundColor:
        Colors.background,
    },

    container: {
      padding: 20,
      paddingBottom: 40,
    },

    header: {
      marginTop: 5,

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

    headerText: {
      marginLeft: 14,
    },

    title: {
      fontSize: 22,
      fontWeight: '800',
      color: Colors.text,
    },

    subtitle: {
      marginTop: 2,

      fontSize: 12,

      color:
        Colors.textSecondary,
    },

    list: {
      marginTop: 28,

      borderRadius: 20,

      overflow: 'hidden',

      backgroundColor:
        Colors.surface,

      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    row: {
      minHeight: 79,

      paddingHorizontal: 15,
      paddingVertical: 14,

      flexDirection: 'row',
      alignItems: 'center',

      borderBottomWidth: 1,
      borderBottomColor:
        Colors.border,
    },

    rowPressed: {
      backgroundColor:
        Colors.primaryLight,
    },

    icon: {
      width: 46,
      height: 46,

      borderRadius: 14,

      alignItems: 'center',
      justifyContent: 'center',

      backgroundColor:
        Colors.primaryLight,
    },

    content: {
      flex: 1,
      marginLeft: 13,
    },

    rowTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: Colors.text,
    },

    rowSubtitle: {
      marginTop: 3,

      fontSize: 12,

      color:
        Colors.textSecondary,
    },

  });
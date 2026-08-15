import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import {
  router,
  useFocusEffect,
  useLocalSearchParams,
} from 'expo-router';

import {
  useCallback,
  useState,
} from 'react';

import {
  Colors,
} from '../../../../constants/colors';

import {
  Fonts,
} from '../../../../constants/fonts';

import {
  Department,
  departmentsApi,
} from '../../../../api/departmentsApi';


export default function DepartmentDetailsScreen() {

  const params =
    useLocalSearchParams();

  const departmentId =
    Number(params.id);

  const [
    department,
    setDepartment,
  ] = useState<Department | null>(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    changingStatus,
    setChangingStatus,
  ] = useState(false);

  const [
    deleting,
    setDeleting,
  ] = useState(false);


  /*
  |--------------------------------------------------------------------------
  | Load Department
  |--------------------------------------------------------------------------
  */

  const loadDepartment =
    useCallback(async () => {

      if (
        Number.isNaN(
          departmentId
        )
      ) {
        return;
      }

      try {

        setLoading(true);

        const data =
          await departmentsApi.get(
            departmentId
          );

        setDepartment(data);

      } catch (error: any) {

        console.log(
          'Department details error:',
          error?.response?.data ??
          error
        );

        Alert.alert(
          'Unable to load department',
          error?.response?.data?.message ??
          'Department information could not be loaded.'
        );

      } finally {

        setLoading(false);

      }

    }, [
      departmentId,
    ]);


  /*
  |--------------------------------------------------------------------------
  | Refresh when returning from Edit
  |--------------------------------------------------------------------------
  */

  useFocusEffect(
    useCallback(() => {

      loadDepartment();

    }, [
      loadDepartment,
    ])
  );


  /*
  |--------------------------------------------------------------------------
  | Change Status
  |--------------------------------------------------------------------------
  */

  const confirmStatusChange = () => {

    if (
      !department ||
      changingStatus
    ) {
      return;
    }

    const newStatus =
      department.status === 'active'
        ? 'inactive'
        : 'active';

    Alert.alert(
      newStatus === 'active'
        ? 'Activate Department'
        : 'Deactivate Department',

      newStatus === 'active'
        ? `Activate ${department.department_name}?`
        : `Deactivate ${department.department_name}?`,

      [
        {
          text: 'Cancel',
          style: 'cancel',
        },

        {
          text:
            newStatus === 'active'
              ? 'Activate'
              : 'Deactivate',

          onPress: () =>
            changeStatus(
              newStatus
            ),
        },
      ]
    );

  };


  const changeStatus =
    async (
      status:
        | 'active'
        | 'inactive'
    ) => {

      if (!department) {
        return;
      }

      try {

        setChangingStatus(true);

        const updated =
          await departmentsApi
            .changeStatus(
              department.id,
              status
            );

        setDepartment(
          updated
        );

        Alert.alert(
          'Status updated',
          status === 'active'
            ? 'The department is now active.'
            : 'The department is now inactive.'
        );

      } catch (error: any) {

        console.log(
          'Department status error:',
          error?.response?.data ??
          error
        );

        Alert.alert(
          'Unable to update status',
          error?.response?.data?.message ??
          'The department status could not be changed.'
        );

      } finally {

        setChangingStatus(false);

      }

    };


  /*
  |--------------------------------------------------------------------------
  | Delete
  |--------------------------------------------------------------------------
  */

  const confirmDelete = () => {

    if (
      !department ||
      deleting
    ) {
      return;
    }

    Alert.alert(
      'Delete Department',

      `Are you sure you want to delete ${department.department_name}?`,

      [
        {
          text: 'Cancel',
          style: 'cancel',
        },

        {
          text: 'Delete',
          style: 'destructive',

          onPress: () =>
            deleteDepartment(),
        },
      ]
    );

  };


  const deleteDepartment =
    async () => {

      if (!department) {
        return;
      }

      try {

        setDeleting(true);

        await departmentsApi.remove(
          department.id
        );

        Alert.alert(
          'Department deleted',
          'The department has been deleted successfully.',
          [
            {
              text: 'OK',

              onPress: () =>
                router.back(),
            },
          ]
        );

      } catch (error: any) {

        console.log(
          'Department delete error:',
          error?.response?.data ??
          error
        );

        Alert.alert(
          'Delete failed',
          error?.response?.data?.message ??
          'Unable to delete the department.'
        );

      } finally {

        setDeleting(false);

      }

    };


  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {

    return (
      <SafeAreaView
        style={
          styles.safeArea
        }
      >

        <View
          style={
            styles.loadingContainer
          }
        >

          <ActivityIndicator
            size="large"
            color={
              Colors.primary
            }
          />

          <Text
            style={
              styles.loadingText
            }
          >
            Loading department...
          </Text>

        </View>

      </SafeAreaView>
    );

  }


  /*
  |--------------------------------------------------------------------------
  | Not Found
  |--------------------------------------------------------------------------
  */

  if (!department) {

    return (
      <SafeAreaView
        style={
          styles.safeArea
        }
      >

        <View
          style={
            styles.loadingContainer
          }
        >

          <Ionicons
            name="business-outline"
            size={42}
            color={
              Colors.textMuted
            }
          />

          <Text
            style={
              styles.notFoundTitle
            }
          >
            Department not found
          </Text>

          <Pressable
            style={
              styles.goBackButton
            }
            onPress={() =>
              router.back()
            }
          >

            <Text
              style={
                styles.goBackText
              }
            >
              Go Back
            </Text>

          </Pressable>

        </View>

      </SafeAreaView>
    );

  }


  const registeredBy =
    department.registered_by ??
    department.registeredBy;


  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

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
              Department
            </Text>

            <Text
              style={
                styles.subtitle
              }
            >
              Department details
            </Text>

          </View>


          <Pressable
            style={
              styles.editButton
            }
            onPress={() =>
              router.push(
                `/(app)/administration/departments/${department.id}/edit` as any
              )
            }
          >

            <Ionicons
              name="create-outline"
              size={21}
              color={
                Colors.primary
              }
            />

          </Pressable>

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
              name="business-outline"
              size={34}
              color={
                Colors.primary
              }
            />

          </View>


          <Text
            style={
              styles.departmentName
            }
          >
            {
              department
                .department_name
            }
          </Text>


          <Text
            style={
              styles.departmentCode
            }
          >
            {
              department
                .department_id
            }
          </Text>


          <View
            style={[
              styles.statusBadge,

              department.status ===
              'active'
                ? styles.activeBadge
                : styles.inactiveBadge,
            ]}
          >

            <View
              style={[
                styles.statusDot,

                department.status ===
                'active'
                  ? styles.activeDot
                  : styles.inactiveDot,
              ]}
            />

            <Text
              style={[
                styles.statusText,

                department.status ===
                'active'
                  ? styles.activeText
                  : styles.inactiveText,
              ]}
            >
              {
                department.status ===
                'active'
                  ? 'Active'
                  : 'Inactive'
              }
            </Text>

          </View>

        </View>


        {/* INFORMATION */}

        <Text
          style={
            styles.sectionTitle
          }
        >
          Information
        </Text>


        <View
          style={
            styles.infoCard
          }
        >

          <InfoRow
            icon="barcode-outline"
            label="Department ID"
            value={
              department.department_id
            }
          />

          <Divider />

          <InfoRow
            icon="business-outline"
            label="Department Name"
            value={
              department.department_name
            }
          />

          <Divider />

          <InfoRow
            icon="document-text-outline"
            label="Description"
            value={
              department.description ||
              'No description'
            }
          />

          {registeredBy?.name && (
            <>
              <Divider />

              <InfoRow
                icon="person-outline"
                label="Registered By"
                value={
                  registeredBy.name
                }
              />
            </>
          )}

          {department.created_at && (
            <>
              <Divider />

              <InfoRow
                icon="calendar-outline"
                label="Created"
                value={
                  formatDate(
                    department.created_at
                  )
                }
              />
            </>
          )}

          {department.updated_at && (
            <>
              <Divider />

              <InfoRow
                icon="time-outline"
                label="Last Updated"
                value={
                  formatDate(
                    department.updated_at
                  )
                }
              />
            </>
          )}

        </View>


        {/* ACTIONS */}

        <Text
          style={
            styles.sectionTitle
          }
        >
          Actions
        </Text>


        <Pressable
          disabled={
            changingStatus
          }
          onPress={
            confirmStatusChange
          }
          style={
            styles.actionCard
          }
        >

          <View
            style={
              styles.actionIcon
            }
          >

            {changingStatus ? (

              <ActivityIndicator
                size="small"
                color={
                  Colors.primary
                }
              />

            ) : (

              <Ionicons
                name={
                  department.status ===
                  'active'
                    ? 'pause-circle-outline'
                    : 'checkmark-circle-outline'
                }
                size={22}
                color={
                  Colors.primary
                }
              />

            )}

          </View>


          <View
            style={
              styles.actionContent
            }
          >

            <Text
              style={
                styles.actionTitle
              }
            >
              {
                department.status ===
                'active'
                  ? 'Deactivate Department'
                  : 'Activate Department'
              }
            </Text>

            <Text
              style={
                styles.actionSubtitle
              }
            >
              {
                department.status ===
                'active'
                  ? 'Temporarily disable this department'
                  : 'Make this department active again'
              }
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


        {/* DELETE */}

        <Pressable
          disabled={
            deleting
          }
          onPress={
            confirmDelete
          }
          style={[
            styles.actionCard,
            styles.deleteCard,
          ]}
        >

          <View
            style={[
              styles.actionIcon,
              styles.deleteIcon,
            ]}
          >

            {deleting ? (

              <ActivityIndicator
                size="small"
                color={
                  Colors.danger
                }
              />

            ) : (

              <Ionicons
                name="trash-outline"
                size={21}
                color={
                  Colors.danger
                }
              />

            )}

          </View>


          <View
            style={
              styles.actionContent
            }
          >

            <Text
              style={
                styles.deleteTitle
              }
            >
              Delete Department
            </Text>

            <Text
              style={
                styles.actionSubtitle
              }
            >
              Move this department to deleted records
            </Text>

          </View>

        </Pressable>

      </ScrollView>

    </SafeAreaView>
  );
}


/*
|--------------------------------------------------------------------------
| Info Row
|--------------------------------------------------------------------------
*/

function InfoRow({
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
        styles.infoRow
      }
    >

      <View
        style={
          styles.infoIcon
        }
      >

        <Ionicons
          name={icon}
          size={18}
          color={
            Colors.primary
          }
        />

      </View>


      <View
        style={
          styles.infoContent
        }
      >

        <Text
          style={
            styles.infoLabel
          }
        >
          {label}
        </Text>

        <Text
          style={
            styles.infoValue
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
      style={
        styles.divider
      }
    />
  );
}


function formatDate(
  value: string
) {

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return value;
  }

  return date.toLocaleDateString(
    undefined,
    {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }
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
      fontSize: 12,
      fontFamily:
        Fonts.regular,
      color:
        Colors.textSecondary,
    },

    editButton: {
      width: 44,
      height: 44,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        Colors.primaryLight,
      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    heroCard: {
      marginTop: 24,
      padding: 24,
      alignItems: 'center',
      borderRadius: 22,
      backgroundColor:
        Colors.surface,
      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    heroIcon: {
      width: 72,
      height: 72,
      borderRadius: 23,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        Colors.primaryLight,
    },

    departmentName: {
      marginTop: 15,
      textAlign: 'center',
      fontSize: 20,
      fontFamily:
        Fonts.extraBold,
      color:
        Colors.text,
    },

    departmentCode: {
      marginTop: 5,
      fontSize: 12,
      fontFamily:
        Fonts.medium,
      color:
        Colors.textSecondary,
    },

    statusBadge: {
      marginTop: 13,
      paddingHorizontal: 12,
      paddingVertical: 7,
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 20,
    },

    activeBadge: {
      backgroundColor:
        Colors.primaryLight,
    },

    inactiveBadge: {
      backgroundColor:
        Colors.surface,
    },

    statusDot: {
      width: 7,
      height: 7,
      marginRight: 6,
      borderRadius: 10,
    },

    activeDot: {
      backgroundColor:
        Colors.primary,
    },

    inactiveDot: {
      backgroundColor:
        Colors.danger,
    },

    statusText: {
      fontSize: 11,
      fontFamily:
        Fonts.bold,
    },

    activeText: {
      color:
        Colors.primary,
    },

    inactiveText: {
      color:
        Colors.danger,
    },

    sectionTitle: {
      marginTop: 27,
      marginBottom: 12,
      fontSize: 17,
      fontFamily:
        Fonts.extraBold,
      color:
        Colors.text,
    },

    infoCard: {
      paddingHorizontal: 16,
      borderRadius: 20,
      backgroundColor:
        Colors.surface,
      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    infoRow: {
      minHeight: 72,
      paddingVertical: 12,
      flexDirection: 'row',
      alignItems: 'center',
    },

    infoIcon: {
      width: 38,
      height: 38,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        Colors.primaryLight,
    },

    infoContent: {
      flex: 1,
      marginLeft: 12,
    },

    infoLabel: {
      fontSize: 10,
      fontFamily:
        Fonts.medium,
      color:
        Colors.textMuted,
    },

    infoValue: {
      marginTop: 3,
      fontSize: 13,
      lineHeight: 19,
      fontFamily:
        Fonts.semiBold,
      color:
        Colors.text,
    },

    divider: {
      height: 1,
      backgroundColor:
        Colors.border,
    },

    actionCard: {
      minHeight: 74,
      marginBottom: 11,
      padding: 14,
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 18,
      backgroundColor:
        Colors.surface,
      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    actionIcon: {
      width: 44,
      height: 44,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        Colors.primaryLight,
    },

    actionContent: {
      flex: 1,
      marginLeft: 12,
    },

    actionTitle: {
      fontSize: 13,
      fontFamily:
        Fonts.bold,
      color:
        Colors.text,
    },

    actionSubtitle: {
      marginTop: 3,
      fontSize: 10,
      lineHeight: 15,
      fontFamily:
        Fonts.regular,
      color:
        Colors.textSecondary,
    },

    deleteCard: {
      marginTop: 3,
    },

    deleteIcon: {
      backgroundColor:
        Colors.background,
    },

    deleteTitle: {
      fontSize: 13,
      fontFamily:
        Fonts.bold,
      color:
        Colors.danger,
    },

    loadingContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },

    loadingText: {
      marginTop: 12,
      fontSize: 13,
      fontFamily:
        Fonts.medium,
      color:
        Colors.textSecondary,
    },

    notFoundTitle: {
      marginTop: 13,
      fontSize: 17,
      fontFamily:
        Fonts.bold,
      color:
        Colors.text,
    },

    goBackButton: {
      marginTop: 20,
      paddingHorizontal: 22,
      paddingVertical: 12,
      borderRadius: 14,
      backgroundColor:
        Colors.primary,
    },

    goBackText: {
      fontFamily:
        Fonts.bold,
      color:
        Colors.white,
    },

  });
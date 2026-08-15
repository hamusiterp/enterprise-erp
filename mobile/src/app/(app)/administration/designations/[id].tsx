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
  Designation,
  designationsApi,
} from '../../../../api/designationsApi';


export default function DesignationDetailsScreen() {
  const params =
    useLocalSearchParams();

  const designationId =
    Number(params.id);

  const [
    designation,
    setDesignation,
  ] = useState<Designation | null>(null);

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
  | Load
  |--------------------------------------------------------------------------
  */

  const loadDesignation =
    useCallback(async () => {

      if (
        Number.isNaN(
          designationId
        )
      ) {
        return;
      }

      try {
        setLoading(true);

        const data =
          await designationsApi.get(
            designationId
          );

        setDesignation(data);

      } catch (error: any) {

        console.log(
          'Designation details error:',
          error?.response?.data ??
          error
        );

        Alert.alert(
          'Unable to load designation',
          error?.response?.data?.message ??
          'Designation information could not be loaded.'
        );

      } finally {
        setLoading(false);
      }

    }, [
      designationId,
    ]);


  useFocusEffect(
    useCallback(() => {
      loadDesignation();
    }, [
      loadDesignation,
    ])
  );


  /*
  |--------------------------------------------------------------------------
  | Status
  |--------------------------------------------------------------------------
  */

  const confirmStatusChange = () => {
    if (
      !designation ||
      changingStatus
    ) {
      return;
    }

    const newStatus =
      designation.status === 'active'
        ? 'inactive'
        : 'active';

    Alert.alert(
      newStatus === 'active'
        ? 'Activate Designation'
        : 'Deactivate Designation',

      newStatus === 'active'
        ? `Activate ${designation.name}?`
        : `Deactivate ${designation.name}?`,

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

      if (!designation) {
        return;
      }

      try {
        setChangingStatus(true);

        const updated =
          await designationsApi
            .changeStatus(
              designation.id,
              status
            );

        setDesignation(
          updated
        );

        Alert.alert(
          'Status updated',
          status === 'active'
            ? 'The designation is now active.'
            : 'The designation is now inactive.'
        );

      } catch (error: any) {

        console.log(
          'Designation status error:',
          error?.response?.data ??
          error
        );

        Alert.alert(
          'Unable to update status',
          error?.response?.data?.message ??
          'The designation status could not be changed.'
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
      !designation ||
      deleting
    ) {
      return;
    }

    Alert.alert(
      'Delete Designation',
      `Are you sure you want to delete ${designation.name}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },

        {
          text: 'Delete',
          style: 'destructive',

          onPress: () =>
            deleteDesignation(),
        },
      ]
    );
  };


  const deleteDesignation =
    async () => {

      if (!designation) {
        return;
      }

      try {
        setDeleting(true);

        await designationsApi.remove(
          designation.id
        );

        Alert.alert(
          'Designation deleted',
          'The designation has been deleted successfully.',
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
          'Designation delete error:',
          error?.response?.data ??
          error
        );

        Alert.alert(
          'Delete failed',
          error?.response?.data?.message ??
          'Unable to delete designation.'
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
        style={styles.safeArea}
      >
        <View
          style={
            styles.loadingContainer
          }
        >
          <ActivityIndicator
            size="large"
            color={Colors.primary}
          />

          <Text
            style={styles.loadingText}
          >
            Loading designation...
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

  if (!designation) {
    return (
      <SafeAreaView
        style={styles.safeArea}
      >
        <View
          style={
            styles.loadingContainer
          }
        >
          <Ionicons
            name="ribbon-outline"
            size={42}
            color={Colors.textMuted}
          />

          <Text
            style={
              styles.notFoundTitle
            }
          >
            Designation not found
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


  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

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
      >

        {/* HEADER */}

        <View style={styles.header}>

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
            style={
              styles.headerContent
            }
          >
            <Text style={styles.title}>
              Designation
            </Text>

            <Text
              style={styles.subtitle}
            >
              Position details
            </Text>
          </View>

          <Pressable
            style={styles.editButton}
            onPress={() =>
              router.push(
                `/(app)/administration/designations/${designation.id}/edit` as any
              )
            }
          >
            <Ionicons
              name="create-outline"
              size={21}
              color={Colors.primary}
            />
          </Pressable>

        </View>


        {/* HERO */}

        <View
          style={styles.heroCard}
        >
          <View
            style={styles.heroIcon}
          >
            <Ionicons
              name="ribbon-outline"
              size={34}
              color={Colors.primary}
            />
          </View>

          <Text
            style={
              styles.designationName
            }
          >
            {designation.name}
          </Text>

          <Text
            style={styles.code}
          >
            {designation.code}
          </Text>

          <View
            style={[
              styles.statusBadge,

              designation.status ===
              'active'
                ? styles.activeBadge
                : styles.inactiveBadge,
            ]}
          >
            <View
              style={[
                styles.statusDot,

                designation.status ===
                'active'
                  ? styles.activeDot
                  : styles.inactiveDot,
              ]}
            />

            <Text
              style={[
                styles.statusText,

                designation.status ===
                'active'
                  ? styles.activeText
                  : styles.inactiveText,
              ]}
            >
              {designation.status ===
              'active'
                ? 'Active'
                : 'Inactive'}
            </Text>
          </View>
        </View>


        {/* INFORMATION */}

        <Text
          style={styles.sectionTitle}
        >
          Information
        </Text>

        <View
          style={styles.infoCard}
        >

          <InfoRow
            icon="barcode-outline"
            label="Code"
            value={designation.code}
          />

          <Divider />

          <InfoRow
            icon="ribbon-outline"
            label="Designation Name"
            value={designation.name}
          />

          <Divider />

          <InfoRow
            icon="business-outline"
            label="Department"
            value={
              designation.department
                ?.department_name ??
              'Not assigned'
            }
          />

          <Divider />

          <InfoRow
            icon="layers-outline"
            label="Level"
            value={
              designation.level != null
                ? String(
                    designation.level
                  )
                : 'Not assigned'
            }
          />

          <Divider />

          <InfoRow
            icon="document-text-outline"
            label="Description"
            value={
              designation.description ||
              'No description'
            }
          />

          {designation.created_at && (
            <>
              <Divider />

              <InfoRow
                icon="calendar-outline"
                label="Created"
                value={
                  formatDate(
                    designation.created_at
                  )
                }
              />
            </>
          )}

          {designation.updated_at && (
            <>
              <Divider />

              <InfoRow
                icon="time-outline"
                label="Last Updated"
                value={
                  formatDate(
                    designation.updated_at
                  )
                }
              />
            </>
          )}

        </View>


        {/* ACTIONS */}

        <Text
          style={styles.sectionTitle}
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
          style={styles.actionCard}
        >

          <View
            style={styles.actionIcon}
          >
            {changingStatus ? (
              <ActivityIndicator
                size="small"
                color={Colors.primary}
              />
            ) : (
              <Ionicons
                name={
                  designation.status ===
                  'active'
                    ? 'pause-circle-outline'
                    : 'checkmark-circle-outline'
                }
                size={22}
                color={Colors.primary}
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
              {designation.status ===
              'active'
                ? 'Deactivate Designation'
                : 'Activate Designation'}
            </Text>

            <Text
              style={
                styles.actionSubtitle
              }
            >
              {designation.status ===
              'active'
                ? 'Temporarily disable this designation'
                : 'Make this designation available again'}
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={19}
            color={Colors.textMuted}
          />

        </Pressable>


        <Pressable
          disabled={deleting}
          onPress={confirmDelete}
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
                color={Colors.danger}
              />
            ) : (
              <Ionicons
                name="trash-outline"
                size={21}
                color={Colors.danger}
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
              Delete Designation
            </Text>

            <Text
              style={
                styles.actionSubtitle
              }
            >
              Remove this designation
            </Text>
          </View>

        </Pressable>

      </ScrollView>
    </SafeAreaView>
  );
}


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
    <View style={styles.infoRow}>
      <View
        style={styles.infoIcon}
      >
        <Ionicons
          name={icon}
          size={18}
          color={Colors.primary}
        />
      </View>

      <View
        style={styles.infoContent}
      >
        <Text
          style={styles.infoLabel}
        >
          {label}
        </Text>

        <Text
          style={styles.infoValue}
        >
          {value}
        </Text>
      </View>
    </View>
  );
}


function Divider() {
  return (
    <View style={styles.divider} />
  );
}


function formatDate(
  value: string
): string {
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


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
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
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  headerContent: {
    flex: 1,
    marginLeft: 13,
  },

  title: {
    fontSize: 22,
    fontFamily: Fonts.extraBold,
    color: Colors.text,
  },

  subtitle: {
    marginTop: 2,
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
  },

  editButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryLight,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  heroCard: {
    marginTop: 24,
    padding: 24,
    alignItems: 'center',
    borderRadius: 22,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  heroIcon: {
    width: 72,
    height: 72,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryLight,
  },

  designationName: {
    marginTop: 15,
    textAlign: 'center',
    fontSize: 20,
    fontFamily: Fonts.extraBold,
    color: Colors.text,
  },

  code: {
    marginTop: 5,
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: Colors.textSecondary,
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
    backgroundColor: Colors.primaryLight,
  },

  inactiveBadge: {
    backgroundColor: Colors.surface,
  },

  statusDot: {
    width: 7,
    height: 7,
    marginRight: 6,
    borderRadius: 10,
  },

  activeDot: {
    backgroundColor: Colors.primary,
  },

  inactiveDot: {
    backgroundColor: Colors.danger,
  },

  statusText: {
    fontSize: 11,
    fontFamily: Fonts.bold,
  },

  activeText: {
    color: Colors.primary,
  },

  inactiveText: {
    color: Colors.danger,
  },

  sectionTitle: {
    marginTop: 27,
    marginBottom: 12,
    fontSize: 17,
    fontFamily: Fonts.extraBold,
    color: Colors.text,
  },

  infoCard: {
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
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
    backgroundColor: Colors.primaryLight,
  },

  infoContent: {
    flex: 1,
    marginLeft: 12,
  },

  infoLabel: {
    fontSize: 10,
    fontFamily: Fonts.medium,
    color: Colors.textMuted,
  },

  infoValue: {
    marginTop: 3,
    fontSize: 13,
    lineHeight: 19,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
  },

  divider: {
    height: 1,
    backgroundColor: Colors.border,
  },

  actionCard: {
    minHeight: 74,
    marginBottom: 11,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryLight,
  },

  actionContent: {
    flex: 1,
    marginLeft: 12,
  },

  actionTitle: {
    fontSize: 13,
    fontFamily: Fonts.bold,
    color: Colors.text,
  },

  actionSubtitle: {
    marginTop: 3,
    fontSize: 10,
    lineHeight: 15,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
  },

  deleteCard: {
    marginTop: 3,
  },

  deleteIcon: {
    backgroundColor: Colors.background,
  },

  deleteTitle: {
    fontSize: 13,
    fontFamily: Fonts.bold,
    color: Colors.danger,
  },

  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    marginTop: 12,
    fontSize: 13,
    fontFamily: Fonts.medium,
    color: Colors.textSecondary,
  },

  notFoundTitle: {
    marginTop: 13,
    fontSize: 17,
    fontFamily: Fonts.bold,
    color: Colors.text,
  },

  goBackButton: {
    marginTop: 20,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: Colors.primary,
  },

  goBackText: {
    fontFamily: Fonts.bold,
    color: Colors.white,
  },
});
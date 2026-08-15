import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import {
  router,
  useLocalSearchParams,
} from 'expo-router';

import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  Project,
  projectsApi,
} from '../../../../../api/projectsApi';

import {
  Colors,
} from '../../../../../constants/colors';

import {
  Fonts,
} from '../../../../../constants/fonts';


export default function ProjectDetailsScreen() {

  const { id } =
    useLocalSearchParams<{
      id: string;
    }>();

  const projectId =
    Number(id);

  const [
    project,
    setProject,
  ] = useState<Project | null>(
    null
  );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

  const [
    deleting,
    setDeleting,
  ] = useState(false);


  /*
  |--------------------------------------------------------------------------
  | Load Project
  |--------------------------------------------------------------------------
  */

  const loadProject =
    useCallback(async () => {

      if (
        !projectId ||
        Number.isNaN(projectId)
      ) {
        setLoading(false);
        return;
      }

      try {

        const result =
          await projectsApi.get(
            projectId
          );

        setProject(result);

      } catch (error) {

        console.log(
          'PROJECT DETAILS ERROR:',
          error
        );

        Alert.alert(
          'Error',
          'Unable to load project.'
        );

      } finally {

        setLoading(false);
        setRefreshing(false);

      }

    }, [projectId]);


  useEffect(() => {

    loadProject();

  }, [loadProject]);


  /*
  |--------------------------------------------------------------------------
  | Refresh
  |--------------------------------------------------------------------------
  */

  const refresh =
    () => {

      setRefreshing(true);
      loadProject();

    };


  /*
  |--------------------------------------------------------------------------
  | Delete
  |--------------------------------------------------------------------------
  */

  const deleteProject =
    () => {

      if (!project) {
        return;
      }

      Alert.alert(
        'Delete Project',
        `Are you sure you want to delete ${project.project_no}?`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            style: 'destructive',

            onPress:
              async () => {

                try {

                  setDeleting(true);

                  await projectsApi
                    .remove(
                      project.id
                    );

                  Alert.alert(
                    'Success',
                    'Project deleted successfully.',
                    [
                      {
                        text: 'OK',
                        onPress: () =>
                          router.back(),
                      },
                    ]
                  );

                } catch (error) {

                  console.log(
                    'PROJECT DELETE ERROR:',
                    error
                  );

                  Alert.alert(
                    'Error',
                    'Unable to delete project.'
                  );

                } finally {

                  setDeleting(false);

                }

              },
          },
        ]
      );

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
            styles.center
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
            Loading project...
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

  if (!project) {

    return (
      <SafeAreaView
        style={
          styles.safeArea
        }
      >
        <View
          style={
            styles.center
          }
        >

          <Ionicons
            name="alert-circle-outline"
            size={45}
            color={
              Colors.textMuted
            }
          />

          <Text
            style={
              styles.notFoundTitle
            }
          >
            Project not found
          </Text>

          <Pressable
            style={
              styles.backButton
            }
            onPress={() =>
              router.back()
            }
          >
            <Text
              style={
                styles.backButtonText
              }
            >
              Go Back
            </Text>
          </Pressable>

        </View>
      </SafeAreaView>
    );

  }


  const active =
    project.status === 'active';


  const reference =
    project.project_source ===
    'Bid'
      ? project.bid_reference
      : project.work_order_no;


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

        refreshControl={
          <RefreshControl
            refreshing={
              refreshing
            }
            onRefresh={
              refresh
            }
          />
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
              styles.iconButton
            }
            onPress={() =>
              router.back()
            }
          >
            <Ionicons
              name="arrow-back"
              size={21}
              color={
                Colors.text
              }
            />
          </Pressable>


          <View
            style={
              styles.headerText
            }
          >
            <Text
              style={
                styles.headerTitle
              }
            >
              Project Details
            </Text>

            <Text
              style={
                styles.headerSubtitle
              }
            >
              {project.project_no}
            </Text>
          </View>


          <Pressable
  style={styles.editButton}
  onPress={() => {
    router.push(
      `/(app)/management/projects/${project.id}/edit` as any
    );
  }}
>
  <Ionicons
    name="create-outline"
    size={20}
    color="#FFFFFF"
  />
</Pressable>

        </View>


        {/* MAIN CARD */}

        <View
          style={
            styles.heroCard
          }
        >

          <View
            style={
              styles.heroTop
            }
          >

            <View
              style={
                styles.projectIcon
              }
            >
              <Ionicons
                name="briefcase-outline"
                size={26}
                color={
                  Colors.primary
                }
              />
            </View>


            <View
              style={
                styles.heroHeading
              }
            >

              <Text
                style={
                  styles.projectNumber
                }
              >
                {project.project_no}
              </Text>

              <Text
                style={
                  styles.projectName
                }
              >
                {project.project_name}
              </Text>

            </View>

          </View>


          <View
            style={
              styles.badgeRow
            }
          >

            <View
              style={
                styles.badge
              }
            >
              <Text
                style={
                  styles.badgeText
                }
              >
                {project.project_source}
              </Text>
            </View>


            <View
              style={[
                styles.badge,
                !active &&
                  styles.inactiveBadge,
              ]}
            >
              <Text
                style={
                  styles.badgeText
                }
              >
                {active
                  ? 'Active'
                  : 'Inactive'}
              </Text>
            </View>

          </View>

        </View>


        {/* BASIC INFORMATION */}

        <SectionTitle
          title="Basic Information"
          icon="information-circle-outline"
        />

        <View
          style={
            styles.sectionCard
          }
        >

          <DetailRow
            label="Project Source"
            value={
              project.project_source
            }
          />

          <DetailRow
            label={
              project.project_source ===
              'Bid'
                ? 'Bid Reference'
                : 'Work Order'
            }
            value={
              reference
            }
          />

          <DetailRow
            label="Location"
            value={
              project.location
            }
          />

          <DetailRow
            label="Employer"
            value={
              project.employer
            }
          />

          <DetailRow
            label="Construction Type"
            value={
              project
                .construction_project_type
            }
            last
          />

        </View>


        {/* DESCRIPTION */}

        <SectionTitle
          title="Project Description"
          icon="document-text-outline"
        />

        <View
          style={
            styles.sectionCard
          }
        >
          <Text
            style={
              styles.description
            }
          >
            {project.project_description ||
              '-'}
          </Text>
        </View>


        {/* CONSULTANT / AREA */}

        <SectionTitle
          title="Project Information"
          icon="business-outline"
        />

        <View
          style={
            styles.sectionCard
          }
        >

          <DetailRow
            label="Consultant"
            value={
              project.consultant
            }
          />

          <DetailRow
            label="Specified Area"
            value={
              project.area
            }
          />

          <DetailRow
            label="Business Unit"
            value={
              formatValue(
                project.business_unit
              )
            }
            last
          />

        </View>


        {/* CONTRACT */}

        <SectionTitle
          title="Contract"
          icon="document-outline"
        />

        <View
          style={
            styles.sectionCard
          }
        >

          <DetailRow
            label="Contract Type"
            value={
              formatValue(
                project.contract_type
              )
            }
          />

          <DetailRow
            label="Contract Amount B/VAT"
            value={
              formatMoney(
                project
                  .contract_amount_before_vat
              )
            }
          />

          <DetailRow
            label="Pricing Type"
            value={
              formatValue(
                project
                  .contract_pricing_type
              )
            }
          />

          <DetailRow
            label="Contract Date"
            value={
              project.contract_date
            }
            last
          />

        </View>


        {/* SCHEDULE */}

        <SectionTitle
          title="Schedule"
          icon="calendar-outline"
        />

        <View
          style={
            styles.sectionCard
          }
        >

          <DetailRow
            label="Site Handover"
            value={
              project.site_handover_date
            }
          />

          <DetailRow
            label="Commencement"
            value={
              project.commencement_date
            }
          />

          <DetailRow
            label="Duration"
            value={
              project.project_duration
                ? `${project.project_duration} ${formatValue(
                    project.duration_type
                  )}`
                : '-'
            }
          />

          <DetailRow
            label="Holidays"
            value={
              project.no_of_holidays
            }
            last
          />

        </View>


        {/* PAYMENT */}

        <SectionTitle
          title="Payment"
          icon="cash-outline"
        />

        <View
          style={
            styles.sectionCard
          }
        >

          <DetailRow
            label="Payment Term"
            value={
              formatValue(
                project.payment_term
              )
            }
          />

          <DetailRow
            label="Advance Payment"
            value={
              yesNo(
                project.has_advance_payment
              )
            }
          />

          <DetailRow
            label="Advance %"
            value={
              project.advance_percent
            }
          />

          <DetailRow
            label="Interim Payment Schedule"
            value={
              project
                .interim_payment_schedule
            }
          />

          <DetailRow
            label="Advance Payment Due"
            value={
              project
                .advance_payment_due_date
            }
          />

          <DetailRow
            label="Minimum Payment Time"
            value={
              project.minimum_payment_time
            }
            last
          />

        </View>


        {/* CONDITIONS */}

        <SectionTitle
          title="Bonds & Conditions"
          icon="shield-checkmark-outline"
        />

        <View
          style={
            styles.sectionCard
          }
        >

          <DetailRow
            label="Advance Bond"
            value={
              yesNo(
                project.has_advance_bond
              )
            }
          />

          <DetailRow
            label="Performance Bond"
            value={
              yesNo(
                project.has_performance_bond
              )
            }
          />

          <DetailRow
            label="Price Adjustment"
            value={
              yesNo(
                project.has_price_adjustment
              )
            }
          />

          <DetailRow
            label="Retention"
            value={
              yesNo(
                project.has_retention
              )
            }
          />

          <DetailRow
            label="Price Index"
            value={
              yesNo(
                project.has_price_index
              )
            }
          />

          <DetailRow
            label="Liquidity Damage"
            value={
              yesNo(
                project.has_liquidity_damage
              )
            }
            last
          />

        </View>


        {/* ENGINEERING FACILITIES */}

        <SectionTitle
          title="Engineering Facilities"
          icon="construct-outline"
        />

        <View
          style={
            styles.sectionCard
          }
        >

          {project.engineering_facilities &&
          project.engineering_facilities
            .length > 0 ? (

            <View
              style={
                styles.facilities
              }
            >

              {project
                .engineering_facilities
                .map(
                  facility => (

                    <View
                      key={
                        facility
                      }
                      style={
                        styles.facilityBadge
                      }
                    >
                      <Text
                        style={
                          styles.facilityText
                        }
                      >
                        {formatValue(
                          facility
                        )}
                      </Text>
                    </View>

                  )
                )}

            </View>

          ) : (

            <Text
              style={
                styles.emptyValue
              }
            >
              No engineering facilities
            </Text>

          )}

        </View>


        {/* REGISTRATION */}

        <SectionTitle
          title="Registration"
          icon="person-outline"
        />

        <View
          style={
            styles.sectionCard
          }
        >

          <DetailRow
            label="Registered By"
            value={
              project.registered_by ||
              'System'
            }
          />

          <DetailRow
            label="Date Registered"
            value={
              project.date_registered
            }
            last
          />

        </View>


        {/* DELETE */}

        <Pressable
          disabled={
            deleting
          }
          style={
            styles.deleteButton
          }
          onPress={
            deleteProject
          }
        >

          {deleting ? (

            <ActivityIndicator
              size="small"
              color="#FFFFFF"
            />

          ) : (

            <>
              <Ionicons
                name="trash-outline"
                size={18}
                color="#FFFFFF"
              />

              <Text
                style={
                  styles.deleteText
                }
              >
                Delete Project
              </Text>
            </>

          )}

        </Pressable>

      </ScrollView>

    </SafeAreaView>
  );
}


/*
|--------------------------------------------------------------------------
| Section Title
|--------------------------------------------------------------------------
*/

function SectionTitle({
  title,
  icon,
}: {
  title: string;
  icon: string;
}) {

  return (
    <View
      style={
        styles.sectionTitleRow
      }
    >
      <Ionicons
        name={icon as any}
        size={17}
        color={
          Colors.primary
        }
      />

      <Text
        style={
          styles.sectionTitle
        }
      >
        {title}
      </Text>
    </View>
  );
}


/*
|--------------------------------------------------------------------------
| Detail Row
|--------------------------------------------------------------------------
*/

function DetailRow({
  label,
  value,
  last = false,
}: {
  label: string;
  value:
    | string
    | number
    | null
    | undefined;
  last?: boolean;
}) {

  return (
    <View
      style={[
        styles.detailRow,
        last &&
          styles.lastDetailRow,
      ]}
    >

      <Text
        style={
          styles.detailLabel
        }
      >
        {label}
      </Text>

      <Text
        style={
          styles.detailValue
        }
      >
        {value === null ||
        value === undefined ||
        value === ''
          ? '-'
          : String(value)}
      </Text>

    </View>
  );
}


/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function formatValue(
  value:
    | string
    | null
    | undefined
) {

  if (!value) {
    return '-';
  }

  return value
    .replace(/_/g, ' ')
    .replace(
      /\b\w/g,
      letter =>
        letter.toUpperCase()
    );
}


function formatMoney(
  value:
    | string
    | number
    | null
    | undefined
) {

  if (
    value === null ||
    value === undefined ||
    value === ''
  ) {
    return '-';
  }

  const number =
    Number(value);

  if (
    Number.isNaN(number)
  ) {
    return String(value);
  }

  return number
    .toLocaleString(
      undefined,
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );
}


function yesNo(
  value: unknown
) {

  if (
    value === true ||
    value === 1 ||
    value === '1' ||
    value === 'Yes' ||
    value === 'yes'
  ) {
    return 'Yes';
  }

  return 'No';
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
      paddingHorizontal: 18,
      paddingTop: 12,
      paddingBottom: 50,
    },

    center: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    },

    loadingText: {
      marginTop: 12,
      fontSize: 11,
      fontFamily:
        Fonts.regular,
      color:
        Colors.textSecondary,
    },

    notFoundTitle: {
      marginTop: 12,
      fontSize: 16,
      fontFamily:
        Fonts.bold,
      color:
        Colors.text,
    },

    backButton: {
      marginTop: 18,
      paddingHorizontal: 20,
      paddingVertical: 11,
      borderRadius: 12,
      backgroundColor:
        Colors.primary,
    },

    backButtonText: {
      fontSize: 10,
      fontFamily:
        Fonts.bold,
      color: '#FFFFFF',
    },

    header: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    iconButton: {
      width: 43,
      height: 43,
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
      flex: 1,
      marginLeft: 12,
    },

    headerTitle: {
      fontSize: 20,
      fontFamily:
        Fonts.extraBold,
      color:
        Colors.text,
    },

    headerSubtitle: {
      marginTop: 2,
      fontSize: 10,
      fontFamily:
        Fonts.regular,
      color:
        Colors.textSecondary,
    },

    editButton: {
      width: 43,
      height: 43,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        Colors.primary,
    },

    heroCard: {
      marginTop: 20,
      padding: 17,
      borderRadius: 20,
      backgroundColor:
        Colors.surface,
      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    heroTop: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    projectIcon: {
      width: 52,
      height: 52,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        Colors.primaryLight,
    },

    heroHeading: {
      flex: 1,
      marginLeft: 13,
    },

    projectNumber: {
      fontSize: 10,
      fontFamily:
        Fonts.bold,
      color:
        Colors.primary,
    },

    projectName: {
      marginTop: 4,
      fontSize: 15,
      lineHeight: 21,
      fontFamily:
        Fonts.extraBold,
      color:
        Colors.text,
    },

    badgeRow: {
      marginTop: 15,
      flexDirection: 'row',
      gap: 8,
    },

    badge: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 10,
      backgroundColor:
        Colors.primaryLight,
    },

    inactiveBadge: {
      opacity: 0.65,
    },

    badgeText: {
      fontSize: 9,
      fontFamily:
        Fonts.bold,
      color:
        Colors.primary,
    },

    sectionTitleRow: {
      marginTop: 23,
      marginBottom: 9,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },

    sectionTitle: {
      fontSize: 13,
      fontFamily:
        Fonts.extraBold,
      color:
        Colors.text,
    },

    sectionCard: {
      paddingHorizontal: 15,
      borderRadius: 17,
      backgroundColor:
        Colors.surface,
      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    detailRow: {
      paddingVertical: 13,
      borderBottomWidth: 1,
      borderBottomColor:
        Colors.border,
    },

    lastDetailRow: {
      borderBottomWidth: 0,
    },

    detailLabel: {
      fontSize: 9,
      fontFamily:
        Fonts.regular,
      color:
        Colors.textSecondary,
    },

    detailValue: {
      marginTop: 4,
      fontSize: 11,
      lineHeight: 17,
      fontFamily:
        Fonts.bold,
      color:
        Colors.text,
    },

    description: {
      paddingVertical: 15,
      fontSize: 11,
      lineHeight: 19,
      fontFamily:
        Fonts.regular,
      color:
        Colors.text,
    },

    facilities: {
      paddingVertical: 14,
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },

    facilityBadge: {
      paddingHorizontal: 10,
      paddingVertical: 7,
      borderRadius: 10,
      backgroundColor:
        Colors.primaryLight,
    },

    facilityText: {
      fontSize: 9,
      fontFamily:
        Fonts.bold,
      color:
        Colors.primary,
    },

    emptyValue: {
      paddingVertical: 15,
      fontSize: 10,
      fontFamily:
        Fonts.regular,
      color:
        Colors.textMuted,
    },

    deleteButton: {
      marginTop: 27,
      height: 48,
      borderRadius: 14,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 7,
      backgroundColor:
        '#C83D3D',
    },

    deleteText: {
      fontSize: 11,
      fontFamily:
        Fonts.bold,
      color: '#FFFFFF',
    },

  });
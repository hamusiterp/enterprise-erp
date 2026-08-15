import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  Ionicons,
} from '@expo/vector-icons';

import {
  router,
  useFocusEffect,
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
  DepartmentStatistics,
  departmentsApi,
} from '../../../../api/departmentsApi';


type StatusFilter =
  | 'all'
  | 'active'
  | 'inactive';


export default function DepartmentsScreen() {

  const [
    departments,
    setDepartments,
  ] = useState<Department[]>([]);

  const [
    statistics,
    setStatistics,
  ] =
    useState<DepartmentStatistics>({
      total: 0,
      active: 0,
      inactive: 0,
      deleted: 0,
    });

  const [
    search,
    setSearch,
  ] = useState('');

  const [
    statusFilter,
    setStatusFilter,
  ] =
    useState<StatusFilter>('all');

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
  | Load Departments
  |--------------------------------------------------------------------------
  */

  const loadDepartments =
    useCallback(
      async (
        refresh = false
      ) => {

        try {

          if (refresh) {
            setRefreshing(true);
          } else {
            setLoading(true);
          }


          const params: any = {
            per_page: 100,

            sort_by:
              'department_name',

            sort_order:
              'asc',
          };


          if (
            search.trim()
          ) {
            params.search =
              search.trim();
          }


          if (
            statusFilter !==
            'all'
          ) {
            params.status =
              statusFilter;
          }


          const [
            result,
            stats,
          ] =
            await Promise.all([
              departmentsApi.list(
                params
              ),

              departmentsApi.statistics(),
            ]);


          setDepartments(
            result.data
          );

          setStatistics(
            stats
          );

        } catch (error: any) {

          console.log(
            'Departments load error:',
            error?.response?.data ??
            error
          );

        } finally {

          setLoading(false);
          setRefreshing(false);

        }

      },
      [
        search,
        statusFilter,
      ]
    );


  /*
  |--------------------------------------------------------------------------
  | Reload when screen gains focus
  |--------------------------------------------------------------------------
  */

  useFocusEffect(
    useCallback(() => {

      loadDepartments();

    }, [
      loadDepartments,
    ])
  );


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
            Departments
          </Text>

          <Text
            style={
              styles.subtitle
            }
          >
            Organization structure
          </Text>

        </View>


        <Pressable
          style={
            styles.addButton
          }
          onPress={() =>
            router.push(
              '/(app)/administration/departments/create'
            )
          }
        >

          <Ionicons
            name="add"
            size={25}
            color={
              Colors.white
            }
          />

        </Pressable>

      </View>


      {/* STATISTICS */}

      <View
        style={
          styles.statsRow
        }
      >

        <StatCard
          value={
            statistics.total
          }
          label="Total"
          icon="business-outline"
        />

        <StatCard
          value={
            statistics.active
          }
          label="Active"
          icon="checkmark-circle-outline"
        />

        <StatCard
          value={
            statistics.inactive
          }
          label="Inactive"
          icon="pause-circle-outline"
        />

      </View>


      {/* SEARCH */}

      <View
        style={
          styles.searchBox
        }
      >

        <Ionicons
          name="search-outline"
          size={20}
          color={
            Colors.textSecondary
          }
        />

        <TextInput
          value={search}
          onChangeText={
            setSearch
          }
          placeholder="Search departments..."
          placeholderTextColor={
            Colors.textMuted
          }
          style={
            styles.searchInput
          }
        />


        {search.length > 0 && (

          <Pressable
            onPress={() =>
              setSearch('')
            }
          >

            <Ionicons
              name="close-circle"
              size={20}
              color={
                Colors.textMuted
              }
            />

          </Pressable>

        )}

      </View>


      {/* FILTERS */}

      <View
        style={
          styles.filters
        }
      >

        <FilterButton
          title="All"
          selected={
            statusFilter ===
            'all'
          }
          onPress={() =>
            setStatusFilter(
              'all'
            )
          }
        />

        <FilterButton
          title="Active"
          selected={
            statusFilter ===
            'active'
          }
          onPress={() =>
            setStatusFilter(
              'active'
            )
          }
        />

        <FilterButton
          title="Inactive"
          selected={
            statusFilter ===
            'inactive'
          }
          onPress={() =>
            setStatusFilter(
              'inactive'
            )
          }
        />

      </View>


      {/* LIST */}

      {loading ? (

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
            Loading departments...
          </Text>

        </View>

      ) : (

        <ScrollView
          contentContainerStyle={
            styles.listContent
          }

          showsVerticalScrollIndicator={
            false
          }

          keyboardShouldPersistTaps="handled"

          refreshControl={

            <RefreshControl
              refreshing={
                refreshing
              }
              onRefresh={() =>
                loadDepartments(
                  true
                )
              }
              tintColor={
                Colors.primary
              }
            />

          }
        >

          {departments.length ===
          0 ? (

            <View
              style={
                styles.emptyContainer
              }
            >

              <View
                style={
                  styles.emptyIcon
                }
              >

                <Ionicons
                  name="business-outline"
                  size={35}
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
                No departments found
              </Text>

              <Text
                style={
                  styles.emptyText
                }
              >
                Try changing your search or filter.
              </Text>

            </View>

          ) : (

            departments.map(
              (
                department
              ) => (

                <Pressable
                  key={
                    department.id
                  }

                  onPress={() =>
                    router.push(
                      `/(app)/administration/departments/${department.id}` as any
                    )
                  }

                  style={({
                    pressed,
                  }) => [
                    styles.departmentCard,

                    pressed &&
                      styles.cardPressed,
                  ]}
                >

                  {/* ICON */}

                  <View
                    style={
                      styles.departmentIcon
                    }
                  >

                    <Ionicons
                      name="business-outline"
                      size={23}
                      color={
                        Colors.primary
                      }
                    />

                  </View>


                  {/* CONTENT */}

                  <View
                    style={
                      styles.departmentContent
                    }
                  >

                    <Text
                      style={
                        styles.departmentName
                      }
                      numberOfLines={1}
                    >
                      {
                        department
                          .department_name
                      }
                    </Text>


                    <Text
                      style={
                        styles.departmentId
                      }
                    >
                      {
                        department
                          .department_id
                      }
                    </Text>


                    <View
                      style={
                        styles.statusRow
                      }
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


                  <Ionicons
                    name="chevron-forward"
                    size={19}
                    color={
                      Colors.textMuted
                    }
                  />

                </Pressable>

              )
            )

          )}

        </ScrollView>

      )}

    </SafeAreaView>
  );
}


/*
|--------------------------------------------------------------------------
| Statistic Card
|--------------------------------------------------------------------------
*/

function StatCard({
  value,
  label,
  icon,
}: {
  value: number;
  label: string;
  icon: any;
}) {

  return (
    <View
      style={
        styles.statCard
      }
    >

      <Ionicons
        name={icon}
        size={19}
        color={
          Colors.primary
        }
      />

      <Text
        style={
          styles.statValue
        }
      >
        {value}
      </Text>

      <Text
        style={
          styles.statLabel
        }
      >
        {label}
      </Text>

    </View>
  );
}


/*
|--------------------------------------------------------------------------
| Filter
|--------------------------------------------------------------------------
*/

function FilterButton({
  title,
  selected,
  onPress,
}: {
  title: string;
  selected: boolean;
  onPress: () => void;
}) {

  return (
    <Pressable
      onPress={
        onPress
      }
      style={[
        styles.filterButton,

        selected &&
          styles.filterSelected,
      ]}
    >

      <Text
        style={[
          styles.filterText,

          selected &&
            styles.filterTextSelected,
        ]}
      >
        {title}
      </Text>

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

    header: {
      paddingHorizontal: 20,
      paddingTop: 12,
      paddingBottom: 15,

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

    addButton: {
      width: 44,
      height: 44,

      borderRadius: 14,

      alignItems: 'center',
      justifyContent: 'center',

      backgroundColor:
        Colors.primary,
    },

    statsRow: {
      marginHorizontal: 20,
      marginBottom: 14,

      flexDirection: 'row',

      gap: 9,
    },

    statCard: {
      flex: 1,

      minHeight: 85,

      paddingVertical: 11,

      alignItems: 'center',
      justifyContent: 'center',

      borderRadius: 17,

      backgroundColor:
        Colors.surface,

      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    statValue: {
      marginTop: 4,

      fontSize: 18,

      fontFamily:
        Fonts.extraBold,

      color:
        Colors.text,
    },

    statLabel: {
      marginTop: 1,

      fontSize: 10,

      fontFamily:
        Fonts.regular,

      color:
        Colors.textSecondary,
    },

    searchBox: {
      height: 52,

      marginHorizontal: 20,
      marginBottom: 11,

      paddingHorizontal: 15,

      flexDirection: 'row',
      alignItems: 'center',

      borderRadius: 16,

      backgroundColor:
        Colors.surface,

      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    searchInput: {
      flex: 1,
      height: '100%',

      marginLeft: 10,

      fontSize: 14,

      fontFamily:
        Fonts.regular,

      color:
        Colors.text,
    },

    filters: {
      marginHorizontal: 20,
      marginBottom: 15,

      flexDirection: 'row',

      gap: 8,
    },

    filterButton: {
      paddingHorizontal: 16,
      paddingVertical: 9,

      borderRadius: 20,

      backgroundColor:
        Colors.surface,

      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    filterSelected: {
      backgroundColor:
        Colors.primary,

      borderColor:
        Colors.primary,
    },

    filterText: {
      fontSize: 11,

      fontFamily:
        Fonts.semiBold,

      color:
        Colors.textSecondary,
    },

    filterTextSelected: {
      color:
        Colors.white,
    },

    listContent: {
      paddingHorizontal: 20,

      paddingBottom: 45,
    },

    departmentCard: {
      minHeight: 94,

      marginBottom: 12,

      padding: 14,

      flexDirection: 'row',
      alignItems: 'center',

      borderRadius: 19,

      backgroundColor:
        Colors.surface,

      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    cardPressed: {
      backgroundColor:
        Colors.primaryLight,
    },

    departmentIcon: {
      width: 50,
      height: 50,

      borderRadius: 16,

      alignItems: 'center',
      justifyContent: 'center',

      backgroundColor:
        Colors.primaryLight,
    },

    departmentContent: {
      flex: 1,

      marginLeft: 13,
    },

    departmentName: {
      fontSize: 14,

      fontFamily:
        Fonts.bold,

      color:
        Colors.text,
    },

    departmentId: {
      marginTop: 3,

      fontSize: 11,

      fontFamily:
        Fonts.medium,

      color:
        Colors.textSecondary,
    },

    statusRow: {
      marginTop: 7,

      flexDirection: 'row',
      alignItems: 'center',
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
      fontSize: 10,

      fontFamily:
        Fonts.semiBold,
    },

    activeText: {
      color:
        Colors.primary,
    },

    inactiveText: {
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

    emptyContainer: {
      paddingVertical: 70,

      alignItems: 'center',
    },

    emptyIcon: {
      width: 70,
      height: 70,

      borderRadius: 22,

      alignItems: 'center',
      justifyContent: 'center',

      backgroundColor:
        Colors.surface,
    },

    emptyTitle: {
      marginTop: 15,

      fontSize: 16,

      fontFamily:
        Fonts.bold,

      color:
        Colors.text,
    },

    emptyText: {
      marginTop: 5,

      fontSize: 12,

      fontFamily:
        Fonts.regular,

      color:
        Colors.textSecondary,
    },

  });
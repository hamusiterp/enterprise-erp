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
  Designation,
  designationsApi,
} from '../../../../api/designationsApi';


type StatusFilter =
  | 'all'
  | 'active'
  | 'inactive';


export default function DesignationsScreen() {

  const [
    designations,
    setDesignations,
  ] = useState<Designation[]>([]);

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

  const [
    total,
    setTotal,
  ] = useState(0);


  /*
  |--------------------------------------------------------------------------
  | Load
  |--------------------------------------------------------------------------
  */

  const loadDesignations =
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
            sort_by: 'name',
            sort_order: 'asc',
          };


          if (search.trim()) {
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


          const result =
            await designationsApi.list(
              params
            );


          setDesignations(
            result.data
          );

          setTotal(
            result.pagination.total
          );

        } catch (error: any) {

          console.log(
            'Designations load error:',
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


  useFocusEffect(
    useCallback(() => {

      loadDesignations();

    }, [
      loadDesignations,
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
            Designations
          </Text>

          <Text
            style={
              styles.subtitle
            }
          >
            Positions & job titles
          </Text>

        </View>


        <Pressable
          style={
            styles.addButton
          }
          onPress={() =>
            router.push(
              '/(app)/administration/designations/create'
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


      {/* SUMMARY */}

      <View
        style={
          styles.summaryCard
        }
      >

        <View
          style={
            styles.summaryIcon
          }
        >

          <Ionicons
            name="ribbon-outline"
            size={26}
            color={
              Colors.primary
            }
          />

        </View>


        <View
          style={
            styles.summaryContent
          }
        >

          <Text
            style={
              styles.summaryNumber
            }
          >
            {total}
          </Text>

          <Text
            style={
              styles.summaryLabel
            }
          >
            Total designations
          </Text>

        </View>

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

          placeholder="Search designation..."

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


      {/* FILTER */}

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


      {/* CONTENT */}

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
            Loading designations...
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
                loadDesignations(
                  true
                )
              }

              tintColor={
                Colors.primary
              }
            />

          }
        >

          {designations.length ===
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
                  name="ribbon-outline"
                  size={36}
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
                No designations found
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

            designations.map(
              (designation) => (

                <Pressable
                  key={
                    designation.id
                  }

                  onPress={() =>
                    router.push(
                      `/(app)/administration/designations/${designation.id}` as any
                    )
                  }

                  style={({
                    pressed,
                  }) => [
                    styles.card,

                    pressed &&
                      styles.cardPressed,
                  ]}
                >

                  {/* ICON */}

                  <View
                    style={
                      styles.designationIcon
                    }
                  >

                    <Ionicons
                      name="ribbon-outline"
                      size={23}
                      color={
                        Colors.primary
                      }
                    />

                  </View>


                  {/* CONTENT */}

                  <View
                    style={
                      styles.cardContent
                    }
                  >

                    <Text
                      style={
                        styles.designationName
                      }
                      numberOfLines={1}
                    >
                      {
                        designation.name
                      }
                    </Text>


                    <Text
                      style={
                        styles.code
                      }
                    >
                      {
                        designation.code
                      }
                    </Text>


                    {designation.department
                      ?.department_name && (

                      <View
                        style={
                          styles.departmentRow
                        }
                      >

                        <Ionicons
                          name="business-outline"
                          size={12}
                          color={
                            Colors.textSecondary
                          }
                        />

                        <Text
                          style={
                            styles.departmentName
                          }
                          numberOfLines={1}
                        >
                          {
                            designation
                              .department
                              .department_name
                          }
                        </Text>

                      </View>

                    )}


                    <View
                      style={
                        styles.bottomRow
                      }
                    >

                      <View
                        style={
                          styles.statusRow
                        }
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
                          {
                            designation.status ===
                            'active'
                              ? 'Active'
                              : 'Inactive'
                          }
                        </Text>

                      </View>


                      {designation.level !=
                        null && (

                        <View
                          style={
                            styles.levelBadge
                          }
                        >

                          <Text
                            style={
                              styles.levelText
                            }
                          >
                            Level {
                              designation.level
                            }
                          </Text>

                        </View>

                      )}

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

    summaryCard: {
      marginHorizontal: 20,
      marginBottom: 14,

      padding: 16,

      flexDirection: 'row',
      alignItems: 'center',

      borderRadius: 19,

      backgroundColor:
        Colors.surface,

      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    summaryIcon: {
      width: 52,
      height: 52,

      borderRadius: 17,

      alignItems: 'center',
      justifyContent: 'center',

      backgroundColor:
        Colors.primaryLight,
    },

    summaryContent: {
      marginLeft: 14,
    },

    summaryNumber: {
      fontSize: 21,

      fontFamily:
        Fonts.extraBold,

      color:
        Colors.text,
    },

    summaryLabel: {
      marginTop: 2,

      fontSize: 11,

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

    card: {
      minHeight: 115,

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

    designationIcon: {
      width: 50,
      height: 50,

      borderRadius: 16,

      alignItems: 'center',
      justifyContent: 'center',

      backgroundColor:
        Colors.primaryLight,
    },

    cardContent: {
      flex: 1,

      marginLeft: 13,
    },

    designationName: {
      fontSize: 14,

      fontFamily:
        Fonts.bold,

      color:
        Colors.text,
    },

    code: {
      marginTop: 3,

      fontSize: 10,

      fontFamily:
        Fonts.medium,

      color:
        Colors.textMuted,
    },

    departmentRow: {
      marginTop: 7,

      flexDirection: 'row',
      alignItems: 'center',
    },

    departmentName: {
      flex: 1,

      marginLeft: 5,

      fontSize: 10,

      fontFamily:
        Fonts.medium,

      color:
        Colors.textSecondary,
    },

    bottomRow: {
      marginTop: 8,

      flexDirection: 'row',
      alignItems: 'center',
    },

    statusRow: {
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

    levelBadge: {
      marginLeft: 10,

      paddingHorizontal: 8,
      paddingVertical: 3,

      borderRadius: 10,

      backgroundColor:
        Colors.primaryLight,
    },

    levelText: {
      fontSize: 9,

      fontFamily:
        Fonts.semiBold,

      color:
        Colors.primary,
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
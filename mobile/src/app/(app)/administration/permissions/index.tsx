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

import { Ionicons } from '@expo/vector-icons';

import {
  router,
  useFocusEffect,
} from 'expo-router';

import {
  useCallback,
  useMemo,
  useState,
} from 'react';

import {
  Colors,
} from '../../../../constants/colors';

import {
  Fonts,
} from '../../../../constants/fonts';

import {
  PermissionGroup,
  rolesApi,
} from '../../../../api/rolesApi';


export default function PermissionsScreen() {

  const [
    groups,
    setGroups,
  ] = useState<PermissionGroup[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

  const [
    search,
    setSearch,
  ] = useState('');

  const [
    expanded,
    setExpanded,
  ] = useState<string[]>([]);


  /*
  |--------------------------------------------------------------------------
  | Load Permissions
  |--------------------------------------------------------------------------
  */

  const loadPermissions =
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

          const data =
            await rolesApi
              .permissions();

          setGroups(data);

          /*
           * Expand all groups initially.
           */
          setExpanded(
            data.map(
              (group) =>
                group.module
            )
          );

        } catch (error) {

          console.log(
            'Permissions load error:',
            error
          );

        } finally {

          setLoading(false);
          setRefreshing(false);

        }

      },
      []
    );


  useFocusEffect(
    useCallback(() => {

      loadPermissions();

    }, [
      loadPermissions,
    ])
  );


  /*
  |--------------------------------------------------------------------------
  | Total Permission Count
  |--------------------------------------------------------------------------
  */

  const totalPermissions =
    useMemo(
      () =>
        groups.reduce(
          (
            total,
            group
          ) =>
            total +
            group.permissions.length,
          0
        ),
      [groups]
    );


  /*
  |--------------------------------------------------------------------------
  | Search
  |--------------------------------------------------------------------------
  */

  const filteredGroups =
    useMemo(() => {

      const value =
        search
          .trim()
          .toLowerCase();

      if (!value) {
        return groups;
      }

      return groups
        .map((group) => {

          const permissions =
            group.permissions.filter(
              (permission) =>

                permission.name
                  .toLowerCase()
                  .includes(value) ||

                permission.label
                  .toLowerCase()
                  .includes(value) ||

                group.label
                  .toLowerCase()
                  .includes(value)

            );

          return {
            ...group,
            permissions,
          };

        })
        .filter(
          (group) =>
            group.permissions.length > 0
        );

    }, [
      groups,
      search,
    ]);


  /*
  |--------------------------------------------------------------------------
  | Toggle Group
  |--------------------------------------------------------------------------
  */

  const toggleGroup = (
    module: string
  ) => {

    setExpanded(
      (current) => {

        if (
          current.includes(
            module
          )
        ) {

          return current.filter(
            (item) =>
              item !== module
          );

        }

        return [
          ...current,
          module,
        ];

      }
    );

  };


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
            Permissions
          </Text>

          <Text
            style={
              styles.subtitle
            }
          >
            {totalPermissions}
            {' '}system permissions
          </Text>

        </View>


        <View
          style={
            styles.headerIcon
          }
        >

          <Ionicons
            name="key-outline"
            size={21}
            color={
              Colors.primary
            }
          />

        </View>

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
            name="shield-checkmark-outline"
            size={27}
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
            {totalPermissions}
          </Text>

          <Text
            style={
              styles.summaryLabel
            }
          >
            Permissions across
            {' '}
            {groups.length}
            {' '}
            modules
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
          placeholder="Search permissions..."
          placeholderTextColor={
            Colors.textMuted
          }
          autoCapitalize="none"
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
            Loading permissions...
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
          refreshControl={

            <RefreshControl
              refreshing={
                refreshing
              }
              onRefresh={() =>
                loadPermissions(
                  true
                )
              }
              tintColor={
                Colors.primary
              }
            />

          }
        >

          {filteredGroups.length ===
          0 ? (

            <View
              style={
                styles.emptyContainer
              }
            >

              <Ionicons
                name="search-outline"
                size={38}
                color={
                  Colors.textMuted
                }
              />

              <Text
                style={
                  styles.emptyTitle
                }
              >
                No permissions found
              </Text>

              <Text
                style={
                  styles.emptyText
                }
              >
                Try another search.
              </Text>

            </View>

          ) : (

            filteredGroups.map(
              (group) => {

                /*
                 * Always expand matching
                 * search results.
                 */
                const isExpanded =
                  search.length > 0 ||
                  expanded.includes(
                    group.module
                  );

                return (

                  <View
                    key={
                      group.module
                    }
                    style={
                      styles.groupCard
                    }
                  >

                    {/* GROUP HEADER */}

                    <Pressable
                      style={
                        styles.groupHeader
                      }
                      onPress={() =>
                        toggleGroup(
                          group.module
                        )
                      }
                    >

                      <View
                        style={
                          styles.groupIcon
                        }
                      >

                        <Ionicons
                          name="folder-open-outline"
                          size={20}
                          color={
                            Colors.primary
                          }
                        />

                      </View>


                      <View
                        style={
                          styles.groupContent
                        }
                      >

                        <Text
                          style={
                            styles.groupTitle
                          }
                        >
                          {group.label}
                        </Text>

                        <Text
                          style={
                            styles.groupSubtitle
                          }
                        >
                          {
                            group
                              .permissions
                              .length
                          }
                          {' '}
                          permissions
                        </Text>

                      </View>


                      <Ionicons
                        name={
                          isExpanded
                            ? 'chevron-up'
                            : 'chevron-down'
                        }
                        size={19}
                        color={
                          Colors.textMuted
                        }
                      />

                    </Pressable>


                    {/* PERMISSIONS */}

                    {isExpanded && (

                      <View
                        style={
                          styles.permissionsContainer
                        }
                      >

                        {group.permissions.map(
                          (
                            permission
                          ) => (

                            <View
                              key={
                                permission.id
                              }
                              style={
                                styles.permissionRow
                              }
                            >

                              <View
                                style={
                                  styles.permissionCheck
                                }
                              >

                                <Ionicons
                                  name="checkmark"
                                  size={15}
                                  color={
                                    Colors.primary
                                  }
                                />

                              </View>


                              <View
                                style={
                                  styles.permissionContent
                                }
                              >

                                <Text
                                  style={
                                    styles.permissionLabel
                                  }
                                >
                                  {
                                    permission.label
                                  }
                                </Text>

                                <Text
                                  style={
                                    styles.permissionName
                                  }
                                >
                                  {
                                    permission.name
                                  }
                                </Text>

                              </View>

                            </View>

                          )
                        )}

                      </View>

                    )}

                  </View>

                );

              }
            )

          )}

        </ScrollView>

      )}

    </SafeAreaView>
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

    headerIcon: {
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
      marginBottom: 15,

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

    listContent: {
      paddingHorizontal: 20,

      paddingBottom: 45,
    },

    groupCard: {
      marginBottom: 13,

      overflow: 'hidden',

      borderRadius: 19,

      backgroundColor:
        Colors.surface,

      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    groupHeader: {
      minHeight: 70,

      paddingHorizontal: 14,

      flexDirection: 'row',
      alignItems: 'center',

      backgroundColor:
        Colors.surface,
    },

    groupIcon: {
      width: 42,
      height: 42,

      borderRadius: 13,

      alignItems: 'center',
      justifyContent: 'center',

      backgroundColor:
        Colors.primaryLight,
    },

    groupContent: {
      flex: 1,

      marginLeft: 12,
    },

    groupTitle: {
      fontSize: 14,

      fontFamily:
        Fonts.bold,

      color:
        Colors.text,
    },

    groupSubtitle: {
      marginTop: 3,

      fontSize: 11,

      fontFamily:
        Fonts.regular,

      color:
        Colors.textSecondary,
    },

    permissionsContainer: {
      borderTopWidth: 1,

      borderTopColor:
        Colors.border,
    },

    permissionRow: {
      minHeight: 62,

      paddingHorizontal: 15,
      paddingVertical: 10,

      flexDirection: 'row',
      alignItems: 'center',

      borderBottomWidth: 1,

      borderBottomColor:
        Colors.border,
    },

    permissionCheck: {
      width: 29,
      height: 29,

      borderRadius: 10,

      alignItems: 'center',
      justifyContent: 'center',

      backgroundColor:
        Colors.primaryLight,
    },

    permissionContent: {
      flex: 1,

      marginLeft: 11,
    },

    permissionLabel: {
      fontSize: 13,

      fontFamily:
        Fonts.semiBold,

      color:
        Colors.text,
    },

    permissionName: {
      marginTop: 2,

      fontSize: 10,

      fontFamily:
        Fonts.regular,

      color:
        Colors.textMuted,
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

    emptyTitle: {
      marginTop: 12,

      fontSize: 16,

      fontFamily:
        Fonts.bold,

      color:
        Colors.text,
    },

    emptyText: {
      marginTop: 4,

      fontSize: 12,

      fontFamily:
        Fonts.regular,

      color:
        Colors.textSecondary,
    },

  });
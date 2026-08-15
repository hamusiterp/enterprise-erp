import {
  ActivityIndicator,
  Alert,
  Pressable,
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
  useLocalSearchParams,
} from 'expo-router';

import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  Colors,
} from '../../../../../constants/colors';

import {
  Fonts,
} from '../../../../../constants/fonts';

import {
  PermissionGroup,
  Role,
  rolesApi,
} from '../../../../../api/rolesApi';


export default function EditRoleScreen() {
  const params =
    useLocalSearchParams();

  const roleId =
    Number(params.id);

  const [
    role,
    setRole,
  ] = useState<Role | null>(null);

  const [
    name,
    setName,
  ] = useState('');

  const [
    groups,
    setGroups,
  ] = useState<PermissionGroup[]>([]);

  const [
    selected,
    setSelected,
  ] = useState<string[]>([]);

  const [
    search,
    setSearch,
  ] = useState('');

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    saving,
    setSaving,
  ] = useState(false);


  /*
  |--------------------------------------------------------------------------
  | Load Role + Permissions
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    loadData();
  }, []);


  const loadData = async () => {
    try {
      setLoading(true);

      const [
        roleData,
        permissionGroups,
      ] = await Promise.all([
        rolesApi.get(roleId),
        rolesApi.permissions(),
      ]);

      setRole(roleData);

      setName(
        roleData.name ?? ''
      );

      setSelected(
        roleData.permissions ?? []
      );

      setGroups(
        permissionGroups
      );

    } catch (error) {
      console.log(
        'Role edit load error:',
        error
      );

      Alert.alert(
        'Unable to load role',
        'Role information could not be loaded.'
      );

    } finally {
      setLoading(false);
    }
  };


  /*
  |--------------------------------------------------------------------------
  | Filter Permissions
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
        .map((group) => ({
          ...group,

          permissions:
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
            ),
        }))
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
  | Is System Role
  |--------------------------------------------------------------------------
  */

  const isSystemRole =
    role?.is_system === true ||
    role?.name === 'Administrator';


  /*
  |--------------------------------------------------------------------------
  | Toggle One Permission
  |--------------------------------------------------------------------------
  */

  const togglePermission = (
    permissionName: string
  ) => {
    if (isSystemRole) {
      return;
    }

    setSelected(
      (current) => {
        if (
          current.includes(
            permissionName
          )
        ) {
          return current.filter(
            (item) =>
              item !==
              permissionName
          );
        }

        return [
          ...current,
          permissionName,
        ];
      }
    );
  };


  /*
  |--------------------------------------------------------------------------
  | Toggle Permission Group
  |--------------------------------------------------------------------------
  */

  const toggleGroup = (
    group: PermissionGroup
  ) => {
    if (isSystemRole) {
      return;
    }

    const names =
      group.permissions.map(
        (permission) =>
          permission.name
      );

    const allSelected =
      names.every(
        (permissionName) =>
          selected.includes(
            permissionName
          )
      );

    if (allSelected) {
      setSelected(
        (current) =>
          current.filter(
            (item) =>
              !names.includes(item)
          )
      );

      return;
    }

    setSelected(
      (current) =>
        Array.from(
          new Set([
            ...current,
            ...names,
          ])
        )
    );
  };


  /*
  |--------------------------------------------------------------------------
  | Select All
  |--------------------------------------------------------------------------
  */

  const selectAll = () => {
    if (isSystemRole) {
      return;
    }

    const allPermissions =
      groups.flatMap(
        (group) =>
          group.permissions.map(
            (permission) =>
              permission.name
          )
      );

    setSelected(
      allPermissions
    );
  };


  /*
  |--------------------------------------------------------------------------
  | Clear All
  |--------------------------------------------------------------------------
  */

  const clearAll = () => {
    if (isSystemRole) {
      return;
    }

    setSelected([]);
  };


  /*
  |--------------------------------------------------------------------------
  | Save Role
  |--------------------------------------------------------------------------
  */

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert(
        'Role name required',
        'Please enter the role name.'
      );

      return;
    }

    if (
      !isSystemRole &&
      selected.length === 0
    ) {
      Alert.alert(
        'Permissions required',
        'Select at least one permission.'
      );

      return;
    }

    try {
      setSaving(true);

      await rolesApi.update(
        roleId,
        {
          name:
            name.trim(),

          permissions:
            selected,
        }
      );

      Alert.alert(
        'Role updated',
        isSystemRole
          ? 'Administrator role retains all permissions.'
          : 'The role has been updated successfully.',
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
        'Role update error:',
        error?.response?.data ??
        error
      );

      const errors =
        error?.response
          ?.data?.errors;

      let message =
        error?.response
          ?.data?.message ||
        'Unable to update role.';

      if (errors) {
        const first =
          Object.values(errors)
            .flat()
            .find(Boolean);

        if (
          typeof first ===
          'string'
        ) {
          message = first;
        }
      }

      Alert.alert(
        'Update failed',
        message
      );

    } finally {
      setSaving(false);
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
            Loading role...
          </Text>
        </View>
      </SafeAreaView>
    );
  }


  /*
  |--------------------------------------------------------------------------
  | Role Not Found
  |--------------------------------------------------------------------------
  */

  if (!role) {
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
            name="shield-outline"
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
            Role not found
          </Text>

          <Pressable
            style={
              styles.backToRolesButton
            }
            onPress={() =>
              router.back()
            }
          >
            <Text
              style={
                styles.backToRolesText
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
      style={
        styles.safeArea
      }
    >
      <ScrollView
        contentContainerStyle={
          styles.container
        }

        keyboardShouldPersistTaps="handled"

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
              Edit Role
            </Text>

            <Text
              style={
                styles.subtitle
              }
            >
              Update role access
            </Text>
          </View>
        </View>


        {/* ROLE INFORMATION */}

        <Text
          style={
            styles.sectionTitle
          }
        >
          Role Information
        </Text>

        <View
          style={
            styles.formCard
          }
        >
          <Text
            style={
              styles.label
            }
          >
            Role Name
          </Text>

          <View
            style={
              styles.inputBox
            }
          >
            <Ionicons
              name="shield-outline"
              size={19}
              color={
                Colors.textSecondary
              }
            />

            <TextInput
              value={name}
              onChangeText={
                setName
              }
              editable={
                !isSystemRole
              }
              placeholder="Role name"
              placeholderTextColor={
                Colors.textMuted
              }
              style={[
                styles.input,

                isSystemRole &&
                  styles.disabledInput,
              ]}
            />
          </View>

          {isSystemRole && (
            <View
              style={
                styles.systemNotice
              }
            >
              <Ionicons
                name="information-circle-outline"
                size={19}
                color={
                  Colors.primary
                }
              />

              <Text
                style={
                  styles.systemNoticeText
                }
              >
                Administrator is a system role and always retains all permissions.
              </Text>
            </View>
          )}
        </View>


        {/* PERMISSIONS HEADER */}

        <View
          style={
            styles.permissionHeader
          }
        >
          <View>
            <Text
              style={
                styles.sectionTitleInline
              }
            >
              Permissions
            </Text>

            <Text
              style={
                styles.permissionCount
              }
            >
              {selected.length}
              {' '}selected
            </Text>
          </View>


          {!isSystemRole && (
            <View
              style={
                styles.headerActions
              }
            >
              <Pressable
                onPress={
                  selectAll
                }
              >
                <Text
                  style={
                    styles.actionText
                  }
                >
                  Select All
                </Text>
              </Pressable>

              <Pressable
                onPress={
                  clearAll
                }
              >
                <Text
                  style={[
                    styles.actionText,
                    styles.clearText,
                  ]}
                >
                  Clear
                </Text>
              </Pressable>
            </View>
          )}
        </View>


        {/* SEARCH */}

        <View
          style={
            styles.searchBox
          }
        >
          <Ionicons
            name="search-outline"
            size={19}
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
                size={19}
                color={
                  Colors.textMuted
                }
              />
            </Pressable>
          )}
        </View>


        {/* PERMISSION GROUPS */}

        {filteredGroups.map(
          (group) => {
            const selectedCount =
              group.permissions
                .filter(
                  (permission) =>
                    selected.includes(
                      permission.name
                    )
                )
                .length;

            const allSelected =
              group.permissions.length > 0 &&
              group.permissions.every(
                (permission) =>
                  selected.includes(
                    permission.name
                  )
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

                <Pressable
                  style={
                    styles.groupHeader
                  }
                  disabled={
                    isSystemRole
                  }
                  onPress={() =>
                    toggleGroup(
                      group
                    )
                  }
                >
                  <View>
                    <Text
                      style={
                        styles.groupTitle
                      }
                    >
                      {group.label}
                    </Text>

                    <Text
                      style={
                        styles.groupCount
                      }
                    >
                      {selectedCount}
                      /
                      {
                        group
                          .permissions
                          .length
                      }
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.checkbox,

                      allSelected &&
                        styles.checkboxSelected,

                      isSystemRole &&
                        styles.systemCheckbox,
                    ]}
                  >
                    {allSelected && (
                      <Ionicons
                        name="checkmark"
                        size={16}
                        color={
                          Colors.white
                        }
                      />
                    )}
                  </View>
                </Pressable>


                {group.permissions.map(
                  (permission) => {
                    const isSelected =
                      selected.includes(
                        permission.name
                      );

                    return (
                      <Pressable
                        key={
                          permission.name
                        }
                        style={
                          styles.permissionRow
                        }
                        disabled={
                          isSystemRole
                        }
                        onPress={() =>
                          togglePermission(
                            permission.name
                          )
                        }
                      >
                        <View
                          style={[
                            styles.checkbox,

                            isSelected &&
                              styles.checkboxSelected,

                            isSystemRole &&
                              styles.systemCheckbox,
                          ]}
                        >
                          {isSelected && (
                            <Ionicons
                              name="checkmark"
                              size={16}
                              color={
                                Colors.white
                              }
                            />
                          )}
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
                            {permission.label}
                          </Text>

                          <Text
                            style={
                              styles.permissionCode
                            }
                          >
                            {permission.name}
                          </Text>
                        </View>
                      </Pressable>
                    );
                  }
                )}
              </View>
            );
          }
        )}


        {/* SAVE */}

        <Pressable
          disabled={saving}
          onPress={
            handleSave
          }
          style={[
            styles.saveButton,

            saving &&
              styles.disabled,
          ]}
        >
          {saving ? (
            <ActivityIndicator
              color={
                Colors.white
              }
            />
          ) : (
            <>
              <Ionicons
                name="save-outline"
                size={20}
                color={
                  Colors.white
                }
              />

              <Text
                style={
                  styles.saveText
                }
              >
                Save Changes
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
      paddingBottom: 45,
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

    sectionTitle: {
      marginTop: 26,
      marginBottom: 12,

      fontSize: 17,

      fontFamily:
        Fonts.extraBold,

      color:
        Colors.text,
    },

    formCard: {
      padding: 17,

      borderRadius: 20,

      backgroundColor:
        Colors.surface,

      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    label: {
      marginBottom: 8,

      fontSize: 12,

      fontFamily:
        Fonts.semiBold,

      color:
        Colors.text,
    },

    inputBox: {
      height: 54,

      paddingHorizontal: 14,

      flexDirection: 'row',
      alignItems: 'center',

      borderRadius: 15,

      backgroundColor:
        Colors.background,

      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    input: {
      flex: 1,
      height: '100%',

      marginLeft: 10,

      fontSize: 14,

      fontFamily:
        Fonts.regular,

      color:
        Colors.text,
    },

    disabledInput: {
      color:
        Colors.textSecondary,
    },

    systemNotice: {
      marginTop: 14,

      padding: 13,

      borderRadius: 14,

      flexDirection: 'row',
      alignItems: 'flex-start',

      backgroundColor:
        Colors.primaryLight,
    },

    systemNoticeText: {
      flex: 1,

      marginLeft: 9,

      fontSize: 11,

      lineHeight: 17,

      fontFamily:
        Fonts.regular,

      color:
        Colors.textSecondary,
    },

    permissionHeader: {
      marginTop: 27,
      marginBottom: 12,

      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'space-between',
    },

    sectionTitleInline: {
      fontSize: 17,

      fontFamily:
        Fonts.extraBold,

      color:
        Colors.text,
    },

    permissionCount: {
      marginTop: 2,

      fontSize: 11,

      fontFamily:
        Fonts.regular,

      color:
        Colors.textSecondary,
    },

    headerActions: {
      flexDirection: 'row',
      gap: 14,
    },

    actionText: {
      fontSize: 12,

      fontFamily:
        Fonts.bold,

      color:
        Colors.primary,
    },

    clearText: {
      color:
        Colors.danger,
    },

    searchBox: {
      height: 50,

      marginBottom: 12,

      paddingHorizontal: 14,

      flexDirection: 'row',
      alignItems: 'center',

      borderRadius: 15,

      backgroundColor:
        Colors.surface,

      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    searchInput: {
      flex: 1,
      height: '100%',

      marginLeft: 9,

      fontSize: 13,

      fontFamily:
        Fonts.regular,

      color:
        Colors.text,
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
      minHeight: 60,

      paddingHorizontal: 15,

      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'space-between',

      backgroundColor:
        Colors.primaryLight,
    },

    groupTitle: {
      fontSize: 14,

      fontFamily:
        Fonts.bold,

      color:
        Colors.text,
    },

    groupCount: {
      marginTop: 2,

      fontSize: 10,

      fontFamily:
        Fonts.regular,

      color:
        Colors.textSecondary,
    },

    permissionRow: {
      minHeight: 61,

      paddingHorizontal: 15,

      flexDirection: 'row',
      alignItems: 'center',

      borderTopWidth: 1,
      borderTopColor:
        Colors.border,
    },

    checkbox: {
      width: 24,
      height: 24,

      borderRadius: 8,

      borderWidth: 1.5,
      borderColor:
        Colors.border,

      alignItems: 'center',
      justifyContent: 'center',
    },

    checkboxSelected: {
      borderColor:
        Colors.primary,

      backgroundColor:
        Colors.primary,
    },

    systemCheckbox: {
      opacity: 0.75,
    },

    permissionContent: {
      flex: 1,

      marginLeft: 12,
    },

    permissionLabel: {
      fontSize: 13,

      fontFamily:
        Fonts.semiBold,

      color:
        Colors.text,
    },

    permissionCode: {
      marginTop: 2,

      fontSize: 10,

      fontFamily:
        Fonts.regular,

      color:
        Colors.textMuted,
    },

    saveButton: {
      height: 56,

      marginTop: 12,

      borderRadius: 16,

      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',

      gap: 9,

      backgroundColor:
        Colors.primary,
    },

    saveText: {
      fontSize: 14,

      fontFamily:
        Fonts.bold,

      color:
        Colors.white,
    },

    disabled: {
      opacity: 0.7,
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
      marginTop: 12,

      fontSize: 18,

      fontFamily:
        Fonts.bold,

      color:
        Colors.text,
    },

    backToRolesButton: {
      marginTop: 20,

      paddingHorizontal: 22,
      paddingVertical: 12,

      borderRadius: 14,

      backgroundColor:
        Colors.primary,
    },

    backToRolesText: {
      fontFamily:
        Fonts.bold,

      color:
        Colors.white,
    },

  });
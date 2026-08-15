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

import {
  Ionicons,
} from '@expo/vector-icons';

import {
  router,
} from 'expo-router';

import {
  useEffect,
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


export default function CreateRoleScreen() {

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


  useEffect(() => {
    loadPermissions();
  }, []);


  const loadPermissions =
    async () => {

      try {
        setLoading(true);

        const data =
          await rolesApi
            .permissions();

        setGroups(data);

      } catch (error) {

        console.log(
          'Permission load error:',
          error
        );

        Alert.alert(
          'Unable to load permissions',
          'Permissions could not be loaded.'
        );

      } finally {
        setLoading(false);
      }

    };


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


  const togglePermission = (
    permission: string
  ) => {

    setSelected(
      (current) => {

        if (
          current.includes(
            permission
          )
        ) {
          return current.filter(
            (item) =>
              item !== permission
          );
        }

        return [
          ...current,
          permission,
        ];
      }
    );

  };


  const toggleGroup = (
    group: PermissionGroup
  ) => {

    const names =
      group.permissions.map(
        (permission) =>
          permission.name
      );

    const allSelected =
      names.every(
        (name) =>
          selected.includes(name)
      );

    if (allSelected) {

      setSelected(
        (current) =>
          current.filter(
            (item) =>
              !names.includes(item)
          )
      );

    } else {

      setSelected(
        (current) =>
          Array.from(
            new Set([
              ...current,
              ...names,
            ])
          )
      );

    }

  };


  const selectAll = () => {

    const all =
      groups.flatMap(
        (group) =>
          group.permissions.map(
            (permission) =>
              permission.name
          )
      );

    setSelected(all);

  };


  const handleCreate =
    async () => {

      if (!name.trim()) {

        Alert.alert(
          'Role name required',
          'Please enter a role name.'
        );

        return;
      }


      if (
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

        await rolesApi.create({
          name: name.trim(),
          permissions:
            selected,
        });


        Alert.alert(
          'Role created',
          'The role has been created successfully.',
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
          'Role create error:',
          error?.response?.data ??
          error
        );

        const errors =
          error?.response
            ?.data?.errors;

        let message =
          error?.response
            ?.data?.message ||
          'Unable to create role.';

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
          'Create failed',
          message
        );

      } finally {

        setSaving(false);

      }

    };


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
          style={styles.header}
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
              style={styles.title}
            >
              Create Role
            </Text>

            <Text
              style={
                styles.subtitle
              }
            >
              Configure access permissions
            </Text>

          </View>

        </View>


        {/* ROLE NAME */}

        <Text
          style={
            styles.sectionTitle
          }
        >
          Role Information
        </Text>


        <View
          style={styles.formCard}
        >

          <Text
            style={styles.label}
          >
            Role Name
          </Text>

          <View
            style={styles.inputBox}
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
              onChangeText={setName}
              placeholder="e.g. Project Manager"
              placeholderTextColor={
                Colors.textMuted
              }
              style={styles.input}
            />

          </View>

        </View>


        {/* PERMISSIONS */}

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


          <View
            style={
              styles.headerActions
            }
          >

            <Pressable
              onPress={selectAll}
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
              onPress={() =>
                setSelected([])
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

        </View>


        <View
          style={styles.searchBox}
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
            onChangeText={setSearch}
            placeholder="Search permissions..."
            placeholderTextColor={
              Colors.textMuted
            }
            style={
              styles.searchInput
            }
          />

        </View>


        {loading ? (

          <ActivityIndicator
            size="large"
            color={Colors.primary}
            style={{
              marginTop: 30,
            }}
          />

        ) : (

          filteredGroups.map(
            (group) => {

              const allSelected =
                group.permissions
                  .every(
                    (permission) =>
                      selected.includes(
                        permission.name
                      )
                  );

              return (

                <View
                  key={group.module}
                  style={
                    styles.groupCard
                  }
                >

                  <Pressable
                    style={
                      styles.groupHeader
                    }
                    onPress={() =>
                      toggleGroup(group)
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
                        {
                          group.permissions
                            .filter(
                              (permission) =>
                                selected.includes(
                                  permission.name
                                )
                            )
                            .length
                        }
                        /
                        {
                          group.permissions
                            .length
                        }
                      </Text>

                    </View>


                    <View
                      style={[
                        styles.checkbox,

                        allSelected &&
                          styles.checkboxSelected,
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
          )

        )}


        {/* SAVE */}

        <Pressable
          disabled={saving}
          onPress={
            handleCreate
          }
          style={[
            styles.saveButton,

            saving &&
              styles.disabled,
          ]}
        >

          {saving ? (

            <ActivityIndicator
              color={Colors.white}
            />

          ) : (

            <>
              <Ionicons
                name="shield-checkmark-outline"
                size={20}
                color={Colors.white}
              />

              <Text
                style={
                  styles.saveText
                }
              >
                Create Role
              </Text>
            </>

          )}

        </Pressable>

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
      color: Colors.text,
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

      color: Colors.text,
    },

    formCard: {
      padding: 17,

      backgroundColor:
        Colors.surface,

      borderRadius: 20,

      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    label: {
      marginBottom: 8,

      fontSize: 12,
      fontFamily:
        Fonts.semiBold,

      color: Colors.text,
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

      color: Colors.text,
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

      color: Colors.text,
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
      color: Colors.primary,

      fontSize: 12,
      fontFamily:
        Fonts.bold,
    },

    clearText: {
      color: Colors.danger,
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

      fontFamily:
        Fonts.regular,

      color: Colors.text,
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

      color: Colors.text,
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

    permissionContent: {
      flex: 1,
      marginLeft: 12,
    },

    permissionLabel: {
      fontSize: 13,
      fontFamily:
        Fonts.semiBold,

      color: Colors.text,
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
      color: Colors.white,

      fontSize: 14,
      fontFamily:
        Fonts.bold,
    },

    disabled: {
      opacity: 0.7,
    },

  });
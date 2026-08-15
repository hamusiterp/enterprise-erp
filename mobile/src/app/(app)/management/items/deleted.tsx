import {
  ActivityIndicator,
  Alert,
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
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import { Colors } from '../../../../constants/colors';
import { Fonts } from '../../../../constants/fonts';

import {
  Item,
  itemsApi,
} from '../../../../api/itemsApi';


export default function DeletedItemsScreen() {

  const [items, setItems] =
    useState<Item[]>([]);

  const [search, setSearch] =
    useState('');

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [
    actionItemId,
    setActionItemId,
  ] =
    useState<number | null>(
      null
    );


  /*
  |--------------------------------------------------------------------------
  | Load Deleted Items
  |--------------------------------------------------------------------------
  */

  const loadItems =
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


          const result =
            await itemsApi.deleted({
              search:
                search.trim() ||
                undefined,

              page: 1,

              per_page: 100,
            });


          setItems(
            result.data ?? []
          );

        } catch (error: any) {

          console.log(
            'DELETED ITEMS ERROR:',
            error?.response?.data ??
            error
          );


          Alert.alert(
            'Unable to Load',
            getApiErrorMessage(
              error,
              'Unable to load deleted items.'
            )
          );

        } finally {

          setLoading(false);
          setRefreshing(false);

        }

      },
      [search]
    );


  /*
  |--------------------------------------------------------------------------
  | Reload on Focus
  |--------------------------------------------------------------------------
  */

  useFocusEffect(
    useCallback(() => {

      loadItems();

    }, [loadItems])
  );


  /*
  |--------------------------------------------------------------------------
  | Restore
  |--------------------------------------------------------------------------
  */

  const confirmRestore =
    (item: Item) => {

      Alert.alert(
        'Restore Item',
        `Restore ${item.item_description}?`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },

          {
            text: 'Restore',

            onPress: () =>
              restoreItem(item),
          },
        ]
      );

    };


  const restoreItem =
    async (
      item: Item
    ) => {

      try {

        setActionItemId(
          item.id
        );


        await itemsApi.restore(
          item.id
        );


        setItems(
          current =>
            current.filter(
              value =>
                value.id !==
                item.id
            )
        );


        Alert.alert(
          'Item Restored',
          `${item.item_no} has been restored successfully.`
        );

      } catch (error: any) {

        console.log(
          'RESTORE ITEM ERROR:',
          error?.response?.data ??
          error
        );


        Alert.alert(
          'Restore Failed',
          getApiErrorMessage(
            error,
            'Unable to restore the item.'
          )
        );

      } finally {

        setActionItemId(
          null
        );

      }

    };


  /*
  |--------------------------------------------------------------------------
  | Permanent Delete
  |--------------------------------------------------------------------------
  */

  const confirmPermanentDelete =
    (item: Item) => {

      Alert.alert(
        'Delete Permanently',
        `Permanently delete ${item.item_description}?\n\nThis action cannot be undone.`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },

          {
            text:
              'Delete Permanently',

            style:
              'destructive',

            onPress: () =>
              permanentlyDeleteItem(
                item
              ),
          },
        ]
      );

    };


  const permanentlyDeleteItem =
    async (
      item: Item
    ) => {

      try {

        setActionItemId(
          item.id
        );


        await itemsApi.forceDelete(
          item.id
        );


        setItems(
          current =>
            current.filter(
              value =>
                value.id !==
                item.id
            )
        );


        Alert.alert(
          'Item Deleted',
          `${item.item_no} has been permanently deleted.`
        );

      } catch (error: any) {

        console.log(
          'PERMANENT DELETE ITEM ERROR:',
          error?.response?.data ??
          error
        );


        Alert.alert(
          'Delete Failed',
          getApiErrorMessage(
            error,
            'Unable to permanently delete the item.'
          )
        );

      } finally {

        setActionItemId(
          null
        );

      }

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
            Deleted Items
          </Text>

          <Text
            style={
              styles.subtitle
            }
          >
            Restore or permanently remove items
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
            {items.length}
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

          placeholder="Search deleted items..."

          placeholderTextColor={
            Colors.textMuted
          }

          style={
            styles.searchInput
          }
        />


        {search.length >
          0 && (

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
            Loading deleted items...
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
                loadItems(true)
              }

              tintColor={
                Colors.primary
              }
            />
          }
        >

          {/* WARNING */}

          <View
            style={
              styles.warningCard
            }
          >

            <View
              style={
                styles.warningIcon
              }
            >

              <Ionicons
                name="warning-outline"
                size={22}
                color={
                  Colors.danger
                }
              />

            </View>


            <View
              style={
                styles.warningContent
              }
            >

              <Text
                style={
                  styles.warningTitle
                }
              >
                Recycle Bin
              </Text>

              <Text
                style={
                  styles.warningText
                }
              >
                Restoring an item makes it available again. Permanent deletion cannot be undone.
              </Text>

            </View>

          </View>


          {items.length ===
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
                  name="trash-bin-outline"
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
                No deleted items
              </Text>


              <Text
                style={
                  styles.emptyText
                }
              >
                Deleted items will appear here.
              </Text>

            </View>

          ) : (

            items.map(
              item => (

                <DeletedItemCard
                  key={
                    item.id
                  }

                  item={
                    item
                  }

                  processing={
                    actionItemId ===
                    item.id
                  }

                  onRestore={() =>
                    confirmRestore(
                      item
                    )
                  }

                  onPermanentDelete={() =>
                    confirmPermanentDelete(
                      item
                    )
                  }
                />

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
| Deleted Item Card
|--------------------------------------------------------------------------
*/

function DeletedItemCard({
  item,
  processing,
  onRestore,
  onPermanentDelete,
}: {
  item: Item;
  processing: boolean;
  onRestore: () => void;
  onPermanentDelete:
    () => void;
}) {

  return (
    <View
      style={
        styles.itemCard
      }
    >

      {/* TOP */}

      <View
        style={
          styles.itemHeader
        }
      >

        <View
          style={
            styles.itemIcon
          }
        >

          <Ionicons
            name="cube-outline"
            size={22}
            color={
              Colors.primary
            }
          />

        </View>


        <View
          style={
            styles.itemHeaderContent
          }
        >

          <Text
            style={
              styles.itemDescription
            }
            numberOfLines={2}
          >
            {
              item.item_description
            }
          </Text>


          <Text
            style={
              styles.itemNumber
            }
          >
            {item.item_no}
          </Text>

        </View>


        <View
          style={
            styles.deletedBadge
          }
        >

          <Text
            style={
              styles.deletedText
            }
          >
            Deleted
          </Text>

        </View>

      </View>


      {/* DETAILS */}

      <View
        style={
          styles.details
        }
      >

        <DetailRow
          icon="folder-outline"
          label="Category"
          value={
            item.category ||
            '—'
          }
        />

        <DetailRow
          icon="layers-outline"
          label="Unit"
          value={
            item.unit ||
            '—'
          }
        />

        <DetailRow
          icon="pricetag-outline"
          label="Type"
          value={
            item.type ||
            '—'
          }
        />

        <DetailRow
          icon="archive-outline"
          label="Inventory"
          value={
            item.inventory ||
            '—'
          }
        />

        <DetailRow
          icon="calendar-outline"
          label="Deleted"
          value={
            normalizeDate(
              item.deleted_at
            )
          }
          last
        />

      </View>


      {/* ACTIONS */}

      <View
        style={
          styles.actions
        }
      >

        <Pressable
          disabled={
            processing
          }

          onPress={
            onRestore
          }

          style={[
            styles.restoreButton,

            processing &&
              styles.disabled,
          ]}
        >

          {processing ? (

            <ActivityIndicator
              size="small"
              color={
                Colors.primary
              }
            />

          ) : (

            <>
              <Ionicons
                name="refresh-outline"
                size={18}
                color={
                  Colors.primary
                }
              />

              <Text
                style={
                  styles.restoreText
                }
              >
                Restore
              </Text>
            </>

          )}

        </Pressable>


        <Pressable
          disabled={
            processing
          }

          onPress={
            onPermanentDelete
          }

          style={[
            styles.deleteButton,

            processing &&
              styles.disabled,
          ]}
        >

          <Ionicons
            name="trash-outline"
            size={18}
            color={
              Colors.danger
            }
          />

        </Pressable>

      </View>

    </View>
  );
}


/*
|--------------------------------------------------------------------------
| Detail Row
|--------------------------------------------------------------------------
*/

function DetailRow({
  icon,
  label,
  value,
  last = false,
}: {
  icon: any;
  label: string;
  value: string;
  last?: boolean;
}) {

  return (
    <View
      style={[
        styles.detailRow,

        last &&
          styles.detailRowLast,
      ]}
    >

      <View
        style={
          styles.detailIcon
        }
      >

        <Ionicons
          name={icon}
          size={15}
          color={
            Colors.textSecondary
          }
        />

      </View>


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
        numberOfLines={1}
      >
        {value}
      </Text>

    </View>
  );
}


/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function normalizeDate(
  value?:
    | string
    | null
): string {

  if (!value) {
    return '—';
  }

  return String(value)
    .substring(0, 10);
}


function getApiErrorMessage(
  error: any,
  fallback: string
): string {

  const errors =
    error?.response
      ?.data?.errors;

  if (errors) {

    const first =
      Object.values(errors)
        .flat()
        .find(Boolean);

    if (
      typeof first ===
      'string'
    ) {
      return first;
    }
  }

  return (
    error?.response
      ?.data?.message ??
    fallback
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
        Colors.surface,
      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    countText: {
      fontSize: 13,
      fontFamily:
        Fonts.bold,
      color:
        Colors.text,
    },

    searchBox: {
      height: 52,
      marginHorizontal: 20,
      marginBottom: 14,
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
      fontSize: 12,
      fontFamily:
        Fonts.regular,
      color:
        Colors.text,
    },

    listContent: {
      paddingHorizontal: 20,
      paddingBottom: 50,
    },

    warningCard: {
      marginBottom: 17,
      padding: 15,
      flexDirection: 'row',
      borderRadius: 18,
      backgroundColor:
        Colors.surface,
      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    warningIcon: {
      width: 42,
      height: 42,
      borderRadius: 13,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        Colors.background,
    },

    warningContent: {
      flex: 1,
      marginLeft: 11,
    },

    warningTitle: {
      fontSize: 11,
      fontFamily:
        Fonts.bold,
      color:
        Colors.text,
    },

    warningText: {
      marginTop: 4,
      fontSize: 9,
      lineHeight: 14,
      fontFamily:
        Fonts.regular,
      color:
        Colors.textSecondary,
    },

    itemCard: {
      marginBottom: 13,
      padding: 16,
      borderRadius: 20,
      backgroundColor:
        Colors.surface,
      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    itemHeader: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    itemIcon: {
      width: 45,
      height: 45,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        Colors.primaryLight,
    },

    itemHeaderContent: {
      flex: 1,
      marginLeft: 11,
      marginRight: 7,
    },

    itemDescription: {
      fontSize: 12,
      lineHeight: 17,
      fontFamily:
        Fonts.bold,
      color:
        Colors.text,
    },

    itemNumber: {
      marginTop: 3,
      fontSize: 9,
      fontFamily:
        Fonts.medium,
      color:
        Colors.textSecondary,
    },

    deletedBadge: {
      paddingHorizontal: 8,
      paddingVertical: 5,
      borderRadius: 9,
      backgroundColor:
        Colors.background,
    },

    deletedText: {
      fontSize: 8,
      fontFamily:
        Fonts.bold,
      color:
        Colors.danger,
    },

    details: {
      marginTop: 15,
      paddingTop: 4,
      borderTopWidth: 1,
      borderTopColor:
        Colors.border,
    },

    detailRow: {
      minHeight: 42,
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor:
        Colors.border,
    },

    detailRowLast: {
      borderBottomWidth: 0,
    },

    detailIcon: {
      width: 27,
    },

    detailLabel: {
      width: 73,
      fontSize: 9,
      fontFamily:
        Fonts.medium,
      color:
        Colors.textMuted,
    },

    detailValue: {
      flex: 1,
      textAlign: 'right',
      fontSize: 10,
      fontFamily:
        Fonts.semiBold,
      color:
        Colors.text,
    },

    actions: {
      marginTop: 13,
      flexDirection: 'row',
      gap: 9,
    },

    restoreButton: {
      flex: 1,
      height: 47,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 7,
      borderRadius: 14,
      backgroundColor:
        Colors.primaryLight,
      borderWidth: 1,
      borderColor:
        Colors.primary,
    },

    restoreText: {
      fontSize: 11,
      fontFamily:
        Fonts.bold,
      color:
        Colors.primary,
    },

    deleteButton: {
      width: 50,
      height: 47,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 14,
      backgroundColor:
        Colors.background,
      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    disabled: {
      opacity: 0.5,
    },

    emptyContainer: {
      paddingVertical: 70,
      alignItems: 'center',
    },

    emptyIcon: {
      width: 72,
      height: 72,
      borderRadius: 23,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        Colors.surface,
      borderWidth: 1,
      borderColor:
        Colors.border,
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
      fontSize: 10,
      fontFamily:
        Fonts.regular,
      color:
        Colors.textSecondary,
    },

    loadingContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },

    loadingText: {
      marginTop: 12,
      fontSize: 11,
      fontFamily:
        Fonts.medium,
      color:
        Colors.textSecondary,
    },

  });
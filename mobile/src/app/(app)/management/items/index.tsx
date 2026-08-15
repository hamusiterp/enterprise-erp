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
  Item,
  ItemOptions,
  ItemStatistics,
  itemsApi,
} from '../../../../api/itemsApi';


type StatusFilter =
  | 'all'
  | 'active'
  | 'inactive';


export default function ItemsScreen() {

  const [
    items,
    setItems,
  ] = useState<Item[]>([]);

  const [
    statistics,
    setStatistics,
  ] =
    useState<ItemStatistics>({
      total: 0,
      active: 0,
      inactive: 0,
      deleted: 0,
    });

  const [
    options,
    setOptions,
  ] =
    useState<ItemOptions>({
      categories: [],
      units: [],
      types: [],
      inventories: [],
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
    categoryFilter,
    setCategoryFilter,
  ] = useState('');

  const [
    unitFilter,
    setUnitFilter,
  ] = useState('');

  const [
    showCategoryFilter,
    setShowCategoryFilter,
  ] = useState(false);

  const [
    showUnitFilter,
    setShowUnitFilter,
  ] = useState(false);

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
  | Load Options
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    loadOptions();

  }, []);


  const loadOptions =
    async () => {

      try {

        const result =
          await itemsApi.options();

        setOptions(result);

      } catch (error: any) {

        console.log(
          'Item options error:',
          error?.response?.data ??
          error
        );

      }

    };


  /*
  |--------------------------------------------------------------------------
  | Load Items
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


          const params: any = {
            per_page: 100,

            sort_by:
              'item_description',

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


          if (
            categoryFilter
          ) {
            params.category =
              categoryFilter;
          }


          if (
            unitFilter
          ) {
            params.unit =
              unitFilter;
          }


          const [
            result,
            stats,
          ] =
            await Promise.all([
              itemsApi.list(params),
              itemsApi.statistics(),
            ]);


          setItems(
            result.data
          );

          setStatistics(
            stats
          );

        } catch (error: any) {

          console.log(
            'Items load error:',
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
        categoryFilter,
        unitFilter,
      ]
    );


  /*
  |--------------------------------------------------------------------------
  | Refresh when screen gains focus
  |--------------------------------------------------------------------------
  */

  useFocusEffect(
    useCallback(() => {

      loadItems();

    }, [
      loadItems,
    ])
  );


  /*
  |--------------------------------------------------------------------------
  | Derived Labels
  |--------------------------------------------------------------------------
  */

  const categoryLabel =
    categoryFilter ||
    'All Categories';

  const unitLabel =
    unitFilter ||
    'All Units';


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
            Items
          </Text>

          <Text
            style={
              styles.subtitle
            }
          >
            Product & inventory master data
          </Text>

        </View>


        <Pressable
          style={
            styles.headerIconButton
          }
          onPress={() =>
            router.push(
              '/(app)/management/items/deleted' as any
            )
          }
        >

          <Ionicons
            name="trash-outline"
            size={20}
            color={
              Colors.danger
            }
          />

        </Pressable>


        <Pressable
          style={
            styles.addButton
          }
          onPress={() =>
            router.push(
              '/(app)/management/items/create'
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
          icon="cube-outline"
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
          value={
            search
          }

          onChangeText={
            setSearch
          }

          placeholder="Search item number or description..."

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


      {/* STATUS FILTERS */}

      <View
        style={
          styles.statusFilters
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


      {/* EXTRA FILTERS */}

      <View
        style={
          styles.extraFilters
        }
      >

        <Pressable
          style={[
            styles.dropdownButton,

            categoryFilter &&
              styles.dropdownActive,
          ]}
          onPress={() => {

            setShowCategoryFilter(
              !showCategoryFilter
            );

            setShowUnitFilter(
              false
            );

          }}
        >

          <Ionicons
            name="folder-outline"
            size={16}
            color={
              categoryFilter
                ? Colors.primary
                : Colors.textSecondary
            }
          />

          <Text
            style={[
              styles.dropdownText,

              categoryFilter &&
                styles.dropdownTextActive,
            ]}
            numberOfLines={1}
          >
            {categoryLabel}
          </Text>

          <Ionicons
            name={
              showCategoryFilter
                ? 'chevron-up'
                : 'chevron-down'
            }
            size={15}
            color={
              Colors.textMuted
            }
          />

        </Pressable>


        <Pressable
          style={[
            styles.dropdownButton,

            unitFilter &&
              styles.dropdownActive,
          ]}
          onPress={() => {

            setShowUnitFilter(
              !showUnitFilter
            );

            setShowCategoryFilter(
              false
            );

          }}
        >

          <Ionicons
            name="layers-outline"
            size={16}
            color={
              unitFilter
                ? Colors.primary
                : Colors.textSecondary
            }
          />

          <Text
            style={[
              styles.dropdownText,

              unitFilter &&
                styles.dropdownTextActive,
            ]}
            numberOfLines={1}
          >
            {unitLabel}
          </Text>

          <Ionicons
            name={
              showUnitFilter
                ? 'chevron-up'
                : 'chevron-down'
            }
            size={15}
            color={
              Colors.textMuted
            }
          />

        </Pressable>

      </View>


      {/* CATEGORY DROPDOWN */}

      {showCategoryFilter && (

        <View
          style={
            styles.dropdown
          }
        >

          <ScrollView
            nestedScrollEnabled
            style={{
              maxHeight: 240,
            }}
          >

            <DropdownOption
              title="All Categories"
              selected={
                categoryFilter === ''
              }
              onPress={() => {
                setCategoryFilter('');
                setShowCategoryFilter(
                  false
                );
              }}
            />


            {options.categories.map(
              category => (

                <DropdownOption
                  key={category}
                  title={category}
                  selected={
                    categoryFilter ===
                    category
                  }
                  onPress={() => {

                    setCategoryFilter(
                      category
                    );

                    setShowCategoryFilter(
                      false
                    );

                  }}
                />

              )
            )}

          </ScrollView>

        </View>

      )}


      {/* UNIT DROPDOWN */}

      {showUnitFilter && (

        <View
          style={
            styles.dropdown
          }
        >

          <ScrollView
            nestedScrollEnabled
            style={{
              maxHeight: 240,
            }}
          >

            <DropdownOption
              title="All Units"
              selected={
                unitFilter === ''
              }
              onPress={() => {
                setUnitFilter('');
                setShowUnitFilter(
                  false
                );
              }}
            />


            {options.units.map(
              unit => (

                <DropdownOption
                  key={unit}
                  title={unit}
                  selected={
                    unitFilter ===
                    unit
                  }
                  onPress={() => {

                    setUnitFilter(
                      unit
                    );

                    setShowUnitFilter(
                      false
                    );

                  }}
                />

              )
            )}

          </ScrollView>

        </View>

      )}


      {/* ITEMS */}

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
            Loading items...
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
                loadItems(true)
              }

              tintColor={
                Colors.primary
              }
            />

          }
        >

          {items.length === 0 ? (

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
                  name="cube-outline"
                  size={37}
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
                No items found
              </Text>


              <Text
                style={
                  styles.emptyText
                }
              >
                Try changing the search or filters.
              </Text>

            </View>

          ) : (

            items.map(
              item => (

                <ItemCard
                  key={
                    item.id
                  }
                  item={
                    item
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
| Item Card
|--------------------------------------------------------------------------
*/

function ItemCard({
  item,
}: {
  item: Item;
}) {

  const active =
    item.status ===
    'active';


  return (

    <Pressable
      onPress={() =>
        router.push(
          `/(app)/management/items/${item.id}` as any
        )
      }

      style={({
        pressed,
      }) => [
        styles.itemCard,

        pressed &&
          styles.itemCardPressed,
      ]}
    >

      <View
        style={
          styles.itemIcon
        }
      >

        <Ionicons
          name="cube-outline"
          size={24}
          color={
            Colors.primary
          }
        />

      </View>


      <View
        style={
          styles.itemContent
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


        <View
          style={
            styles.metaRow
          }
        >

          {item.category ? (

            <MetaBadge
              icon="folder-outline"
              value={
                item.category
              }
            />

          ) : null}


          {item.unit ? (

            <MetaBadge
              icon="layers-outline"
              value={
                item.unit
              }
            />

          ) : null}

        </View>


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

                active
                  ? styles.activeDot
                  : styles.inactiveDot,
              ]}
            />

            <Text
              style={[
                styles.statusText,

                active
                  ? styles.activeText
                  : styles.inactiveText,
              ]}
            >
              {
                active
                  ? 'Active'
                  : 'Inactive'
              }
            </Text>

          </View>


          {item.type ? (

            <View
              style={
                styles.typeBadge
              }
            >

              <Text
                style={
                  styles.typeText
                }
                numberOfLines={1}
              >
                {item.type}
              </Text>

            </View>

          ) : null}


          {item.inventory ? (

            <View
              style={
                styles.inventoryBadge
              }
            >

              <Text
                style={
                  styles.inventoryText
                }
                numberOfLines={1}
              >
                {item.inventory}
              </Text>

            </View>

          ) : null}

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

  );
}


/*
|--------------------------------------------------------------------------
| Meta Badge
|--------------------------------------------------------------------------
*/

function MetaBadge({
  icon,
  value,
}: {
  icon: any;
  value: string;
}) {

  return (

    <View
      style={
        styles.metaBadge
      }
    >

      <Ionicons
        name={icon}
        size={11}
        color={
          Colors.textSecondary
        }
      />

      <Text
        style={
          styles.metaText
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
| Statistics
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
| Filter Button
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
| Dropdown Option
|--------------------------------------------------------------------------
*/

function DropdownOption({
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
        styles.dropdownOption,

        selected &&
          styles.dropdownOptionSelected,
      ]}
    >

      <Text
        style={[
          styles.dropdownOptionText,

          selected &&
            styles.dropdownOptionTextSelected,
        ]}
      >
        {title}
      </Text>


      {selected && (

        <Ionicons
          name="checkmark"
          size={18}
          color={
            Colors.primary
          }
        />

      )}

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

      gap: 8,
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
      marginLeft: 5,
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

    headerIconButton: {
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

      minHeight: 83,

      paddingVertical: 10,

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

      fontSize: 9,

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

      fontSize: 13,

      fontFamily:
        Fonts.regular,

      color:
        Colors.text,
    },

    statusFilters: {
      marginHorizontal: 20,
      marginBottom: 11,

      flexDirection: 'row',

      gap: 8,
    },

    filterButton: {
      paddingHorizontal: 15,
      paddingVertical: 8,

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
      fontSize: 10,

      fontFamily:
        Fonts.semiBold,

      color:
        Colors.textSecondary,
    },

    filterTextSelected: {
      color:
        Colors.white,
    },

    extraFilters: {
      marginHorizontal: 20,
      marginBottom: 12,

      flexDirection: 'row',

      gap: 8,
    },

    dropdownButton: {
      flex: 1,
      height: 44,

      paddingHorizontal: 11,

      flexDirection: 'row',
      alignItems: 'center',

      borderRadius: 13,

      backgroundColor:
        Colors.surface,

      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    dropdownActive: {
      borderColor:
        Colors.primary,

      backgroundColor:
        Colors.primaryLight,
    },

    dropdownText: {
      flex: 1,

      marginHorizontal: 6,

      fontSize: 9,

      fontFamily:
        Fonts.medium,

      color:
        Colors.textSecondary,
    },

    dropdownTextActive: {
      color:
        Colors.primary,

      fontFamily:
        Fonts.semiBold,
    },

    dropdown: {
      marginHorizontal: 20,
      marginBottom: 12,

      borderRadius: 16,

      overflow: 'hidden',

      backgroundColor:
        Colors.surface,

      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    dropdownOption: {
      minHeight: 48,

      paddingHorizontal: 14,

      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'space-between',

      borderBottomWidth: 1,
      borderBottomColor:
        Colors.border,
    },

    dropdownOptionSelected: {
      backgroundColor:
        Colors.primaryLight,
    },

    dropdownOptionText: {
      flex: 1,

      fontSize: 11,

      fontFamily:
        Fonts.medium,

      color:
        Colors.text,
    },

    dropdownOptionTextSelected: {
      color:
        Colors.primary,

      fontFamily:
        Fonts.bold,
    },

    listContent: {
      paddingHorizontal: 20,
      paddingBottom: 45,
    },

    itemCard: {
      minHeight: 130,

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

    itemCardPressed: {
      backgroundColor:
        Colors.primaryLight,
    },

    itemIcon: {
      width: 52,
      height: 52,

      borderRadius: 17,

      alignItems: 'center',
      justifyContent: 'center',

      backgroundColor:
        Colors.primaryLight,
    },

    itemContent: {
      flex: 1,

      marginLeft: 13,
    },

    itemDescription: {
      fontSize: 13,

      lineHeight: 18,

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
        Colors.textMuted,
    },

    metaRow: {
      marginTop: 7,

      flexDirection: 'row',
      flexWrap: 'wrap',

      gap: 6,
    },

    metaBadge: {
      maxWidth: '48%',

      paddingHorizontal: 7,
      paddingVertical: 4,

      flexDirection: 'row',
      alignItems: 'center',

      borderRadius: 8,

      backgroundColor:
        Colors.background,
    },

    metaText: {
      marginLeft: 4,

      fontSize: 8,

      fontFamily:
        Fonts.medium,

      color:
        Colors.textSecondary,
    },

    bottomRow: {
      marginTop: 9,

      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',

      gap: 6,
    },

    statusRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    statusDot: {
      width: 7,
      height: 7,

      marginRight: 5,

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
      fontSize: 9,

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

    typeBadge: {
      maxWidth: 90,

      paddingHorizontal: 7,
      paddingVertical: 4,

      borderRadius: 8,

      backgroundColor:
        Colors.primaryLight,
    },

    typeText: {
      fontSize: 8,

      fontFamily:
        Fonts.bold,

      color:
        Colors.primary,
    },

    inventoryBadge: {
      maxWidth: 90,

      paddingHorizontal: 7,
      paddingVertical: 4,

      borderRadius: 8,

      backgroundColor:
        Colors.background,
    },

    inventoryText: {
      fontSize: 8,

      fontFamily:
        Fonts.semiBold,

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

      fontSize: 12,

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

      fontSize: 11,

      fontFamily:
        Fonts.regular,

      color:
        Colors.textSecondary,
    },

  });
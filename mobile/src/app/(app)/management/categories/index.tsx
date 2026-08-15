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
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';

import {
  Category,
  CategoryStatistics,
  CategoryStatus,
  categoriesApi,
} from '../../../../api/categoriesApi';

import { Colors } from '../../../../constants/colors';
import { Fonts } from '../../../../constants/fonts';


type StatusFilter =
  | ''
  | CategoryStatus;


const emptyStatistics: CategoryStatistics = {
  total: 0,
  active: 0,
  inactive: 0,
  deleted: 0,
};


export default function CategoriesScreen() {

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [statistics, setStatistics] =
    useState<CategoryStatistics>(
      emptyStatistics
    );

  const [search, setSearch] =
    useState('');

  const [status, setStatus] =
    useState<StatusFilter>('');

  const [type, setType] =
    useState('');

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [page, setPage] =
    useState(1);

  const [lastPage, setLastPage] =
    useState(1);

  const [total, setTotal] =
    useState(0);


  /*
  |--------------------------------------------------------------------------
  | Load Categories
  |--------------------------------------------------------------------------
  */

  const loadCategories =
    useCallback(
      async (
        requestedPage = 1
      ) => {

        try {

          const result =
            await categoriesApi.list({
              search:
                search.trim() ||
                undefined,

              status:
                status ||
                undefined,

              type:
                type.trim() ||
                undefined,

              page:
                requestedPage,

              per_page: 10,

              sort_by:
                'id',

              sort_direction:
                'desc',
            });


          setCategories(
            result.data ?? []
          );

          setPage(
            result.pagination
              ?.current_page ?? 1
          );

          setLastPage(
            result.pagination
              ?.last_page ?? 1
          );

          setTotal(
            result.pagination
              ?.total ?? 0
          );

        } catch (error) {

          console.log(
            'CATEGORY LIST ERROR:',
            error
          );

          setCategories([]);

        } finally {

          setLoading(false);
          setRefreshing(false);

        }

      },
      [
        search,
        status,
        type,
      ]
    );


  /*
  |--------------------------------------------------------------------------
  | Statistics
  |--------------------------------------------------------------------------
  */

  const loadStatistics =
    useCallback(
      async () => {

        try {

          const result =
            await categoriesApi
              .statistics();

          setStatistics(
            result
          );

        } catch (error) {

          console.log(
            'CATEGORY STATISTICS ERROR:',
            error
          );

        }

      },
      []
    );


  /*
  |--------------------------------------------------------------------------
  | Initial / Filter Load
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    const timer =
      setTimeout(() => {

        setLoading(true);

        loadCategories(1);

      }, 300);


    return () =>
      clearTimeout(timer);

  }, [
    search,
    status,
    type,
    loadCategories,
  ]);


  useEffect(() => {

    loadStatistics();

  }, [
    loadStatistics,
  ]);


  /*
  |--------------------------------------------------------------------------
  | Refresh
  |--------------------------------------------------------------------------
  */

  const refresh =
    async () => {

      setRefreshing(true);

      await Promise.all([
        loadCategories(page),
        loadStatistics(),
      ]);

    };


  /*
  |--------------------------------------------------------------------------
  | Reset Filters
  |--------------------------------------------------------------------------
  */

  const clearFilters =
    () => {

      setSearch('');
      setStatus('');
      setType('');
      setPage(1);

    };


  const hasFilters =
    search !== '' ||
    status !== '' ||
    type !== '';


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
          style={styles.header}
        >

          <Pressable
            style={styles.iconButton}
            onPress={() =>
              router.back()
            }
          >
            <Ionicons
              name="arrow-back"
              size={21}
              color={Colors.text}
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
              Categories
            </Text>

            <Text
              style={styles.subtitle}
            >
              Category & classification master data
            </Text>

          </View>


          <Pressable
            style={styles.addButton}
            onPress={() =>
              router.push(
                '/(app)/management/categories/create' as any
              )
            }
          >
            <Ionicons
              name="add"
              size={24}
              color="#FFFFFF"
            />
          </Pressable>

        </View>


        {/* STATISTICS */}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={
            false
          }
          contentContainerStyle={
            styles.statsContainer
          }
        >

          <StatCard
            icon="folder-outline"
            label="Total"
            value={
              statistics.total
            }
          />

          <StatCard
            icon="checkmark-circle-outline"
            label="Active"
            value={
              statistics.active
            }
          />

          <StatCard
            icon="pause-circle-outline"
            label="Inactive"
            value={
              statistics.inactive
            }
          />

          <Pressable
            onPress={() =>
              router.push(
                '/(app)/management/categories/deleted' as any
              )
            }
          >
            <StatCard
              icon="trash-outline"
              label="Deleted"
              value={
                statistics.deleted
              }
            />
          </Pressable>

        </ScrollView>


        {/* SEARCH */}

        <View
          style={styles.searchBox}
        >

          <Ionicons
            name="search-outline"
            size={19}
            color={
              Colors.textMuted
            }
          />

          <TextInput
            value={search}
            onChangeText={
              setSearch
            }
            placeholder="Search categories..."
            placeholderTextColor={
              Colors.textMuted
            }
            style={
              styles.searchInput
            }
          />

          {search !== '' && (

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


        {/* STATUS FILTER */}

        <Text
          style={styles.filterLabel}
        >
          Status
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={
            false
          }
        >

          <FilterChip
            label="All"
            active={
              status === ''
            }
            onPress={() =>
              setStatus('')
            }
          />

          <FilterChip
            label="Active"
            active={
              status === 'active'
            }
            onPress={() =>
              setStatus('active')
            }
          />

          <FilterChip
            label="Inactive"
            active={
              status === 'inactive'
            }
            onPress={() =>
              setStatus('inactive')
            }
          />

        </ScrollView>


        {/* TYPE FILTER */}

        <Text
          style={styles.filterLabel}
        >
          Type
        </Text>

        <View
          style={styles.typeBox}
        >

          <Ionicons
            name="pricetag-outline"
            size={18}
            color={
              Colors.textMuted
            }
          />

          <TextInput
            value={type}
            onChangeText={
              setType
            }
            placeholder="Filter by type..."
            placeholderTextColor={
              Colors.textMuted
            }
            style={
              styles.typeInput
            }
          />

          {type !== '' && (

            <Pressable
              onPress={() =>
                setType('')
              }
            >
              <Ionicons
                name="close-circle"
                size={18}
                color={
                  Colors.textMuted
                }
              />
            </Pressable>

          )}

        </View>


        {hasFilters && (

          <Pressable
            onPress={
              clearFilters
            }
            style={
              styles.clearButton
            }
          >

            <Ionicons
              name="close-outline"
              size={17}
              color={
                Colors.primary
              }
            />

            <Text
              style={
                styles.clearText
              }
            >
              Clear filters
            </Text>

          </Pressable>

        )}


        {/* LIST HEADER */}

        <View
          style={
            styles.listHeader
          }
        >

          <Text
            style={
              styles.listTitle
            }
          >
            Categories
          </Text>

          <Text
            style={
              styles.resultCount
            }
          >
            {total} records
          </Text>

        </View>


        {/* LIST */}

        {loading ? (

          <View
            style={
              styles.loadingBox
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
              Loading categories...
            </Text>

          </View>

        ) : categories.length ===
          0 ? (

          <View
            style={
              styles.emptyCard
            }
          >

            <View
              style={
                styles.emptyIcon
              }
            >

              <Ionicons
                name="folder-open-outline"
                size={34}
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
              No Categories Found
            </Text>


            <Text
              style={
                styles.emptyText
              }
            >
              Try changing your search or filters.
            </Text>

          </View>

        ) : (

          categories.map(
            category => (

              <CategoryCard
                key={
                  category.id
                }
                category={
                  category
                }
              />

            )
          )

        )}


        {/* PAGINATION */}

        {!loading &&
          lastPage > 1 && (

          <View
            style={
              styles.pagination
            }
          >

            <Pressable
              disabled={
                page <= 1
              }
              style={[
                styles.pageButton,

                page <= 1 &&
                  styles.disabledButton,
              ]}
              onPress={() =>
                loadCategories(
                  page - 1
                )
              }
            >

              <Ionicons
                name="chevron-back"
                size={18}
                color={
                  Colors.text
                }
              />

              <Text
                style={
                  styles.pageButtonText
                }
              >
                Previous
              </Text>

            </Pressable>


            <Text
              style={
                styles.pageText
              }
            >
              {page} / {lastPage}
            </Text>


            <Pressable
              disabled={
                page >=
                lastPage
              }
              style={[
                styles.pageButton,

                page >=
                  lastPage &&
                  styles.disabledButton,
              ]}
              onPress={() =>
                loadCategories(
                  page + 1
                )
              }
            >

              <Text
                style={
                  styles.pageButtonText
                }
              >
                Next
              </Text>

              <Ionicons
                name="chevron-forward"
                size={18}
                color={
                  Colors.text
                }
              />

            </Pressable>

          </View>

        )}

      </ScrollView>

    </SafeAreaView>
  );
}


/*
|--------------------------------------------------------------------------
| Category Card
|--------------------------------------------------------------------------
*/

function CategoryCard({
  category,
}: {
  category: Category;
}) {

  const active =
    category.status ===
    'active';


  return (
    <Pressable
      onPress={() =>
        router.push(
          `/(app)/management/categories/${category.id}` as any
        )
      }
      style={({
        pressed,
      }) => [
        styles.categoryCard,

        pressed &&
          styles.pressed,
      ]}
    >

      <View
        style={
          styles.categoryTop
        }
      >

        <View
          style={
            styles.categoryIcon
          }
        >

          <Ionicons
            name="folder-outline"
            size={22}
            color={
              Colors.primary
            }
          />

        </View>


        <View
          style={
            styles.categoryHeading
          }
        >

          <Text
            style={
              styles.categoryName
            }
            numberOfLines={2}
          >
            {category.category}
          </Text>

          <Text
            style={
              styles.categoryType
            }
          >
            {category.type || '-'}
          </Text>

        </View>


        <View
          style={[
            styles.statusBadge,

            !active &&
              styles.inactiveBadge,
          ]}
        >

          <Text
            style={
              styles.statusText
            }
          >
            {active
              ? 'Active'
              : 'Inactive'}
          </Text>

        </View>

      </View>


      <View
        style={
          styles.cardFooter
        }
      >

        <View
          style={
            styles.typeBadge
          }
        >

          <Ionicons
            name="pricetag-outline"
            size={13}
            color={
              Colors.primary
            }
          />

          <Text
            style={
              styles.typeBadgeText
            }
          >
            {category.type ||
              'No Type'}
          </Text>

        </View>


        <View
          style={
            styles.openRow
          }
        >

          <Text
            style={
              styles.openText
            }
          >
            View Details
          </Text>

          <Ionicons
            name="chevron-forward"
            size={16}
            color={
              Colors.primary
            }
          />

        </View>

      </View>

    </Pressable>
  );
}


/*
|--------------------------------------------------------------------------
| Stat Card
|--------------------------------------------------------------------------
*/

function StatCard({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: number;
}) {

  return (
    <View
      style={
        styles.statCard
      }
    >

      <View
        style={
          styles.statIcon
        }
      >

        <Ionicons
          name={icon as any}
          size={19}
          color={
            Colors.primary
          }
        />

      </View>


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
| Filter Chip
|--------------------------------------------------------------------------
*/

function FilterChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.filterChip,

        active &&
          styles.filterChipActive,
      ]}
    >

      <Text
        style={[
          styles.filterChipText,

          active &&
            styles.filterChipTextActive,
        ]}
      >
        {label}
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

    container: {
      paddingHorizontal: 18,
      paddingTop: 12,
      paddingBottom: 50,
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

    headerContent: {
      flex: 1,
      marginLeft: 12,
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

    addButton: {
      width: 44,
      height: 44,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        Colors.primary,
    },

    statsContainer: {
      paddingTop: 22,
      paddingBottom: 5,
      gap: 10,
    },

    statCard: {
      width: 105,
      padding: 13,
      borderRadius: 17,
      backgroundColor:
        Colors.surface,
      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    statIcon: {
      width: 35,
      height: 35,
      borderRadius: 11,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        Colors.primaryLight,
    },

    statValue: {
      marginTop: 9,
      fontSize: 18,
      fontFamily:
        Fonts.extraBold,
      color:
        Colors.text,
    },

    statLabel: {
      marginTop: 2,
      fontSize: 9,
      fontFamily:
        Fonts.regular,
      color:
        Colors.textSecondary,
    },

    searchBox: {
      marginTop: 20,
      height: 48,
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
      marginLeft: 9,
      fontSize: 12,
      fontFamily:
        Fonts.regular,
      color:
        Colors.text,
    },

    filterLabel: {
      marginTop: 17,
      marginBottom: 9,
      fontSize: 10,
      fontFamily:
        Fonts.bold,
      color:
        Colors.textSecondary,
    },

    typeBox: {
      height: 48,
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

    typeInput: {
      flex: 1,
      marginLeft: 8,
      fontSize: 12,
      fontFamily:
        Fonts.regular,
      color:
        Colors.text,
    },

    filterChip: {
      marginRight: 8,
      paddingHorizontal: 14,
      paddingVertical: 9,
      borderRadius: 12,
      backgroundColor:
        Colors.surface,
      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    filterChipActive: {
      backgroundColor:
        Colors.primary,
      borderColor:
        Colors.primary,
    },

    filterChipText: {
      fontSize: 10,
      fontFamily:
        Fonts.bold,
      color:
        Colors.textSecondary,
    },

    filterChipTextActive: {
      color: '#FFFFFF',
    },

    clearButton: {
      marginTop: 14,
      alignSelf:
        'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },

    clearText: {
      fontSize: 10,
      fontFamily:
        Fonts.bold,
      color:
        Colors.primary,
    },

    listHeader: {
      marginTop: 25,
      marginBottom: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'space-between',
    },

    listTitle: {
      fontSize: 17,
      fontFamily:
        Fonts.extraBold,
      color:
        Colors.text,
    },

    resultCount: {
      fontSize: 10,
      fontFamily:
        Fonts.regular,
      color:
        Colors.textSecondary,
    },

    loadingBox: {
      paddingVertical: 50,
      alignItems: 'center',
    },

    loadingText: {
      marginTop: 10,
      fontSize: 10,
      fontFamily:
        Fonts.regular,
      color:
        Colors.textSecondary,
    },

    categoryCard: {
      marginBottom: 12,
      padding: 15,
      borderRadius: 18,
      backgroundColor:
        Colors.surface,
      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    pressed: {
      opacity: 0.7,
    },

    categoryTop: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    categoryIcon: {
      width: 44,
      height: 44,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        Colors.primaryLight,
    },

    categoryHeading: {
      flex: 1,
      marginLeft: 11,
      marginRight: 8,
    },

    categoryName: {
      fontSize: 13,
      lineHeight: 18,
      fontFamily:
        Fonts.bold,
      color:
        Colors.text,
    },

    categoryType: {
      marginTop: 3,
      fontSize: 9,
      fontFamily:
        Fonts.medium,
      color:
        Colors.textSecondary,
    },

    statusBadge: {
      paddingHorizontal: 9,
      paddingVertical: 5,
      borderRadius: 10,
      backgroundColor:
        Colors.primaryLight,
    },

    inactiveBadge: {
      opacity: 0.65,
    },

    statusText: {
      fontSize: 8,
      fontFamily:
        Fonts.bold,
      color:
        Colors.primary,
    },

    cardFooter: {
      marginTop: 14,
      paddingTop: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'space-between',
      borderTopWidth: 1,
      borderTopColor:
        Colors.border,
    },

    typeBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 9,
      paddingVertical: 5,
      borderRadius: 9,
      backgroundColor:
        Colors.primaryLight,
    },

    typeBadgeText: {
      marginLeft: 4,
      fontSize: 8,
      fontFamily:
        Fonts.bold,
      color:
        Colors.primary,
    },

    openRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    openText: {
      marginRight: 3,
      fontSize: 9,
      fontFamily:
        Fonts.bold,
      color:
        Colors.primary,
    },

    emptyCard: {
      paddingVertical: 45,
      paddingHorizontal: 20,
      alignItems: 'center',
      borderRadius: 18,
      backgroundColor:
        Colors.surface,
      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    emptyIcon: {
      width: 65,
      height: 65,
      borderRadius: 21,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        Colors.primaryLight,
    },

    emptyTitle: {
      marginTop: 13,
      fontSize: 13,
      fontFamily:
        Fonts.bold,
      color:
        Colors.text,
    },

    emptyText: {
      marginTop: 4,
      fontSize: 10,
      fontFamily:
        Fonts.regular,
      color:
        Colors.textSecondary,
    },

    pagination: {
      marginTop: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'space-between',
    },

    pageButton: {
      minWidth: 95,
      height: 42,
      paddingHorizontal: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 13,
      backgroundColor:
        Colors.surface,
      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    disabledButton: {
      opacity: 0.35,
    },

    pageButtonText: {
      marginHorizontal: 3,
      fontSize: 9,
      fontFamily:
        Fonts.bold,
      color:
        Colors.text,
    },

    pageText: {
      fontSize: 10,
      fontFamily:
        Fonts.bold,
      color:
        Colors.textSecondary,
    },

  });
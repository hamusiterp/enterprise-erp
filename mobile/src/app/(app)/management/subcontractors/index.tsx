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

import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  Subcontractor,
  SubcontractorStatus,
  SubcontractorTaxPercent,
  SubcontractorType,
  SubcontractorStatistics,
  subcontractorsApi,
} from '../../../../api/subcontractorsApi';

import {
  CategoryOption,
  categoriesApi,
} from '../../../../api/categoriesApi';

import {
  Colors,
} from '../../../../constants/colors';

import {
  Fonts,
} from '../../../../constants/fonts';


type TypeFilter =
  | ''
  | SubcontractorType;


type StatusFilter =
  | ''
  | SubcontractorStatus;


type TaxFilter =
  | ''
  | SubcontractorTaxPercent;


const emptyStatistics: SubcontractorStatistics = {

  total: 0,

  active: 0,

  inactive: 0,

  companies: 0,

  individuals: 0,

  tax_0: 0,

  tax_2: 0,

  tax_10: 0,

  tax_15: 0,

  deleted: 0,

};


export default function SubcontractorsScreen() {

  /*
  |--------------------------------------------------------------------------
  | Data
  |--------------------------------------------------------------------------
  */

  const [
    subcontractors,
    setSubcontractors,
  ] =
    useState<Subcontractor[]>([]);


  const [
    statistics,
    setStatistics,
  ] =
    useState<SubcontractorStatistics>(
      emptyStatistics
    );


  const [
    categories,
    setCategories,
  ] =
    useState<CategoryOption[]>([]);


  /*
  |--------------------------------------------------------------------------
  | Filters
  |--------------------------------------------------------------------------
  */

  const [
    search,
    setSearch,
  ] =
    useState('');


  const [
    type,
    setType,
  ] =
    useState<TypeFilter>('');


  const [
    status,
    setStatus,
  ] =
    useState<StatusFilter>('');


  const [
    taxPercent,
    setTaxPercent,
  ] =
    useState<TaxFilter>('');


  const [
    categoryId,
    setCategoryId,
  ] =
    useState<number | null>(
      null
    );


  const [
    categoryOpen,
    setCategoryOpen,
  ] =
    useState(false);


  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  const [
    loading,
    setLoading,
  ] =
    useState(true);


  const [
    refreshing,
    setRefreshing,
  ] =
    useState(false);


  /*
  |--------------------------------------------------------------------------
  | Pagination
  |--------------------------------------------------------------------------
  */

  const [
    page,
    setPage,
  ] =
    useState(1);


  const [
    lastPage,
    setLastPage,
  ] =
    useState(1);


  const [
    total,
    setTotal,
  ] =
    useState(0);


  /*
  |--------------------------------------------------------------------------
  | Load Subcontractors
  |--------------------------------------------------------------------------
  */

  const loadSubcontractors =
    useCallback(
      async (
        requestedPage = 1
      ) => {

        try {

          const result =
            await subcontractorsApi.list({

              search:
                search.trim() ||
                undefined,

              type:
                type ||
                undefined,

              category_id:
                categoryId ??
                undefined,

              tax_percent:
                taxPercent === ''
                  ? undefined
                  : taxPercent,

              status:
                status ||
                undefined,

              sort_by:
                'id',

              sort_direction:
                'desc',

              page:
                requestedPage,

              per_page:
                10,

            });


          setSubcontractors(
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

        } catch (error: any) {

          console.log(
            'SUBCONTRACTOR LIST ERROR:',
            error?.response?.data ??
            error
          );


          setSubcontractors([]);

        } finally {

          setLoading(false);

          setRefreshing(false);

        }

      },
      [
        search,
        type,
        categoryId,
        taxPercent,
        status,
      ]
    );


  /*
  |--------------------------------------------------------------------------
  | Load Statistics
  |--------------------------------------------------------------------------
  */

  const loadStatistics =
    useCallback(
      async () => {

        try {

          const result =
            await subcontractorsApi
              .statistics();


          setStatistics(
            result
          );

        } catch (error: any) {

          console.log(
            'SUBCONTRACTOR STATISTICS ERROR:',
            error?.response?.data ??
            error
          );

        }

      },
      []
    );


  /*
  |--------------------------------------------------------------------------
  | Load Categories
  |--------------------------------------------------------------------------
  */

  const loadCategories =
    useCallback(
      async () => {

        try {

          const result =
            await categoriesApi
              .options();


          setCategories(
            result ?? []
          );

        } catch (error: any) {

          console.log(
            'SUBCONTRACTOR CATEGORY ERROR:',
            error?.response?.data ??
            error
          );

        }

      },
      []
    );


  /*
  |--------------------------------------------------------------------------
  | Initial Load
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    loadStatistics();

    loadCategories();

  }, [
    loadStatistics,
    loadCategories,
  ]);


  useEffect(() => {

    const timer =
      setTimeout(() => {

        setLoading(true);

        loadSubcontractors(1);

      }, 300);


    return () =>
      clearTimeout(timer);

  }, [
    search,
    type,
    categoryId,
    taxPercent,
    status,
    loadSubcontractors,
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

        loadSubcontractors(page),

        loadStatistics(),

        loadCategories(),

      ]);

    };


  /*
  |--------------------------------------------------------------------------
  | Clear Filters
  |--------------------------------------------------------------------------
  */

  const clearFilters =
    () => {

      setSearch('');

      setType('');

      setStatus('');

      setTaxPercent('');

      setCategoryId(null);

      setCategoryOpen(false);

      setPage(1);

    };


  const selectedCategory =
    categories.find(
      item =>
        item.id ===
        categoryId
    );


  const hasFilters =
    search !== '' ||
    type !== '' ||
    status !== '' ||
    taxPercent !== '' ||
    categoryId !== null;


  /*
  |--------------------------------------------------------------------------
  | Screen
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

        showsVerticalScrollIndicator={
          false
        }

        keyboardShouldPersistTaps="handled"

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
              styles.backButton
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
              styles.headerContent
            }
          >

            <Text
              style={
                styles.title
              }
            >
              Subcontractors
            </Text>


            <Text
              style={
                styles.subtitle
              }
            >
              Companies & individual subcontractors
            </Text>

          </View>


          <Pressable
            style={
              styles.addButton
            }

            onPress={() =>
              router.push(
                '/(app)/management/subcontractors/create' as any
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
            icon="people-outline"
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


          <StatCard
            icon="business-outline"
            label="Companies"
            value={
              statistics.companies
            }
          />


          <StatCard
            icon="person-outline"
            label="Individuals"
            value={
              statistics.individuals
            }
          />


          <StatCard
            icon="cash-outline"
            label="Tax 0%"
            value={
              statistics.tax_0
            }
          />


          <StatCard
            icon="cash-outline"
            label="Tax 2%"
            value={
              statistics.tax_2
            }
          />


          <StatCard
            icon="cash-outline"
            label="Tax 10%"
            value={
              statistics.tax_10
            }
          />


          <StatCard
            icon="cash-outline"
            label="Tax 15%"
            value={
              statistics.tax_15
            }
          />


          <Pressable
            onPress={() =>
              router.push(
                '/(app)/management/subcontractors/deleted' as any
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
          style={
            styles.searchBox
          }
        >

          <Ionicons
            name="search-outline"
            size={19}
            color={
              Colors.textMuted
            }
          />


          <TextInput
            value={
              search
            }

            onChangeText={
              setSearch
            }

            placeholder="Search subcontractor..."

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


        {/* TYPE */}

        <FilterTitle
          title="Type"
        />


        <ScrollView
          horizontal

          showsHorizontalScrollIndicator={
            false
          }
        >

          <FilterChip
            label="All"

            active={
              type === ''
            }

            onPress={() =>
              setType('')
            }
          />


          <FilterChip
            label="Company"

            active={
              type ===
              'company'
            }

            onPress={() =>
              setType(
                'company'
              )
            }
          />


          <FilterChip
            label="Individual"

            active={
              type ===
              'individual'
            }

            onPress={() =>
              setType(
                'individual'
              )
            }
          />

        </ScrollView>


        {/* STATUS */}

        <FilterTitle
          title="Status"
        />


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
              status ===
              'active'
            }

            onPress={() =>
              setStatus(
                'active'
              )
            }
          />


          <FilterChip
            label="Inactive"

            active={
              status ===
              'inactive'
            }

            onPress={() =>
              setStatus(
                'inactive'
              )
            }
          />

        </ScrollView>


        {/* TAX */}

        <FilterTitle
          title="Tax Percent"
        />


        <ScrollView
          horizontal

          showsHorizontalScrollIndicator={
            false
          }
        >

          <FilterChip
            label="All"

            active={
              taxPercent === ''
            }

            onPress={() =>
              setTaxPercent('')
            }
          />


          <FilterChip
            label="0%"

            active={
              taxPercent === 0
            }

            onPress={() =>
              setTaxPercent(0)
            }
          />


          <FilterChip
            label="2%"

            active={
              taxPercent === 2
            }

            onPress={() =>
              setTaxPercent(2)
            }
          />


          <FilterChip
            label="10%"

            active={
              taxPercent === 10
            }

            onPress={() =>
              setTaxPercent(10)
            }
          />


          <FilterChip
            label="15%"

            active={
              taxPercent === 15
            }

            onPress={() =>
              setTaxPercent(15)
            }
          />

        </ScrollView>


        {/* CATEGORY */}

        <FilterTitle
          title="Category"
        />


        <Pressable
          style={[
            styles.categorySelect,

            categoryOpen &&
              styles.categorySelectOpen,
          ]}

          onPress={() =>
            setCategoryOpen(
              current =>
                !current
            )
          }
        >

          <Ionicons
            name="folder-outline"
            size={18}
            color={
              Colors.textSecondary
            }
          />


          <Text
            style={[
              styles.categorySelectText,

              !selectedCategory &&
                styles.placeholderText,
            ]}
          >
            {
              selectedCategory
                ?.label ??
              'All categories'
            }
          </Text>


          <Ionicons
            name={
              categoryOpen
                ? 'chevron-up'
                : 'chevron-down'
            }
            size={17}
            color={
              Colors.textMuted
            }
          />

        </Pressable>


        {categoryOpen && (

          <View
            style={
              styles.categoryOptions
            }
          >

            <Pressable
              style={
                styles.categoryOption
              }

              onPress={() => {

                setCategoryId(
                  null
                );

                setCategoryOpen(
                  false
                );

              }}
            >

              <Text
                style={
                  styles.categoryOptionText
                }
              >
                All Categories
              </Text>

            </Pressable>


            {categories.map(
              item => (

                <Pressable
                  key={
                    item.id
                  }

                  style={[
                    styles.categoryOption,

                    categoryId ===
                      item.id &&
                      styles.categoryOptionSelected,
                  ]}

                  onPress={() => {

                    setCategoryId(
                      item.id
                    );

                    setCategoryOpen(
                      false
                    );

                  }}
                >

                  <Text
                    style={[
                      styles.categoryOptionText,

                      categoryId ===
                        item.id &&
                        styles.categoryOptionTextSelected,
                    ]}
                  >
                    {item.label}
                  </Text>


                  {categoryId ===
                    item.id && (

                    <Ionicons
                      name="checkmark"
                      size={17}
                      color={
                        Colors.primary
                      }
                    />

                  )}

                </Pressable>

              )
            )}

          </View>

        )}


        {/* CLEAR FILTERS */}

        {hasFilters && (

          <Pressable
            style={
              styles.clearButton
            }

            onPress={
              clearFilters
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
            Subcontractors
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
              Loading subcontractors...
            </Text>

          </View>

        ) : subcontractors.length ===
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
                name="construct-outline"
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
              No Subcontractors Found
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

          subcontractors.map(
            subcontractor => (

              <SubcontractorCard
                key={
                  subcontractor.id
                }

                subcontractor={
                  subcontractor
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
                loadSubcontractors(
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
                loadSubcontractors(
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
| Subcontractor Card
|--------------------------------------------------------------------------
*/

function SubcontractorCard({
  subcontractor,
}: {
  subcontractor:
    Subcontractor;
}) {

  const active =
    subcontractor.status ===
    'active';


  const isCompany =
    subcontractor.type ===
    'company';


  const categoryName =
    subcontractor.category
      ?.name ??
    '-';


  return (
    <Pressable
      style={({
        pressed,
      }) => [

        styles.subcontractorCard,

        pressed &&
          styles.pressed,

      ]}

      onPress={() =>
        router.push(
          `/(app)/management/subcontractors/${subcontractor.id}` as any
        )
      }
    >

      {/* TOP */}

      <View
        style={
          styles.subcontractorTop
        }
      >

        <View
          style={
            styles.subcontractorIcon
          }
        >

          <Ionicons
            name={
              isCompany
                ? 'business-outline'
                : 'person-outline'
            }
            size={22}
            color={
              Colors.primary
            }
          />

        </View>


        <View
          style={
            styles.subcontractorHeading
          }
        >

          <Text
            style={
              styles.typeText
            }
          >
            {
              isCompany
                ? 'Company'
                : 'Individual'
            }
          </Text>


          <Text
            style={
              styles.subcontractorName
            }

            numberOfLines={2}
          >
            {
              subcontractor.display_name
            }
          </Text>


          <Text
            style={
              styles.categoryText
            }
          >
            {categoryName}
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
            {
              active
                ? 'Active'
                : 'Inactive'
            }
          </Text>

        </View>

      </View>


      {/* INFORMATION */}

      <View
        style={
          styles.infoSection
        }
      >

        <InfoRow
          icon="call-outline"
          label="Phone"
          value={
            subcontractor.phone_number
          }
        />


        <InfoRow
          icon="person-outline"
          label="Contact"
          value={
            subcontractor.contact_person
          }
        />


        <InfoRow
          icon="location-outline"
          label="Address"
          value={
            subcontractor.address
          }
        />


        {isCompany && (

          <InfoRow
            icon="document-text-outline"
            label="TIN"
            value={
              subcontractor.tin_no ||
              '-'
            }
          />

        )}

      </View>


      {/* FOOTER */}

      <View
        style={
          styles.cardFooter
        }
      >

        <View
          style={
            styles.taxBadge
          }
        >

          <Ionicons
            name="cash-outline"
            size={13}
            color={
              Colors.primary
            }
          />


          <Text
            style={
              styles.taxText
            }
          >
            Tax {
              subcontractor.tax_percent
            }%
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
            Details
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
| Info Row
|--------------------------------------------------------------------------
*/

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value:
    | string
    | null
    | undefined;
}) {

  return (
    <View
      style={
        styles.infoRow
      }
    >

      <Ionicons
        name={
          icon as any
        }
        size={14}
        color={
          Colors.textMuted
        }
      />


      <Text
        style={
          styles.infoLabel
        }
      >
        {label}
      </Text>


      <Text
        style={
          styles.infoValue
        }
        numberOfLines={2}
      >
        {value || '-'}
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
          name={
            icon as any
          }
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
        numberOfLines={1}
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

function FilterTitle({
  title,
}: {
  title: string;
}) {

  return (
    <Text
      style={
        styles.filterLabel
      }
    >
      {title}
    </Text>
  );

}


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
      style={[
        styles.filterChip,

        active &&
          styles.filterChipActive,
      ]}

      onPress={
        onPress
      }
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

    /*
    |--------------------------------------------------------------------------
    | Header
    |--------------------------------------------------------------------------
    */

    header: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    backButton: {
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

    /*
    |--------------------------------------------------------------------------
    | Statistics
    |--------------------------------------------------------------------------
    */

    statsContainer: {
      paddingTop: 22,
      paddingBottom: 5,
      gap: 10,
    },

    statCard: {
      width: 108,
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
      fontSize: 8,
      fontFamily:
        Fonts.regular,
      color:
        Colors.textSecondary,
    },

    /*
    |--------------------------------------------------------------------------
    | Search
    |--------------------------------------------------------------------------
    */

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
      fontSize: 11,
      fontFamily:
        Fonts.regular,
      color:
        Colors.text,
    },

    /*
    |--------------------------------------------------------------------------
    | Filters
    |--------------------------------------------------------------------------
    */

    filterLabel: {
      marginTop: 17,
      marginBottom: 9,
      fontSize: 10,
      fontFamily:
        Fonts.bold,
      color:
        Colors.textSecondary,
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

    /*
    |--------------------------------------------------------------------------
    | Category
    |--------------------------------------------------------------------------
    */

    categorySelect: {
      minHeight: 49,
      paddingHorizontal: 14,
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 14,
      backgroundColor:
        Colors.surface,
      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    categorySelectOpen: {
      borderColor:
        Colors.primary,
    },

    categorySelectText: {
      flex: 1,
      marginLeft: 9,
      fontSize: 11,
      fontFamily:
        Fonts.medium,
      color:
        Colors.text,
    },

    placeholderText: {
      color:
        Colors.textMuted,
      fontFamily:
        Fonts.regular,
    },

    categoryOptions: {
      marginTop: 6,
      maxHeight: 260,
      overflow: 'hidden',
      borderRadius: 14,
      backgroundColor:
        Colors.surface,
      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    categoryOption: {
      minHeight: 45,
      paddingHorizontal: 14,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'space-between',
      borderBottomWidth: 1,
      borderBottomColor:
        Colors.border,
    },

    categoryOptionSelected: {
      backgroundColor:
        Colors.primaryLight,
    },

    categoryOptionText: {
      flex: 1,
      fontSize: 10,
      fontFamily:
        Fonts.medium,
      color:
        Colors.text,
    },

    categoryOptionTextSelected: {
      color:
        Colors.primary,
      fontFamily:
        Fonts.bold,
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

    /*
    |--------------------------------------------------------------------------
    | List
    |--------------------------------------------------------------------------
    */

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

    /*
    |--------------------------------------------------------------------------
    | Card
    |--------------------------------------------------------------------------
    */

    subcontractorCard: {
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

    subcontractorTop: {
      flexDirection: 'row',
      alignItems:
        'flex-start',
    },

    subcontractorIcon: {
      width: 44,
      height: 44,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        Colors.primaryLight,
    },

    subcontractorHeading: {
      flex: 1,
      marginLeft: 11,
      marginRight: 8,
    },

    typeText: {
      fontSize: 8,
      fontFamily:
        Fonts.bold,
      color:
        Colors.primary,
    },

    subcontractorName: {
      marginTop: 3,
      fontSize: 13,
      lineHeight: 18,
      fontFamily:
        Fonts.bold,
      color:
        Colors.text,
    },

    categoryText: {
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

    /*
    |--------------------------------------------------------------------------
    | Info
    |--------------------------------------------------------------------------
    */

    infoSection: {
      marginTop: 13,
      paddingTop: 5,
      borderTopWidth: 1,
      borderTopColor:
        Colors.border,
    },

    infoRow: {
      minHeight: 38,
      flexDirection: 'row',
      alignItems: 'center',
    },

    infoLabel: {
      marginLeft: 6,
      width: 58,
      fontSize: 8,
      fontFamily:
        Fonts.medium,
      color:
        Colors.textMuted,
    },

    infoValue: {
      flex: 1,
      textAlign: 'right',
      fontSize: 9,
      lineHeight: 14,
      fontFamily:
        Fonts.semiBold,
      color:
        Colors.text,
    },

    /*
    |--------------------------------------------------------------------------
    | Footer
    |--------------------------------------------------------------------------
    */

    cardFooter: {
      marginTop: 12,
      paddingTop: 11,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'space-between',
      borderTopWidth: 1,
      borderTopColor:
        Colors.border,
    },

    taxBadge: {
      paddingHorizontal: 8,
      paddingVertical: 5,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      borderRadius: 9,
      backgroundColor:
        Colors.primaryLight,
    },

    taxText: {
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

    /*
    |--------------------------------------------------------------------------
    | Pagination
    |--------------------------------------------------------------------------
    */

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
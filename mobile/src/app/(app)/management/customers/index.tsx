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
  Customer,
  CustomerStatistics,
  CustomerStatus,
  CustomerType,
  customersApi,
} from '../../../../api/customersApi';

import {
  Colors,
} from '../../../../constants/colors';

import {
  Fonts,
} from '../../../../constants/fonts';


type StatusFilter =
  | ''
  | CustomerStatus;

type TypeFilter =
  | ''
  | CustomerType;

type BooleanFilter =
  | ''
  | 'yes'
  | 'no';


const emptyStatistics: CustomerStatistics = {
  total: 0,
  active: 0,
  inactive: 0,
  individuals: 0,
  companies: 0,
  with_withhold: 0,
  without_withhold: 0,
  deleted: 0,
};


export default function CustomersScreen() {

  const [
    customers,
    setCustomers,
  ] =
    useState<Customer[]>([]);


  const [
    statistics,
    setStatistics,
  ] =
    useState<CustomerStatistics>(
      emptyStatistics
    );


  const [
    search,
    setSearch,
  ] =
    useState('');


  const [
    customerType,
    setCustomerType,
  ] =
    useState<TypeFilter>('');


  const [
    customerStatus,
    setCustomerStatus,
  ] =
    useState<StatusFilter>('');


  const [
    withhold,
    setWithhold,
  ] =
    useState<BooleanFilter>('');


  const [
    withholdAdvance,
    setWithholdAdvance,
  ] =
    useState<BooleanFilter>('');


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
  | Load Customers
  |--------------------------------------------------------------------------
  */

  const loadCustomers =
    useCallback(
      async (
        requestedPage = 1
      ) => {

        try {

          const result =
            await customersApi.list({

              search:
                search.trim() ||
                undefined,

              customer_type:
                customerType ||
                undefined,

              customer_status:
                customerStatus ||
                undefined,

              withhold:
                withhold === 'yes'
                  ? true
                  : withhold === 'no'
                  ? false
                  : undefined,

              withhold_from_advance:
                withholdAdvance === 'yes'
                  ? true
                  : withholdAdvance === 'no'
                  ? false
                  : undefined,

              page:
                requestedPage,

              per_page:
                10,

              sort_by:
                'id',

              sort_direction:
                'desc',

            });


          setCustomers(
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
            'CUSTOMER LIST ERROR:',
            error?.response?.data ??
            error
          );


          setCustomers([]);

        } finally {

          setLoading(false);
          setRefreshing(false);

        }

      },
      [
        search,
        customerType,
        customerStatus,
        withhold,
        withholdAdvance,
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
            await customersApi
              .statistics();


          setStatistics(
            result
          );

        } catch (error: any) {

          console.log(
            'CUSTOMER STATISTICS ERROR:',
            error?.response?.data ??
            error
          );

        }

      },
      []
    );


  /*
  |--------------------------------------------------------------------------
  | Load
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    loadStatistics();

  }, [
    loadStatistics,
  ]);


  useEffect(() => {

    const timer =
      setTimeout(() => {

        setLoading(true);

        loadCustomers(1);

      }, 300);


    return () =>
      clearTimeout(timer);

  }, [
    search,
    customerType,
    customerStatus,
    withhold,
    withholdAdvance,
    loadCustomers,
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
        loadCustomers(page),
        loadStatistics(),
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

      setCustomerType('');

      setCustomerStatus('');

      setWithhold('');

      setWithholdAdvance('');

      setPage(1);

    };


  const hasFilters =
    search !== '' ||
    customerType !== '' ||
    customerStatus !== '' ||
    withhold !== '' ||
    withholdAdvance !== '';


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
              styles.headerContent
            }
          >

            <Text
              style={
                styles.title
              }
            >
              Customers
            </Text>


            <Text
              style={
                styles.subtitle
              }
            >
              Customer master data
            </Text>

          </View>


          <Pressable
            style={
              styles.addButton
            }
            onPress={() =>
              router.push(
                '/(app)/management/customers/create' as any
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
            icon="person-outline"
            label="Individuals"
            value={
              statistics.individuals
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
            icon="cash-outline"
            label="With Withhold"
            value={
              statistics.with_withhold
            }
          />


          <StatCard
            icon="remove-circle-outline"
            label="Without"
            value={
              statistics.without_withhold
            }
          />


          <Pressable
            onPress={() =>
              router.push(
                '/(app)/management/customers/deleted' as any
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

            placeholder="Search customer, phone, TIN..."

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


        {/* TYPE FILTER */}

        <Text
          style={
            styles.filterLabel
          }
        >
          Customer Type
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
              customerType === ''
            }
            onPress={() =>
              setCustomerType('')
            }
          />


          <FilterChip
            label="Individual"
            active={
              customerType ===
              'individual'
            }
            onPress={() =>
              setCustomerType(
                'individual'
              )
            }
          />


          <FilterChip
            label="Company"
            active={
              customerType ===
              'company'
            }
            onPress={() =>
              setCustomerType(
                'company'
              )
            }
          />

        </ScrollView>


        {/* STATUS */}

        <Text
          style={
            styles.filterLabel
          }
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
              customerStatus === ''
            }
            onPress={() =>
              setCustomerStatus('')
            }
          />


          <FilterChip
            label="Active"
            active={
              customerStatus ===
              'active'
            }
            onPress={() =>
              setCustomerStatus(
                'active'
              )
            }
          />


          <FilterChip
            label="Inactive"
            active={
              customerStatus ===
              'inactive'
            }
            onPress={() =>
              setCustomerStatus(
                'inactive'
              )
            }
          />

        </ScrollView>


        {/* WITHHOLD */}

        <Text
          style={
            styles.filterLabel
          }
        >
          Withhold
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
              withhold === ''
            }
            onPress={() =>
              setWithhold('')
            }
          />


          <FilterChip
            label="Yes"
            active={
              withhold === 'yes'
            }
            onPress={() =>
              setWithhold(
                'yes'
              )
            }
          />


          <FilterChip
            label="No"
            active={
              withhold === 'no'
            }
            onPress={() =>
              setWithhold(
                'no'
              )
            }
          />

        </ScrollView>


        {/* WITHHOLD ADVANCE */}

        <Text
          style={
            styles.filterLabel
          }
        >
          Withhold From Advance
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
              withholdAdvance === ''
            }
            onPress={() =>
              setWithholdAdvance('')
            }
          />


          <FilterChip
            label="Yes"
            active={
              withholdAdvance ===
              'yes'
            }
            onPress={() =>
              setWithholdAdvance(
                'yes'
              )
            }
          />


          <FilterChip
            label="No"
            active={
              withholdAdvance ===
              'no'
            }
            onPress={() =>
              setWithholdAdvance(
                'no'
              )
            }
          />

        </ScrollView>


        {/* CLEAR */}

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
            Customers
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
              Loading customers...
            </Text>

          </View>

        ) : customers.length ===
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
                name="people-outline"
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
              No Customers Found
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

          customers.map(
            customer => (

              <CustomerCard
                key={
                  customer.id
                }
                customer={
                  customer
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
                loadCustomers(
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
                loadCustomers(
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
| Customer Card
|--------------------------------------------------------------------------
*/

function CustomerCard({
  customer,
}: {
  customer: Customer;
}) {

  const active =
    customer.customer_status ===
    'active';


  const isCompany =
    customer.customer_type ===
    'company';


  const hasWithhold =
    toBoolean(
      customer.withhold
    );


  return (
    <Pressable
      onPress={() =>
        router.push(
          `/(app)/management/customers/${customer.id}` as any
        )
      }

      style={({
        pressed,
      }) => [

        styles.customerCard,

        pressed &&
          styles.pressed,

      ]}
    >

      {/* TOP */}

      <View
        style={
          styles.customerTop
        }
      >

        <View
          style={
            styles.customerIcon
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
            styles.customerHeading
          }
        >

          <Text
            style={
              styles.customerNo
            }
          >
            {customer.customer_no}
          </Text>


          <Text
            style={
              styles.customerName
            }
            numberOfLines={2}
          >
            {customer.display_name}
          </Text>


          <Text
            style={
              styles.customerTypeText
            }
          >
            {
              isCompany
                ? 'Company'
                : 'Individual'
            }
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


      <InfoRow
        icon="call-outline"
        value={
          customer.phone_number ||
          '-'
        }
      />


      <InfoRow
        icon="location-outline"
        value={
          customer.location ||
          '-'
        }
      />


      <InfoRow
        icon="mail-outline"
        value={
          customer.email_address ||
          '-'
        }
      />


      {/* FOOTER */}

      <View
        style={
          styles.cardFooter
        }
      >

        <View
          style={
            styles.withholdBadge
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
              styles.withholdText
            }
          >
            {
              hasWithhold
                ? `Withhold ${
                    customer.withhold_percent ??
                    '-'
                  }%`
                : 'No Withhold'
            }
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
| Info Row
|--------------------------------------------------------------------------
*/

function InfoRow({
  icon,
  value,
}: {
  icon: string;
  value: string;
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
        size={15}
        color={
          Colors.textMuted
        }
      />


      <Text
        style={
          styles.infoText
        }
        numberOfLines={2}
      >
        {value}
      </Text>

    </View>
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
      onPress={
        onPress
      }

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
| Boolean Helper
|--------------------------------------------------------------------------
*/

function toBoolean(
  value: unknown
) {

  return (
    value === true ||
    value === 1 ||
    value === '1' ||
    value === 'true' ||
    value === 'Yes'
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

    customerCard: {
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

    customerTop: {
      flexDirection: 'row',
      alignItems:
        'flex-start',
    },

    customerIcon: {
      width: 44,
      height: 44,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        Colors.primaryLight,
    },

    customerHeading: {
      flex: 1,
      marginLeft: 11,
      marginRight: 8,
    },

    customerNo: {
      fontSize: 9,
      fontFamily:
        Fonts.bold,
      color:
        Colors.primary,
    },

    customerName: {
      marginTop: 3,
      fontSize: 13,
      lineHeight: 18,
      fontFamily:
        Fonts.bold,
      color:
        Colors.text,
    },

    customerTypeText: {
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

    infoRow: {
      marginTop: 10,
      flexDirection: 'row',
      alignItems:
        'flex-start',
    },

    infoText: {
      flex: 1,
      marginLeft: 7,
      fontSize: 10,
      lineHeight: 15,
      fontFamily:
        Fonts.regular,
      color:
        Colors.textSecondary,
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

    withholdBadge: {
      maxWidth: '62%',
      paddingHorizontal: 9,
      paddingVertical: 6,
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 9,
      backgroundColor:
        Colors.primaryLight,
    },

    withholdText: {
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
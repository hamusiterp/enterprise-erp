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
  Purchaser,
  PurchaserStatistics,
  PurchaserStatus,
  purchasersApi,
} from '../../../../api/purchasersApi';

import {
  Colors,
} from '../../../../constants/colors';

import {
  Fonts,
} from '../../../../constants/fonts';


type StatusFilter =
  | ''
  | PurchaserStatus;


const emptyStatistics: PurchaserStatistics = {

  total: 0,

  active: 0,

  inactive: 0,

  deleted: 0,

  with_accounts: 0,

  without_accounts: 0,

  total_accounts: 0,

};


export default function PurchasersScreen() {

  /*
  |--------------------------------------------------------------------------
  | Data
  |--------------------------------------------------------------------------
  */

  const [
    purchasers,
    setPurchasers,
  ] =
    useState<Purchaser[]>([]);


  const [
    statistics,
    setStatistics,
  ] =
    useState<PurchaserStatistics>(
      emptyStatistics
    );


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
    status,
    setStatus,
  ] =
    useState<StatusFilter>('');


  const [
    dateFrom,
    setDateFrom,
  ] =
    useState('');


  const [
    dateTo,
    setDateTo,
  ] =
    useState('');


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
  | Load Purchasers
  |--------------------------------------------------------------------------
  */

  const loadPurchasers =
    useCallback(
      async (
        requestedPage = 1
      ) => {

        try {

          const result =
            await purchasersApi.list({

              search:
                search.trim() ||
                undefined,

              status:
                status ||
                undefined,

              date_from:
                dateFrom.trim() ||
                undefined,

              date_to:
                dateTo.trim() ||
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


          setPurchasers(
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
            'PURCHASER LIST ERROR:',
            error?.response?.data ??
            error
          );


          setPurchasers([]);

        } finally {

          setLoading(false);

          setRefreshing(false);

        }

      },
      [
        search,
        status,
        dateFrom,
        dateTo,
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
            await purchasersApi
              .statistics();


          setStatistics(
            result
          );

        } catch (error: any) {

          console.log(
            'PURCHASER STATISTICS ERROR:',
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

        loadPurchasers(1);

      }, 300);


    return () =>
      clearTimeout(timer);

  }, [
    search,
    status,
    dateFrom,
    dateTo,
    loadPurchasers,
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

        loadPurchasers(page),

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

      setStatus('');

      setDateFrom('');

      setDateTo('');

      setPage(1);

    };


  const hasFilters =
    search !== '' ||
    status !== '' ||
    dateFrom !== '' ||
    dateTo !== '';


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
              Purchasers
            </Text>


            <Text
              style={
                styles.subtitle
              }
            >
              Purchasers and bank accounts
            </Text>

          </View>


          <Pressable
            style={
              styles.addButton
            }

            onPress={() =>
              router.push(
                '/(app)/management/purchasers/create' as any
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
            icon="card-outline"
            label="With Accounts"
            value={
              statistics.with_accounts
            }
          />


          <StatCard
            icon="remove-circle-outline"
            label="No Accounts"
            value={
              statistics.without_accounts
            }
          />


          <StatCard
            icon="wallet-outline"
            label="Accounts"
            value={
              statistics.total_accounts
            }
          />


          {/*
            We will enable navigation on this
            card after adding the missing
            deleted-list backend endpoint.
          */}

          <StatCard
            icon="trash-outline"
            label="Deleted"
            value={
              statistics.deleted
            }
          />

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

            placeholder="Search purchaser name or number..."

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


        {/* DATE FILTER */}

        <Text
          style={
            styles.filterLabel
          }
        >
          Registration Date
        </Text>


        <View
          style={
            styles.dateRow
          }
        >

          <View
            style={
              styles.dateInputBox
            }
          >

            <Ionicons
              name="calendar-outline"
              size={17}
              color={
                Colors.textMuted
              }
            />


            <TextInput
              value={
                dateFrom
              }

              onChangeText={
                setDateFrom
              }

              placeholder="From YYYY-MM-DD"

              placeholderTextColor={
                Colors.textMuted
              }

              maxLength={10}

              keyboardType="numbers-and-punctuation"

              style={
                styles.dateInput
              }
            />

          </View>


          <View
            style={
              styles.dateInputBox
            }
          >

            <Ionicons
              name="calendar-outline"
              size={17}
              color={
                Colors.textMuted
              }
            />


            <TextInput
              value={
                dateTo
              }

              onChangeText={
                setDateTo
              }

              placeholder="To YYYY-MM-DD"

              placeholderTextColor={
                Colors.textMuted
              }

              maxLength={10}

              keyboardType="numbers-and-punctuation"

              style={
                styles.dateInput
              }
            />

          </View>

        </View>


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
            Purchasers
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
              Loading purchasers...
            </Text>

          </View>

        ) : purchasers.length ===
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
              No Purchasers Found
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

          purchasers.map(
            purchaser => (

              <PurchaserCard
                key={
                  purchaser.id
                }

                purchaser={
                  purchaser
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
                loadPurchasers(
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
                loadPurchasers(
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
| Purchaser Card
|--------------------------------------------------------------------------
*/

function PurchaserCard({
  purchaser,
}: {
  purchaser: Purchaser;
}) {

  const active =
    purchaser.status ===
    'active';


  const primary =
    purchaser.primary_account;


  const bankName =
    primary
      ?.bank
      ?.name ??
    'No primary bank';


  const accountNumber =
    primary
      ?.account_number ??
    'No primary account';


  const accountCount =
    purchaser.accounts_count ??
    0;


  const activeAccountCount =
    purchaser
      .active_accounts_count ??
    0;


  return (
    <Pressable
      style={({
        pressed,
      }) => [

        styles.purchaserCard,

        pressed &&
          styles.pressed,

      ]}

      onPress={() =>
        router.push(
          `/(app)/management/purchasers/${purchaser.id}` as any
        )
      }
    >

      {/* HEADER */}

      <View
        style={
          styles.purchaserTop
        }
      >

        <View
          style={
            styles.purchaserIcon
          }
        >

          <Ionicons
            name="person-outline"
            size={22}
            color={
              Colors.primary
            }
          />

        </View>


        <View
          style={
            styles.purchaserHeading
          }
        >

          <Text
            style={
              styles.purchaserNo
            }
          >
            {purchaser.purchaser_no}
          </Text>


          <Text
            style={
              styles.purchaserName
            }

            numberOfLines={2}
          >
            {purchaser.purchaser_name}
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


      {/* PRIMARY ACCOUNT */}

      <View
        style={
          styles.primaryAccountCard
        }
      >

        <View
          style={
            styles.primaryTitleRow
          }
        >

          <Ionicons
            name="star-outline"
            size={15}
            color={
              Colors.primary
            }
          />


          <Text
            style={
              styles.primaryTitle
            }
          >
            Primary Account
          </Text>

        </View>


        <View
          style={
            styles.accountRow
          }
        >

          <View
            style={
              styles.accountIcon
            }
          >

            <Ionicons
              name="business-outline"
              size={16}
              color={
                Colors.textSecondary
              }
            />

          </View>


          <View
            style={
              styles.accountContent
            }
          >

            <Text
              style={
                styles.bankName
              }
              numberOfLines={1}
            >
              {bankName}
            </Text>


            <Text
              style={
                styles.accountNumber
              }
              numberOfLines={1}
            >
              {accountNumber}
            </Text>


            {primary?.currency && (

              <Text
                style={
                  styles.currencyText
                }
              >
                {primary.currency}
              </Text>

            )}

          </View>

        </View>

      </View>


      {/* ACCOUNT COUNTS */}

      <View
        style={
          styles.accountStats
        }
      >

        <View
          style={
            styles.accountStat
          }
        >

          <Text
            style={
              styles.accountStatValue
            }
          >
            {accountCount}
          </Text>


          <Text
            style={
              styles.accountStatLabel
            }
          >
            Accounts
          </Text>

        </View>


        <View
          style={
            styles.statDivider
          }
        />


        <View
          style={
            styles.accountStat
          }
        >

          <Text
            style={
              styles.accountStatValue
            }
          >
            {activeAccountCount}
          </Text>


          <Text
            style={
              styles.accountStatLabel
            }
          >
            Active
          </Text>

        </View>


        <View
          style={
            styles.statDivider
          }
        />


        <View
          style={
            styles.accountStat
          }
        >

          <Text
            style={
              styles.accountStatValue
            }
          >
            {
              purchaser
                .date_registered ??
              '-'
            }
          </Text>


          <Text
            style={
              styles.accountStatLabel
            }
          >
            Registered
          </Text>

        </View>

      </View>


      {/* FOOTER */}

      <View
        style={
          styles.cardFooter
        }
      >

        <View
          style={
            styles.registeredRow
          }
        >

          <Ionicons
            name="person-circle-outline"
            size={14}
            color={
              Colors.textMuted
            }
          />


          <Text
            style={
              styles.registeredText
            }
            numberOfLines={1}
          >
            {
              purchaser.registered_by ||
              'System'
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
    | Search / Filters
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

    dateRow: {
      flexDirection: 'row',
      gap: 8,
    },

    dateInputBox: {
      flex: 1,
      height: 48,
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

    dateInput: {
      flex: 1,
      marginLeft: 6,
      fontSize: 9,
      fontFamily:
        Fonts.regular,
      color:
        Colors.text,
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
    | Purchaser Card
    |--------------------------------------------------------------------------
    */

    purchaserCard: {
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

    purchaserTop: {
      flexDirection: 'row',
      alignItems:
        'flex-start',
    },

    purchaserIcon: {
      width: 44,
      height: 44,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        Colors.primaryLight,
    },

    purchaserHeading: {
      flex: 1,
      marginLeft: 11,
      marginRight: 8,
    },

    purchaserNo: {
      fontSize: 9,
      fontFamily:
        Fonts.bold,
      color:
        Colors.primary,
    },

    purchaserName: {
      marginTop: 3,
      fontSize: 13,
      lineHeight: 18,
      fontFamily:
        Fonts.bold,
      color:
        Colors.text,
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
    | Primary Account
    |--------------------------------------------------------------------------
    */

    primaryAccountCard: {
      marginTop: 14,
      padding: 12,
      borderRadius: 14,
      backgroundColor:
        Colors.background,
      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    primaryTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    primaryTitle: {
      marginLeft: 5,
      fontSize: 9,
      fontFamily:
        Fonts.bold,
      color:
        Colors.primary,
    },

    accountRow: {
      marginTop: 9,
      flexDirection: 'row',
      alignItems: 'center',
    },

    accountIcon: {
      width: 36,
      height: 36,
      borderRadius: 11,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        Colors.surface,
    },

    accountContent: {
      flex: 1,
      marginLeft: 9,
    },

    bankName: {
      fontSize: 10,
      fontFamily:
        Fonts.bold,
      color:
        Colors.text,
    },

    accountNumber: {
      marginTop: 2,
      fontSize: 9,
      fontFamily:
        Fonts.medium,
      color:
        Colors.textSecondary,
    },

    currencyText: {
      marginTop: 3,
      fontSize: 8,
      fontFamily:
        Fonts.bold,
      color:
        Colors.primary,
    },

    /*
    |--------------------------------------------------------------------------
    | Counts
    |--------------------------------------------------------------------------
    */

    accountStats: {
      marginTop: 12,
      minHeight: 57,
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 13,
      backgroundColor:
        Colors.background,
    },

    accountStat: {
      flex: 1,
      alignItems: 'center',
      paddingHorizontal: 4,
    },

    accountStatValue: {
      fontSize: 10,
      textAlign: 'center',
      fontFamily:
        Fonts.bold,
      color:
        Colors.text,
    },

    accountStatLabel: {
      marginTop: 3,
      fontSize: 7,
      textAlign: 'center',
      fontFamily:
        Fonts.regular,
      color:
        Colors.textMuted,
    },

    statDivider: {
      width: 1,
      height: 28,
      backgroundColor:
        Colors.border,
    },

    /*
    |--------------------------------------------------------------------------
    | Footer
    |--------------------------------------------------------------------------
    */

    cardFooter: {
      marginTop: 13,
      paddingTop: 11,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'space-between',
      borderTopWidth: 1,
      borderTopColor:
        Colors.border,
    },

    registeredRow: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 10,
    },

    registeredText: {
      flex: 1,
      marginLeft: 4,
      fontSize: 8,
      fontFamily:
        Fonts.medium,
      color:
        Colors.textMuted,
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
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
  useState,
} from 'react';

import {
  Colors,
} from '../../../../constants/colors';

import {
  Fonts,
} from '../../../../constants/fonts';

import {
  Bank,
  banksApi,
} from '../../../../api/banksApi';


type StatusFilter =
  | 'all'
  | 'active'
  | 'inactive';


export default function BanksScreen() {

  const [
    banks,
    setBanks,
  ] = useState<Bank[]>([]);

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
    statusFilter,
    setStatusFilter,
  ] =
    useState<StatusFilter>('all');

  const [
    total,
    setTotal,
  ] = useState(0);


  /*
  |--------------------------------------------------------------------------
  | Load Banks
  |--------------------------------------------------------------------------
  */

  const loadBanks =
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
            sort_by: 'bank_name',
            sort_direction: 'asc',
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


          const result =
            await banksApi.list(
              params
            );


          setBanks(
            result.data
          );

          setTotal(
            result.pagination.total
          );

        } catch (error: any) {

          console.log(
            'Banks loading error:',
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


  /*
  |--------------------------------------------------------------------------
  | Refresh when screen gains focus
  |--------------------------------------------------------------------------
  */

  useFocusEffect(
    useCallback(() => {

      loadBanks();

    }, [
      loadBanks,
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
            Banks
          </Text>

          <Text
            style={
              styles.subtitle
            }
          >
            Banking & credit facilities
          </Text>

        </View>
            <Pressable
   style={styles.addButton}
  onPress={() =>
    router.push(
      '/(app)/management/banks/deleted' as any
    )
  }
>
  <Ionicons
    name="trash-outline"
    size={20}
    color={Colors.danger}
  />
</Pressable>

        <Pressable
          style={
            styles.addButton
          }
          onPress={() =>
            router.push(
              '/(app)/management/banks/create'
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
            name="business-outline"
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
            {total}
          </Text>

          <Text
            style={
              styles.summaryLabel
            }
          >
            Registered banks
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
          value={
            search
          }

          onChangeText={
            setSearch
          }

          placeholder="Search bank, account or branch..."

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
            Loading banks...
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
                loadBanks(true)
              }

              tintColor={
                Colors.primary
              }
            />

          }
        >

          {banks.length === 0 ? (

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
                  name="business-outline"
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
                No banks found
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

            banks.map(
              (bank) => (

                <BankCard
                  key={bank.id}
                  bank={bank}
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
| Bank Card
|--------------------------------------------------------------------------
*/

function BankCard({
  bank,
}: {
  bank: Bank;
}) {

  const active =
    bank.status === 'active';


  return (
    <Pressable
      onPress={() =>
        router.push(
          `/(app)/management/banks/${bank.id}` as any
        )
      }

      style={({
        pressed,
      }) => [
        styles.bankCard,

        pressed &&
          styles.cardPressed,
      ]}
    >

      {/* ICON */}

      <View
        style={
          styles.bankIcon
        }
      >

        <Ionicons
          name="business-outline"
          size={24}
          color={
            Colors.primary
          }
        />

      </View>


      {/* CONTENT */}

      <View
        style={
          styles.bankContent
        }
      >

        <Text
          style={
            styles.bankName
          }
          numberOfLines={1}
        >
          {bank.bank_name}
        </Text>


        <Text
          style={
            styles.bankCode
          }
        >
          {bank.bank_id}
        </Text>


        <View
          style={
            styles.accountRow
          }
        >

          <Ionicons
            name="card-outline"
            size={13}
            color={
              Colors.textSecondary
            }
          />

          <Text
            style={
              styles.accountText
            }
            numberOfLines={1}
          >
            {bank.account_no}
          </Text>

        </View>


        <View
          style={
            styles.branchRow
          }
        >

          <Ionicons
            name="location-outline"
            size={13}
            color={
              Colors.textSecondary
            }
          />

          <Text
            style={
              styles.branchText
            }
            numberOfLines={1}
          >
            {bank.branch}
          </Text>

        </View>


        {/* FEATURES */}

        <View
          style={
            styles.featureRow
          }
        >

          {bank.od_available ===
          'Yes' && (

            <View
              style={
                styles.featureBadge
              }
            >

              <Text
                style={
                  styles.featureText
                }
              >
                OD
              </Text>

            </View>

          )}


          {bank.term_loan ===
          'Yes' && (

            <View
              style={
                styles.featureBadge
              }
            >

              <Text
                style={
                  styles.featureText
                }
              >
                TERM LOAN
              </Text>

            </View>

          )}


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

    bankCard: {
      minHeight: 145,

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

    bankIcon: {
      width: 52,
      height: 52,

      borderRadius: 17,

      alignItems: 'center',
      justifyContent: 'center',

      backgroundColor:
        Colors.primaryLight,
    },

    bankContent: {
      flex: 1,
      marginLeft: 13,
    },

    bankName: {
      fontSize: 14,
      fontFamily:
        Fonts.bold,

      color:
        Colors.text,
    },

    bankCode: {
      marginTop: 2,

      fontSize: 10,

      fontFamily:
        Fonts.medium,

      color:
        Colors.textMuted,
    },

    accountRow: {
      marginTop: 7,

      flexDirection: 'row',
      alignItems: 'center',
    },

    accountText: {
      flex: 1,

      marginLeft: 5,

      fontSize: 11,

      fontFamily:
        Fonts.medium,

      color:
        Colors.textSecondary,
    },

    branchRow: {
      marginTop: 5,

      flexDirection: 'row',
      alignItems: 'center',
    },

    branchText: {
      flex: 1,

      marginLeft: 5,

      fontSize: 10,

      fontFamily:
        Fonts.regular,

      color:
        Colors.textSecondary,
    },

    featureRow: {
      marginTop: 10,

      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',

      gap: 6,
    },

    featureBadge: {
      paddingHorizontal: 7,
      paddingVertical: 4,

      borderRadius: 8,

      backgroundColor:
        Colors.primaryLight,
    },

    featureText: {
      fontSize: 8,

      fontFamily:
        Fonts.bold,

      color:
        Colors.primary,
    },

    statusRow: {
      marginLeft: 2,

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
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
  FixedAsset,
  FixedAssetCondition,
  FixedAssetReadingType,
  FixedAssetStatistics,
  FixedAssetStatus,
  fixedAssetsApi,
} from '../../../../api/fixedAssetsApi';

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


type StatusFilter =
  | ''
  | FixedAssetStatus;


type ConditionFilter =
  | ''
  | FixedAssetCondition;


type ReadingFilter =
  | ''
  | FixedAssetReadingType;


type GaugeFilter =
  | ''
  | 'yes'
  | 'no';


const emptyStatistics: FixedAssetStatistics = {

  total: 0,

  active: 0,

  inactive: 0,

  excellent: 0,

  good: 0,

  fair: 0,

  poor: 0,

  out_of_service: 0,

  with_gauge: 0,

  without_gauge: 0,

  deleted: 0,

};


export default function FixedAssetsScreen() {

  /*
  |--------------------------------------------------------------------------
  | Data
  |--------------------------------------------------------------------------
  */

  const [
    assets,
    setAssets,
  ] =
    useState<FixedAsset[]>([]);


  const [
    statistics,
    setStatistics,
  ] =
    useState<FixedAssetStatistics>(
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
    status,
    setStatus,
  ] =
    useState<StatusFilter>('');


  const [
    condition,
    setCondition,
  ] =
    useState<ConditionFilter>('');


  const [
    readingType,
    setReadingType,
  ] =
    useState<ReadingFilter>('');


  const [
    gauge,
    setGauge,
  ] =
    useState<GaugeFilter>('');


  const [
    fuelType,
    setFuelType,
  ] =
    useState('');


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
  | Load Assets
  |--------------------------------------------------------------------------
  */

  const loadAssets =
    useCallback(
      async (
        requestedPage = 1
      ) => {

        try {

          const result =
            await fixedAssetsApi.list({

              search:
                search.trim() ||
                undefined,

              category_id:
                categoryId ??
                undefined,

              status:
                status ||
                undefined,

              asset_condition:
                condition ||
                undefined,

              reading_type:
                readingType ||
                undefined,

              type_of_fuel:
                fuelType.trim() ||
                undefined,

              has_gauge:
                gauge === 'yes'
                  ? true
                  : gauge === 'no'
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


          setAssets(
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
            'FIXED ASSET LIST ERROR:',
            error?.response?.data ??
            error
          );


          setAssets([]);

        } finally {

          setLoading(false);

          setRefreshing(false);

        }

      },
      [
        search,
        categoryId,
        status,
        condition,
        readingType,
        fuelType,
        gauge,
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
            await fixedAssetsApi
              .statistics();


          setStatistics(
            result
          );

        } catch (error: any) {

          console.log(
            'FIXED ASSET STATISTICS ERROR:',
            error?.response?.data ??
            error
          );

        }

      },
      []
    );


  /*
  |--------------------------------------------------------------------------
  | Categories
  |--------------------------------------------------------------------------
  */

  const loadCategories =
    useCallback(
      async () => {

        try {

          /*
           * Do not hard-code a category type here.
           * Fixed Asset validation accepts any valid
           * sales_category ID.
           */

          const result =
            await categoriesApi.options();


          setCategories(
            result ?? []
          );

        } catch (error: any) {

          console.log(
            'FIXED ASSET CATEGORY ERROR:',
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

        loadAssets(1);

      }, 300);


    return () =>
      clearTimeout(timer);

  }, [
    search,
    categoryId,
    status,
    condition,
    readingType,
    fuelType,
    gauge,
    loadAssets,
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
        loadAssets(page),
        loadStatistics(),
        loadCategories(),
      ]);

    };


  /*
  |--------------------------------------------------------------------------
  | Clear
  |--------------------------------------------------------------------------
  */

  const clearFilters =
    () => {

      setSearch('');

      setCategoryId(null);

      setStatus('');

      setCondition('');

      setReadingType('');

      setFuelType('');

      setGauge('');

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
    categoryId !== null ||
    status !== '' ||
    condition !== '' ||
    readingType !== '' ||
    fuelType !== '' ||
    gauge !== '';


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
              Fixed Assets
            </Text>


            <Text
              style={
                styles.subtitle
              }
            >
              Vehicles, machinery & asset records
            </Text>

          </View>


          <Pressable
            style={
              styles.addButton
            }

            onPress={() =>
              router.push(
                '/(app)/management/fixed-assets/create' as any
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
            icon="car-outline"
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
            icon="sparkles-outline"
            label="Excellent"
            value={
              statistics.excellent
            }
          />


          <StatCard
            icon="checkmark-outline"
            label="Good"
            value={
              statistics.good
            }
          />


          <StatCard
            icon="remove-outline"
            label="Fair"
            value={
              statistics.fair
            }
          />


          <StatCard
            icon="warning-outline"
            label="Poor"
            value={
              statistics.poor
            }
          />


          <StatCard
            icon="close-circle-outline"
            label="Out of Service"
            value={
              statistics.out_of_service
            }
          />


          <StatCard
            icon="speedometer-outline"
            label="With Gauge"
            value={
              statistics.with_gauge
            }
          />


          <StatCard
            icon="remove-circle-outline"
            label="No Gauge"
            value={
              statistics.without_gauge
            }
          />


          <Pressable
            onPress={() =>
              router.push(
                '/(app)/management/fixed-assets/deleted' as any
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

            placeholder="Search asset, vehicle, plate, tag..."

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


        {/* CONDITION */}

        <FilterTitle
          title="Condition"
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
              condition === ''
            }
            onPress={() =>
              setCondition('')
            }
          />


          <FilterChip
            label="Excellent"
            active={
              condition ===
              'excellent'
            }
            onPress={() =>
              setCondition(
                'excellent'
              )
            }
          />


          <FilterChip
            label="Good"
            active={
              condition ===
              'good'
            }
            onPress={() =>
              setCondition(
                'good'
              )
            }
          />


          <FilterChip
            label="Fair"
            active={
              condition ===
              'fair'
            }
            onPress={() =>
              setCondition(
                'fair'
              )
            }
          />


          <FilterChip
            label="Poor"
            active={
              condition ===
              'poor'
            }
            onPress={() =>
              setCondition(
                'poor'
              )
            }
          />


          <FilterChip
            label="Out of Service"
            active={
              condition ===
              'out_of_service'
            }
            onPress={() =>
              setCondition(
                'out_of_service'
              )
            }
          />

        </ScrollView>


        {/* READING */}

        <FilterTitle
          title="Reading Type"
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
              readingType === ''
            }
            onPress={() =>
              setReadingType('')
            }
          />


          <FilterChip
            label="Engine Horse Power"
            active={
              readingType ===
              'engine_horse_power'
            }
            onPress={() =>
              setReadingType(
                'engine_horse_power'
              )
            }
          />


          <FilterChip
            label="KM Reading"
            active={
              readingType ===
              'km_reading'
            }
            onPress={() =>
              setReadingType(
                'km_reading'
              )
            }
          />

        </ScrollView>


        {/* GAUGE */}

        <FilterTitle
          title="Gauge"
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
              gauge === ''
            }
            onPress={() =>
              setGauge('')
            }
          />


          <FilterChip
            label="Has Gauge"
            active={
              gauge === 'yes'
            }
            onPress={() =>
              setGauge(
                'yes'
              )
            }
          />


          <FilterChip
            label="No Gauge"
            active={
              gauge === 'no'
            }
            onPress={() =>
              setGauge(
                'no'
              )
            }
          />

        </ScrollView>


        {/* FUEL */}

        <FilterTitle
          title="Fuel Type"
        />


        <View
          style={
            styles.smallInputBox
          }
        >

          <Ionicons
            name="flame-outline"
            size={18}
            color={
              Colors.textMuted
            }
          />


          <TextInput
            value={
              fuelType
            }

            onChangeText={
              setFuelType
            }

            placeholder="Example: Diesel, Petrol..."

            placeholderTextColor={
              Colors.textMuted
            }

            style={
              styles.searchInput
            }
          />


          {fuelType !== '' && (

            <Pressable
              onPress={() =>
                setFuelType('')
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


        {/* CATEGORY */}

        <FilterTitle
          title="Asset Category"
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
              Colors.textMuted
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
              'All asset categories'
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

                    item.id ===
                      categoryId &&
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

                      item.id ===
                        categoryId &&
                        styles.categoryOptionTextSelected,
                    ]}
                  >
                    {item.label}
                  </Text>

                </Pressable>

              )
            )}

          </View>

        )}


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
            Fixed Assets
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
              Loading fixed assets...
            </Text>

          </View>

        ) : assets.length ===
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
                name="car-outline"
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
              No Fixed Assets Found
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

          assets.map(
            asset => (

              <FixedAssetCard
                key={
                  asset.id
                }

                asset={
                  asset
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
                loadAssets(
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
                loadAssets(
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
| Asset Card
|--------------------------------------------------------------------------
*/

function FixedAssetCard({
  asset,
}: {
  asset: FixedAsset;
}) {

  const active =
    asset.status ===
    'active';


  const hasGauge =
    toBoolean(
      asset.has_gauge
    );


  const categoryName =
    asset.category
      ?.name ??
    '-';


  return (
    <Pressable
      style={({
        pressed,
      }) => [

        styles.assetCard,

        pressed &&
          styles.pressed,

      ]}

      onPress={() =>
        router.push(
          `/(app)/management/fixed-assets/${asset.id}` as any
        )
      }
    >

      {/* TOP */}

      <View
        style={
          styles.assetTop
        }
      >

        <View
          style={
            styles.assetIcon
          }
        >

          <Ionicons
            name="car-sport-outline"
            size={23}
            color={
              Colors.primary
            }
          />

        </View>


        <View
          style={
            styles.assetHeading
          }
        >

          <Text
            style={
              styles.assetNo
            }
          >
            {asset.asset_no}
          </Text>


          <Text
            style={
              styles.assetName
            }

            numberOfLines={2}
          >
            {asset.name_of_machinery}
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


      {/* DETAILS */}

      <View
        style={
          styles.assetInfoGrid
        }
      >

        <MiniInfo
          label="Vehicle No."
          value={
            asset.vehicle_no
          }
        />


        <MiniInfo
          label="Plate No."
          value={
            asset.plate_no
          }
        />


        <MiniInfo
          label="Tag No."
          value={
            asset.tag_no
          }
        />


        <MiniInfo
          label="Model"
          value={
            asset.model
          }
        />

      </View>


      <InfoRow
        icon="construct-outline"
        value={
          `${asset.make_of_vehicle} • ${asset.make_of_year}`
        }
      />


      <InfoRow
        icon="flame-outline"
        value={
          asset.type_of_fuel ||
          '-'
        }
      />


      <InfoRow
        icon="location-outline"
        value={
          asset.current_location ||
          'Location not set'
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
            styles.footerBadges
          }
        >

          <View
            style={
              styles.conditionBadge
            }
          >

            <Text
              style={
                styles.conditionText
              }
            >
              {
                formatCondition(
                  asset.asset_condition
                )
              }
            </Text>

          </View>


          <View
            style={
              styles.gaugeBadge
            }
          >

            <Ionicons
              name="speedometer-outline"
              size={12}
              color={
                Colors.primary
              }
            />


            <Text
              style={
                styles.gaugeText
              }
            >
              {
                hasGauge
                  ? 'Gauge'
                  : 'No Gauge'
              }
            </Text>

          </View>

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
| Mini Info
|--------------------------------------------------------------------------
*/

function MiniInfo({
  label,
  value,
}: {
  label: string;
  value:
    | string
    | number
    | null
    | undefined;
}) {

  return (
    <View
      style={
        styles.miniInfo
      }
    >

      <Text
        style={
          styles.miniLabel
        }
      >
        {label}
      </Text>


      <Text
        style={
          styles.miniValue
        }

        numberOfLines={1}
      >
        {
          value !== null &&
          value !== undefined &&
          String(value).trim() !== ''
            ? String(value)
            : '-'
        }
      </Text>

    </View>
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
| Helpers
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


function formatCondition(
  value:
    FixedAssetCondition
) {

  switch (value) {

    case 'excellent':
      return 'Excellent';

    case 'good':
      return 'Good';

    case 'fair':
      return 'Fair';

    case 'poor':
      return 'Poor';

    case 'out_of_service':
      return 'Out of Service';

    default:
      return value;

  }

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


    smallInputBox: {
      height: 48,

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

      marginLeft: 8,

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

      justifyContent:
        'center',

      borderBottomWidth: 1,

      borderBottomColor:
        Colors.border,
    },


    categoryOptionSelected: {
      backgroundColor:
        Colors.primaryLight,
    },


    categoryOptionText: {
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


    /*
    |--------------------------------------------------------------------------
    | Asset Card
    |--------------------------------------------------------------------------
    */

    assetCard: {
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


    assetTop: {
      flexDirection: 'row',

      alignItems:
        'flex-start',
    },


    assetIcon: {
      width: 45,

      height: 45,

      borderRadius: 14,

      alignItems: 'center',

      justifyContent: 'center',

      backgroundColor:
        Colors.primaryLight,
    },


    assetHeading: {
      flex: 1,

      marginLeft: 11,

      marginRight: 8,
    },


    assetNo: {
      fontSize: 9,

      fontFamily:
        Fonts.bold,

      color:
        Colors.primary,
    },


    assetName: {
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


    assetInfoGrid: {
      marginTop: 14,

      flexDirection: 'row',

      flexWrap: 'wrap',

      gap: 8,
    },


    miniInfo: {
      width: '48%',

      padding: 10,

      borderRadius: 12,

      backgroundColor:
        Colors.background,
    },


    miniLabel: {
      fontSize: 8,

      fontFamily:
        Fonts.regular,

      color:
        Colors.textMuted,
    },


    miniValue: {
      marginTop: 3,

      fontSize: 10,

      fontFamily:
        Fonts.bold,

      color:
        Colors.text,
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


    footerBadges: {
      flexDirection: 'row',

      alignItems: 'center',

      gap: 6,

      flex: 1,
    },


    conditionBadge: {
      paddingHorizontal: 8,

      paddingVertical: 5,

      borderRadius: 9,

      backgroundColor:
        Colors.primaryLight,
    },


    conditionText: {
      fontSize: 8,

      fontFamily:
        Fonts.bold,

      color:
        Colors.primary,
    },


    gaugeBadge: {
      paddingHorizontal: 8,

      paddingVertical: 5,

      borderRadius: 9,

      flexDirection: 'row',

      alignItems: 'center',

      gap: 3,

      backgroundColor:
        Colors.background,
    },


    gaugeText: {
      fontSize: 8,

      fontFamily:
        Fonts.bold,

      color:
        Colors.textSecondary,
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
    | Empty
    |--------------------------------------------------------------------------
    */

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
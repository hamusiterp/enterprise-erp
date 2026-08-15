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
  projectsApi,
  Project,
  ProjectSource,
  ConstructionProjectType,
  ProjectStatistics,
} from '../../../../api/projectsApi';

import { Colors } from '../../../../constants/colors';
import { Fonts } from '../../../../constants/fonts';


type StatusFilter =
  | ''
  | 'active'
  | 'inactive';


type SourceFilter =
  | ''
  | ProjectSource;


type TypeFilter =
  | ''
  | ConstructionProjectType;


const emptyStatistics: ProjectStatistics = {
  total: 0,
  active: 0,
  inactive: 0,
  deleted: 0,
  bid_projects: 0,
  work_order_projects: 0,
};


export default function ProjectsScreen() {

  const [projects, setProjects] =
    useState<Project[]>([]);

  const [statistics, setStatistics] =
    useState<ProjectStatistics>(
      emptyStatistics
    );

  const [search, setSearch] =
    useState('');

  const [status, setStatus] =
    useState<StatusFilter>('');

  const [source, setSource] =
    useState<SourceFilter>('');

  const [projectType, setProjectType] =
    useState<TypeFilter>('');

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
  | Load Projects
  |--------------------------------------------------------------------------
  */

  const loadProjects =
    useCallback(
      async (
        requestedPage = 1
      ) => {

        try {

          const result =
            await projectsApi.list({
              search:
                search.trim() ||
                undefined,

              status:
                status ||
                undefined,

              project_source:
                source ||
                undefined,

              construction_project_type:
                projectType ||
                undefined,

              page:
                requestedPage,

              per_page: 10,

              sort_by:
                'id',

              sort_direction:
                'desc',
            });


          setProjects(
            result.data
          );

          setPage(
            result.pagination
              .current_page
          );

          setLastPage(
            result.pagination
              .last_page
          );

          setTotal(
            result.pagination
              .total
          );

        } catch (error) {

          console.log(
            'PROJECT LIST ERROR:',
            error
          );

          setProjects([]);

        } finally {

          setLoading(false);
          setRefreshing(false);

        }

      },
      [
        search,
        status,
        source,
        projectType,
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
            await projectsApi
              .statistics();

          setStatistics(
            result
          );

        } catch (error) {

          console.log(
            'PROJECT STATISTICS ERROR:',
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

        loadProjects(1);

      }, 300);


    return () =>
      clearTimeout(timer);

  }, [
    search,
    status,
    source,
    projectType,
    loadProjects,
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
        loadProjects(page),
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
      setSource('');
      setProjectType('');
      setPage(1);

    };


  const hasFilters =
    search !== '' ||
    status !== '' ||
    source !== '' ||
    projectType !== '';


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
              Projects
            </Text>

            <Text
              style={
                styles.subtitle
              }
            >
              Project & contract management
            </Text>
          </View>


          <Pressable
            style={
              styles.addButton
            }
            onPress={() =>
            router.push(
                '/(app)/management/projects/create' as any
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
            icon="briefcase-outline"
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
            icon="trophy-outline"
            label="Bid"
            value={
              statistics.bid_projects
            }
          />

          <StatCard
            icon="document-text-outline"
            label="Work Order"
            value={
              statistics.work_order_projects
            }
          />

          <Pressable
            onPress={() =>
                router.push(
                '/(app)/management/projects/deleted' as any
                )
            }
            >
            <StatCard
                icon="trash-outline"
                label="Deleted"
                value={statistics.deleted}
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
            placeholder="Search projects..."
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


        {/* SOURCE FILTER */}

        <Text
          style={
            styles.filterLabel
          }
        >
          Project Source
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
              source === ''
            }
            onPress={() =>
              setSource('')
            }
          />

          <FilterChip
            label="Bid"
            active={
              source === 'Bid'
            }
            onPress={() =>
              setSource('Bid')
            }
          />

          <FilterChip
            label="Work Order"
            active={
              source ===
              'Work Order'
            }
            onPress={() =>
              setSource(
                'Work Order'
              )
            }
          />

        </ScrollView>


        {/* TYPE FILTER */}

        <Text
          style={
            styles.filterLabel
          }
        >
          Project Type
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
              projectType === ''
            }
            onPress={() =>
              setProjectType('')
            }
          />

          <FilterChip
            label="Private"
            active={
              projectType ===
              'Private Project'
            }
            onPress={() =>
              setProjectType(
                'Private Project'
              )
            }
          />

          <FilterChip
            label="Federal"
            active={
              projectType ===
              'Federal Project'
            }
            onPress={() =>
              setProjectType(
                'Federal Project'
              )
            }
          />

        </ScrollView>


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
            Projects
          </Text>

          <Text
            style={
              styles.resultCount
            }
          >
            {total} records
          </Text>

        </View>


        {/* PROJECT LIST */}

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
              Loading projects...
            </Text>
          </View>

        ) : projects.length === 0 ? (

          <View
            style={
              styles.emptyCard
            }
          >
            <Ionicons
              name="briefcase-outline"
              size={35}
              color={
                Colors.textMuted
              }
            />

            <Text
              style={
                styles.emptyTitle
              }
            >
              No projects found
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

          projects.map(
            project => (

              <ProjectCard
                key={
                  project.id
                }
                project={
                  project
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
                loadProjects(
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
                loadProjects(
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
| Project Card
|--------------------------------------------------------------------------
*/

function ProjectCard({
  project,
}: {
  project: Project;
}) {

  const active =
    project.status === 'active';


  return (
    <Pressable
  onPress={() => {
    router.push(
      `/(app)/management/projects/${project.id}` as any
    );
  }}
  style={({ pressed }) => [
    styles.projectCard,
    pressed && styles.pressed,
  ]}
>

      <View
        style={
          styles.projectTop
        }
      >

        <View
          style={
            styles.projectIcon
          }
        >
          <Ionicons
            name="briefcase-outline"
            size={22}
            color={
              Colors.primary
            }
          />
        </View>


        <View
          style={
            styles.projectHeading
          }
        >
          <Text
            style={
              styles.projectNumber
            }
          >
            {project.project_no}
          </Text>

          <Text
            style={
              styles.projectName
            }
            numberOfLines={2}
          >
            {project.project_name}
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
          styles.infoRow
        }
      >
        <Ionicons
          name="location-outline"
          size={15}
          color={
            Colors.textMuted
          }
        />

        <Text
          style={
            styles.infoText
          }
          numberOfLines={1}
        >
          {project.location ||
            '-'}
        </Text>
      </View>


      <View
        style={
          styles.infoRow
        }
      >
        <Ionicons
          name="business-outline"
          size={15}
          color={
            Colors.textMuted
          }
        />

        <Text
          style={
            styles.infoText
          }
          numberOfLines={1}
        >
          {project.employer ||
            '-'}
        </Text>
      </View>


      <View
        style={
          styles.projectFooter
        }
      >

        <View
          style={
            styles.sourceBadge
          }
        >
          <Text
            style={
              styles.sourceText
            }
          >
            {project.project_source}
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
| Statistics Card
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

    projectCard: {
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

    projectTop: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },

    projectIcon: {
      width: 44,
      height: 44,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        Colors.primaryLight,
    },

    projectHeading: {
      flex: 1,
      marginLeft: 11,
      marginRight: 8,
    },

    projectNumber: {
      fontSize: 10,
      fontFamily:
        Fonts.bold,
      color:
        Colors.primary,
    },

    projectName: {
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

    infoRow: {
      marginTop: 11,
      flexDirection: 'row',
      alignItems: 'center',
    },

    infoText: {
      flex: 1,
      marginLeft: 7,
      fontSize: 10,
      fontFamily:
        Fonts.regular,
      color:
        Colors.textSecondary,
    },

    projectFooter: {
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

    sourceBadge: {
      paddingHorizontal: 9,
      paddingVertical: 5,
      borderRadius: 9,
      backgroundColor:
        Colors.primaryLight,
    },

    sourceText: {
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

    emptyTitle: {
      marginTop: 12,
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
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';

import {
  Project,
  projectsApi,
} from '../../../../api/projectsApi';

import { Colors } from '../../../../constants/colors';
import { Fonts } from '../../../../constants/fonts';


export default function DeletedProjectsScreen() {

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [processingId, setProcessingId] =
    useState<number | null>(null);


  /*
  |--------------------------------------------------------------------------
  | Load Deleted Projects
  |--------------------------------------------------------------------------
  */

  const loadProjects = useCallback(async () => {

    try {

      const result =
        await projectsApi.deleted({
          per_page: 100,
        });

      setProjects(result.data);

    } catch (error: any) {

      console.log(
        'DELETED PROJECTS ERROR:',
        error?.response?.data ?? error
      );

      Alert.alert(
        'Error',
        'Unable to load deleted projects.'
      );

    } finally {

      setLoading(false);
      setRefreshing(false);

    }

  }, []);


  useEffect(() => {

    loadProjects();

  }, [loadProjects]);


  /*
  |--------------------------------------------------------------------------
  | Refresh
  |--------------------------------------------------------------------------
  */

  const refresh = () => {

    setRefreshing(true);

    loadProjects();

  };


  /*
  |--------------------------------------------------------------------------
  | Restore
  |--------------------------------------------------------------------------
  */

  const restoreProject = (
    project: Project
  ) => {

    Alert.alert(
      'Restore Project',
      `Restore ${project.project_no} - ${project.project_name}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Restore',

          onPress: async () => {

            try {

              setProcessingId(project.id);

              await projectsApi.restore(
                project.id
              );

              setProjects(current =>
                current.filter(
                  item =>
                    item.id !== project.id
                )
              );

              Alert.alert(
                'Restored',
                'Project restored successfully.'
              );

            } catch (error: any) {

              console.log(
                'RESTORE PROJECT ERROR:',
                error?.response?.data ?? error
              );

              Alert.alert(
                'Error',
                getApiError(
                  error,
                  'Unable to restore project.'
                )
              );

            } finally {

              setProcessingId(null);

            }

          },
        },
      ]
    );

  };


  /*
  |--------------------------------------------------------------------------
  | Permanent Delete
  |--------------------------------------------------------------------------
  */

  const forceDeleteProject = (
    project: Project
  ) => {

    Alert.alert(
      'Permanently Delete Project',
      `Permanently delete ${project.project_no} - ${project.project_name}? This action cannot be undone.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete Permanently',
          style: 'destructive',

          onPress: async () => {

            try {

              setProcessingId(project.id);

              await projectsApi.forceDelete(
                project.id
              );

              setProjects(current =>
                current.filter(
                  item =>
                    item.id !== project.id
                )
              );

              Alert.alert(
                'Deleted',
                'Project permanently deleted.'
              );

            } catch (error: any) {

              console.log(
                'FORCE DELETE PROJECT ERROR:',
                error?.response?.data ?? error
              );

              Alert.alert(
                'Error',
                getApiError(
                  error,
                  'Unable to permanently delete project.'
                )
              );

            } finally {

              setProcessingId(null);

            }

          },
        },
      ]
    );

  };


  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {

    return (
      <SafeAreaView style={styles.safeArea}>

        <View style={styles.center}>

          <ActivityIndicator
            size="large"
            color={Colors.primary}
          />

          <Text style={styles.loadingText}>
            Loading deleted projects...
          </Text>

        </View>

      </SafeAreaView>
    );

  }


  /*
  |--------------------------------------------------------------------------
  | Screen
  |--------------------------------------------------------------------------
  */

  return (
    <SafeAreaView style={styles.safeArea}>

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
          />
        }
      >

        {/* HEADER */}

        <View style={styles.header}>

          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons
              name="arrow-back"
              size={21}
              color={Colors.text}
            />
          </Pressable>


          <View style={styles.headerContent}>

            <Text style={styles.title}>
              Deleted Projects
            </Text>

            <Text style={styles.subtitle}>
              Restore or permanently delete projects
            </Text>

          </View>


          <View style={styles.countBadge}>
            <Text style={styles.countText}>
              {projects.length}
            </Text>
          </View>

        </View>


        {/* WARNING */}

        <View style={styles.warningCard}>

          <Ionicons
            name="information-circle-outline"
            size={21}
            color={Colors.primary}
          />

          <Text style={styles.warningText}>
            These projects are soft deleted. You can restore them
            or permanently remove them.
          </Text>

        </View>


        {/* EMPTY */}

        {projects.length === 0 ? (

          <View style={styles.emptyCard}>

            <View style={styles.emptyIcon}>

              <Ionicons
                name="trash-outline"
                size={31}
                color={Colors.textMuted}
              />

            </View>

            <Text style={styles.emptyTitle}>
              No Deleted Projects
            </Text>

            <Text style={styles.emptyText}>
              Deleted projects will appear here.
            </Text>

          </View>

        ) : (

          projects.map(project => {

            const processing =
              processingId === project.id;

            return (

              <View
                key={project.id}
                style={styles.projectCard}
              >

                {/* TOP */}

                <View style={styles.projectTop}>

                  <View style={styles.projectIcon}>

                    <Ionicons
                      name="briefcase-outline"
                      size={22}
                      color={Colors.primary}
                    />

                  </View>


                  <View style={styles.projectHeading}>

                    <Text style={styles.projectNo}>
                      {project.project_no}
                    </Text>

                    <Text
                      style={styles.projectName}
                      numberOfLines={2}
                    >
                      {project.project_name}
                    </Text>

                  </View>

                </View>


                {/* INFORMATION */}

                <InfoRow
                  icon="location-outline"
                  value={
                    project.location || '-'
                  }
                />

                <InfoRow
                  icon="business-outline"
                  value={
                    project.employer || '-'
                  }
                />

                <InfoRow
                  icon="document-text-outline"
                  value={
                    project.project_source || '-'
                  }
                />


                {/* ACTIONS */}

                <View style={styles.actions}>

                  <Pressable
                    disabled={processing}
                    style={[
                      styles.restoreButton,
                      processing &&
                        styles.disabledButton,
                    ]}
                    onPress={() =>
                      restoreProject(project)
                    }
                  >

                    {processing ? (

                      <ActivityIndicator
                        size="small"
                        color={Colors.primary}
                      />

                    ) : (

                      <>
                        <Ionicons
                          name="refresh-outline"
                          size={17}
                          color={Colors.primary}
                        />

                        <Text
                          style={styles.restoreText}
                        >
                          Restore
                        </Text>
                      </>

                    )}

                  </Pressable>


                  <Pressable
                    disabled={processing}
                    style={[
                      styles.deleteButton,
                      processing &&
                        styles.disabledButton,
                    ]}
                    onPress={() =>
                      forceDeleteProject(project)
                    }
                  >

                    <Ionicons
                      name="trash-outline"
                      size={17}
                      color="#FFFFFF"
                    />

                    <Text style={styles.deleteText}>
                      Delete
                    </Text>

                  </Pressable>

                </View>

              </View>

            );

          })

        )}

      </ScrollView>

    </SafeAreaView>
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
    <View style={styles.infoRow}>

      <Ionicons
        name={icon as any}
        size={15}
        color={Colors.textMuted}
      />

      <Text
        style={styles.infoText}
        numberOfLines={2}
      >
        {value}
      </Text>

    </View>
  );
}


/*
|--------------------------------------------------------------------------
| API Error
|--------------------------------------------------------------------------
*/

function getApiError(
  error: any,
  fallback: string
) {

  const errors =
    error?.response?.data?.errors;

  if (errors) {

    const first =
      Object.values(errors)
        .flat()
        .find(Boolean);

    if (typeof first === 'string') {
      return first;
    }

  }

  return (
    error?.response?.data?.message ??
    fallback
  );
}


/*
|--------------------------------------------------------------------------
| Styles
|--------------------------------------------------------------------------
*/

const styles = StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  container: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 50,
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    marginTop: 10,
    fontSize: 10,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
  },

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
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  headerContent: {
    flex: 1,
    marginLeft: 12,
  },

  title: {
    fontSize: 21,
    fontFamily: Fonts.extraBold,
    color: Colors.text,
  },

  subtitle: {
    marginTop: 2,
    fontSize: 9,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
  },

  countBadge: {
    minWidth: 39,
    height: 39,
    paddingHorizontal: 8,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryLight,
  },

  countText: {
    fontSize: 12,
    fontFamily: Fonts.bold,
    color: Colors.primary,
  },

  warningCard: {
    marginTop: 20,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 15,
    backgroundColor: Colors.primaryLight,
  },

  warningText: {
    flex: 1,
    marginLeft: 9,
    fontSize: 10,
    lineHeight: 16,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
  },

  emptyCard: {
    marginTop: 25,
    paddingVertical: 50,
    alignItems: 'center',
    borderRadius: 18,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  emptyIcon: {
    width: 60,
    height: 60,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryLight,
  },

  emptyTitle: {
    marginTop: 14,
    fontSize: 14,
    fontFamily: Fonts.bold,
    color: Colors.text,
  },

  emptyText: {
    marginTop: 4,
    fontSize: 10,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
  },

  projectCard: {
    marginTop: 14,
    padding: 15,
    borderRadius: 18,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  projectTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },

  projectIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryLight,
  },

  projectHeading: {
    flex: 1,
    marginLeft: 11,
  },

  projectNo: {
    fontSize: 9,
    fontFamily: Fonts.bold,
    color: Colors.primary,
  },

  projectName: {
    marginTop: 3,
    fontSize: 13,
    lineHeight: 18,
    fontFamily: Fonts.bold,
    color: Colors.text,
  },

  infoRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  infoText: {
    flex: 1,
    marginLeft: 7,
    fontSize: 10,
    lineHeight: 15,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
  },

  actions: {
    marginTop: 15,
    paddingTop: 13,
    flexDirection: 'row',
    gap: 9,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },

  restoreButton: {
    flex: 1,
    height: 43,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 12,
    backgroundColor: Colors.primaryLight,
    borderWidth: 1,
    borderColor: Colors.primary,
  },

  restoreText: {
    fontSize: 10,
    fontFamily: Fonts.bold,
    color: Colors.primary,
  },

  deleteButton: {
    flex: 1,
    height: 43,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 12,
    backgroundColor: '#C83D3D',
  },

  deleteText: {
    fontSize: 10,
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
  },

  disabledButton: {
    opacity: 0.5,
  },

});
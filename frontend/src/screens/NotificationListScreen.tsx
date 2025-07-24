import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { notificationApi } from '../services/api';

type Notification = {
  _id: string;
  title: string;
  message: string;
  isRead: boolean;
  type: 'event_reminder' | 'event_update' | 'system' | 'other';
  createdAt: string;
};

const NotificationListScreen = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { user } = useAuth();
  const navigation = useNavigation();
  const limit = 10;

  const loadNotifications = useCallback(async (pageNum = 1, isRefreshing = false) => {
    try {
      if (pageNum === 1) {
        setIsLoading(true);
      }
      
      const response = await notificationApi.getNotifications({
        page: pageNum,
        limit,
      });
      
      setNotifications(prev => 
        isRefreshing 
          ? [...response.data.data] 
          : [...prev, ...response.data.data]
      );
      
      setHasMore(response.data.data.length === limit);
    } catch (error) {
      console.error('Error loading notifications:', error);
      // Handle error (e.g., show error message)
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setPage(1);
    loadNotifications(1, true);
  };

  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadNotifications(nextPage);
    }
  };

  const handleNotificationPress = async (notification: Notification) => {
    try {
      // Mark as read if unread
      if (!notification.isRead) {
        await notificationApi.markAsRead(notification._id);
        
        // Update local state
        setNotifications(prevNotifications =>
          prevNotifications.map(item =>
            item._id === notification._id
              ? { ...item, isRead: true }
              : item
          )
        );
      }
      
      // Navigate to notification detail
      navigation.navigate('NotificationDetail', { 
        notificationId: notification._id 
      });
    } catch (error) {
      console.error('Error handling notification press:', error);
    }
  };

  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity 
      style={[
        styles.notificationItem, 
        !item.isRead && styles.unreadNotification
      ]}
      onPress={() => handleNotificationPress(item)}
    >
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationMessage} numberOfLines={2}>
          {item.message}
        </Text>
        <Text style={styles.notificationTime}>
          {new Date(item.createdAt).toLocaleString()}
        </Text>
      </View>
      <Ionicons 
        name="chevron-forward" 
        size={20} 
        color="#999" 
      />
    </TouchableOpacity>
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="notifications-off" size={64} color="#ccc" />
      <Text style={styles.emptyText}>No notifications yet</Text>
      <Text style={styles.emptySubtext}>We'll let you know when something new arrives</Text>
    </View>
  );

  const renderFooter = () => {
    if (!isLoading || !hasMore) return null;
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#007AFF" />
      </View>
    );
  };

  useEffect(() => {
    if (user) {
      loadNotifications(1);
    }
  }, [user, loadNotifications]);

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={['#007AFF']}
            tintColor="#007AFF"
          />
        }
        ListEmptyComponent={!isLoading ? renderEmptyComponent : null}
        ListFooterComponent={renderFooter}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  listContent: {
    padding: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
    paddingLeft: 12,
  },
  notificationContent: {
    flex: 1,
    marginRight: 12,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#1c1c1e',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#8e8e93',
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: '#8e8e93',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1c1c1e',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#8e8e93',
    textAlign: 'center',
    lineHeight: 20,
  },
  loadingContainer: {
    paddingVertical: 20,
  },
});

export default NotificationListScreen;

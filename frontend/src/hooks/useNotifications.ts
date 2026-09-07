import { useCallback, useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import { useAuthStore } from '../store/authStore';
import {
  getNotifications,
  getUnreadCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from '../services/notificationService';
import type { AppNotification } from '../types/notification';
const WS_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api').replace(/\/api\/?$/, '');
const WS_URL = WS_ORIGIN.replace(/^http/, 'ws') + '/ws-notifications';
export function useNotifications() {
  const { isAuthenticated, token } = useAuthStore();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const clientRef = useRef<Client | null>(null);
  const loadInitial = useCallback(() => {
    if (!isAuthenticated) return;
    setLoading(true);
    Promise.all([getNotifications(0, 20), getUnreadCount()])
      .then(([page, count]) => {
        setNotifications(page.content);
        setUnreadCount(count);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isAuthenticated]);
  useEffect(() => {
    loadInitial();
  }, [loadInitial]);
  useEffect(() => {
    if (!isAuthenticated || !token) {
      clientRef.current?.deactivate();
      clientRef.current = null;
      return;
    }
    const client = new Client({
      brokerURL: WS_URL,
      connectHeaders: { Authorization: `Bearer ${token}` },
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe('/user/queue/notifications', (message) => {
          const notification = JSON.parse(message.body) as AppNotification;
          setNotifications((prev) => [notification, ...prev]);
          setUnreadCount((c) => c + 1);
        });
      },
    });
    client.activate();
    clientRef.current = client;
    return () => {
      client.deactivate();
      clientRef.current = null;
    };
  }, [isAuthenticated, token]);
  const markAsRead = useCallback(async (id: number) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    setUnreadCount((c) => Math.max(0, c - 1));
    try {
      await markNotificationAsRead(id);
    } catch {
      // silencieux : l'etat local reste optimiste
    }
  }, []);
  const markAllAsRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
    try {
      await markAllNotificationsAsRead();
    } catch {
      // silencieux
    }
  }, []);
  return { notifications, unreadCount, loading, markAsRead, markAllAsRead };
}
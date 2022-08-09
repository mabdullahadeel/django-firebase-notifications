import React, { createContext, useEffect, useState } from "react";
import { doc, onSnapshot, deleteDoc, collection } from "firebase/firestore";
import { firestore } from "../firebase";
import { useAuth } from "../hooks/useAuth";

interface NotificationPayload {
  message: string;
  id: string;
}

interface NotificationState {
  messages: NotificationPayload[];
  unreadCount: number;
  resetUnreadCount: () => void;
  markAllAsRead: () => void;
  markOneMessageAsRead: (id: string) => void;
}

export const NotificationsContext = createContext<NotificationState>({
  messages: [],
  unreadCount: 0,
  resetUnreadCount: () => {},
  markAllAsRead: () => {},
  markOneMessageAsRead: () => {},
});

export const NotificationProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [messages, setMessages] = useState<NotificationPayload[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    let unsubscribe: () => void;
    if (isAuthenticated && user?.user) {
      unsubscribe = onSnapshot(
        collection(
          firestore,
          "app-notifications",
          user.user.id,
          "user-notifications"
        ),
        (snapshot) => {
          const messages = snapshot.docs.map((doc) => ({
            message: doc.data().message,
            id: doc.id,
          }));
          setMessages(messages);
          setUnreadCount((prev) => (messages.length ? prev + 1 : 0));
        }
      );
    }
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [isAuthenticated, user]);

  const resetUnreadCount = () => setUnreadCount(0);

  const markAllAsRead = async () => {
    if (isAuthenticated && user?.user) {
      await Promise.all(
        messages.map(async (msg) => {
          await deleteDoc(
            doc(
              firestore,
              "app-notifications",
              user.user.id,
              "user-notifications",
              msg.id
            )
          );
        })
      );
      setMessages([]);
    }
  };

  const markOneMessageAsRead = async (id: string) => {
    if (isAuthenticated && user?.user) {
      await deleteDoc(
        doc(
          firestore,
          "app-notifications",
          user.user.id,
          "user-notifications",
          id
        )
      );
    }
    setMessages(messages.filter((msg) => msg.id !== id));
  };

  return (
    <NotificationsContext.Provider
      value={{
        messages,
        unreadCount,
        resetUnreadCount,
        markAllAsRead,
        markOneMessageAsRead,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

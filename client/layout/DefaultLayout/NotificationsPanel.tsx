import {
  Button,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  useDisclosure,
  DrawerBody,
  DrawerCloseButton,
  DrawerFooter,
  DrawerHeader,
  Text,
  VStack,
  HStack,
  Badge,
  Box,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import { NotificationsContext } from "../../context/NotificationsContext";

interface NotificationsPanelProps {}

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef<any>();
  const {
    messages,
    resetUnreadCount,
    unreadCount,
    markAllAsRead,
    markOneMessageAsRead,
  } = useContext(NotificationsContext);

  return (
    <>
      <Button
        ref={btnRef}
        onClick={() => {
          onOpen();
          resetUnreadCount();
        }}
      >
        Notifications
        <Badge ml={1} colorScheme="red">
          {unreadCount}
        </Badge>
      </Button>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Latest Notifications</DrawerHeader>

          <DrawerBody>
            {messages.map((msg) => (
              <VStack
                key={msg.id}
                mb={3}
                alignItems="flex-start"
                bg="gray.800"
                border="1px solid"
                borderColor="red.900"
                p={4}
                borderRadius={5}
                _hover={{
                  cursor: "pointer",
                  opacity: 0.95,
                }}
              >
                <Text fontSize="large" fontWeight="bold">
                  Test Notification
                </Text>
                <Text>{msg.message}</Text>
                <Box>
                  <Button
                    onClick={() => markOneMessageAsRead(msg.id)}
                    colorScheme="red"
                    size="xs"
                  >
                    Delete
                  </Button>
                </Box>
              </VStack>
            ))}
          </DrawerBody>

          <DrawerFooter>
            <HStack>
              <Button colorScheme="red" onClick={() => markAllAsRead()}>
                Mark All As Read
              </Button>
            </HStack>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

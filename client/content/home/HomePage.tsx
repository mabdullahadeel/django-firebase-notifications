import { Box, Button, Center, useToast } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { authApi } from "../../services/authApi";

interface HomePageProps {}

export const HomePageContent: React.FC<HomePageProps> = ({}) => {
  const toast = useToast();
  const sendTestNotification = useMutation(authApi.requestTestNotification, {
    onSuccess: () => {
      toast({
        status: "success",
        title: "Notification Sent",
      });
    },
    onError: (error: any) => {
      const throttled = error?.response?.status === 429;
      toast({
        status: "error",
        title: throttled
          ? "Calm Down, Too Many Notifications can cause bad things"
          : "Error Sending Notification",
      });
    },
  });
  return (
    <Box>
      <Center>
        <Button
          onClick={() => sendTestNotification.mutate()}
          isLoading={sendTestNotification.isLoading}
          loadingText="Sending..."
        >
          Send Test Notification
        </Button>
      </Center>
    </Box>
  );
};

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
    onError: (error) => {
      toast({
        status: "error",
        title: "Error Sending Notification",
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

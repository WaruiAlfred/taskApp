import { Image, Text, View } from "native-base";
import React, { useRef } from "react";
import LottieView from "lottie-react-native";

const EmptyState = () => {
  const animation = useRef(null);
  return (
    <View flex={1} justifyContent="center" alignItems="center" flexGrow={1}>
      <Text mb="10" fontSize="2xl" fontWeight="bold">
        You have no tasks
      </Text>
      <Image
        source={require("../assets/completed-task.png")}
        height="20"
        width="20"
        style={{
          height: 200,
          width: 300,
        }}
        alt="image"
      />
      <Text mt="10" color="gray.500" textAlign="center">
        Start adding tasks by hitting the create task button below.
      </Text>
    </View>
  );
};

export default EmptyState;

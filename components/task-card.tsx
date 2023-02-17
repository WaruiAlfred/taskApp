import { View, Text, Stack, Button, Icon } from "native-base";
import React, { FC, useEffect, useState } from "react";
import { ITodoModel } from "../types";
import { Box } from "native-base";
import { Feather, Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { useDatabaseConnection } from "../contexts/database";

interface TaskCardProps {
  task: ITodoModel;
  onDelete: () => void;
  onClickEdit: () => void;
}

const TaskCard: FC<TaskCardProps> = ({ task, onDelete, onClickEdit }) => {
  const [address, setAddress] = useState<
    { region: string; country: string } | any
  >({ region: "", country: "" });
  useEffect(() => {
    const getLocationAddress = async () => {
      const { latitude, longitude } = task;
      const response = await fetch(
        `http://api.positionstack.com/v1/reverse?access_key=8f17342699b9b1f5b8c77f95a20b6530&query=${latitude},${longitude}`
      );

      if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
      }

      const address = await response.json();
      // console.log(address[0].region, address[0].country);
      setAddress({
        region: address.data[0].region,
        country: address.data[0].country,
      });
    };

    getLocationAddress();
  }, [task]);
  // console.log(address);
  // console.log(address.data[0].region, address.data[0].country);
  return (
    <Box
      width="full"
      rounded="lg"
      overflow="hidden"
      borderColor={task.isCompleted ? "green.700" : "gray.300"}
      borderWidth={1}
      paddingY="3"
      paddingX="2"
      bgColor="gray.100"
    >
      <Stack direction="row">
        <Box flexGrow={1}>
          <Text fontWeight="bold" fontSize="md" mb="8">
            {task.title}
          </Text>
          <Text color="gray.600" numberOfLines={1} width="56" mb="1">
            {task.description}
          </Text>
          <Box flexDirection="row" alignItems="center">
            <Icon as={Ionicons} name="location" size="md" color="gray.400" />
            <Text color="gray.400" numberOfLines={1}>
              {address.region},
            </Text>
            <Text color="gray.400" numberOfLines={1}>
              {address.country}
            </Text>
          </Box>
        </Box>
        <Box justifyContent="space-between" alignItems="flex-end">
          <Box
            borderColor={task.isCompleted ? "green.800" : "secondary.600"}
            borderWidth="1"
            borderRadius="full"
            backgroundColor={task.isCompleted ? "green.200" : "secondary.200"}
            px="2"
          >
            <Text
              color={task.isCompleted ? "green.900" : "secondary.900"}
              fontWeight="bold"
              fontSize="xs"
              py="0.5"
            >
              {task.isCompleted ? "Completed" : "Pending"}
            </Text>
          </Box>

          <Box flexDir="row">
            <Box mr="2">
              <TouchableOpacity onPress={onClickEdit}>
                <Icon as={Feather} name="edit-3" size="md" color="red.600" />
              </TouchableOpacity>
            </Box>
            <TouchableOpacity onPress={onDelete}>
              <Icon as={Ionicons} name="trash" size="md" color="red.600" />
            </TouchableOpacity>
          </Box>
        </Box>
      </Stack>
    </Box>
  );
};

export default TaskCard;

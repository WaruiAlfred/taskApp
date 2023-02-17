import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import {
  Box,
  Button,
  FlatList,
  Icon,
  Stack,
  useToast,
  View,
  Text,
} from "native-base";
import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomBackdrop from "../../components/backdrop";
import EmptyState from "../../components/empty-state";
import TaskCard from "../../components/task-card";
import { useDatabaseConnection } from "../../contexts/database";
import { ITodoModel } from "../../types";
import AddTaskScreen from "../add-task";
import useTaskListContext from "./useContext";
import * as Location from "expo-location";
import { TouchableOpacity } from "react-native";

interface TaskListScreenBaseProps {
  tasksFetched: boolean;
  tasks: ITodoModel[];
  fetchTasks: () => void;
  filterValue: boolean | null;
  setFilterValue: React.Dispatch<React.SetStateAction<boolean | null>>;
}

const statuses = [
  {
    label: "All",
    value: null,
  },
  {
    label: "Completed",
    value: true,
  },
  {
    label: "Pending",
    value: false,
  },
];

const TaskListScreenBase: FC<TaskListScreenBaseProps> = ({
  tasks,
  fetchTasks,
  filterValue,
  setFilterValue,
}) => {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [editing, setEditing] = useState(false);
  const [taskBeingEdited, setTaskBeingEdited] = useState<ITodoModel | any>();
  const btmSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["85%"], []);
  const { todosRepository } = useDatabaseConnection();

  const toast = useToast();

  useEffect(() => {
    const locationHandler = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        toast.show({
          title: "Location permission not granted",
          description: "Please enable location permission to use this feature",
        });
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      return location;
    };
    locationHandler();
  }, [setLocation]);

  return (
    <SafeAreaView style={{ flexGrow: 1, flex: 1, backgroundColor: "white" }}>
      <View flexGrow={1} position="relative" flex={1}>
        <View flexGrow={1} paddingX="3" marginTop="5">
          <Stack direction="row" space="2" my="5">
            {statuses.map((status) => (
              <TouchableOpacity
                onPress={() => setFilterValue(status.value)}
                key={status.label}
                style={{
                  borderRadius: 9999,
                  overflow: "hidden",
                }}
              >
                <Box
                  bgColor={filterValue === status.value ? "black" : undefined}
                  paddingX="5"
                  paddingY="0.5"
                  borderRadius="full"
                >
                  <Text
                    color={filterValue === status.value ? "white" : "black"}
                  >
                    {status.label}
                  </Text>
                </Box>
              </TouchableOpacity>
            ))}
          </Stack>
          {tasks.length > 0 ? (
            <FlatList
              data={tasks}
              ItemSeparatorComponent={() => <Box marginBottom="2" />}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item }) => (
                <TaskCard
                  task={item}
                  onDelete={() => {
                    todosRepository.delete(item.id).then(() => {
                      // TODO: Show toast
                      fetchTasks();
                    });
                  }}
                  onClickEdit={async () => {
                    // let { status } =
                    //   await Location.requestForegroundPermissionsAsync();
                    // if (status !== "granted") {
                    //   toast.show({
                    //     title: "Location permission not granted",
                    //     description:
                    //       "Please enable location permission to use this feature",
                    //   });
                    //   return;
                    // }
                    // let location = await Location.getCurrentPositionAsync({});
                    // setLocation(location);
                    setTaskBeingEdited(item);
                    setEditing(true);
                    btmSheetModalRef.current?.present();
                  }}
                />
              )}
            />
          ) : (
            <EmptyState />
          )}
        </View>
        <View position="absolute" bottom={30} alignItems="center" width="100%">
          <Button
            onPress={async () => {
              let { status } =
                await Location.requestForegroundPermissionsAsync();
              if (status !== "granted") {
                toast.show({
                  title: "Location permission not granted",
                  description:
                    "Please enable location permission to use this feature",
                });
                return;
              }
              let location = await Location.getCurrentPositionAsync({});
              setLocation(location);
              btmSheetModalRef.current?.present();
            }}
            borderRadius="full"
            leftIcon={<Icon as={Ionicons} name="add-outline" size="md" />}
          >
            Create Task
          </Button>
        </View>
        <BottomSheetModal
          ref={btmSheetModalRef}
          snapPoints={snapPoints}
          // onChange={handleSheetChanges}
          backdropComponent={(backdropProps) => (
            <CustomBackdrop {...backdropProps} />
          )}
        >
          <AddTaskScreen
            onAddTaskFinished={() => {
              fetchTasks();
              btmSheetModalRef.current?.dismiss();
              setTaskBeingEdited(undefined);
              setEditing(false);
            }}
            location={location}
            task={taskBeingEdited}
            isEditing={editing}
          />
        </BottomSheetModal>
      </View>
    </SafeAreaView>
  );
};

const TaskListScreen = () => {
  const props = useTaskListContext();
  return <TaskListScreenBase {...props} />;
};

export default TaskListScreen;

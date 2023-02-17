import {
  View,
  Text,
  FormControl,
  Input,
  WarningOutlineIcon,
  Stack,
  TextArea,
  Checkbox,
  Button,
  useToast,
} from "native-base";
import * as Location from "expo-location";
import * as Yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDatabaseConnection } from "../contexts/database";
import { FC, useEffect } from "react";
import { ITodoModel } from "../types";
import { TodoModel } from "../data/entity";
import * as Network from "expo-network";

const validationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
});

interface AddTaskScreenProps {
  onAddTaskFinished: () => void;
  task?: TodoModel;
  isEditing: boolean;
  location: Location.LocationObject | null;
}

const AddTaskScreen: FC<AddTaskScreenProps> = ({
  onAddTaskFinished,
  isEditing,
  task,
  location,
}) => {
  const toast = useToast();
  const { control, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      title: "",
      description: "",
      isCompleted: false,
    },
    mode: "all",
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (isEditing) {
      setValue("title", task?.title as string);
      setValue("description", task?.description as string);
      setValue("isCompleted", task?.isCompleted as boolean);
    }
  }, [isEditing]);

  const { todosRepository } = useDatabaseConnection();

  const onSubmit = async (data: ITodoModel | any) => {
    const locPromise = await fetch(
      `http://api.positionstack.com/v1/reverse?access_key=8f17342699b9b1f5b8c77f95a20b6530&query=${location?.coords.latitude},${location?.coords.longitude}`
    );
    const locData = await locPromise.json();

    const locationName = locData.data[0].label;
    const locationCountry = locData.data[0].country;

    if (isEditing) {
      todosRepository
        .update(task?.id, {
          ...data,
          latitude: location?.coords.latitude,
          longitude: location?.coords.longitude,
          locationName,
          locationCountry,
        })
        .then(() => {
          toast.show({
            title: "Task Updated Successfully🎉",
            description: "Your task has been updated successfully.",
            placement: "top",
          });
        });
    } else {
      todosRepository
        .create({
          ...data,
          latitude: location?.coords.latitude,
          longitude: location?.coords.longitude,
          locationName,
          locationCountry,
        })
        .then(() => {
          toast.show({
            title: "Task Created Successfully🎉",
            description: "Your task has been created successfully.",
            placement: "top",
          });
        });
    }
    reset();
    onAddTaskFinished();
  };

  return (
    <View flexGrow={1} paddingX="5">
      <Text fontSize="lg" fontWeight="bold" textAlign="center">
        {isEditing ? "Edit Task" : "Add Task"}
      </Text>
      {/* <KeyboardAwareScrollView style={{ flex: 1 }}> */}
      <Stack space={5}>
        <Controller
          name="title"
          control={control}
          render={({ field: { onChange, onBlur, value }, formState }) => (
            <FormControl w="100%" isInvalid={!!formState.errors.title}>
              <FormControl.Label>Task Title</FormControl.Label>
              <Input
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                placeholder="Enter task title"
              />
              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                {formState.errors.title?.message}
              </FormControl.ErrorMessage>
            </FormControl>
          )}
        />
        <Controller
          name="description"
          control={control}
          render={({ field: { onChange, onBlur, value }, formState }) => (
            <FormControl w="100%" isInvalid={!!formState.errors.description}>
              <FormControl.Label>Task Description</FormControl.Label>
              <TextArea
                autoCompleteType=""
                onChangeText={onChange}
                value={value}
                onBlur={onBlur}
                placeholder="Enter task description"
              />
              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                {formState.errors.description?.message}
              </FormControl.ErrorMessage>
            </FormControl>
          )}
        />
        <Controller
          control={control}
          name="isCompleted"
          render={({ field: { value, onChange } }) => (
            <Checkbox value="" isChecked={value as boolean} onChange={onChange}>
              Mark as Completed
            </Checkbox>
          )}
        />
        <Button borderRadius="full" onPress={handleSubmit(onSubmit)} mt="5">
          {isEditing ? "Update Task" : "Create Task"}
        </Button>
      </Stack>
      {/* </KeyboardAwareScrollView> */}
    </View>
  );
};

export default AddTaskScreen;

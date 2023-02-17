import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TaskListScreen from "../screens/task-list";

const BaseNavigationStack = createNativeStackNavigator();

const BaseNavigationStackNavigator = () => {
  return (
    <BaseNavigationStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <BaseNavigationStack.Screen name="tasklist" component={TaskListScreen} />
    </BaseNavigationStack.Navigator>
  );
};

const Navigation = () => {
  return (
    <NavigationContainer>
      <BaseNavigationStackNavigator />
    </NavigationContainer>
  );
};

export default Navigation;

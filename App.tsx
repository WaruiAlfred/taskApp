import "reflect-metadata";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { NativeBaseProvider } from "native-base";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Navigation from "./navigation";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { DatabaseConnectionProvider } from "./contexts/database";
import theme from "./theme";

export default function App() {
  return (
    <SafeAreaProvider
      style={{
        flex: 1,
      }}
    >
      <DatabaseConnectionProvider>
        <GestureHandlerRootView
          style={{
            flex: 1,
          }}
        >
          <NativeBaseProvider theme={theme}>
            <BottomSheetModalProvider>
              <Navigation />
            </BottomSheetModalProvider>
          </NativeBaseProvider>
        </GestureHandlerRootView>
      </DatabaseConnectionProvider>
    </SafeAreaProvider>
  );
}

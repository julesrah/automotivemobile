
// import Main from "./Navigators/Main";

import { NavigationContainer } from "@react-navigation/native";
import { NativeBaseProvider } from "native-base";
import { Provider } from "react-redux";

import Toast from "react-native-toast-message";
import Auth from "./Context/Store/Auth";
import Main from './Navigators/Main';
import store from "./Redux/store";

export default function App() {
  return (
    <Auth>
      <Provider store={store}>
        <NativeBaseProvider>
          <NavigationContainer>
           <Main />
           <Toast />
          </NavigationContainer>
        </NativeBaseProvider>
      </Provider>
    </Auth>
  );
}


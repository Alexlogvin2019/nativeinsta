import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Platform } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";
import { RegistScreen } from "./screens/RegistScreen";
import { LoginScreen } from "./screens/LoginScreen";
import { HomeScreen } from "./screens/home/HomeScreen";
import { auth } from "./firebase/config";
import { store } from "./redux/store";

const Stack = createStackNavigator();

export default function App() {
  const [isAuth, setIsAuth] = useState(false);

  let content = (
    <Stack.Navigator>
      <Stack.Screen
        options={{ headerShown: false }}
        name="HomePage"
        component={HomeScreen}
      />
    </Stack.Navigator>
  );

  const useRoute = (isAuth) => {
    if (isAuth) {
      return content;
    }
    return (content = (
      <Stack.Navigator>
        <Stack.Screen
          options={{
            headerTitleAlign: "center",
            headerTitle: "Log in",
            headerStyle: {
              backgroundColor: Platform.OS === "ios" ? "black" : "blue",
            },
            headerTintColor: Platform.OS === "ios" ? "blue" : "white",
          }}
          name="SignIn"
          component={LoginScreen}
        />
        <Stack.Screen
          options={{
            headerTitleAlign: "center",
            headerTitle: "Registration",
            headerStyle: {
              backgroundColor: Platform.OS === "ios" ? "black" : "blue",
            },
            headerTintColor: Platform.OS === "ios" ? "blue" : "white",
          }}
          name="Registration"
          component={RegistScreen}
        />
      </Stack.Navigator>
    ));
  };

  useEffect(() => {
    AuthStateChanged();
  }, [isAuth]);

  const AuthStateChanged = async () => {
    await auth.onAuthStateChanged((user) => {
      // console.log(" --- user onAuthStateChanged ---", isAuth, user);
      if (user === null) {
        setIsAuth(false);
      } else {
        setIsAuth(true);
      }
    });
  };
  console.log("isAuth", isAuth);
  const routing = useRoute(isAuth);

  return (
    <Provider store={store}>
      <NavigationContainer>{routing}</NavigationContainer>
    </Provider>
  );

  // <NavigationContainer>{routing}</NavigationContainer>;
}

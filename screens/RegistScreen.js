import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Alert,
  Image,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { registerRootComponent } from "expo";
import { auth, storage } from "../firebase/config";
// import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import * as ImagePicker from "expo-image-picker";
// import * as Permissions from "expo-permissions";
import { useDispatch, useSelector } from "react-redux";

const initialState = {
  email: "",
  password: "",
  userName: "",
  avatar: "",
};

export const RegistScreen = () => {
  const [textValue, setTextValue] = useState(initialState);
  const [avatar, setAvatar] = useState("");
  const dispatch = useDispatch();
  const { userId, userName, userAvatar } = useSelector((state) => state.user);

  const registerUser = async () => {
    const { email, password, userNameIn } = textValue;
    const avatarUrl = await handleUpload(avatar);
    const currentUser = await auth.currentUser;
    try {
      const user = await auth.createUserWithEmailAndPassword(email, password);
      await user.user.updateProfile({
        displayName: userNameIn,
        photoURL: avatarUrl,
      });
      // await console.log("user-----------------------", user);
    } catch (error) {
      console.log(error);
      Alert.alert(error);
    }
    await dispatch({
      type: "CURRENT_USER",
      payload: {
        userName: userNameIn,
        userId: currentUser.uid,
        userPhoto: avatarUrl,
      },
    });
  };
  const photoUser = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    // console.log("result", result);
    await setAvatar(result.uri);
  };

  const handleUpload = async (img) => {
    const response = await fetch(img);
    const file = await response.blob();
    const uniqueName = Date.now().toString();
    await storage.ref(`avatars/${uniqueName}`).put(file);
    const url = await storage.ref("avatars").child(uniqueName).getDownloadURL();
    console.log("url", url);
    return url;
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.Os == "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.container}>
          <View style={{ ...StyleSheet.absoluteFill }}>
            <Image
              source={require("../image/instagram_gradient.png")}
              style={{ flex: 1, width: null, height: null }}
            />
          </View>
          <TouchableOpacity onPress={photoUser}>
            {!avatar ? (
              <Image
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  marginBottom: 30,
                }}
                // source={{ require("../image/instagram_gradient.png"
                // uri:
                //   "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ffortnitenews.com%2Fcontent%2Fimages%2F2018%2F11%2Fdefault.png&f=1&nofb=1",
                // }}
                source={require("../image/ava.png")}
              />
            ) : (
              <Image
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  marginBottom: 30,
                }}
                source={{ uri: avatar }}
              />
            )}
          </TouchableOpacity>
          <Text>User Name</Text>
          <TextInput
            style={styles.txtInput}
            placeholder="User Name"
            onChangeText={(value) =>
              setTextValue({ ...textValue, userNameIn: value })
            }
            value={textValue.userNameIn}
          />
          <Text>Email</Text>
          <TextInput
            style={styles.txtInput}
            placeholder="Email"
            onChangeText={(value) =>
              setTextValue({ ...textValue, email: value })
            }
            value={textValue.email}
          />
          <Text>Password</Text>
          <TextInput
            style={styles.txtInput}
            placeholder="Password"
            secureTextEntry={true}
            onChangeText={(value) =>
              setTextValue({ ...textValue, password: value })
            }
            value={textValue.password}
          />
          <Button title="Register" onPress={registerUser} />
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "ubuntu-regular",
  },
  txtInput: {
    width: "70%",
    height: 40,
    borderColor: "black",
    borderWidth: 1,
    padding: 10,
    margin: 5,
    backgroundColor: "white",
    borderRadius: 20,
  },
  register: {
    color: "white",
    paddingHorizontal: 20,
  },
});

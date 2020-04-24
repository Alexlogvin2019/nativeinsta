import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { firestore } from "../../../firebase/config";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";

export const PostScreen = () => {
  const navigation = useNavigation();
  const { userAvatar } = useSelector((state) => state.user);

  const [allPosts, setAllPosts] = useState([]);

  const getCollection = async () => {
    await firestore.collection("test").onSnapshot((data) => {
      setAllPosts(
        data.docs.map((doc) => {
          return { ...doc.data(), id: doc.id };
        })
      );
    });
  };

  useEffect(() => {
    getCollection();
  }, []);

  const getCurrentUserPost = async (id) => {
    console.log(id);
    const data = await firestore.collection("test").doc(id).get();
    await firestore
      .collection("test")
      .doc(id)
      .update({
        likes: Number(data.data().likes) + 1,
      });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={allPosts}
        keyExtractor={(item, indx) => indx.toString()}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              activeOpacity={0.7}
              onLongPress={() => navigation.navigate("Map", { info: item })}
              style={{
                width: 350,
                borderRadius: 10,
                height: 350,
                marginBottom: 10,
                backgroundColor: "#fff",
              }}
            >
              <View
                style={{
                  position: "absolute",
                  right: 10,
                  top: 10,
                  width: 100,
                  height: 100,
                }}
              >
                <Image
                  style={{
                    position: "absolute",
                    right: 0,
                    width: 50,
                    height: 50,
                    borderRadius: 50,
                    marginBottom: 30,
                  }}
                  source={{
                    uri: item.userAvatar,
                  }}
                />
                <Text style={styles.textName}>{item.userName}</Text>
              </View>
              <Text style={styles.textPost}>Post: {item.text}</Text>
              <TouchableOpacity
                style={styles.like}
                onPress={() => getCurrentUserPost(item.id)}
              >
                <Text>{item.likes}</Text>
              </TouchableOpacity>
              <Image
                style={{
                  width: 330,
                  height: 230,
                  marginBottom: 10,
                  borderRadius: 10,
                  right: 10,
                  bottom: 30,
                  position: "absolute",
                }}
                source={{ uri: item.image }}
              />
              <TouchableOpacity
                style={styles.comment}
                onPress={() => navigation.navigate("Comments", item.id)}
              >
                <Text>COMMENTS</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    flex: 1,
    backgroundColor: "grey",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "ubuntu-regular",
  },
  like: {
    borderWidth: 1,
    borderColor: "red",
    borderRadius: 50,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 15,
    left: 15,
  },
  comment: {
    position: "absolute",
    bottom: 10,
    left: "40%",
  },
  textPost: {
    textAlign: "center",
    paddingTop: 10,
  },
  textName: {
    fontFamily: "ubuntu-bold",

    textAlign: "left",
    paddingLeft: 20,
    paddingTop: 15,
    fontWeight: "bold",
  },
});

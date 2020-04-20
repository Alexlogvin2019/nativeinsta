import React, { useState, useEffect } from "react";

import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  FlatList,
  Image,
} from "react-native";
import { firestore } from "../../../firebase/config";
import { useSelector } from "react-redux";

export const CommentsScreen = (id) => {
  const { userAvatar, userName } = useSelector((state) => state.user);
  const [text, setText] = useState("");
  const [allComments, setallComments] = useState([]);

  const addCurrentUserComment = async (id) => {
    // console.log(id);
    await firestore.collection("test").doc(id).collection("comments").add({
      text: text,
      userName: userName,
      userAvatar: userAvatar,
    });
    setText("");
  };

  const getComment = async (id) => {
    await firestore
      .collection("test")
      .doc(id)
      .collection("comments")
      .onSnapshot((data) => {
        setallComments(
          data.docs.map((doc) => {
            return { ...doc.data(), id: doc.id };
          })
        );
      });
    console.log(allComments);
  };

  useEffect(() => {
    getComment(id.route.params);
  }, []);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.txtInput}
        onChangeText={(value) => setText(value)}
        value={text}
      />
      <Button
        title="Add comment"
        style={{ marginTop: 30 }}
        onPress={() => addCurrentUserComment(id.route.params)}
      />
      <FlatList
        data={allComments}
        keyExtractor={(item, indx) => indx.toString()}
        renderItem={({ item }) => {
          return (
            <View style={styles.comment}>
              {console.log(item)}
              <View style={styles.head}>
                <Image
                  style={{
                    // position: "absolute",
                    right: 0,
                    width: 50,
                    height: 50,
                    borderRadius: 50,
                  }}
                  source={{
                    uri: item.userAvatar,
                  }}
                />
                <Text style={styles.headtext}>{item.userName}</Text>
              </View>
              <Text style={styles.text}>{item.text}</Text>
            </View>
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
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  txtInput: {
    width: "70%",
    height: 40,
    borderColor: "blue",
    borderWidth: 1,
    padding: 10,
    margin: 5,
    borderRadius: 10,
  },
  comment: {
    marginTop: 20,
    borderColor: "red",
    borderWidth: 2,
    borderRadius: 10,
    height: 80,
    width: 300,
    justifyContent: "space-between",
    // alignItems: "center",
    flexDirection: "column",
  },
  head: {
    position: "absolute",

    justifyContent: "space-between",
    alignItems: "center",
    padding: 5,
  },
  text: { marginLeft: 80 },
  headtext: {
    fontWeight: "bold",
  },
});

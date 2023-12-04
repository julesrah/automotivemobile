import { Input, Text, View, List, ListItem, Content, Button } from "native-base";
import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Borrow = (props) => {
  const [user, setUser] = useState(props.route.params.user);
  const [borrowList, setBorrowList] = useState([]);
  const [token, setToken] = useState();

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem("jwt")
        .then((res) => {
          axios
            .get(`${baseURL}borrows/get/userborrows/${user._id}`, {
              headers: { Authorization: `Bearer ${res}` },
            })
            .then((res) => {
              setBorrowList(res.data);
            })
            .catch((error) => console.log(error));
        })
        .catch((error) => console.log(error));

      return () => {
        setBorrowList([]);
      };
    }, [user._id])
  );

  const handleStatusChange = (borrowId, newStatus) => {
    // Update the status in the backend
    AsyncStorage.getItem("jwt")
      .then((res) => {
        axios
          .put(
            `${baseURL}borrows/update-status/${borrowId}`,
            { status: newStatus, dateReturned: Date.now() },
            {
              headers: { Authorization: `Bearer ${res}` },
            }
          )
          .then((res) => {
            // Update the local state with the new status
            setBorrowList((prevList) =>
              prevList.map((item) =>
                item.id === borrowId ? { ...item, status: newStatus, dateReturned: Date() } : item
              )
            );
          })
          .catch((error) => console.log(error));
      })
      .catch((error) => console.log(error));
  };

  return (
    <View>
      <Text>List of Borrow Items</Text>

      {borrowList.map((borrowList, index) => (
        <View key={index} style={styles.card}>
          <Text>Tool Name: {borrowList.borrowItems[0].tool.name || ""}</Text>
          <Text>Quantity: {borrowList.borrowItems[0].quantity|| "" }</Text>
          <Text>Status: {borrowList.status || ""}</Text>
          <Text>Date Borrowed: {borrowList.dateBorrowed || ""}</Text>
          <Text>Date Returned: {borrowList.dateReturned || "Not Returned"}</Text>
          <Button onPress={() => handleStatusChange(borrowList.id, "Returned")}>
            Return Item
          </Button>
        </View>
      ))}
    </View>
  );
};

const styles = {
  card: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    backgroundColor: "#fff",
    elevation: 2,
  },
};

export default Borrow;
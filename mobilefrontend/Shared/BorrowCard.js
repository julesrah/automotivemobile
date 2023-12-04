import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker, Select } from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import TrafficLight from "./StyledComponents/TrafficLight";
import EasyButton from "./StyledComponents/EasyButtons";
import Toast from "react-native-toast-message";

import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from "axios";
import baseURL from "../assets/common/baseUrl";
import { useNavigation } from '@react-navigation/native'

const codes = [
  { name: "borrowed", code: "2" },
  { name: "returned", code: "1" },
  
];
const BorrowCard = ({ item }) => {
  const [borrowStatus, setBorrowStatus] = useState();
  const [statusText, setStatusText] = useState();
  const [statusChange, setStatusChange] = useState();
  const [token, setToken] = useState();
  const [cardColor, setCardColor] = useState();
  const navigation = useNavigation()

  const updateBorrow = () => {
    AsyncStorage.getItem("jwt")
            .then((res) => {
                setToken(res);
            })
            .catch((error) => console.log(error));
    const config = {
      headers: {
        Authorization: Bearer `${token}`,
      },
    };
    const borrow = {
      dateBorrowed: item.dateBorrowed,
      id: item.id,
      borrowItems: item.borrowItems,
      status: statusChange,
      user: item.user,
    };
    axios
      .put(`${baseURL}borrows/${item.id}`, borrow, config)
      .then((res) => {
        if (res.status == 200 || res.status == 201) {
          Toast.show({
            topOffset: 60,
            type: "success",
            text1: "Borrow Edited",
            text2: "",
          });
          setTimeout(() => {
            navigation.navigate("Tools");
          }, 500);
        }
      })
      .catch((error) => {
        Toast.show({
          topOffset: 60,
          type: "error",
          text1: "Something went wrong",
          text2: "Please try again",
        });
      });
  }
  useEffect(() => {
    if (item.status == "2") {
      setBorrowStatus(<TrafficLight unavailable></TrafficLight>);
      setStatusText("borrowed");
      setCardColor("#E74C3C");
    } else {
      setBorrowStatus(<TrafficLight available></TrafficLight>);
      setStatusText("returned");
      setCardColor("#2ECC71");
    }

    return () => {
      setBorrowStatus();
      setStatusText();
      setCardColor();
    };
  }, []);

  return (
    <View style={[{ backgroundColor: cardColor }, styles.container]}>
      <View style={styles.container}>
        <Text>Borrowing Number: #{item.id}</Text>
      </View>
      <View style={{ marginTop: 10 }}>
        <Text>
          Status: {statusText} {borrowStatus}
        </Text>
       
        <Text>Tools: {item.borrowItems}</Text>
        <Text>Date Borrowed: {item.dateBorrowed.split("T")[0]}</Text>
        <View>

          <Select
            width="80%"
            iosIcon={<Icon name="arrow-down" color={"#007aff"} />}
            style={{ width: undefined }}
            selectedValue={statusChange}
            color="white"
            placeholder="Change Status"
            placeholderTextColor="white"
            placeholderStyle={{ color: '#FFFFFF' }}
            placeholderIconColor="#007aff"
            onValueChange={(e) => setStatusChange(e)}
          >
            {codes.map((c) => {
              return <Select.Item
                key={c.code}
                label={c.name}
                value={c.code}
              />
            })}
          </Select>

          <EasyButton
            secondary
            large
          onPress={() => updateBorrow()}
          >
            <Text style={{ color: "white" }}>Update</Text>
          </EasyButton>
        </View>
        {/* //   ) : null} */}
      </View>
    </View>


  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    margin: 10,
    borderRadius: 10,
  },
  title: {
    backgroundColor: "#62B1F6",
    padding: 5,
  },
  priceContainer: {
    marginTop: 10,
    alignSelf: "flex-end",
    flexDirection: "row",
  },
  price: {
    color: "white",
    fontWeight: "bold",
  },
});

export default BorrowCard;
import React, { useState } from "react";

import { theme } from '../../core/theme';
import { Text } from 'react-native-paper'
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useNavigation } from '@react-navigation/native';
import { View, TouchableOpacity, StyleSheet } from 'react-native'
// import { Button, TextInput } from "native-base";

import Error from "../../Shared/Error";

//Custom Design
import Background from '../../Components/Background';
import Logo from '../../Components/Logo';
import Header from '../../Components/Header';
import Button from '../../Components/Button';
import TextInput from '../../Components/TextInput';
import BackButton from '../../Components/BackButton';

import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import Toast from "react-native-toast-message";

const Register = (props) => {
  const [email, setEmail] = useState("");
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [section, setSection] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation()

  const [error, setError] = useState("");


  const register = () => {

    if (email === "" || firstname === "" || lastname === "" || section === "" || phone === "" || password === "") {
      setError("Please fill in the form correctly");
    }

    let user = {
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: password,
      section: section,
      phone: phone,
    }
    axios
      .post(`${baseURL}users/register`, user)
      .then((res) => {
        if (res.status == 200) {
          Toast.show({
            topOffset: 60,
            type: "success",
            text1: "Registration Succeeded",
            text2: "Please Login into your account",
          });
          setTimeout(() => {
            navigation.navigate("Login");
          }, 500);
        }
      })
      .catch((error) => {
        Toast.show({
          position: 'bottom',
          bottomOffset: 20,
          type: "error",
          text1: "Something went wrong",
          text2: "Please try again",
        });
      });
  }

  return (
    <KeyboardAwareScrollView
      viewIsInsideTabBar={true}
      extraHeight={200}
      enableOnAndroid={true}
    >
    <Background>
    <BackButton goBack={navigation.goBack} />
    <Logo />
    <Header>Register</Header>
        <TextInput
          placeholder={"Email"}
          name={"email"}
          id={"email"}
          onChangeText={(text) => setEmail(text.toLowerCase())}
        />
        <TextInput
          placeholder={"First Name"}
          name={"firstname"}
          id={"firstname"}
          onChangeText={(text) => setFirstName(text)}
        />
        <TextInput
          placeholder={"Last Name"}
          name={"lastname"}
          id={"lastname"}
          onChangeText={(text) => setLastName(text)}
        />
         <TextInput
          placeholder={"Section"}
          name={"section"}
          id={"section"}
          onChangeText={(text) => setSection(text)}
        />
        <TextInput
          placeholder={"Phone Number"}
          name={"phone"}
          id={"phone"}
          keyboardType={"numeric"}
          onChangeText={(text) => setPhone(text)}
        />
        <TextInput
          placeholder={"Password"}
          name={"password"}
          id={"password"}
          secureTextEntry={true}
          onChangeText={(text) => setPassword(text)}
        />
         <View style={styles.buttonGroup}>
          {error ? <Error message={error} /> : null}
        </View>
        
        <Button  mode="outlined" onPress={() => register()} style={{ marginTop: 24 }}>
          Register
        </Button>

        <View style={styles.row}>
        <Text>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.link}>Login</Text>
        </TouchableOpacity>
        </View>

      </Background>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
})

export default Register;
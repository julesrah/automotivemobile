import { View, Text, Image, TouchableOpacity, StyleSheet, Platform, } from "react-native";
import React, { useState, useEffect, useContext, useCallback,} from "react";

import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import baseURL from "../../assets/common/baseUrl"

// Custom Design
import Header from '../../Components/Header';
import Button from '../../Components/Button';
import TextInput from '../../Components/TextInput';

import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthGlobal from "../../Context/Store/AuthGlobal";

import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import mime from "mime";

const UserUpdate = (props) => {
    console.log(props.route.params, 'wow');
    let navigation = useNavigation();
    const [userInfo, setUserInfo] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [section, setSection] = useState("");
    const [phone, setPhone] = useState("");
    // const [email, setEmail] = useState('');
    const [image, setImage] = useState("");
    const [mainImage, setMainImage] = useState();
    const [token, setToken] = useState();

    const [user, setUser] = useState(props.route.params.user);
  
    const context = useContext(AuthGlobal);

    const updateProfile = () => {
      let formData = new FormData();
      formData.append("firstname", firstname);
      formData.append("lastname", lastname);
      formData.append("section", section);
      formData.append("phone", phone);

      const id = user.id
  
      if (mainImage == undefined) {
      } else if (mainImage !== image) {
        const newImageUri = "file:///" + mainImage.split("file:/").join("");
  
        formData.append("image", {
          uri: newImageUri,
          type: mime.getType(newImageUri),
          name: newImageUri.split("/").pop(),
        });
      }
      console.log(formData, "update user");
  
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      };
  
      axios
        .put(`${baseURL}users/userProfile/${id}`, formData, config)
        .then((res) => {
          console.log("Profile updated successfully");
          // Toast.show({
          //   type: "success",
          //   text1: "Success",
          //   text2: "Profile updated successfully!",
          // });
  
          navigation.navigate('UserProfile')
        })
        .catch((error) => {
          // Handle error, e.g., show an error message
          console.log("Error updating profile", error);
          // Toast.show({
          //   type: "error",
          //   text1: "Error",
          //   text2: "Failed to update profile. Please try again.",
          // });
        });
    };

    useEffect(() => {
      setFirstname(user.firstname || "");
      setLastname(user.lastname || "");
      setMainImage(user.image || "");
      setImage(user.image || "");
      setSection(user.section || "");
      setPhone(user.phone || "");
  
      AsyncStorage.getItem("jwt")
        .then((res) => {
          setToken(res);
        })
        .catch((error) => console.log(error));
  
      (async () => {
        if (Platform.OS !== "web") {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== "granted") {
            alert("Sorry, we need camera roll permissions to make this work!");
          }
        }
      })();
    }, [user]);

    const pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      if (!result.canceled) {
        console.log(result.assets);
        setMainImage(result.assets[0].uri);
      }
    };
  
    return (
      <KeyboardAwareScrollView className="flex-1 bg-white">
        <View className="flex-1 justify-start bg-gray-100 ">
        <Header>Edit Profile</Header>
          <View className="flex flex-row gap-8 justify-around mt-2">
            <View className="justify-evenly">
            </View>
            <View className="justify-evenly">
            </View>
          </View>
            <View style={styles.imageContainer}>

            <TouchableOpacity onPress={pickImage} >
            <View style={styles.imageBorder}>
            <Image
                source={{
                  uri: mainImage
                    ? mainImage
                    : "../../assets/images/default-profile.jpg",
                }}
                style={{ width: 200, height: 200, borderRadius: 100 }}
            />
            </View>
            </TouchableOpacity>

            </View>

          <View
            className="flex-1 bg-white mt-5"
            style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50 }}
          >
            <View className="form space-y-4 p-5 mt-5">
              <View className="flex flex-row justify-center space-x-2 ">
                <View className="grow">
                  <Text>First Name</Text>
                  <TextInput
                    className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
                    name={"firstname"}
                    id={"firstname"}
                    value={firstname}
                    onChangeText={(text) => setFirstname(text)}
                  ></TextInput>
                </View>

                <View className="grow">
                  <Text className="mb-3">Last Name</Text>
                  <TextInput
                    className="p-4  bg-gray-100 text-gray-700 rounded-2xl mb-3"
                    name={"lastname"}
                    id={"lastname"}
                    value={lastname}
                    onChangeText={(text) => setLastname(text)}
                  ></TextInput>
                </View>
              </View>
  
              <Text>Section</Text>
              <TextInput
                className="p-4  bg-gray-100 text-gray-700 rounded-2xl mb-3"
                name={"section"}
                id={"section"}
                value={section}
                onChangeText={(text) => setSection(text)}
              ></TextInput>
  
              <Text>Phone</Text>
              <TextInput
                className="p-4  bg-gray-100 text-gray-700 rounded-2xl mb-3"
                name={"phone"}
                id={"phone"}
                value={phone}
                onChangeText={(text) => setPhone(text)}
              ></TextInput>

              <TouchableOpacity
               onPress={() => updateProfile()}
               >
              <Button mode="outlined">Update</Button>
              </TouchableOpacity>

            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    );
  };
  
  export default UserUpdate;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
    },
    profileContainer: {
      backgroundColor: '#FFFFFF',
      borderBottomLeftRadius: 70,
      borderBottomRightRadius: 70,
      padding: 20,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 20,
    },
    headerText: {
      fontWeight: 'bold',
      fontSize: 20,
      textAlign: 'center',
    },
    logoutText: {
      fontWeight: 'bold',
      color: '#990000',
    },
    imageContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 20,
    },
    imageBorder: {
      borderWidth: 2,
      borderColor: '#cdcbcb',
      borderRadius: 100,
      width: 200,
      height: 200,
    },
    details: {
      alignItems: 'center',
      marginTop: 20,
    },
    nameText: {
      textAlign: 'center',
      fontSize: 20,
      fontWeight: 'bold',
    },
    emailText: {
      textAlign: 'center',
      fontSize: 14,
      marginBottom: 7,
    },
  });



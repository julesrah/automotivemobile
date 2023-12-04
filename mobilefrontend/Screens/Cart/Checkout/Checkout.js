import React, { useEffect, useState, useContext } from 'react'
import { Text, View, Button } from 'react-native'
import { Select, Item, Picker, CheckIcon } from 'native-base'
import Icon from 'react-native-vector-icons/FontAwesome'
import FormContainer from '../../../Shared/Form/FormContainer'
import Input from '../../../Shared/Form/Input'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { useSelector, useDispatch } from 'react-redux'
import { useNavigation } from '@react-navigation/native';
import AuthGlobal from '../../../Context/Store/AuthGlobal'
import axios from 'axios'
import baseURL from '../../../assets/common/baseUrl'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as actions from '../../../Redux/Actions/cartActions';
import Toast from 'react-native-toast-message';


const Checkout = (props) => {
    const [borrowItems, setBorrowItems] = useState([])
    const [user, setUser] = useState("")
    const navigation = useNavigation()
    const cartItems = useSelector(state => state.cartItems)
    const [token, setToken] = useState();
    const context = useContext(AuthGlobal);
    const dispatch = useDispatch()

    console.log(cartItems, 'items')

    useEffect(() => {
        setBorrowItems(cartItems)
        if (context.stateUser.isAuthenticated) {
            
            AsyncStorage.getItem("jwt")
                .then((res) => {
                    axios
                        .get(`${baseURL}users/${context.stateUser.user.userId}`, {
                            headers: { Authorization: `Bearer ${res}` },
                        })
                        .then((user) => {
                            setUser(user.data);
                        })
                })
                .catch((error) => console.log(error))

                

        } else {
            navigation.navigate("User",{ screen: 'Login' });
            Toast.show({
                topOffset: 60,
                type: "error",
                text1: "Please Login to Checkout",
                text2: ""
            });
        }
        return () => {
            setBorrowItems();
        }
    }, [])

    console.log(user, "user data")
    const checkOut = () => {
        console.log("borrows", borrowItems)
        let borrow = {
            dateBorrowed: Date.now(),
            borrowItems,
            status: "2",
            user,
        }


        AsyncStorage.getItem("jwt")
            .then((res) => {
                setToken(res)

            })
            .catch((error) => console.log(error))
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        axios
            .post(`${baseURL}borrows`, borrow, config)
            .then((res) => {
                if (res.status == 200 || res.status == 201) {
                    Toast.show({
                        topOffset: 60,
                        type: "success",
                        text1: "Order Completed",
                        text2: "",
                    });
                    // dispatch(actions.clearCart())
                    // props.navigation.navigate("Cart")

                    setTimeout(() => {
                        dispatch(actions.clearCart())
                        navigation.navigate("Cart");
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
        // navigation.navigate({ borrow: borrow })
    }
    console.log(borrowItems)

    return (
        <KeyboardAwareScrollView
            viewIsInsideTabBar={true}
            extraHeight={200}
            enableOnAndroid={true}
        >
            <FormContainer title={"Shipping Address"}>
                {/* <Input
                    placeholder={"Phone"}
                    name={"phone"}
                    value={phone}
                    keyboardType={"numeric"}
                    onChangeText={(text) => setPhone(text)}
                />
                <Input
                    placeholder={"Shipping Address 1"}
                    name={"ShippingAddress1"}
                    value={address}
                    onChangeText={(text) => setAddress(text)}
                />
                <Input
                    placeholder={"Shipping Address 2"}
                    name={"ShippingAddress2"}
                    value={address2}
                    onChangeText={(text) => setAddress2(text)}
                />
                <Input
                    placeholder={"City"}
                    name={"city"}
                    value={city}
                    onChangeText={(text) => setCity(text)}
                />
                <Input
                    placeholder={"Zip Code"}
                    name={"zip"}
                    value={zip}
                    keyboardType={"numeric"}
                    onChangeText={(text) => setZip(text)}
                />
                <Select
                    width="80%"
                    iosIcon={<Icon name="arrow-down" color={"#007aff"} />}
                    style={{ width: undefined }}
                    selectedValue={country}
                    placeholder="Select your country"
                    placeholderStyle={{ color: '#007aff' }}
                    placeholderIconColor="#007aff"
                    onValueChange={(e) => setCountry(e)}
                >
                    {countries.map((c) => {
                        return <Select.Item
                            key={c.code}
                            label={c.name}
                            value={c.name}
                        />
                    })}
                </Select> */}
                <Text>Tools</Text>
                {cartItems.map((cartItem) => (
                    <View>
                        <Text>{cartItem.name}</Text>
                    </View>
                ))}

                <Text>User Information</Text>

                <Input
                    value={user.firstname + " " + user.lastname}
                />
                <Input
                    value={user.email}
                />
                <Input
                    value={user.phone}
                />
                <Input
                    value={user.section}
                />


                <View style={{ width: '80%', alignItems: "center" }}>
                    <Button title="Confirm" onPress={() => checkOut()} />
                </View>
            </FormContainer>
        </KeyboardAwareScrollView>
    )
}
export default Checkout;
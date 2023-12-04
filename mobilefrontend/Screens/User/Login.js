import React, { useState, useContext, useEffect } from "react";

import { theme } from '../../core/theme';
import { Text } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native';
import { loginUser } from '../../Context/Actions/Auth.actions'
import { View, TouchableOpacity, StyleSheet } from 'react-native'

import Error from "../../Shared/Error";

//Custom Design
import Background from '../../Components/Background';
import Logo from '../../Components/Logo';
import Header from '../../Components/Header';
import Button from '../../Components/Button';
import TextInput from '../../Components/TextInput';
import BackButton from '../../Components/BackButton';

import AuthGlobal from '../../Context/Store/AuthGlobal'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Login = (props) => {
    const context = useContext(AuthGlobal)

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    let navigation = useNavigation()

    const handleSubmit = () => {
        const user = {
            email,
            password,
        };

        if (email === "" || password === "") {
            setError("Please fill out your credentials");
        } else {
            loginUser(user, context.dispatch);
            console.log("error")
        }
    }

    useEffect(() => {
        if (context.stateUser.isAuthenticated === true) {
            navigation.navigate("UserProfile")
        }
    }, [context.stateUser.isAuthenticated])

    AsyncStorage.getAllKeys((err, keys) => {
        AsyncStorage.multiGet(keys, (error, stores) => {
            stores.map((result, i, store) => {
                console.log({ [store[i][0]]: store[i][1] });
                return true;
            });
        });
    });
    return (
        <Background>
            <BackButton goBack={navigation.goBack} />
            <Logo />
            <Header>Welcome back!</Header>
            <TextInput
                placeholder={"Enter email"}
                name={"email"}
                id={"email"}
                value={email}
                onChangeText={(text) => setEmail(text.toLowerCase())}
            />
            <TextInput
                placeholder={"Enter password"}
                name={"password"}
                id={"password"}
                secureTextEntry={true}
                value={password}
                onChangeText={(text) => setPassword(text)}
            />
            <View style={styles.forgotPassword}>
            <TouchableOpacity
                 onPress={() => navigation.navigate('ForgetPassword')}
             >
            <Text style={styles.forgot}>Forgot your password?</Text>
            </TouchableOpacity>
            </View>

            {error ? <Error message={error} /> : null}
            <Button mode="outlined" onPress={() => handleSubmit()}>Login</Button>
            
            <View style={styles.row}>
            <Text>Don’t have an account? </Text>
            <TouchableOpacity onPress={() => navigation.replace('Register')}>
                <Text style={styles.link}>Sign up</Text>
            </TouchableOpacity>
            
            </View>
        </Background>
    )
}

const styles = StyleSheet.create({
    forgotPassword: {
      width: '100%',
      alignItems: 'flex-end',
      marginBottom: 24,
    },
    row: {
      flexDirection: 'row',
      marginTop: 4,
    },
    forgot: {
      fontSize: 13,
      color: theme.colors.secondary,
    },
    link: {
      fontWeight: 'bold',
      color: theme.colors.primary,
    },
  })


export default Login;


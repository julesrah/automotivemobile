import React from 'react'
import { StyleSheet, View, Dimensions, Image, Button, TouchableOpacity, Text } from 'react-native'
import Toast from 'react-native-toast-message'

import COLORS from '../../assets/consts/colors';

import { useSelector, useDispatch } from 'react-redux'
import * as actions from '../../Redux/Actions/cartActions'

import Icon from 'react-native-vector-icons/MaterialIcons';

var { width } = Dimensions.get("window");

const ToolCard = (props) => {
    const { name, image, countInStock, like  } = props;
    const dispatch = useDispatch()

    return (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            dispatch(actions.addToCart({ ...props, quantity: 1 }));
            Toast.show({
              topOffset: 60,
              type: "success",
              text1: `${name} Added to Cart`,
              text2: "Go to your cart to complete the order"
            });
          }}
        >
          <View style={styles.container}>
            <Image
              style={styles.image}
              resizeMode="contain"
              source={{
                uri: image ? image : 'https://cdn.pixabay.com/photo/2012/04/01/17/29/box-23649_960_720.png'
              }}
            />
            {/* <View style={{ alignItems: 'flex-end' }}>
              <View
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: like ? 'rgba(245, 42, 42,0.2)' : 'rgba(0,0,0,0.2)',
                }}
              >
                <Icon name="favorite" size={18} color={like ? 'red' : 'black'} />
              </View>
            </View> */}
    
            <View style={{ height: 100, alignItems: 'center' }}>
              <Image source={{ uri: image }} style={{ flex: 1, resizeMode: 'contain' }} />
            </View>
    
            <Text style={{ fontWeight: 'bold', fontSize: 17, marginTop: 10 }}>
              {name}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 5,
              }}
            >
              <View
                style={{
                  height: 25,
                  width: 25,
                  backgroundColor: 'green',
                  borderRadius: 5,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{ fontSize: 22, color: 'white', fontWeight: 'bold' }}
                >
                  +
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      );
    };
    

    const styles = StyleSheet.create({
        container: {
          width: width / 2 - 20,
          height: width / 1.7,
          padding: 10,
          borderRadius: 10,
          marginTop: 55,
          marginBottom: 5,
          marginLeft: 10,
          alignItems: 'center',
          elevation: 8,
          backgroundColor: 'white',
        },
        image: {
          width: width / 2 - 20 - 10,
          height: width / 2 - 20 - 30,
          backgroundColor: 'transparent',
          position: 'absolute',
          top: -45
        },
        categoryText: {fontSize: 16, color: 'grey', fontWeight: 'bold'},
        categoryTextSelected: {
          color: COLORS.green,
          paddingBottom: 5,
          borderBottomWidth: 2,
          borderColor: COLORS.green,
        },
        card: {
          height: 225,
          backgroundColor: COLORS.light,
          width,
          marginHorizontal: 2,
          borderRadius: 10,
          marginBottom: 20,
          padding: 15,
        },
        header: {
          marginTop: 30,
          flexDirection: 'row',
          justifyContent: 'space-between',
        },
        searchContainer: {
          height: 50,
          backgroundColor: COLORS.light,
          borderRadius: 10,
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
        },
        input: {
          fontSize: 18,
          fontWeight: 'bold',
          flex: 1,
          color: COLORS.dark,
        },
        sortBtn: {
          marginLeft: 10,
          height: 50,
          width: 50,
          borderRadius: 10,
          backgroundColor: COLORS.green,
          justifyContent: 'center',
          alignItems: 'center',
        },
      });
      

export default ToolCard;
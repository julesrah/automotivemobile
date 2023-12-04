import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native"
import { View, StyleSheet, FlatList, ActivityIndicator, ScrollView, Dimensions } from 'react-native'
import { Container, Header, Icon, Item, Input, Text, VStack, Heading, Center, } from "native-base";
import { Ionicons, MaterialIcons, SmallCloseIcon } from "@expo/vector-icons";

import ToolList from './ToolList'
import SearchedTool from "./SearchedTool";
import Banner from "../../Shared/Banner";
import CategoryFilter from "./CategoryFilter";
import baseURL from "../../assets/common/baseUrl"
import axios from 'axios'

//Custom Design


var { width, height } = Dimensions.get("window");

const ToolContainer = () => {
    const [tools, setTools] = useState([])
    const [toolsFiltered, setToolsFiltered] = useState([]);
    const [focus, setFocus] = useState();
    const [categories, setCategories] = useState([]);
    const [active, setActive] = useState([]);
    const [initialState, setInitialState] = useState([])
    const [toolsCtg, setToolsCtg] = useState([])
    const [loading, setLoading] = useState(true)


    const searchTool = (text) => {
        console.log(text)
        setToolsFiltered(
            tools.filter((i) => i.name.toLowerCase().includes(text.toLowerCase()))
        )
    }

    const openList = () => {
        setFocus(true);
    }

    const onBlur = () => {
        setFocus(false);
    }

    const changeCtg = (ctg) => {
        {
            ctg === "all"
                ? [setToolsCtg(initialState), setActive(true)]
                : [
                    setToolsCtg(
                        tools.filter((i) => i.category !== null && i.category._id === ctg),
                        setActive(true)
                    ),
                ];
        }
    };

    useFocusEffect((
        useCallback(
            () => {
                setFocus(false);
                setActive(-1);

                // Products
                axios
                    .get(`${baseURL}tools`)
                    .then((res) => {
                        setTools(res.data);
                        setToolsFiltered(res.data);
                        setToolsCtg(res.data);
                        setInitialState(res.data);
                        setLoading(false)
                    })
                    .catch((error) => {
                        console.log('Api call error')
                    })

                // Categories
                axios
                    .get(`${baseURL}categories`)
                    .then((res) => {
                        setCategories(res.data)
                    })
                    .catch((error) => {
                        console.log('Api call error')
                    })

                return () => {
                    setTools([]);
                    setToolsFiltered([]);
                    setFocus();
                    setCategories([]);
                    setActive();
                    setInitialState();
                };
            },
            [],
        )
    ))
    console.log(toolsFiltered)

    return (
        <>
            {loading === false ? (
                <Center>
                    <VStack w="100%" space={5} alignSelf="center">


                        <Input
                            onFocus={openList}
                            onChangeText={(text) => searchTool(text)}
                            placeholder="Search"
                            variant="filled"
                            width="100%"
                            borderRadius="10"
                            py="1"
                            px="2"
                            InputLeftElement={<Icon ml="2" size="4" color="gray.400" as={<Ionicons name="ios-search" />} />}
                            InputRightElement={focus === true ? <Icon ml="2" size="4" color="gray.400" as={<Ionicons name="close" size="12" color="black" />} /> : null}
                        />
                    </VStack>
                    {focus === true ? (
                        <SearchedTool
                            toolsFiltered={toolsFiltered}
                        />
                    ) : (

                        <ScrollView>
                            <View>
                            </View>
                            <View >
                                <CategoryFilter
                                    categories={categories}
                                    categoryFilter={changeCtg}
                                    toolsCtg={toolsCtg}
                                    active={active}
                                    setActive={setActive}
                                />
                            </View>
                            {toolsCtg.length > 0 ? (
                                <View style={styles.listContainer}>
                                    {toolsCtg.map((item) => {
                                        return (
                                            <ToolList
                                                key={item._id.$oid}
                                                item={item}
                                            />
                                        )
                                    })}
                                </View>
                            ) : (
                                <View style={[styles.center, { height: height / 2 }]}>
                                    <Text>No tools found</Text>
                                </View>
                            )}
                        </ScrollView>)}
                </Center>) : (<Container style={[styles.center, { backgroundColor: "#f2f2f2" }]}>
                    <ActivityIndicator size="large" color="red" />
                </Container>)}
        </>
    )
}
const styles = StyleSheet.create({
    container: {
        flexWrap: "wrap",
        backgroundColor: "gainsboro",
    },
    listContainer: {
        //   height: "100%",
        flex: 1,
        flexDirection: "row",
        alignItems: "flex-start",
        flexWrap: "wrap",
        backgroundColor: "gainsboro",
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    }
});


export default ToolContainer;
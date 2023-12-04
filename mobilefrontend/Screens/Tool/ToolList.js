import React from "react";

import { TouchableOpacity, View, Dimensions } from "react-native";
import { useNavigation } from '@react-navigation/native';

import ToolCard from "./ToolCard";

var { width } = Dimensions.get("window")

const ToolList = (props) => {
    const { item } = props;
    const navigation = useNavigation();

    return (
        <TouchableOpacity
            style={{ width: '50%' }}
            onPress={() => navigation.navigate("Tool Detail", { item: item })
            }

        >
            <View style={{ width: width / 2, backgroundColor: 'gainsboro' }}>
                <ToolCard {...item} />
            </View>
        </TouchableOpacity>
    )
}
export default ToolList;
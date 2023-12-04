import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Dimensions, View } from "react-native";
import Swiper from "react-native-swiper";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const Banner = () => {
  const [bannerData, setBannarData] = useState([]);

  useEffect(() => {
    setBannarData([
      "https://hondaph.com/cms/images/news/5f7c2f62796fe.png",
      "https://www.webike.ph/ph_news/wp-content/uploads/2020/12/HONDA-PH-Promotion-1.png",
      "https://wheels.com.ph/wp-content/uploads/2020/10/121198773_2736629883253327_339092979694998459_o.jpg",
    ]);

    return () => {
      setBannarData([]);
    };
  }, []);

  return (
    <View className="p-1" style={{ height: hp("25%") }}>
      <Swiper showsButtons={false} autoplay={true} autoplayTimeout={10} >
        {bannerData.map((item, index) => (
          <Image
            key={index}
            resizeMode="cover"
            className="flex-1 rounded-lg"
            source={{ uri: item }}
          />
        ))}
      </Swiper>
    </View>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     height: width / 2, // Set the height of the banner
//   },
//   wrapper: {},
//   slide: {
//     flex: 1,
//   },
// });

export default Banner;

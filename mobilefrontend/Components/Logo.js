import React from 'react'
import { Image, StyleSheet } from 'react-native'

export default function Logo() {
  return <Image source={require('../assets/images2/Autologo3.png')} style={styles.image} />
}

const styles = StyleSheet.create({
  image: {
    width: 420,
    height: 300,
    marginBottom: -40,
  },

})

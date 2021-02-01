import React from 'react';
import {Image, StyleSheet, View} from 'react-native';

export default function LogoTitle() {
  return (
    <Image source={require('./../assets/logo.png')} style={styles.image} />
  );
}

const styles = StyleSheet.create({
  image: {
    width: 50,
    height: 50,
  },
});

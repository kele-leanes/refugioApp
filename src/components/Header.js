import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';

const Header = ({title, action}) => {
  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require('./../assets/logo.png')} />
      <Text>{title}</Text>
      {action ? <Pressable onPress={action()} /> : <View style={styles.logo} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    width: 30,
    height: 30,
  },
});

export default Header;

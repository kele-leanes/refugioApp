import React from 'react';
import {StyleSheet, Text} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {Theme} from '../constants';

export default function Button({title, onPress, icon, color, disabled}) {
  return (
    <Icon.Button
      name={icon}
      backgroundColor={disabled ? '#ccc' : color}
      onPress={onPress}
      disabled={disabled}>
      <Text style={styles.text}>{title}</Text>
    </Icon.Button>
  );
}
const styles = StyleSheet.create({
  text: {
    color: Theme.COLORS.WHITE,
    fontFamily: Theme.FONT.FAMILY,
    fontSize: 20,
  },
});

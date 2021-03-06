import React from 'react';
import {TextInput, StyleSheet, View, Text} from 'react-native';
import {Theme} from './../constants';

const Input = ({
  label,
  value,
  onChangeText,
  wrapperStyle,
  inputStyle,
  editable,
  maxLength,
}) => {
  return (
    <View style={wrapperStyle ? wrapperStyle : styles.inputWrapper}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={{...styles.input, ...inputStyle}}
        value={value}
        onChangeText={onChangeText}
        editable={!editable}
        maxLength={maxLength}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 10,
  },
  label: {
    fontSize: 20,
    fontFamily: Theme.FONT.FAMILY,
    color: Theme.COLORS.WHITE,
  },
  input: {
    width: '50%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 15,
    height: 40,
    paddingLeft: 10,
    fontSize: 20,
    fontFamily: Theme.FONT.FAMILY,
    color: Theme.COLORS.WHITE,
    backgroundColor: Theme.COLORS.BACKGROUND,
  },
});

export default Input;

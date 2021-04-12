import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {Theme} from './../constants';

const Select = ({data = [], value, onValueChange, label, labelStyle}) => {
  return (
    <View style={styles.selectWrapper}>
      {label && <Text style={{...styles.label, ...labelStyle}}>{label}</Text>}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={value}
          onValueChange={onValueChange}
          mode={'dropdown'}
          style={styles.picker}
          dropdownIconColor={Theme.COLORS.WHITE}>
          {data &&
            data.map((item, index) => (
              <Picker.Item
                label={item.label}
                value={item.value}
                key={index.toString()}
              />
            ))}
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  selectWrapper: {
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
  pickerContainer: {
    width: '50%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 15,
    height: 40,
    paddingLeft: 10,
    fontSize: 20,
    backgroundColor: Theme.COLORS.BACKGROUND,
    justifyContent: 'center',
  },
  picker: {
    color: Theme.COLORS.WHITE,
  },
});

export default Select;

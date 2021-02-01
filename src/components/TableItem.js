import React from 'react';
import {Button, Text, View, StyleSheet} from 'react-native';
import {Theme} from '../constants';

const TableItem = (props) => {
  const {id, name, isOpen, deleteTable} = props;
  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: isOpen ? Theme.COLORS.ERROR : Theme.COLORS.SUCCESS,
      }}>
      <View>
        <Text>Mesa: {name}</Text>
      </View>
      <View style={styles.buttonRow}>
        <Button onPress={() => console.log('PRESSED')} title={'Abrir Mesa'} />
        <Button onPress={() => console.log('PRESSED')} title={'Cerrar Mesa'} />
        <Button onPress={() => deleteTable(id)} title={'Borrar Mesa'} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    width: '100%',
    height: 80,
    alignItems: 'center',
    padding: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    width: '40%',
    justifyContent: 'space-around',
  },
});

export default TableItem;

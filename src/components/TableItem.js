import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {Theme} from '../constants';
import Button from '../components/Button';

const TableItem = ({id, orderId, name, deleteTable, openTable, navigation}) => {
  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: orderId ? Theme.COLORS.ERROR : Theme.COLORS.SUCCESS,
      }}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>mesa: {name}</Text>
        <Text style={styles.subTitle}>{}</Text>
      </View>
      {orderId ? (
        <View style={{...styles.buttonRow, justifyContent: 'flex-end'}}>
          {/* <Button
            title={'Cerrar'}
            onPress={() => console.log(id)}
            icon={'dollar-sign'}
            color={Theme.COLORS.SECONDARY}
          /> */}
          <Button
            title={'Agegar'}
            onPress={() => navigation.navigate('Cargar orden', {id, orderId})}
            icon={'file-plus'}
            color={Theme.COLORS.SECONDARY}
          />
        </View>
      ) : (
        <View style={styles.buttonRow}>
          <Button
            title={'Abrir'}
            onPress={() => openTable(id)}
            icon={'book-open'}
            color={Theme.COLORS.SECONDARY}
          />
          <Button
            title={'Borrar'}
            onPress={() => deleteTable(id)}
            icon={'trash'}
            color={Theme.COLORS.SECONDARY}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    maxWidth: '49%',
    height: 80,
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: Theme.COLORS.SECONDARY,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    width: '60%',
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: Theme.FONT.FAMILY,
    color: Theme.COLORS.WHITE,
    fontSize: 30,
  },
  subTitle: {
    fontFamily: Theme.FONT.FAMILY,
    color: '#ccc',
    fontSize: 20,
  },
});

export default TableItem;

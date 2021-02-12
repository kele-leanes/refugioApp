import React from 'react';
import {useState} from 'react';
import {
  Text,
  View,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ToastAndroid,
} from 'react-native';
import {Theme} from '../constants';
import Icon from 'react-native-vector-icons/Feather';
import Input from './Input';
import {db} from '../services/dbService';
import Button from './Button';

const AddTableModal = ({visible, onClose, fetchTables}) => {
  const [tableName, setTableName] = useState();

  const addNewTable = () => {
    db.transaction(function (tx) {
      tx.executeSql(
        'INSERT INTO tables (table_name) VALUES (?)',
        [tableName],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            fetchTables();
            onClose();
          }
          return ToastAndroid.show(
            'Nueva Mesa Agregada',
            ToastAndroid.BOTTOM,
            ToastAndroid.SHORT,
          );
        },
        (tx, error) =>
          Alert.alert('Error', 'Algo salió mal. Intente nuevamente'),
      );
    });
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TouchableOpacity onPress={() => onClose()} style={styles.closeBtn}>
            <Icon name={'x'} color={Theme.COLORS.WHITE} size={20} />
          </TouchableOpacity>
          <Text style={styles.modalText}>NUEVA MESA</Text>
          <View style={styles.inputWrapper}>
            <Input
              label={'Nombre'}
              value={tableName}
              onChangeText={(text) => setTableName(text)}
            />
          </View>
          <View style={styles.btnWrapper}>
            <Button
              title={'cancelar'}
              onPress={() => onClose()}
              icon={'x'}
              color={Theme.COLORS.ERROR}
            />
            <Button
              title={'Agregar'}
              icon={'check'}
              color={Theme.COLORS.SUCCESS}
              onPress={() => {
                addNewTable();
              }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: Theme.COLORS.SECONDARY,
    borderRadius: 20,
    padding: 100,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalText: {
    fontSize: 40,
    marginBottom: 15,
    textAlign: 'center',
    fontFamily: Theme.FONT.FAMILY,
    color: Theme.COLORS.WHITE,
  },
  closeBtn: {
    right: 25,
    top: 25,
    position: 'absolute',
  },
  inputWrapper: {
    padding: 10,
  },
  btnWrapper: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
export default AddTableModal;

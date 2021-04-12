import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ToastAndroid,
  FlatList,
} from 'react-native';
import {Theme} from '../../constants';
import Icon from 'react-native-vector-icons/Feather';
import Input from '../Input';
import {db} from '../../services/dbService';
import Button from '../Button';

const AddWaiterModal = ({visible, onClose}) => {
  const [waiterName, setWaiterName] = useState();
  const [waiters, setWaiters] = useState([]);

  useEffect(() => {
    fetchWaiters();
  }, []);

  const fetchWaiters = () => {
    db.transaction((tx) => {
      tx.executeSql('SELECT *  FROM waiters', [], (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push(results.rows.item(i));
        }
        setWaiters(temp);
      });
    });
  };

  const addNewWaiter = () => {
    db.transaction(function (tx) {
      tx.executeSql(
        'INSERT INTO waiters (waiter_name) VALUES (?)',
        [waiterName],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            fetchWaiters();
            setWaiterName(null);
          }
          return ToastAndroid.show(
            'Nuevo Mozo Agregado',
            ToastAndroid.BOTTOM,
            ToastAndroid.SHORT,
          );
        },
        (tx, error) =>
          Alert.alert('Error', 'Algo salió mal. Intente nuevamente'),
      );
    });
  };
  const deleteWaiter = (id) => {
    db.transaction(function (tx) {
      tx.executeSql('DELETE FROM waiters WHERE id=?', [id], (tx, results) => {
        if (results.rowsAffected > 0) {
          fetchWaiters();
          return ToastAndroid.show(
            'Mozo Eliminado',
            ToastAndroid.BOTTOM,
            ToastAndroid.SHORT,
          );
        } else {
          return ToastAndroid.show(
            'No se pudo eliminar',
            ToastAndroid.BOTTOM,
            ToastAndroid.SHORT,
          );
        }
      });
    });
  };

  const RenderItem = ({item}) => {
    return (
      <View style={styles.item}>
        <Text style={styles.itemText}>{item.waiter_name}</Text>
        <TouchableOpacity onPress={() => deleteWaiter(item.id)}>
          <Icon name={'x'} color={Theme.COLORS.ERROR} size={25} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TouchableOpacity onPress={() => onClose()} style={styles.closeBtn}>
            <Icon name={'x'} color={Theme.COLORS.WHITE} size={20} />
          </TouchableOpacity>
          <Text style={styles.modalText}>AGREGAR MOZO</Text>
          <View style={styles.inputWrapper}>
            <Input
              label={'Nombre'}
              value={waiterName}
              onChangeText={(text) => setWaiterName(text)}
            />
          </View>
          <View style={styles.itemsContainer}>
            {waiters.length > 0
              ? waiters.map((waiter) => (
                  <RenderItem item={waiter} key={waiter.id} />
                ))
              : null}
          </View>
          {/* <FlatList
            data={waiters}
            keyExtractor={(item) => item.id.toString()}
            renderItem={RenderItem}
            numColumns={4}
            style={{width: '50%', maxHeight: 400}}
          /> */}
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
                addNewWaiter();
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
    padding: 60,
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

  inputStyle: {
    margin: 0,
    width: '100%',
  },
  btnWrapper: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    height: 40,
    margin: 5,
    borderWidth: 1,
    borderColor: Theme.COLORS.SECONDARY,
    borderRadius: 5,
    backgroundColor: Theme.COLORS.PRIMARY,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  itemText: {
    fontSize: 20,
    fontFamily: Theme.FONT.FAMILY,
    color: Theme.COLORS.WHITE,
  },
  itemsContainer: {
    width: '60%',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
export default AddWaiterModal;

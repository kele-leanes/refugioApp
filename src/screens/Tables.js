import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useState, useLayoutEffect} from 'react';
import {
  FlatList,
  Text,
  View,
  Modal,
  TouchableHighlight,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import TableItem from '../components/TableItem';
import ScreenContainer from '../components/ScreenContainer';
import {Theme} from './../constants';

const db = SQLite.openDatabase({
  name: 'SQLite.db',
  location: 'default',
  createFromLocation: '~SQLite.db',
});

export default function Tables({navigation}) {
  const [flatListItems, setFlatListItems] = useState([]);
  const [tableName, setTableName] = useState();
  const [modalVisible, setModalVisible] = useState(false);

  const showTables = () => {
    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM tables', [], (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push(results.rows.item(i));
        }
        setFlatListItems(temp);
      });
    });
  };

  useFocusEffect(
    useCallback(() => {
      showTables();
    }, []),
  );
  const addNewTable = () => {
    db.transaction(function (tx) {
      tx.executeSql(
        'INSERT INTO tables (table_name) VALUES (?)',
        [tableName],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            console.log('OK');
            showTables();
          }
        },
      );
    });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
          <Text style={{...styles.textStyle, fontSize: 40}}>+</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, setModalVisible]);

  const deleteTable = (id) => {
    console.log(id);
    db.transaction(function (tx) {
      tx.executeSql('DELETE FROM tables WHERE id=?', [id], (tx, results) => {
        console.log('Results', results.rowsAffected);
        if (results.rowsAffected > 0) {
          console.log('OK');
          showTables();
        }
      });
    });
  };

  const RenderItem = ({item}) => {
    return (
      <TableItem
        id={item.id}
        name={item.table_name}
        isOpen={item.order_id}
        deleteTable={deleteTable}
      />
    );
  };
  const Separator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: '#ccc',
        }}
      />
    );
  };
  return (
    <ScreenContainer>
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>NUEVA MESA</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nombre: </Text>
              <TextInput
                style={styles.input}
                value={tableName}
                onChangeText={(text) => setTableName(text)}
              />
            </View>
            <TouchableHighlight
              style={{...styles.openButton, backgroundColor: '#2196F3'}}
              onPress={() => {
                addNewTable();
                setModalVisible(!modalVisible);
              }}>
              <Text style={styles.textStyle}>Crear</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>
      <FlatList
        data={flatListItems}
        renderItem={RenderItem}
        style={{width: '100%'}}
        ItemSeparatorComponent={Separator}
        keyExtractor={(item) => item.id.toString()}
      />
    </ScreenContainer>
  );
}

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
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    fontSize: 40,
    marginBottom: 15,
    textAlign: 'center',
    fontFamily: Theme.FONT.FAMILY,
    color: Theme.COLORS.WHITE,
  },
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 20,
  },
  input: {
    width: '20%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 15,
    height: 40,
  },
});

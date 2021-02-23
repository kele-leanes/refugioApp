import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useState, useLayoutEffect} from 'react';
import {FlatList, TouchableOpacity, Alert} from 'react-native';
import {db} from '../services/dbService';
import TableItem from '../components/TableItem';
import ScreenContainer from '../components/ScreenContainer';
import Icon from 'react-native-vector-icons/Feather';
import {Theme} from './../constants';
import AddTableModal from '../components/AddTableModal';

export default function Tables({navigation}) {
  const [flatListItems, setFlatListItems] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const showTables = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT tables.id, tables.table_name, orders.id AS order_id  FROM tables LEFT JOIN orders ON tables.id = orders.table_id',
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push(results.rows.item(i));
          }
          setFlatListItems(temp);
        },
      );
    });
  };

  useFocusEffect(
    useCallback(() => {
      showTables();
    }, []),
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
          <Icon name={'plus'} color={Theme.COLORS.WHITE} size={30} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, setModalVisible]);

  const deleteTable = (id) => {
    db.transaction(function (tx) {
      tx.executeSql('DELETE FROM tables WHERE id=?', [id], (tx, results) => {
        if (results.rowsAffected > 0) {
          console.log('OK');
          showTables();
        }
      });
    });
  };

  const openTable = (id) => {
    db.transaction(function (tx) {
      tx.executeSql(
        'INSERT INTO orders (table_id, order_date) VALUES (?,?)',
        [id, Date.now()],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            let orderId = results.insertId;
            navigation.navigate('Cargar orden', {id, orderId});
          }
        },
        (tx, error) => {
          Alert.alert('Error', 'Algo salió mal. Intente nuevamente');
        },
      );
    });
  };

  const RenderItem = ({item}) => {
    return (
      <TableItem
        id={item.id}
        orderId={item.order_id}
        name={item.table_name}
        deleteTable={deleteTable}
        openTable={openTable}
        navigation={navigation}
      />
    );
  };

  return (
    <ScreenContainer>
      <AddTableModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        fetchTables={showTables}
      />
      <FlatList
        data={flatListItems}
        renderItem={RenderItem}
        style={{width: '100%'}}
        numColumns={2}
        columnWrapperStyle={{padding: 5, justifyContent: 'space-around'}}
        keyExtractor={(item) => item.id.toString()}
      />
    </ScreenContainer>
  );
}

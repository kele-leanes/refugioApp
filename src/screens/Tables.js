import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState, useLayoutEffect } from 'react';
import {
  FlatList,
  TouchableOpacity,
  Alert,
  View,
  StyleSheet,
  ToastAndroid,
} from 'react-native';
import { db } from '../services/dbService';
import TableItem from '../components/TableItem';
import ScreenContainer from '../components/ScreenContainer';
import Icon from 'react-native-vector-icons/Feather';
import { Theme } from './../constants';
import AddTableModal from '../components/Modals/AddTableModal';
import { useOrientation } from '../services/useOrientation';
import AddWaiterModal from '../components/Modals/AddWaiterModal';
import { PrinterSelectorModal } from '../components/Modals/PrinterSelecorModal';

export default function Tables({ navigation }) {
  const [flatListItems, setFlatListItems] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [waitersModalVisible, setWaitersModalVisible] = useState(false);
  const [printerModalVisible, setPrinterModalVisible] = useState(false);

  const showTables = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT tables.id, tables.table_name, orders.order_total, orders.id AS order_id  FROM tables LEFT JOIN orders ON tables.id = orders.table_id',
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
        <View style={styles.btnWrapper}>
          <TouchableOpacity
            onPress={() => setWaitersModalVisible(true)}
            style={styles.headerBtn}>
            <Icon name={'user-plus'} color={Theme.COLORS.WHITE} size={30} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={styles.headerBtn}>
            <Icon name={'plus'} color={Theme.COLORS.WHITE} size={30} />
          </TouchableOpacity>
        </View>
      ),
      headerLeft: headerLeft,
    });
  }, [navigation]);

  const headerLeft = () => {
    return (
      <TouchableOpacity onPress={() => setPrinterModalVisible(true)}>
        <Icon name={'printer'} color={Theme.COLORS.WHITE} size={30} />
      </TouchableOpacity>
    );
  };

  const deleteTable = (id) => {
    db.transaction(function (tx) {
      tx.executeSql('DELETE FROM tables WHERE id=?', [id], (tx, results) => {
        if (results.rowsAffected > 0) {
          showTables();
          return ToastAndroid.show(
            'Mesa Eliminada',
            ToastAndroid.BOTTOM,
            ToastAndroid.SHORT,
          );
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
            navigation.navigate('Cargar orden', { id, orderId });
          }
        },
        (tx, error) => {
          Alert.alert('Error', 'Algo salió mal. Intente nuevamente');
        },
      );
    });
  };

  const RenderItem = ({ item }) => {
    return (
      <TableItem
        id={item.id}
        orderId={item.order_id}
        name={item.table_name}
        orderTotal={item.order_total}
        deleteTable={deleteTable}
        openTable={openTable}
        navigation={navigation}
      />
    );
  };
  const numCols = useOrientation() === 'PORTRAIT' ? 3 : 4;
  return (
    <ScreenContainer>
      <AddTableModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        fetchTables={showTables}
      />
      <AddWaiterModal
        visible={waitersModalVisible}
        onClose={() => setWaitersModalVisible(false)}
      />
      <PrinterSelectorModal
        isVisible={printerModalVisible}
        onClose={() => setPrinterModalVisible(false)}
      />
      <FlatList
        data={flatListItems}
        renderItem={RenderItem}
        style={{ width: '100%' }}
        numColumns={numCols}
        key={numCols}
        keyExtractor={(item) => item.id.toString()}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  btnWrapper: {
    flexDirection: 'row',
  },
  headerBtn: {
    marginLeft: 100,
  },
});

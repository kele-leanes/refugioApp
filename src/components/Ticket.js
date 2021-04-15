import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { Theme } from '../constants';
import Button from './Button';
import PrintInvoiceModal from './Modals/PrintInvoiceModal';
import PrintOrderModal from './Modals/PrintOrderModal';
import moment from 'moment';
import { db } from '../services/dbService';
import Select from './Select';
import { useOrientation } from '../services/useOrientation';

function Ticket({
  orderProducts,
  deleteProductFromOrder,
  orderData,
  setOrderTotal,
  closeOrder,
  changeTable,
  changeWaiter,
}) {
  const [modalTicketVisible, setModalTicketVisible] = useState(false);
  const [modalOrderVisible, setModalOrderVisible] = useState(false);
  const [productsToPrint, setProductsToPrint] = useState();
  const [waiters, setWaiters] = useState([]);
  const [avalaibleTables, setAvalablesTables] = useState([]);
  const [order, setOrder] = useState({
    date: '',
    table_name: '',
    table_id: '',
    order_id: '',
    waiter_name: '',
    waiter_id: null,
  });
  const direction = useOrientation() === 'PORTRAIT' ? 'column' : 'row';

  const _onClose = () => {
    setModalTicketVisible(false);
    setModalOrderVisible(false);
  };

  useEffect(() => {
    if (orderData) {
      setOrder({
        ...order,
        date: moment(orderData.order_date).format('DD/MM/YYYY HH:mm:ss'),
        table_id: orderData.table_id,
        table_name: orderData.table_name,
        order_id: orderData.id,
        waiter_name: orderData.waiter_name,
        waiter_id: orderData.waiter_id,
      });
      fetchWaiters();
      fetchAvalaibleTables();
    }
  }, [orderData]);

  const fetchWaiters = () => {
    db.transaction((tx) => {
      tx.executeSql('SELECT *  FROM waiters', [], (tx, results) => {
        var temp = [{ label: 'Ninguno', value: null }];
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push({
            label: results.rows.item(i).waiter_name,
            value: results.rows.item(i).id,
          });
        }
        setWaiters(temp);
      });
    });
  };

  const fetchAvalaibleTables = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT tables.id, tables.table_name, orders.id AS order_id FROM tables LEFT JOIN orders ON tables.id = orders.table_id WHERE orders.id IS NULL',
        [],
        (tx, results) => {
          var temp = [
            { label: orderData.table_name, value: orderData.table_id },
          ];
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push({
              label: results.rows.item(i).table_name,
              value: results.rows.item(i).id,
            });
          }
          setAvalablesTables(temp);
        },
      );
    });
  };

  const onChangeTable = (value) => {
    setOrder({
      ...order,
      table_id: value,
      table_name: avalaibleTables.find((table) => table.value === value).label,
    });
    changeTable(value);
  };

  const onChangeWaiter = (value) => {
    setOrder({
      ...order,
      waiter_id: value,
      waiter_name: waiters.find((waiter) => waiter.value === value).label,
    });
    changeWaiter(value);
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity style={styles.productRow} activeOpacity={1}>
        <View style={styles.oneCell}>
          <Text style={{ textAlign: 'center' }}>{item.product_qty}</Text>
        </View>
        <View style={styles.threeCell}>
          <Text numberOfLines={1} ellipsizeMode={'tail'}>
            {item.product_name.toUpperCase()}
          </Text>
        </View>
        <View style={styles.twoCell}>
          <Text>$ {item.product_price.toFixed(2)}</Text>
        </View>
        <View style={styles.twoCell}>
          <Text>$ {item.subtotal.toFixed(2)}</Text>
        </View>
        <View style={styles.oneCell}>
          <TouchableOpacity onPress={() => deleteProductFromOrder(item.id)}>
            <Icon name={'minus-circle'} size={20} color={Theme.COLORS.ERROR} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const toCalculateTotal = useMemo(() => calculateTotal(), [orderProducts]);

  function calculateTotal() {
    let total = 0;
    orderProducts.forEach((prod) => (total += prod.subtotal));
    setOrderTotal(total);
    return total;
  }

  const openPrintModal = (type) => {
    if (type) {
      setModalOrderVisible(true);
      setProductsToPrint(
        orderProducts.filter((elem) => elem.type_name === type),
      );
    } else {
      setModalTicketVisible(true);
      setProductsToPrint(orderProducts);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>EL REFUGIO</Text>
        <Text style={styles.subTitle}>BAR SERRANO</Text>
      </View>
      <View style={styles.orderInfo}>
        <Text>FECHA: {order.date}</Text>
        <View style={{ ...styles.inputWrapper, flexDirection: direction }}>
          <Text>MESA: </Text>
          <Select
            data={avalaibleTables}
            value={order.table_id}
            onValueChange={(value) => onChangeTable(value)}
          />
          <Text>MOZO: </Text>
          <Select
            data={waiters}
            value={order.waiter_id}
            onValueChange={(value) => onChangeWaiter(value)}
          />
        </View>
      </View>
      <View style={styles.topRow}>
        <View style={styles.oneCell}>
          <Text style={{ color: Theme.COLORS.WHITE }}>CNT</Text>
        </View>
        <View style={styles.threeCell}>
          <Text style={{ color: Theme.COLORS.WHITE }}>DESCRIPCION</Text>
        </View>
        <View style={styles.twoCell}>
          <Text style={{ color: Theme.COLORS.WHITE }}>UNITARIO</Text>
        </View>
        <View style={styles.twoCell}>
          <Text style={{ color: Theme.COLORS.WHITE }}>TOTAL</Text>
        </View>
        <View style={styles.oneCell} />
      </View>
      <FlatList
        data={orderProducts}
        renderItem={renderItem}
        style={{ width: '100%' }}
        keyExtractor={(item) => item.id.toString()}
      />
      <View style={styles.topRow}>
        <Text style={{ color: Theme.COLORS.WHITE }}>TOTAL:</Text>
        <Text style={{ color: Theme.COLORS.WHITE }}>
          $ {toCalculateTotal.toFixed(2)}
        </Text>
      </View>
      <View style={styles.btnRow}>
        <Button
          title={'parrilla'}
          icon={'printer'}
          color={Theme.COLORS.SECONDARY}
          disabled={!order.waiter_id}
          onPress={() => openPrintModal('Parrilla')}
        />
        <Button
          title={'cocina'}
          icon={'printer'}
          color={Theme.COLORS.SECONDARY}
          disabled={!order.waiter_id}
          onPress={() => openPrintModal('Cocina')}
        />
        <Button
          title={'Barra'}
          icon={'printer'}
          color={Theme.COLORS.SECONDARY}
          disabled={!order.waiter_id}
          onPress={() => openPrintModal('Bebida')}
        />
        <Button
          title={'Cerrar mesa'}
          icon={'dollar-sign'}
          color={Theme.COLORS.SUCCESS}
          onPress={() => {
            openPrintModal();
          }}
        />
      </View>
      <PrintInvoiceModal
        visible={modalTicketVisible}
        onClose={_onClose}
        orderProducts={productsToPrint}
        orderData={order}
        closeOrder={closeOrder}
        setOrderTotal={setOrderTotal}
      />
      <PrintOrderModal
        visible={modalOrderVisible}
        onClose={_onClose}
        orderProducts={productsToPrint}
        orderData={order}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.COLORS.WHITE,
    flex: 1,
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  header: {
    margin: 20,
    alignItems: 'center',
  },
  title: {
    fontFamily: Theme.FONT.FAMILY,
    fontSize: 30,
    fontWeight: 'bold',
  },
  subTitle: {
    fontWeight: 'bold',
    fontSize: 10,
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: Theme.COLORS.SECONDARY,
  },
  topRow: {
    backgroundColor: Theme.COLORS.SECONDARY,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    padding: 5,
  },
  orderInfo: {
    width: '100%',
    justifyContent: 'space-between',
    padding: 5,
  },
  threeCell: {
    flex: 3,
    alignSelf: 'stretch',
  },
  twoCell: {
    flex: 2,
    alignSelf: 'stretch',
  },
  oneCell: {
    flex: 1,
    alignSelf: 'stretch',
  },
  productRow: {
    flex: 1,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: Theme.COLORS.SECONDARY,
    paddingVertical: 20,
  },
  btnRow: {
    flexDirection: 'row',
    margin: 10,
    width: '100%',
    justifyContent: 'space-evenly',
    flexWrap: 'wrap',
    height: 110,
  },
  inputWrapper: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default Ticket;

import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, FlatList, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {Theme} from '../constants';
import Button from './Button';
import PrintTicketModal from './PrintTicketModal';
import moment from 'moment';

function Ticket({
  orderProducts,
  deleteProductFromOrder,
  orderData,
  setOrderTotal,
  navigation,
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [productsToPrint, setProductsToPrint] = useState();
  const [order, setOrder] = useState({date: '', table_name: ''});

  const _onClose = () => {
    setModalVisible(!modalVisible);
  };

  useEffect(() => {
    if (orderData) {
      setOrder({
        ...order,
        date: moment(orderData.order_date).format('DD/MM/YYYY'),
        table_name: orderData.table_name,
      });
    }
  }, [orderData]);

  const renderItem = ({item}) => {
    return (
      <View style={styles.productRow}>
        <View style={styles.oneCell}>
          <Text style={{textAlign: 'center'}}>{item.product_qty}</Text>
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
      </View>
    );
  };

  const calculateTotal = () => {
    let total = 0;
    orderProducts.forEach((prod) => (total += prod.subtotal));
    return total;
  };

  const openPrintModal = (type) => {
    setModalVisible(true);
    setProductsToPrint(orderProducts.filter((elem) => elem.type_name === type));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>EL REFUGIO</Text>
        <Text style={styles.subTitle}>BAR SERRANO</Text>
      </View>
      <View style={styles.orderInfo}>
        <Text>MESA: {order.table_name}</Text>
        <Text>FECHA: {order.date}</Text>
      </View>
      <View style={styles.topRow}>
        <View style={styles.oneCell}>
          <Text style={{color: Theme.COLORS.WHITE}}>CNT</Text>
        </View>
        <View style={styles.threeCell}>
          <Text style={{color: Theme.COLORS.WHITE}}>DESCRIPCION</Text>
        </View>
        <View style={styles.twoCell}>
          <Text style={{color: Theme.COLORS.WHITE}}>UNITARIO</Text>
        </View>
        <View style={styles.twoCell}>
          <Text style={{color: Theme.COLORS.WHITE}}>TOTAL</Text>
        </View>
        <View style={styles.oneCell} />
      </View>
      <FlatList
        data={orderProducts}
        renderItem={renderItem}
        style={{width: '100%'}}
        keyExtractor={(item) => item.id.toString()}
      />
      <View style={styles.topRow}>
        <Text style={{color: Theme.COLORS.WHITE}}>TOTAL:</Text>
        <Text style={{color: Theme.COLORS.WHITE}}>
          $ {calculateTotal().toFixed(2)}
        </Text>
      </View>
      <View style={styles.btnRow}>
        <Button
          title={'parrilla'}
          icon={'printer'}
          color={Theme.COLORS.SECONDARY}
          onPress={() => openPrintModal('Parrilla')}
        />
        <Button
          title={'cocina'}
          icon={'printer'}
          color={Theme.COLORS.SECONDARY}
          onPress={() => openPrintModal('Cocina')}
        />
        <Button
          title={'Cerrar mesa'}
          icon={'dollar-sign'}
          color={Theme.COLORS.SUCCESS}
          onPress={() => {
            navigation.navigate('Conectar impresora');
            setOrderTotal(calculateTotal());
          }}
        />
      </View>
      <PrintTicketModal
        visible={modalVisible}
        onClose={_onClose}
        orderProducts={productsToPrint}
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
    fontSize: 40,
    fontWeight: 'bold',
  },
  subTitle: {
    fontWeight: 'bold',
    fontSize: 20,
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
    flexDirection: 'row',
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
    height: 100,
  },
});

export default Ticket;

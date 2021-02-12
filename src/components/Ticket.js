import React from 'react';
import {View, StyleSheet, Text, FlatList, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {Theme} from '../constants';
import Button from './Button';

function Ticket({orderProducts, deleteProductFromOrder}) {
  const renderItem = ({item}) => {
    return (
      <View style={styles.productRow}>
        <View style={styles.oneCell}>
          <Text style={{textAlign: 'center'}}>{item.product_qty}</Text>
        </View>
        <View style={styles.threeCell}>
          <Text>{item.product_name.toUpperCase()}</Text>
        </View>
        <View style={styles.twoCell}>
          <Text>$ {item.product_price.toFixed(2)}</Text>
        </View>
        <View style={styles.twoCell}>
          <Text>$ {(item.product_price * item.product_qty).toFixed(2)}</Text>
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
    orderProducts.forEach(
      (prod) => (total += prod.product_price * prod.product_qty),
    );
    return total.toFixed(2);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>EL REFUGIO</Text>
        <Text style={styles.subTitle}>BAR SERRANO</Text>
      </View>
      <View style={styles.topRow}>
        <View style={styles.oneCell}>
          <Text style={{color: Theme.COLORS.WHITE}}>CANT.</Text>
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
        <Text style={{color: Theme.COLORS.WHITE}}>$ {calculateTotal()}</Text>
      </View>
      <View style={styles.btnRow}>
        <Button
          title={'parrilla'}
          icon={'printer'}
          color={Theme.COLORS.SECONDARY}
        />
        <Button
          title={'cocina'}
          icon={'printer'}
          color={Theme.COLORS.SECONDARY}
        />
        <Button
          title={'Cerrar mesa'}
          icon={'dollar-sign'}
          color={Theme.COLORS.SUCCESS}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.COLORS.WHITE,
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  header: {
    margin: 20,
    alignItems: 'center',
  },
  title: {
    fontFamily: Theme.FONT.FAMILY,
    fontSize: 60,
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
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: Theme.COLORS.SECONDARY,
    paddingVertical: 20,
    alignSelf: 'stretch',
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

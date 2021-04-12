import React from 'react';
import {useState, useEffect, useCallback} from 'react';
import {
  Text,
  View,
  Modal,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {Theme} from '../../constants';
import Icon from 'react-native-vector-icons/Feather';
import Input from '../Input';
import Button from '../Button';
import {printInvoice} from '../../utils/Invoice';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';

const PrintInvoiceModal = ({
  visible,
  orderProducts,
  orderData,
  onClose,
  closeOrder,
  setOrderTotal,
  currentPrinter,
  isLoading,
}) => {
  const [productsToPrint, setProductsToPrint] = useState([]);

  const navigation = useNavigation();

  useEffect(() => {
    setProductsToPrint(orderProducts);
    return () => setProductsToPrint([]);
  }, [orderProducts]);

  const printRecipt = () => {
    currentPrinter &&
      printInvoice(productsToPrint, orderData, calculateTotal());
  };

  const deleteProduct = (id) => {
    setProductsToPrint(productsToPrint.filter((elem) => elem.id !== id));
  };

  const updateField = (value, index, key) => {
    let products = [...productsToPrint];
    products[index] = {...products[index], [key]: value};
    setProductsToPrint(products);
  };

  const closeOrderAlert = () => {
    Alert.alert('ATENCION', '¿Deseas cerrar la mesa?', [
      {
        text: 'Cancelar',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => {
          navigation.navigate('Mesas');
          setOrderTotal(calculateTotal());
          closeOrder();
        },
      },
    ]);
  };

  const calculateTotal = useCallback(() => {
    let total = 0;
    productsToPrint?.forEach(
      (prod) => (total += prod.product_qty * prod.product_price),
    );
    return total;
  }, [productsToPrint]);

  const printItem = ({item, index}) => {
    return (
      <View style={styles.itemContainer}>
        <View style={styles.oneCell}>
          <Input
            value={item.product_qty.toString()}
            onChangeText={(text) => updateField(text, index, 'product_qty')}
            inputStyle={styles.inputStyle}
            wrapperStyle={{margin: 0}}
          />
        </View>
        <View style={styles.twoCell}>
          <Input
            value={item.product_name}
            inputStyle={styles.inputStyle}
            wrapperStyle={{margin: 0}}
            editable
          />
        </View>
        <View style={styles.oneCell}>
          <TouchableOpacity onPress={() => deleteProduct(item.id)}>
            <Icon name={'minus-circle'} size={20} color={Theme.COLORS.ERROR} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const ItemHeader = () => {
    return (
      <View style={styles.topRow}>
        <View style={styles.oneCell}>
          <Text style={{color: Theme.COLORS.WHITE}}>CANT.</Text>
        </View>
        <View style={styles.twoCell}>
          <Text style={{color: Theme.COLORS.WHITE}}>DESCRIPCION</Text>
        </View>
        <View style={styles.oneCell}>
          <Text style={{color: Theme.COLORS.WHITE}}>QUITAR</Text>
        </View>
      </View>
    );
  };

  const ItemFooter = () => {
    return (
      <View style={styles.topRow}>
        <Text style={{color: Theme.COLORS.WHITE}}>TOTAL:</Text>
        <Text style={{color: Theme.COLORS.WHITE}}>$ {calculateTotal()}</Text>
      </View>
    );
  };
  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TouchableOpacity
            onPress={() => {
              setProductsToPrint(orderProducts);
              onClose();
            }}
            style={styles.closeBtn}>
            <Icon name={'x'} color={Theme.COLORS.WHITE} size={20} />
          </TouchableOpacity>
          <View style={styles.printerStatus}>
            <Text style={{color: Theme.COLORS.WHITE}}>IMPRESORA: </Text>
            <FontAwesome
              name={'circle'}
              color={currentPrinter ? Theme.COLORS.SUCCESS : Theme.COLORS.ERROR}
              size={20}
            />
            <Text style={{color: Theme.COLORS.WHITE}}>
              {currentPrinter ? ' ' + currentPrinter : ' NO CONECTADA '}
            </Text>
            {isLoading && (
              <ActivityIndicator size={10} color={Theme.COLORS.WHITE} />
            )}
          </View>
          <Text style={styles.modalText}>IMPRIMIR TICKET</Text>
          {productsToPrint ? (
            productsToPrint.length > 0 ? (
              <FlatList
                data={productsToPrint}
                renderItem={printItem}
                keyExtractor={(item) => item.id.toString()}
                ListHeaderComponent={ItemHeader}
                ListFooterComponent={ItemFooter}
                style={{width: '30%', maxHeight: 400}}
              />
            ) : (
              <Text style={styles.alertText}>
                NO HAY ELEMENTOS PARA IMPRIMIR
              </Text>
            )
          ) : null}
          <View style={styles.btnWrapper}>
            <Button
              title={'cancelar'}
              onPress={() => {
                setProductsToPrint(orderProducts);
                onClose();
              }}
              icon={'x'}
              color={Theme.COLORS.ERROR}
            />
            <Button
              title={'Imprimir ticket'}
              icon={'printer'}
              disabled={
                !currentPrinter ||
                (productsToPrint && !productsToPrint.length > 0)
              }
              onPress={() => printRecipt()}
            />
            <Button
              title={'cerrar mesa'}
              onPress={() => closeOrderAlert()}
              icon={'dollar-sign'}
              disabled={productsToPrint && !productsToPrint.length > 0}
              color={Theme.COLORS.SUCCESS}
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
  printerStatus: {
    left: 25,
    top: 25,
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputStyle: {
    margin: 0,
    width: '100%',
  },
  btnWrapper: {
    width: '40%',
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'space-between',
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
  itemContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  threeCell: {
    flex: 3,
    marginEnd: 5,
  },
  twoCell: {
    flex: 2,
    marginEnd: 5,
  },
  oneCell: {
    flex: 1,
    marginEnd: 5,
    alignItems: 'center',
  },
  alertText: {
    color: Theme.COLORS.WHITE,
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    maxHeight: 400,
  },
});
export default PrintInvoiceModal;

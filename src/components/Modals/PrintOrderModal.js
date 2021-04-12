import React from 'react';
import {useState, useEffect} from 'react';
import {
  Text,
  View,
  Modal,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {Theme} from '../../constants';
import Icon from 'react-native-vector-icons/Feather';
import Input from '../Input';
import Button from '../Button';
import {printCommand} from '../../utils/Command';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const PrintOrderModal = ({
  visible,
  orderProducts,
  orderData,
  onClose,
  currentPrinter,
  isLoading,
}) => {
  const [productsToPrint, setProductsToPrint] = useState([]);

  useEffect(() => {
    setProductsToPrint(orderProducts);
  }, [orderProducts]);

  const printRecipt = () => {
    currentPrinter && printCommand(productsToPrint, orderData);
  };

  const deleteProduct = (id) => {
    setProductsToPrint(productsToPrint.filter((elem) => elem.id !== id));
  };

  const updateField = (value, index, key) => {
    let products = [...productsToPrint];
    products[index] = {...products[index], [key]: value};
    setProductsToPrint(products);
  };

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
        <View style={styles.threeCell}>
          <Input
            inputStyle={styles.inputStyle}
            wrapperStyle={{margin: 0}}
            onChangeText={(text) => updateField(text, index, 'comment')}
            maxLength={11}
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
        <View style={styles.threeCell}>
          <Text style={{color: Theme.COLORS.WHITE}}>OBSERVACIONES</Text>
        </View>
        <View style={styles.oneCell}>
          <Text style={{color: Theme.COLORS.WHITE}}>QUITAR</Text>
        </View>
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
          <Text style={styles.modalText}>IMPRIMIR COMANDA</Text>
          {productsToPrint ? (
            productsToPrint.length > 0 ? (
              <FlatList
                data={productsToPrint}
                renderItem={printItem}
                keyExtractor={(item) => item.id.toString()}
                ListHeaderComponent={ItemHeader}
                style={{width: '50%', maxHeight: 400}}
              />
            ) : (
              <Text style={{color: Theme.COLORS.WHITE}}>
                NO HAY ELEMENTOS PARA IMPRIMIR
              </Text>
            )
          ) : null}
          <View style={styles.btnWrapper}>
            <Button
              title={'cancelar'}
              onPress={() => onClose()}
              icon={'x'}
              color={Theme.COLORS.ERROR}
            />
            <Button
              title={'Imprimir'}
              icon={'printer'}
              disabled={!currentPrinter}
              color={Theme.COLORS.SUCCESS}
              onPress={() => printRecipt()}
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
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
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
});
export default PrintOrderModal;

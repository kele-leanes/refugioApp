import React, {useEffect, useState} from 'react';
import {
  Modal,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  ToastAndroid,
} from 'react-native';
import Button from './../components/Button';
import Icon from 'react-native-vector-icons/Feather';
import {Theme} from './../constants';
import Input from './Input';
import Select from './Select';
import {db} from '../services/dbService';
import {uploadImage} from './../services/uploadImage';

const AddProductModal = ({
  visible,
  onClose,
  fetchProducts,
  isUpdateModal,
  fetchedProduct,
}) => {
  const [product, setProduct] = useState({
    id: '',
    product_name: '',
    product_price: undefined,
    image: undefined,
    product_type_id: '',
  });
  const [productTypes, setProductTypes] = useState([]);

  const fetchTypes = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM product_types',
        [],
        (tx, results) => {
          var temp = [{value: null, label: 'Seleccionar...'}];
          for (let i = 0; i < results.rows.length; ++i) {
            const item = {
              value: results.rows.item(i).id,
              label: results.rows.item(i).type_name,
            };
            temp.push(item);
          }
          setProductTypes(temp);
        },
        (error) => console.log(error),
      );
    });
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  useEffect(() => {
    if (isUpdateModal) {
      setProduct(fetchedProduct);
    }
    return () =>
      setProduct({
        id: '',
        product_name: '',
        product_price: undefined,
        image: undefined,
        product_type_id: '',
      });
  }, [fetchedProduct]);

  const _uploadImage = () => {
    uploadImage()
      .then((img) => setProduct({...product, image: img}))
      .catch((error) =>
        ToastAndroid.show(
          'No se pudo procesar la imagen',
          ToastAndroid.BOTTOM,
          ToastAndroid.SHORT,
        ),
      );
  };

  const uploadProduct = () => {
    db.transaction(function (tx) {
      tx.executeSql(
        'INSERT INTO products (product_name, product_price, product_type_id, image) VALUES (?,?,?,?)',
        [
          product.product_name,
          product.product_price,
          product.product_type_id,
          product.image,
        ],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            console.log('OK');
            fetchProducts();
            _onClose();
          }
        },
        (tx, error) =>
          Alert.alert('Error', 'Algo salió mal. Intente nuevamente'),
      );
    });
  };

  const editProduct = () => {
    const {id, product_name, product_price, image, product_type_id} = product;
    db.transaction(function (tx) {
      tx.executeSql(
        'UPDATE products SET product_name=?, product_price=?, image=?, product_type_id=? WHERE id=?',
        [product_name, product_price, image, product_type_id, id],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            console.log('OK');
            fetchProducts();
            _onClose();
          }
          return ToastAndroid.show(
            'Producto editado con éxito',
            ToastAndroid.BOTTOM,
            ToastAndroid.SHORT,
          );
        },
        (tx, error) =>
          Alert.alert('Error', 'Algo salió mal. Intente nuevamente'),
      );
    });
  };

  const _onClose = () => {
    setProduct({
      id: '',
      product_name: '',
      product_price: undefined,
      image: undefined,
      product_type_id: '',
    });
    onClose();
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TouchableOpacity onPress={() => _onClose()} style={styles.closeBtn}>
            <Icon name={'x'} color={Theme.COLORS.WHITE} size={20} />
          </TouchableOpacity>
          <Text style={styles.modalText}>
            {isUpdateModal ? 'Editar Producto' : 'Agregar Producto'}
          </Text>
          <View style={styles.inputWrapper}>
            <Input
              label={'Nombre'}
              value={product.product_name}
              onChangeText={(text) =>
                setProduct({...product, product_name: text})
              }
            />
            <Input
              label={'Precio'}
              value={
                product.product_price
                  ? product.product_price.toString()
                  : product.product_price
              }
              onChangeText={(text) =>
                setProduct({...product, product_price: text})
              }
            />
            <Select
              label={'tipo'}
              value={product.product_type_id}
              data={productTypes}
              onValueChange={(text) =>
                setProduct({...product, product_type_id: text})
              }
            />
            <View style={styles.imgWrapper}>
              <Image
                style={styles.image}
                source={{uri: `data:image/jpg;base64,${product.image}`}}
              />
              <View>
                <Button
                  title={'subir imagen'}
                  onPress={() => _uploadImage()}
                  icon={'upload'}
                  color={Theme.COLORS.BACKGROUND}
                />
              </View>
            </View>
          </View>
          <View style={styles.btnWrapper}>
            <Button
              title={'cancelar'}
              onPress={() => _onClose()}
              icon={'x'}
              color={Theme.COLORS.ERROR}
            />
            <Button
              disabled={
                !product.product_name ||
                !product.product_price ||
                !product.product_type_id
              }
              title={isUpdateModal ? 'Editar' : 'Agregar'}
              onPress={
                isUpdateModal ? () => editProduct() : () => uploadProduct()
              }
              icon={'check'}
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
  btnWrapper: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  inputWrapper: {
    padding: 10,
  },
  imgWrapper: {
    margin: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  image: {
    height: 60,
    width: 60,
    marginRight: 10,
  },
});

export default AddProductModal;

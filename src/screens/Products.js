import React, {useState, useLayoutEffect, useEffect} from 'react';
import {TouchableOpacity, View} from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import Icon from 'react-native-vector-icons/Feather';
import {Theme} from '../constants';
import AddProductModal from '../components/AddProductModal';
import ProductList from '../components/ProductList';
import FilterCarousel from '../components/FilterCarousel';
import {db} from '../services/dbService';

export default function Products({navigation}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [products, setProducts] = useState([]);
  const [productTypes, setProductTypes] = useState([]);

  useEffect(() => {
    showProducts();
    fetchTypes();
  }, []);

  const fetchTypes = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM product_types',
        [],
        (tx, results) => {
          let temp = [{id: 0, type_name: 'todos'}];
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push(results.rows.item(i));
          }
          setProductTypes(temp);
        },
        (error) => console.log(error),
      );
    });
  };

  const showProducts = (productTypeId) => {
    if (productTypeId) {
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT products.id, products.product_name, products.product_price,products.image, product_types.type_name FROM products INNER JOIN product_types ON products.product_type_id = product_types.id WHERE product_types.id=?',
          [productTypeId],
          (tx, results) => {
            var temp = [];
            for (let i = 0; i < results.rows.length; ++i) {
              temp.push(results.rows.item(i));
            }
            setProducts(temp);
          },
        );
      });
    } else {
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT products.id, products.product_name, products.product_price,products.image, product_types.type_name FROM products INNER JOIN product_types ON products.product_type_id = product_types.id',
          [],
          (tx, results) => {
            var temp = [];
            for (let i = 0; i < results.rows.length; ++i) {
              temp.push(results.rows.item(i));
            }
            setProducts(temp);
          },
        );
      });
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            setModalVisible(!modalVisible);
          }}>
          <Icon name={'plus'} color={Theme.COLORS.WHITE} size={30} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <ScreenContainer>
      <View style={{height: 70, width: '100%'}}>
        <FilterCarousel data={productTypes} filterProducts={showProducts} />
      </View>
      <ProductList
        products={products}
        hasButton
        fetchProducts={() => showProducts()}
      />
      <AddProductModal
        visible={modalVisible}
        fetchProducts={() => showProducts()}
        onClose={() => setModalVisible(false)}
      />
    </ScreenContainer>
  );
}

import React, { useState } from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import ProductItem from './ProductItem';
import AddProductModal from './Modals/AddProductModal';
import { db } from '../services/dbService';

const ProductList = ({
  products,
  hasButton,
  fetchProducts,
  addProductToOrder,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [product, setProduct] = useState({
    product_name: '',
    product_price: undefined,
    image: undefined,
    product_type_id: '',
  });

  const openModal = (id) => {
    setModalVisible(true);
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT products.id, products.product_name, products.product_price, products.image, products.product_type_id FROM products WHERE products.id =?',
        [id],
        (tx, results) => {
          setProduct(results.rows.item(0));
        },
      );
    });
  };

  const deleteProduct = (id) => {
    db.transaction(function (tx) {
      tx.executeSql('DELETE FROM products WHERE id=?', [id], (tx, results) => {
        if (results.rowsAffected > 0) {
          fetchProducts();
        }
      });
    });
  };

  const RenderItem = ({ item }) => {
    return (
      <>
        {hasButton ? (
          <TouchableOpacity activeOpacity={1}>
            <ProductItem
              id={item.id}
              product_name={item.product_name}
              product_type={item.type_name}
              image={item.image}
              price={item.product_price}
              deleteProduct={deleteProduct}
              updateProduct={openModal}
              hasButton={hasButton}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => addProductToOrder(item.id)}>
            <ProductItem
              id={item.id}
              product_name={item.product_name}
              product_type={item.type_name}
              image={item.image}
              price={item.product_price}
            />
          </TouchableOpacity>
        )}
      </>
    );
  };

  return (
    <>
      <FlatList
        data={products}
        renderItem={RenderItem}
        style={{ width: '100%' }}
        keyExtractor={(item) => item.id.toString()}
      />
      <AddProductModal
        visible={modalVisible}
        fetchProducts={() => fetchProducts()}
        onClose={() => setModalVisible(false)}
        isUpdateModal
        fetchedProduct={product}
      />
    </>
  );
};

export default ProductList;

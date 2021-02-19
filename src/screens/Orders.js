import React, {useState, useEffect} from 'react';
import {Alert, View, Text, ActivityIndicator} from 'react-native';
import ProductList from '../components/ProductList';
import ScreenContainer from '../components/ScreenContainer';
import Ticket from '../components/Ticket';
import FilterCarousel from '../components/FilterCarousel';
import {db} from '../services/dbService';
import {Theme} from '../constants';

export default function Orders({route}) {
  const [products, setProducts] = useState(null);
  const [orderProducts, setOrderProducts] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [orderData, setOrderData] = useState();
  const [orderId, setOrderId] = useState(route.params.orderId);

  useEffect(() => {
    fetchTypes();
    showProducts();
    showOrderProducts(route.params.id);
    fetchOrderById(route.params.orderId);
    return () => setOrderId();
  }, []);

  const fetchOrderById = (id) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT orders.id, orders.order_date, orders.payment_method, tables.table_name FROM orders INNER JOIN tables ON orders.table_id = tables.id WHERE orders.id = ?',
        [id],
        (tx, results) => {
          if (results.rows.length > 0) {
            setOrderData(results.rows.item(0));
          }
        },
        (error) => console.log(error),
      );
    });
  };

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

  const showOrderProducts = (id) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT product_orders.id, product_orders.order_id, product_orders.product_id, product_orders.product_qty, orders.order_date, orders.payment_method, orders.table_id, orders.order_status, products.product_name, products.product_price, product_types.type_name FROM product_orders INNER JOIN orders ON product_orders.order_id = orders.id INNER JOIN products ON product_orders.product_id = products.id INNER JOIN product_types ON product_types.id = products.product_type_id WHERE table_id=?',
        [id],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push(results.rows.item(i));
          }
          setOrderProducts(temp);
        },
      );
    });
  };

  const addProductToOrder = (id) => {
    let isInOrder = orderProducts.filter(
      (product) => product.product_id === id,
    );
    if (isInOrder.length) {
      db.transaction((tx) => {
        tx.executeSql(
          'UPDATE product_orders SET product_qty =  product_qty + 1 WHERE id = ?',
          [isInOrder[0].id],
          (tx, results) => {
            if (results.rowsAffected > 0) {
              showOrderProducts(route.params.id);
            }
          },
          (tx, error) =>
            Alert.alert('Error', 'Algo salió mal. Intente nuevamente'),
        );
      });
    } else {
      db.transaction((tx) => {
        tx.executeSql(
          'INSERT INTO product_orders (product_id,order_id, product_qty) VALUES (?,?,?)',
          [id, orderId, 1],
          (tx, results) => {
            if (results.rowsAffected > 0) {
              showOrderProducts(route.params.id);
            }
          },
          (tx, error) =>
            Alert.alert('Error', 'Algo salió mal. Intente nuevamente'),
        );
      });
    }
  };

  const deleteProductFromOrder = (id) => {
    db.transaction(function (tx) {
      tx.executeSql(
        'DELETE FROM product_orders WHERE id=?',
        [id],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            showOrderProducts(route.params.id);
          }
        },
        (tx, error) =>
          Alert.alert('Error', 'Algo salió mal. Intente nuevamente'),
      );
    });
  };

  return (
    <ScreenContainer style={{flexDirection: 'row'}}>
      <View style={{width: '50%', padding: 10}}>
        <Ticket
          orderProducts={orderProducts}
          deleteProductFromOrder={deleteProductFromOrder}
          orderData={orderData}
        />
      </View>
      <View
        style={{
          width: '50%',
        }}>
        {products ? (
          products.length > 0 ? (
            <>
              <View style={{height: 70, width: '100%'}}>
                <FilterCarousel
                  data={productTypes}
                  filterProducts={showProducts}
                />
              </View>
              <ProductList
                products={products}
                addProductToOrder={addProductToOrder}
              />
            </>
          ) : (
            <Text>No hay productos disponibles</Text>
          )
        ) : (
          <ActivityIndicator size={80} color={Theme.COLORS.WHITE} />
        )}
      </View>
    </ScreenContainer>
  );
}

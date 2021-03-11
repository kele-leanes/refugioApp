import React from 'react';
import {Text, View, StyleSheet, Image} from 'react-native';
import {Theme} from '../constants';
import Icon from 'react-native-vector-icons/Feather';
import {TouchableOpacity} from 'react-native-gesture-handler';

const ProductItem = ({
  id,
  product_name,
  product_type,
  image,
  price,
  deleteProduct,
  updateProduct,
  hasButton,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftColumn}>
        <Image
          style={styles.image}
          source={{uri: `data:image/jpg;base64,${image}`}}
        />
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode={'tail'}>
            {product_name}
          </Text>
          <Text style={styles.subTitle}>{product_type}</Text>
        </View>
      </View>
      <View style={styles.middleColumn}>
        <Text style={styles.subTitle}>$ {price}</Text>
      </View>
      {hasButton ? (
        <View style={styles.rightColumn}>
          <TouchableOpacity onPress={() => updateProduct(id)}>
            <Icon name={'edit'} color={Theme.COLORS.SUCCESS} size={25} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => deleteProduct(id)}>
            <Icon name={'trash'} color={Theme.COLORS.ERROR} size={25} />
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 80,
    alignItems: 'center',
    padding: 10,
    margin: 5,
    borderWidth: 1,
    borderColor: Theme.COLORS.SECONDARY,
    borderRadius: 5,
    backgroundColor: Theme.COLORS.PRIMARY,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  rightColumn: {
    flexDirection: 'row',
    width: '10%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  image: {
    height: 60,
    width: 60,
    marginRight: 10,
  },
  title: {
    fontFamily: Theme.FONT.FAMILY,
    color: Theme.COLORS.WHITE,
    fontSize: 30,
  },
  subTitle: {
    fontFamily: Theme.FONT.FAMILY,
    color: '#ccc',
    fontSize: 20,
  },
  leftColumn: {
    flexDirection: 'row',
    width: '40%',
  },
  textContainer: {
    justifyContent: 'center',
  },
  middleColumn: {
    width: '20%',
    alignSelf: 'center',
  },
});

export default ProductItem;

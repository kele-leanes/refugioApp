import React from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Theme} from '../constants';

const FilterCarousel = ({data, filterProducts}) => {
  const FilterItem = ({item}) => {
    return (
      <TouchableOpacity onPress={() => filterProducts(item.id)}>
        <View style={styles.item}>
          <Text style={styles.text}>{item.type_name}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={data}
      renderItem={FilterItem}
      keyExtractor={(item) => item.id.toString()}
      horizontal
      style={styles.flatlist}
    />
  );
};

const styles = StyleSheet.create({
  flatlist: {
    width: '100%',
    padding: 10,
  },
  item: {
    height: 50,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: Theme.COLORS.SECONDARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  text: {
    fontSize: 20,
    fontFamily: Theme.FONT.FAMILY,
    color: Theme.COLORS.WHITE,
  },
});

export default FilterCarousel;

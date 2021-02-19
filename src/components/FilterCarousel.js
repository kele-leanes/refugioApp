import React, {useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Theme} from '../constants';

const FilterCarousel = ({data, filterProducts}) => {
  const [selectedId, setSelectedId] = useState(null);

  const _onPress = (id) => {
    filterProducts(id);
    setSelectedId(id);
  };

  const FilterItem = ({item}) => {
    const backgroundColor =
      item.id === selectedId ? Theme.COLORS.PRIMARY : Theme.COLORS.SECONDARY;
    return (
      <TouchableOpacity onPress={() => _onPress(item.id)}>
        <View style={{...styles.item, backgroundColor}}>
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
      extraData={selectedId}
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

import React, { useLayoutEffect, useState, useCallback } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { LineChartComponent } from '../components/LineChartComponent';
import MonthPicker from 'react-native-month-year-picker';
import ScreenContainer from '../components/ScreenContainer';
import { fetchOrders } from '../services/sqliteToCsv';
import { Theme } from '../constants';

const Summary = ({ navigation }) => {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [total, setTotal] = useState(null);

  const showPicker = useCallback((value) => setShow(value), []);
  const onValueChange = useCallback(
    (event, newDate) => {
      const selectedDate = newDate || date;

      showPicker(false);
      setDate(selectedDate);
    },
    [date, showPicker],
  );
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.btnWrapper}>
          <TouchableOpacity
            style={styles.headerBtn}
            onPress={() => showPicker(true)}>
            <Icon name={'calendar'} color={Theme.COLORS.WHITE} size={30} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerBtn}
            onPress={() => fetchOrders(date)}>
            <Icon name={'download'} color={Theme.COLORS.WHITE} size={30} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [date, navigation, showPicker]);

  return (
    <ScreenContainer>
      {show && <MonthPicker onChange={onValueChange} value={date} />}
      <LineChartComponent date={date} setTotal={setTotal} />
      <Text style={styles.total}>Total: ${total}</Text>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  btnWrapper: {
    flexDirection: 'row',
  },
  headerBtn: {
    marginLeft: 100,
  },
  total: {
    fontFamily: Theme.FONT.FAMILY,
    color: Theme.COLORS.WHITE,
    fontSize: 30,
    paddingVertical: 20,
  },
});

export default Summary;

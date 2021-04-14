import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import { Theme } from '../../constants';
import Icon from 'react-native-vector-icons/Feather';
import { usePrinter } from '../../context/Printer/PrinterState';
import { setPrinter } from '../../context/Printer/PrinterActions';
import { BluetoothManager } from 'react-native-bluetooth-escpos-printer';

export const PrinterSelectorModal = ({ isVisible, onClose }) => {
  const [printerState, printerDispatch] = usePrinter();
  const [devices, setDevices] = useState({ loading: true });
  const { printer } = printerState;
  useEffect(() => {
    BluetoothManager.scanDevices().then(
      (rsp) => {
        let parsedDevices = JSON.parse(rsp);
        setDevices({
          paired: parsedDevices.paired || [],
          found: parsedDevices.found || [],
          loading: false,
        });
      },
      (error) => {
        setDevices({ loading: false });
        ToastAndroid.show(error.message, ToastAndroid.SHORT);
      },
    );
  }, []);

  const handleOnPress = (addrss) => {
    BluetoothManager.connect(addrss).then(
      (s) => {
        setPrinter(printerDispatch, s);
        onClose();
      },
      (e) => {
        ToastAndroid.show(e.message, ToastAndroid.SHORT);
      },
    );
  };
  const RenderItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => handleOnPress(item.address)}>
        <View style={styles.itemContainer}>
          <Text style={styles.itemText}>{item.name}</Text>
          {item.name === printer ? (
            <Icon name={'check'} color={Theme.COLORS.SUCCESS} size={20} />
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <Modal visible={isVisible} transparent={true}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => onClose()} style={styles.closeButton}>
          <Icon name={'x'} color={Theme.COLORS.WHITE} size={20} />
        </TouchableOpacity>
        {devices.loading ? (
          <ActivityIndicator size={15} color={Theme.COLORS.WHITE} />
        ) : (
          <FlatList
            data={devices.paired}
            keyExtractor={(item) => item.address}
            renderItem={RenderItem}
          />
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.COLORS.PRIMARY,
    top: 85,
    left: 5,
    width: 200,
    padding: 20,
    paddingTop: 40,
    borderRadius: 20,
  },
  closeButton: {
    top: 5,
    right: 10,
    position: 'absolute',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 40,
  },
  itemText: {
    color: Theme.COLORS.WHITE,
  },
});

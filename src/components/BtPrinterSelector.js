import React, {useEffect, useState} from 'react';
import {View, TouchableOpacity, Text, Modal} from 'react-native';
import {BLEPrinter} from 'react-native-thermal-receipt-printer';

const BtPrinterSelector = () => {
  const [printers, setPrinters] = useState([]);
  const [currentPrinter, setCurrentPrinter] = useState();

  useEffect(() => {
    BLEPrinter.init().then(() => {
      BLEPrinter.getDeviceList()
        .then(setPrinters)
        .catch((error) => console.log(error));
    });
  }, []);

  const _connectPrinter = (printer) => {
    //connect printer
    BLEPrinter.connectPrinter(printer.inner_mac_address).then(
      setCurrentPrinter,
      (error) => console.warn(error),
    );
  };

  const printTextTest = () => {
    currentPrinter && BLEPrinter.printText('<C>sample text</C>\n');
  };

  const printBillTest = () => {
    currentPrinter && BLEPrinter.printBill('<B>MESA: </B><B>2</B>\n');
  };

  return (
    <View>
      {printers.map((printer) => (
        <TouchableOpacity
          key={printer.inner_mac_address}
          onPress={() => _connectPrinter(printer)}>
          <Text>
            {`device_name: ${printer.device_name}, inner_mac_address: ${printer.inner_mac_address}`}
          </Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity onPress={printTextTest}>
        <Text>Print Text</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={printBillTest}>
        <Text>Print Bill Text</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BtPrinterSelector;

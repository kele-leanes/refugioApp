import {BluetoothEscposPrinter} from 'react-native-bluetooth-escpos-printer';
import moment from 'moment';

export async function printCommand(items, data) {
  await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT);
  await BluetoothEscposPrinter.setBlob(0);
  await BluetoothEscposPrinter.printText(`MESA ${data.table_name}\n\r`, {
    encoding: 'GBK',
    codepage: 0,
    widthtimes: 3,
    heigthtimes: 2,
    fonttype: 1,
  });
  await BluetoothEscposPrinter.printText(
    `MOZO：${data.waiter_name.toUpperCase()}\n\r`,
    {
      encoding: 'GBK',
      codepage: 0,
      widthtimes: 1,
      heigthtimes: 1,
      fonttype: 1,
    },
  );
  await BluetoothEscposPrinter.printText(
    `${moment().format('HH:mm:ss')}\n\r`,
    {},
  );
  await BluetoothEscposPrinter.printText(
    '--------------------------------\n\r',
    {},
  );
  let columnWidths = [4, 15, 12];
  items.map(
    async (item) =>
      await BluetoothEscposPrinter.printColumn(
        columnWidths,
        [
          BluetoothEscposPrinter.ALIGN.LEFT,
          BluetoothEscposPrinter.ALIGN.LEFT,
          BluetoothEscposPrinter.ALIGN.RIGHT,
        ],
        [
          `${item.product_qty}`,
          item.product_name.toUpperCase(),
          `${item.comment ? item.comment.toUpperCase() : ''}`,
        ],
        {},
      ),
  );
  await BluetoothEscposPrinter.printText(' \n\r', {});
  await BluetoothEscposPrinter.printText(' \n\r', {});
}

import {BluetoothEscposPrinter} from 'react-native-bluetooth-escpos-printer';
import moment from 'moment';
import {padStart} from 'lodash';

export async function printInvoice(items, data, orderToPrintTotal) {
  await BluetoothEscposPrinter.printerAlign(
    BluetoothEscposPrinter.ALIGN.CENTER,
  );
  await BluetoothEscposPrinter.setBlob(0);
  await BluetoothEscposPrinter.printText('EL REFUGIO\n\r', {
    encoding: 'GBK',
    codepage: 0,
    widthtimes: 2,
    heigthtimes: 2,
    fonttype: 1,
  });
  await BluetoothEscposPrinter.printText(' \n\r', {});
  await BluetoothEscposPrinter.setBlob(0);
  await BluetoothEscposPrinter.printText('BAR SERRANO\n\r', {});
  await BluetoothEscposPrinter.printText(' \n\r', {});
  await BluetoothEscposPrinter.printText('VALLE DEL PICAPEDRERO\n\r', {});
  await BluetoothEscposPrinter.printText(' \n\r', {});
  await BluetoothEscposPrinter.printText('249 - 4209020\n\r', {});
  await BluetoothEscposPrinter.printText(' \n\r', {});
  await BluetoothEscposPrinter.printText(
    `${moment().format('DD/MM/YYYY HH:mm:ss')}\n\r`,
    {},
  );
  await BluetoothEscposPrinter.printColumn(
    [16, 16],
    [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
    [`#：000-${padStart(data.order_id, 4, 0)}`, `MESA #：${data.table_name}`],
    {},
  );
  await BluetoothEscposPrinter.printText(
    '--------------------------------\n\r',
    {},
  );
  let columnWidths = [6, 15, 6, 6];
  await BluetoothEscposPrinter.printColumn(
    columnWidths,
    [
      BluetoothEscposPrinter.ALIGN.LEFT,
      BluetoothEscposPrinter.ALIGN.LEFT,
      BluetoothEscposPrinter.ALIGN.RIGHT,
      BluetoothEscposPrinter.ALIGN.RIGHT,
    ],
    ['CANT', 'DETALLE', 'UNIT', 'TOTAL'],
    {},
  );
  items.map(
    async (item) =>
      await BluetoothEscposPrinter.printColumn(
        columnWidths,
        [
          BluetoothEscposPrinter.ALIGN.LEFT,
          BluetoothEscposPrinter.ALIGN.LEFT,
          BluetoothEscposPrinter.ALIGN.RIGHT,
          BluetoothEscposPrinter.ALIGN.RIGHT,
        ],
        [
          `${item.product_qty}`,
          item.product_name.toUpperCase(),
          `${item.product_price}`,
          `${item.product_qty * item.product_price}`,
        ],
        {},
      ),
  );
  await BluetoothEscposPrinter.printText(
    '--------------------------------\n\r',
    {},
  );
  await BluetoothEscposPrinter.printColumn(
    [16, 16],
    [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
    ['TOTAL: ', `$ ${orderToPrintTotal}`],
    {},
  );
  await BluetoothEscposPrinter.printText(' \n\r', {});
  await BluetoothEscposPrinter.printText(' \n\r', {});
  await BluetoothEscposPrinter.printText('Gracias por visitarnos!\n\r', {});
  await BluetoothEscposPrinter.printText(' \n\r', {});
  await BluetoothEscposPrinter.printQRCode(
    'https://www.elrefugiodetandil.com.ar',
    300,
    1,
  );
  await BluetoothEscposPrinter.printText(' \n\r', {});
  await BluetoothEscposPrinter.printText(
    '*TICKET NO VALIDO COMO FACTURA*\n\r',
    {},
  );
  await BluetoothEscposPrinter.printText(' \n\r', {});
  await BluetoothEscposPrinter.printText(' \n\r', {});
  await BluetoothEscposPrinter.printText(' \n\r', {});
}

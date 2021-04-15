import moment from 'moment';
import { ToastAndroid, PermissionsAndroid } from 'react-native';
import RNFetchBlob from 'react-native-fetch-blob';
import { db } from './dbService';

export const fetchOrders = (date) => {
  const formatedDate = moment(date).format('MM-YYYY');
  // RNFetchBlob.fs
  //   .readFile(
  //     RNFetchBlob.fs.dirs.MainBundleDir + '/databases/SQLite.db',
  //     'base64',
  //   )
  //   .then((value) =>
  //     RNFetchBlob.fs.writeFile(
  //       RNFetchBlob.fs.dirs.DownloadDir + '/copy_db.db',
  //       value,
  //       'base64',
  //     ),
  //   );
  db.transaction((tx) => {
    tx.executeSql(
      'SELECT SUM(order_total) AS total, strftime("%d-%m", datetime(order_date/1000, \'unixepoch\')) as day FROM orders WHERE strftime("%m-%Y", datetime(order_date/1000, \'unixepoch\')) = ? group by day',
      [formatedDate],
      (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push(results.rows.item(i));
        }
        requestStoragePermission().then(() => createFile(temp));
      },
      (error) => console.log(error),
    );
  });
};

const requestStoragePermission = async () => {
  try {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    ]);
  } catch (err) {
    ToastAndroid.show(
      'Habilitar Permisos',
      ToastAndroid.BOTTOM,
      ToastAndroid.SHORT,
    );
  }
};

const createFile = (values) => {
  const headerString = `${values.map((value) => `${value.day}`)}\n`;
  const rowString = values.map((value) => `${value.total}`);
  const csvString = `${headerString}${rowString}`;

  const pathToWrite = `${
    RNFetchBlob.fs.dirs.DownloadDir
  }/resumen${Date.now()}.csv`;
  RNFetchBlob.fs
    .writeFile(pathToWrite, csvString, 'utf8')
    .then(() => {
      ToastAndroid.show(
        `Archivo guardado ${pathToWrite}`,
        ToastAndroid.BOTTOM,
        ToastAndroid.SHORT,
      );
    })
    .catch((error) => {
      ToastAndroid.show(
        'Algo salió mal. Intente nuevamente',
        ToastAndroid.BOTTOM,
        ToastAndroid.SHORT,
      );
    });
};

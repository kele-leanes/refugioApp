import SQLite from 'react-native-sqlite-storage';

export const db = SQLite.openDatabase({
  name: 'SQLite.db',
  location: 'default',
  createFromLocation: '~SQLite.db',
});

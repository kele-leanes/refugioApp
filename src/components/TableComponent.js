import React, {useState, useCallback} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {StyleSheet} from 'react-native';
import {Table, Row, Rows, Col, Cols, Cell} from 'react-native-table-component';
import {Theme} from '../constants';
import {db} from '../services/dbService';

const TableComponent = () => {
  const [tableHead, setTableHead] = useState([
    'Mes',
    'Cantidad de Ordenes',
    'Total',
  ]);
  const [tableData, setTableData] = useState();

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, []),
  );

  const fetchOrders = () => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT SUM(order_total) AS total, COUNT(id), strftime("%m-%Y", datetime(order_date/1000, 'unixepoch')) as month_year FROM orders group by month_year`,
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push(Object.values(results.rows.item(i)));
          }
          setTableData(temp);
        },
        (error) => console.log(error),
      );
    });
  };

  return (
    <Table borderStyle={{borderWidth: 1, borderColor: Theme.COLORS.PRIMARY}}>
      <Row data={tableHead} style={styles.head} textStyle={styles.text} />
      <Rows data={tableData} style={styles.head} textStyle={styles.text} />
    </Table>
  );
};

const styles = StyleSheet.create({
  head: {height: 40, backgroundColor: '#f1f8ff', width: '100%'},
  text: {margin: 6},
});

export default TableComponent;

import React, {useState, useCallback} from 'react';
import {LineChart} from 'react-native-chart-kit';
import {Dimensions, StyleSheet, View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {Theme} from '../constants';
import {db} from '../services/dbService';

function LineChartComponent() {
  const [chartData, setChartData] = useState({
    labels: [''],
    datasets: [
      {
        data: [0],
      },
    ],
    legend: ['Facturación por mes'], // optional
  });
  const screenWidth = Dimensions.get('window').width;

  const fetchOrders = () => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT SUM(order_total) AS total, strftime("%d-%m", datetime(order_date/1000, 'unixepoch')) as day FROM orders group by day`,
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push(results.rows.item(i));
          }
          console.log(temp);
          setChartData({
            ...chartData,
            labels: temp.map((elem) => elem.day),
            datasets: [
              {
                data: temp.map((elem) => elem.total),
              },
            ],
          });
        },
        (error) => console.log(error),
      );
    });
  };

  const chartConfig = {
    backgroundGradientFromOpacity: 0,
    backgroundGradientToOpacity: 0,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    barPercentage: 0.5,
    decimalPlaces: 0,
  };

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, []),
  );

  return (
    <View style={styles.card}>
      <LineChart
        data={chartData}
        width={screenWidth - 50}
        yAxisLabel="$"
        height={220}
        chartConfig={chartConfig}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 10,
    margin: 5,
    borderWidth: 1,
    borderColor: Theme.COLORS.SECONDARY,
    borderRadius: 15,
    backgroundColor: Theme.COLORS.PRIMARY,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default LineChartComponent;

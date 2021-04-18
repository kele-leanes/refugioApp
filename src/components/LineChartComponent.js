import React, { useState, useCallback } from 'react';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions, StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Theme } from '../constants';
import { db } from '../services/dbService';
import moment from 'moment';

export const LineChartComponent = ({ date, setTotal }) => {
  const [chartData, setChartData] = useState({
    labels: [''],
    datasets: [
      {
        data: [0],
      },
    ],
    legend: [moment(date).format('MMMM YYYY')],
  });

  const screenWidth = Dimensions.get('window').width;

  const fetchOrders = () => {
    const formatedDate = moment(date).format('MM-YYYY');
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT SUM(order_total) AS total, strftime("%d-%m", datetime(order_date/1000, \'unixepoch\')) as day FROM orders WHERE strftime("%m-%Y", datetime(order_date/1000, \'unixepoch\')) = ? AND table_id IS NULL group by day',
        [formatedDate],
        (tx, results) => {
          var temp = [];
          if (results.rows.length) {
            for (let i = 0; i < results.rows.length; ++i) {
              temp.push(results.rows.item(i));
            }
            setChartData({
              labels: temp.map((elem) => elem.day),
              datasets: [
                {
                  data: temp.map((elem) => elem.total),
                },
              ],
              legend: [moment(date).format('MMMM YYYY')],
            });
          } else {
            setChartData({
              labels: [''],
              datasets: [
                {
                  data: [0],
                },
              ],
              legend: [moment(date).format('MMMM YYYY')],
            });
          }
        },
      );
    });
  };

  const chartConfig = {
    backgroundGradientFromOpacity: 0,
    backgroundGradientToOpacity: 0,
    color: (opacity = 1) => `rgba(78, 204, 163, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    barPercentage: 0.5,
    decimalPlaces: 0,
  };

  useFocusEffect(
    useCallback(() => {
      fetchOrders(date);
    }, [date]),
  );

  return (
    <View style={styles.card}>
      <LineChart
        data={chartData}
        width={screenWidth - 50}
        yAxisLabel={'$'}
        height={300}
        chartConfig={chartConfig}
        segments={4}
        fromZero={true}
        onDataPointClick={({ value }) => setTotal(value)}
      />
    </View>
  );
};

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
    alignItems: 'center',
    justifyContent: 'center',
  },
});

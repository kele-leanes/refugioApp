import React, {useState, useCallback} from 'react';
import {LineChart} from 'react-native-chart-kit';
import {Dimensions} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
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
        `SELECT SUM(order_total) AS total, strftime("%m-%Y", datetime(order_date/1000, 'unixepoch')) as month FROM orders group by month`,
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push(results.rows.item(i));
          }
          console.log(temp);
          setChartData({
            ...chartData,
            labels: temp.map((elem) => elem.month),
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
    backgroundGradientFrom: '#1E2923',
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: '#08130D',
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    decimalPlaces: 0,
    useShadowColorFromDataset: false, // optional
  };

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, []),
  );

  return (
    <LineChart
      data={chartData}
      width={screenWidth}
      yAxisLabel="$"
      height={220}
      chartConfig={chartConfig}
    />
  );
}

export default LineChartComponent;

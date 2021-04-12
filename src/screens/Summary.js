import React from 'react';
import LineChartComponent from '../components/LineChartComponent';
import ScreenContainer from '../components/ScreenContainer';
import TableComponent from '../components/TableComponent';

const Summary = () => {
  return (
    <ScreenContainer>
      {/* <TableComponent /> */}
      <LineChartComponent />
    </ScreenContainer>
  );
};

export default Summary;

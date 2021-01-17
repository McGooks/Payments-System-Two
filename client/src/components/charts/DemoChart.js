import React from 'react'
import { Chart } from 'react-charts'
import Card from "@material-ui/core/Card";
 
const PaymentTrend = () => {
  const data = React.useMemo(
    () => [
      {
        label: 'Series 1',
        data: [[0, 1], [1, 2], [2, 4], [3, 2], [4, 7]]
      },
      {
        label: 'Series 2',
        data: [[0, 3], [1, 1], [2, 5], [3, 6], [4, 4]]
      }
    ],
    []
  )
 
  const axes = React.useMemo(
    () => [
      { primary: true, type: 'linear', position: 'bottom' },
      { type: 'linear', position: 'left' }
    ],
    []
  )
 

    // A react-chart hyper-responsively and continuously fills the available
    // space of its parent element automatically
    return (
        <Card>
    <div
        style={{
          width: 450,
          height: 300,
          margin: 15,
          padding: 1,
        }}
    >
        
      <Chart data={data} series={{type: "bar"}} axes={axes} />
      
    </div>
    </Card>
  )
}
export default PaymentTrend
// import {
//   BarChart as RechartsBarChart,
//   Bar,
//   CartesianGrid,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend,
//   Cell,
//   ResponsiveContainer,
// } from "recharts";
// import PropTypes from "prop-types";

// // Helper function to aggregate the total weight by type
// const aggregateData = (data) => {
//   const aggregated = data.reduce((acc, animal) => {
//     const { type, weight, pricePerKg } = animal;
//     if (!acc[type]) {
//       acc[type] = { totalWeight: 0, pricePerKg };
//     }
//     acc[type].totalWeight += weight;
//     return acc;
//   }, {});

//   // Convert aggregated data into array format for chart rendering
//   return Object.keys(aggregated).map((type) => ({
//     type,
//     TotalWeight: aggregated[type].totalWeight,
//     pricePerKg: aggregated[type].pricePerKg,
//   }));
// };

// const BarChartComponent = ({ data }) => {
//   // Aggregate data
//   const aggregatedData = aggregateData(data);
//   console.log(data);
//   return (
//     <div className="overflow-x-auto">
//       <div style={{ minWidth: "600px" }}>
//         <ResponsiveContainer width="100%" height={400}>
//           <RechartsBarChart data={aggregatedData}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="type" />
//             <YAxis
//               tickFormatter={(value) => `${value} kg`} // Format Y-axis ticks to append "kg"
//             />
//             <Tooltip />
//             <Legend />
//             {/* 3 Bars with different colors */}
//             <Bar dataKey="TotalWeight" fill="#82ca9d">
//               {aggregatedData.map((entry, index) => (
//                 <Cell
//                   key={`cell-${index}`}
//                   fill={
//                     index === 0
//                       ? "#82ca9d"
//                       : index === 1
//                       ? "#8884d8"
//                       : "#ff7300"
//                   }
//                 />
//               ))}
//             </Bar>
//           </RechartsBarChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };

// BarChartComponent.propTypes = {
//   data: PropTypes.array.isRequired,
// };

// export default BarChartComponent;

import {
  BarChart as RechartsBarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
} from "recharts";
import PropTypes from "prop-types";

// Helper function to aggregate the total weight and overall price by type
const aggregateData = (data) => {
  const aggregated = data.reduce((acc, animal) => {
    const { type, weight, pricePerKg } = animal;
    if (!acc[type]) {
      acc[type] = { totalWeight: 0, overallPrice: 0 }; // Initialize overallPrice
    }
    acc[type].totalWeight += weight;
    acc[type].overallPrice += weight * pricePerKg; // Calculate overallPrice
    return acc;
  }, {});

  // Convert aggregated data into array format for chart rendering
  return Object.keys(aggregated).map((type) => ({
    type,
    TotalWeight: aggregated[type].totalWeight,
    OverallPrice: aggregated[type].overallPrice, // Include overallPrice
  }));
};

const BarChartComponent = ({ data }) => {
  // Aggregate data
  const aggregatedData = aggregateData(data);

  // Custom Tooltip Formatter
  const tooltipFormatter = (value, name) => {
    if (name === "OverallPrice" || name === "Total") {
      return `₱${value.toLocaleString()}`; // Add peso sign and format
    } else if (name === "TotalWeight") {
      return `${value} kg`; // Append "kg" for weight
    }
    return value; // Return raw value for other fields (like weight)
  };

  return (
    <div className="overflow-x-auto">
      <div style={{ minWidth: "600px" }}>
        <ResponsiveContainer width="100%" height={400}>
          <RechartsBarChart data={aggregatedData}>
            <CartesianGrid strokeDasharray=" 3" />
            <XAxis dataKey="type" />
            <YAxis />
            <Tooltip formatter={tooltipFormatter} />
            <Legend />
            {/* Bar for Total Weight */}
            <Bar dataKey="TotalWeight" fill="#82ca9d">
              {aggregatedData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    index === 0
                      ? "#82ca9d"
                      : index === 1
                      ? "#8884d8"
                      : "#ff7300"
                  }
                />
              ))}
            </Bar>
            {/* Bar for Overall Price */}
            <Bar dataKey="OverallPrice" fill="#ff7300">
              {aggregatedData.map((entry, index) => (
                <Cell
                  key={`cell-price-${index}`}
                  fill={
                    index === 0
                      ? "#ff7300"
                      : index === 1
                      ? "#8884d8"
                      : "#82ca9d"
                  }
                />
              ))}
            </Bar>
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

BarChartComponent.propTypes = {
  data: PropTypes.array.isRequired,
};

export default BarChartComponent;

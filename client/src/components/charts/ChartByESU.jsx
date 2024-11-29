import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import PropTypes from "prop-types";

// Truncate campus names if needed
const truncateCampusNames = (name, length) => {
  return name.length > length ? `${name.slice(0, length)}...` : name;
};

const DocumentsChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={data}
        margin={{
          top: 20,
          bottom: 60, // Increased bottom margin for long campus names
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="campus"
          tick={{ angle: -45, textAnchor: "end", fontSize: 14 }} // Rotated labels at 45 degrees
          interval={0} // Ensures every campus name appears
          tickFormatter={(name) => truncateCampusNames(name, 20)} // Adjust truncation length if needed
        />
        <YAxis />
        <Tooltip />
        <Bar dataKey="documents" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

DocumentsChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default DocumentsChart;

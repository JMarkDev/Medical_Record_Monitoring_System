import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import PropTypes from "prop-types";

export default function App({ data }) {
  // Safely transform data for the chart
  const transformedData = Array.isArray(data)
    ? data.map((item) => ({
        date: new Date(item.createdAt).toLocaleDateString(), // Convert createdAt to readable date
        status: item.status || "Unknown Status", // Fallback if missing
        gender: item.gender || "Unknown Gender", // Fallback if missing
        id: item.id, // Optional for reference
      }))
    : [];

  // Aggregating data for the chart
  const chartData = transformedData.reduce((acc, item) => {
    const existing = acc.find((entry) => entry.date === item.date);
    if (existing) {
      existing.totalPatients += 1;
      existing[item.status] = (existing[item.status] || 0) + 1;
      existing[item.gender] = (existing[item.gender] || 0) + 1;
    } else {
      acc.push({
        date: item.date,
        totalPatients: 1,
        [item.status]: 1,
        [item.gender]: 1,
      });
    }
    return acc;
  }, []);

  return (
    <div className="overflow-x-auto shadow-xl">
      <div style={{ minWidth: "800px" }}>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart width={800} height={400} data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" padding={{ left: 30, right: 30 }} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="totalPatients"
              stroke="#8884d8"
              name="Total Patients"
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="Discharged"
              stroke="#82ca9d"
              name="Discharged"
            />
            <Line
              type="monotone"
              dataKey="Male"
              stroke="#ff7300"
              name="Male Patients"
            />
            <Line
              type="monotone"
              dataKey="Female"
              stroke="#8884d8"
              name="Female Patients"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

App.propTypes = {
  data: PropTypes.array.isRequired,
};

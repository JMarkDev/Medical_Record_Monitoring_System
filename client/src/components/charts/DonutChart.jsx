import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import PropTypes from "prop-types";

const DonutChart = ({ data }) => {
  // Process the data to calculate the gender distribution
  const processedData = data.reduce(
    (acc, curr) => {
      if (curr.gender === "Male") {
        acc[0].value += 1;
      } else if (curr.gender === "Female") {
        acc[1].value += 1;
      }
      return acc;
    },
    [
      { name: "Male", value: 0 },
      { name: "Female", value: 0 },
    ]
  );

  const COLORS = ["#0088FE", "#FF69B4"]; // Colors for Male and Female

  return (
    <div className="overflow-x-auto">
      <div style={{ minWidth: "300px" }}>
        <ResponsiveContainer width="100%" height={360}>
          <PieChart>
            <Pie
              data={processedData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              innerRadius={80}
              label={({ name, value }) => `${name}: ${value}`}
            >
              {processedData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div
                      style={{
                        backgroundColor: "#fff",
                        border: "1px solid #ccc",
                        padding: "5px",
                        borderRadius: "5px",
                        fontSize: "14px",
                      }}
                    >
                      <p>
                        {payload[0].name}: {payload[0].value}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Legend Section */}
        <div className="mt-5 flex justify-center gap-4 flex-wrap">
          {processedData.map((entry, index) => (
            <div key={`legend-${index}`} className="flex items-center gap-2">
              <div
                style={{
                  width: "15px",
                  height: "15px",
                  backgroundColor: COLORS[index % COLORS.length],
                  borderRadius: "50%",
                }}
              ></div>
              <span className="text-sm font-medium">{entry.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

DonutChart.propTypes = {
  data: PropTypes.array.isRequired,
};

export default DonutChart;

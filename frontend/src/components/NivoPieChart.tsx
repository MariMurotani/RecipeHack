import React from "react";
import { ResponsivePie } from "@nivo/pie";
import { hexToHsl }from "../api/color_utils";

export interface FlavorCompoundDataType {
  flavorName: string;
  ratio: number;
  color: string;
}

interface NivoPieChartProps {
  data: FlavorCompoundDataType[];
}

const NivoPieChart: React.FC<NivoPieChartProps> = ({ data }) => {
  // Convert data for Nivo's format inside the component
  const transformedData = data.map((d) => ({
    id: d.flavorName,
    value: d.ratio.toFixed(2),
    color: hexToHsl(d.color),
  }));

  return (
    <div style={{ width: "100%", height: "400px" }}>
      <ResponsivePie
        data={transformedData}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={0}
        padAngle={0.7}
        cornerRadius={3}
        activeOuterRadiusOffset={8}
        borderWidth={1}
        borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}
        colors={{ datum: "data.color" }}
      />
    </div>
  );
};

export default NivoPieChart;

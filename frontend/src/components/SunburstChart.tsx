import React, { useState } from "react";
import { ResponsiveSunburst, MouseHandler } from "@nivo/sunburst";
import Popper from "@mui/material/Popper";
import Typography from "@mui/material/Typography";

export interface SunburstData {
    id: string | number;
    value: number;
    children?: SunburstData[];
}

export interface SunburstProps {
  data: SunburstData[];
  width: number;
  height?: number;
}

const SunburstChart = ({ data, width, height = 500 }: SunburstProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  return (
    <div style={{ height }}>
        <ResponsiveSunburst
            data={data}
            margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
            id="name"
            value="loc"
            cornerRadius={2}
            borderColor={{ theme: 'background' }}
            colors={{ scheme: 'nivo' }}
            childColor={{
                from: 'color',
                modifiers: [
                    [
                        'brighter',
                        0.1
                    ]
                ]
            }}
            enableArcLabels={true}
            arcLabelsSkipAngle={10}
            arcLabelsTextColor={{
                from: 'color',
                modifiers: [
                    [
                        'darker',
                        1.4
                    ]
                ]
            }}
         />
    </div>
  );
};

export default SunburstChart;

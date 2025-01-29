import React from "react";
import { ResponsiveSunburst } from "@nivo/sunburst";

export interface SunburstData {
    id: string | number;
    color?: string;
    value?: number;
    children?: SunburstData[] | null;
}

interface MyResponsiveSunburstProps {
    data: SunburstData;
}

const MySunburstChart: React.FC<MyResponsiveSunburstProps> = ({ data }) => (
    <div style={{ height: 500 }}>
        <ResponsiveSunburst
            data={data}
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            id="id"
            value="value"
            cornerRadius={2}
            borderWidth={2}
            borderColor="#ffffff"
            colors={{ scheme: 'nivo' }}
            childColor={{
                from: 'color',
                modifiers: [
                    [
                        'brighter',
                        0.3
                    ]
                ]
            }}
            enableArcLabels={true}
            arcLabelsRadiusOffset={0.25}
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

export default MySunburstChart;

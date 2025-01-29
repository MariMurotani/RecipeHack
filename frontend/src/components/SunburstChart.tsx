import React from "react";
import { ResponsiveSunburst, ComputedDatum } from "@nivo/sunburst";

export interface SunburstData {
    id: string | number;
    color?: string;
    value?: number;
    children?: SunburstData[] | null;
}

interface MyResponsiveSunburstProps {
    data: SunburstData;
}

const CustomTooltip = (datum: ComputedDatum<SunburstData>) => (
    <div
        style={{
            background: 'white',
            padding: '10px',
            borderRadius: '5px',
            boxShadow: '0px 0px 5px rgba(0,0,0,0.2)',
            border: `2px solid ${datum.color}`,
        }}
    >
        <strong>{datum.id}</strong> <br />
        Value: {datum.value}
    </div>
);

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
            tooltip={CustomTooltip}
        />
    </div>
);

export default MySunburstChart;

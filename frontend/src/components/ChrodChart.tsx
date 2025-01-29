import React from "react";
import { ResponsiveChord } from '@nivo/chord'

export interface ChordChartProps {
    data: number[][];
    keys: string[];
    arcTooltip?: React.FC<{ arc: any }>;
    ribbonTooltip?: React.FC<{ ribbon: any }>;
}

const MyChordChart:React.FC<ChordChartProps> = ({ data, keys, arcTooltip, ribbonTooltip }) => (
    <div style={{ height: "500px", width: "800px" }}>
        <ResponsiveChord
            data={data}
            keys={keys}
            margin={{ top: 60, right: 60, bottom: 90, left: 60 }}
            valueFormat=".2f"
            padAngle={0.02}
            innerRadiusRatio={0.96}
            innerRadiusOffset={0.02}
            inactiveArcOpacity={0.25}
            arcBorderColor={{
                from: "color",
                modifiers: [["darker", 0.6]],
            }}
            activeRibbonOpacity={0.75}
            inactiveRibbonOpacity={0.25}
            ribbonBorderColor={{
                from: "color",
                modifiers: [["darker", 0.6]],
            }}
            labelRotation={-90}
            labelTextColor={{
                from: "color",
                modifiers: [["darker", 1]],
            }}
            colors={{ scheme: "nivo" }}
            motionConfig="stiff"
            arcTooltip={arcTooltip}
            ribbonTooltip={ribbonTooltip}
            legends={[
                {
                    anchor: "bottom",
                    direction: "row",
                    justify: false,
                    translateX: 0,
                    translateY: 70,
                    itemWidth: 80,
                    itemHeight: 14,
                    itemsSpacing: 0,
                    itemTextColor: "#999",
                    itemDirection: "left-to-right",
                    symbolSize: 12,
                    symbolShape: "circle",
                    effects: [
                        {
                            on: "hover",
                            style: {
                                itemTextColor: "#000",
                            },
                        },
                    ],
                },
            ]}
        />
    </div>
)

export default MyChordChart;
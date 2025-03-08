import React, { useEffect, useState } from "react";
import { ResponsiveChord } from '@nivo/chord'
import { throttledPredictPairing, foodParingPredictedResult } from '../api/api';

export interface ChordChartData {
    data: number[][];
    keys: string[];
    names: string[];
}

export interface ChordChartProps extends ChordChartData {
    arcTooltip?: React.FC<{ arc: any }>;
    ribbonTooltip?: React.FC<{ ribbon: any }>;
}

const ArcTooltip = ({ arc }: { arc: any }) => (
    <div 
        style={{ 
            background: 'white',
            padding: '10px',
            borderRadius: '4px',
            boxShadow: '0px 0px 5px rgba(0,0,0,0.2)',
            border: `2px solid ${arc.color}`, 
        }}
    >
        <strong>{arc.id}</strong>: {arc.value}
    </div>
);

const RibbonTooltip = ({ ribbon, names }: { ribbon: any, names: string[] }) => {
    const [responseData, setResponseData] = useState<foodParingPredictedResult | null>(null);

    useEffect(() => {
        const fetchPrediction = async () => {
            try {
                const response: foodParingPredictedResult = await throttledPredictPairing(ribbon.source.id, ribbon.target.id);
                setResponseData(response);
            } catch (error) {
                console.error("Error fetching prediction:", error);
            }
        };

        fetchPrediction();
    }, [ribbon.source.id, ribbon.target.id]);

    const sourceLabel = names[ribbon.source.index] || ribbon.source.id;
    const targetLabel = names[ribbon.target.index] || ribbon.target.id;

    return (
        <div
            style={{
                background: "white",
                padding: "10px",
                borderRadius: "4px",
                boxShadow: "0px 0px 5px rgba(0,0,0,0.2)",
                border: `2px solid ${ribbon.source.color}`,
            }}
        >
            <div>
                <strong>{sourceLabel}</strong> → <strong>{targetLabel}</strong>
            </div>
            <div>
                {ribbon.source.value} sharing flavors
            </div>
            <div>
                {responseData
                    ? responseData.usual_paring
                        ? "Well-known pairing"
                        : "Potential new pairing"
                    : "Loading..."}
            </div>
        </div>
    );
};


const MyChordChart: React.FC<ChordChartProps> = ({ data, keys, names }) => {
    return (
        <div style={{ height: "500px", width: "800px" }}>
            <ResponsiveChord
                data={data}
                keys={keys}
                label={(datum) => names[keys.indexOf(datum.id)] || datum.id}
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
                arcTooltip={ArcTooltip}
                ribbonTooltip={(ribbon) => <RibbonTooltip ribbon={ribbon.ribbon} names={names} />}
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
    );
};


export default MyChordChart;

// サンプルデータの定義
export const sampleChordData = [
    [863, 520, 73, 1264, 1575],
    [150, 477, 155, 470, 42],
    [19, 426, 236, 491, 1783],
    [1794, 431, 179, 1212, 462],
    [42, 1189, 264, 455, 258]
];
export const sampleChordKeys = ["A", "B", "C", "D", "E"];

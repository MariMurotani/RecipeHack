import React from "react";
import { ResponsiveSunburst, ComputedDatum } from "@nivo/sunburst";

export interface SunburstData {
    id: string | number;
    color?: string;
    value?: number;
    children?: SunburstData[] | null;
    customLabel?: string; // カスタムラベル用追加要素
    customColor?: string; // カスタムカラー用追加要素
}

interface MyResponsiveSunburstProps {
    data: SunburstData;
}

const CustomTooltip = (datum: ComputedDatum<SunburstData>) => {
    console.log(datum);
    const ids = datum.id.toString().split("-");
    const label = ids[ids.length - 1];
    return (
        <div
            style={{
                background: 'white',
                padding: '10px',
                borderRadius: '5px',
                boxShadow: '0px 0px 5px rgba(0,0,0,0.2)',
                border: `2px solid ${datum.color}`,
            }}
        >
            <strong>{label}</strong> <br />
            TODO: 関連検索の表示をできると良い
        </div>
    );
};

const MySunburstChart: React.FC<MyResponsiveSunburstProps> = ({ data }) => (
    <div style={{ height: "500px", width: "800px" }}>
        <ResponsiveSunburst
            data={data}
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            id="id"
            value="value"
            cornerRadius={2}
            borderWidth={2}
            borderColor="#ffffff"
            enableArcLabels={true}
            arcLabel={(datum) => datum.data.customLabel || datum.id.toString()} // カスタムラベルの追加
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

// サンプルデータの定義
export const sampleSunburstData: SunburstData = {
"id": "nivo",
"color": "hsl(77, 70%, 50%)",
"children": [
    {
    "id": "viz",
    "color": "hsl(177, 70%, 50%)",
    "children": [
        {
        "id": "stack",
        "color": "hsl(120, 70%, 50%)",
        "children": [
            {
            "id": "cchart",
            "color": "hsl(227, 70%, 50%)",
            "value": 28971
            },
            {
            "id": "xAxis",
            "color": "hsl(283, 70%, 50%)",
            "value": 25280
            },
            {
            "id": "yAxis",
            "color": "hsl(17, 70%, 50%)",
            "value": 6725
            },
            {
            "id": "layers",
            "color": "hsl(199, 70%, 50%)",
            "value": 126438
            }
        ]
        },
        {
        "id": "ppie",
        "color": "hsl(272, 70%, 50%)",
        "children": [
            {
            "id": "chart",
            "color": "hsl(286, 70%, 50%)",
            "children": [
                {
                "id": "pie",
                "color": "hsl(320, 70%, 50%)",
                "children": [
                    {
                    "id": "outline",
                    "color": "hsl(310, 70%, 50%)",
                    "value": 149336
                    },
                    {
                    "id": "slices",
                    "color": "hsl(57, 70%, 50%)",
                    "value": 130293
                    },
                    {
                    "id": "bbox",
                    "color": "hsl(27, 70%, 50%)",
                    "value": 64017
                    }
                ]
                },
                {
                "id": "donut",
                "color": "hsl(97, 70%, 50%)",
                "value": 127215
                },
                {
                "id": "gauge",
                "color": "hsl(48, 70%, 50%)",
                "value": 50475
                }
            ]
            },
            {
            "id": "legends",
            "color": "hsl(48, 70%, 50%)",
            "value": 176680
            }
        ]
        }
    ]
    },
    {
    "id": "colors",
    "color": "hsl(348, 70%, 50%)",
    "children": [
        {
        "id": "rgb",
        "color": "hsl(241, 70%, 50%)",
        "value": 157700
        },
        {
        "id": "hsl",
        "color": "hsl(280, 70%, 50%)",
        "value": 77750
        }
    ]
    },
    {
    "id": "utils",
    "color": "hsl(333, 70%, 50%)",
    "children": [
        {
        "id": "randomize",
        "color": "hsl(221, 70%, 50%)",
        "value": 30375
        },
        {
        "id": "resetCvaluek",
        "color": "hsl(198, 70%, 50%)",
        "value": 102048
        },
        {
        "id": "noop",
        "color": "hsl(148, 70%, 50%)",
        "value": 32857
        },
        {
        "id": "tick",
        "color": "hsl(198, 70%, 50%)",
        "value": 160306
        },
        {
        "id": "forceGC",
        "color": "hsl(83, 70%, 50%)",
        "value": 32379
        },
        {
        "id": "stackTrace",
        "color": "hsl(152, 70%, 50%)",
        "value": 18597
        },
        {
        "id": "dbg",
        "color": "hsl(269, 70%, 50%)",
        "value": 121745
        }
    ]
    },
    {
    "id": "generators",
    "color": "hsl(92, 70%, 50%)",
    "children": [
        {
        "id": "address",
        "color": "hsl(212, 70%, 50%)",
        "value": 107803
        },
        {
        "id": "city",
        "color": "hsl(262, 70%, 50%)",
        "value": 188149
        },
        {
        "id": "animal",
        "color": "hsl(256, 70%, 50%)",
        "value": 84369
        },
        {
        "id": "movie",
        "color": "hsl(164, 70%, 50%)",
        "value": 163378
        },
        {
        "id": "user",
        "color": "hsl(189, 70%, 50%)",
        "value": 43838
        }
    ]
    },
    {
    "id": "set",
    "color": "hsl(308, 70%, 50%)",
    "children": [
        {
        "id": "clone",
        "color": "hsl(106, 70%, 50%)",
        "value": 152743
        },
        {
        "id": "intersect",
        "color": "hsl(291, 70%, 50%)",
        "value": 173451
        },
        {
        "id": "merge",
        "color": "hsl(174, 70%, 50%)",
        "value": 55686
        },
        {
        "id": "reverse",
        "color": "hsl(274, 70%, 50%)",
        "value": 17473
        },
        {
        "id": "toArray",
        "color": "hsl(188, 70%, 50%)",
        "value": 52337
        },
        {
        "id": "toObject",
        "color": "hsl(295, 70%, 50%)",
        "value": 199183
        },
        {
        "id": "fromCSV",
        "color": "hsl(45, 70%, 50%)",
        "value": 137164
        },
        {
        "id": "slice",
        "color": "hsl(39, 70%, 50%)",
        "value": 99719
        },
        {
        "id": "append",
        "color": "hsl(109, 70%, 50%)",
        "value": 92472
        },
        {
        "id": "prepend",
        "color": "hsl(106, 70%, 50%)",
        "value": 187225
        },
        {
        "id": "shuffle",
        "color": "hsl(124, 70%, 50%)",
        "value": 25792
        },
        {
        "id": "pick",
        "color": "hsl(86, 70%, 50%)",
        "value": 71446
        },
        {
        "id": "plouc",
        "color": "hsl(66, 70%, 50%)",
        "value": 60384
        }
    ]
    },
    {
    "id": "text",
    "color": "hsl(241, 70%, 50%)",
    "children": [
        {
        "id": "trim",
        "color": "hsl(269, 70%, 50%)",
        "value": 114314
        },
        {
        "id": "slugify",
        "color": "hsl(302, 70%, 50%)",
        "value": 175106
        },
        {
        "id": "snakeCase",
        "color": "hsl(278, 70%, 50%)",
        "value": 137744
        },
        {
        "id": "camelCase",
        "color": "hsl(250, 70%, 50%)",
        "value": 117944
        },
        {
        "id": "repeat",
        "color": "hsl(247, 70%, 50%)",
        "value": 120511
        },
        {
        "id": "padLeft",
        "color": "hsl(220, 70%, 50%)",
        "value": 57505
        },
        {
        "id": "padRight",
        "color": "hsl(271, 70%, 50%)",
        "value": 47409
        },
        {
        "id": "sanitize",
        "color": "hsl(226, 70%, 50%)",
        "value": 121149
        },
        {
        "id": "ploucify",
        "color": "hsl(170, 70%, 50%)",
        "value": 177185
        }
    ]
    },
    {
    "id": "misc",
    "color": "hsl(260, 70%, 50%)",
    "children": [
        {
        "id": "greetings",
        "color": "hsl(70, 70%, 50%)",
        "children": [
            {
            "id": "hey",
            "color": "hsl(291, 70%, 50%)",
            "value": 118615
            },
            {
            "id": "HOWDY",
            "color": "hsl(37, 70%, 50%)",
            "value": 193765
            },
            {
            "id": "aloha",
            "color": "hsl(68, 70%, 50%)",
            "value": 178771
            },
            {
            "id": "AHOY",
            "color": "hsl(98, 70%, 50%)",
            "value": 146734
            }
        ]
        },
        {
        "id": "other",
        "color": "hsl(14, 70%, 50%)",
        "value": 38750
        },
        {
        "id": "path",
        "color": "hsl(264, 70%, 50%)",
        "children": [
            {
            "id": "pathA",
            "color": "hsl(254, 70%, 50%)",
            "value": 120605
            },
            {
            "id": "pathB",
            "color": "hsl(68, 70%, 50%)",
            "children": [
                {
                "id": "pathB1",
                "color": "hsl(224, 70%, 50%)",
                "value": 73351
                },
                {
                "id": "pathB2",
                "color": "hsl(92, 70%, 50%)",
                "value": 65811
                },
                {
                "id": "pathB3",
                "color": "hsl(127, 70%, 50%)",
                "value": 35416
                },
                {
                "id": "pathB4",
                "color": "hsl(88, 70%, 50%)",
                "value": 119251
                }
            ]
            },
            {
            "id": "pathC",
            "color": "hsl(45, 70%, 50%)",
            "children": [
                {
                "id": "pathC1",
                "color": "hsl(303, 70%, 50%)",
                "value": 16246
                },
                {
                "id": "pathC2",
                "color": "hsl(72, 70%, 50%)",
                "value": 80736
                },
                {
                "id": "pathC3",
                "color": "hsl(222, 70%, 50%)",
                "value": 169994
                },
                {
                "id": "pathC4",
                "color": "hsl(191, 70%, 50%)",
                "value": 56900
                },
                {
                "id": "pathC5",
                "color": "hsl(40, 70%, 50%)",
                "value": 166372
                },
                {
                "id": "pathC6",
                "color": "hsl(282, 70%, 50%)",
                "value": 47228
                },
                {
                "id": "pathC7",
                "color": "hsl(2, 70%, 50%)",
                "value": 7696
                },
                {
                "id": "pathC8",
                "color": "hsl(245, 70%, 50%)",
                "value": 103874
                },
                {
                "id": "pathC9",
                "color": "hsl(233, 70%, 50%)",
                "value": 16924
                }
            ]
            }
        ]
        }
    ]
    }
]
};

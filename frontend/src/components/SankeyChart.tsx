import React from "react";
import { ResponsiveSankey, SankeyLinkDatum } from '@nivo/sankey'
import { AromaLink } from "../api/types";

export interface SankeyNode {
    id: string;
    nodeColor: string;
}
export interface SankeyLink {
    source: string;
    target: string;
    value: number;
}

export interface SankeyChartData {
    nodes: SankeyNode[]; // Nativeの必須項目
    links: SankeyLink[]; // Nativeの必須項目
}
export interface SankeyChartProps {
    data: SankeyChartData;
    linkAromaNotes: AromaLink[];
}

const MySankeyChart: React.FC<SankeyChartProps> = ({ data, linkAromaNotes }) => {
    // AromaLink のデータを取得
    const getAromaNotes = (source: string, target: string): string => {
      const link = linkAromaNotes.find(link => link.link_id === `${source}-${target}`);
      if (link) {
        return link?.aromaNotes ? Array.from(link.aromaNotes.entries())
          .map(([aroma, value]) => `${aroma}: ${value.toFixed(2)}`)
          .join(", ") : "No Aroma Data";
      }
      return "No Aroma Data";
    };
  
    // カスタムツールチップ（`linkTooltip` を使用）
    const CustomLinkTooltip = ({ link }: { link: SankeyLinkDatum<SankeyNode, SankeyLink> }) => {
      console.log(link);

      return (
        <div 
          style={{ 
              background: "white", 
              margin: "5px", 
              padding: "5px", 
              borderRadius: "5px", 
              boxShadow: "0px 0px 5px rgba(0,0,0,0.3)",
              border: `2px solid ${link.color}`,
              }}>
          <strong>{link.source.id} → {link.target.id}</strong>
          <br />
          Aroma: {getAromaNotes(link.source.id as string, link.target.id as string)}
        </div>
      )
    };
  
    return (
      <div style={{ height: "500px", width: "800px" }}>
        <ResponsiveSankey
          data={data}
          margin={{ top: 40, right: 160, bottom: 40, left: 50 }}
          align="justify"
          colors={{ scheme: "category10" }}
          nodeOpacity={1}
          nodeHoverOthersOpacity={0.35}
          nodeThickness={18}
          nodeSpacing={24}
          nodeBorderWidth={0}
          nodeBorderColor={{
            from: "color",
            modifiers: [["darker", 0.8]],
          }}
          nodeBorderRadius={3}
          linkOpacity={0.5}
          linkHoverOthersOpacity={0.1}
          linkContract={3}
          enableLinkGradient={true}
          labelPosition="outside"
          labelOrientation="vertical"
          labelPadding={16}
          labelTextColor={{
            from: "color",
            modifiers: [["darker", 1]],
          }}
          legends={[
            {
              anchor: "bottom-right",
              direction: "column",
              translateX: 130,
              itemWidth: 100,
              itemHeight: 14,
              itemDirection: "right-to-left",
              itemsSpacing: 2,
              itemTextColor: "#999",
              symbolSize: 14,
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
          linkTooltip={CustomLinkTooltip}
        />
      </div>
    );
  };
  
export default MySankeyChart;  

// サンプルデータの定義
export const sankeySampleData: SankeyChartData = {
    "nodes": [
      {
        "id": "John",
        "nodeColor": "hsl(259, 70%, 50%)"
      },
      {
        "id": "Raoul",
        "nodeColor": "hsl(291, 70%, 50%)"
      },
      {
        "id": "Jane",
        "nodeColor": "hsl(342, 70%, 50%)"
      },
      {
        "id": "Marcel",
        "nodeColor": "hsl(206, 70%, 50%)"
      },
      {
        "id": "Ibrahim",
        "nodeColor": "hsl(279, 70%, 50%)"
      },
      {
        "id": "Junko",
        "nodeColor": "hsl(306, 70%, 50%)"
      }
    ],
    "links": [
      {
        "source": "Raoul",
        "target": "Ibrahim",
        "value": 139
      },
      {
        "source": "Raoul",
        "target": "John",
        "value": 71
      },
      {
        "source": "Junko",
        "target": "Ibrahim",
        "value": 75
      },
      {
        "source": "Junko",
        "target": "Raoul",
        "value": 40
      },
      {
        "source": "John",
        "target": "Ibrahim",
        "value": 50
      },
      {
        "source": "John",
        "target": "Jane",
        "value": 45
      },
      {
        "source": "Ibrahim",
        "target": "Marcel",
        "value": 40
      },
      {
        "source": "Jane",
        "target": "Marcel",
        "value": 130
      },
      {
        "source": "Jane",
        "target": "Ibrahim",
        "value": 119
      }
    ]
  };
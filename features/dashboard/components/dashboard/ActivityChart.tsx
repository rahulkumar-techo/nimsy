/**
 * Weekly Activity Chart
 */

import { Dimensions, View } from "react-native";

import {
    BarChart,
} from "react-native-chart-kit";

const screenWidth =
    Dimensions.get("window").width;

const ActivityChart = () => {
    return (
        <View className="bg-white rounded-3xl p-5 mt-5 border border-gray-100">
            <BarChart
                data={{
                    labels: [
                        "Mon",
                        "Wed",
                        "Thu",
                        "Fri",
                        "Sat",
                        "Sun",
                    ],
                    datasets: [
                        {
                            data: [65, 45, 80, 35, 65, 40],
                        },
                    ],
                }}
                width={screenWidth - 70}
                height={220}

                yAxisLabel=""   // ✅ ADD THIS
                yAxisSuffix="m"

                withInnerLines
                fromZero
                showValuesOnTopOfBars

                chartConfig={{
                    backgroundGradientFrom: "#FFFFFF",
                    backgroundGradientTo: "#FFFFFF",
                    decimalPlaces: 0,

                    color: (opacity = 1) =>
                        `rgba(91,95,255,${opacity})`,

                    labelColor: () => "#777",

                    fillShadowGradient: "#5B5FFF",
                    fillShadowGradientOpacity: 1,

                    propsForBackgroundLines: {
                        stroke: "#EFEFEF",
                    },

                    barPercentage: 0.5,
                }}

                style={{
                    borderRadius: 20,
                }}
            />
        </View>
    );
};

export default ActivityChart;
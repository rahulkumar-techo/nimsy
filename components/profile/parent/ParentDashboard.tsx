/**
 * Parent Dashboard
 */


import {
    View,
} from "react-native";


import ParentControlsSection from "./ParentControlsSection";

const PARENT_CONTROLS = [
  {
    id: "screen-time",
    title: "Screen Time",
    subtitle: "Daily limit 1h 30m",
    status: "Active",
    icon: "time",
  },
  {
    id: "content-filters",
    title: "Content Filters",
    subtitle: "Safe content only",
    status: "Protected",
    icon: "shield-checkmark",
  },
  {
    id: "usage-reports",
    title: "Usage Reports",
    subtitle: "Weekly insights",
    status: "Updated",
    icon: "stats-chart",
  },
] as const;

const ParentDashboard = () => {
  return (
    <View className="px-5 pb-20">
      <ParentControlsSection />
    </View>
  );
};

export default ParentDashboard;

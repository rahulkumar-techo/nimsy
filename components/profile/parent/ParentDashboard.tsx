/**
 * Parent Dashboard
 */


import {
    View,
} from "react-native";


import ParentControlsSection from "./ParentControlsSection";

const ParentDashboard = () => {
  return (
    <View className="px-5 pb-20">
      <ParentControlsSection />
    </View>
  );
};

export default ParentDashboard;

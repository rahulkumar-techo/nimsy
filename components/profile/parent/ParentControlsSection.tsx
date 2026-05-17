/**
 * Parent Controls Section
 */

import React from "react";

import {
    ListRenderItem,
    View,
} from "react-native";

import SectionHeader from "../SectionHeader";
import ParentControlCard from "./ParentControlCard";

type Control = {
  id: string;
  title: string;
  subtitle: string;
  status: string;
  icon: string;
};

const PARENT_CONTROLS: Control[] = [
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
];

const renderParentControl: ListRenderItem<Control> = ({ item }) => (
  <ParentControlCard
    title={item.title}
    subtitle={item.subtitle}
    status={item.status}
    icon={item.icon}
  />
);

const ParentControlsSection = () => (
  <View>
    <SectionHeader
      title="Parent Controls"
      data={PARENT_CONTROLS}
      renderItem={renderParentControl}
      keyExtractor={(item) => item.id}
    />

    {PARENT_CONTROLS.map((control) => (
      <ParentControlCard
        key={control.id}
        title={control.title}
        subtitle={control.subtitle}
        status={control.status}
        icon={control.icon}
      />
    ))}
  </View>
);

export default React.memo(ParentControlsSection);

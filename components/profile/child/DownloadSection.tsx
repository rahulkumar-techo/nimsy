/**
 * Download Section
 */

import React from "react";

import {
    ListRenderItem,
    View,
} from "react-native";

import SectionHeader from "../SectionHeader";
import DownloadItem from "./DownloadItem";

type Download = {
  id: string;
  title: string;
  type: string;
  size?: string;
};

const DOWNLOADS: Download[] = [
  {
    id: "1",
    title: "Magic Forest",
    type: "Story",
    size: "45MB",
  },
];

const renderDownload: ListRenderItem<Download> = ({ item }) => (
  <DownloadItem
    title={item.title}
    type={item.type}
    size={item.size}
  />
);

const DownloadSection = () => (
  <View>
    <SectionHeader
      title="Downloads"
      data={DOWNLOADS}
      renderItem={renderDownload}
      keyExtractor={(item) => item.id}
    />

    {DOWNLOADS.map((item) => (
      <DownloadItem
        key={item.id}
        title={item.title}
        type={item.type}
        size={item.size}
      />
    ))}
  </View>
);

export default React.memo(DownloadSection);

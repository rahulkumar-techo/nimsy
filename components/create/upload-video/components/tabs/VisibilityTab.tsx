import React from "react";
import { Section }         from "../ui/Section";
import { SelectMock }      from "../ui/SelectMock";
import VisibilityCard      from "@/components/create/upload-video/VisibilityCard";
import { VISIBILITY_OPTIONS } from "../../constants";
import { VisibilityOption }   from "@/types/upload.types";

type Props = {
  visibility: VisibilityOption;
  onSelect: (v: VisibilityOption) => void;
  colors: any;
};

export const VisibilityTab = ({ visibility, onSelect, colors }: Props) => (
  <>
    <Section title="WHO CAN SEE YOUR VIDEO?" colors={colors}>
      {VISIBILITY_OPTIONS.map((opt) => (
        <VisibilityCard
          key={opt.value}
          {...opt}
          selected={visibility === opt.value}
          onPress={() => onSelect(opt.value)}
        />
      ))}
    </Section>

    {visibility === "scheduled" && (
      <Section title="PUBLISH DATE" colors={colors}>
        <SelectMock label="Choose date & time" colors={colors} />
      </Section>
    )}
  </>
);
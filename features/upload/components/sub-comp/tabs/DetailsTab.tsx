import ThumbnailPicker from "@/features/upload/components/ThumbnailPicker";
import VideoPreview from "@/features/upload/components/VideoPreview";
import { Controller } from "react-hook-form";
import { StyleSheet, Text, TextInput } from "react-native";
import { Field } from "../ui/Field";
import { Section } from "../ui/Section";
import { SelectMock } from "../ui/SelectMock";

type Props = {
  control: any;
  errors: any;
  inputStyle: any;
  thumbnail: string | null;
  onThumbnailChange: (uri: string) => void;
  video: { uri: string; name: string; size?: number } | null;
  onReplaceVideo: () => void;
  colors: any;
  showVideoPreview?: boolean;
  // Thumbnail now lives in its own upload step by default. Pass true if you
  // want it inline here too (e.g. for a single-page non-stepped layout).
  showThumbnail?: boolean;
};

export const DetailsTab = ({
  control, errors, inputStyle,
  thumbnail, onThumbnailChange,
  video, onReplaceVideo,
  colors, showVideoPreview = true,
  showThumbnail = true,
}: Props) => (
  <>
    {showVideoPreview && video && (
      <VideoPreview
        uri={video.uri}
        name={video.name}
        size={video.size}
        onReplace={onReplaceVideo}
      />
    )}

    <Section colors={colors}>
      <Field label="Title *" error={errors.title?.message} colors={colors}>
        <Controller
          control={control}
          name="title"
          render={({ field: { value, onChange } }) => (
            <>
              <TextInput
                value={value}
                onChangeText={onChange}
                placeholder="Add a title that describes your videos"
                placeholderTextColor={colors.mutedText}
                style={inputStyle}
                maxLength={100}
              />
              <Text style={[styles.charCount, { color: colors.mutedText }]}>
                {value.length}/100
              </Text>
            </>
          )}
        />
      </Field>

      <Field label="Description" hint="Help viewers find your video with a great description." colors={colors}>
        <Controller
          control={control}
          name="description"
          render={({ field: { value, onChange } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              placeholder="Tell viewers about your video…"
              placeholderTextColor={colors.mutedText}
              multiline
              textAlignVertical="top"
              style={[inputStyle, styles.textarea]}
            />
          )}
        />
      </Field>
    </Section>

    {showThumbnail && (
      <Section title="THUMBNAIL" colors={colors}>
        <ThumbnailPicker thumbnail={thumbnail} onChange={onThumbnailChange} />
      </Section>
    )}

    <Section title="TAGS & CATEGORY" colors={colors}>
      <Field label="Tags" hint="Separate tags with commas" colors={colors}>
        <Controller
          control={control}
          name="tags"
          render={({ field: { value, onChange } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              placeholder="vlog, tutorial, how-to…"
              placeholderTextColor={colors.mutedText}
              style={inputStyle}
            />
          )}
        />
      </Field>
      <Field label="Category" colors={colors}>
        <SelectMock label="Select a category" colors={colors} />
      </Field>
      <Field label="Language" colors={colors}>
        <SelectMock label="English" colors={colors} />
      </Field>
    </Section>
  </>
);

const styles = StyleSheet.create({
  textarea:  { height: 120, paddingTop: 12 },
  charCount: { fontSize: 11, textAlign: "right", marginTop: 4 },
});

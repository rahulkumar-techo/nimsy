import { ScrollView, Text, View } from "react-native";
// import CategoryCard from "../home-comp/CategoryCard";
import { useTheme } from "@/context/ThemeContext";

type Item = {
  id?: string;
  title: string;
  image: string;
  count?: number;
};

type Props = {
  items: Item[];
  onItemPress?: (item: Item) => void;
};

const ExploreTopCategories = ({ items, onItemPress }: Props) => {
  const { colors } = useTheme();

  return (
  <View className="mt-8 px-5">
    <View className="mb-4 flex-row items-center justify-between">
      <Text
        className="text-xl font-bold"
        style={{ color: colors.text }}
      >
        Top Categories
      </Text>
       {/* <SeeAll
          title="Top Categories"
          
          data={items}
          renderItem={({ item }) => (
            <CategoryCard
            horizontalSection
            key={item.id}
            {...item}
            onPress={() => handleCategory(item.title, item.id as any)}
          />
          )}
        /> */}
    </View>

    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {/* {items.slice(0,5).map((item) => (
         <CategoryCard
            
            key={item.id ?? item.title}
            {...item}
            onPress={() => handleCategory(item.title, item.id as any)}
          />
      ))} */}
    </ScrollView>
  </View>
  );
};

export default ExploreTopCategories;

import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import SeeAll from "../SeeAll";
import CategoryCard from "../home-comp/CategoryCard";
import { useRouter } from "expo-router";

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

const ExploreTopCategories = ({ items, onItemPress }: Props) =>{
    const router = useRouter();
  
   const handleCategory = (
    title: string,
    id: string
  ) => {
    router.push({
      pathname: "/category",
      params: {
        id,
        title,
      },
    });
  };
  return  (
  <View className="mt-8 px-5">
    <View className="mb-4 flex-row items-center justify-between">
      <Text className="text-xl font-bold text-black">Top Categories</Text>
       <SeeAll
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
        />
    </View>

    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {items.slice(0,5).map((item, index) => (
         <CategoryCard
            
            key={item.id+Date.now().toString()}
            {...item}
            onPress={() => handleCategory(item.title, item.id as any)}
          />
      ))}
    </ScrollView>
  </View>
)
}

export default ExploreTopCategories;

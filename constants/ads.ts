export interface Ad {
  id: string;
  brand: string;
  image: string;
  title: string;
  description: string;
  cta: string;
}

export const ads: Ad[] = Array.from({ length: 5 }).map((_, i) => ({
  id: `${i + 1}`,
  brand: `Brand ${i + 1}`,
  image: `https://picsum.photos/800/450?random=${i + 300}`,
  title: `Premium Product ${i + 1}`,
  description: "Reach more customers with powerful marketing tools.",
  cta: "Learn More",
}));
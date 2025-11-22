import CardCarousel from "./CardCarousel";

export default {
  title: "Carousel/CardCarousel",
};

export const Default = () => (
  <CardCarousel
    items={[
      "https://picsum.photos/id/1035/600/600",
      "https://picsum.photos/id/1043/600/600",
      "https://picsum.photos/id/1059/600/600",
      "https://picsum.photos/id/1060/600/600",
      "https://picsum.photos/id/1069/600/600",
      "https://picsum.photos/id/1074/600/600",
    ]}
  />
);

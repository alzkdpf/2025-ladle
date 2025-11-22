import CardCarousel from "./CardCarousel";

export default {
  title: "Carousel/CardCarousel",
};

export const Default = () => <CardCarousel />;

export const CustomImages = () => (
  <CardCarousel
    image1Url="https://picsum.photos/id/1040/600/600"
    image2Url="https://picsum.photos/id/1041/600/600"
    image3Url="https://picsum.photos/id/1042/600/600"
  />
);

import Swiper from "./Swiper";

export default {
  title: "Swiper",
};

export const Default = () => (
      <Swiper
        showIndicators={true}
        indicatorActiveColor="bg-blue-500"
        indicatorInactiveColor="bg-gray-300"
        loop
      />
);

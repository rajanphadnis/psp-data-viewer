import { Component } from "solid-js";
import NavBar from "../components/navbar/navbar";
import Hero from "../components/home/hero";
import FeaturesSegment from "../components/home/features";
import PricingSegment from "../components/home/pricing";

const Home: Component<{}> = (props) => {
  return (
    <div class="w-full h-full">
      <NavBar />
      <Hero />
      <FeaturesSegment />
      <PricingSegment />
      <Hero />
      <Hero />
      <Hero />
    </div>
  );
};

export default Home;

import { Component } from "solid-js";
import NavBar from "../components/navbar/navbar";
import Hero from "../components/home/hero";
import FeaturesSegment from "../components/home/features";
import PricingSegment from "../components/home/pricing";
import ContactSegment from "../components/home/contact";
import Footer from "../components/home/footer";

const Home: Component<{}> = (props) => {
  let features: HTMLDivElement;

  return (
    <div class="w-full h-full">
      <NavBar />
      <Hero />
      <FeaturesSegment />
      <PricingSegment />
      <ContactSegment />
      <Footer />
    </div>
  );
};

export default Home;

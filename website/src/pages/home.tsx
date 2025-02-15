import { Component } from "solid-js";
import NavBar from "../components/navbar/navbar";
import heroImage from "../assets/images/demo1.png";

const Home: Component<{}> = (props) => {
  return (
    <div class="w-full h-full">
      <NavBar />
      <div class="flex flex-col justify-center items-center w-full mt-32">
        <div class="flex flex-col justify-center items-center">
          <h1 class="text-4xl font-bold">Data tools for the modern rocketry team</h1>
          <p>some tagline</p>
          <button>Sign up</button>
        </div>
        <img src={heroImage} alt="Dataviewer Demo: Hero Picture" class="w-1/3"></img>
      </div>
    </div>
  );
};

export default Home;

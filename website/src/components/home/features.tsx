import { Component } from "solid-js";
import LinkIcon from "../icons/link";
import DatabaseIcon from "../icons/database";
import SackMoneyIcon from "../icons/sack_money";
import BoltIcon from "../icons/bolt";
import MagnifyingGlassChart from "../icons/magnifying_glass_chart";
import DownloadIcon from "../icons/download";
import FeatureTile from "./features/feature_tile";

const FeaturesSegment: Component<{}> = (props) => {
  return (
    <div id="features" class="py-12 border-t-2 border-t-black">
      <div class="mx-5 bg-neutral-950 rounded-2xl p-4">
        <h1 class="text-3xl font-bold mb-3 ml-2">Features</h1>
        <p class="mb-3 mx-2">A feature-packed web platform, API, and admin console. Here's just some of what it can do:</p>
        <div class="flex flex-row justify-start max-md:flex-col">
          <div class="flex flex-col w-1/2 min-w-1/2 max-md:w-full">
            <FeatureTile icon={LinkIcon} name="Sharelinks" desc="Show anyone exactly what you're looking at with just a link" />
            <FeatureTile icon={DatabaseIcon} name="REST API access" desc="Analyze your data with our REST API" />
            <FeatureTile icon={SackMoneyIcon} name="Affordable" desc="Keep your bill at just $0.03/month" />
          </div>
          <div class="flex flex-col w-1/2 min-w-1/2 max-md:w-full">
            <FeatureTile icon={BoltIcon} name="Lightning-fast access" desc="Access 100GB of data in less than a second" />
            <FeatureTile icon={MagnifyingGlassChart} name="Powerful Analysis Tools" desc="Custom calc channels, advanced measuring tools and so much more" />
            <FeatureTile icon={DownloadIcon} name="Data Export" desc="Export data as CSV, PNG, or MP4" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSegment;

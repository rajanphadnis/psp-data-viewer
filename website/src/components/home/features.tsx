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
        <p class="mb-3 mx-2">why use this? bc of these things</p>
        <div class="flex flex-row justify-start">
          <div class="flex flex-col w-1/2 min-w-1/2">
            <FeatureTile icon={LinkIcon} name="Sharelinks" desc="desc" />
            <FeatureTile icon={DatabaseIcon} name="API" desc="desc" />
            <FeatureTile icon={SackMoneyIcon} name="Affordable" desc="desc" />
          </div>
          <div class="flex flex-col w-1/2 min-w-1/2">
            <FeatureTile icon={BoltIcon} name="Lightning-fast access" desc="desc" />
            <FeatureTile icon={MagnifyingGlassChart} name="Analysis Tools" desc="desc" />
            <FeatureTile icon={DownloadIcon} name="Data Export" desc="desc" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSegment;

import { Accessor, Component, createEffect, createSignal, onMount, Show } from "solid-js";
import { new_upload } from "../../db/new";
import { useState } from "../../state";
import CheckIcon from "../icons/check";

const UploadFinalizeLayout: Component<{
  name: Accessor<string>;
  testArticle: Accessor<string>;
  gseArticle: Accessor<string>;
  filePaths: Accessor<File[]>;
  isHDF5: Accessor<boolean>;
  id: Accessor<string>;
  tdmsDelay: Accessor<number>;
}> = (props) => {
  const [
    allKnownTests,
    setAllKnownTests,
    loadingState,
    setLoadingState,
    defaultTest,
    setDefaultTest,
    defaultGSE,
    setDefaultGSE,
    defaultTestArticle,
    setDefaultTestArticle,
    auth,
    setAuth,
    org,
    setOrg,
  ] = useState();

  const [status, setStatus] = createSignal<string[]>(["Something Went Wrong", "Something Went Wrong", "0", "0"]);
  const [uploadPercent, setUploadPercent] = createSignal<number>(0);
  onMount(async () => {
    console.log("mounted");
    setLoadingState({ isLoading: true, statusMessage: "Creating Test..." });
    await new_upload(
      setStatus,
      props.filePaths()[0],
      props.id(),
      setUploadPercent,
      props.name(),
      props.gseArticle(),
      props.testArticle(),
      org()!
    );
  });

  createEffect(() => {
    if (status()[2] == status()[3]) {
      setLoadingState({ isLoading: false, statusMessage: "" });
    }
  });

  return (
    <div class="w-full h-full flex flex-col justify-around items-center">
      <div class="flex flex-col items-center">
        <Show when={status()[2] != status()[3]} fallback={<h1 class="font-bold text-3xl mb-2">Test Created!</h1>}>
          <h1 class="font-bold text-3xl mb-2">
            Creating Test...
          </h1>
          <h3 class="mb-0">Do not close this window while you can still read this message</h3>
        </Show>
      </div>
      <div class="flex flex-col justify-center items-center">
        <p>{status()[0]}</p>
        <Show when={(uploadPercent() != 1) && (status()[2] == "1")} fallback={<p>{status()[1]}</p>}>
          <div class="flex flex-col justify-center items-center overflow-auto">
            <div class="flex flex-row justify-evenly items-center">
              <p>File Upload:</p>
              <progress value={uploadPercent()} />
              <p>{(uploadPercent() * 100).toFixed(2)}%</p>
            </div>
          </div>
        </Show>
        <p>
          Step {status()[2]} of {status()[3]}
        </p>
        <Show when={status()[2] != status()[3]} fallback={<CheckIcon />}>
          <div class="loader animate-spin-xtrafast w-4 h-4 border-t-2 border-2 border-t-rush border-transparent"></div>
        </Show>
      </div>

      <div class="flex flex-col w-full items-center">
        <div class="flex flex-col justify-center items-center">
          <p>Name: {props.name()}</p>
          <p>ID: {props.id()}</p>
          <p>Test Article: {props.testArticle()}</p>
          <p>GSE Article: {props.gseArticle()}</p>
          <Show when={!props.isHDF5()}>
            <p>TDMS Delay: {props.tdmsDelay()}s</p>
          </Show>
        </div>
        {/* <Show when={uploadPercent() != 1}>
          <div class="flex flex-col justify-center items-center overflow-auto h-full">
            <div class="flex flex-row justify-evenly items-center">
              <p>File Upload:</p>
              <progress value={uploadPercent()} />
              <p>{(uploadPercent() * 100).toFixed(2)}%</p>
            </div>
          </div>
        </Show> */}

      </div>
    </div>
  );
};

export default UploadFinalizeLayout;

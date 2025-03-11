import { UploadFile } from "@solid-primitives/upload";
import { Component, createSignal, onMount, Setter } from "solid-js";

export const UploadCreateButton: Component<{
  selectFiles: (callback: (files: UploadFile[]) => void | Promise<void>) => void;
  setFilePath: Setter<File | undefined>
}> = (props) => {
  const [buttonText, setButtonText] = createSignal("Click to Select File (or Drag & Drop)");

  onMount(() => {
  });

  return (
    <button class="cursor-pointer border-2 border-rush rounded-xl min-w-1/2 min-h-40 mb-5"
      onDrop={(e) => {
        console.log(e);
        e.preventDefault();
        if (e.dataTransfer!.items) {
          // Use DataTransferItemList interface to access the file(s)
          [...e.dataTransfer!.items].forEach((item, i) => {
            // If dropped items aren't files, reject them
            if (item.kind === "file") {
              const file = item.getAsFile();
              console.log(`item list file[${i}].name = ${file!.name}`);
              setButtonText("Select File")
              props.setFilePath(() => file!);
            }
          });
        } else {
          // Use DataTransfer interface to access the file(s)
          [...e.dataTransfer!.files].forEach((file, i) => {
            console.log(`interface file[${i}].name = ${file.name}`);
            setButtonText("Select File")
            props.setFilePath(() => file);
          });
        }
      }}
      onDragOver={(e) => {
        console.log(e);
        e.preventDefault();
        // const t = e.target.
        setButtonText("Drop file");
      }}
      onDragLeave={(e) => {
        console.log(e);
        e.preventDefault();
        setButtonText("Select File")
      }}
      onclick={(e) => {
        console.log(e);
        e.preventDefault();
        props.selectFiles((files) => files.forEach((file) => console.log(file)));
      }}
    >{buttonText()}</button>

    // <button
    //   on:click={() => {
    //     props.selectFiles((files) => files.forEach((file) => console.log(file)));
    //   }}
    //   class="p-2.5 bg-rush text-black font-bold border-0 cursor-pointer pt-2.5 pb-1.5 hover:bg-rush-light"
    // >
    //   <PlusIcon />
    // </button>
  );
};

export default UploadCreateButton;

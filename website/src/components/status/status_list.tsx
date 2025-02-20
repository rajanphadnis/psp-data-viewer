import { Component, createSignal, For, onMount, Show } from "solid-js";
import StatusItem from "./status_item";
import { collection, getDocs } from "firebase/firestore";
import { statusType, stringToSiteStatus } from "../../types";

const StatusList: Component<{}> = (props) => {
  const [statuses, setStatuses] = createSignal<statusType[]>();
  onMount(async () => {
    const querySnapshot = await getDocs(collection(globalThis.db, "status"));
    let listOfStatuses: statusType[] = [];
    const docs = querySnapshot.docs;
    docs.sort(function (x, y) {
      return x.id == "general" ? -1 : y.id == "general" ? 1 : 0;
    });
    docs.forEach((doc) => {
      const data = doc.data();
      Object.keys(data).forEach((key) => {
        listOfStatuses.push({
          status: stringToSiteStatus(data[key]["status"]),
          note: data[key]["note"],
          title: data[key]["title"],
        });
      });

      console.log(data);
    });
    setStatuses(listOfStatuses);
  });

  return (
    <div class="mb-8 w-1/2 flex flex-col max-md:w-full">
      <Show
        when={statuses()}
        fallback={
          <div class="w-full flex flex-col justify-center items-center">
            <div class="loader"></div>
          </div>
        }
      >
        <For each={statuses()}>
          {(item, i) => {
            return <StatusItem name={item.title} status={item.status} note={item.note} hiddenStatusCapable={true} />;
          }}
        </For>
      </Show>
    </div>
  );
};

export default StatusList;

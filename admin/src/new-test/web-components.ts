import { delete_icon, plus_icon } from "../icons";
import { genId } from "../modal";
import { updateTestCreateStatus } from "../status";
import { loadingStatus, operationType, type NewTestConfig } from "../types";
import { generateTitle, updateTestDisplay } from "../web_components";
import { doc, onSnapshot } from "firebase/firestore";
import { new_gdrive_links, new_upload_tdsm_csv } from "./finalize";

export async function updateConfigDisplay(config: NewTestConfig) {
  console.log(config);
  updateTestCreateStatus(loadingStatus.LOADING, "Configuring");
  generateConfigPathEntries(config);
  generateInputPanel(config);
  const linkDiv = document.getElementById("test-links")!;
  linkDiv.innerHTML = "";
  const uploadDiv = document.getElementById("test-upload")!;
  uploadDiv.innerHTML = "";
  if (config.id.includes("gdrive")) {
    linkDiv.style.display = "block";
    uploadDiv.style.display = "none";
    initUrlList();
  } else {
    linkDiv.style.display = "none";
    uploadDiv.style.display = "block";
    initUploadPane();
  }
  // generateTestPanel(selected_test);
  // selected_test = await getSpecificTest(selected_test.id, cache);
  // generateDatasetPanel(selected_test);
  checkInputAndShowFinalizeButton(config);
  updateTestCreateStatus(loadingStatus.DONE);
}

function checkInputAndShowFinalizeButton(config: NewTestConfig) {
  const rightMain: HTMLButtonElement = document.getElementById("right-main")! as HTMLButtonElement;
  const finalizeButton: HTMLButtonElement = document.getElementById("finalizeButton")! as HTMLButtonElement;
  finalizeButton.style.visibility = "visible";
  rightMain.style.visibility = "visible";

  finalizeButton.addEventListener("click", (e) => {
    if (config.name.includes("gdrive")) {
      new_gdrive_links(config);
    } else {
      new_upload_tdsm_csv(config);
    }
  });
}

export function getBasicTestInfo(config: NewTestConfig): [string, string, string, string, number] {
  const idElement = document.getElementById(config.id + "_field_id")! as HTMLInputElement;
  const nameElement = document.getElementById(config.id + "_field_name")! as HTMLInputElement;
  const delayElement = document.getElementById(config.id + "_field_tdms_delay")! as HTMLInputElement;
  const testElement = document.getElementById(config.id + "_field_test_article")! as HTMLSelectElement;
  const gseElement = document.getElementById(config.id + "_field_gse_article")! as HTMLSelectElement;
  const inputtedID = idElement.value;
  const inputtedName = nameElement.value;
  const inputtedDelay = parseInt(delayElement.value.toString() ?? "0");
  const inputtedGSEElement = gseElement.options[gseElement.selectedIndex].value;
  const inputtedTestElement = testElement.options[testElement.selectedIndex].value;
  return [inputtedID, inputtedName, inputtedGSEElement, inputtedTestElement, inputtedDelay];
}

export function liveUpdate(id: string) {
  const currentStatusText = document.getElementById("newTest_currentStatus")! as HTMLDivElement;
  const nextStatusText = document.getElementById("newTest_nextStatus")! as HTMLDivElement;
  const currentStatusBar = document.getElementById("newTest_statusBar")! as HTMLDivElement;
  const unsubscribe = onSnapshot(doc(globalThis.db, `/${id}/test_creation`), (doc) => {
    console.log("Current data: ", doc);
    if (doc.data() != undefined) {
      currentStatusText.innerHTML = doc.data()!["creation_status"];
      nextStatusText.innerHTML = doc.data()!["creation_status_next_step"];
      currentStatusBar.innerHTML = `Step ${doc.data()!["creation_status_current"]} of ${
        doc.data()!["creation_status_max_steps"]
      }`;
    }
  });
}

export function generateConfigPathEntries(currentlySelectedConfig: NewTestConfig | null = null) {
  const configs: NewTestConfig[] = globalThis.configs;
  const list = document.getElementById("test-configs")!;
  list.innerHTML = "";
  list.appendChild(generateTitle("Create New Test From:"));
  for (let i = 0; i < configs.length; i++) {
    const config = configs[i];
    const list_div = document.createElement("div");
    const list_main_text = document.createElement("p");
    const list_sub_text = document.createElement("p");
    const list_main_div = document.createElement("div");
    const list_arrow = document.createElement("span");
    list_arrow.classList.add("material-symbols-outlined");
    list_arrow.innerHTML = "arrow_forward_ios";
    list_main_text.innerHTML = config.name;
    list_sub_text.innerHTML = config.create_type;
    list_sub_text.classList.add("create-test-config-subtype");
    list_div.classList.add("test-list-item");
    if (currentlySelectedConfig != null) {
      if (config.id === currentlySelectedConfig.id) {
        list_div.classList.add("test-list-item-selected");
      }
    }
    list_div.addEventListener("click", (e) => {
      // generateTestPanel(test);
      // selected_test = config;
      updateConfigDisplay(config);
    });
    list_main_div.appendChild(list_main_text);
    list_main_div.appendChild(list_sub_text);
    list_div.appendChild(list_main_div);
    list_div.appendChild(list_arrow);
    list.appendChild(list_div);
  }
}

function generateInputPanel(config: NewTestConfig) {
  const panel_div = document.getElementById("test-info")!;
  panel_div.innerHTML = "";
  panel_div.appendChild(generateTitle("Test Details:"));
  const encap_div = document.createElement("div");
  encap_div.appendChild(generateTestInfoField(config.id, "ID", "id", false, genId(7), [], true));
  encap_div.appendChild(generateTestInfoField(config.id, "Name", "name", false));
  encap_div.appendChild(generateTestInfoField(config.id, "TDMS Delay", "tdms_delay", false, "", [], false, true));
  encap_div.appendChild(
    generateTestInfoField(config.id, "Test Article", "test_article", true, undefined, globalThis.test_articles)
  );
  encap_div.appendChild(
    generateTestInfoField(config.id, "GSE Article", "gse_article", true, undefined, globalThis.gse_articles)
  );
  panel_div.appendChild(encap_div);
  panel_div.style.visibility = "visible";
}

function generateTestInfoField(
  config_id: string,
  field_name: string,
  field_id: string,
  isDropdown: boolean,
  knownValue?: string,
  list_values?: string[],
  disabled: boolean = false,
  isNumber: boolean = false
) {
  const field_div = document.createElement("div");
  const field_label = document.createElement("label");
  const field_select = document.createElement("select");
  if (list_values != undefined) {
    for (let i = 0; i < list_values.length; i++) {
      const test_article = list_values[i];
      const option = document.createElement("option");
      option.text = test_article;
      option.value = test_article;
      option.title = test_article;
      field_select.appendChild(option);
    }
  }
  const field_text = document.createElement("input");
  field_text.disabled = disabled;
  field_div.classList.add("test-field-div");
  field_text.classList.add("test-field-text");
  field_label.classList.add("test-field-label");
  field_select.classList.add("test-field-select");
  field_select.id = config_id + "_field_" + field_id;
  field_label.innerHTML = field_name;
  if (knownValue != undefined) {
    field_text.value = knownValue.toString();
    try {
      field_select.value = knownValue.toString();
    } catch (e) {
      console.log("no error");
    }
  }
  field_text.id = config_id + "_field_" + field_id;
  field_text.type = isNumber ? "number" : "text";
  field_text.addEventListener("change", (e) => {
    // const saveButton = document.getElementById("panel_save_button")!;
    // saveButton.style.visibility = "visible";
  });
  field_select.addEventListener("change", (e) => {
    // const saveButton = document.getElementById("panel_save_button")!;
    // saveButton.style.visibility = "visible";
  });
  field_div.appendChild(field_label);
  if (isDropdown) {
    field_div.appendChild(field_select);
  } else {
    field_div.appendChild(field_text);
  }
  return field_div;
}

function initUrlList() {
  const mainDiv = document.getElementById("test-links")!;
  const div = document.createElement("div");
  const p = document.createElement("p");
  p.innerHTML = "Google Drive URLs to TDMS and CSV files:";
  const addButton = document.createElement("button");
  addButton.innerHTML = plus_icon;
  // '<span class="material-symbols-outlined">add</span>';
  addButton.classList.add("url_list_add_button");
  addButton.addEventListener("click", (e) => {
    updateUrlList(operationType.ADD);
  });
  div.classList.add("url_list_title");
  div.appendChild(p);
  div.appendChild(addButton);
  mainDiv.appendChild(div);
  mainDiv.appendChild(createUrlListItem(0));
}
function initUploadPane() {
  const mainDiv = document.getElementById("test-upload")!;
  const div = document.createElement("div");
  const p = document.createElement("p");
  p.innerHTML = "Upload HDF5 file per documentation";
  const addButton = document.createElement("button");
  addButton.innerHTML = plus_icon;
  ('<span class="material-symbols-outlined">add</span>');
  addButton.classList.add("url_list_add_button");
  addButton.addEventListener("click", (e) => {
    updateFileList(operationType.ADD);
  });
  div.classList.add("url_list_title");
  div.appendChild(p);
  div.appendChild(addButton);
  mainDiv.appendChild(div);
  // mainDiv.appendChild(createUploadListItem(0));
}

function createUploadListItem(index: number): [HTMLDivElement, HTMLDivElement] {
  const listDiv = document.createElement("div");
  const fileInput = document.createElement("input");
  const deleteButton = document.createElement("button");
  listDiv.classList.add("file_list_div");
  listDiv.id = "file_list_div_" + index;
  fileInput.id = "file_list_div_fileinput_" + index;
  fileInput.classList.add("test-field-file-upload");
  fileInput.type = "file";
  fileInput.accept = ".csv,.tdms";
  // const attr = document.createAttribute("multiple");
  // fileInput.attributes.setNamedItemNS(attr);
  deleteButton.innerHTML = delete_icon;
  deleteButton.classList.add("file_list_delete_button");
  listDiv.appendChild(fileInput);
  listDiv.appendChild(deleteButton);
  const progressDiv = createUploadProgressBar(index);
  deleteButton.addEventListener("click", (e) => {
    document.getElementById("test-upload")!.removeChild(listDiv);
    document.getElementById("right-main")!.removeChild(progressDiv);
  });
  return [listDiv, progressDiv];
}
function createUploadProgressBar(index: number) {
  const progressBar = document.createElement("progress");
  const labelP = document.createElement("p");
  const statusP = document.createElement("p");
  const listDiv = document.createElement("div");
  listDiv.classList.add("file_progress_div");
  listDiv.id = "file_progress_div_" + index;
  progressBar.id = "file_upload_progress_" + index;
  progressBar.classList.add("file_progress_bar");
  labelP.innerHTML = "File " + (index + 1) + ": ";
  statusP.innerHTML = "Waiting for upload...";
  statusP.id = "file_progress_p_" + index;
  listDiv.appendChild(labelP);
  listDiv.appendChild(progressBar);
  listDiv.appendChild(statusP);
  return listDiv;
}

function createUrlListItem(index: number): HTMLDivElement {
  const listDiv = document.createElement("div");
  const textInput = document.createElement("input");
  const deleteButton = document.createElement("button");
  listDiv.classList.add("url_list_div");
  listDiv.id = "url_list_div_" + index;
  textInput.id = "url_list_div_textinput_" + index;
  textInput.classList.add("test-field-text");
  deleteButton.innerHTML = delete_icon;
  deleteButton.classList.add("url_list_delete_button");
  listDiv.appendChild(textInput);
  listDiv.appendChild(deleteButton);
  deleteButton.addEventListener("click", (e) => {
    document.getElementById("test-links")!.removeChild(listDiv);
  });
  return listDiv;
}
function updateUrlList(opType: operationType) {
  const numberOfCurrentItems = document.getElementsByClassName("url_list_div").length;
  document.getElementById("test-links")!.appendChild(createUrlListItem(numberOfCurrentItems));
}

function updateFileList(opType: operationType) {
  const numberOfCurrentItems = document.getElementsByClassName("file_list_div").length;
  const [listDiv, progressDiv] = createUploadListItem(numberOfCurrentItems);
  document.getElementById("test-upload")!.appendChild(listDiv);
  document.getElementById("right-main")!.appendChild(progressDiv);
  document.getElementById("file_list_div_fileinput_" + numberOfCurrentItems)!.click();
}

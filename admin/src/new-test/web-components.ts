import { delete_icon, plus_icon } from "../icons";
import { genId } from "../modal";
import { updateTestCreateStatus } from "../status";
import { loadingStatus, operationType, type NewTestConfig } from "../types";
import { generateTitle, updateTestDisplay } from "../web_components";

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
  }
  else {
    linkDiv.style.display = "none";
    uploadDiv.style.display = "block";
    initUploadPane();
  }
  // generateTestPanel(selected_test);
  // selected_test = await getSpecificTest(selected_test.id, cache);
  // generateDatasetPanel(selected_test);
  updateTestCreateStatus(loadingStatus.DONE);
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
  disabled: boolean = false
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
  field_text.addEventListener("change", (e) => {
    const saveButton = document.getElementById("panel_save_button")!;
    saveButton.style.visibility = "visible";
  });
  field_select.addEventListener("change", (e) => {
    const saveButton = document.getElementById("panel_save_button")!;
    saveButton.style.visibility = "visible";
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
  // const addButton = document.createElement("button");
  // addButton.innerHTML = plus_icon;
  // '<span class="material-symbols-outlined">add</span>';
  // addButton.classList.add("url_list_add_button");
  // addButton.addEventListener("click", (e) => {
  //   updateUrlList(operationType.ADD);
  // });
  div.classList.add("url_list_title");
  div.appendChild(p);
  // div.appendChild(addButton);
  mainDiv.appendChild(div);
  // mainDiv.appendChild(createUrlListItem(0));
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
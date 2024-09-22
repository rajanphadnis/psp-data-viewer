import { copyTextToClipboard } from "./browser_interactions";
import { getSpecificTest } from "./db_interaction";
import { updateStatus } from "./status";
import { saveTestData } from "./tests";
import { articleType, loadingStatus, type TestDetails } from "./types";

export function generateTestEntries() {
  const list = document.getElementById("tests")!;
  list.innerHTML = "";
  list.appendChild(generateTitle("Tests:"));
  for (let i = 0; i < tests.length; i++) {
    const test = tests[i];
    const list_div = document.createElement("div");
    const list_text = document.createElement("p");
    const list_arrow = document.createElement("span");
    list_arrow.classList.add("material-symbols-outlined");
    list_arrow.innerHTML = "arrow_forward_ios";
    list_text.innerHTML = test.test_article + ":" + test.gse_article + ":" + test.name;
    list_div.classList.add("test-list-item");
    list_div.addEventListener("click", (e) => {
      // generateTestPanel(test);
      selected_test = test;
      updateTestDisplay();
    });
    list_div.appendChild(list_text);
    list_div.appendChild(list_arrow);
    list.appendChild(list_div);
  }
}

export async function updateTestDisplay(cache: boolean = true) {
  updateStatus(loadingStatus.LOADING);
  generateTestEntries();
  generateTestPanel(selected_test);
  selected_test = await getSpecificTest(selected_test.id, cache);
  generateDatasetPanel(selected_test);
  updateStatus(loadingStatus.DONE);
}

function generateTestPanelField(
  test_name: string,
  field_name: string,
  field_id: string,
  isDropdown: boolean,
  knownValue?: string,
  list?: string[],
  disabled: boolean = false
) {
  const field_div = document.createElement("div");
  const field_label = document.createElement("label");
  const field_select = document.createElement("select");
  if (list != undefined) {
    for (let i = 0; i < list.length; i++) {
      const test_article = list[i];
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
  field_select.id = test_name + "_field_" + field_id;
  field_label.innerHTML = field_name;
  if (knownValue != undefined) {
    field_text.value = knownValue.toString();
    try {
      field_select.value = knownValue.toString();
    } catch (e) {
      console.log("no error");
    }
  }
  field_text.id = test_name + "_field_" + field_id;
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

export function generateTestPanel(test: TestDetails) {
  const panel_div = document.getElementById("test-info")!;
  const delete_link = document.createElement("button");
  delete_link.id = "delete_test_button";
  delete_link.innerHTML = "Copy Delete Link";
  delete_link.classList.add("delete_button_class");
  delete_link.addEventListener("click", (e) => {
    const deleteLink = `https://deletetest-w547ikcrwa-uc.a.run.app/?id=${test.id}`;
    copyTextToClipboard(deleteLink, "delete_test_button", "Copy Delete Link");
  });
  panel_div.innerHTML = "";
  panel_div.appendChild(generateTitle("Test Details:"));
  const encap_div = document.createElement("div");
  encap_div.appendChild(delete_link);
  encap_div.appendChild(generateTestPanelField(test.id, "ID", "id", false, test.id, [], true));
  encap_div.appendChild(generateTestPanelField(test.id, "Name", "name", false, test.name));
  encap_div.appendChild(
    generateTestPanelField(test.id, "Test Article", "test_article", true, test.test_article, test_articles)
  );
  encap_div.appendChild(
    generateTestPanelField(test.id, "GSE Article", "gse_article", true, test.gse_article, gse_articles)
  );
  const panel_save_button = document.createElement("button");
  panel_save_button.innerHTML = "Save";
  panel_save_button.classList.add("test-panel-save");
  panel_save_button.id = "panel_save_button";
  panel_save_button.style.visibility = "hidden";
  panel_save_button.addEventListener("click", (e: MouseEvent) => {
    // const idElement = document.getElementById(test.id + "_field_id")! as HTMLInputElement;
    const nameElement = document.getElementById(test.id + "_field_name")! as HTMLInputElement;
    const testElement = document.getElementById(test.id + "_field_test_article")! as HTMLSelectElement;
    const gseElement = document.getElementById(test.id + "_field_gse_article")! as HTMLSelectElement;
    saveTestData(
      test.id,
      test.id,
      nameElement.value,
      gseElement.options[gseElement.selectedIndex].value,
      testElement.options[testElement.selectedIndex].value
    );
  });
  panel_div.appendChild(encap_div);
  panel_div.appendChild(panel_save_button);
}

// export const check_mark: string = '<span class="material-symbols-outlined green_check">done</span>';

export const loader: string = '<div class="loader"></div>';

export function generateArticlePanel(article: articleType) {
  const list = document.getElementById("articles-info")!;
  list.innerHTML = "";
  let selected_text: string;
  let selected_list: string[];
  if (article == articleType.GSE) {
    selected_text = "GSE";
    selected_list = gse_articles;
  } else {
    selected_text = "Test";
    selected_list = test_articles;
  }

  // list.appendChild(generateTitle(selected_text + " Articles:"));
  for (let i = 0; i < selected_list.length; i++) {
    const test = selected_list[i];
    const div = document.createElement("div");
    const panel_p = document.createElement("p");
    const article_span = document.createElement("span");
    div.classList.add("articles_info_div");
    panel_p.innerHTML = test;
    div.appendChild(panel_p);
    div.appendChild(article_span);
    list.appendChild(div);
  }
}

export function generateTitle(title: string) {
  const title_p = document.createElement("p");
  const title_span = document.createElement("span");
  title_span.innerHTML = title;
  title_span.classList.add("section-title");
  title_p.appendChild(title_span);
  return title_p;
}

function generateDatasetPanel(test: TestDetails) {
  const panel_div = document.getElementById("dataset")!;
  panel_div.innerHTML = "";
  panel_div.appendChild(generateTitle("Test Datasets:"));
  const sorted = test.datasets!.sort();
  for (let i = 0; i < sorted.length; i++) {
    const dataset = sorted[i];
    const div = document.createElement("div");
    const panel_p = document.createElement("p");
    const detail_span = document.createElement("span");
    panel_p.innerHTML = dataset.toString().split("__")[0] + " (" + dataset.toString().split("__")[1] + ")";
    if (test.custom_channels!.includes(dataset)) {
      detail_span.innerHTML = "Custom";
    } else {
      detail_span.innerHTML = "Recorded";
    }
    detail_span.classList.add("dataset_item_span");
    div.classList.add("dataset_item_div");
    div.appendChild(panel_p);
    div.appendChild(detail_span);
    panel_div.appendChild(div);
  }
}

import { getSpecificTest } from "./db_interaction";
import { updateStatus } from "./status";
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
    list_text.innerHTML = test.name;
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

export async function updateTestDisplay() {
  updateStatus(loadingStatus.LOADING);
  generateTestEntries();
  generateTestPanel(selected_test);
  selected_test = await getSpecificTest(selected_test.id);
  generateDatasetPanel(selected_test);
  updateStatus(loadingStatus.DONE);
}

function generateTestPanelField(
  name: string,
  field: string,
  isDropdown: boolean,
  knownValue?: string,
  list?: string[]
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
  field_div.classList.add("test-field-div");
  field_text.classList.add("test-field-text");
  field_label.classList.add("test-field-label");
  field_select.classList.add("test-field-select");
  field_label.innerHTML = field;
  if (knownValue != undefined) {
    field_text.value = knownValue.toString();
  }
  field_text.id = name + "_field_" + field;
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
  panel_div.innerHTML = "";
  panel_div.appendChild(generateTitle("Test Details:"));
  const encap_div = document.createElement("div");
  encap_div.appendChild(generateTestPanelField(test.id, "ID", false, test.id));
  encap_div.appendChild(generateTestPanelField(test.id, "Name", false, test.name));
  encap_div.appendChild(generateTestPanelField(test.id, "Test Article", true, test.test_article, test_articles));
  encap_div.appendChild(generateTestPanelField(test.id, "GSE Article", true, test.id, gse_articles));
  const panel_save_button = document.createElement("button");
  panel_save_button.innerHTML = "Save";
  panel_save_button.classList.add("test-panel-save");
  panel_div.appendChild(encap_div);
  panel_div.appendChild(panel_save_button);
}

export const check_mark: string = '<span class="material-symbols-outlined green_check">done</span>';

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

  list.appendChild(generateTitle(selected_text + " Articles:"));
  for (let i = 0; i < selected_list.length; i++) {
    const test = selected_list[i];
    const panel_p = document.createElement("p");
    panel_p.innerHTML = test;
    list.appendChild(panel_p);
  }
}

function generateTitle(title: string) {
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
  for (let i = 0; i < test.datasets!.length; i++) {
    const dataset = test.datasets![i];
    const panel_p = document.createElement("p");
    panel_p.innerHTML = dataset;
    panel_div.appendChild(panel_p);
  }
}

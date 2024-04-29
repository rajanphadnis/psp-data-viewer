import type { TestDetails } from "./types";

export function generateTestEntries() {
  const list = document.getElementById("tests")!;
  list.innerHTML = "";
  for (let i = 0; i < tests.length; i++) {
    const test = tests[i];
    const list_div = document.createElement("div");
    const list_text = document.createElement("p");
    list_text.innerHTML = test.name;
    list_div.addEventListener("click", (e) => {
      generateTestPanel(test);
    });
    list_div.appendChild(list_text);
    list.appendChild(list_div);
  }
}

function generateTestPanelField(
  name: string,
  field: string,
  isDropdown: boolean,
  knownValue?: string,
  list?: string[]
) {
  const field_div = document.createElement("div");
  const field_label = document.createElement("p");
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
  panel_div.appendChild(generateTestPanelField(test.id, "ID", false, test.id));
  panel_div.appendChild(generateTestPanelField(test.id, "Name", false, test.name));
  panel_div.appendChild(generateTestPanelField(test.id, "Test Article", true, test.test_article, test_articles));
  panel_div.appendChild(generateTestPanelField(test.id, "GSE Article", true, test.id, gse_articles));
}

export const check_mark: string = '<span class="material-symbols-outlined green_check">done</span>';

export const loader: string = '<div class="loader"></div>';

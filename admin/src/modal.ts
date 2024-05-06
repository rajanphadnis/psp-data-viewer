import { delete_icon, plus_icon } from "./icons";
import { operationType } from "./types";

const mainDiv = document.getElementById("new_test_urls_div")! as HTMLDivElement;
export function initModal() {
  const modal = document.getElementById("testSwitcherModal")!;
  const newTestButton = document.getElementById("newTestButton")!;
  const closeButton = document.getElementsByClassName("close")[0]!;
  newTestButton.addEventListener("click", (e) => {
    modal.style.display = "block";
  });

  closeButton.addEventListener("click", (e) => {
    modal.style.display = "none";
  });

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
  (document.getElementById("new_test_id")! as HTMLInputElement).value = genId(7);
  initUrlList();
  updateUrlList(operationType.ADD);
}

function initUrlList() {
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

export function updateUrlList(opType: operationType) {
  const numberOfCurrentItems = document.getElementsByClassName("url_list_div").length;
  mainDiv.appendChild(createUrlListItem(numberOfCurrentItems));
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
    document.getElementById("new_test_urls_div")!.removeChild(listDiv);
  });
  return listDiv;
}


function genId(length: number) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}
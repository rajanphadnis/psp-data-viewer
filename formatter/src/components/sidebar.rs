use dioxus::prelude::*;
use polars::frame::DataFrame;
use tokio::sync::mpsc::Sender;

use crate::{components::FileList, FILES};

#[component]
pub fn SideBar(data_sender: Sender<DataFrame>) -> Element {
    rsx! {
        div {
            class: "flex flex-col justify-between h-full",
            FileList {},
            div {
                class: "flex flex-col w-full",
                label {
                    r#for: "fileUploadButton",
                    class: "bg-purple-600 p-3 rounded-xl flex flex-row justify-center items-center mb-3 hover:cursor-pointer",
                    "Select Files",
                },
                input {
                    r#type: "file",
                    id: "fileUploadButton",
                    class: "hidden",
                    accept: ".tdms,.csv",
                    multiple: true,
                    onchange: move |evt| {
                        if let Some(file_engine) = &evt.files() {
                            let files = file_engine.files();
                            for file_name in files {
                                FILES.write().push(file_name);
                            }
                        }
                    }
                },
                if FILES.iter().count() > 0 {
                    button {
                        onclick: move |_| {
                            FILES.write().clear();
                        },
                        class: "bg-red-600 p-3 rounded-xl flex flex-row justify-center items-center hover:cursor-pointer",
                        "Clear files"
                    },
                }
            },
        }
    }
}

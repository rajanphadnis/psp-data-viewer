use dioxus::{logger::tracing::info, prelude::*};

use crate::{components::ProcessingButton, FILES};

#[component]
pub fn FileList() -> Element {
    rsx! {
        div {
            if FILES.iter().count() > 0 {
                h1 {
                    class: "text-2xl font-bold mb-2",
                    "Selected Files:",
                },
                for file in FILES.read().iter().cloned() {
                    div {
                        class: "text-sm hover:bg-neutral-500 rounded-lg p-2 flex flex-row justify-between items-center",
                        {
                            let splits = file.split("\\").last();
                            info!("{:?}", splits);
                            let name = match splits {
                                Some(name) => name,
                                None => "Failed to parse file path & name"
                            };
                            info!(name);
                            name
                        },
                        ProcessingButton {
                            file_path: file,
                        },
                    }
                }
            }
        },
    }
}

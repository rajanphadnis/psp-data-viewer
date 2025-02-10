use dioxus::logger::tracing::info;
use dioxus::prelude::*;
use tokio::sync::mpsc;
use tokio::sync::mpsc::{Receiver, Sender};

use crate::processing::create;

#[component]
pub fn ProcessingButton(file_path: String) -> Element {
    let (sender, mut receiver): (Sender<String>, Receiver<String>) = mpsc::channel::<String>(100);
    let status = use_signal(|| None::<String>);

    spawn({
        let mut status = status.clone();
        async move {
            while let Some(msg) = receiver.recv().await {
                status.set(Some(msg));
            }
        }
    });

    rsx! {
        match &*status.read() {
            Some(latest) => rsx! { p { "{latest}" } },
            None => rsx! {
                button {
                    class: "bg-blue-600 p-3 rounded-xl flex flex-row justify-center items-center hover:cursor-pointer",
                    onclick: move |_| {
                        info!("clicked");
                        let sender = sender.clone();
                        create(file_path.clone(), sender);
                    },
                    "Import File"
                }
            }
        }
    }
}

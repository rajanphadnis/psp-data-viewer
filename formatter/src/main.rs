#![cfg_attr(feature = "bundle", windows_subsystem = "windows")]
use dioxus::desktop::muda::Menu;
use dioxus::desktop::tao::window::Icon;
use dioxus::desktop::{Config, WindowBuilder};
use dioxus::prelude::*;

use components::SideBar;
use image::load_from_memory;

mod components;
mod processing;

// const FAVICON: Asset = asset!("/assets/favicon.ico");
// const MAIN_CSS: Asset = asset!("/assets/styling/main.css");
const TAILWIND_CSS: Asset = asset!(
    "/assets/tailwind.css",
    CssAssetOptions::new().with_minify(true)
);

fn main() {
    dioxus::LaunchBuilder::desktop()
        .with_cfg(
            Config::new()
                .with_window(WindowBuilder::new().with_resizable(true))
                .with_icon(load_icon())
                .with_disable_context_menu(true)
                .with_menu(Menu::new()).with_background_color((15, 17, 22, 1)),
        )
        .launch(App)
}

static FILES: GlobalSignal<Vec<String>> = Signal::global(|| vec![]);

#[component]
fn App() -> Element {
    rsx! {
        document::Link { rel: "stylesheet", href: TAILWIND_CSS }
        document::Style {
            r#"
            html,body, #main {{
                margin: 0;
                padding: 0;
                width: 100%;
                height: 100%;
                background-color: #0f1116;
                color: #ffffff;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }}"#
        }
        document::Title { "Dataviewer.Space Data Formatter" }

        div {
            class: "w-full h-full p-0 m-0 flex flex-row",
            // div {
            //     class: "w-1/3 min-w-1/3 max-w-1/3 h-full p-3",
            //     if FILES.iter().count() > 0 {
            //         for file in FILES.read().iter().cloned() {
            //             button {
            //                 class: "bg-blue-600 p-3 rounded-xl flex flex-row justify-center items-center hover:cursor-pointer",
            //                 onclick: move |_| {
            //                     let file = file.clone();
            //                     tokio::task::spawn(async move {
            //                         create(file).await;
            //                     });
            //                 },
            //                 "Analyze Channels"
            //             },
            //         },
            //     }
            // },
            div {
                class: "h-full w-full min-w-full max-w-full p-3",
                SideBar {},
            }
        }
    }
}

fn load_icon() -> Icon {
    let (icon_rgba, icon_width, icon_height) = {
        // alternatively, you can embed the icon in the binary through `include_bytes!` macro and use `image::load_from_memory`
        let it = include_bytes!("../assets/favicon.ico");
        let image = load_from_memory(it)
            // let image = image::open(path)
            .expect("Failed to open icon path")
            .into_rgba8();
        let (width, height) = image.dimensions();
        let rgba = image.into_raw();
        (rgba, width, height)
    };
    Icon::from_rgba(icon_rgba, icon_width, icon_height).expect("Failed to open icon")
}

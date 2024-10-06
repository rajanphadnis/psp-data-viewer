#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")] // hide console window on Windows in release

use csv::StringRecord;
use eframe::egui;
use formatter::get_file_records;
use formatter::{checks::run_all_checks, components::checks_entry};
use rfd::FileDialog;
use std::collections::HashMap;
use std::{sync::mpsc, thread};

fn main() -> eframe::Result {
    env_logger::init(); // Log to stderr (if you run with `RUST_LOG=debug`).
    let options = eframe::NativeOptions {
        viewport: egui::ViewportBuilder::default().with_inner_size([400.0, 300.0]),
        ..Default::default()
    };
    eframe::run_native(
        "PSP Data Viewer - Local File Formatter",
        options,
        Box::new(|_cc| Ok(Box::<MyApp>::default())),
    )
}

struct MyApp {
    selected_file: Option<String>,
    headers: Option<StringRecord>,
    records: Option<Vec<StringRecord>>,
    file_read_task_receiver:
        Option<mpsc::Receiver<(Option<StringRecord>, Option<Vec<StringRecord>>)>>,
    checks_task_receiver: Option<mpsc::Receiver<Option<HashMap<String, bool>>>>,
    checks: Option<HashMap<String, bool>>,
    ready_to_run_checks: bool,
}

impl Default for MyApp {
    fn default() -> Self {
        Self {
            selected_file: None,
            headers: None,
            records: None,
            file_read_task_receiver: None,
            checks_task_receiver: None,
            checks: None,
            ready_to_run_checks: true,
        }
    }
}

impl eframe::App for MyApp {
    fn update(&mut self, ctx: &egui::Context, _frame: &mut eframe::Frame) {
        if let (Some(ref records), Some(ref header)) = (&self.records, &self.headers) {
            egui::SidePanel::right("checks_panel").show(ctx, |ui| {
                ui.heading("Checks");

                if self.ready_to_run_checks {
                    self.ready_to_run_checks = false;
                    self.checks = None;
                    let (sender_checks, receiver_checks) = mpsc::channel();
                    self.checks_task_receiver = Some(receiver_checks);
                    let copied_header = header.clone();
                    let copied_records = records.clone();
                    thread::spawn(move || {
                        //     // Simulate an asynchronous task here
                        let checks_rt = tokio::runtime::Runtime::new().unwrap();

                        let checks_result =
                            checks_rt.block_on(run_all_checks(&copied_header, &copied_records));
                        sender_checks
                            .send(Some(checks_result.to_owned()))
                            .expect("Failed to send task result");
                    });
                }
                // Add a button to open the file picker
                // if ui.button("Run Checks").clicked() {
                // }

                // Poll for the result of the async task
                if let Some(ref receiver) = self.checks_task_receiver {
                    if let Ok(ref thing) = receiver.try_recv() {
                        self.checks = thing.clone();
                        self.file_read_task_receiver = None; // Check processing completed, clear the receiver
                    }
                }

                if let Some(ref checks) = self.checks {
                    // Collect keys into a vector and sort alphabetically
                    let mut keys: Vec<_> = checks.keys().collect();
                    keys.sort(); // Sort keys alphabetically
                    for check_name in keys {
                        if let Some(check_val) = checks.get(check_name) {
                            let actual_name: Vec<&str> = (&check_name).split('.').collect();
                            checks_entry(
                                ui,
                                *check_val,
                                actual_name.get(1).expect("Actual Name"),
                                None,
                            );
                        }
                    }
                } else {
                    ui.spinner();
                }
            });
        }
        egui::CentralPanel::default().show(ctx, |ui| {
            ui.heading("PSP Data Viewer - Local File Formatter");

            // Add a button to open the file picker
            if ui.button("Select File").clicked() {
                if let Some(file_path) = FileDialog::new().pick_file() {
                    self.selected_file = Some(file_path.display().to_string());
                    // Clear previous headers and records
                    self.headers = None;
                    self.records = None;
                    // Set up an asynchronous task to process the file
                    let (sender, receiver) = mpsc::channel();

                    self.file_read_task_receiver = Some(receiver);

                    // Spawn a new thread to run the async task
                    thread::spawn(move || {
                        // Simulate an asynchronous task here
                        let processing_rt = tokio::runtime::Runtime::new().unwrap();

                        let processing_result = processing_rt
                            .block_on(get_file_records(&file_path.display().to_string()));

                        sender
                            .send(processing_result.to_owned())
                            .expect("Failed to send task result");
                    });
                }
            }

            // Poll for the result of the async task
            if let Some(ref receiver) = self.file_read_task_receiver {
                if let Ok((headers, records)) = receiver.try_recv() {
                    self.headers = headers;
                    self.records = records;
                    self.ready_to_run_checks = true;
                    self.file_read_task_receiver = None; // File processing completed, clear the receiver
                }
            }

            // Display the selected file path, if any
            if let Some(ref path) = self.selected_file {
                ui.label(format!("Selected file: {}", path));
                if let (Some(ref records), Some(ref header)) = (&self.records, &self.headers) {
                    // Create a grid for displaying the CSV as a table
                    egui::Grid::new("csv_table")
                        .striped(true) // Optional: to alternate row colors
                        .show(ui, |ui| {
                            // Display table headers
                            for column in header.iter() {
                                ui.label(column);
                            }
                            ui.end_row();
                            for row in records.iter().take(10) {
                                for field in row.iter() {
                                    ui.label(field);
                                }
                                ui.end_row();
                            }

                            if records.len() > 10 {
                                for _ in header.iter() {
                                    ui.label("...");
                                }
                                ui.end_row();
                            }
                        });
                } else {
                    ui.spinner();
                }
            } else {
                ui.label("No file selected.");
            }

            // Ask `egui` to repaint the UI on the next frame if async task is running
            if self.file_read_task_receiver.is_some() {
                ctx.request_repaint();
            }
        });
    }
}

use egui::{vec2, Color32, Response, Sense, Ui};

fn custom_checkbox(ui: &mut Ui, width: f32, height: f32, checked: bool) -> Response {
    // create a `Rect` with given size
    let (rect, response) = ui.allocate_exact_size(vec2(width, height), Sense::click());

    // if the rect is visible
    if ui.is_rect_visible(rect) {
        // paint with a background color, depending on whether we're checked
        let color = if checked {
            Color32::GREEN
        } else {
            Color32::RED
        };
        ui.painter().rect_filled(rect, 0.0, color);

        // if we're clicked, update the checked state
        if response.clicked() {
            // *checked = !*checked;
        }
    }

    response
}

pub fn checks_entry(ui: &mut Ui, checked: bool, name: &str, size: Option<f32>) {
    ui.horizontal(|ui| {
        custom_checkbox(ui, size.unwrap_or(12.0), size.unwrap_or(12.0), checked);
        ui.label(name);
    });
}

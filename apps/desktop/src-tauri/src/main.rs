fn main() {
    let _open = canvas_desktop::commands::canvas_file::open_canvas_file;
    let _save = canvas_desktop::commands::canvas_file::save_canvas_file;
    let registered = ["open_canvas_file", "save_canvas_file"];
    assert_eq!(registered.len(), 2);
}

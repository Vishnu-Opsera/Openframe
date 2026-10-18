use std::fs;

use canvas_desktop::commands::canvas_file::{atomic_write_canvas_file, open_canvas_file_from_path, save_canvas_file_to_path};

#[test]
fn canvas_file_commands() {
    let fixture = concat!(env!("CARGO_MANIFEST_DIR"), "/../tests/fixtures/filesystem/valid_desktop.canvas");
    let opened = open_canvas_file_from_path(fixture.as_ref()).expect("open");
    assert_eq!(opened.schema_version, 1);
    let invalid = concat!(env!("CARGO_MANIFEST_DIR"), "/../tests/fixtures/filesystem/invalid_desktop.canvas");
    let error = open_canvas_file_from_path(invalid.as_ref()).expect_err("invalid");
    assert_eq!(error.code, "SCHEMA_VALIDATION_FAILED");
    let destination = std::env::temp_dir().join("openframe-canvas-save.canvas");
    let bytes = save_canvas_file_to_path(&destination, &opened.document).expect("save");
    assert!(bytes > 0);
    assert!(destination.exists());
    let missing_parent = std::path::Path::new("/tmp/openframe-missing-parent-dir/file.canvas");
    if !missing_parent.parent().unwrap().exists() {
        let write_error = atomic_write_canvas_file(missing_parent, "{}").expect_err("missing parent");
        assert_eq!(write_error.code, "WRITE_FAILED");
    }
    let _ = fs::remove_file(destination);
}

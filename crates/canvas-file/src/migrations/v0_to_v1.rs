use serde_json::{json, Value};

pub fn migrate_draft(mut value: Value) -> Result<Value, String> {
    let object = value.as_object_mut().ok_or("draft document must be an object")?;
    object.insert("schema_version".to_string(), json!(1));
    for key in ["pages", "nodes", "tokens", "components", "unsupported_elements"] {
        object.entry(key).or_insert_with(|| json!([]));
    }
    object.entry("export_metadata").or_insert_with(|| json!({ "format": "png", "scale": 1 }));
    Ok(value)
}

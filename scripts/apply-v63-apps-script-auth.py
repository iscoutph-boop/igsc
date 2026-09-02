from pathlib import Path

path = Path("apps-script/IGS_Staging_CRM_V6_2_5_PRODUCTION_READINESS_R2.gs")
source = path.read_text(encoding="utf-8")

if "function safeSheetValueV63_(value)" not in source:
    marker = "function appendRowByHeadersV6_(sheet, headerRow, data) {"
    helper = r"""function safeSheetValueV63_(value) {
  if (typeof value !== 'string') return value;
  const inspected = value.replace(/^[\s\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000]+/, '');
  if (/^[=+\-@]/.test(inspected)) return "'" + value;
  return value;
}

"""
    if marker not in source:
        raise SystemExit("Expected append-row helper target was not found")
    source = source.replace(marker, helper + marker, 1)

old_append = "return Object.prototype.hasOwnProperty.call(data, header) ? data[header] : '';"
new_append = "return Object.prototype.hasOwnProperty.call(data, header) ? safeSheetValueV63_(data[header]) : '';"
if old_append in source:
    source = source.replace(old_append, new_append, 1)
elif new_append not in source:
    raise SystemExit("Expected append-row value target was not found")

old_update = "sheet.getRange(row, index + 1).setValue(fields[header]);"
new_update = "sheet.getRange(row, index + 1).setValue(safeSheetValueV63_(fields[header]));"
if old_update in source:
    source = source.replace(old_update, new_update, 1)
elif new_update not in source:
    raise SystemExit("Expected update-field value target was not found")

path.write_text(source, encoding="utf-8")

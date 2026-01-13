import { useEffect, useRef } from "react";
import { Button, DatePicker } from "antd";
import { EditOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

export default function EditableCell({
  value,
  isEditing,
  onEdit,
  onSave,
  inputType = "text",
  options = [],
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputType !== "date") inputRef.current?.focus();
  }, [isEditing, inputType]);

  return (
    <div style={{ display: "flex", alignItems: "center", width: "100%", gap: "0.5rem" }}>
      {/* Text / input area */}
      {!isEditing && (
        <span
          style={{
            flex: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          title={value} // shows full text on hover
        >
          {value}
        </span>
      )}

      {isEditing && inputType === "select" && (
        <select
          ref={inputRef}
          defaultValue={value}
          onBlur={(e) => onSave(e.target.value)}
          style={{ flex: 1 }}
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      )}

      {isEditing && inputType === "date" && (
        <DatePicker
          ref={inputRef}
          value={value ? dayjs(value) : null}
          onChange={(date, dateString) => onSave(dateString)}
          onOpenChange={(open) => {
            if (!open) inputRef.current?.blur?.(); // finish edit when picker closes
          }}
          style={{ flex: 1 }}
        />
      )}

      {isEditing && inputType !== "select" && inputType !== "date" && (
        <input
          ref={inputRef}
          type={inputType}
          defaultValue={value}
          onBlur={(e) => onSave(e.target.value)}
          style={{ flex: 1 }}
        />
      )}

      {/* Edit button always visible */}
      <Button type="text" icon={<EditOutlined />} onClick={onEdit} />
    </div>
  );
}

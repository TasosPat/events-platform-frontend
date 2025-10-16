interface FieldProps {
    label: string;
    name: string;
    value: string | number;
    editMode: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    type?: string;
    textarea?: boolean;
  }

  export const Field: React.FC<FieldProps> = ({ label, name, value, editMode, onChange, type = "text", textarea = false }) => {
    const formatDisplayValue = () => {
        if (name === "description") return value ? value : "No description yet";
        if (name === "price") return value ? `£${value}` : "Free";
        if (name === "date" && value) return new Date(value as string).toLocaleDateString("en-GB");
        if ((name === "start_time" || name === "end_time") && value)
          return new Date(`1970-01-01T${value}`).toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
          });
        return value || "N/A";
      };
    if (!editMode) {
      return (
        <p className="mb-2">
          <strong>{label}:</strong> {formatDisplayValue()}
        </p>
      );
    }

    let inputValue = value;
  if (type === "date" && value) {
    inputValue = new Date(value as string).toISOString().split("T")[0];
  }
  
    if (textarea) {
      return (
        <textarea
          name={name}
          value={value as string}
          onChange={onChange}
          className="w-full p-2 border rounded"
          rows={3}
        />
      );
    }
  
    return (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full p-2 border rounded"
        step={type === "number" ? "0.01" : undefined}
      />
    );
  };
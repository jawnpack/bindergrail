"use client";

import { DEFAULT_TAGS } from "@/lib/pocket-money/tags";

interface TagPickerProps {
  customTags: string[];
  selected: string[];
  onChange: (tags: string[]) => void;
  max?: number;
}

export default function TagPicker({
  customTags,
  selected,
  onChange,
  max = 3,
}: TagPickerProps) {
  const available = [
    ...DEFAULT_TAGS.map((t) => t.name),
    ...customTags.filter((c) => !DEFAULT_TAGS.some((t) => t.name === c)),
  ];

  function toggle(name: string) {
    if (selected.includes(name)) {
      onChange(selected.filter((t) => t !== name));
    } else if (selected.length < max) {
      onChange([...selected, name]);
    }
  }

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {available.map((name) => {
          const isSelected = selected.includes(name);
          const atMax = !isSelected && selected.length >= max;
          return (
            <button
              key={name}
              type="button"
              onClick={() => toggle(name)}
              disabled={atMax}
              style={{
                padding: "5px 12px",
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 500,
                border: "0.5px solid var(--pm-gray-border)",
                cursor: atMax ? "not-allowed" : "pointer",
                backgroundColor: isSelected ? "var(--pm-ink)" : "var(--pm-white)",
                color: isSelected
                  ? "var(--pm-green-lightest)"
                  : "var(--pm-gray-text)",
                opacity: atMax ? 0.4 : 1,
                transition: "background-color 0.15s",
                fontFamily: "inherit",
              }}
            >
              {name}
            </button>
          );
        })}
      </div>
      <p
        style={{
          fontSize: 10,
          color: "var(--pm-gray-text)",
          marginTop: 6,
        }}
      >
        Up to {max} tags. {selected.length}/{max} selected.
      </p>
    </div>
  );
}

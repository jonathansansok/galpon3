import React from "react";

interface HighlightTextProps {
  text: string;
  searchTerms: string[];
}

const HighlightText: React.FC<HighlightTextProps> = ({ text, searchTerms }) => {
  if (!text || !searchTerms.length) return <>{text}</>;

  const terms = searchTerms.filter((t) => t.length > 0);
  if (!terms.length) return <>{text}</>;

  const escaped = terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const regex = new RegExp(`(${escaped.join("|")})`, "gi");

  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) => {
        const isMatch = terms.some(
          (t) => part.toLowerCase() === t.toLowerCase()
        );
        return isMatch ? (
          <mark
            key={i}
            style={{
              backgroundColor: "#b6f2b6",
              padding: "0 1px",
              borderRadius: "2px",
            }}
          >
            {part}
          </mark>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        );
      })}
    </>
  );
};

export function highlightCellValue(
  value: any,
  searchTerms: string[]
): React.ReactNode {
  if (!searchTerms.length || value === null || value === undefined) return value;
  const str = String(value);
  if (!str) return value;
  return <HighlightText text={str} searchTerms={searchTerms} />;
}

export default HighlightText;

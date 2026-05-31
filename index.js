export default function TailwindBreakpointIndicatorPlugin({ addBase, theme }) {
  if (process.env.NODE_ENV === "production") return;

  const screens = theme("screens", {});
  const breakpoints = Object.keys(screens);

  const toMinWidth = (value) => {
    if (typeof value === "string") return value;

    if (Array.isArray(value)) {
      for (const entry of value) {
        const min = toMinWidth(entry);
        if (min) return min;
      }
      return null;
    }

    if (value && typeof value === "object" && typeof value.min === "string") {
      return value.min;
    }

    return null;
  };

  const resolvedBreakpoints = breakpoints
    .map((key) => ({
      key,
      minWidth: toMinWidth(screens[key]),
    }))
    .filter((item) => item.minWidth);

  addBase({
    "body::after": {
      content: `"–"`,
      position: "fixed",
      left: ".5rem",
      bottom: ".5rem",
      width: "2rem",
      height: "2rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "100%",
      fontSize: ".875rem",
      fontWeight: "600",
      zIndex: "99999",
      background: "light-dark(#edf2f7, #111)",
      color: "light-dark(#567, #eee)",
      border: "1px solid light-dark(#9ab, #cde)",
    },
  });
  resolvedBreakpoints.forEach(({ key, minWidth }) => {
      addBase({
        [`@media (min-width: ${minWidth})`]: {
          "body::after": {
            content: `"${key}"`,
          },
        },
      });
    });
}

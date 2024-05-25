export default function TailwindBreakpointIndicatorPlugin({ addBase, theme }) {
  if (process.env.NODE_ENV === "production") return;

  const screens = theme("screens", {});
  const breakpoints = Object.keys(screens);

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
  breakpoints
    .sort(
      (a, b) => +screens[a].replace("px", "") - +screens[b].replace("px", "")
    )
    .forEach((key) => {
      addBase({
        [`@media (min-width: ${screens[key]})`]: {
          "body::after": {
            content: `"${key}"`,
          },
        },
      });
    });
}

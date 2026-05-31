// taken from https://github.com/tailwindlabs/tailwindcss/blob/main/packages/tailwindcss/src/utils/compare-breakpoints.ts
/**
 * @param {string} a
 * @param {string} z
 * @param {'asc' | 'desc'} direction
 */
function compareBreakpoints(a, z, direction) {
  if (a === z) return 0;

  // Assumption: when a `(` exists, we are dealing with a CSS function.
  //
  // E.g.: `calc(100% - 1rem)`
  let aIsCssFunction = a.indexOf("(");
  let zIsCssFunction = z.indexOf("(");

  let aBucket =
    aIsCssFunction === -1
      ? // No CSS function found, bucket by unit instead
        a.replace(/[\d.]+/g, "")
      : // CSS function found, bucket by function name
        a.slice(0, aIsCssFunction);

  let zBucket =
    zIsCssFunction === -1
      ? // No CSS function found, bucket by unit
        z.replace(/[\d.]+/g, "")
      : // CSS function found, bucket by function name
        z.slice(0, zIsCssFunction);

  let order =
    // Compare by bucket name
    (aBucket === zBucket ? 0 : aBucket < zBucket ? -1 : 1) ||
    // If bucket names are the same, compare by value
    (direction === "asc"
      ? parseInt(a) - parseInt(z)
      : parseInt(z) - parseInt(a));

  // If the groups are the same, and the contents are not numbers, the
  // `order` will result in `NaN`. In this case, we want to make sorting
  // stable by falling back to a string comparison.
  //
  // This can happen when using CSS functions such as `calc`.
  //
  // E.g.:
  //
  // - `min-[calc(100%-1rem)]` and `min-[calc(100%-2rem)]`
  // - `@[calc(100%-1rem)]` and `@[calc(100%-2rem)]`
  //
  // In this scenario, we want to alphabetically sort `calc(100%-1rem)` and
  // `calc(100%-2rem)` to make it deterministic.
  if (Number.isNaN(order)) {
    return a < z ? -1 : 1;
  }

  return order;
}

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
    .map((key, index) => ({
      key,
      index,
      minWidth: toMinWidth(screens[key]),
    }))
    .filter((item) => item.minWidth)
    .sort(
      (a, b) =>
        compareBreakpoints(a.minWidth, b.minWidth, "asc") || a.index - b.index
    );

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

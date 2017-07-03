const BLACK = [0, 0, 0];
const BLUE = [0, 0, 255];
const GREEN = [0, 255, 0];
const CYAN = [0, 255, 255];
const RED = [255, 0, 0];
const MAGENTA = [255, 0, 255];
const YELLOW = [255, 255, 0];
const WHITE = [255, 255, 255];
const BROWN = [155, 96, 59];
const TAN = [255, 149, 119];
const FOREST = [34, 139, 34];
const AQUA = [127, 255, 212];
const SALMON = [250, 128, 114];
const PURPLE = [128, 0, 128];
const ORANGE = [255, 163, 0];
const GREY = [183, 183, 183];

const DEFAULT_PALETTE = [
  BLACK,
  BLUE,
  GREEN,
  CYAN,
  RED,
  MAGENTA,
  YELLOW,
  WHITE,
  BROWN,
  TAN,
  FOREST,
  AQUA,
  SALMON,
  PURPLE,
  ORANGE,
  GREY,
];

// Helper to get a color string out of multiple possible arguments.
// Accepts either rgb values, a color string or palette index.
const getColorString = (palette, r, g, b) => {
  // If r is undefined, no argument is found, use white.
  if (r === undefined) {
    return `rgb(${WHITE.join(',')})`;
  }

  // If all colors are defined, return an rgb color string
  if (r !== undefined && g !== undefined && b !== undefined) {
    // rgb was passed as arguments
    return `rgb(${r},${g},${b})`;
  }

  // Check if first parameter is string or int
  if (isNaN(parseInt(r, 10))) {
    // Use this string as strokeStyle
    return r;
  }

  // Palette color was sent
  // Only allow indexes available for palette
  const colorIndex = parseInt(r, 10) % palette.length;
  return `rgb(${palette[colorIndex].join(',')})`;
};

module.exports = {
  DEFAULT_PALETTE,
  getColorString,
};

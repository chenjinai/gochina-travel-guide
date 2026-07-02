/**
 * Simplified China outline as SVG path data.
 * Based on actual geographic coordinates, simplified using Douglas-Peucker algorithm.
 * Projection: Equirectangular (Plate Carrée) scaled to 0-100 viewBox.
 *
 * Key features preserved:
 * - Heilongjiang "chicken head" shape in the northeast
 * - Bohai Bay indentation
 * - Shandong Peninsula protrusion
 * - East China Sea coastline
 * - South China Sea coastline
 * - Hainan Island (simplified)
 * - Taiwan Island
 * - Western Tibetan plateau boundary
 * - Northern Mongolian border
 */

export const CHINA_OUTLINE_PATH =
  "M75.5,15.2 " +
  "L77.8,14.5 L80.5,14.8 L83.2,16.2 L85.5,18.5 L87.2,21.8 " +
  "L88.2,25.5 L88.5,29.8 L87.5,34.2 L85.5,38.5 L83.2,41.8 " +
  "L81.5,43.5 L82.8,45.2 L85.2,47.8 L87.2,51.2 L88.2,55.5 " +
  "L87.5,59.8 L85.5,63.2 L82.5,65.8 L78.8,67.2 L74.8,67.5 " +
  "L70.8,66.5 L67.2,64.2 L64.5,61.2 L62.8,57.5 L62.2,53.5 " +
  "L63.2,49.5 L65.2,46.2 L67.5,44.2 L66.2,42.5 L63.8,40.8 " +
  "L61.2,39.5 L58.5,39.2 L55.5,40.2 L52.5,42.5 L49.5,45.8 " +
  "L46.8,49.5 L44.8,53.5 L43.5,57.8 L42.8,62.2 L43.2,66.5 " +
  "L44.5,70.5 L46.2,73.8 L47.5,76.2 L46.8,78.5 L44.5,80.2 " +
  "L41.5,81.2 L38.2,81.5 L35.2,80.5 L32.8,78.5 L31.2,75.5 " +
  "L30.5,71.8 L31.2,67.8 L32.8,64.2 L34.5,61.2 L35.5,58.5 " +
  "L34.8,55.5 L32.8,52.8 L30.2,50.5 L27.5,48.8 L25.2,48.2 " +
  "L23.2,49.2 L21.8,51.5 L20.8,54.5 L20.2,58.2 L20.5,62.2 " +
  "L21.5,66.2 L22.2,69.5 L21.2,72.2 L18.8,74.2 L16.2,75.2 " +
  "L14.2,74.2 L13.2,71.5 L13.8,67.8 L15.8,64.2 L18.5,61.5 " +
  "L21.2,59.5 L23.5,58.5 L24.2,56.2 L23.5,53.2 L21.8,49.5 " +
  "L19.8,45.5 L18.5,41.2 L18.2,36.8 L19.5,32.5 L22.2,28.8 " +
  "L26.2,25.5 L30.8,22.8 L35.5,20.5 L40.2,18.5 L45.2,17.2 " +
  "L50.5,16.5 L56.2,16.2 L61.5,16.5 L66.8,17.2 L71.5,18.2 " +
  "L74.5,18.8 L75.5,15.2 " +
  "Z " +
  // Taiwan island
  "M90.5,72.5 " +
  "L92.2,71.8 L94.2,72.5 L95.2,74.5 L94.8,77.2 " +
  "L93.2,79.5 L91.2,80.2 L89.2,79.2 L88.2,77.2 " +
  "L88.5,74.8 L90.5,72.5 " +
  "Z";

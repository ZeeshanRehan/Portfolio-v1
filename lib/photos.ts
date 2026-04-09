export type PhotoItem = {
  id: string;
  src: string;
  alt: string;
  title: string;
  location: string;
  takenOn: string;
  description: string;
  aspect: "portrait" | "landscape" | "square";
};

export const photos: PhotoItem[] = [
  {
    id: "late-platform",
    src: "/photos/late-platform.svg",
    alt: "Train platform at night with soft overhead lights",
    title: "Late Platform",
    location: "Philadelphia",
    takenOn: "2026-03-12",
    description: "Cold light, empty space, and the kind of quiet that sharpens everything.",
    aspect: "portrait",
  },
  {
    id: "window-seat",
    src: "/photos/window-seat.svg",
    alt: "Window-lit table with a notebook and coffee",
    title: "Window Seat",
    location: "New Jersey",
    takenOn: "2026-02-03",
    description: "A small table, a notebook, and the part of the morning before people start performing.",
    aspect: "landscape",
  },
  {
    id: "brick-corner",
    src: "/photos/brick-corner.svg",
    alt: "Brick building corner in dim afternoon light",
    title: "Brick Corner",
    location: "Rowan",
    takenOn: "2026-01-18",
    description: "Mostly keeping this for the geometry. The light happened to cooperate.",
    aspect: "square",
  },
  {
    id: "crosswalk-after-rain",
    src: "/photos/crosswalk-after-rain.svg",
    alt: "Wet crosswalk with reflected city light",
    title: "After Rain",
    location: "Jersey City",
    takenOn: "2025-12-07",
    description: "Everything looks more cinematic right after the weather finishes making its point.",
    aspect: "portrait",
  },
  {
    id: "hallway-glow",
    src: "/photos/hallway-glow.svg",
    alt: "Narrow hallway with warm and cool light contrast",
    title: "Hallway Glow",
    location: "Glassboro",
    takenOn: "2025-11-21",
    description: "The kind of frame that works because the light is doing almost all of the actual work.",
    aspect: "landscape",
  },
  {
    id: "parking-lines",
    src: "/photos/parking-lines.svg",
    alt: "Parking lot markings with strong contrast",
    title: "Parking Lines",
    location: "South Jersey",
    takenOn: "2025-10-02",
    description: "Nothing dramatic. Just lines, space, and enough contrast to make it feel deliberate.",
    aspect: "square",
  },
];

"use client";

// Utility to play actual sound files from the public directory
function playSound(path: string) {
  if (typeof window === "undefined") return;
  
  const audio = new window.Audio(path);
  audio.play().catch((e) => {
    // Browser might block audio if the user hasn't interacted with the document yet
    console.warn("Audio playback was blocked:", e);
  });
}

export function playAddBlockSound() {
  playSound("/sounds/Pop.ogg.mp3");
}

export function playConnectSound() {
  playSound("/sounds/minecraft_click.mp3");
}

export function playDeleteBlockSound() {
  playSound("/sounds/delete.mp3");
}

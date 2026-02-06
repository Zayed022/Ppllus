import { Audio } from "expo-av";

export const preloadReel = async (url: string) => {
  try {
    await Audio.Sound.createAsync(
      { uri: url },
      { shouldPlay: false }
    );
  } catch {}
};

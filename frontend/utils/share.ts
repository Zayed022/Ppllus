import { Share } from "react-native";

export const openShareSheet = async (options: {
  message: string;
  url?: string;
}) => {
  return Share.share({
    message: options.url
      ? `${options.message}\n${options.url}`
      : options.message,
  });
};

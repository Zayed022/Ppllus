import fetch from "node-fetch";

export const sendPushNotification = async ({
  tokens,
  title,
  body,
  data,
}) => {
  if (!tokens?.length) return;

  const messages = tokens.map((token) => ({
    to: token,
    sound: "default",
    title,
    body,
    data,
  }));

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(messages),
  });
};

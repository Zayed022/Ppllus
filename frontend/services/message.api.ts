import api from "@/services/api";

export const getInbox = async () => {
  const res = await api.get("/message/inbox");
  return res.data;
};

export const getMessages = async (
  conversationId: string,
  cursor?: string
) => {
  const res = await api.get(`/message/${conversationId}`, {
    params: { cursor },
  });
  return res.data;
};

export const markConversationSeen = async (conversationId: string) => {
  await api.post(`/message/${conversationId}/seen`);
};

export const sendMessage = async (to: string, body: string) => {
  const res = await api.post("/message/send", { to, body });
  return res.data;
};

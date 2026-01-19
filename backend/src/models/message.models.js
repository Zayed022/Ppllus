const messageSchema = new mongoose.Schema(
    {
      conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        index: true,
      },
  
      senderId: {
        type: mongoose.Schema.Types.ObjectId,
        index: true,
      },
  
      body: {
        type: String,
        trim: true,
        maxlength: 4000,
      },
  
      media: {
        url: String,
        type: { type: String, enum: ["IMAGE", "VIDEO"] },
      },
  
      status: {
        type: String,
        enum: ["SENT", "DELIVERED", "SEEN"],
        default: "SENT",
        index: true,
      },
    },
    { timestamps: true }
  );
  
  // Cursor pagination
  messageSchema.index({ conversationId: 1, createdAt: -1 });
  
  export default mongoose.model("Message", messageSchema);
  
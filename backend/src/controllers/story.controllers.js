import Story from "../models/story.models.js";
import storyViewModels from "../models/storyView.models.js";

export const createStory = async (req, res) => {
  const { mediaUrl, mediaType, duration, city } = req.body;

  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const story = await Story.create({
    user: req.user.sub,
    mediaUrl,
    mediaType,
    duration,
    city,
    expiresAt,
  });

  res.status(201).json(story);
};

export const viewStory = async (req, res) => {
    const userId = req.user.sub;
    const { storyId } = req.params;
  
    try {
      await storyViewModels.create({
        story: storyId,
        viewer: userId,
      });
  
      await Story.findByIdAndUpdate(storyId, {
        $inc: { viewsCount: 1 },
      });
    } catch (err) {
      // ignore duplicate view
    }
  
    res.json({ status: "VIEW_RECORDED" });
  };
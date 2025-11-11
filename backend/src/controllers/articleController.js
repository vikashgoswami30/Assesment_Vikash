import Article from "../models/article.model.js";
import summarizeWithLLM from "../services/lllService.js";

export const createArticle = async (req, res) => {
  try {
    const { title, content, tags = [] } = req.body;
    const article = new Article({ title, content, tags, createdBy: req.user._id });
    await article.save();
    res.status(201).json(article);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllArticles = async (req, res) => {
  try {
    const { search, tag } = req.query;
    const q = {};
    if (search)
      q.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    if (tag) q.tags = tag;
    const articles = await Article.find(q)
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });
    res.json(articles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id).populate(
      "createdBy",
      "name email role"
    );
    if (!article) return res.status(404).json({ message: "Article not found" });
    res.json(article);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
export const updateArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: "Article not found" });

    // Allow editing if user is the creator or an admin
    if (
      article.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "You are not allowed to edit this article" });
    }

    const { title, content, tags } = req.body;
    if (title !== undefined) article.title = title;
    if (content !== undefined) article.content = content;
    if (tags !== undefined) article.tags = tags;

    await article.save();
    res.json({ message: "Article updated successfully", article });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


export const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    // Check ownership or admin
    if (
      article.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized to delete this article" });
    }

    await article.deleteOne();
    res.json({ message: "Article deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Server error deleting article" });
  }
};  

export const summarizeArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ summary: "Article not found" });
    }

    if (!article.content || !article.content.trim()) {
      return res.status(400).json({ summary: "No content available to summarize." });
    }

    let summary;
    try {
      summary = await summarizeWithLLM(article.content); // or llmService.summarize
    } catch (err) {
      console.error("OpenAI summarization error:", err);
      summary = "Summary not available at the moment.";
    }

    // Optional: Save summary to article document
    article.summary = summary;
    await article.save();

    return res.json({ summary, article });
  } catch (err) {
    console.error("Server error in summarizeArticle:", err);
    return res.status(500).json({ summary: "Failed to generate summary." });
  }
};


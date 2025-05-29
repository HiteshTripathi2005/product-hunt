import Comment from "../models/Comment.js";
import Product from "../models/Product.js";

export const getProductComments = async (req, res) => {
  try {
    const { productId } = req.params;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Get top-level comments (not replies)
    const comments = await Comment.find({
      product: productId,
      parentComment: null,
    })
      .populate("author", "name email avatar")
      .populate({
        path: "replies",
        populate: {
          path: "author",
          select: "name email avatar",
        },
      })
      .sort({ createdAt: 1 })
      .lean();

    res.status(200).json({
      success: true,
      data: {
        comments,
      },
    });
  } catch (error) {
    console.error("Get product comments error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching comments",
    });
  }
};

export const createComment = async (req, res) => {
  try {
    const { content, productId, parentCommentId } = req.body;

    // Validation
    if (!content || !productId) {
      return res.status(400).json({
        success: false,
        message: "Content and product ID are required",
      });
    }

    if (content.trim().length < 1) {
      return res.status(400).json({
        success: false,
        message: "Comment content cannot be empty",
      });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // If it's a reply, check if parent comment exists
    let parentComment = null;
    if (parentCommentId) {
      parentComment = await Comment.findById(parentCommentId);
      if (!parentComment) {
        return res.status(404).json({
          success: false,
          message: "Parent comment not found",
        });
      }

      // Ensure parent comment belongs to the same product
      if (parentComment.product.toString() !== productId) {
        return res.status(400).json({
          success: false,
          message: "Parent comment does not belong to this product",
        });
      }
    }

    // Create comment
    const comment = new Comment({
      content: content.trim(),
      author: req.user.id,
      product: productId,
      parentComment: parentCommentId || null,
    });

    await comment.save();

    // If it's a reply, add to parent's replies array
    if (parentComment) {
      parentComment.replies.push(comment._id);
      await parentComment.save();
    }

    // Populate the comment with author details
    await comment.populate("author", "name email avatar");

    res.status(201).json({
      success: true,
      message: "Comment created successfully",
      data: { comment },
    });
  } catch (error) {
    console.error("Create comment error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating comment",
    });
  }
};

export const getUserComments = async (req, res) => {
  try {
    const { userId } = req.params;

    // Get user's comments
    const comments = await Comment.find({ author: userId })
      .populate("author", "name email avatar")
      .populate("product", "name logo")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      data: {
        comments,
      },
    });
  } catch (error) {
    console.error("Get user comments error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching user comments",
    });
  }
};

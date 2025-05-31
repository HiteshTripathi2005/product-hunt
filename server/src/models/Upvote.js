import mongoose from "mongoose";

const upvoteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

upvoteSchema.index({ user: 1, product: 1 }, { unique: true });
upvoteSchema.index({ product: 1 });
upvoteSchema.index({ user: 1 });
upvoteSchema.index({ createdAt: -1 });

export default mongoose.model("Upvote", upvoteSchema);

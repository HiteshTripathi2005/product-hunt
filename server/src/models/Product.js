import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    tagline: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    websiteUrl: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    category: {
      type: String,
      required: true,
      enum: [
        "AI",
        "SaaS",
        "Devtools",
        "Productivity",
        "Design",
        "Marketing",
        "Finance",
        "Education",
        "Health",
        "Gaming",
        "Other",
      ],
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    upvoteCount: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved",
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index({ category: 1 });
productSchema.index({ upvoteCount: -1 });
productSchema.index({ createdAt: -1 });

productSchema.virtual("upvotes", {
  ref: "Upvote",
  localField: "_id",
  foreignField: "product",
});

productSchema.set("toJSON", { virtuals: true });
productSchema.set("toObject", { virtuals: true });

productSchema.path("images").validate(function (value) {
  return value && value.length > 0;
}, "At least one product image is required");

export default mongoose.model("Product", productSchema);

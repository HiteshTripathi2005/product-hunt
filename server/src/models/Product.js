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
    upvotes: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
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

// Index for better performance
productSchema.index({ category: 1 });
productSchema.index({ upvoteCount: -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ "upvotes.user": 1 });

// Update upvote count when upvotes array changes
productSchema.pre("save", function (next) {
  this.upvoteCount = this.upvotes.length;
  next();
});

// Validate that at least one image is provided
productSchema.path("images").validate(function (value) {
  return value && value.length > 0;
}, "At least one product image is required");

export default mongoose.model("Product", productSchema);

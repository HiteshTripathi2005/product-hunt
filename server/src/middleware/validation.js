export const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = [];

  if (!name || name.trim().length < 2) {
    errors.push("Name must be at least 2 characters long");
  }
  if (name && name.length > 50) {
    errors.push("Name must be less than 50 characters");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push("Please provide a valid email address");
  }

  if (!password || password.length < 6) {
    errors.push("Password must be at least 6 characters long");
  }
  if (password && password.length > 128) {
    errors.push("Password must be less than 128 characters");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  next();
};

export const validateProduct = (req, res, next) => {
  const { name, tagline, description, websiteUrl, category } = req.body;
  const errors = [];

  if (!name || name.trim().length < 2) {
    errors.push("Product name must be at least 2 characters long");
  }
  if (name && name.length > 100) {
    errors.push("Product name must be less than 100 characters");
  }

  if (!tagline || tagline.trim().length < 5) {
    errors.push("Tagline must be at least 5 characters long");
  }
  if (tagline && tagline.length > 200) {
    errors.push("Tagline must be less than 200 characters");
  }

  if (!description || description.trim().length < 10) {
    errors.push("Description must be at least 10 characters long");
  }
  if (description && description.length > 1000) {
    errors.push("Description must be less than 1000 characters");
  }

  const validCategories = [
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
  ];
  if (!category || !validCategories.includes(category)) {
    errors.push(`Category must be one of: ${validCategories.join(", ")}`);
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  next();
};

export const validateComment = (req, res, next) => {
  const { content, productId } = req.body;
  const errors = [];

  if (!content || content.trim().length < 1) {
    errors.push("Comment content cannot be empty");
  }
  if (content && content.length > 500) {
    errors.push("Comment must be less than 500 characters");
  }

  if (!productId) {
    errors.push("Product ID is required");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  next();
};

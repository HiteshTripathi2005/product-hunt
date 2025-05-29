import "dotenv/config";
import app from "./app.js";
import connectDb from "./db/connectDB.js";

const PORT = process.env.PORT || 3000;

connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

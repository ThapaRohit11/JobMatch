import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import { errorHandler, notFound } from "./src/middleware/errorMiddleware.js";
import seedAdmin from "./src/utils/seedAdmin.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4200;

await connectDB();
await seedAdmin();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

app.get("/server", (req, res) => {
  return res.json({
    status: 200,
    server: "jobmatch-backend",
  });
});

app.use("/api/auth", authRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});

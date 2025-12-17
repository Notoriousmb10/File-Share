import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db";
import authRoutes from "./routes/auth.routes";
import fileRoutes from "./routes/file.routes";
import { viewFile } from "./controllers/file.controllers";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

connectDB();

app.use("/auth", authRoutes);
app.use("/files", fileRoutes);

app.get("/view-file/:shareId", viewFile);

app.get("/api", (req, res) => {
  res.send("File Share API is running");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;

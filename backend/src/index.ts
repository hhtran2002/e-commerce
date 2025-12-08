import express from "express";
import cors from "cors";
import { AppDataSource } from "./config/data_source";
import productRoutes from "./route/ProductRoute";
import passwordRoutes from "./route/passwordRoute";
import authRoutes from "./route/AuthRoute";
import { takeListUserRoutes } from "./route/TakeListUserRoute";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/password", passwordRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", takeListUserRoutes);

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected!");

    app.listen(3000, () => {
      console.log("Server running at http://localhost:3000");
    });
  })
  .catch((err) => console.log(err));

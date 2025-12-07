import express from "express";
import cors from "cors";
import { AppDataSource } from "./config/data_source";
import productRoutes from "./route/ProductRoute";
import categoryRoutes from "./route/CategoryRoute";
import uploadRoutes from "./route/UploadRoute";
import CartRoute from "./route/CartRoute";
import OrderRoute from "./route/OrderRoute";
import passwordRoutes from "./route/passwordRoute";
import authRoutes from "./route/AuthRoute";


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);   
app.use("/api/upload", uploadRoutes);
app.use("/api/cart", CartRoute);
app.use("/api/orders", OrderRoute);
app.use("/api/password", passwordRoutes);
app.use("/api/auth", authRoutes);


AppDataSource.initialize()
  .then(() => {
    console.log("Database connected!");

    app.listen(3000, () => {
      console.log("Server running at http://localhost:3000");
    });
  })
  .catch((err) => console.log(err));

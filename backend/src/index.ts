import express from "express";
import cors from "cors";
import { AppDataSource } from "./config/data_source";
import productRoutes from "./route/ProductRoute";
import categoryRoutes from "./route/CategoryRoute";
import uploadRoutes from "./route/UploadRoute";
import CartRoute from "./route/CartRoute";
import OrderRoute from "./route/OrderRoute";
import AdminOrderRoute from "./route/AdminOrderRoute";
import passwordRoutes from "./route/passwordRoute";
import authRoutes from "./route/AuthRoute";
import addressRoutes from "./route/AddressRoute";
import { takeListUserRoutes } from "./route/TakeListUserRoute";
import chatbotRoutes from "./route/ChatbotRoute";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/cart", CartRoute);
app.use("/api/orders", OrderRoute);
app.use("/admin/api/orders", AdminOrderRoute);
app.use("/api/password", passwordRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/users", takeListUserRoutes);
app.use("/api/chatbot", chatbotRoutes);

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected!");

    app.listen(3000, () => {
      console.log("Server running at http://localhost:3000");
    });
  })
  .catch((err) => console.log(err));

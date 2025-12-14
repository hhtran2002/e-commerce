// backend/config/data-source.ts
import "reflect-metadata";
import { DataSource } from "typeorm";
import { config as dotenvConfig } from "dotenv";
dotenvConfig();

// helper: bắt buộc có biến môi trường
function mustGet(key: string): string {
  const v = process.env[key];
  if (!v) throw new Error(`Missing required env: ${key}`);
  return v;
}

const ENV = {
  HOST: process.env.DB_HOST ?? "localhost",
  PORT: parseInt(process.env.DB_PORT ?? "1433", 10),
  USERNAME: mustGet("DB_USERNAME"),
  PASSWORD: mustGet("DB_PASSWORD"),
  DBNAME: mustGet("DB_NAME"),
  ENCRYPT: (process.env.DB_ENCRYPT ?? "false") === "true",
  TRUST_CERT: (process.env.DB_TRUST_SERVER_CERTIFICATE ?? "true") === "true",
  INSTANCE_NAME: process.env.INSTANCE_NAME,
};

// === import entities của bạn ===
import { User } from "../entity/User";
import { Role } from "../entity/Role";
import { UserAddress } from "../entity/UserAddress";
import { Category } from "../entity/Category";
import { Color } from "../entity/Color";
import { Image } from "../entity/Image";
import { Size } from "../entity/Size";
import { Product } from "../entity/Product";
import { ProductItem } from "../entity/ProductItem";
import { Cart } from "../entity/Cart";
import { CartItem } from "../entity/CartItem";
import { Order } from "../entity/Order";
import { OrderItem } from "../entity/OrderItem";
import { Payment } from "../entity/Payment";
import { Promotion } from "../entity/Promotion";
import { ShippingMethod } from "../entity/ShippingMethod";
import { Review } from "../entity/Review";
import { Conversation } from "../entity/CBConversation";
import { Message } from "../entity/CBMessage";
import { FAQ } from "../entity/CBFAQ";
import { AILog } from "../entity/CBAILog"; // đổi theo tên file thật

export const AppDataSource = new DataSource({
  type: "mssql",
  host: ENV.HOST, // đã là string, không còn undefined
  port: ENV.PORT,
  username: ENV.USERNAME,
  password: ENV.PASSWORD,
  database: ENV.DBNAME,
  //synchronize: false, // disabled to avoid altering existing schema automatically
  // --- QUAN TRỌNG: Cấu hình đồng bộ ---
  synchronize: true,  // Tự động sửa bảng cho khớp với code (Add cột, sửa cột...)
  dropSchema: false,   // <--- THÊM DÒNG NÀY: Xóa sạch dữ liệu cũ mỗi khi chạy lại server
  // ------------------------------------
  logging: false,
  entities: [
    User,
    Role,
    UserAddress,
    Category,
    Color,
    Image,
    Size,
    Product,
    ProductItem,
    Cart,
    CartItem,
    Order,
    OrderItem,
    Payment,
    Promotion,
    ShippingMethod,
    Review,
    Conversation,
    Message,
    FAQ,
    AILog,
  ],
  migrations: [],
  subscribers: [],
  options: {
    encrypt: ENV.ENCRYPT,
    trustServerCertificate: ENV.TRUST_CERT,
    // instanceName: ENV.INSTANCE_NAME,
  },
  // extra: { instanceName: ENV.INSTANCE_NAME }, // một số phiên bản mssql dùng extra
});

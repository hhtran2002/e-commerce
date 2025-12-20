import { DataSource } from "typeorm";
import { GoogleGenerativeAI } from "@google/generative-ai";

export class ChatbotService {
    private db: DataSource;
    private genAI: GoogleGenerativeAI;
    private model: any;

    constructor(dataSource: DataSource) {
        this.db = dataSource;

        // Kiểm tra API Key
        if (!process.env.GEMINI_API_KEy) {
            throw new Error("Chưa cấu hình GEMINI_API_KEy trong file .env");
        }

        // 1. Khởi tạo trực tiếp SDK Google (Bỏ qua LangChain)
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEy);

        // 2. Chọn Model mới nhất và ổn định nhất hiện nay: gemini-1.5-flash
        this.model = this.genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    }

    // Hàm thực thi SQL an toàn (giữ nguyên)
    async executeQuery(query: string): Promise<string> {
        try {
            if (!query.trim().toUpperCase().startsWith("SELECT")) {
                return "Lỗi: Chỉ được phép thực hiện câu lệnh SELECT.";
            }
            const result = await this.db.query(query);
            // Giới hạn kết quả trả về để tránh quá tải token
            return JSON.stringify(result).slice(0, 4000);
        } catch (error: any) {
            return `Lỗi SQL: ${error.message}`;
        }
    }

    async chat(userQuestion: string): Promise<string> {
        // Schema Database
        const dbSchema = `
      Bạn là chuyên gia SQL Server. Dưới đây là cấu trúc các bảng thực tế trong Database:

      1. Bảng "products" (Sản phẩm)
      - id (int, Primary Key)
      - name (nvarchar, tên sản phẩm)
      - description (text, mô tả sản phẩm)
      - price (decimal, giá tiền)
      - stockQuantity (int, số lượng tồn kho)
      - categoryId (int, Foreign Key -> liên kết với bảng categories.id)
      - createdAt (datetime, ngày tạo)
      - updateAt (datetime, ngày cập nhật)

      2. Bảng "categories" (Danh mục)
      - id (int, Primary Key)
      - name (nvarchar, tên danh mục, ví dụ: Áo, Quần)
      - description (text, mô tả danh mục)
      - parentId (int, Foreign Key -> liên kết với categories.id để phân cấp danh mục cha/con)

      3. Bảng "colors" (Màu sắc)
      - id (int, Primary Key)
      - name (nvarchar, tên màu: Xanh, Đỏ...)
      - colorCode (nvarchar, mã màu: #FF0000...)

      4. Bảng "sizes" (Kích thước)
      - id (int, Primary Key)
      - name (nvarchar, tên size: S, M, L, XL...)

      Quy tắc JOIN (Rất quan trọng):
      - Khi cần lấy tên Category của Product, hãy dùng: JOIN categories ON products.categoryId = categories.id
      - Bảng colors và sizes thường liên kết qua bảng trung gian (ProductItem) nhưng hiện tại hãy tập trung query thông tin bảng products trước.
    `;

        // Prompt 1: Sinh SQL
        const prompt1 = `
      Bạn là chuyên gia SQL Server. 
      Schema: ${dbSchema}
      Câu hỏi: "${userQuestion}"
      
      Yêu cầu: Chỉ trả về duy nhất 1 câu lệnh SQL SELECT để lấy dữ liệu trả lời câu hỏi trên. 
      Không giải thích, không markdown (bỏ dấu \`\`\`sql).
    `;

        try {
            // Gọi Gemini lần 1
            const result1 = await this.model.generateContent(prompt1);
            const response1 = result1.response;
            let sqlQuery = response1.text().replace(/```sql|```/g, "").trim();

            console.log("LOG: SQL sinh ra:", sqlQuery);

            // Chạy SQL
            const data = await this.executeQuery(sqlQuery);

            // Prompt 2: Tổng hợp kết quả
            const prompt2 = `
        Câu hỏi: "${userQuestion}"
        Dữ liệu tìm được từ DB: ${data}
        
        Hãy trả lời người dùng ngắn gọn, thân thiện bằng tiếng Việt dựa trên dữ liệu trên.
      `;

            // Gọi Gemini lần 2
            const result2 = await this.model.generateContent(prompt2);
            const response2 = result2.response;

            return response2.text();

        } catch (error: any) {
            console.error("Lỗi Gemini:", error);
            return "Xin lỗi, hiện tại tôi đang gặp sự cố kết nối với AI.";
        }
    }
}
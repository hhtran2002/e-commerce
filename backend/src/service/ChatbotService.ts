import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

export class ChatbotService {
    private genAI: GoogleGenerativeAI;
    private model: any;
    private embeddingModel: any;

    constructor() {
        const apiKey = process.env.GEMINI_API_KEY || "";
        this.genAI = new GoogleGenerativeAI(apiKey);

        // Model Chat
        this.model = this.genAI.getGenerativeModel({
            model: "gemini-2.0-flash-001",
            generationConfig: { responseMimeType: "application/json" }
        });

        // Model Embedding
        this.embeddingModel = this.genAI.getGenerativeModel({
            model: "text-embedding-004"
        });
    }

    // 1. Extract Intent (Giữ nguyên)
    async extractSearchIntent(userMessage: string): Promise<any> {
        const prompt = `
        Phân tích câu tìm kiếm: "${userMessage}"
        Trả về JSON với các trường: keyword, colorName, sizeName.
        Nếu không có thì để null.
        `;
        try {
            const result = await this.model.generateContent(prompt);
            return JSON.parse(result.response.text());
        } catch (e) {
            return {};
        }
    }

    // 2. Create Embedding (Giữ nguyên)
    async createEmbedding(text: string): Promise<number[]> {
        try {
            const result = await this.embeddingModel.embedContent(text);
            return result.embedding.values;
        } catch (error) {
            return [];
        }
    }

    // 3. Generate Response (ĐÂY LÀ PHẦN SỬA ĐỔI QUAN TRỌNG)
    async generateResponse(userMessage: string, products: any[]) {
        // Chuyển model về text mode
        const chatModel = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });

        let contextData = "";

        if (!products || products.length === 0) {
            contextData = "KHÔNG TÌM THẤY SẢN PHẨM NÀO TRONG HỆ THỐNG.";
        } else {
            // --- LOGIC MỚI: DUYỆT QUA MẢNG ITEMS ĐỂ LẤY MÀU VÀ SIZE ---
            contextData = products.map((p, index) => {
                let colorList = "Chưa cập nhật";
                let sizeList = "Chưa cập nhật";

                // Kiểm tra xem sản phẩm có danh sách items (biến thể) không
                if (p.items && Array.isArray(p.items) && p.items.length > 0) {
                    // Lấy tất cả tên màu từ các items
                    const allColors = p.items.map((i: any) => i.color?.name).filter((name: any) => name);
                    // Dùng Set để loại bỏ màu trùng lặp (VD: 3 cái áo Đen -> chỉ lấy 1 chữ Đen)
                    const uniqueColors = [...new Set(allColors)];
                    if (uniqueColors.length > 0) colorList = uniqueColors.join(", ");

                    // Lấy tất cả tên size
                    const allSizes = p.items.map((i: any) => i.size?.name).filter((name: any) => name);
                    const uniqueSizes = [...new Set(allSizes)];
                    if (uniqueSizes.length > 0) sizeList = uniqueSizes.join(", ");
                }

                const priceFormatted = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(p.price));

                // Tạo đoạn văn bản mô tả chính xác cho AI
                return `Sản phẩm số ${index + 1}:
                 - Tên: ${p.name}
                 - Giá bán: ${priceFormatted}
                 - CÁC MÀU CÓ SẴN: [${colorList}]
                 - CÁC SIZE CÓ SẴN: [${sizeList}]
                 - Mô tả: ${p.description || "Không có mô tả"}`;
            }).join("\n--------------------------------\n");
        }

        const prompt = `
        Bạn là trợ lý bán hàng ảo.
        Dưới đây là DỮ LIỆU THỰC TẾ TỪ KHO HÀNG (Thông tin chính xác 100%):
        ==============================
        ${contextData}
        ==============================

        Câu hỏi của khách: "${userMessage}"

        YÊU CẦU TRẢ LỜI:
        1. Đọc kỹ mục "CÁC MÀU CÓ SẴN" và "CÁC SIZE CÓ SẴN" của từng sản phẩm.
        2. Nếu khách hỏi màu/size cụ thể:
           - Nếu trong danh sách CÓ màu/size đó -> Báo giá và xác nhận có hàng.
           - Nếu trong danh sách KHÔNG có (hoặc ghi là Chưa cập nhật) -> Xin lỗi và báo rõ các màu/size shop đang có.
        3. Tuyệt đối KHÔNG BỊA RA màu sắc hoặc size không nằm trong dấu ngoặc [ ].
        4. Trả lời ngắn gọn, thân thiện.
        5. không được tự ý thêm thông tin không có trong dữ liệu kho hàng.
        6. Không cần trả lời id sản phẩm.
        `;

        try {
            const result = await chatModel.generateContent(prompt);
            return result.response.text();
        } catch (error) {
            console.error(error);
            return "Xin lỗi, hệ thống đang bận. Bạn thử lại sau nhé!";
        }
    }
}
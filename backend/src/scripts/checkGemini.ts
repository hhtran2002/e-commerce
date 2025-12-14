// src/scripts/checkGemini.ts
import dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "AIzaSyBtTKNs4ExmLN0M0jjx_JMXuD-IrU7SeqI";

if (!API_KEY) {
    console.error("❌ Chưa tìm thấy API KEY trong file .env");
    process.exit(1);
}

async function listModels() {
    console.log("🔄 Đang kết nối tới Google API để lấy danh sách model...");
    try {
        // Gọi trực tiếp API REST của Google để tránh lỗi SDK cũ
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
        const data = await response.json();

        if (data.error) {
            console.error("❌ Lỗi API:", data.error.message);
            return;
        }

        console.log("✅ Danh sách các model bạn có thể dùng:");
        console.log("------------------------------------------------");

        // Lọc ra các model hỗ trợ generateContent
        const availableModels = data.models.filter((m: any) =>
            m.supportedGenerationMethods.includes("generateContent")
        );

        availableModels.forEach((m: any) => {
            console.log(`- Tên: ${m.name.replace("models/", "")}`); // In ra tên ngắn gọn
            console.log(`  Mô tả: ${m.displayName}`);
        });
        console.log("------------------------------------------------");
        console.log("💡 HÃY COPY TÊN MODEL Ở TRÊN VÀO FILE ChatbotService.ts");

    } catch (error) {
        console.error("❌ Lỗi kết nối:", error);
    }
}

listModels();
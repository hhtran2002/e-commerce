import { Response, Request } from "express";
import { ProductService } from "../service/ProductService";
import { ChatbotService } from "../service/ChatbotService";

export class ChatbotController {
    private chatbotService = new ChatbotService();
    private productService = new ProductService();

    chat = async (req: Request, res: Response) => {
        try {
            const { message } = req.body;
            if (!message || message.trim() === "") {
                return res.status(400).json({ error: "Message is required" });
            }
            // 1. Hieu y dinh va chinh sua loi chinh ta
            const criteria = await this.chatbotService.extractSearchIntent(message);

            // 2. Tao vector embeddinh cho tim kiem
            const queryVector = await this.chatbotService.createEmbedding(message);

            // 3. Hybrid search
            let products = await this.productService.searchHybrid({
                ...criteria,
                userQueryEmbedding: queryVector,
            })

            const limit = 1;
            products = products.slice(0, limit);

            // 4. Sinh cau tra loi
            const responseText = await this.chatbotService.generateResponse(message, products);

            return res.json({ responseText, products });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Server Error" });
        };
    }

}
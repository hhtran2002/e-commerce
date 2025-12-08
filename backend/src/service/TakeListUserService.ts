import { AppDataSource } from "../config/data_source";
import { User } from "../entity/User";

export class TakeListUserService {
    private userRepository = AppDataSource.getRepository(User);

    async getAllUsers() {
        const users = await this.userRepository.find({
            select: {
                id: true,
                fullName: true,
                email: true,
                createdAt: true,
            },
            order: {
                createdAt: "DESC",
            }
        });
        return users;
    }
}
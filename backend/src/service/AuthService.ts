import { AppDataSource } from "../config/data_source";  
import { User } from "../entity/User";
import { Role } from "../entity/Role"; 
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import * as crypto from "crypto";

export class AuthService {
    private userRepository = AppDataSource.getRepository(User);
    private roleRepository = AppDataSource.getRepository(Role);

    //-- Chức năng đăng ký --
    async register(data: any) {
        const {userName, email, password, phone, fullName} = data;

        // 1. Kiểm tra email hoặc số điện thoại đã tồn tại chưa
        const existingUser = await this.userRepository.findOne({
            where: [
                {email: email},
                {phone: phone}
            ]
        });

        if (existingUser) {
            throw new Error("Email hoặc số điện thoại đã được sử dụng");
        }

        // 2. Tìm Role 'USER' để cấu hình mặc định cho người dùng mới
        const userRole = await this.roleRepository.findOneBy({name: 'USER'});
        if (!userRole) {
            throw new Error("Role USER không tồn tại trong hệ thống");
        }

        // 3. Mã hóa mật khẩu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Tạo User mới
        const newUser =  new User();
        newUser.userName = userName;
        newUser.email = email;
        newUser.phone = phone;
        newUser.fullName = fullName;
        newUser.hashPassword = hashedPassword; // Gán mật khẩu đã mã hóa
        newUser.role = userRole; // Gán quan hệ với Role

        // 5. Lưu User vào database
        return await this.userRepository.save(newUser);
    }

    // -- Chức năng đăng nhập --
    async login(data: any) {
        const {email, password} = data;

        // 1. Tìm user theo email, kèm theo thông tin về role
        const user = await this.userRepository.findOne({
            where: {email},
            relations: ["role"]
        });

        if (!user) {
            throw new Error("Email hoặc mật khẩu không đúng");
        }

        // 2. So sánh mật khẩu vừa nhập với mật khẩu đã mã hóa trong database
        const isMatch = await bcrypt.compare(password, user.hashPassword);
        if (!isMatch) {
            throw new Error("Email hoặc mật khẩu không đúng");
        }

        // 3. Tạo token JWT chứa thông tin về Id, email, role 
        const tokenPayload = jwt.sign({
            userId : user.id,
            email: user.email,
            role: user.role.name
        },
        process.env.JWT_SECRET || "default_secret_key", // default key nếu không có biến môi trường, được lưu trong .env
        {expiresIn: '1h'} // Token có hạn trong 1 giờ
        );

        // 4. Trả về token và thông tin user (không bao gồm mật khẩu)
        const {hashPassword, ...userInfo} = user;
        return {
            message: "Đăng nhập thành công",
            token: tokenPayload,
            user: userInfo
        }
    }

    // -- Yêu cầu reset mật khẩu --
    async forgotPassword(email: string) {
        const user = await this.userRepository.findOneBy({ email });;
        if (!user) {
            throw new Error("Email không tồn tại trong hệ thống");
        }

        // Tạo token reset ngẫu nhiên
        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenExpiry = new Date(); // Thời gian hết hạn của token
        resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1); // Token có hạn trong 1 giờ

        // Cập nhật token và thời gian hết hạn vào user
        user.resetToken = resetToken;
        user.resetTokenExpiry = resetTokenExpiry;
        await this.userRepository.save(user);
        
        // TODO: Gửi email chứa link reset pass
        // const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;
        // await sendEmail(email, "Đặt lại mật khẩu", resetLink);
        console.log(`Debug Token cho ${email}: ${resetToken}`); // Tạm thời in ra để test
        return resetToken;
    };

    // -- Đặt lại mật khẩu --
    async requestResetPassword(token: string, newPassword: string) {
        // Tìm user theo token và kiểm tra token còn hạn không
        const user = await this.userRepository.findOne({where: {resetToken: token}});

        if (!user) throw new Error("Token không hợp lệ");

        // Kiểm tra tọken có còn thời gian không
        if (!user.resetTokenExpiry || user.resetTokenExpiry < new Date()) { 
            throw new Error("Token đã hết hạn");
        }

        // Mã hóa mật khẩu mới
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Cập nhật mật khẩu mới và xóa token reset
        user.hashPassword = hashedPassword;
        user.resetToken = null as any;
        user.resetTokenExpiry = null as any;
        await this.userRepository.save(user);
        return {message: "Đặt lại mật khẩu thành công"};
    };
}
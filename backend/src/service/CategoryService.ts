import { AppDataSource } from "../config/data_source";
import { Category } from "../entity/Category";

export class CategoryService {
  private categoryRepo = AppDataSource.getRepository(Category);

  // Lấy tất cả category
  async getAll() {
    return this.categoryRepo.find({
      relations: ["parent"], // nếu không cần parent thì bỏ relations
      order: { id: "ASC" },
    });
  }

  // Lấy 1 category theo id
  async getById(id: number) {
    return this.categoryRepo.findOne({
      where: { id },
      relations: ["parent"],
    });
  }

  // Tạo mới
  async create(data: { name: string; description?: string; parentId?: number | null }) {
    const cat = new Category();
    cat.name = data.name;
    cat.description = data.description ?? null;

    if (data.parentId) {
      cat.parent = { id: data.parentId } as any;
    }

    return this.categoryRepo.save(cat);
  }

  // Cập nhật
  async update(
    id: number,
    data: { name?: string; description?: string; parentId?: number | null }
  ) {
    const cat = await this.categoryRepo.findOne({ where: { id } });
    if (!cat) return null;

    if (data.name !== undefined) cat.name = data.name;
    if (data.description !== undefined) cat.description = data.description ?? null;

    if (data.parentId !== undefined) {
      cat.parent = data.parentId ? ({ id: data.parentId } as any) : null;
    }

    return this.categoryRepo.save(cat);
  }

  // Xoá
  async delete(id: number) {
    await this.categoryRepo.delete(id);
  }
}

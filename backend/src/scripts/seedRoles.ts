import { AppDataSource } from "../config/data_source";
import { Role } from "../entity/Role";

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log("DataSource initialized for seeding roles");

    const roleRepo = AppDataSource.getRepository(Role);

    const roles = ["USER", "ADMIN"];

    for (const name of roles) {
      const existing = await roleRepo.findOneBy({ name });
      if (!existing) {
        const r = new Role();
        r.name = name;
        await roleRepo.save(r);
        console.log(`Created role: ${name}`);
      } else {
        console.log(`Role exists: ${name}`);
      }
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();

import { db } from "../../db/index";
import { users } from "../../../drizzle/schema";
import { eq } from "drizzle-orm";

export class UserService {
  static async createUser(data: { phoneNumber: string; username: string }) {
    const [user] = await db.insert(users).values(data).returning();
    return user;
  }

  static async getUserById(id: number) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  static async getAllUsers() {
    return db.select().from(users);
  }

  static async updateUser(id: number, data: Partial<{ phoneNumber: string; username: string }>) {
    const [user] = await db.update(users).set(data).where(eq(users.id, id)).returning();
    return user;
  }

  static async deleteUser(id: number) {
    await db.delete(users).where(eq(users.id, id));
    return { success: true };
  }
}
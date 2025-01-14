import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sql from "../db";

export class AuthService {
  async register(email: string, password: string) {
    try {
      const passwordHash = await bcrypt.hash(password, 10);

      const [user] = await sql`
         INSERT INTO users (email, password_hash, balance)
         VALUES (${email}, ${passwordHash}, 100)
         RETURNING id, email, balance
       `;
      return user;
    } catch (error) {
      console.log("Error registering user:", error);
      throw error;
    }
  }

  async login(email: string, password: string) {
    const [user] = await sql`SELECT * FROM users WHERE email = ${email}`;
    if (!user) throw new Error("User not found");

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) throw new Error("Invalid credentials");

    // Generate a real JWT with user ID, etc.
    const token = jwt.sign({ id: user.id }, "secretSuper", { expiresIn: "1h" });
    await sql`UPDATE users SET auth_token = ${token} WHERE id = ${user.id}`;

    return { auth_token: token };
  }

  async changePassword(
    userId: number,
    oldPassword: string,
    newPassword: string,
  ) {
    try {
      const [user] = await sql`SELECT * FROM users WHERE id = ${userId}`;
      if (!user) {
        throw new Error("User not found");
      }

      const match = await bcrypt.compare(oldPassword, user.password_hash);
      if (!match) {
        throw new Error("Old password is incorrect");
      }

      const newHash = await bcrypt.hash(newPassword, 10);
      await sql`UPDATE users SET password_hash = ${newHash} WHERE id = ${userId}`;
    } catch (error) {
      console.log("Error changing password:", error);
      throw error;
    }
  }
}

import sql from "../db";

export class PurchaseService {
  async getProducts() {
    return sql`SELECT * FROM products`;
  }

  async buyProduct(userId: number, productId: number) {
    try {
      const [user] = await sql`SELECT * FROM users WHERE id = ${userId}`;
      const [product] =
        await sql`SELECT * FROM products WHERE id = ${productId}`;

      if (!user) throw new Error("User not found");
      if (!product) throw new Error("Product not found");
      if (user.balance < product.price) throw new Error("Insufficient balance");

      const newBalance = user.balance - product.price;

      await sql.begin(async (tx) => {
        await tx`UPDATE users SET balance = ${newBalance} WHERE id = ${user.id}`;
        await tx`INSERT INTO purchases (user_id, product_id) VALUES (${user.id}, ${product.id})`;
      });

      return { message: "Purchase successful", newBalance };
    } catch (error) {
      console.error("Error during purchase:", error);

      throw new Error(
        "An error occurred during the purchase process. Please try again later.",
      );
    }
  }
}

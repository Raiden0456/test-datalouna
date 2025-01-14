import { Request, Response, Router } from "express";
import { PurchaseDto } from "../dtos/purchase.dto";
import { authenticateToken, validateDto } from "../middleware/auth.middleware";
import { PurchaseService } from "../services/purchases.service";
import { AuthRequest } from "../types/auth.types";

const router = Router();
const purchaseService = new PurchaseService();

/**
 * @swagger
 * tags:
 *   name: Purchases
 *   description: Покупки товаров
 */

/**
 * @swagger
 * /purchases/buy:
 *   post:
 *     summary: Покупка товара
 *     tags: [Purchases]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PurchaseDto'
 *     responses:
 *       200:
 *         description: Покупка успешна
 *       400:
 *         description: Недостаточно средств или товар не найден
 */
router.post(
  "/buy",
  authenticateToken,
  validateDto(PurchaseDto),
  async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.auth!.id;
      const { productId } = req.body;
      const result = await purchaseService.buyProduct(userId, productId);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: "Internal Server Error" });
    }
  },
);

/**
 * @swagger
 * /purchases/products:
 *   get:
 *     summary: Получение списка товаров
 *     tags: [Purchases]
 *     responses:
 *       200:
 *         description: Список товаров успешно получен
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.get("/products", async (req: Request, res: Response) => {
  try {
    const products = await purchaseService.getProducts();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;

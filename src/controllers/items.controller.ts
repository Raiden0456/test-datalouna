import { Request, Response, Router } from "express";
import { ItemService } from "../services/items.service";

const router = Router();
const itemService = new ItemService();

/**
 * @swagger
 * tags:
 *   name: Items
 *   description: Fetch items with pricing information
 */

/**
 * @swagger
 * /items/getAll:
 *   get:
 *     summary: Get all items with tradable and non-tradable prices
 *     tags: [Items]
 *     responses:
 *       200:
 *         description: List of items retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   minTradablePrice:
 *                     type: number
 *                   minNonTradablePrice:
 *                     type: number
 *       500:
 *         description: Internal server error
 */
router.get("/getAll", async (_req: Request, res: Response) => {
  try {
    const items = await itemService.getItems();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Errored" });
  }
});

export default router;

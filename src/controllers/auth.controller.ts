import { Request, Response, Router } from "express";
import { ChangePasswordDto, LoginDto, RegisterDto } from "../dtos/auth.dto";
import { authenticateToken, validateDto } from "../middleware/auth.middleware";
import { AuthService } from "../services/auth.service";
import { AuthRequest } from "../types/auth.types";

const router = Router();
const authService = new AuthService();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterDto'
 *     responses:
 *       201:
 *         description: User successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 email:
 *                   type: string
 *       400:
 *         description: Invalid input
 */
router.post(
  "/register",
  validateDto(RegisterDto),
  async (req: Request, res: Response) => {
    try {
      const user = await authService.register(
        req.body.email,
        req.body.password,
      );
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ message: "Errored" });
    }
  },
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginDto'
 *     responses:
 *       200:
 *         description: Successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 auth_token:
 *                   type: string
 *       401:
 *         description: Invalid credentials
 */
router.post(
  "/login",
  validateDto(LoginDto),
  async (req: Request, res: Response) => {
    try {
      const token = await authService.login(req.body.email, req.body.password);
      res.status(200).json(token);
    } catch (error) {
      res.status(401).json({ message: "Errored" });
    }
  },
);

/**
 * @swagger
 * /auth/change-password:
 *   post:
 *     summary: Change user password
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangePasswordDto'
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Invalid request
 */
router.post(
  "/change-password",
  authenticateToken,
  validateDto(ChangePasswordDto),
  async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.auth!.id;
      await authService.changePassword(
        userId,
        req.body.oldPassword,
        req.body.newPassword,
      );
      res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
      res.status(400).json({ message: "Errored" });
    }
  },
);

export default router;

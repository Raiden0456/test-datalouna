import { Request } from "express";

export interface AuthRequest extends Request {
  auth?: {
    id: number;
  };
}

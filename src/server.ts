import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";

import authController from "./controllers/auth.controller";
import itemsController from "./controllers/items.controller";
import purchasesController from "./controllers/purchases.controller";
import { setupSwagger } from "./swagger";

export const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(helmet());

setupSwagger(app);

app.use("/auth", authController);
app.use("/purchases", purchasesController);
app.use("/items", itemsController);

app.get("/", (_req, res) => {
  res.status(200).send("Server is running 🚀");
});

app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error("Error:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  },
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server started on http://localhost:${PORT}`);
});

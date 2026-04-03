import { Router } from "express";
import { success } from "../../lib/api-response.js";

const router = Router();

router.get("/", (_req, res) => {
  res.json(
    success({
      status: "ok"
    })
  );
});

export { router as healthRouter };

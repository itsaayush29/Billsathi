import { Router } from "express";
import { asyncHandler } from "../../lib/async-handler.js";
import { requireAdmin } from "../../middleware/require-admin.js";
import { requireAuth } from "../../middleware/require-auth.js";
import { validateBody, validateParams, validateQuery } from "../../middleware/validate.js";
import {
  getDashboardHandler,
  getSubscriptionsHandler,
  listPaymentsHandler,
  listUsersHandler,
  updateUserPlanHandler
} from "./admin.controller.js";
import { adminListQuerySchema, adminUserParamsSchema, updatePlanSchema } from "./admin.schema.js";

const router = Router();

router.use(asyncHandler(requireAuth));
router.use(asyncHandler(requireAdmin));
router.get("/dashboard", asyncHandler(getDashboardHandler));
router.get("/users", validateQuery(adminListQuerySchema), asyncHandler(listUsersHandler));
router.patch(
  "/users/:id/plan",
  validateParams(adminUserParamsSchema),
  validateBody(updatePlanSchema),
  asyncHandler(updateUserPlanHandler)
);
router.get("/payments", validateQuery(adminListQuerySchema), asyncHandler(listPaymentsHandler));
router.get("/subscriptions", asyncHandler(getSubscriptionsHandler));

export { router as adminRouter };

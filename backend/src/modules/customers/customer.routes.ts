import { Router } from "express";
import { asyncHandler } from "../../lib/async-handler.js";
import { requireAuth } from "../../middleware/require-auth.js";
import { validateBody, validateParams, validateQuery } from "../../middleware/validate.js";
import {
  createCustomerHandler,
  deleteCustomerHandler,
  getCustomerHandler,
  listCustomersHandler,
  updateCustomerHandler
} from "./customer.controller.js";
import {
  createCustomerSchema,
  customerParamsSchema,
  customerQuerySchema,
  updateCustomerSchema
} from "./customer.schema.js";

const router = Router();

router.use(asyncHandler(requireAuth));
router.get("/", validateQuery(customerQuerySchema), asyncHandler(listCustomersHandler));
router.get("/:id", validateParams(customerParamsSchema), asyncHandler(getCustomerHandler));
router.post("/", validateBody(createCustomerSchema), asyncHandler(createCustomerHandler));
router.patch(
  "/:id",
  validateParams(customerParamsSchema),
  validateBody(updateCustomerSchema),
  asyncHandler(updateCustomerHandler)
);
router.delete("/:id", validateParams(customerParamsSchema), asyncHandler(deleteCustomerHandler));

export { router as customerRouter };

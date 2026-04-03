import { UserPlan } from "@prisma/client";
import { Router } from "express";
import { asyncHandler } from "../../lib/async-handler.js";
import { requireAuth } from "../../middleware/require-auth.js";
import { requirePlan } from "../../middleware/require-plan.js";
import { validateBody, validateParams, validateQuery } from "../../middleware/validate.js";
import {
  createInvoiceHandler,
  deleteInvoiceHandler,
  generateInvoicePdfHandler,
  getInvoiceHandler,
  listInvoicesHandler,
  sendInvoiceWhatsappHandler,
  updateInvoiceHandler
} from "./invoice.controller.js";
import {
  createInvoiceSchema,
  invoiceParamsSchema,
  invoiceQuerySchema,
  updateInvoiceSchema
} from "./invoice.schema.js";

const router = Router();

router.use(asyncHandler(requireAuth));
router.get("/", validateQuery(invoiceQuerySchema), asyncHandler(listInvoicesHandler));
router.get("/:id", validateParams(invoiceParamsSchema), asyncHandler(getInvoiceHandler));
router.post("/", validateBody(createInvoiceSchema), asyncHandler(createInvoiceHandler));
router.patch(
  "/:id",
  validateParams(invoiceParamsSchema),
  validateBody(updateInvoiceSchema),
  asyncHandler(updateInvoiceHandler)
);
router.delete("/:id", validateParams(invoiceParamsSchema), asyncHandler(deleteInvoiceHandler));
router.post(
  "/:id/pdf",
  validateParams(invoiceParamsSchema),
  asyncHandler(requirePlan(UserPlan.PRO)),
  asyncHandler(generateInvoicePdfHandler)
);
router.post(
  "/:id/send-whatsapp",
  validateParams(invoiceParamsSchema),
  asyncHandler(requirePlan(UserPlan.PRO)),
  asyncHandler(sendInvoiceWhatsappHandler)
);

export { router as invoiceRouter };

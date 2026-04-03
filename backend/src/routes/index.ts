import { Router } from "express";
import { adminRouter } from "../modules/admin/admin.routes.js";
import { authRouter } from "../modules/auth/auth.routes.js";
import { customerRouter } from "../modules/customers/customer.routes.js";
import { healthRouter } from "../modules/health/health.routes.js";
import { invoiceRouter } from "../modules/invoices/invoice.routes.js";

const router = Router();

router.use("/health", healthRouter);
router.use("/auth", authRouter);
router.use("/customers", customerRouter);
router.use("/invoices", invoiceRouter);
router.use("/admin", adminRouter);

export { router as apiRouter };

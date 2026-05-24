import { Router } from 'express';
import authRoutes from "../modules/auth/auth.routes.js";
import userRoutes from "../modules/user/user.routes.js";
import categoryRoutes from "../modules/category/category.routes.js";
import productRoutes from "../modules/product/product.routes.js";
import cartRoutes from "../modules/cart/cart.routes.js";
import orderRouter from "../modules/order/order.router.js";
import cityRoutes from "../modules/city/city.routes.js";
import paymentRoutes from "../modules/payment/payment.routes.js";

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use("/cart", cartRoutes);
router.use("/orders", orderRouter);
router.use("/cities", cityRoutes);
router.use("/payments", paymentRoutes);

export default router;
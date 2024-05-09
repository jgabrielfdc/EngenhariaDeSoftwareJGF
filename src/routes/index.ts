import { Router } from "express";
import userRouter from "./user.routes";
import phoneRouter from "./phone.routes";

const routes = Router();

routes.use("/user", userRouter);
routes.use("/phone", phoneRouter);

export default routes;

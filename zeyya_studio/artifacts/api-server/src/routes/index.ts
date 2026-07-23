import { Router, type IRouter } from "express";
import healthRouter from "./health";
import publishRouter from "./publish";
import dataRouter from "./data";
import mediaRouter from "./media";

const router: IRouter = Router();

router.use(healthRouter);
router.use(dataRouter);
router.use(mediaRouter);
router.use(publishRouter);

export default router;

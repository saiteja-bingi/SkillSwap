import express from 'express';
import { sendRequest,getMyRequests,acceptRequest,rejectRequest} from '../controllers/requestController.js';
import protect from '../middleware/authMiddleware.js';

const router=express.Router();

router.get("/my",protect,getMyRequests);
router.post("/:postId",protect,sendRequest);
router.put("/:requestId/accept",protect,acceptRequest);
router.put("/:requestId/reject",protect,rejectRequest);

export default router;
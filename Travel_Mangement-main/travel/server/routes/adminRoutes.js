import express from 'express';
import adminHotelsRoutes from './adminHotelsRoutes.js';
import adminTransportRoutes from './adminTransportRoutes.js';
import adminTouristSpotsRoutes from './adminTouristSpotsRoutes.js';
import adminLocation from './adminLocation.js';
import adminStatsRoutes from './adminStatsRoutes.js';


const router = express.Router();


// Consolidate all admin routes under /api/admin

router.use('/stats', adminStatsRoutes); 
router.use('/hotels', adminHotelsRoutes);
router.use('/transport', adminTransportRoutes);
router.use('/tourist-spots', adminTouristSpotsRoutes);
router.use('/locations', adminLocation);


export default router;

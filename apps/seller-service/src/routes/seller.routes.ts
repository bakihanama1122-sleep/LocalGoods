import express, { Router } from "express";
import { getSeller, getShop, getSellerProducts, isFollowing, getSellerEvents, toggleFollow, getSellerStats, createEvent, updateEvent, getSellerOwnEvents, deleteEvent } from "../controllers/seller.controllers";
import isAuthenticated from "../../../../packages/middleware/isAuthenticated";

const router: Router = express.Router();

// Public routes (no authentication required)
router.get("/get-shop/:id", getShop); // New route for shop profile
router.get("/get-seller/:id", getSeller); // Existing route for seller management
router.get("/get-seller-products/:id", getSellerProducts);
router.get("/get-seller-events/:id", getSellerEvents);

// Protected routes (authentication required)
router.get("/is-following/:id", isAuthenticated, isFollowing);
router.post("/toggle-follow/:id", isAuthenticated, toggleFollow);

// Seller dashboard stats (authentication required)
router.get("/get-stats", isAuthenticated, getSellerStats);

// Event management routes (authentication required)
router.get("/get-events", isAuthenticated, getSellerOwnEvents);
router.post("/create-event", isAuthenticated, createEvent);
router.put("/update-event/:eventId", isAuthenticated, updateEvent);
router.delete("/delete-event/:eventId", isAuthenticated, deleteEvent);

export default router;

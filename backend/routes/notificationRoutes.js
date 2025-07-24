const express = require('express');
const router = express.Router();
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  createNotification,
} = require('../controllers/notificationController');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected and require authentication
router.use(protect);

// Routes for notifications
router
  .route('/')
  .get(getNotifications)
  .post(authorize('admin'), createNotification);

router.route('/read-all').patch(markAllAsRead);
router.route('/:id/read').patch(markAsRead);
router.route('/:id').delete(deleteNotification);

module.exports = router;

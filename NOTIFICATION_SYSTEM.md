# Notification System Implementation Guide

## Overview

The Smart Campus Operations Hub now has a complete notification system that provides real-time updates for:
- **Booking Approvals/Rejections** - When admins approve or reject booking requests
- **Ticket Status Changes** - When maintenance tickets are assigned or status changes
- **New Comments** - When comments are added to tickets

## Architecture

### Frontend Components

#### 1. **NotificationContext** (`/frontend/src/contexts/NotificationContext.js`)
- Provides a React Context for managing notification refresh across components
- Exports `NotificationProvider` wrapper component and `useNotificationRefresh()` hook
- Allows components to trigger manual notification refresh via `refreshNotifications()` function

#### 2. **NotificationPanel** (`/frontend/src/components/notifications/NotificationPanel.jsx`)
- Displays notifications in a dropdown panel accessible from the header
- Polls for new notifications every **10 seconds** (improved from 30 seconds)
- Shows unread notification count
- Supports marking notifications as read/delete
- Color-coded notification types:
  - **BOOKING_APPROVED** - Emerald/green
  - **BOOKING_REJECTED** - Rose/red
  - **TICKET_STATUS_CHANGED** - Indigo/blue
  - **NEW_COMMENT** - Amber/orange

#### 3. **NotificationsPage** (`/frontend/src/pages/NotificationsPage.jsx`)
- Full-page view of all notifications
- Filter by read/unread status
- Bulk action to mark all as read
- Individual delete/mark as read options

### Backend Components

#### 1. **NotificationModel** (`/Backend/src/main/java/Backend/model/Notification.java`)
- MongoDB document storing:
  - `userId` - Target user
  - `type` - Notification type enum
  - `message` - Human-readable message
  - `isRead` - Read status
  - `createdAt` - Timestamp

#### 2. **NotificationService** (`/Backend/src/main/java/Backend/service/NotificationService.java`)
- Core service for notification operations
- Methods:
  - `createNotification()` - Create new notification
  - `getNotificationsForUser()` - Fetch user's notifications
  - `markAsRead()` - Mark single notification as read
  - `markAllAsRead()` - Mark all notifications as read
  - `deleteNotification()` - Delete a notification

#### 3. **NotificationController** (`/Backend/src/main/java/Backend/controller/NotificationController.java`)
- REST endpoints:
  - `GET /api/notifications` - Get user's notifications
  - `PATCH /api/notifications/{id}/read` - Mark as read
  - `PATCH /api/notifications/read-all` - Mark all as read
  - `DELETE /api/notifications/{id}` - Delete notification

#### 4. **Integration Points**

**BookingService** (`updateBookingStatus()`)
```java
if ("APPROVED".equals(upperStatus)) {
    notificationService.createNotification(userId, "BOOKING_APPROVED", msg);
} else if ("REJECTED".equals(upperStatus)) {
    notificationService.createNotification(userId, "BOOKING_REJECTED", msg);
}
```

**TicketService** (`updateTicketStatus()` and `assignTicket()`)
```java
notificationService.createNotification(
    ticketOwnerUserId, 
    "TICKET_STATUS_CHANGED", 
    message
);
```

**CommentService** (`addComment()`)
```java
notificationService.createNotification(
    ownerUserId, 
    "NEW_COMMENT", 
    msg
);
```

## Real-Time Refresh Triggers

### Booking Workflow
1. Admin approves/rejects booking in `AdminBookingPage`
2. `handleDecision()` calls `updateBookingStatus()`
3. Backend creates notification
4. Frontend calls `refreshNotifications()` to immediately update panel
5. Polling interval (10s) ensures real-time sync

**File**: `/frontend/src/pages/AdminBookingPage.jsx`
```javascript
const handleDecision = async (id, status, reason) => {
    await updateBookingStatus(id, status, reason);
    refreshNotifications(); // Immediate refresh
    loadAllBookings();
};
```

### Ticket Workflow
1. User adds comment in `TicketingPage` → `CommentSection`
2. `handleAdd()` calls `addComment()`
3. Backend creates notification for ticket owner
4. Frontend calls `onRefreshNotifications()` callback
5. Polling interval ensures sync

**File**: `/frontend/src/pages/TicketingPage.jsx`
```javascript
const handleAdd = async () => {
    await addComment(ticketId, text, currentUser);
    if (onRefreshNotifications) {
        onRefreshNotifications(); // Immediate refresh
    }
};
```

## Data Flow

### Creating a Notification
```
User Action (Admin approves booking)
    ↓
Backend Endpoint (PUT /api/bookings/{id}/status)
    ↓
BookingService.updateBookingStatus()
    ↓
NotificationService.createNotification()
    ↓
MongoDB: notifications collection
    ↓
Frontend: Either via polling or manual refresh
    ↓
NotificationPanel displays notification
```

### Fetching Notifications
```
Frontend: NotificationPanel
    ↓
Polling (every 10 seconds) OR Manual refresh()
    ↓
GET /api/notifications
    ↓
NotificationController.getMyNotifications()
    ↓
NotificationService.getNotificationsForUser()
    ↓
MongoDB query
    ↓
Update UI state
```

## Testing the Notification System

### Test Case 1: Booking Approval Notification
1. **Setup**: Log in as student and create a booking request
2. **Action**: Log in as admin and approve the booking
3. **Expected**: 
   - Notification appears in user's notification panel
   - Type: BOOKING_APPROVED
   - Message contains resource name, date, and time
   - Color: Emerald/green badge

### Test Case 2: Booking Rejection Notification
1. **Setup**: Create a pending booking request
2. **Action**: As admin, reject with reason
3. **Expected**:
   - BOOKING_REJECTED notification appears
   - Message includes rejection reason
   - Color: Rose/red badge

### Test Case 3: Ticket Status Change Notification
1. **Setup**: Create a maintenance ticket
2. **Action**: As admin, change ticket status (e.g., assign to technician)
3. **Expected**:
   - TICKET_STATUS_CHANGED notification
   - Message indicates new status or assignment
   - Color: Indigo/blue badge

### Test Case 4: New Comment Notification
1. **Setup**: Ticket owner creates a ticket
2. **Action**: Admin (or another user) adds comment
3. **Expected**:
   - NEW_COMMENT notification to ticket owner
   - Message shows comment preview (truncated)
   - Color: Amber/orange badge

### Test Case 5: Real-Time Update
1. **Setup**: Open NotificationPanel while on another tab
2. **Action**: Perform action that generates notification
3. **Expected**:
   - Notification appears within 10 seconds
   - Unread count badge updates
   - Notification shown in dropdown

### Test Case 6: Mark as Read
1. **Setup**: Have unread notifications
2. **Action**: Click on notification or "Mark all as read"
3. **Expected**:
   - Read status updates
   - UI reflects read status (no badge, different style)
   - Count decreases

### Test Case 7: Delete Notification
1. **Setup**: Have notifications
2. **Action**: Delete a notification
3. **Expected**:
   - Notification removed from list
   - Count updates

## Performance Considerations

### Polling Strategy
- **Interval**: 10 seconds (was 30 seconds)
- **Trade-off**: More responsive but slightly higher server load
- **Optimization**: Can be made adaptive based on user activity

### Future Enhancements
1. **WebSocket Integration** - Replace polling with real-time updates
   - Lower latency
   - Reduced server load
   - Better user experience
   
2. **Push Notifications** - Browser notifications API
   - Even when tab is not focused
   - Desktop alerts

3. **Notification Batching** - Combine multiple related notifications
   - Reduce clutter
   - Better readability

## API Endpoints Reference

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/notifications` | Fetch user's notifications |
| PATCH | `/api/notifications/{id}/read` | Mark single notification as read |
| PATCH | `/api/notifications/read-all` | Mark all as read |
| DELETE | `/api/notifications/{id}` | Delete a notification |
| POST | `/api/notifications/test` | Create test notification (dev only) |

## Environment Setup

### No additional configuration needed!
The system uses existing backend MongoDB connection and frontend axios setup.

### Verify Backend is Running
```bash
cd Backend
./mvnw spring-boot:run
# Should start on http://localhost:8085
```

### Verify Frontend is Running
```bash
cd frontend
npm start
# Should start on http://localhost:3000
```

## Troubleshooting

### Notifications Not Appearing
1. Check browser console for errors
2. Verify backend is running (`http://localhost:8085/api/notifications`)
3. Check MongoDB connection
4. Ensure user is authenticated (cookies present)

### Notifications Very Slow
1. Adjust polling interval in `NotificationPanel.jsx` (currently 10s)
2. Check network latency
3. Consider WebSocket implementation

### Duplicate Notifications
1. Check for multiple useEffect triggers
2. Verify notification creation logic isn't called multiple times
3. Check backend for duplicate inserts

## Code Examples

### Using Notification Refresh in a Component
```javascript
import { useNotificationRefresh } from '../contexts/NotificationContext';

function MyComponent() {
    const { refreshNotifications } = useNotificationRefresh();
    
    const handleAction = async () => {
        // Do something
        await someAction();
        
        // Refresh notifications
        refreshNotifications();
    };
    
    return <button onClick={handleAction}>Action</button>;
}
```

### Creating Notifications from Backend
```java
// In any service
@Autowired
private NotificationService notificationService;

// Create notification
notificationService.createNotification(
    userId,
    "NOTIFICATION_TYPE",
    "Your message here"
);
```

## Files Modified/Created

### Created
- `/frontend/src/contexts/NotificationContext.js` - Context provider

### Modified
- `/frontend/src/components/notifications/NotificationPanel.jsx` - Added context integration
- `/frontend/src/index.js` - Wrapped app with NotificationProvider
- `/frontend/src/pages/AdminBookingPage.jsx` - Added refresh on booking decision
- `/frontend/src/pages/TicketingPage.jsx` - Added refresh on comments and new tickets

### Existing (No Changes Needed)
- Backend notification infrastructure already complete
- API endpoints already functional
- Database schema ready

## Summary

The notification system is now fully integrated with:
✅ **Faster Polling** (10 seconds)
✅ **Real-time Refresh Triggers** (on user actions)
✅ **Context-based State Management** (clean architecture)
✅ **Three Notification Types** (bookings, tickets, comments)
✅ **Responsive UI** (displays in NotificationPanel)
✅ **Full CRUD Operations** (create, read, mark as read, delete)

The system is production-ready and can handle all notification requirements for the Smart Campus Operations Hub.

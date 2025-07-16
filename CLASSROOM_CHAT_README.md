# Classroom Chat Room System

A comprehensive real-time chat system for educational classrooms built with Firebase and modern web technologies.

## Features

### 🔹 Classroom Selection Page (`classrooms.html`)
- **UI for listing available classrooms** from Firebase
- **Search and filter** classrooms by name, subject, or description
- **Admin/Author privileges** - ability to create new classrooms
- **Responsive design** with mobile-first approach
- **Real-time updates** when new classrooms are created

### 🔹 Chat Room UI (`chatroom.html`)
- **Clean chat interface** with scrollable message area
- **Message bubbles** with sender name, message, and timestamp
- **Grouped messages by date** with visual date dividers
- **Responsive layout** with collapsible sidebar on mobile
- **Glass morphism design** with modern UI elements

### 🔹 Message Input & Sending
- **Input field** with auto-resize functionality
- **Emoji picker** with 80+ emojis
- **Send button** and Enter key support
- **Loading states** and offline handling
- **Input validation** and error handling

### 🔹 Real-time Features
- **Live message updates** using Firebase Firestore
- **Auto-scroll** to latest messages
- **Typing indicators** showing when users are typing
- **Online presence** tracking with Firebase Realtime Database
- **Member list** showing active users

### 🔹 Admin Features
- **Delete messages** (admin/author only)
- **Create classrooms** with name, subject, and description
- **Member management** automatic when joining classrooms

### 🔹 Responsive Design
- **Mobile-first** layout
- **Collapsible sidebar** on small screens
- **Fixed bottom input** on mobile devices
- **Touch-friendly** interface elements

## Technical Implementation

### Firebase Integration
- **Firestore** for classroom and message data
- **Realtime Database** for presence and typing indicators
- **Authentication** for user management
- **Security rules** for data protection

### Data Structure

#### Classrooms Collection
```javascript
{
  name: "Classroom Name",
  subject: "Subject",
  description: "Description",
  createdBy: "user@email.com",
  createdByUid: "user_id",
  createdAt: timestamp,
  memberCount: number,
  members: ["user_id1", "user_id2"]
}
```

#### Messages Subcollection
```javascript
{
  text: "Message content",
  senderId: "user_id",
  senderName: "user@email.com",
  timestamp: timestamp,
  type: "text"
}
```

#### Presence Data (Realtime Database)
```javascript
{
  "classrooms/{classroomId}/presence/{userId}": {
    online: boolean,
    lastSeen: timestamp,
    name: "user@email.com"
  },
  "classrooms/{classroomId}/typing/{userId}": boolean
}
```

## Usage

### For Students
1. Navigate to **Classrooms** from the main navigation
2. Browse available classrooms or search by subject
3. Click **Join Classroom** to enter the chat room
4. Start chatting with real-time updates

### For Teachers/Admins
1. Access **Classrooms** page
2. Use the **Create Classroom** form to add new classrooms
3. Join any classroom to moderate discussions
4. Delete inappropriate messages using the trash icon

## File Structure

```
├── classrooms.html          # Classroom selection page
├── chatroom.html           # Chat room interface
├── js/
│   ├── classrooms.js       # Classroom page functionality
│   └── chatroom.js         # Chat room functionality
└── CLASSROOM_CHAT_README.md # This documentation
```

## Security Considerations

- **Authentication required** for all chat features
- **Role-based permissions** for admin functions
- **Input sanitization** to prevent XSS attacks
- **Firebase security rules** for data protection

## Browser Compatibility

- **Modern browsers** with ES6+ support
- **Mobile browsers** with touch support
- **Firebase SDK** compatibility

## Performance Features

- **Lazy loading** of messages
- **Efficient real-time listeners**
- **Optimized DOM updates**
- **Memory cleanup** on page unload

## Future Enhancements

- [ ] File sharing capabilities
- [ ] Voice messages
- [ ] Screen sharing
- [ ] Polls and quizzes
- [ ] Message reactions
- [ ] Read receipts
- [ ] Message threading
- [ ] Advanced moderation tools 
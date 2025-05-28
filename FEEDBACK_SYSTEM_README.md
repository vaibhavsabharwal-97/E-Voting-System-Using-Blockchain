# E-Voting System - Voter Feedback Feature

This document describes the implementation of the voter feedback system that allows users to like or dislike candidates separately from the blockchain voting mechanism.

## Overview

The feedback system allows voters to express their opinion about candidates using likes and dislikes, which are stored in MongoDB. This is completely separate from the actual voting process that uses blockchain technology.

## Features

- ✅ **Like/Dislike Buttons**: Users can like or dislike any candidate
- ✅ **Real-time Updates**: Feedback counts update immediately after submission
- ✅ **MongoDB Storage**: All feedback data is stored in MongoDB
- ✅ **Admin Dashboard**: Admins can view feedback statistics in result pages
- ✅ **API Endpoints**: RESTful API for feedback operations
- ✅ **Error Handling**: Comprehensive error handling and validation

## Database Schema Changes

### Candidate Model Updates

Added two new fields to the `Candidate` schema:

```javascript
// server/Models/Candidate.js
{
  // ... existing fields ...
  likes: {
    type: Number,
    default: 0,
  },
  dislikes: {
    type: Number,
    default: 0,
  }
}
```

## API Endpoints

### 1. Like a Candidate
```
POST /api/feedback/like
Content-Type: application/json

Body:
{
  "candidateId": "507f1f77bcf86cd799439011"
}

Response:
{
  "success": true,
  "message": "Like added successfully",
  "likes": 5,
  "candidateName": "John Doe"
}
```

### 2. Dislike a Candidate
```
POST /api/feedback/dislike
Content-Type: application/json

Body:
{
  "candidateId": "507f1f77bcf86cd799439011"
}

Response:
{
  "success": true,
  "message": "Dislike added successfully",
  "dislikes": 3,
  "candidateName": "John Doe"
}
```

### 3. Get Feedback Statistics
```
GET /api/feedback/stats/:candidateId

Response:
{
  "success": true,
  "candidateId": "507f1f77bcf86cd799439011",
  "candidateName": "John Doe",
  "likes": 5,
  "dislikes": 3,
  "totalFeedback": 8
}
```

## Frontend Implementation

### CandidateLayout Component

The main candidate selection component now includes like/dislike buttons:

```jsx
// Client/src/Components/User/CandidateLayout.jsx

// Feedback Buttons
<Stack direction="row" spacing={1} sx={{ mr: 2 }}>
  <Button
    variant="outlined"
    size="small"
    onClick={handleLike}
    disabled={feedbackLoading.like}
    startIcon={feedbackLoading.like ? <CircularProgress size={16} /> : <ThumbUpIcon />}
    sx={{
      color: 'success.main',
      borderColor: 'success.main',
      // ... styling
    }}
  >
    {data?.likes || 0}
  </Button>
  
  <Button
    variant="outlined"
    size="small"
    onClick={handleDislike}
    disabled={feedbackLoading.dislike}
    startIcon={feedbackLoading.dislike ? <CircularProgress size={16} /> : <ThumbDownIcon />}
    sx={{
      color: 'error.main',
      borderColor: 'error.main',
      // ... styling
    }}
  >
    {data?.dislikes || 0}
  </Button>
</Stack>
```

### Admin Result Pages

Feedback statistics are displayed in:

1. **ViewElectionResult.jsx** - Shows likes/dislikes for each candidate
2. **ElectionResult.jsx** - Component showing feedback in election cards
3. **ResultCandidate.jsx** - Public result page with feedback stats

## File Structure

```
server/
├── Models/
│   └── Candidate.js          # Updated with likes/dislikes fields
├── Routes/
│   └── feedback.js           # New feedback API routes
└── index.js                  # Updated to include feedback routes

Client/src/
├── Components/
│   ├── User/
│   │   └── CandidateLayout.jsx    # Updated with like/dislike buttons
│   └── Admin/
│       └── ElectionResult.jsx     # Updated to show feedback stats
└── Pages/
    ├── admin/
    │   └── Result/
    │       └── ViewElectionResult.jsx  # Updated with feedback display
    └── ResultCandidate.jsx            # Updated with feedback stats

demo-feedback.html                     # HTML demo for testing
```

## Installation & Setup

### 1. Server Setup

1. **Install Dependencies** (if not already installed):
   ```bash
   cd server
   npm install express mongoose cors express-fileupload
   ```

2. **Start MongoDB** (make sure MongoDB is running)

3. **Start the Server**:
   ```bash
   cd server
   npm start
   ```

### 2. Database Migration

The new fields (`likes` and `dislikes`) will be automatically added to existing candidates with default values of 0.

### 3. Frontend Setup

1. **Install Dependencies** (if not already installed):
   ```bash
   cd Client
   npm install @mui/material @mui/icons-material
   ```

2. **Start the Frontend**:
   ```bash
   cd Client
   npm start
   ```

## Testing

### 1. Using the HTML Demo

1. Open `demo-feedback.html` in your browser
2. Replace `CANDIDATE_ID_1`, `CANDIDATE_ID_2`, `CANDIDATE_ID_3` with real MongoDB ObjectIds
3. Test the like/dislike functionality

### 2. Using the React Application

1. Navigate to the candidate selection page
2. Click the 👍 or 👎 buttons next to any candidate
3. Check the admin result pages to see feedback statistics

### 3. API Testing with curl

```bash
# Like a candidate
curl -X POST http://localhost:1322/api/feedback/like \
  -H "Content-Type: application/json" \
  -d '{"candidateId":"YOUR_CANDIDATE_ID"}'

# Dislike a candidate
curl -X POST http://localhost:1322/api/feedback/dislike \
  -H "Content-Type: application/json" \
  -d '{"candidateId":"YOUR_CANDIDATE_ID"}'

# Get feedback stats
curl http://localhost:1322/api/feedback/stats/YOUR_CANDIDATE_ID
```

## Key Features

### 1. Separation of Concerns
- **Voting**: Stored on blockchain (immutable, secure)
- **Feedback**: Stored in MongoDB (flexible, queryable)

### 2. Real-time Updates
- Feedback counts update immediately after submission
- Loading states prevent double-clicking
- Error handling for network issues

### 3. User Experience
- Intuitive 👍/👎 buttons with counts
- Visual feedback with colors (green for likes, red for dislikes)
- Disabled state during API calls
- Success/error alerts

### 4. Admin Dashboard
- Feedback statistics in all result views
- Total feedback counts
- Integration with existing result displays

## Security Considerations

1. **Input Validation**: All candidate IDs are validated as proper MongoDB ObjectIds
2. **Error Handling**: Comprehensive error handling prevents crashes
3. **Rate Limiting**: Consider implementing rate limiting for production use
4. **Authentication**: In production, consider requiring authentication for feedback

## Future Enhancements

1. **User Tracking**: Track which users gave feedback to prevent duplicates
2. **Feedback Comments**: Allow users to leave text comments
3. **Feedback Analytics**: More detailed analytics and charts
4. **Moderation**: Admin tools to moderate inappropriate feedback
5. **Real-time Updates**: WebSocket integration for real-time feedback updates

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure the server has CORS enabled
2. **MongoDB Connection**: Ensure MongoDB is running and accessible
3. **Invalid ObjectId**: Make sure candidate IDs are valid MongoDB ObjectIds
4. **Network Errors**: Check if the server is running on port 1322

### Debug Tips

1. Check browser console for JavaScript errors
2. Check server logs for API errors
3. Verify MongoDB connection and data
4. Test API endpoints directly with curl or Postman

## Conclusion

The voter feedback system provides a valuable addition to the e-voting platform, allowing users to express opinions about candidates beyond just voting. The implementation maintains separation between voting (blockchain) and feedback (MongoDB) while providing a seamless user experience. 
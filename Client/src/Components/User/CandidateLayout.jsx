import React, { useEffect, useState } from "react";
import { 
  Card,
  CardActions,
  Button,
  Typography,
  Box,
  Avatar,
  Backdrop,
  CircularProgress,
  useTheme,
  alpha,
  Stack,
  Divider
} from "@mui/material";
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import PersonIcon from '@mui/icons-material/Person';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import axios from "axios";
import { stringToAv } from "../../Data/Methods";
import { serverLink, staticFileLink, isFaceRecognitionEnable } from "../../Data/Variables";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useUser } from "../../context/UserContext";

const MotionCard = motion(Card);

const CandidateLayout = (props) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { authenticatedUser, isAuthenticated } = useUser();
  const [data, setData] = useState("");
  const [msg, setMsg] = useState("");
  const link = "/login";
  const [loading, setLoading] = useState(false);
  const [feedbackLoading, setFeedbackLoading] = useState({ like: false, dislike: false });
  const [userFeedback, setUserFeedback] = useState(null); // Track user's existing feedback

  const handleClick = async (id) => {
    setLoading(true);
    
    if (isAuthenticated && authenticatedUser) {
      const tmp = {
        candidate_id: data._id,
        candidate_username: props.username,
        election_id: props.id,
        user_id: authenticatedUser._id,
        user_username: authenticatedUser.username,
      };
      
      setLoading(false);
      navigate(link, { state: { info: tmp } });
      return;
    }
    
    if (isFaceRecognitionEnable) {
      setMsg(" Accessing Camera");
      try {
        var res = await axios.post(serverLink + "op");
      } catch (err) {
        alert(err.response.data);
        setLoading(false);
        return;
      }
      let userName = res.data;

      setMsg(userName + " Detected");

      res = await axios.get(serverLink + "user/username/" + userName);
      let user = res.data[0];
      if (!user) {
        alert("User with " + userName + "username Not Found");
        setLoading(false);
        return;
      }
      const tmp = {
        candidate_id: data._id,
        candidate_username: props.username,
        election_id: props.id,
        user_id: user._id,
        user_username: user.username,
      };

      setMsg("");
      setLoading(false);
      navigate(link, { state: { info: tmp } });
    }
  };

  // Handle like feedback
  const handleLike = async () => {
    if (!data?._id || feedbackLoading.like) return;
    
    // Check if user is authenticated
    if (!isAuthenticated || !authenticatedUser) {
      alert('Please log in to give feedback');
      return;
    }

    // Check if election ID is available
    if (!props.id) {
      alert('Election information not available');
      return;
    }
    
    setFeedbackLoading(prev => ({ ...prev, like: true }));
    
    try {
      const response = await fetch(`http://localhost:1322/api/feedback/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          candidateId: data._id,
          userId: authenticatedUser._id,
          electionId: props.id
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert(`👍 You liked ${result.candidateName}! Total likes: ${result.likes}`);
        // Update local data to reflect the new like count
        setData(prev => ({ ...prev, likes: result.likes }));
        // Update user feedback state
        setUserFeedback({ feedbackType: 'like', candidateId: { _id: data._id } });
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error sending like:', error);
      alert('Failed to send like. Please try again.');
    } finally {
      setFeedbackLoading(prev => ({ ...prev, like: false }));
    }
  };

  // Handle dislike feedback
  const handleDislike = async () => {
    if (!data?._id || feedbackLoading.dislike) return;
    
    // Check if user is authenticated
    if (!isAuthenticated || !authenticatedUser) {
      alert('Please log in to give feedback');
      return;
    }

    // Check if election ID is available
    if (!props.id) {
      alert('Election information not available');
      return;
    }
    
    setFeedbackLoading(prev => ({ ...prev, dislike: true }));
    
    try {
      const response = await fetch(`http://localhost:1322/api/feedback/dislike`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          candidateId: data._id,
          userId: authenticatedUser._id,
          electionId: props.id
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert(`👎 You disliked ${result.candidateName}! Total dislikes: ${result.dislikes}`);
        // Update local data to reflect the new dislike count
        setData(prev => ({ ...prev, dislikes: result.dislikes }));
        // Update user feedback state
        setUserFeedback({ feedbackType: 'dislike', candidateId: { _id: data._id } });
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error sending dislike:', error);
      alert('Failed to send dislike. Please try again.');
    } finally {
      setFeedbackLoading(prev => ({ ...prev, dislike: false }));
    }
  };

  useEffect(() => {
    async function getData() {
      try {
        let res = await axios.get(serverLink + "candidate/" + props.username);
        let user = res.data;
        setData(user);
      } catch (error) {
        console.error("Error fetching candidate data:", error);
        setData(null);
      }
    }
    getData();
  }, [props.username]);

  // Check if user has already given feedback for this candidate in this election
  useEffect(() => {
    async function checkUserFeedback() {
      if (!isAuthenticated || !authenticatedUser || !props.id || !data?._id) {
        setUserFeedback(null);
        return;
      }

      try {
        const response = await fetch(`http://localhost:1322/api/feedback/user/${authenticatedUser._id}/election/${props.id}`);
        const result = await response.json();
        
        if (result.success) {
          // Find feedback for this specific candidate
          const candidateFeedback = result.feedback.find(f => f.candidateId._id === data._id);
          setUserFeedback(candidateFeedback || null);
        }
      } catch (error) {
        console.error('Error checking user feedback:', error);
        setUserFeedback(null);
      }
    }

    checkUserFeedback();
  }, [isAuthenticated, authenticatedUser, props.id, data?._id]);

  // Get image URL helper
  const getImageUrl = (path) => {
    if (!path) return undefined;
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    return `${staticFileLink}${cleanPath}`;
  };

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <CircularProgress color="inherit" />
          <Typography variant="h6">{msg}</Typography>
        </Box>
      </Backdrop>

      <MotionCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 1.5,
          gap: 2,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          borderRadius: 2,
          width: '100%',
          bgcolor: '#fff',
          '&:hover': {
            boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
            transform: 'translateY(-2px)',
            transition: 'all 0.3s ease'
          }
        }}
      >
        {/* Candidate Image */}
        <Avatar
          src={getImageUrl(data?.profileImage)}
          sx={{
            width: 55,
            height: 55,
            border: '2px solid',
            borderColor: 'primary.main'
          }}
        >
          {!data?.profileImage && (data !== "" && stringToAv(data.firstName, data.lastName))}
        </Avatar>

        {/* Candidate Name */}
        <Box sx={{ flexGrow: 1, minWidth: 120 }}>
          <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
            {data?.firstName} {data?.lastName}
          </Typography>
        </Box>

        {/* Party Symbol and Name */}
        <Stack direction="row" spacing={2} alignItems="center" sx={{ minWidth: 140 }}>
          {data?.partySymbol && (
            <Box
              sx={{
                bgcolor: 'white',
                borderRadius: '50%',
                padding: '4px',
                width: 35,
                height: 35,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <img
                src={getImageUrl(data.partySymbol)}
                alt={`${data.partyName || 'Party'} Symbol`}
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
              />
            </Box>
          )}
          {data?.partyName && (
            <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.95rem', whiteSpace: 'nowrap' }}>
              {data.partyName}
            </Typography>
          )}
        </Stack>

        {/* Feedback Buttons */}
        <Stack direction="row" spacing={1} sx={{ mr: 2 }}>
          <Button
            variant={userFeedback?.feedbackType === 'like' ? 'contained' : 'outlined'}
            size="small"
            onClick={handleLike}
            disabled={feedbackLoading.like || userFeedback !== null}
            startIcon={feedbackLoading.like ? <CircularProgress size={16} /> : <ThumbUpIcon />}
            sx={{
              minWidth: '60px',
              px: 1.5,
              py: 0.5,
              borderRadius: 1,
              textTransform: 'none',
              fontSize: '0.8rem',
              color: userFeedback?.feedbackType === 'like' ? 'white' : 'success.main',
              borderColor: 'success.main',
              backgroundColor: userFeedback?.feedbackType === 'like' ? 'success.main' : 'transparent',
              '&:hover': {
                borderColor: 'success.dark',
                backgroundColor: userFeedback?.feedbackType === 'like' ? 'success.dark' : 'success.light',
                color: userFeedback?.feedbackType === 'like' ? 'white' : 'success.dark'
              },
              '&:disabled': {
                opacity: userFeedback !== null ? 0.7 : 0.5
              }
            }}
          >
            {data?.likes || 0}
          </Button>
          
          <Button
            variant={userFeedback?.feedbackType === 'dislike' ? 'contained' : 'outlined'}
            size="small"
            onClick={handleDislike}
            disabled={feedbackLoading.dislike || userFeedback !== null}
            startIcon={feedbackLoading.dislike ? <CircularProgress size={16} /> : <ThumbDownIcon />}
            sx={{
              minWidth: '60px',
              px: 1.5,
              py: 0.5,
              borderRadius: 1,
              textTransform: 'none',
              fontSize: '0.8rem',
              color: userFeedback?.feedbackType === 'dislike' ? 'white' : 'error.main',
              borderColor: 'error.main',
              backgroundColor: userFeedback?.feedbackType === 'dislike' ? 'error.main' : 'transparent',
              '&:hover': {
                borderColor: 'error.dark',
                backgroundColor: userFeedback?.feedbackType === 'dislike' ? 'error.dark' : 'error.light',
                color: userFeedback?.feedbackType === 'dislike' ? 'white' : 'error.dark'
              },
              '&:disabled': {
                opacity: userFeedback !== null ? 0.7 : 0.5
              }
            }}
          >
            {data?.dislikes || 0}
          </Button>
        </Stack>

        {/* Vote Button */}
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleClick(data?._id)}
          sx={{
            minWidth: '80px',
            px: 3,
            py: 0.75,
            borderRadius: 1,
            textTransform: 'none',
            fontSize: '0.95rem',
            whiteSpace: 'nowrap'
          }}
        >
          Vote
        </Button>
      </MotionCard>
    </>
  );
};

export default CandidateLayout;
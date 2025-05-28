import React, { useState } from "react";
import { Card, CardContent, Typography, Box, Avatar, LinearProgress, Tooltip, Zoom } from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import HowToVoteIcon from "@mui/icons-material/HowToVote";
import PersonIcon from "@mui/icons-material/Person";
import AssessmentIcon from "@mui/icons-material/Assessment";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import { styled, keyframes } from "@mui/material/styles";

// Animation keyframes
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const glow = keyframes`
  0% { box-shadow: 0 0 5px rgba(var(--glow-color), 0.2); }
  50% { box-shadow: 0 0 20px rgba(var(--glow-color), 0.4); }
  100% { box-shadow: 0 0 5px rgba(var(--glow-color), 0.2); }
`;

// Styled components for animations and effects
const StyledCard = styled(Card)(({ theme, type }) => {
  // Get color based on card type
  const getColorVar = () => {
    switch(type.toLowerCase()) {
      case "users": return "59, 130, 246"; // blue
      case "candidates": return "16, 185, 129"; // green
      case "elections": return "139, 92, 246"; // purple
      case "results": return "249, 115, 22"; // orange
      default: return "59, 130, 246"; // default blue
    }
  };
  
  return {
    display: "flex",
    padding: "24px",
    borderRadius: "16px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    transition: "all 0.4s ease",
    height: "100%",
    position: "relative",
    overflow: "hidden",
    border: "1px solid rgba(0,0,0,0.05)",
    background: theme.palette.mode === 'dark' 
      ? `linear-gradient(135deg, ${theme.palette.background.paper}, rgba(${getColorVar()}, 0.1))`
      : `linear-gradient(135deg, ${theme.palette.background.paper}, rgba(${getColorVar()}, 0.05))`,
    "--glow-color": getColorVar(),
    "&:hover": {
      transform: "translateY(-10px)",
      boxShadow: "0 20px 30px rgba(0,0,0,0.15)",
      "&::after": {
        opacity: 1,
      }
    },
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: "4px",
      background: `rgba(${getColorVar()}, 0.8)`,
      borderRadius: "4px 4px 0 0",
    },
    "&::after": {
      content: '""',
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      zIndex: 0,
      pointerEvents: "none",
      opacity: 0.5,
      background: `linear-gradient(45deg, rgba(255,255,255,0) 80%, rgba(${getColorVar()}, 0.2) 90%, rgba(255,255,255,0) 100%)`,
      backgroundSize: "200% 100%",
      animation: `${shimmer} 3s infinite linear`,
      transition: "opacity 0.3s ease",
    }
  };
});

const StyledAvatar = styled(Avatar)(({ theme, bgcolor }) => ({
  backgroundColor: bgcolor || theme.palette.primary.main,
  color: "white",
  width: 70,
  height: 70,
  boxShadow: `0 8px 20px ${bgcolor ? bgcolor + '80' : theme.palette.primary.main + '80'}`,
  transition: "all 0.5s ease",
  "&:hover": {
    transform: "scale(1.1) rotate(10deg)",
    boxShadow: `0 15px 30px ${bgcolor ? bgcolor + '90' : theme.palette.primary.main + '90'}`,
  }
}));

const StyledValue = styled(Typography)(({ theme, type }) => {
  // Get color based on card type
  const getGradient = () => {
    switch(type?.toLowerCase()) {
      case "users": return "linear-gradient(45deg, #3b82f6, #60a5fa)"; // blue
      case "candidates": return "linear-gradient(45deg, #10b981, #34d399)"; // green
      case "elections": return "linear-gradient(45deg, #8b5cf6, #a78bfa)"; // purple
      case "results": return "linear-gradient(45deg, #f97316, #fb923c)"; // orange
      default: return `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`;
    }
  };
  
  return {
    fontSize: "2.75rem",
    fontWeight: "800",
    marginBottom: "4px",
    background: getGradient(),
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    transition: "all 0.3s ease",
    textShadow: "0 2px 10px rgba(0,0,0,0.1)",
    "&:hover": {
      transform: "scale(1.05)",
      letterSpacing: "1px",
    }
  };
});

const FloatingBox = styled(Box)(({ theme, active }) => ({
  animation: active ? `${float} 3s ease infinite` : "none",
}));

const GlowingAvatar = styled(Box)(({ theme, bgcolor }) => ({
  position: "relative",
  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: "50%",
    animation: `${glow} 3s infinite ease-in-out`,
    "--glow-color": bgcolor || "59, 130, 246",
  }
}));

const DashboardCard = (props) => {
  const { title, data, trend = null, type = "default", description = "" } = props;
  const [isHovered, setIsHovered] = useState(false);
  
  // Select icon based on the card type
  const getIcon = () => {
    switch(type.toLowerCase()) {
      case "users":
        return <GroupIcon sx={{ fontSize: "40px" }} />;
      case "candidates":
        return <PersonIcon sx={{ fontSize: "40px" }} />;
      case "elections":
        return <HowToVoteIcon sx={{ fontSize: "40px" }} />;
      case "results":
        return <AssessmentIcon sx={{ fontSize: "40px" }} />;
      default:
        return <GroupIcon sx={{ fontSize: "40px" }} />;
    }
  };
  
  // Select color based on the card type
  const getColor = () => {
    switch(type.toLowerCase()) {
      case "users": return "#3b82f6"; // blue
      case "candidates": return "#10b981"; // green
      case "elections": return "#8b5cf6"; // purple
      case "results": return "#f97316"; // orange
      default: return "#3b82f6"; // default blue
    }
  };

  // Get tooltip text based on the card type
  const getTooltipText = () => {
    switch(type.toLowerCase()) {
      case "users": return "Total registered users in the system";
      case "candidates": return "Total candidates across all elections";
      case "elections": return "Active and completed elections";
      case "results": return "Elections with published results";
      default: return "Dashboard statistics";
    }
  };
  
  return (
    <Tooltip
      title={description || getTooltipText()}
      placement="top"
      TransitionComponent={Zoom}
      arrow
      enterDelay={500}
    >
      <StyledCard 
        onMouseEnter={() => setIsHovered(true)} 
        onMouseLeave={() => setIsHovered(false)}
        type={type}
      >
        <Box sx={{ display: "flex", width: "100%", zIndex: 1, position: "relative" }}>
          <Box sx={{ flex: 1 }}>
            <Typography 
              variant="subtitle1" 
              color="text.secondary" 
              gutterBottom
              sx={{ 
                fontWeight: "bold", 
                fontSize: "0.875rem",
                textTransform: "uppercase",
                letterSpacing: "1px",
                opacity: 0.8
              }}
            >
              {title}
            </Typography>
            <FloatingBox active={isHovered}>
              <StyledValue variant="h3" type={type}>
                {data}
              </StyledValue>
            </FloatingBox>
            
            {trend !== null && (
              <Box sx={{ mt: 1.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  {trend >= 0 ? 
                    <TrendingUpIcon color="success" fontSize="small" /> :
                    <TrendingDownIcon color="error" fontSize="small" />
                  }
                  <Typography 
                    variant="caption" 
                    color={trend >= 0 ? "success.main" : "error.main"}
                    sx={{ fontWeight: "bold" }}
                  >
                    {trend > 0 ? `+${trend}%` : `${trend}%`} from last month
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={Math.min(Math.abs(trend) * 2, 100)} 
                  color={trend >= 0 ? "success" : "error"}
                  sx={{ 
                    height: 6, 
                    borderRadius: 3, 
                    mt: 0.75,
                    opacity: isHovered ? 1 : 0.7,
                    transition: "all 0.3s ease",
                    '& .MuiLinearProgress-bar': {
                      transition: 'transform 1s ease-in-out',
                    }
                  }}
                />
              </Box>
            )}
          </Box>
          
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", ml: 2 }}>
            <GlowingAvatar bgcolor={getColor().replace('#', '').match(/[a-f0-9]{2}/g).map(x => parseInt(x, 16)).join(', ')}>
              <StyledAvatar bgcolor={getColor()}>
                {getIcon()}
              </StyledAvatar>
            </GlowingAvatar>
          </Box>
        </Box>
      </StyledCard>
    </Tooltip>
  );
};

export default DashboardCard;

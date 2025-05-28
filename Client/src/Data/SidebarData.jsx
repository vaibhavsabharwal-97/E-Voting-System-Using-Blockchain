import React from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import PersonIcon from '@mui/icons-material/Person';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';

// Navigation items for the admin sidebar with bilingual support
export const SidebarData = [
  {
    title: "📊 डैशबोर्ड | Dashboard",
    icon: <DashboardIcon />,
    link: "/admin/dashboard",
    id: "active"
  },
  {
    title: "👥 उपयोगकर्ता | Users",
    icon: <PeopleIcon />,
    link: "/admin/users",
    id: ""
  },
  {
    title: "🗳️ चुनाव | Elections",
    icon: <HowToVoteIcon />,
    link: "/admin/elections",
    id: ""
  },
  {
    title: "👤 उम्मीदवार | Candidates",
    icon: <PersonIcon />,
    link: "/admin/candidates",
    id: ""
  },
  {
    title: "📈 परिणाम | Results",
    icon: <BarChartIcon />,
    link: "/admin/result",
    id: ""
  },
  {
    title: "🚪 लॉगआउट | Logout",
    icon: <LogoutIcon />,
    link: "/admin/logout",
    id: ""
  }
];

// Website details for the sidebar logo/title with Indian government branding
export const WebsiteDetails = {
  title: "Blockchain E-Voting | ब्लॉकचेन ई-मतदान",
  shortTitle: "E-Vote | ई-मतदान",
  icon: null, // Using custom emoji/icon in the component instead of an external image
  version: "1.2.0",
  subtitle: "भारत निर्वाचन आयोग | Election Commission of India"
};

// User-specific sidebar items with bilingual support
export const UserSidebarData = [
  {
    title: "🏠 होम | Home",
    icon: <HomeIcon />,
    link: "/app",
    id: "active"
  },
  {
    title: "🗳️ चुनाव | Elections",
    icon: <HowToVoteIcon />,
    link: "/app/election",
    id: ""
  },
  {
    title: "📊 परिणाम | Results",
    icon: <BarChartIcon />,
    link: "/app/result",
    id: ""
  },
  {
    title: "🔙 वापस स्वागत पृष्ठ पर | Back to Welcome",
    icon: <LogoutIcon />,
    link: "/",
    id: ""
  }
];

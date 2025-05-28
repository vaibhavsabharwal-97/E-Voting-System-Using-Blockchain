import { Typography } from "@mui/material";

export const ErrorMessage = ({ message }) => {
  return (
    <Typography
      variant="inherit"
      sx={{ 
        color: "error.main", 
        fontSize: "0.75rem",
        marginTop: "3px",
        marginLeft: "14px"
      }}
    >
      {message || "Error"}
    </Typography>
  );
};

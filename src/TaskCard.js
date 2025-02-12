import React from "react";
import { Card, CardContent, Typography, Chip, Box } from "@mui/material";
import { styled } from "@mui/system";

const PriorityChip = styled(Chip)(({ priority }) => ({
  backgroundColor: priority === "High" ? "#f28b82" : priority === "Medium" ? "#fbbc04" : "#a7c7e7",
  color: "#fff",
  fontWeight: "bold",
  borderRadius: "16px",
  padding: "4px 8px",
  fontSize: "12px",
}));

const CategoryChip = styled(Chip)(() => ({
  backgroundColor: "#e6e0ff",
  color: "#5d3fd3",
  fontWeight: "bold",
  borderRadius: "16px",
  padding: "4px 8px",
  fontSize: "12px",
}));

const TaskCard = ({ task }) => {
  return (
    <Card sx={{ width: 350, borderRadius: 2, boxShadow: 3, padding: 2, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {task.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {task.text || "No description"}
        </Typography>
        <Typography variant="body2" fontWeight="bold" gutterBottom>
          Due: {task.duedAt ? new Date(task.duedAt).toLocaleDateString() : "No due date"}
        </Typography>
        <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
          <PriorityChip label={task.priority || "No Priority"} priority={task.priority} />
          <CategoryChip label={task.category || "General"} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default TaskCard;

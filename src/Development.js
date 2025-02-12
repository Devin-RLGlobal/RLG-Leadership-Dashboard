import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Grid, Card, CardContent, Typography, Chip, Button, Box } from '@mui/material';

const names = ["Kazmierczak", "Sprung", "Hiscock", "Younis", "Nobles", "Glynn", "Komatineni", "Moure"];

function TaskBoard() {
  const [projects, setProjects] = useState({});
  const [loading, setLoading] = useState(true);
  const [skipCount, setSkipCount] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);

  useEffect(() => {
    fetchProjects(skipCount);
  }, [skipCount]);

  const priorityRank = { "High": 3, "Medium": 2, "Low": 1 };

  const appendUserProjects = (newData) => {
    setProjects((prevProjects) => {
      const updatedProjects = { ...prevProjects };

      newData.forEach((item) => {
        item.users.forEach((user) => {
          if (!names.includes(user.lastName)) return;

          if (!updatedProjects[user.id]) {
            updatedProjects[user.id] = { user: user, tasks: [] };
          }

          const existingProjectIds = new Set(updatedProjects[user.id].tasks.map((p) => p.id));

          if (!existingProjectIds.has(item.id)) {
            updatedProjects[user.id].tasks.push(item);
          }

          updatedProjects[user.id].tasks.sort((a, b) => {
            const priorityA = priorityRank[a.customFields?.find(f => f.name === "Priority")?.value] || 1;
            const priorityB = priorityRank[b.customFields?.find(f => f.name === "Priority")?.value] || 1;
            return priorityB - priorityA;
          });

          updatedProjects[user.id].tasks = updatedProjects[user.id].tasks.slice(0, 3);
        });
      });

      return updatedProjects;
    });
  };

  const fetchProjects = async (currentSkip) => {
    try {
      const response = await axios.get(`http://localhost:3000/todos?skip=${currentSkip}`);
      const newProjects = response.data.data.todoQueries.todos.items;
      appendUserProjects(newProjects);
      setHasNextPage(response.data.data.todoQueries.todos.pageInfo.hasNextPage);
      setSkipCount(response.data.data.todoQueries.todos.pageInfo.perPage);
    } catch (error) {
      console.error("Error fetching projects", error);
    }
    setLoading(false);
  };

  const trimDescription = (text, maxLength = 100) => {
    if (!text) return "No description";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  return (
    <Container 
      maxWidth="xl" 
      sx={{ paddingY: 4, margin: '1vw', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      {loading ? (
        <Typography variant="h6">Loading...</Typography>
      ) : (
        Object.keys(projects)
          .filter((userId) => names.includes(projects[userId].user.lastName))
          .map((userId) => {
            const userData = projects[userId].user;
            const userTasks = projects[userId].tasks;

            const displayName = userData.firstName && userData.lastName
              ? `${userData.firstName} ${userData.lastName}`
              : `User ID: ${userId}`;

            return (
              <Box 
                key={userId} 
                sx={{ 
                  paddingBottom: 4, 
                  backgroundColor: '#f8f9fa', 
                  padding: 3, 
                  borderRadius: 2, 
                  width: '100%', 
                  maxWidth: '1200px'
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 'bold', paddingBottom: 1 }}>
                  {displayName}
                </Typography>
                <hr />

                <Grid 
  container 
  spacing={4} 
  justifyContent="space-between" 
  alignItems="stretch"
  sx={{ flexWrap: "wrap", width: "100%" }} 
>
  {userTasks.map((task) => (
    <Grid item xs={12} sm={6} md={4} lg={4} key={`${userId}-${task.uid}`}>
      <Card sx={{ 
        width: "100%", 
        minWidth: "250px",
        minHeight: "160px",  
        display: "flex", 
        flexDirection: "column", 
        justifyContent: "space-between", 
        boxShadow: 3, 
        borderRadius: 2,
        padding: 1,
      }}>
        <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}> 
          <Typography variant="body1" sx={{ fontWeight: "bold", fontSize: "0.9rem" }}>{task.title}</Typography>
          <Typography variant="body2" color="textSecondary" sx={{ fontSize: "0.8rem", flexGrow: 1 }}>
            {trimDescription(task.text)}
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ fontSize: "0.8rem", marginBottom: 1 }}>
            Due: {task.duedAt ? new Date(task.duedAt).toLocaleDateString() : "No due date"}
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            <Chip 
              label={task.customFields[4]?.value || "No Priority"} 
              color={task.customFields[4]?.value === "High" ? "error" : task.customFields[4]?.value === "Medium" ? "warning" : "default"} 
              sx={{ fontSize: "0.7rem", fontWeight: "bold", height: "20px" }}
            />
            <Chip 
              label={task.customFields[1]?.value || "General"} 
              sx={{ backgroundColor: "#6c63ff", color: "white", fontSize: "0.7rem", fontWeight: "bold", height: "20px" }}
            />
          </Box>
        </CardContent>
      </Card>
    </Grid>
  ))}
</Grid>

              </Box>
            );
          })
      )}
      {hasNextPage && (
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => setSkipCount((prev) => prev + 10)}
          sx={{ marginTop: 2 }}
        >
          Load More
        </Button>
      )}
    </Container>
  );
}

export default TaskBoard;

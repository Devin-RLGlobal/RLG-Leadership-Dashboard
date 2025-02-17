import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
  TableSortLabel,
  Typography
} from "@mui/material";
import { styled } from "@mui/system";

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: "#f9f9f9",
  },
  "&:hover": {
    backgroundColor: "#f1f3ff",
    transition: "0.2s ease-in-out",
  },
}));

const PriorityChip = styled(Chip)(({ priority }) => ({
  borderRadius: "15px",
  fontWeight: "bold",
  fontSize: "0.85rem",
  color: priority === "High" ? "#d32f2f" : priority === "Medium" ? "#ff9800" : "#388e3c",
  backgroundColor: priority === "High" ? "#fce4e4" : priority === "Medium" ? "#fff3e0" : "#e8f5e9",
}));

const TypeChip = styled(Chip)(({ type }) => ({
  borderRadius: "15px",
  fontWeight: "bold",
  fontSize: "0.85rem",
  color: type === "Game Changers" ? "#d32f2f" : type === "Fundamentals" ? "#ff9800" : type === "External Marketing" ? "#d32f2f" :"#388e3c",
  backgroundColor: type === "Game Changers" ? "#fce4e4" : type === "Fundamentals" ? "#fff3e0" : type === "External Marketing" ? "#fce4e4" : "#e8f5e9",
}));

function TaskTable() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [sortOrder, setSortOrder] = useState("asc"); // "asc" or "desc"
  const [sortBy, setSortBy] = useState("priority"); // Sorting key: "priority" or "title"

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get("https://sea-lion-app-hcfn5.ondigitalocean.app:8080/todos"); 
      const newProjects = response.data.data.todoQueries.todos.items;
      const uniqueTasks = new Set();

      const formattedTasks = newProjects
        .flatMap((item) =>
          item.users.map((user) => {
            const taskId = `${item.id}-${user.id}-${item.createdBy.fullName}`;

            if (!uniqueTasks.has(taskId)) {
              uniqueTasks.add(taskId);
              return {
                id: taskId,
                title: item.title,
                description: item.text || "No description",
                dueDate: item.duedAt ? new Date(item.duedAt).toLocaleDateString() : "No due date",
                priority: item.customFields[4]?.value ?? "Low",
                assignee: `${user.firstName} ${user.lastName}`,
                tag: item.todoList.title,
                requestor: item.customFields[2]?.value ?? "",
              };
            }
            return null;
          })
        )
        .filter(Boolean);

      setTasks(formattedTasks);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching projects", error);
      setLoading(false);
    }
  };

  // Sorting priorities order
  const priorityOrder = { High: 1, Medium: 2, Low: 3 };

  // Toggle sorting order
  const toggleSortOrder = (column) => {
    if (sortBy === column) {
      setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortOrder("desc"); // Default to descending when switching sort columns
    }
  };

  // Sorting logic
  const sortedTasks = [...tasks]
    .filter(
      (task) =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filterType ? task.tag === filterType : true)
    )
    .sort((a, b) => {
      if (sortBy === "priority") {
        const priorityA = priorityOrder[a.priority] || 4;
        const priorityB = priorityOrder[b.priority] || 4;
        return sortOrder === "asc" ? priorityA - priorityB : priorityB - priorityA;
      } else {
        return sortOrder === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
      }
    });

  return (
    <Container maxWidth="xl" sx={{ paddingY: 4 }}>
      <Paper sx={{ padding: 3, marginBottom: 2, borderRadius: "12px", backgroundColor: "#fff" }}>
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            label="Search projects..."
            variant="outlined"
            fullWidth
            sx={{ marginBottom: 2, backgroundColor: "white", borderRadius: "8px" }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Filter by Stage</InputLabel>
            <Select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              sx={{ backgroundColor: "white", borderRadius: "8px" }}
            >
              <MenuItem value="">All Types</MenuItem>
              <MenuItem value="Game Changers">Game Changers</MenuItem>
              <MenuItem value="Fundamentals">Fundamentals</MenuItem>
              <MenuItem value="Parking Lot">Parking Lot</MenuItem>
              <MenuItem value="External Marketing">External Marketing</MenuItem>
              <MenuItem value="Internal Marketing">Internal Marketing</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      <TableContainer
        component={Paper}
        sx={{ borderRadius: "12px", boxShadow: 3, backgroundColor: "#f8f9fa" }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#eeeeee" }}>
              <TableCell sx={{ fontWeight: "bold", cursor: "pointer" }}>
                <TableSortLabel
                  active={sortBy === "title"}
                  direction={sortOrder}
                  onClick={() => toggleSortOrder("title")}
                >
                  Project Title
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Assignee</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Requestor</TableCell>
              <TableCell sx={{ fontWeight: "bold", cursor: "pointer" }}>
                <TableSortLabel
                  active={sortBy === "priority"}
                  direction={sortOrder}
                  onClick={() => toggleSortOrder("priority")}
                >
                  Priority
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Due Date</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Stage</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <StyledTableRow>
                <TableCell colSpan={7} align="center">
                  Loading...
                </TableCell>
              </StyledTableRow>
            ) : (
              sortedTasks.map((task) => (
                <StyledTableRow key={task.id}>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.assignee}</TableCell>
                  <TableCell>{task.requestor}</TableCell>
                  <TableCell>
                    <PriorityChip label={task.priority} priority={task.priority} />
                  </TableCell>
                  <TableCell>{task.dueDate}</TableCell>
                  <TableCell
  sx={{
    maxWidth: 250, // Adjust width as needed
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  }}
  title={task.description} // Show full text on hover
>
  <Typography noWrap variant="body2">
    {task.description}
  </Typography>
</TableCell>
                  <TableCell>
                    <TypeChip label={task.tag} type={task.tag} />
                  </TableCell>
                </StyledTableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default TaskTable;

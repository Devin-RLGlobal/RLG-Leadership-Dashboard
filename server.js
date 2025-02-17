require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');
const cors = require('cors');

const app = express();

app.use(cors());

const API_URL = 'https://api.blue.cc/graphql';
const TOKEN_ID = process.env.TOKEN_ID;
const SECRET_ID = process.env.SECRET_ID;;

async function fetchTodos(skip) {
const query = `
query ListOfRecordsBetweenAStartAndDueDate {
  todoQueries {
    todos(
      filter: {
        companyIds: ["cm1axd0ao03mftmfmbqn5ptzf"]
      },
      limit: 500
    ) {
      items {
        id
        uid
        position
        title
        text
        html
        startedAt
        duedAt
        timezone
        color
        cover
        done
        createdBy {
          fullName
        }
        users {
          firstName
        }
        customFields {
          value
          name
        }
          todoList {
id
title
}
        users {
          fullName
          lastName
          id
        }
        tags {
          id
          color
          title
        }
      }
      pageInfo {
        totalPages
        totalItems
        perPage
      }
    }
  }
}
`;
  try {
    const response = await axios.post(
      API_URL,
      { query },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-bloo-token-id': TOKEN_ID,
          'x-bloo-token-secret': SECRET_ID,
          'x-bloo-company-id': 'rl-global-logistics'
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(`Error fetching todos: ${error.response.data}`);
    } else {
      throw new Error(`Error: ${error.message}`);
    }
  }
}


async function fetchProjects() {
  const query = `
query Items {
  customFields(filter: {projectId: "rlg-it"}) {
    items {
      project {
        tags {
          todoTags {
            todo {
              title
            }
          }
        }
      }
    }
  }
}
  `;
    try {
      const response = await axios.post(
        API_URL,
        { query },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-bloo-token-id': TOKEN_ID,
            'x-bloo-token-secret': SECRET_ID,
            'x-bloo-company-id': 'rl-global-logistics'
          },
        }
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(`Error fetching assignees: ${error.response.data}`);
      } else {
        throw new Error(`Error: ${error.message}`);
      }
    }
  }


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});





async function fetchActivities() {
  const query = `
query Activities {
  project {
    activities {
      id
    }
  }
} 
  `;
    try {
      const response = await axios.post(
        API_URL,
        { query },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-bloo-token-id': TOKEN_ID,
            'x-bloo-token-secret': SECRET_ID,
            'x-bloo-company-id': 'rl-global-logistics'
          },
        }
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(`Error fetching assignees: ${error.response.data}`);
      } else {
        throw new Error(`Error: ${error.message}`);
      }
    }
  }




app.get('/todos', async (req, res, next) => {
  const page = parseInt(req.query.skip, 10) || 0;
  try {
    const todos = await fetchTodos(page);
    res.json(todos);
  } catch (error) {
    next(error);
  }
});

app.get('/projects', async (req, res, next) => {
  try {
    const projcets = await fetchProjects();
    res.json(projcets);
  } catch (error) {
    next(error);
  }
});
app.get('/activities', async (req, res, next) => {
  try {
    const activities = await fetchActivities();
    res.json(activities);
  } catch (error) {
    next(error);
  }
});
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send({ error: err.message });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

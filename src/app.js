const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs, likes } = request.body;
  const id = uuid();

  if (!isUuid(id)) {
    return response.status(400).json({ error: "Invalid repository ID." });
  }

  const repository = {
    id,
    url,
    title,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex((r) => r.id === id);

  if (repositoryIndex === -1) {
    return response.status(400).json({ error: "Repository not found." });
  }

  const { likes } = repositories[repositoryIndex];

  // dessa forma eu crio um NOVO objeto e coloco no lugar do que será alterado
  const repository = {
    id,
    title,
    url,
    techs,
    likes,
  };

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (req, res) => {
  const { id } = req.params;

  const repositoryIndex = repositories.findIndex((r) => r.id === id);

  if (repositoryIndex === -1) {
    return res.status(400).json({ error: "Repository not found." });
  }

  repositories.splice(repositoryIndex, 1);

  return res.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repository = repositories.find((r) => r.id === id);

  if (!repository) {
    return response.status(400).json({ error: "Repository not found." });
  }

  repository.likes += 1;

  return response.json(repository);
});

module.exports = app;

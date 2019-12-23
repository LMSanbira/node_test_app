const express = require("express");
const Joi = require("joi");
const app = express();
app.use(express.json());

const gems = [
  { id: 1, name: "pearl" },
  { id: 2, name: "garnet" }
];

app.get("/", (req, res) => {
  res.send("Hello World!!!");
});

app.get("/api/gems", (req, res) => {
  res.send(gems);
});

app.get("/api/gems/:id", (req, res) => {
  const gem = gems.find(g => g.id === parseInt(req.params.id));
  if (!gem) return res.status(404).send("gem not found");

  res.send(gem.name);
});

app.post("/api/gems", (req, res) => {
  const error = validateGemParams(req.body, res);

  if (error) return res.status(400).send(error.details[0].message);

  const gem = {
    id: newId(),
    name: req.body.name
  };

  gems.push(gem);
  res.send(gem);
});

app.put("/api/gems/:id", (req, res) => {
  const error = validateGemParams(req.body, res);

  if (error) return res.status(400).send(error.details[0].message);

  const gem = gems.find(g => g.id === parseInt(req.params.id));
  if (!gem) return res.status(404).send("gem not found");

  gem.name = req.body.name;

  res.send(gem);
});

app.delete("/api/gems/:id", (req, res) => {
  const gem = gems.find(g => g.id === parseInt(req.params.id));
  if (!gem) return res.status(404).send("gem not found");

  gems.splice(gems.indexOf(gem), 1);

  res.send(gem);
});

function validateGemParams(gem) {
  const schema = {
    name: Joi.string()
      .min(2)
      .required()
  };

  return Joi.validate(gem, schema).error;
}

function newId() {
  return gems[gems.length - 1].id + 1;
}

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`listening to ${port}`);
});

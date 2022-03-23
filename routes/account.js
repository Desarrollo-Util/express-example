import { Router } from "express";
import { USERS_BBDD } from "../bbdd.js";

const accountRouter = Router();

//Middleware que loguea la ip
accountRouter.use((req, res, next) => {
  console.log(req.ip);

  next();
});

//Obtener los detalles de una cuenta a partir del guid
accountRouter.get("/:guid", (req, res) => {
  const { guid } = req.params;
  const user = USERS_BBDD.find((user) => user.guid === guid);

  if (!user) return res.status(404).send();

  return res.send(user);
});

//Crear una nueva cuenta a partir de guid y name
accountRouter.post("/", (req, res) => {
  const { guid, name } = req.body;

  if (!guid || !name) return res.state(400).send();

  const user = USERS_BBDD.find((user) => user.guid === guid);
  if (user) return res.status(409).send();

  USERS_BBDD.push({
    guid,
    name,
  });

  return res.send();
});

//Actualizar el nombre de una cuenta
accountRouter.patch("/:guid", (req, res) => {
  const { guid } = req.params;
  const { name } = req.body;

  if (!name) return res.state(400).send();

  const user = USERS_BBDD.find((user) => user.guid === guid);

  if (!user) res.status(404).send();

  user.name = name;

  return res.send();
});

//Eliminar una cuenta
accountRouter.delete("/:guid", (req, res) => {
  const { guid } = req.params;
  const userIndex = USERS_BBDD.findIndex((user) => user.guid === guid);

  if (userIndex === -1) return res.status(404).send();

  USERS_BBDD.splice(userIndex, 1);

  return res.send();
});

export default accountRouter;

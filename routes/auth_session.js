import { Router } from "express";
import authByEmailPwd from "../helpers/auth-by-email-pwd.js";

const authSessionRouter = Router();

//Login con email y password
authSessionRouter.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.sendStatus(400);

  try {
    const user = authByEmailPwd(email, password);

    return res.send(`Usuario ${user.name} autenticado`);
  } catch (err) {
    return res.sendStatus(401);
  }
});

//Solicitud autenticada con session

export default authSessionRouter;

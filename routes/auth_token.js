import { Router } from "express";
import { jwtVerify, SignJWT } from "jose";
import { USERS_BBDD } from "../bbdd.js";
import validateLoginDTO from "../dto/validate_login_dto.js";
import authByEmailPwd from "../helpers/auth-by-email-pwd.js";

const authTokenRouter = Router();

//Login con email y password
authTokenRouter.post("/login", validateLoginDTO, async (req, res) => {
  const { email, password } = req.body;

  try {
    const { guid } = authByEmailPwd(email, password);

    //GENERAR TOKEN Y DEVOLVER TOKEN
    const jwtConstructor = new SignJWT({ guid });

    const encoder = new TextEncoder();
    const jwt = await jwtConstructor
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setIssuedAt()
      .setExpirationTime("1h")
      .sign(encoder.encode(process.env.JWT_PRIVATE_KEY));

    return res.send({ jwt });
  } catch (err) {
    return res.sendStatus(401);
  }
});

//Solicitud autenticada con token para obtener el perfil del usuario
authTokenRouter.get("/profile", async (req, res) => {
  const { authorization } = req.headers;

  if (!authorization) return res.sendStatus(401);

  try {
    const encoder = new TextEncoder();
    const { payload } = await jwtVerify(
      authorization,
      encoder.encode(process.env.JWT_PRIVATE_KEY)
    );

    const user = USERS_BBDD.find((user) => user.guid === payload.guid);

    if (!user) return res.sendStatus(401);

    delete user.password;

    return res.send(user);
  } catch (err) {
    return res.sendStatus(401);
  }
});

export default authTokenRouter;

import dotenv from "dotenv";
import express from "express";
import accountRouter from "./routes/account.js";

dotenv.config();

const PORT = process.env.PORT || 3000;
const expressApp = express();

expressApp.use(express.json());
expressApp.use(express.text());
expressApp.use("/account", accountRouter);

expressApp.get("/raiz", (req, res) => {
  res.send();
});

expressApp.listen(PORT, () =>
  console.log(`Servidor levantado en el puerto ${PORT}`)
);

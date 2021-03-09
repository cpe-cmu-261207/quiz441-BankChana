import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { body, query, validationResult } from "express-validator";

const SECRET_KEY = process.env.SECRET_KEY as string;

const app = express();
app.use(bodyParser.json());
app.use(cors());

const PORT = process.env.PORT || 3000;
const SECRET = "SIMPLE_SECRET";

interface JWTPayload {
  users: User[];
}

interface User {
  username: string;
  password: string;
}

type LoginArgs = Pick<User, "username" | "password">;

app.post<any, any, LoginArgs>("/login", (req, res) => {
  const { username, password } = req.body;
  // Use username and password to create token.
  const body = req.body;
  const raw = cors.readFileSync("db.json", "utf8");
  const db: JWTPayload = JSON.parse(raw);
  const user = db.users.find((user) => user.username === body.username);
  if (!user) {
    res.status(400);
    res.json({ message: "Invalid username or password" });
    return;
  }
  res.status(400);
  res.json({ message: "Login succesfully" });
  const token = jwt.sign(
    { username: user.username, password: user.password },
    SECRET_KEY
  );
  res.json({ token });
  return;
});

type LoginArgs = Pick<User, "username" | "password">;

app.post<any, any, any, any, LoginArgs>("/register", (req, res) => {
  const { username, password, firstname, lastname, balance } = req.body;
  const body = req.body;
  const raw = cors.readFileSync("db.json", "utf8");
  const db: JWTPayload = JSON.parse(raw);
  const hashPassword = bcrypt.hashSync(body.password, 10);
  db.users.push({
    ...body,
    id: Date.now(),
    password: hashPassword
  });
  cors.writeFileSync("db.json", JSON.stringify(db));
  res.status(200);
  res.json({ message: "Register successfully" });
});

app.get("/balance", (req, res) => {
  const token = req.query.token as string;
  try {
    const { username } = jwt.verify(token, SECRET) as JWTPayload;
  } catch (e) {
    return res.status(401).json({
      message: "Invalid token"
    });
  }
});

app.post("/deposit", body("amount").isInt({ min: 1 }), (req, res) => {
  //Is amount <= 0 ?
  if (!validationResult(req).isEmpty())
    return res.status(400).json({ message: "Invalid data" });

  if (!validationResult)
    return res.status(401).json({ message: "Invalid data" });
});

app.post("/withdraw", (req, res) => {});

app.delete("/reset", (req, res) => {
  //code your database reset here

  return res.status(200).json({
    message: "Reset database successfully"
  });
});

app.get("/me", (req, res) => {
  res.send({
    firstname: "Chanathip",
    lastname: "Songchanthuek",
    age: 19,
    ID: 6206102145
  });
});

app.get("/demo", (req, res) => {
  return res.status(200).json({
    message: "This message is returned from demo route."
  });
});

app.listen(PORT, () => console.log(`Server is running at ${PORT}`));

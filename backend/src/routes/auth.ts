import express, { Request, Response } from "express";

const router = express.Router();

router.post("/login", (req: Request, res: Response) => { 
  const {
    username,
    password
  } = req.body;

  res.send({ msg: `message from login, username: ${username}, password: ${password}` });
});

export default router;

import express, { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { supabase } from "../supabase";

const router = express.Router();
const authService = new AuthService(supabase);

router.post("/login", async (req: Request, res: Response) => { 
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Username and password are required." });
    }

    const result: any = await authService.login(username, password);

    if (result.success) {
      return res.json({ success: true, token: result.token, userRole: result.userRole });
    }

    // Map service error codes to HTTP statuses with clearer messages
    switch (result.code) {
      case "USER_NOT_FOUND":
        return res.status(404).json({ success: false, message: result.message || "User account does not exist." });
      case "WRONG_PASSWORD":
        return res.status(401).json({ success: false, message: result.message || "Incorrect password." });
      case "PASSWORD_HASH_INVALID":
        return res.status(500).json({ success: false, message: result.message || "Stored password hash is invalid. Please contact support." });
      case "PASSWORD_VERIFY_ERROR":
        return res.status(500).json({ success: false, message: result.message || "Password verification failed. Please try again or reset your password." });
      case "TOKEN_SIGN_ERROR":
        return res.status(500).json({ success: false, message: result.message || "Failed to create session token. Please try again." });
      case "UNEXPECTED_ERROR":
      default:
        return res.status(500).json({ success: false, message: result.message || "An unexpected error occurred during login." });
    }
  } catch (error: any) {
    // Ensure no unhandled exceptions bubble up to API Gateway
    console.error("/api/login route error:", error);
    return res.status(500).json({ success: false, message: "An unexpected error occurred during login." });
  }
});

router.post("/register", async (req: Request, res: Response) => {
  const { username, password, user_role, department, fullname, mailid } =
    req.body;

  if (
    !username ||
    !password ||
    !user_role ||
    !department ||
    !fullname ||
    !mailid
  ) {
    return res
      .status(400)
      .json({
        success: false,
        message:
          "Username, password, user role, department, full name, and mail ID are required.",
      });
  }

  const result = await authService.register(
    username,
    password,
    user_role,
    department,
    fullname,
    mailid
  );

  if (result.success) {
    res
      .status(201)
      .json({
        success: true,
        message: "User registered successfully.",
        user: result.user,
      });
  } else {
    res.status(400).json({ success: false, message: result.message });
  }
});

export default router;

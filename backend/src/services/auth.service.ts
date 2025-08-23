import { SupabaseClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export class AuthService {
  private supabase: SupabaseClient;
  private jwtSecret: string;

  constructor(supabaseClient: SupabaseClient) {
    this.supabase = supabaseClient;

    // Ensure JWT_SECRET is provided
    if (!process.env.JWT_SECRET) {
      console.error(
        "ERROR: JWT_SECRET environment variable is required but not set."
      );
      console.error(
        "Please set JWT_SECRET in your environment variables or .env file."
      );
      console.error("For development, you can generate a secure secret using:");
      console.error(
        "  node -e \"console.log(require('crypto').randomBytes(64).toString('hex'))\""
      );
      process.exit(1);
    }

    this.jwtSecret = process.env.JWT_SECRET;
  }

  async login(username: string, password: string) {
    try {
      // 1. Find user by username in your database (e.g., a 'users' table)
      const { data: userData, error: userError } = await this.supabase
        .from("publishers") // Replace 'users' with your actual user table name
        .select("id, username, hashed_password, user_role") // Select necessary fields including user_role
        .eq("username", username)
        .single();

      if (userError || !userData) {
        return {
          success: false,
          code: "USER_NOT_FOUND",
          message: "User account does not exist.",
        };
      }

      // 2. Compare provided password with stored hashed password
      if (
        !userData.hashed_password ||
        typeof userData.hashed_password !== "string"
      ) {
        return {
          success: false,
          code: "PASSWORD_HASH_INVALID",
          message: "Stored password hash is invalid. Please contact support.",
        };
      }

      let isPasswordValid = false;
      try {
        isPasswordValid = await bcrypt.compare(
          password,
          userData.hashed_password
        );
      } catch (err: any) {
        return {
          success: false,
          code: "PASSWORD_VERIFY_ERROR",
          message:
            "Password verification failed. Please try again or reset your password.",
        };
      }

      if (!isPasswordValid) {
        return {
          success: false,
          code: "WRONG_PASSWORD",
          message: "Incorrect password.",
        };
      }

      // 3. Generate JWT token
      let token: string;
      try {
        token = jwt.sign(
          {
            userId: userData.id,
            username: userData.username,
            role: userData.user_role,
          },
          this.jwtSecret,
          { expiresIn: "90d" } // Token expires in ~3 months
        );
      } catch (err: any) {
        return {
          success: false,
          code: "TOKEN_SIGN_ERROR",
          message: "Failed to create session token. Please try again.",
        };
      }

      return { success: true, token, userRole: userData.user_role };
    } catch (err: any) {
      // Catch-all to avoid Lambda 502s
      console.error("Login unexpected error:", err);
      return {
        success: false,
        code: "UNEXPECTED_ERROR",
        message: "An unexpected error occurred during login.",
      };
    }
  }

  async register(
    username: string,
    password: string,
    user_role: string,
    department: string,
    fullname: string,
    mailid: string
  ) {
    // Check if username already exists
    const { data: existingUser, error: existingUserError } = await this.supabase
      .from("publishers")
      .select("id")
      .eq("username", username)
      .single();

    if (existingUser) {
      return { success: false, message: "Username already taken." };
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    // Insert new user into the database
    const { data: newUser, error: insertError } = await this.supabase
      .from("publishers")
      .insert([
        {
          username,
          hashed_password: hashedPassword,
          user_role,
          department,
          fullname,
          mailid,
        },
      ])
      .select("id, username, user_role, department, fullname, mailid")
      .single();

    if (insertError || !newUser) {
      console.error("Registration error:", insertError);
      return { success: false, message: "User registration failed." };
    }

    return {
      success: true,
      user: {
        id: newUser.id,
        username: newUser.username,
        user_role: newUser.user_role,
        department: newUser.department,
        fullname: newUser.fullname,
        mailid: newUser.mailid,
      },
    };
  }
}

import express, { Request, Response } from "express";
import { supabase } from "../supabase";
import { StudentService } from "../services/student.service";

const router = express.Router();
const studentService = new StudentService(supabase);

router.get("/events", async (req: Request, res: Response) => {
  try {
    const { dept = '', type = '', name = '' } = req.query as { dept: string, type: string, name: string };
    const result = await studentService.getEvents(dept, type, name);
    
    if (!result.success) {
      return res.status(500).json(result);
    }
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: "An unexpected error occurred.", error: error.message });
  }
});

router.get("/events/:eventId", async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const result = await studentService.getEventById(eventId);
    
    if (!result.success) {
      return res.status(404).json(result);
    }
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: "An unexpected error occurred.", error: error.message });
  }
});

export default router;

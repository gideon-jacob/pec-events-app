import express, { Request, Response } from "express";
import { supabase } from "../supabase";
import { PublisherService } from "../services/publisher.service";
import multer from "multer";

const router = express.Router();
const publisherService = new PublisherService(supabase);

// Configure multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

router.get("/events", async (req: Request, res: Response) => {
  try {
    const { dept = '', type = '', name = '' } = req.query as { dept: string, type: string, name: string };
    const result = await publisherService.getEvents(dept, type, name);
    
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
    const result = await publisherService.getEventById(eventId);
    
    if (!result.success) {
      return res.status(404).json(result); // 404 if event not found
    }
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: "An unexpected error occurred.", error: error.message });
  }
});

router.put("/events/:eventId", upload.single('image'), async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const { data } = req.body;
    const imageFile = req.file;

    if (!data && !imageFile) {
      return res.status(400).json({ success: false, message: "Event update requires data or an image." });
    }

    let eventData = {};
    if (data) {
      try {
        eventData = JSON.parse(data);
      } catch (e) {
        return res.status(400).json({ success: false, message: "Invalid JSON in 'data' field." });
      }
    }

    const result = await publisherService.updateEvent(eventId, eventData, imageFile);
    
    if (!result.success) {
      return res.status(500).json(result);
    }
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: "An unexpected error occurred.", error: error.message });
  }
});

router.post("/events", upload.single('image'), async (req: Request, res: Response) => {
  try {
    const { data } = req.body;

    if (!data) {
      return res.status(400).json({ success: false, message: "Missing required 'data' in request body." });
    }
    
    let eventData;
    try {
      eventData = JSON.parse(data);
    } catch (error) {
      return res.status(400).json({ success: false, message: "Invalid 'data' format. Expected a JSON object." });
    }

    if (typeof eventData !== 'object' || eventData === null) {
      return res.status(400).json({ success: false, message: "Invalid 'data' format. Expected a JSON object." });
    } 

    const {
      title,
      description,
      eventType,
      date,
      startTime,
      endTime,
      venue,
      mode,
      eligibility,
      fee,
      registrationLink,
      organizers,
      contacts
    } = eventData;
    
    const username = req.user?.username as string;
    const imageFile = req.file; // Multer attaches the file to req.file

    // Basic validation
    if (!title || !description || !eventType || !date || !startTime || !endTime || !venue || !mode || !eligibility || !fee || !organizers || !contacts) {
        return res.status(400).json({ success: false, message: "Missing required event fields." });
    }

    const result = await publisherService.createEvent(
      title,
      description,
      eventType,
      date,
      startTime,
      endTime,
      venue,
      mode,
      eligibility,
      fee,
      registrationLink,
      organizers,
      contacts,
      username,
      imageFile
    );

    if (!result.success) {
      return res.status(500).json(result);
    }
    res.status(201).json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: "An unexpected error occurred.", error: error.message });
  }
});

router.delete("/events/:eventId", async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const result = await publisherService.deleteEvent(eventId);
    
    if (!result.success) {
      return res.status(500).json(result);
    }
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: "An unexpected error occurred.", error: error.message });
  }
});

router.get("/profile", async (req: Request, res: Response) => {
  try {
    // The userId is added to req.user via authentication middleware
    const userId = req.user?.userId as string;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized: User ID not found." });
    }

    const result = await publisherService.getProfile(userId);
    if (!result.success) {
      return res.status(500).json(result);
    }
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: "An unexpected error occurred.", error: error.message });
  }
});

export default router;


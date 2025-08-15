import express, { Request, Response } from "express";
import { supabase } from "../supabase";
import { PublisherService } from "../services/publisher.service";
import multer from "multer";

const router = express.Router();
const publisherService = new PublisherService(supabase);

// Configure multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

router.get("/events", async (req: Request, res: Response) => {
  const { dept = '', type = '', name = '' } = req.query as { dept: string, type: string, name: string };
  const result = await publisherService.getEvents(dept, type, name);
  res.json(result);
});

router.get("/events/:eventId", async (req: Request, res: Response) => {
  const { eventId } = req.params;
  const result = await publisherService.getEventById(eventId);
  res.json(result);
});

router.put("/events/:eventId", upload.single('image'), async (req: Request, res: Response) => {
  const { eventId } = req.params;
  const imageFile = req.file;
  const result = await publisherService.updateEvent(eventId, imageFile);
  res.json(result);
});

router.post("/events", upload.single('image'), async (req: Request, res: Response) => {
  const { data } = req.body;

  if (!data) {
    return res.status(400).json({ success: false, message: "Missing required 'data' in request body." });
  }

  const eventData = JSON.parse(data);

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
    eligibility,
    fee,
    registrationLink,
    organizers,
    contacts
  } = eventData;
  
  const username = req.user?.username as string;
  const imageFile = req.file; // Multer attaches the file to req.file

  // Basic validation
  if (!title || !description || !eventType || !date || !startTime || !endTime || !venue || !eligibility || !fee || !organizers || !contacts) {
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
    eligibility,
    fee,
    registrationLink,
    organizers,
    contacts,
    username,
    imageFile
  );
  res.status(201).json(result);
});

router.delete("/events/:eventId", async (req: Request, res: Response) => {
  const { eventId } = req.params;
  const result = await publisherService.deleteEvent(eventId);
  res.json(result);
});

router.get("/profile", async (_req: Request, res: Response) => {
  const result = await publisherService.getProfile();
  res.send(result);
});

export default router;


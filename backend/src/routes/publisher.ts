import express, { Request, Response } from "express";
import { supabase } from "../supabase";
import { PublisherService } from "../services/publisher.service";

const router = express.Router();
const publisherService = new PublisherService(supabase);

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

router.put("/events/:eventId", async (req: Request, res: Response) => {
  const { eventId } = req.params;
  const result = await publisherService.updateEvent(eventId);
  res.json(result);
});

router.post("/events", async (req: Request, res: Response) => {
  const { title, description } = req.body;
  const result = await publisherService.createEvent(title, description);
  res.send(result);
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


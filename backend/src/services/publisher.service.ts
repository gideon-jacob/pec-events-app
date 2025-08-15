import { SupabaseClient } from "@supabase/supabase-js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client, S3_BUCKET_NAME } from "../aws-s3";
import { randomBytes } from "crypto";

export class PublisherService {
  private supabase: SupabaseClient;

  constructor(supabaseClient: SupabaseClient) {
    this.supabase = supabaseClient;
  }

  private async uploadImageToS3(file: Express.Multer.File): Promise<string> {
    if (!S3_BUCKET_NAME) {
      throw new Error("S3 bucket name is not configured.");
    }

    const cloudfrontDomain = process.env.CLOUDFRONT_DOMAIN;
    if (!cloudfrontDomain) {
      throw new Error("CloudFront domain is not configured.");
    }

    const fileExtension = file.originalname.split('.').pop();
    const key = `event-thumbnails/${randomBytes(16).toString('hex')}.${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: key, // Unique file name
      Body: file.buffer,
      ContentType: file.mimetype,
      // Removed ACL since bucket blocks public ACLs and CloudFront handles access
    });

    try {
      await s3Client.send(command);
      const imageUrl = `https://${cloudfrontDomain}/${key}`;
      return imageUrl;
    } catch (error) {
      console.error("Error uploading image to S3:", error);
      throw new Error("Failed to upload image to S3.");
    }
  }

  async getEvents(dept: string, type: string, name: string) {
    // In a real application, you would have logic here to query the database
    // based on the provided parameters.
    // For now, we'll just return a message.
    return { message: `Publisher events for department: ${dept}, event type: ${type}, event name: ${name}` };
  }

  async getEventById(eventId: string) {
    return { message: `Publisher event with ID: ${eventId}` };
  }

  async createEvent(
    title: string,
    description: string,
    eventType: string,
    date: string,
    startTime: string,
    endTime: string,
    venue: string,
    eligibility: string,
    fee: string,
    registrationLink: string,
    organizers: any,
    contacts: any,
    username: string,
    imageFile?: Express.Multer.File
  ) {
    let imageUrl: string | undefined;
    if (imageFile) {
      imageUrl = await this.uploadImageToS3(imageFile);
    }

    const { data: publisher, error: publisherError } = await this.supabase
      .from('publishers')
      .select('id')
      .eq('username', username)
      .single();

    if (publisherError || !publisher) {
      throw new Error('Publisher not found.');
    }

    const { data, error } = await this.supabase
      .from('events')
      .insert([
        {
          title,
          description,
          event_type: eventType,
          date,
          start_time: startTime,
          end_time: endTime,
          venue,
          eligibility,
          fee,
          registration_link: registrationLink,
          organizers,
          contacts,
          image_url: imageUrl,
          publisher_id: publisher.id,
        },
      ])
      .select();

    if (error) {
      console.error('Error creating event:', error);
      throw new Error('Failed to create event.');
    }

    return { success: true, eventId: data[0].id, message: "Event created successfully." };
  }

  async updateEvent(eventId: string, imageFile?: Express.Multer.File) {
    let imageUrl: string | undefined;
    if (imageFile) {
      imageUrl = await this.uploadImageToS3(imageFile);
    }
    // In a real application, you would update the event data in your database
    // For now, we'll just return a message with the image URL if available.
    return { message: `Publisher events for eventId: ${eventId}`, imageUrl };
  }

  async getProfile() {
    return { msg: "Message from profile route" };
  }

  async deleteEvent(eventId: string) {
    // In a real application, you would have logic here to delete the event from the database.
    // For now, we'll just return a message.
    return { message: `Event with ID: ${eventId} deleted successfully.` };
  }
}

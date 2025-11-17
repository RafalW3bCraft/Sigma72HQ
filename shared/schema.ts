import { z } from "zod";

export const userProfileSchema = z.object({
  uid: z.string(),
  email: z.string().email(),
  companyName: z.string().min(1),
  phoneNumber: z.string().min(1),
  role: z.enum(["user", "admin"]).default("user"),
  createdAt: z.number(),
});

export const insertUserProfileSchema = userProfileSchema.omit({ uid: true, createdAt: true, role: true }).extend({
  email: z.string().email(),
});

export type UserProfile = z.infer<typeof userProfileSchema>;
export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;

export const projectSchema = z.object({
  id: z.string(),
  userId: z.string(),
  serviceType: z.enum(["website", "telegram-bot", "ai-assistant", "mobile-app", "e-commerce", "other"]),
  projectName: z.string().min(1),
  description: z.string().min(10),
  timeline: z.string().optional(),
  budget: z.string().optional(),
  status: z.enum(["pending", "in-progress", "completed", "cancelled"]),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export const insertProjectSchema = projectSchema.omit({ id: true, createdAt: true, updatedAt: true });

export type Project = z.infer<typeof projectSchema>;
export type InsertProject = z.infer<typeof insertProjectSchema>;

export const portfolioItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.enum(["website", "telegram-bot", "ai-assistant", "mobile-app", "e-commerce"]),
  imageUrl: z.string().optional(),
  tags: z.array(z.string()).default([]),
  technologies: z.array(z.string()).default([]),
  client: z.string().optional(),
  duration: z.string().optional(),
  challenge: z.string().optional(),
  solution: z.string().optional(),
  outcome: z.string().optional(),
  metrics: z.array(z.object({
    label: z.string(),
    value: z.string(),
  })).optional(),
  featured: z.boolean().default(false),
  liveUrl: z.string().optional(),
  githubUrl: z.string().optional(),
  order: z.number(),
  createdAt: z.number().optional(),
  updatedAt: z.number().optional(),
});

export const insertPortfolioItemSchema = portfolioItemSchema.omit({ id: true, createdAt: true, updatedAt: true });

export type PortfolioItem = z.infer<typeof portfolioItemSchema>;
export type InsertPortfolioItem = z.infer<typeof insertPortfolioItemSchema>;

export const testimonialSchema = z.object({
  id: z.string(),
  clientName: z.string(),
  companyName: z.string(),
  rating: z.number().min(1).max(5),
  text: z.string(),
  avatarUrl: z.string().optional(),
  order: z.number(),
});

export type Testimonial = z.infer<typeof testimonialSchema>;

export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type ContactForm = z.infer<typeof contactFormSchema>;

export const contactSubmissionSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  message: z.string(),
  status: z.enum(["new", "read", "responded"]).default("new"),
  createdAt: z.number(),
  respondedAt: z.number().optional(),
});

export type ContactSubmission = z.infer<typeof contactSubmissionSchema>;

export const supportMessageSchema = z.object({
  id: z.string(),
  userId: z.string(),
  projectId: z.string().optional(),
  subject: z.string(),
  message: z.string(),
  status: z.enum(["open", "in-progress", "resolved"]),
  createdAt: z.number(),
  updatedAt: z.number().optional(),
});

export const insertSupportMessageSchema = supportMessageSchema.omit({ id: true, createdAt: true });

export type SupportMessage = z.infer<typeof supportMessageSchema>;
export type InsertSupportMessage = z.infer<typeof insertSupportMessageSchema>;

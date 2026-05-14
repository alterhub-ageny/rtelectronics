import { z } from "zod";

export const emailSchema = z.string().email("Invalid email").max(255).toLowerCase().trim();
export const passwordSchema = z.string().min(8, "Password must be at least 8 characters").max(128);
export const nameSchema = z.string().min(1, "Name is required").max(100).trim();

export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password required"),
});

export const contactSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  subject: z.string().max(200).optional(),
  message: z.string().min(1, "Message required").max(5000).trim(),
});

export const chatConversationSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  subject: z.string().max(200).optional(),
  userId: z.string().optional(),
});

export const chatMessageSchema = z.object({
  conversationId: z.string().uuid("Invalid conversation ID"),
  message: z.string().min(1, "Message required").max(2000).trim(),
  name: nameSchema,
});

export const reviewSchema = z.object({
  productId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(200).optional(),
  comment: z.string().min(1, "Comment required").max(2000).trim(),
});

export const addressSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  street: z.string().min(1).max(500),
  city: z.string().min(1).max(200),
  state: z.string().min(1).max(200),
  zip: z.string().min(1).max(20),
  country: z.string().min(1).max(200).optional(),
  phone: z.string().max(50).optional(),
});

export const orderSchema = z.object({
  items: z.array(z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    price: z.number().positive(),
    quantity: z.number().int().positive(),
  })).min(1, "Cart is empty"),
  total: z.number().positive(),
  shipping: z.number().min(0),
  tax: z.number().min(0),
  coupon: z.any().optional(),
  shippingMethod: z.string().optional(),
  giftWrap: z.boolean().optional(),
  notes: z.string().max(1000).optional(),
  address: addressSchema,
});

export const newsletterSchema = z.object({
  email: emailSchema,
});

export const couponValidateSchema = z.object({
  code: z.string().min(1).max(50).toUpperCase().trim(),
  orderTotal: z.number().positive(),
});

export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.issues.map(i => ({ field: i.path.join("."), message: i.message }));
      return res.status(400).json({ error: "Validation failed", details: errors });
    }
    req.body = result.data;
    next();
  };
}

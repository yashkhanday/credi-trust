const { z } = require("zod");

const kycSchema = z.object({
  fullName: z.string().min(2).max(100),

  dateOfBirth: z.string().min(1),

  gender: z.enum([
    "male",
    "female",
    "other",
    "prefer-not-to-say",
  ]),

  address: z.string().min(5).max(250),

  city: z.string().min(2).max(100),

  state: z.string().min(2).max(100),

  pincode: z
    .string()
    .regex(/^[1-9][0-9]{5}$/, "Invalid pincode"),

  employmentType: z.enum([
    "salaried",
    "self-employed",
    "business",
  ]),

  monthlyIncome: z.coerce.number().positive(),

  companyName: z.string().min(2).max(150),

  workExperience: z.coerce.number().min(0).max(60),

  identityType: z.enum([
    "pan",
    "authorized-provider",
  ]),
});

module.exports = {
  kycSchema,
};

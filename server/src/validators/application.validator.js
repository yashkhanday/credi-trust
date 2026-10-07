const { z } = require("zod");

const applicationSchema = z.object({
  loanId: z.string().min(1),
  loanName: z.string().min(1),
  amount: z.coerce.number().positive(),
  tenureMonths: z.coerce.number().int().positive(),
  monthlyIncome: z.coerce.number().positive(),
  employmentType: z.enum([
    "salaried",
    "self-employed",
    "business",
  ]),
});

module.exports = {
  applicationSchema,
};

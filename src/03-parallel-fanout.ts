import { Pipeline } from "@anvia/core/pipeline";
import z from "zod";
import { getModel } from "./shared";

const inputSchema = z.string().min(20);

const designReview = new Pipeline({
  id: "design-review",
  inputSchema,
})
  .parallel({
    id: "team-review",
    branches: {
      uxDesigner: new Pipeline({
        id: "ux-designer",
        inputSchema: z.string(),
      }).step({
        id: "ux-review",
        run: async ({ input }) => {
          return await getModel(
            `Review this idea from a UX Designer perspective. Focus on user needs and usability: ${input}`,
          );
        },
      }),

      pm: new Pipeline({
        id: "product-manager",
        inputSchema: z.string(),
      }).step({
        id: "pm-review",
        run: async ({ input }) => {
          return await getModel(
            `Review this idea from a Product Manager perspective. Focus on product value and business goals: ${input}`,
          );
        },
      }),

      developer: new Pipeline({
        id: "developer",
        inputSchema: z.string(),
      }).step({
        id: "dev-review",
        run: async ({ input }) => {
          return await getModel(
            `Review this idea from a Developer perspective. Focus on technical feasibility and implementation: ${input}`,
          );
        },
      }),
    },
  })
  .step({
    id: "summarize",
    run: async ({ input }) => {
      const summary = await getModel(
        `Summarize these three reviews and give a final recommendation: ${JSON.stringify(input)}`,
      );

      console.log(summary.text);
      return summary.text;
    },
  });

await designReview.run({
  input:
    "Users find it difficult to navigate the dashboard and cannot easily find important information.",
});

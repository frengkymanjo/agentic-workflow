import { Pipeline } from "@anvia/core/pipeline";
import z from "zod";
import { model } from "./shared";

const JobSchema = z.object({
  title: z.string().describe("Job title"),
  skill: z.string().describe("Required skills for the job"),
  experienceYear: z.string().describe("Required years of experience"),
  location: z.string().describe("Job location"),
});

const tavilyClient = {
  async search(jobTitle: string) {
    return {
      results: [
        {
          content: `${jobTitle} at Tokopedia. Required skills: Figma, UX Research, Wireframing, and Prototyping. Experience: 2+ years. Location: Jakarta, Indonesia.`,
        },
      ],
    };
  },
};

const Query = z.object({ jobTitle: z.string() });

const jobInfo = new Pipeline({ id: "job-info", inputSchema: Query })
  .step({
    id: "search",
    run: ({ input }) => tavilyClient.search(input.jobTitle),
  })
  .extract({
    id: "extract",
    model,
    outputSchema: JobSchema,
    instructions: "Extract the key information. If missing, return NONE.",
    text: ({ input }) => JSON.stringify(input.results),
  });

console.log(
  (await jobInfo.run({ input: { jobTitle: "UI/UX Designer" } })).output,
);

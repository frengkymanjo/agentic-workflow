import { Pipeline } from "@anvia/core/pipeline";
import z from "zod";
import { getModel, getModelJson } from "./shared";

const Goal = z.object({ goal: z.string() });
const Plan = z.object({ steps: z.array(z.string()) });

const planAndExecute = new Pipeline({ id: "plan-execute", inputSchema: Goal })
  .step({
    id: "plan",
    run: async ({ input }) => {
      const plan = await getModelJson(
        input.goal,
        Plan,
        "Break the goal into 3 steps.",
      );
      return Plan.parse(plan.output).steps;
    },
  })
  .step({
    id: "execute",
    run: ({ input: steps }) =>
      Promise.all(
        steps.map(
          async (step) =>
            (await getModel(`Do this step in two bullets: ${step}`)).text,
        ),
      ),
  });

console.log(
  (
    await planAndExecute.run({
      input: { goal: "Create an agent for designer with details" },
    })
  ).output,
);

import { NextResponse } from "next/server";
import OpenAI  from "openai";

const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY });     

export async function POST(req: Request) {
    try {
       const {question, code, input1, input2 } = await req.json();

       console.log({ question, code, input1, input2 });

      const problemUnderstandingPrompt = `
      You are an expert technical interviewer and coach.
      The candidate was presented with the following LeetCode problem:
      ---
      ${question}
      ---
      The candidate explained their understanding of the problem as follows:
      ---
      ${input1}
      ---
      Please evaluate their understanding based on:
      1.  **Correctness:** Did they correctly grasp the core problem?
      2.  **Completeness:** Did they identify critical constraints, edge cases, or potential ambiguities?
      3.  **Clarity:** Was their explanation clear, concise, and well-articulated?

      Provide actionable and constructive feedback in markdown format, focusing on "Strengths," "Areas for Improvement," and "Suggestions for Next Time."
    `;

      const solutionExplanationPrompt = `
      You are an expert technical interviewer and coach, evaluating a candidate's communication skills.
      The candidate discussed the following LeetCode problem:
      ---
      ${question}
      ---
      And provided the following code (for context):
      ---
      ${code}
      ---
      They explained their solution and thought process as follows:
      ---
      ${input2}
      ---
      Please evaluate their explanation based on:
      1.  **Clarity & Structure:** Was the explanation easy to follow, logically structured, and well-organized?
      2.  **Completeness:** Did they cover their approach, algorithm choice, data structures, and handling of edge cases?
      3.  **Complexity Analysis:** Did they discuss time and space complexity accurately?
      4.  **Alignment:** Does their explanation accurately reflect the provided code?

      Provide actionable and constructive feedback in markdown format, focusing on "Strengths," "Areas for Improvement," and "Suggestions for Next Time."
    `;

    const codeCritiquePrompt = `
      You are an expert technical interviewer and code reviewer. Your task is to critique the provided code for a LeetCode problem.
      The problem statement is:
      ---
      ${question}
      ---
      The candidate's submitted code is:
      ---
      ${code}
      ---
      Please provide a conceptual critique of the code (do NOT execute it). Evaluate:
      1.  **Conceptual Correctness:** Does the logic seem sound for solving the problem? Are there obvious logical flaws?
      2.  **Optimality:** Discuss its time and space complexity. Suggest improvements if a significantly more optimal approach exists.
      3.  **Readability & Style:** Comment on code clarity, variable naming, comments, and adherence to general best practices.
      4.  **Edge Cases Handled:** Does the code appear to account for common edge cases mentioned in the problem?

      Provide actionable and constructive feedback in markdown format, focusing on "Strengths," "Areas for Improvement," and "Specific Code Suggestions."
    `;
       
    const [
        problemUnderstandingResponse,
        solutionExplanationResponse,
        codeCritiqueResponse,
      ] = await Promise.all([
        openai.chat.completions.create({
          model: "gpt-4o-mini", // Use gpt-4o-mini for testing, cheaper/faster. Switch to gpt-4o or gpt-4 for better quality.
          messages: [{ role: "user", content: problemUnderstandingPrompt }],
          max_tokens: 700, // Limit response length to avoid excessive tokens
        }),
        openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: solutionExplanationPrompt }],
          max_tokens: 700,
        }),
        openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: codeCritiquePrompt }],
          max_tokens: 700,
        }),
      ]);
  
      // 3. Consolidate and Return AI Feedback
      const consolidatedFeedback = {
        problemUnderstanding: problemUnderstandingResponse.choices[0]?.message?.content || "No feedback generated.",
        solutionExplanation: solutionExplanationResponse.choices[0]?.message?.content || "No feedback generated.",
        codeCritique: codeCritiqueResponse.choices[0]?.message?.content || "No feedback generated.",
      };

      console.log("before sending it all:", { question, code, input1, input2, feedback: consolidatedFeedback })
  
      return NextResponse.json({ question, code, input1, input2, feedback: consolidatedFeedback }, { status: 200 });       
      
    } catch (err) {
        console.log("an error occured", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
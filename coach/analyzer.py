from typing import List
from pydantic import BaseModel, Field
from langchain_core.messages import HumanMessage
from langchain_google_genai import ChatGoogleGenerativeAI


class PromptAnalysis(BaseModel):
    overall_assessment: str = Field(
        description="A concise overall assessment of the learner's prompt."
    )

    strengths: List[str] = Field(
        description="Specific things the prompt does well."
    )

    weaknesses: List[str] = Field(
        description="Specific weaknesses or missing elements in the prompt."
    )

    important_dimensions: List[str] = Field(
        description=(
            "The prompt-engineering dimensions that most need attention. "
            "Use only these dimensions: clarity, context, specificity, "
            "task_definition, constraints, examples, output_format, "
            "audience, ambiguity, robustness."
        )
    )

    why_it_matters: List[str] = Field(
        description=(
            "Explain why the identified weaknesses matter for getting "
            "reliable and useful AI output."
        )
    )

    hints: List[str] = Field(
        description=(
            "Progressive hints that help the learner improve the prompt "
            "without directly writing the improved prompt for them."
        )
    )

    difficulty: str = Field(
        description="Estimated learner difficulty: beginner, intermediate, or advanced."
    )


ANALYZER_INSTRUCTIONS = """
You are the PromptForge Prompt Analyzer.

Your job is to analyze a learner's prompt as a teacher.

Do NOT rewrite the learner's prompt.
Do NOT provide a final improved prompt.
Do NOT solve the underlying task for the learner.

Instead:

1. Identify what the learner did well.
2. Identify the most important weaknesses.
3. Identify which prompt-engineering dimensions need attention.
4. Explain why those weaknesses matter.
5. Give useful hints that allow the learner to improve the prompt themselves.
6. Estimate the difficulty of the prompt.

Evaluate these dimensions when relevant:

- clarity
- context
- specificity
- task_definition
- constraints
- examples
- output_format
- audience
- ambiguity
- robustness

Important teaching rule:

Do not criticize a prompt simply because it does not contain every
possible component. Judge the components based on whether they are
necessary for the task.

Prioritize the most important problems instead of producing a huge
checklist.

The learner should finish the analysis knowing what to improve and
why, while still having to think and rewrite the prompt themselves.

Return only the requested structured analysis.
"""


def analyze_prompt(llm: ChatGoogleGenerativeAI, prompt: str) -> PromptAnalysis:
    """
    Analyze a learner's prompt using the PromptForge coaching model.
    """

    if not prompt or not prompt.strip():
        raise ValueError("Prompt cannot be empty.")

    prompt = prompt.strip()

    message = HumanMessage(
        content=(
            f"{ANALYZER_INSTRUCTIONS}\n\n"
            "Here is the learner's prompt:\n"
            "----- BEGIN LEARNER PROMPT -----\n"
            f"{prompt}\n"
            "----- END LEARNER PROMPT -----"
        )
    )

    structured_llm = llm.with_structured_output(PromptAnalysis)

    result = structured_llm.invoke([message])

    return result
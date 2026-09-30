from typing import List
from pydantic import BaseModel, Field
from langchain_core.messages import HumanMessage
from langchain_google_genai import ChatGoogleGenerativeAI


class PromptEvaluation(BaseModel):
    overall_feedback: str = Field(
        description="A concise assessment of the learner's revised prompt."
    )

    improvements: List[str] = Field(
        description="Specific improvements made compared with the original prompt."
    )

    remaining_issues: List[str] = Field(
        description="Important problems that still remain in the revised prompt."
    )

    strengths: List[str] = Field(
        description="Strong aspects of the revised prompt."
    )

    skills_demonstrated: List[str] = Field(
        description=(
            "Prompt-engineering skills the learner has demonstrated. "
            "Use only: clarity, context, specificity, task_definition, "
            "constraints, examples, output_format, audience, ambiguity, "
            "robustness."
        )
    )

    next_focus: List[str] = Field(
        description=(
            "The most important skills or concepts the learner should "
            "practice next."
        )
    )

    coaching_feedback: str = Field(
        description=(
            "Encouraging but specific coaching feedback that helps the "
            "learner understand how to improve."
        )
    )

    ready_for_next_challenge: bool = Field(
        description=(
            "Whether the learner has demonstrated enough understanding "
            "to move to a new challenge."
        )
    )


EVALUATOR_INSTRUCTIONS = """
You are the PromptForge Prompt Evaluator.

You are evaluating a learner's revised prompt against their original prompt.

Your purpose is teaching, not merely judging.

Compare the two prompts carefully.

You must:

1. Identify concrete improvements made by the learner.
2. Identify important problems that remain.
3. Identify what the learner did well.
4. Identify the prompt-engineering skills demonstrated.
5. Identify what the learner should focus on next.
6. Give concise, actionable coaching feedback.
7. Decide whether the learner is ready for a new challenge.

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

Important rules:

- Do not expect every prompt to contain every dimension.
- Judge dimensions based on the actual task.
- Do not reward unnecessary complexity.
- A shorter prompt can be better than a longer prompt if it is sufficiently
  clear and precise.
- Focus on meaningful improvements rather than cosmetic wording changes.
- Do not rewrite the learner's prompt.
- Do not provide a complete replacement prompt.
- Do not invent weaknesses just to produce more feedback.
- Be constructive and specific.
- The learner should understand why something is good or needs improvement.

For readiness:

Set ready_for_next_challenge to true when the learner has demonstrated
a meaningful understanding of the main issue they were expected to fix.

Set it to false when major misunderstandings remain.

Return only the requested structured evaluation.
"""


def evaluate_prompt(
    llm: ChatGoogleGenerativeAI,
    original_prompt: str,
    revised_prompt: str,
) -> PromptEvaluation:
    """
    Evaluate a learner's revised prompt against their original prompt.
    """

    if not original_prompt or not original_prompt.strip():
        raise ValueError("Original prompt cannot be empty.")

    if not revised_prompt or not revised_prompt.strip():
        raise ValueError("Revised prompt cannot be empty.")

    original_prompt = original_prompt.strip()
    revised_prompt = revised_prompt.strip()

    message = HumanMessage(
        content=(
            f"{EVALUATOR_INSTRUCTIONS}\n\n"
            "----- BEGIN ORIGINAL PROMPT -----\n"
            f"{original_prompt}\n"
            "----- END ORIGINAL PROMPT -----\n\n"
            "----- BEGIN REVISED PROMPT -----\n"
            f"{revised_prompt}\n"
            "----- END REVISED PROMPT -----"
        )
    )

    structured_llm = llm.with_structured_output(PromptEvaluation)

    result = structured_llm.invoke([message])

    return result
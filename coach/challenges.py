from typing import List
from pydantic import BaseModel, Field
from langchain_core.messages import HumanMessage
from langchain_google_genai import ChatGoogleGenerativeAI


VALID_SKILLS = [
    "clarity",
    "context",
    "specificity",
    "task_definition",
    "constraints",
    "examples",
    "output_format",
    "audience",
    "ambiguity",
    "robustness",
]


class Challenge(BaseModel):
    title: str = Field(
        description="A short, engaging title for the challenge."
    )

    scenario: str = Field(
        description="A realistic situation in which the learner must write a prompt."
    )

    objective: str = Field(
        description="The prompt-engineering skill the learner is expected to practice."
    )

    target_skill: str = Field(
        description=(
            "The primary skill being practiced. Must be one of: "
            "clarity, context, specificity, task_definition, constraints, "
            "examples, output_format, audience, ambiguity, robustness."
        )
    )

    task: str = Field(
        description="The exact task the learner must complete."
    )

    constraints: List[str] = Field(
        description="Constraints the learner should consider while completing the challenge."
    )

    success_criteria: List[str] = Field(
        description="Observable criteria that indicate a successful attempt."
    )

    difficulty: str = Field(
        description="Challenge difficulty: beginner, intermediate, or advanced."
    )

    hint: str = Field(
        description=(
            "A subtle hint that helps the learner start without giving "
            "away the solution."
        )
    )


CHALLENGE_INSTRUCTIONS = """
You are the PromptForge Challenge Engine.

Your job is to create ONE focused prompt-engineering challenge for a learner.

The challenge must help the learner practice a specific skill rather than
testing everything at once.

Valid skills:

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

Rules:

1. Create a realistic and relatable scenario.
2. Give the learner a concrete task.
3. Focus primarily on the requested target skill.
4. Do not provide the solution prompt.
5. Do not provide an example of a perfect answer.
6. Make the learner actually write a prompt.
7. Avoid unnecessary complexity.
8. Keep the challenge engaging rather than academic.
9. Include clear success criteria.
10. Give only a small hint.
11. Match the difficulty to the learner's demonstrated level.
12. Do not require knowledge unrelated to prompt engineering.

The challenge should feel like a practical mission, not a textbook question.

Return only the requested structured challenge.
"""


def generate_challenge(
    llm: ChatGoogleGenerativeAI,
    target_skill: str,
    difficulty: str = "beginner",
    learner_context: str = "",
) -> Challenge:
    """
    Generate one prompt-engineering challenge for a learner.
    """

    target_skill = target_skill.strip().lower()
    difficulty = difficulty.strip().lower()

    if target_skill not in VALID_SKILLS:
        raise ValueError(
            f"Invalid target skill: {target_skill}. "
            f"Choose from: {', '.join(VALID_SKILLS)}"
        )

    if difficulty not in {"beginner", "intermediate", "advanced"}:
        raise ValueError(
            "Difficulty must be beginner, intermediate, or advanced."
        )

    context = learner_context.strip() or "No additional learner context available."

    message = HumanMessage(
        content=(
            f"{CHALLENGE_INSTRUCTIONS}\n\n"
            f"Target skill: {target_skill}\n"
            f"Difficulty: {difficulty}\n"
            f"Learner context: {context}"
        )
    )

    structured_llm = llm.with_structured_output(Challenge)

    result = structured_llm.invoke([message])

    return result
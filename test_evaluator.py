from llm import get_llm
from coach.evaluator import evaluate_prompt


def main():
    llm = get_llm()

    print("\n==============================")
    print("     PROMPT EVALUATION")
    print("==============================")

    print("\nEnter the original prompt:")
    original_prompt = input("> ").strip()

    print("\nEnter the revised prompt:")
    revised_prompt = input("> ").strip()

    if not original_prompt or not revised_prompt:
        print("Both prompts are required.")
        return

    try:
        evaluation = evaluate_prompt(
            llm,
            original_prompt,
            revised_prompt,
        )

        print("\nOverall Feedback:")
        print(evaluation.overall_feedback)

        print("\nImprovements:")
        for item in evaluation.improvements:
            print(f"- {item}")

        print("\nRemaining Issues:")
        for item in evaluation.remaining_issues:
            print(f"- {item}")

        print("\nStrengths:")
        for item in evaluation.strengths:
            print(f"- {item}")

        print("\nSkills Demonstrated:")
        for item in evaluation.skills_demonstrated:
            print(f"- {item}")

        print("\nNext Focus:")
        for item in evaluation.next_focus:
            print(f"- {item}")

        print("\nCoach:")
        print(evaluation.coaching_feedback)

        print(
            "\nReady for Next Challenge:",
            "Yes" if evaluation.ready_for_next_challenge else "Not yet",
        )

    except Exception as error:
        print(
            "\nSomething went wrong:\n"
            f"{type(error).__name__}: {error}"
        )


if __name__ == "__main__":
    main()
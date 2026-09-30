from llm import get_llm
from coach.analyzer import analyze_prompt


def main():
    llm = get_llm()

    prompt = input("\nEnter a prompt to analyze:\n> ").strip()

    if not prompt:
        print("Prompt cannot be empty.")
        return

    try:
        analysis = analyze_prompt(llm, prompt)

        print("\n==============================")
        print("       PROMPT ANALYSIS")
        print("==============================")

        print("\nOverall:")
        print(analysis.overall_assessment)

        print("\nStrengths:")
        for item in analysis.strengths:
            print(f"- {item}")

        print("\nWeaknesses:")
        for item in analysis.weaknesses:
            print(f"- {item}")

        print("\nDimensions to Improve:")
        for item in analysis.important_dimensions:
            print(f"- {item}")

        print("\nWhy It Matters:")
        for item in analysis.why_it_matters:
            print(f"- {item}")

        print("\nHints:")
        for index, item in enumerate(analysis.hints, start=1):
            print(f"{index}. {item}")

        print(f"\nEstimated Difficulty: {analysis.difficulty}")

    except Exception as error:
        print(
            "\nSomething went wrong:\n"
            f"{type(error).__name__}: {error}"
        )


if __name__ == "__main__":
    main()
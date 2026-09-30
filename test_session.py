from llm import get_llm
from coach.session import CoachingSession


def main():
    llm = get_llm()
    session = CoachingSession(llm)

    original_prompt = (
        "Make me a good study plan."
    )

    print("\nAnalyzing original prompt...")

    analysis = session.analyze(original_prompt)

    print("\nOverall Assessment:")
    print(analysis.overall_assessment)

    print("\nWeaknesses:")
    for weakness in analysis.weaknesses:
        print(f"- {weakness}")

    revised_prompt = (
        "Create a 30-day Python study plan for a beginner. "
        "I can study for 2 hours every day. "
        "Include theory, coding practice, and revision. "
        "Organize the plan by day and include a goal for each day."
    )

    print("\nEvaluating revised prompt...")

    evaluation = session.evaluate(
        original_prompt,
        revised_prompt,
    )

    print("\nFeedback:")
    print(evaluation.overall_feedback)

    print("\nImprovements:")
    for item in evaluation.improvements:
        print(f"- {item}")

    print("\nNext Focus:")
    for item in evaluation.next_focus:
        print(f"- {item}")

    print(
        "\nReady for next challenge:",
        evaluation.ready_for_next_challenge,
    )

    print("\nLearner Profile:")
    for skill, status in session.profile.get_skill_status().items():
        print(f"- {skill}: {status}")

    print("\nGenerating next challenge...")

    challenge = session.next_challenge()

    print(f"\n{challenge.title}")
    print(f"\nScenario:\n{challenge.scenario}")
    print(f"\nTask:\n{challenge.task}")
    print(f"\nTarget Skill: {challenge.target_skill}")
    print(f"Difficulty: {challenge.difficulty}")
    print(f"\nHint:\n{challenge.hint}")


if __name__ == "__main__":
    main()
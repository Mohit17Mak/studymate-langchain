from llm import get_llm
from coach.challenges import generate_challenge


def main():
    llm = get_llm()

    print("\n==============================")
    print("      PROMPTFORGE CHALLENGE")
    print("==============================")

    target_skill = input(
        "\nSkill to practice "
        "(clarity/context/specificity/etc.):\n> "
    ).strip()

    difficulty = input(
        "\nDifficulty (beginner/intermediate/advanced):\n> "
    ).strip()

    learner_context = input(
        "\nOptional learner context:\n> "
    ).strip()

    try:
        challenge = generate_challenge(
            llm=llm,
            target_skill=target_skill,
            difficulty=difficulty,
            learner_context=learner_context,
        )

        print("\n==============================")
        print(challenge.title)
        print("==============================")

        print("\nScenario:")
        print(challenge.scenario)

        print("\nObjective:")
        print(challenge.objective)

        print("\nTask:")
        print(challenge.task)

        print("\nConstraints:")
        for item in challenge.constraints:
            print(f"- {item}")

        print("\nSuccess Criteria:")
        for item in challenge.success_criteria:
            print(f"- {item}")

        print(f"\nDifficulty: {challenge.difficulty}")
        print(f"Target Skill: {challenge.target_skill}")

        print("\nHint:")
        print(challenge.hint)

    except Exception as error:
        print(
            "\nSomething went wrong:\n"
            f"{type(error).__name__}: {error}"
        )


if __name__ == "__main__":
    main()
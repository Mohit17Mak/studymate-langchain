from coach.profile import LearnerProfile


def print_profile(profile: LearnerProfile) -> None:
    print("\n==============================")
    print("       LEARNER PROFILE")
    print("==============================")

    print(f"\nDifficulty: {profile.current_difficulty}")
    print(f"Completed Challenges: {profile.completed_challenges}")

    print("\nSkills:")

    for skill, status in profile.get_skill_status().items():
        state = profile.skills[skill]

        print(
            f"- {skill}: {status} "
            f"(attempts={state.attempts}, "
            f"demonstrated={state.demonstrated}, "
            f"practice={state.needs_practice}, "
            f"successful={state.successful_attempts})"
        )

    print("\nNext Challenge Skill:")
    print(profile.get_challenge_skill())


def main():
    profile = LearnerProfile()

    print_profile(profile)

    print("\n--- Simulating learner evaluation ---")

    profile.record_evaluation(
        skills_demonstrated=[
            "clarity",
            "task_definition",
        ],
        next_focus=[
            "specificity",
            "constraints",
        ],
        ready_for_next_challenge=True,
    )

    print_profile(profile)

    print("\n--- Simulating another evaluation ---")

    profile.record_evaluation(
        skills_demonstrated=[
            "specificity",
            "clarity",
        ],
        next_focus=[
            "constraints",
        ],
        ready_for_next_challenge=True,
    )

    print_profile(profile)


if __name__ == "__main__":
    main()
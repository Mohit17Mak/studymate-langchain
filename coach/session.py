from langchain_google_genai import ChatGoogleGenerativeAI

from coach.analyzer import analyze_prompt
from coach.challenges import generate_challenge
from coach.evaluator import evaluate_prompt
from coach.profile import LearnerProfile


class CoachingSession:
    def __init__(self, llm: ChatGoogleGenerativeAI):
        self.llm = llm
        self.profile = LearnerProfile()

    def analyze(self, prompt: str):
        return analyze_prompt(
            self.llm,
            prompt,
        )

    def evaluate(
        self,
        original_prompt: str,
        revised_prompt: str,
    ):
        evaluation = evaluate_prompt(
            self.llm,
            original_prompt,
            revised_prompt,
        )

        self.profile.record_evaluation(
            skills_demonstrated=evaluation.skills_demonstrated,
            next_focus=evaluation.next_focus,
            ready_for_next_challenge=evaluation.ready_for_next_challenge,
        )

        return evaluation

    def next_challenge(self):
        skill = self.profile.get_challenge_skill()

        return generate_challenge(
            llm=self.llm,
            target_skill=skill,
            difficulty=self.profile.current_difficulty,
            learner_context=self._build_context(),
        )

    def get_profile(self) -> dict:
        return self.profile.get_summary()

    def _build_context(self) -> str:
        profile = self.profile

        weakest = profile.get_weakest_skills(
            limit=3
        )

        return (
            f"Completed challenges: "
            f"{profile.completed_challenges}. "

            f"Total evaluations: "
            f"{profile.total_evaluations}. "

            f"Current difficulty: "
            f"{profile.current_difficulty}. "

            f"Overall progress: "
            f"{profile.get_overall_progress()}%. "

            f"Skills needing attention: "
            f"{', '.join(weakest)}."
        )
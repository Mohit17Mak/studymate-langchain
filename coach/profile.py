from dataclasses import dataclass, field
from typing import Dict, List


SKILLS = [
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

DIFFICULTIES = ["beginner", "intermediate", "advanced"]


@dataclass
class SkillState:
    attempts: int = 0
    demonstrated: int = 0
    needs_practice: int = 0
    successful_attempts: int = 0
    recent_results: List[bool] = field(default_factory=list)

    @property
    def success_rate(self) -> float:
        if self.attempts == 0:
            return 0.0

        return round(self.successful_attempts / self.attempts, 2)

    @property
    def confidence(self) -> float:
        """
        Confidence is based on demonstrated success while avoiding
        artificially high confidence from very few attempts.
        """
        if self.attempts == 0:
            return 0.0

        evidence_factor = min(self.attempts / 5, 1.0)

        return round(
            self.success_rate * evidence_factor,
            2,
        )

    @property
    def status(self) -> str:
        if self.attempts == 0:
            return "not_started"

        if self.successful_attempts >= 3 and self.success_rate >= 0.7:
            return "strong"

        if self.needs_practice > self.successful_attempts:
            return "needs_practice"

        if self.success_rate >= 0.5:
            return "developing"

        return "needs_practice"

    def record_attempt(
        self,
        demonstrated: bool,
        needs_practice: bool,
        successful: bool,
    ) -> None:
        self.attempts += 1

        if demonstrated:
            self.demonstrated += 1

        if needs_practice:
            self.needs_practice += 1

        if successful:
            self.successful_attempts += 1

        self.recent_results.append(successful)

        # Keep only recent performance.
        self.recent_results = self.recent_results[-5:]


@dataclass
class LearnerProfile:
    skills: Dict[str, SkillState] = field(
        default_factory=lambda: {
            skill: SkillState()
            for skill in SKILLS
        }
    )

    completed_challenges: int = 0
    total_evaluations: int = 0
    current_difficulty: str = "beginner"

    recent_challenge_skills: List[str] = field(default_factory=list)

    def record_evaluation(
        self,
        skills_demonstrated: List[str],
        next_focus: List[str],
        ready_for_next_challenge: bool,
    ) -> None:
        demonstrated = self._normalize_skills(skills_demonstrated)
        focus = self._normalize_skills(next_focus)

        self.total_evaluations += 1

        for skill in SKILLS:
            was_demonstrated = skill in demonstrated
            needs_practice = skill in focus

            # A skill is considered successful when it was demonstrated
            # and is not currently identified as a focus area.
            successful = (
                was_demonstrated
                and not needs_practice
            )

            # Only update a skill when the evaluation provides useful
            # information about it.
            if was_demonstrated or needs_practice:
                self.skills[skill].record_attempt(
                    demonstrated=was_demonstrated,
                    needs_practice=needs_practice,
                    successful=successful,
                )

        if ready_for_next_challenge:
            self.completed_challenges += 1

        self._update_difficulty()

    def get_weakest_skills(self, limit: int = 3) -> List[str]:
        """
        Select skills that need attention.

        Priority:
        1. Explicit practice needs.
        2. Low confidence.
        3. Skills with less evidence.
        4. Avoid repeatedly selecting the same recent skill.
        """

        def score(skill: str):
            state = self.skills[skill]

            recent_penalty = (
                1
                if skill in self.recent_challenge_skills[-2:]
                else 0
            )

            return (
                state.needs_practice,
                -state.confidence,
                -state.attempts,
                recent_penalty,
            )

        ranked = sorted(
            SKILLS,
            key=score,
            reverse=True,
        )

        return ranked[:limit]

    def get_skill_status(self) -> Dict[str, str]:
        return {
            skill: self.skills[skill].status
            for skill in SKILLS
        }

    def get_skill_confidence(self) -> Dict[str, float]:
        return {
            skill: self.skills[skill].confidence
            for skill in SKILLS
        }

    def get_skill_progress(self) -> Dict[str, dict]:
        return {
            skill: {
                "status": state.status,
                "attempts": state.attempts,
                "demonstrated": state.demonstrated,
                "needs_practice": state.needs_practice,
                "successful_attempts": state.successful_attempts,
                "success_rate": state.success_rate,
                "confidence": state.confidence,
            }
            for skill, state in self.skills.items()
        }

    def get_challenge_skill(self) -> str:
        """
        Choose the next skill to practice.

        If the learner has no evaluation history, start with clarity.
        Otherwise prioritize weak skills while avoiding excessive repetition.
        """

        if self.total_evaluations == 0:
            return "clarity"

        weakest = self.get_weakest_skills(limit=len(SKILLS))

        for skill in weakest:
            if skill not in self.recent_challenge_skills[-2:]:
                self.recent_challenge_skills.append(skill)
                self.recent_challenge_skills = (
                    self.recent_challenge_skills[-5:]
                )
                return skill

        skill = weakest[0]

        self.recent_challenge_skills.append(skill)
        self.recent_challenge_skills = self.recent_challenge_skills[-5:]

        return skill

    def get_overall_progress(self) -> float:
        """
        Calculate a simple overall learning progress percentage.

        Only skills with evidence contribute to the calculation.
        """

        confidences = [
            state.confidence
            for state in self.skills.values()
            if state.attempts > 0
        ]

        if not confidences:
            return 0.0

        return round(
            (sum(confidences) / len(confidences)) * 100,
            1,
        )

    def get_summary(self) -> dict:
        return {
            "difficulty": self.current_difficulty,
            "completed_challenges": self.completed_challenges,
            "total_evaluations": self.total_evaluations,
            "overall_progress": self.get_overall_progress(),
            "weakest_skills": self.get_weakest_skills(),
            "skill_status": self.get_skill_status(),
            "skill_confidence": self.get_skill_confidence(),
            "skills": self.get_skill_progress(),
        }

    def _normalize_skills(self, skills: List[str]) -> set[str]:
        return {
            skill.strip().lower()
            for skill in skills
            if isinstance(skill, str)
            and skill.strip().lower() in SKILLS
        }

    def _update_difficulty(self) -> None:
        """
        Difficulty is based on demonstrated learning rather than
        simply counting challenges.
        """

        if self.total_evaluations == 0:
            self.current_difficulty = "beginner"
            return

        strong_skills = sum(
            1
            for state in self.skills.values()
            if state.status == "strong"
        )

        overall_progress = self.get_overall_progress()

        if (
            strong_skills >= 6
            and overall_progress >= 65
            and self.completed_challenges >= 6
        ):
            self.current_difficulty = "advanced"

        elif (
            strong_skills >= 3
            and overall_progress >= 40
            and self.completed_challenges >= 2
        ):
            self.current_difficulty = "intermediate"

        else:
            self.current_difficulty = "beginner"
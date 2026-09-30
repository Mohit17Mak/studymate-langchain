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


@dataclass
class SkillState:
    demonstrated: int = 0
    needs_practice: int = 0
    successful_attempts: int = 0
    attempts: int = 0

    @property
    def status(self) -> str:
        if self.successful_attempts >= 2:
            return "strong"

        if self.needs_practice > self.demonstrated:
            return "needs_practice"

        if self.attempts == 0:
            return "not_started"

        return "developing"


@dataclass
class LearnerProfile:
    skills: Dict[str, SkillState] = field(
        default_factory=lambda: {
            skill: SkillState()
            for skill in SKILLS
        }
    )

    completed_challenges: int = 0
    current_difficulty: str = "beginner"

    def record_evaluation(
        self,
        skills_demonstrated: List[str],
        next_focus: List[str],
        ready_for_next_challenge: bool,
    ) -> None:
        """
        Update the learner profile from an evaluator result.
        """

        demonstrated = {
            skill.strip().lower()
            for skill in skills_demonstrated
            if skill.strip().lower() in SKILLS
        }

        focus = {
            skill.strip().lower()
            for skill in next_focus
            if skill.strip().lower() in SKILLS
        }

        for skill in demonstrated:
            state = self.skills[skill]
            state.demonstrated += 1
            state.attempts += 1

            if skill not in focus:
                state.successful_attempts += 1

        for skill in focus:
            state = self.skills[skill]

            if skill not in demonstrated:
                state.attempts += 1

            state.needs_practice += 1

        if ready_for_next_challenge:
            self.completed_challenges += 1
            self._update_difficulty()

    def get_weakest_skills(self, limit: int = 3) -> List[str]:
        """
        Return skills that currently need the most practice.
        """

        ranked = sorted(
            SKILLS,
            key=lambda skill: (
                self.skills[skill].successful_attempts,
                -self.skills[skill].needs_practice,
                self.skills[skill].attempts,
            ),
        )

        return ranked[:limit]

    def get_skill_status(self) -> Dict[str, str]:
        return {
            skill: self.skills[skill].status
            for skill in SKILLS
        }

    def get_challenge_skill(self) -> str:
        """
        Select the most appropriate skill for the next challenge.
        """

        weakest = self.get_weakest_skills(limit=1)

        if not weakest:
            return "clarity"

        return weakest[0]

    def _update_difficulty(self) -> None:
        """
        Progress difficulty gradually instead of jumping levels too quickly.
        """

        if self.completed_challenges >= 8:
            self.current_difficulty = "advanced"
        elif self.completed_challenges >= 3:
            self.current_difficulty = "intermediate"
        else:
            self.current_difficulty = "beginner"
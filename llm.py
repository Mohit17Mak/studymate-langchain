import os

from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage

from memory import ConversationMemory
from prompts import SYSTEM_PROMPT


load_dotenv()


def get_llm():
    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key:
        raise ValueError("GEMINI_API_KEY is not set.")

    return ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        temperature=0.7,
    )


def chat(llm, memory, user_input):
    history = memory.get_messages()

    messages = [
        SYSTEM_PROMPT,
        *history,
        HumanMessage(content=user_input),
    ]

    response = llm.invoke(messages)

    memory.add_user_message(user_input)
    memory.add_ai_message(response.content)

    return response.content


def main():
    llm = get_llm()
    memory = ConversationMemory()

    print("\n==============================")
    print("        PromptForge")
    print("   Prompt Engineering Coach")
    print("==============================")
    print("Type /clear to reset.")
    print("Type /exit to quit.\n")

    while True:
        user_input = input("You: ").strip()

        if not user_input:
            continue

        if user_input.lower() == "/exit":
            print("PromptForge: Keep practicing. Goodbye!")
            break

        if user_input.lower() == "/clear":
            memory.clear()
            print("PromptForge: Learning session cleared.\n")
            continue

        try:
            answer = chat(
                llm,
                memory,
                user_input,
            )

            print(f"PromptForge: {answer}\n")

        except Exception as error:
            print(
                "PromptForge: Something went wrong.\n"
                f"{type(error).__name__}: {error}\n"
            )


if __name__ == "__main__":
    main()
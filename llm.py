import os

from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI

load_dotenv()


def get_llm():
    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key:
        raise ValueError("GEMINI_API_KEY is not set.")

    return ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        temperature=0.7,
    )


if __name__ == "__main__":
    llm = get_llm()

    response = llm.invoke(
        "Introduce yourself in one short sentence."
    )

    print(response.content)
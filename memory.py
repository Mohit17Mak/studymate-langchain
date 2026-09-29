from langchain_core.chat_history import InMemoryChatMessageHistory


class ConversationMemory:
    def __init__(self, max_messages=12):
        self.history = InMemoryChatMessageHistory()
        self.max_messages = max_messages

    def add_user_message(self, message):
        self.history.add_user_message(message)

    def add_ai_message(self, message):
        self.history.add_ai_message(message)

    def get_messages(self):
        return self.history.messages[-self.max_messages:]

    def clear(self):
        self.history.clear()
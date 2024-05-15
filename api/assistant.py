import os
from openai import OpenAI
from dotenv import load_dotenv
from openai.pagination import SyncCursorPage
from pydantic import BaseModel
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from .assistantcreate import *
import asyncio

load_dotenv()

# Check OpenAI version is correct
OPENAI_API_KEY = os.environ.get("OPEN_AI_KEY")
# print(OPENAI_API_KEY)

app = FastAPI()


# Placeholder types for message content / classes
class ChatRequest(BaseModel):
    thread_id: str
    message: str


class ChatResponse(BaseModel):
    response: str


# Init OpenAI client
client: OpenAI = OpenAI(api_key=OPENAI_API_KEY)

# Create new assistant or load existing


# creating new thread
@app.get("/api/start")
async def start_conversation():
    print("Starting a new conversation...")
    thread = client.beta.threads.create()
    thread_id = thread.id
    print(f"New thread created with ID: {thread_id}")
    return {"thread_id": thread_id}


@app.post("/api/chat")
async def chat(request: ChatRequest):
    thread_id = request.thread_id
    user_input = request.message
    assistant_id = create_assistant(client)

    if not thread_id:
        print("Error: Missing thread id")
        return JSONResponse({"Error": "Missing thread id"}), 400

    print(f"recieved message: {user_input} for thread: {thread_id}")

    # adding user message to the thread
    client.beta.threads.messages.create(
        thread_id=thread_id, role="user", content=user_input
    )

    # #running the assistant
    run = client.beta.threads.runs.create(
        thread_id=thread_id,
        assistant_id=assistant_id,
        instructions="Please address the user as Zaheer always. The user has a premium account.",
    )

    # check if the run requires action(function call)
    while True:
        run_status = client.beta.threads.runs.retrieve(
            thread_id=thread_id, run_id=run.id
        )
        print(f"Run status: {run_status.status}")
        if run_status.status == "completed":
            break
        await asyncio.sleep(1)

    messages = client.beta.threads.messages.list(thread_id=thread_id)

    if messages.data[0].content:
        message_content = messages.data[0].content[0]
        if hasattr(message_content, "text"):
            response = message_content.text.value
            print(response.encode("utf-8"))
        elif hasattr(message_content, "image_file"):
            # To Handle the case where it's an image file
            print("Received an image message.")
        else:
            # Fallback for unrecognized types
            print("Received an unrecognized type of message.")
        return JSONResponse({"response": response})
    else:
        print("The latest message has no content.")
        return JSONResponse(
            {"Error": "The latest message has no content"}, status_code=404
        )

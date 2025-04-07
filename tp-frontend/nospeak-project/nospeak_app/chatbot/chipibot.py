from typing import Annotated, TypedDict, Optional
import operator
from langchain_openai import ChatOpenAI
from langgraph.graph import StateGraph, END
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from langchain_core.tools import tool
from pydantic import BaseModel, Field
from langgraph.prebuilt import ToolNode
import io
from contextlib import redirect_stdout, redirect_stderr
import traceback
import uuid
import os
import pandas as pd
import matplotlib
matplotlib.use('Agg')  # Set the backend to non-interactive Agg
import matplotlib.pyplot as plt
import requests

from django.conf import settings

OPENAI_API_KEY = settings.OPENAI_API_KEY
TAVILY_API_KEY = settings.TAVILY_API_KEY

# Load the dataset
base_path = '../tp-frontend/nospeak-project/nospeak_app/chatbot'
df = pd.read_csv(f'{base_path}/reviews_data.csv')


class PlotInput(BaseModel):
    code: str = Field(..., description="The seaborn code to generate the plot")


class SearchInput(BaseModel):
    query: str = Field(..., description="The search query for artist information")


class ChipiBotState(TypedDict):
    messages: Annotated[list, operator.add]
    plot_data: Optional[str] = None


def setup_workflow() -> StateGraph:
    graph = StateGraph(ChipiBotState)

    graph.add_node("agent", call_agent)
    graph.add_node("plot_tool", call_tool)
    graph.add_node("search_tool", call_tool)

    graph.set_entry_point("agent")
    graph.add_conditional_edges(
        "agent",
        should_continue_to_tool,
        {
            "plot_tool": "plot_tool",
            "search_tool": "search_tool",
            "end": END
        }
    )
    graph.add_edge("plot_tool", "agent")
    graph.add_edge("search_tool", "agent")
    return graph


def execute_code_in_environment(code: str, local_vars=None):
    """
    Execute Python code in a controlled environment with the given local variables.
    Returns the output, errors, and any generated plot as base64.
    """
    if local_vars is None:
        local_vars = {}
    
    stdout = io.StringIO()
    stderr = io.StringIO()
    
    try:
        with redirect_stdout(stdout), redirect_stderr(stderr):
            code = code.replace('plt.show()', '')
            exec(code, globals(), local_vars)
            
            # Save plot to bytes buffer instead of file
            if plt.gcf().get_axes():
                buf = io.BytesIO()
                plt.savefig(buf, format='png', bbox_inches='tight', facecolor='#333')
                buf.seek(0)
                import base64
                plot_data = base64.b64encode(buf.getvalue()).decode('utf-8')
                return stdout.getvalue(), stderr.getvalue(), plot_data
            
            return stdout.getvalue(), stderr.getvalue(), None
            
    except Exception as e:
        error_msg = f"Error: {str(e)}\n{traceback.format_exc()}"
        return stdout.getvalue(), error_msg, None
    finally:
        plt.close('all')

@tool(args_schema=PlotInput)
def plot(code: str) -> str:
    """Use this tool to sent the python `code` to retrieve the information from the dataframe and make a seaborn plot."""
    print("QUERY TO PLOT: ")
    print(code)
    
    stdout, stderr, plot_data = execute_code_in_environment(code, {'df': df})
    
    if stderr.strip():
        result = {
            "response": f"Errors:\n{stderr}",
            "plot_data": None
        }
    else:
        result = {
            "response": "Plot generated successfully. Don't include the url of the plot in your response.",
            "plot_data": plot_data
        }
    
    return str(result)


@tool(args_schema=SearchInput)
def search(query: str) -> str:
    """Use this tool to search additional (only biographical) information online about an artist"""
    print("QUERY TO SEARCH: ")
    print(query)
    
    try:
        # Call Tavily API
        api_url = "https://api.tavily.com/search"
        headers = {
            "Content-Type": "application/json",
            "X-API-Key": TAVILY_API_KEY
        }
        payload = {
            "query": query,
            "search_depth": "advanced",
            "include_domains": ["wikipedia.org", "allmusic.com", "billboard.com", "rollingstone.com"],
            "max_results": 3
        }
        
        response = requests.post(api_url, headers=headers, json=payload)
        response.raise_for_status()  # Raise exception for HTTP errors
        
        search_results = response.json()
        
        # Format the results
        formatted_response = f"Here's information about {query}:\n\n"
        
        for result in search_results.get("results", []):
            formatted_response += f"{result.get('content', '')}\n\n"
            
        return formatted_response
    except Exception as e:
        print(f"Error in Tavily search: {str(e)}")
        # Fallback response in case of API failure
        return f"I encountered an error while searching for information about {query}. Please try a different search or try again later."


SYSTEM_PROMPT = """
You are ChipiBot, an AI assistant integrated into the NoSpeak application. Always introduce yourself as "Hi! I'm ChipiBot from NoSpeak" in your first interaction with users.

Your role is to be helpful, friendly, and precise in your responses. You have access to two specialized tools that you should use when appropriate:

1. `plot` tool:
- Use this tool whenever a user requests any kind of data visualization
- The dataframe is already loaded in the tool's environment as `df`.
- You must generate appropriate seaborn code based on the user's request
- When calling the plot tool, provide complete seaborn `code` including imports and any necessary styling
- Always include appropriate labels, titles, and color schemes in your plots.
- Do not include the `plot.show()` line in your code.
- REQUIRED PLOT STYLING:
  * Always set figure background color to #333
  * Use #FFA130 for all data elements (lines, bars, points, etc.)
  * Use white color for all text (titles, labels, ticks)
  * Use `plt.xticks(rotation=45)` and `plt.grid(True)`.
  * DO NOT use `fmt='d'` in `sns.scatterplot`, `sns.lineplot` or `sns.heatmap`.
- Example tool call format:
{
    "name": "plot",
    "arguments": {
        "code": "import seaborn as sns\nimport matplotlib.pyplot as plt\n\n# Set the style\nplt.style.use('dark_background')\nplt.rcParams['figure.facecolor'] = '#333'\nplt.rcParams['axes.facecolor'] = '#232323'\nplt.rcParams['axes.labelcolor'] = 'white'\nplt.rcParams['text.color'] = 'white'\nplt.rcParams['xtick.color'] = 'white'\nplt.rcParams['ytick.color'] = 'white'\n\n# Create the plot\nplt.figure(figsize=(10, 6))\nsns.set_palette(['#FFA130'])\nsns.scatterplot(data=df, x='column1', y='column2')\nplt.title('Descriptive Title')\nplt.xlabel('X Label')\nplt.ylabel('Y Label')"
    }
}

2. `search` tool:
- Use this tool when users request biographical information about artists
- Only call this tool for artist-related queries that require additional information
- Provide clear, specific search queries
- Example tool call format:
{
    "name": "search",
    "arguments": {
        "query": "biography of Beatles members John Lennon and Paul McCartney"
    }
}

The columns in `df` are:
**id**: Unique identifier for each review, an integer.
**user_id**: Identifier linking the review to a user, an integer.
**song_position**: Position of the song in the `song_df`, an integer ranging from 1 to 5.
**score**: Review score given by the user, a float between 2.0 and 5.0.
**description**: Textual feedback on the song, a string.
**creation_date**: Date the review was created, a datetime object in the format 'YYYY-MM-DD'.
**song_name**: Name of the song being reviewed, a string.
**artist_name**: Artist who performed the song, a string.
**genre**: List of genres associated with the song, a list of strings. Like ['pop', 'rock', 'jazz']. This for each song.
**name**: Name of the user who reviewed the song, a string.
**instrument_played**: List of musical instruments played by the user, a list of strings.
**languages_preferences**: List of language preferences of the user, a list of strings.
**live_concert_attendance**: Number of live concerts the user has attended, an integer.
# The DataFrame contains comprehensive information linking user details, their reviews, and song data to provide a full view of interactions and ratings.


INTERACTION GUIDELINES:

1. Plotting Requests:
- Ask clarifying questions if the plot request is ambiguous
- Suggest the most appropriate plot type for the data (scatter, line, bar, etc.)
- Always explain the insights from the plot after it's generated
- NEVER include the url of the plot in your response

2. Artist Information Requests:
- Only use the search tool for biographical details not commonly known
- Combine your existing knowledge with search results for comprehensive responses
- Cite when you're using information from the search tool

3. General Behavior:
- Be concise but informative
- Use a friendly, conversational tone
- If a request is unclear, ask for clarification
- Don't apologize unnecessarily
- Stay within the scope of your tools and knowledge
- Whenever you're asked for user's names, say "I'm sorry, for privacy reasons I can't provide that information."

EXAMPLES OF APPROPRIATE RESPONSES:

For Plot Requests:
"I'll create a visualization for that data. Based on your request, a scatter plot would be most appropriate to show the relationship between these variables."

For Artist Searches:
"Let me gather some detailed information about that artist for you." [Uses search tool] "Based on what I found..."

For General Questions:
"Great question! Let me help you with that..."

Remember: Always maintain the persona of ChipiBot from NoSpeak, and use your tools appropriately to provide the most helpful and accurate responses possible.
"""


def call_agent(state: ChipiBotState) -> str:
    llm = ChatOpenAI(
        temperature=0, 
        model='gpt-4o-2024-05-13',
        api_key=OPENAI_API_KEY
    )

    agent_prompt = SystemMessage(content=SYSTEM_PROMPT)
    bound_llm = llm.bind_tools([plot, search])
    response = bound_llm.invoke([agent_prompt] + state["messages"])
    response_with_only_one_tool_call = __remove_multiple_tool_calls(response)
    print("LLM response: ")
    print(response_with_only_one_tool_call)
    return {
        "messages": [response_with_only_one_tool_call]
    }


def __remove_multiple_tool_calls(response):
    if hasattr(response, "tool_calls") and len(response.tool_calls) > 1:
        response.tool_calls = [response.tool_calls[0]]
    return response


def should_continue_to_tool(state: ChipiBotState) -> bool:
    last_message = state["messages"][-1]
    if hasattr(last_message, "tool_calls") and last_message.tool_calls:
        if last_message.tool_calls[0]["name"] == "plot":
            return "plot_tool"
        elif last_message.tool_calls[0]["name"] == "search":
            return "search_tool"
    return "end"


tool_node = ToolNode([plot, search])


def call_tool(state: ChipiBotState):
    last_message = state["messages"][-1]
    tool_calls = last_message.additional_kwargs.get("tool_calls")
    if tool_calls:
        message_with_single_tool_call = AIMessage(
            content=last_message.content,
            additional_kwargs={"tool_calls": tool_calls}
        )
        tool_result = {}
        tool_result = tool_node.invoke({"messages": [message_with_single_tool_call]})
        print(f"""Tool Result:  {tool_result}""")
        if "{'response':" in tool_result["messages"][0].content:
            start = tool_result["messages"][0].content.find("{")
            end = tool_result["messages"][0].content.find("}") + 1
            try:
                result_dict = eval(tool_result["messages"][0].content[start:end])
                response = result_dict["response"]
                plot_data = result_dict["plot_data"]
            except Exception as e:
                print(f"Error parsing tool result: {e}")
                response = tool_result["messages"][0].content
                plot_data = None
        else:
            response = tool_result["messages"][0].content
            plot_data = None
        
        print(f"""Tool Result:  {response}""")
        return {"messages": tool_result["messages"],
                "plot_data": plot_data}


def run(question: str, chat_history=None):
    graph = setup_workflow()
    app = graph.compile()

    # Convert chat history to LangChain message objects
    messages = []
    if chat_history:
        for msg in chat_history:
            if msg['sender'] == 'user':
                messages.append(HumanMessage(content=msg['content']))
            elif msg['sender'] == 'bot':
                messages.append(AIMessage(content=msg['content']))

    # Add the current question
    messages.append(HumanMessage(content=question))

    initial_state = {
        "messages": messages,
        "plot_data": None
    }
    print("Initial state: ")
    print(initial_state)
    result = app.invoke(initial_state)
    
    # Get the last message content
    response = result["messages"][-1].content
    plot_data = result["plot_data"]
    
    return response, plot_data

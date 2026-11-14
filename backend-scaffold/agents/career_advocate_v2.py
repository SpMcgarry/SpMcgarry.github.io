"""
Career Advocate v2 Agent
Grounded strictly in verified historical experience with zero server-side conversation retention.
"""
import os
from google import genai
from google.genai import types

class CareerAdvocateV2:
    def __init__(self, knowledge_path: str, api_key: str = None):
        self.knowledge = self._load_knowledge(knowledge_path)
        self.api_key = api_key or os.getenv('GEMINI_API_KEY')
        self.client = genai.Client(api_key=self.api_key) if self.api_key else None

        self.system_prompt = f"""You are the Career Advocate AI for Sean McGarry (Sales Operations Technologist & AI Solutions Designer).
Your role is to represent Sean accurately, professionally, and honestly to recruiters, founders, and prospective clients.

STRICT ACCURACY RULES:
1. Speak ONLY from the Ground Truth Knowledge Base provided below.
2. NEVER fabricate degrees, certifications, companies, or metrics.
3. If asked about experience not covered in the knowledge base, state clearly: "That specific area is not detailed in Sean's primary verified records, but you can inquire directly with him on LinkedIn."
4. Maintain a consultative, authentic, and professional tone.
5. Emphasize Sean's core strengths: consultative technology sales, SalesOps automation, Digital Employee Experience (DEX), agentic workflows, and cost-effective AI solutions.
6. SCOPE RESTRICTION: You represent Sean's professional sales, presales, solutions engineering, and career achievements only. You have ZERO knowledge about backend hosting, cloud hosting plans (such as Railway, AWS, or cloud containers), deployment mechanics, or server administration. If asked about hosting plans, cloud architecture, or Railway, state: "My role is strictly to represent Sean's professional sales, presales, and solutions background. For questions regarding technical infrastructure, please connect directly with Sean on LinkedIn."

GROUND TRUTH KNOWLEDGE BASE:
{self.knowledge}
"""

    def _load_knowledge(self, path: str) -> str:
        if os.path.exists(path):
            with open(path, 'r', encoding='utf-8') as f:
                return f.read()
        return "Knowledge base not found."

    def respond(self, message: str, chat_history: list = None) -> str:
        """
        Respond to user inquiries.
        History is supplied strictly by the client (browser), upholding zero-retention privacy.
        """
        if not self.client:
            return "Career Advocate v2 engine requires GEMINI_API_KEY to be configured in the environment."

        try:
            # Build conversation context
            contents = []
            if chat_history:
                for item in chat_history[-6:]:  # Keep recent context bounded
                    role = item.get('role', 'user')
                    text = item.get('content', '')
                    contents.append(f"{role.capitalize()}: {text}")
            
            contents.append(f"User: {message}")
            prompt = "\n".join(contents)

            response = self.client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt,
                config=types.GenerateContentConfig(
                    system_instruction=self.system_prompt,
                    temperature=0.2,
                    max_output_tokens=500
                )
            )
            return response.text
        except Exception as e:
            return f"Error consulting advocate engine: {str(e)}"

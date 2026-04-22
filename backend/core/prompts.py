def build_prompt(depth=4, age=None, genre=None, length=None, tone=None):
    customization = []

    if age:
        customization.append(f"- Target audience age: {age} years old. Adjust vocabulary, sentence length, and themes accordingly.")
    if genre:
        customization.append(f"- Genre: {genre}.")
    if tone:
        customization.append(f"- Tone: {tone}.")

    customization_block = "\n".join(customization) if customization else "- Use default settings."
    depth_val = depth if depth else 4

    if length == "short":
        node_sentences = "2-3"
        ending_sentences = "3-4"
    elif length == "long":
        node_sentences = "5-7"
        ending_sentences = "6-8"
    else:
        node_sentences = "3-5"
        ending_sentences = "4-6"

    return f"""
                You are a creative story writer that creates engaging choose-your-own-adventure stories.
                Generate a complete branching story with multiple paths and endings in the JSON format I'll specify.

                STRICT LANGUAGE RULE:

Detect the language of the user's input.

Write the entire story (title, content, options) ONLY in that detected language.

If the input is in English or the language is ambiguous, default to English.

CRITICAL: Output MUST be a pure JSON object. Do not include any notes, explanations, or "I detected Hebrew" messages.
                --- CUSTOMIZATION ---
                {customization_block}
                ---------------------

                The story should have:
                1. A compelling title
                2. A starting situation (root node) with 2 options
                3. Each option should lead to another node with its own options
                4. Some paths should lead to endings (both winning and losing)
                5. At least one path should lead to a winning ending

                Story structure requirements:
                - Each node should have 2 options except for ending nodes
                - The story should be {depth_val} levels deep (including root node)
                - Add variety in the path lengths (some end earlier, some later)
                - Make sure there's at least one winning path

                Content requirements for each node:
                - Each non-ending node must contain {node_sentences} sentences: set the scene, describe what just happened, and build tension toward the choice.
                - Each ending node must contain {ending_sentences} sentences that provide a satisfying conclusion, describing the outcome and its consequences.
                - Use sensory details (sights, sounds, feelings) to make scenes vivid.
                - End every non-ending node, with a sentence that makes the choice feel urgent.

                Output your story in this exact JSON structure:
                {{format_instructions}}

                Don't simplify or omit any part of the story structure.
                Don't add any text outside of the JSON structure.
                """

json_structure = """
        {
            "title": "Story Title",
            "rootNode": {
                "content": "The starting situation of the story",
                "isEnding": false,
                "isWinningEnding": false,
                "options": [
                    {
                        "text": "Option 1 text",
                        "nextNode": {
                            "content": "What happens for option 1",
                            "isEnding": false,
                            "isWinningEnding": false,
                            "options": [
                                // More nested options
                            ]
                        }
                    },
                    // More options for root node
                ]
            }
        }
        """

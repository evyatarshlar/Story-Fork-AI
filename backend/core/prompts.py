STORY_PROMPT = """
                You are a creative story writer that creates engaging choose-your-own-adventure stories.
                Generate a complete branching story with multiple paths and endings in the JSON format I'll specify.

                Default Language: Write the entire story (title, content, and all option texts) in English.
                Exception: If the user's input is clearly in a different language (e.g., Hebrew, Spanish), write the story in that specific language instead.
                
                The story should have:
                1. A compelling title
                2. A starting situation (root node) with 2 options
                3. Each option should lead to another node with its own options
                4. Some paths should lead to endings (both winning and losing)
                5. At least one path should lead to a winning ending

                Story structure requirements:
                - Each node should have 2 options except for ending nodes
                - The story should be 4 levels deep (including root node)
                - Add variety in the path lengths (some end earlier, some later)
                - Make sure there's at least one winning path

                Content requirements for each node:
                - Each non-ending node must contain 3-5 sentences: set the scene, describe what just happened, and build tension toward the choice.
                - Each ending node must contain 4-6 sentences that provide a satisfying conclusion, describing the outcome and its consequences.
                - Use sensory details (sights, sounds, feelings) to make scenes vivid.
                - End every non-ending node, with a sentence that makes the choice feel urgent.

                Output your story in this exact JSON structure:
                {format_instructions}

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

# TRUSTIQ Privacy & Known Limitations

## Privacy Guarantees
1. **Local Boundary:** All inference executes locally on the user's host machine. No external inference APIs (OpenAI, Anthropic, Hugging Face Hub, etc.) are called during runtime.
2. **No Data Collection:** Submitted queries are not stored on disk by the backend server, nor are they used for fine-tuning.
3. **Transparent Browser Storage:** History is retained strictly in the user's browser `localStorage` and can be purged immediately with a single click.

## Fundamental Scientific Limitations
1. **Lexical Representation Deficit:**
   - Bag-of-words and n-gram TF-IDF representations ignore long-range syntax, discourse relations, and pragmatic context.
   - Negations separated by many intervening tokens can cause misclassification.
2. **Domain Specificity:**
   - **FEVER:** Trained on Wikipedia English text. Does not generalize reliably to conversational tweets or specialized medical claims.
   - **LIAR:** Derived from US political statements (PolitiFact). Predictions reflect rhetorical patterns of political speech rather than absolute truth.
   - **Jigsaw:** Sourced from Wikipedia talk pages. Discourse patterns differ from social media platforms or workplace communication.
3. **Fairness Scope:**
   - Length cohorts (Short, Medium, Long) represent extrinsic linguistic variation, not demographic identities (race, gender, sexual orientation).
   - Higher False Positive Rates on long comments stem from cumulative vocabulary breadth, where innocuous discussions of offensive topics trigger bag-of-words weights.

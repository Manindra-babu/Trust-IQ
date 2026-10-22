"""
Compatibility shim to ensure pickled Scikit-Learn vectorizers and models
can unpickle cleanly in any environment (Docker, Render, Linux, Windows)
without raising ModuleNotFoundError for legacy training script paths.
"""

import sys
import types
import re

def clean_text(text: str) -> str:
    if not isinstance(text, str):
        return ""
    text = text.lower()
    text = re.sub(r'[\r\n\t]+', ' ', text)
    text = re.sub(r'[^\w\s\.\,\?\!\-]', '', text)
    return text.strip()

def register_unpickle_shims():
    """Registers synthetic module entries in sys.modules if real scripts cannot be imported."""
    for mod in ["train_misinformation", "train_toxicity", "train_evidence", "evaluate_fairness"]:
        full_mod = f"scripts.{mod}"
        try:
            m = __import__(full_mod, fromlist=[mod])
            # Ensure clean_text is present on the imported module
            if not hasattr(m, "clean_text"):
                setattr(m, "clean_text", clean_text)
        except Exception:
            if "scripts" not in sys.modules:
                sys.modules["scripts"] = types.ModuleType("scripts")
            m = types.ModuleType(full_mod)
            m.clean_text = clean_text
            sys.modules[full_mod] = m

# Auto-execute on import
register_unpickle_shims()

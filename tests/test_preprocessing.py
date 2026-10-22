"""
Tests for text preprocessing, tokenization, and schema validation.
"""

import pytest
from scripts.train_evidence import clean_text as clean_ev
from scripts.train_toxicity import clean_text as clean_tox
from scripts.evaluate_fairness import tokenize_words

def test_clean_text_normalizes_and_strips():
    raw = "  Hello \t\n WORLD!   https://example.com/test  "
    cleaned = clean_ev(raw)
    assert "world" in cleaned
    assert "\t" not in cleaned
    assert "\n" not in cleaned

def test_tokenize_words():
    sample = "This is a test comment, containing exactly 8 tokens!"
    tokens = tokenize_words(sample)
    assert len(tokens) == 9
    assert tokens[0] == "this"
    assert tokens[-1] == "tokens"

def test_clean_text_handles_non_strings():
    assert clean_ev(None) == ""
    assert clean_tox(12345) == ""

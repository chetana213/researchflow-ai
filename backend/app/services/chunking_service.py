"""
PDF Text Chunking Service for ResearchFlow AI.

This module provides reusable, deterministic text-chunking logic designed for
Retrieval-Augmented Generation (RAG) pipelines. It accepts extracted document
text and splits it into smaller, overlapping word chunks while maintaining
text order and metadata metrics.

Features:
- Configurable chunk size and overlap (defaults: 500 words, 50 words overlap).
- Strict validation for invalid chunk sizes and overlap configurations.
- Preserves natural document order and keeps the final chunk even if partial.
- Independent of FastAPI routers and MongoDB models for maximum reusability.
"""

from typing import Any, Dict, List, Optional


def chunk_text(
    text: Optional[str],
    chunk_size: int = 500,
    chunk_overlap: int = 50,
) -> List[Dict[str, Any]]:
    """
    Split input text into overlapping word chunks.

    Args:
        text: The source text extracted from a PDF or document.
        chunk_size: Target number of words per chunk (default: 500).
                    Must be a positive integer (> 0).
        chunk_overlap: Number of overlapping words shared between adjacent chunks
                       (default: 50). Must be non-negative (>= 0) and strictly
                       smaller than chunk_size.

    Returns:
        A list of dictionaries, where each item represents a chunk:
        [
            {
                "chunk_index": 0,
                "text": "Chunk text content...",
                "word_count": 500,
                "character_count": 2850
            },
            ...
        ]
        Returns an empty list [] if input text is empty or whitespace-only.

    Raises:
        ValueError: If chunk_size <= 0, chunk_overlap < 0, or chunk_overlap >= chunk_size.
    """
    # ── 1. Validate chunk configuration ─────────────────────────────────────────
    if chunk_size <= 0:
        raise ValueError(
            f"chunk_size must be a positive integer greater than 0, got {chunk_size}."
        )

    if chunk_overlap < 0:
        raise ValueError(
            f"chunk_overlap must be a non-negative integer (>= 0), got {chunk_overlap}."
        )

    if chunk_overlap >= chunk_size:
        raise ValueError(
            f"chunk_overlap ({chunk_overlap}) must be strictly smaller than "
            f"chunk_size ({chunk_size})."
        )

    # ── 2. Handle empty or whitespace-only text ─────────────────────────────────
    if not text or not text.strip():
        return []

    # ── 3. Split text into individual words ─────────────────────────────────────
    words = text.split()
    if not words:
        return []

    # ── 4. Slide window across words with overlap ───────────────────────────────
    # The step size determines how many new words each subsequent chunk advances.
    step = chunk_size - chunk_overlap
    total_words = len(words)
    chunks: List[Dict[str, Any]] = []
    chunk_index = 0

    for start in range(0, total_words, step):
        end = min(start + chunk_size, total_words)
        chunk_words = words[start:end]
        chunk_text_content = " ".join(chunk_words)

        chunks.append({
            "chunk_index": chunk_index,
            "text": chunk_text_content,
            "word_count": len(chunk_words),
            "character_count": len(chunk_text_content),
        })

        chunk_index += 1

        # When the current chunk has consumed all remaining words, terminate loop
        if end >= total_words:
            break

    return chunks

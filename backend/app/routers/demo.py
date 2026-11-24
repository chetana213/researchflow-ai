"""
Demo router demonstrating synchronous vs. asynchronous execution in FastAPI.
"""

import asyncio
import time
from fastapi import APIRouter

router = APIRouter(prefix="/demo", tags=["Demo"])


@router.get("/sync", tags=["Demo"])
def demo_sync():
    """
    Demonstration of a synchronous endpoint using standard def.
    Simulates a blocking operation using time.sleep.
    """
    time.sleep(2)
    return {
        "mode": "synchronous",
        "message": "Blocking operation completed",
    }


@router.get("/async", tags=["Demo"])
async def demo_async():
    """
    Demonstration of an asynchronous endpoint using async def.
    Simulates a non-blocking operation using await asyncio.sleep.
    """
    await asyncio.sleep(2)
    return {
        "mode": "asynchronous",
        "message": "Non-blocking operation completed",
    }

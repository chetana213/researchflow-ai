
import os
from dotenv import load_dotenv
from pymongo import AsyncMongoClient

# Load environment variables from backend/.env
load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
DATABASE_NAME = os.getenv("MONGODB_DATABASE", "researchflow")

if not MONGODB_URI:
    raise ValueError("MONGODB_URI is missing from the .env file")

# Create the asynchronous MongoDB client
client = AsyncMongoClient(MONGODB_URI)

# Select the ResearchFlow database
database = client[DATABASE_NAME]


async def connect_to_mongo():
    """Check whether MongoDB Atlas is reachable."""
    await client.admin.command("ping")
    print("Connected successfully to MongoDB Atlas!")


async def close_mongo_connection():
    """Close the MongoDB client."""
    await client.close()
    print("MongoDB connection closed.")

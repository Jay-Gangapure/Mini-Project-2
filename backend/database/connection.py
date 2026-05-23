"""
Async MongoDB connection using Motor.
"""

import motor.motor_asyncio
from utils.config import settings

client: motor.motor_asyncio.AsyncIOMotorClient = None
db: motor.motor_asyncio.AsyncIOMotorDatabase = None


async def connect_db():
    global client, db
    client = motor.motor_asyncio.AsyncIOMotorClient(settings.MONGO_URI)
    db = client[settings.MONGO_DB_NAME]
    print(f"✅  Connected to MongoDB → {settings.MONGO_DB_NAME}")


async def disconnect_db():
    global client
    if client:
        client.close()
        print("🔌  Disconnected from MongoDB")


def get_db() -> motor.motor_asyncio.AsyncIOMotorDatabase:
    """Dependency injected into routes."""
    return db

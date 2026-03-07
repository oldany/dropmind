# ============================================================
# DropMind Backend
# ------------------------------------------------------------
# FastAPI + SQLite monolithic backend
# Personal project – publication-ready version
# ------------------------------------------------------------
# This file intentionally remains monolithic
# for easier cloning, reading and modification.
# ============================================================

# ============================================================
# STANDARD LIBRARY IMPORTS
# ============================================================

import os
import sqlite3
import uuid
import mimetypes
from datetime import datetime
from typing import Optional

# ============================================================
# THIRD PARTY IMPORTS
# ============================================================

from fastapi import (
    FastAPI,
    UploadFile,
    File,
    Form,
    HTTPException,
    Depends,
    Header,
    Query,
    Request,
    APIRouter,
)

from fastapi.responses import FileResponse, RedirectResponse
from pydantic import BaseModel

# ============================================================
# CONFIGURATION
# ============================================================

DB_PATH = "/data/db/messages.db"

# ============================================================
# AUTHENTICATION
# ============================================================

API_TOKEN = os.getenv("DROPMIND_API_TOKEN")

if not API_TOKEN:
    raise RuntimeError("DROPMIND_API_TOKEN environment variable not set")

def verify_token(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing token")

    token = authorization.split(" ", 1)[1]

    if token != API_TOKEN:
        raise HTTPException(status_code=403, detail="Invalid token")

api_router = APIRouter(
    prefix="/api",
    dependencies=[Depends(verify_token)]
)

app = FastAPI(
    title="DropMind API",
    version="2.0"
)

# ============================================================
# DATABASE INITIALIZATION
# ============================================================

# Create a new SQLite connection
def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn

# Initialize storage folders and database schema
@app.on_event("startup")
def startup():
    os.makedirs("/data/db", exist_ok=True)
    os.makedirs("/data/attachments", exist_ok=True)

    conn = get_db()

    # Create tables if they do not exist
    conn.execute("""
    CREATE TABLE IF NOT EXISTS clipboards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        created_at TEXT
    )
    """)

    # Messages table
    conn.execute("""
    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        text TEXT,
        filename TEXT,
        clipboard_id INTEGER,
        created_at TEXT,
        updated_at TEXT,
        pinned INTEGER DEFAULT 0,
        FOREIGN KEY (clipboard_id) REFERENCES clipboards(id)
    )
    """)

    # Create clipboard main if not exist
    now = datetime.utcnow().isoformat()
    conn.execute(
        "INSERT OR IGNORE INTO clipboards (id, name, created_at) VALUES (1, 'main', ?)",
        (now,)
    )

    conn.commit()
    conn.close()

# =========================
# MODELS
# =========================

class MessageIn(BaseModel):
    text: Optional[str] = None
    clipboard_id: int


class MessageOut(BaseModel):
    id: int
    text: Optional[str]
    filename: Optional[str]
    clipboard_id: int
    created_at: str
    updated_at: str
    pinned: int
    file_size: Optional[int] = None
    original_filename: Optional[str] = None

# ============================================================
# CLIPBOARD ROUTES
# ============================================================

@api_router.get("/clipboards")
def list_clipboards():
    conn = get_db()
    rows = conn.execute("SELECT * FROM clipboards ORDER BY name").fetchall()
    conn.close()
    return [dict(r) for r in rows]


@api_router.post("/clipboards")
def create_clipboard(name: str = Form(...)):
    conn = get_db()
    now = datetime.utcnow().isoformat()

    conn.execute(
        "INSERT INTO clipboards (name, created_at) VALUES (?, ?)",
        (name, now)
    )
    conn.commit()
    conn.close()
    return {"status": "created"}

@api_router.put("/clipboards/{clipboard_id}")
def rename_clipboard(clipboard_id: int, name: str = Form(...)):
    conn = get_db()
    conn.execute(
        "UPDATE clipboards SET name = ? WHERE id = ?",
        (name, clipboard_id)
    )
    conn.commit()
    conn.close()
    return {"status": "renamed"}

@api_router.delete("/clipboards/{clipboard_id}")
def delete_clipboard(clipboard_id: int):
    if clipboard_id == 1:
        raise HTTPException(status_code=400, detail="Cannot delete main clipboard")
    conn = get_db()

    # Delete related messages first
    conn.execute(
        "DELETE FROM messages WHERE clipboard_id = ?",
        (clipboard_id,)
    )

    conn.execute(
        "DELETE FROM clipboards WHERE id = ?",
        (clipboard_id,)
    )

    conn.commit()
    conn.close()

    return {"status": "deleted"}

@api_router.put("/messages/{message_id}", response_model=MessageOut)
def update_message(message_id: int, text: str = Form(...)):
    conn = get_db()
    now = datetime.utcnow().isoformat()

    conn.execute(
        "UPDATE messages SET text = ?, updated_at = ? WHERE id = ?",
        (text, now, message_id)
    )

    conn.commit()

    row = conn.execute(
        "SELECT * FROM messages WHERE id = ?",
        (message_id,)
    ).fetchone()

    conn.close()

    return dict(row)

# =========================
# MESSAGES
# =========================

@api_router.get("/messages", response_model=list[MessageOut])
def list_messages(
    clipboard_id: Optional[int] = None,
    order: str = "desc"
):
    conn = get_db()

    base_query = "SELECT * FROM messages"
    params = []

    if clipboard_id is not None:
        base_query += " WHERE clipboard_id = ?"
        params.append(clipboard_id)

    # Sorting logic
    if order == "activity":
        base_query += " ORDER BY pinned DESC, updated_at DESC"
    elif order in ["asc", "oldest"]:
        base_query += " ORDER BY pinned DESC, created_at ASC"
    else:  # desc / recent
        base_query += " ORDER BY pinned DESC, created_at DESC"

    rows = conn.execute(base_query, params).fetchall()
    conn.close()

    result = []

    for r in rows:
        message = dict(r)

        # Extract original filename (remove UUID prefix if present)
        if message.get("filename"):
            parts = message["filename"].split("_", 1)
            if len(parts) == 2:
                message["original_filename"] = parts[1]
            else:
                message["original_filename"] = message["filename"]
        else:
            message["original_filename"] = None

        file_size = None

        if message.get("filename"):
            file_path = f"/data/attachments/{message['filename']}"
            if os.path.exists(file_path):
                file_size = os.path.getsize(file_path)

        message["file_size"] = file_size

        result.append(message)

    return result

@api_router.post("/messages", response_model=MessageOut)
def create_message(msg: MessageIn):
    conn = get_db()
    now = datetime.utcnow().isoformat()

    cur = conn.execute(
        """
        INSERT INTO messages (text, filename, clipboard_id, created_at, updated_at, pinned)
        VALUES (?, ?, ?, ?, ?, 0)
        """,
        (msg.text, None, msg.clipboard_id, now, now)
    )

    conn.commit()
    msg_id = cur.lastrowid
    conn.close()

    return {
        "id": msg_id,
        "text": msg.text,
        "filename": None,
        "original_filename": None,
        "clipboard_id": msg.clipboard_id,
        "created_at": now,
        "updated_at": now,
        "pinned": 0,
        "file_size": None
    }


@api_router.post("/messages/{message_id}/pin")
def pin_message(message_id: int, pinned: bool):
    conn = get_db()
    now = datetime.utcnow().isoformat()

    conn.execute(
        "UPDATE messages SET pinned = ?, updated_at = ? WHERE id = ?",
        (1 if pinned else 0, now, message_id)
    )
    conn.commit()
    conn.close()
    return {"status": "ok"}


@api_router.delete("/messages/{message_id}")
def delete_message(message_id: int):
    conn = get_db()
    conn.execute("DELETE FROM messages WHERE id = ?", (message_id,))
    conn.commit()
    conn.close()
    return {"status": "deleted"}

# ============================================
# MOVE MESSAGE
# ============================================

@api_router.post("/messages/{message_id}/move")
def move_message(message_id: int, clipboard_id: int):
    conn = get_db()
    now = datetime.utcnow().isoformat()

    # Update message clipboard and refresh updated_at timestamp
    conn.execute(
        """
        UPDATE messages
        SET clipboard_id = ?, updated_at = ?
        WHERE id = ?
        """,
        (clipboard_id, now, message_id)
    )

    conn.commit()
    conn.close()

    return {"status": "ok"}

# =========================
# CREATE MESSAGE WITH FILE
# =========================

@api_router.post("/messages/file", response_model=MessageOut)
def create_message_file(
    file: UploadFile = File(...),
    text: Optional[str] = Form(None),
    clipboard_id: int = Form(...),
    x_filename: Optional[str] = Header(None)
):

    text = text or ""


    os.makedirs("/data/attachments", exist_ok=True)
    conn = get_db()
    now = datetime.utcnow().isoformat()

    original_name = x_filename if x_filename else file.filename
    original_name = os.path.basename(original_name)

    unique_id = uuid.uuid4().hex
    filename = f"{unique_id}_{original_name}"

    save_path = f"/data/attachments/{filename}"

    with open(save_path, "wb") as f:
        f.write(file.file.read())

    cur = conn.execute(
        """
        INSERT INTO messages
        (text, filename, clipboard_id, created_at, updated_at, pinned)
        VALUES (?, ?, ?, ?, ?, 0)
        """,
        (text, filename, clipboard_id, now, now)
    )

    conn.commit()
    msg_id = cur.lastrowid
    conn.close()

    file_size = os.path.getsize(save_path)

    return {
        "id": msg_id,
        "text": text or "",
        "filename": filename,
        "original_filename": original_name,
        "clipboard_id": clipboard_id,
        "created_at": now,
        "updated_at": now,
        "pinned": 0,
        "file_size": file_size
    }

# =======================================================
# CREATE MESSAGE WITH FILE (DIRECT BODY - FOR SHORTCUT)
# =======================================================

@api_router.post("/messages/file-direct/{clipboard_id}")
async def create_message_file_direct(
    clipboard_id: int,
    request: Request
):
    os.makedirs("/data/attachments", exist_ok=True)

    content = await request.body()

    if not content:
        raise HTTPException(status_code=400, detail="Empty file body")

    now = datetime.utcnow().isoformat()

    # Generic file name (binary)
    content_type = request.headers.get("content-type", "")
    content_disposition = request.headers.get("content-disposition", "")

    # Try to read original filename from header custom
    original_filename = request.headers.get("x-filename")
    content_type = request.headers.get("content-type", "")

    if original_filename:
        safe_name = os.path.basename(original_filename)
        base, ext = os.path.splitext(safe_name)

        if not ext:
            ext = mimetypes.guess_extension(content_type) or ""
            if ext == ".jpe":
                ext = ".jpg"

        filename = f"{uuid.uuid4().hex}_{base}{ext}"

    else:
        ext = mimetypes.guess_extension(content_type) or ""
        if ext == ".jpe":
            ext = ".jpg"

        filename = f"{uuid.uuid4().hex}{ext}"

    save_path = f"/data/attachments/{filename}"

    with open(save_path, "wb") as f:
        f.write(content)

    conn = get_db()

    cur = conn.execute(
        """
        INSERT INTO messages
        (text, filename, clipboard_id, created_at, updated_at, pinned)
        VALUES (?, ?, ?, ?, ?, 0)
        """,
        ("", filename, clipboard_id, now, now)
    )

    conn.commit()
    msg_id = cur.lastrowid
    conn.close()

    original_filename = original_filename if original_filename else filename

    return {
        "id": msg_id,
        "text": text,
        "filename": filename,
        "original_filename": original_filename,
        "clipboard_id": clipboard_id,
        "created_at": now,
        "updated_at": now,
        "pinned": 0
    }

# ============================================================
# ANDROID SHARE TARGET
# ============================================================

@app.post("/share")
async def android_share(
    title: str = Form(None),
    text: str = Form(None),
    url: str = Form(None),
    file: UploadFile = File(None)
):

    if file:

        os.makedirs("/data/attachments", exist_ok=True)

        original_name = os.path.basename(file.filename or "file")

        ext = os.path.splitext(original_name)[1]

        safe_name = f"{uuid.uuid4().hex}{ext}"

        file_location = f"/data/attachments/{safe_name}"

        with open(file_location, "wb") as f:
            f.write(await file.read())

        return RedirectResponse(
            url=f"/?shared_file={safe_name}",
            status_code=303
        )

    content = ""

    if url:
        content += url

    if text:
        if content:
            content += "\n---\n"
        content += text

    if title and not content:
        content = title

    return RedirectResponse(
        url=f"/?share={content}",
        status_code=303
    )

app.include_router(api_router)

from fastapi import Query

@app.get("/api/files/{filename}")
def get_file(
    filename: str,
    token: str = Query(None),
    authorization: str = Header(None)
):
    if not API_TOKEN:
        raise HTTPException(status_code=500, detail="API token not configured")

    if token:
        if token != API_TOKEN:
            raise HTTPException(status_code=403, detail="Invalid token")
    else:
        verify_token(authorization)

    file_path = f"/data/attachments/{filename}"

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")

    return FileResponse(file_path)

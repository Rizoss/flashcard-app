import sqlite3
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Flashcards API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_PATH = os.getenv("DATABASE_PATH", "flashcards.db")

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    with get_db() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS flashcards (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                word_en TEXT NOT NULL,
                word_es TEXT NOT NULL,
                sentence_en TEXT,
                sentence_es TEXT
            )
        """)

init_db()

class Flashcard(BaseModel):
    word_en: str
    word_es: str
    sentence_en: str = ""
    sentence_es: str = ""

@app.get("/api/cards") 
def get_cards():
    with get_db() as conn:
        rows = conn.execute("SELECT * FROM flashcards ORDER BY id DESC").fetchall()
        return [dict(r) for r in rows]

@app.post("/api/cards") 
def add_card(card: Flashcard):
    with get_db() as conn:
        cursor = conn.execute(
            "INSERT INTO flashcards (word_en, word_es, sentence_en, sentence_es) VALUES (?, ?, ?, ?)",
            (card.word_en, card.word_es, card.sentence_en, card.sentence_es)
        )
        conn.commit()
        return {"id": cursor.lastrowid, **card.model_dump()}
    
@app.put("/api/cards/{card_id}")
def update_card(card_id: int, card: Flashcard):
    with get_db() as conn:
    
        existing = conn.execute("SELECT id FROM flashcards WHERE id = ?", (card_id,)).fetchone()
        if not existing:
            raise HTTPException(status_code=404, detail="Card not found")
        
      
        conn.execute("""
            UPDATE flashcards 
            SET word_en = ?, word_es = ?, sentence_en = ?, sentence_es = ?
            WHERE id = ?
        """, (card.word_en, card.word_es, card.sentence_en, card.sentence_es, card_id))
        conn.commit()
        return {"id": card_id, **card.model_dump()}

@app.delete("/api/cards/{card_id}")
def delete_card(card_id: int):
    with get_db() as conn:
      
        conn.execute("DELETE FROM flashcards WHERE id = ?", (card_id,))
        conn.commit()
        return {"message": "Borrado correctamente"}
    
@app.get("/")
def read_root():
    return {"message": "Hola desde Render! La API funciona."}

   
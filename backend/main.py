from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from datetime import datetime, date
from sqlalchemy.orm import Session
from database import engine, get_db, Base
import models
import json

load_dotenv()

# Create Tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS configuration
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "PT Gym Backend is running"}

from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class ChatRequest(BaseModel):
    message: str
    history: list = []

@app.post("/api/chat")
def chat_endpoint(request: ChatRequest):
    try:
        system_prompt = """
Sei un Personal Trainer AI esperto. Il tuo obiettivo è fornire schede di allenamento e consigli nutrizionali chiari e strutturati.
"""
        messages = [{"role": "system", "content": system_prompt}]
        messages.append({"role": "user", "content": request.message})

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            max_tokens=200
        )
        
        ai_message = response.choices[0].message.content
        return {"response": ai_message}
    except Exception as e:
        return {"response": f"Error: {str(e)}"}

# --- User Management ---
class UserCreate(BaseModel):
    name: str
    goal: str
    restrictions: str
    frequency: int

@app.post("/api/user")
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    try:
        # Check if user exists (simple single user app for now)
        db_user = db.query(models.User).first()
        if db_user:
            db_user.name = user.name
            db_user.goal = user.goal
            db_user.restrictions = user.restrictions
            db_user.frequency = user.frequency
        else:
            db_user = models.User(
                name=user.name,
                goal=user.goal,
                restrictions=user.restrictions,
                frequency=user.frequency
            )
            db.add(db_user)
        
        db.commit()
        db.refresh(db_user)
        
        # Seed some data for demo purposes if plans are empty
        try:
            seed_plans(db)
        except Exception as e:
            print(f"Seeding error: {e}")
            # Don't fail the request if seeding fails
            pass
        
        return db_user
    except Exception as e:
        print(f"Create User Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/user")
def get_user(db: Session = Depends(get_db)):
    user = db.query(models.User).first()
    if not user:
        return None
    return user

# --- Plans Management ---

def seed_plans(db: Session):
    # Check if we have plans
    if db.query(models.WorkoutPlan).count() == 0:
        # Seed a week of workouts
        today = date.today()
        # Mock logic: just add a plan for today
        w_plan = models.WorkoutPlan(
            date=today,
            muscle_group="Gambe",
            exercises=[
                {"name": "Squat", "sets": "4x8", "rest": "120s", "notes": "Deep"},
                {"name": "Leg Press", "sets": "3x12", "rest": "90s", "notes": "Push"}
            ]
        )
        db.add(w_plan)
        
        n_plan = models.NutritionPlan(
            date=today,
            meals=[
                {"name": "Colazione", "items": ["Yogurt", "Miele"]},
                {"name": "Pranzo", "items": ["Riso", "Pollo"]}
            ]
        )
        db.add(n_plan)
        db.commit()

@app.get("/api/workout/{date_str}")
def get_workout(date_str: str, db: Session = Depends(get_db)):
    try:
        dt = datetime.strptime(date_str, "%Y-%m-%d").date()
        plan = db.query(models.WorkoutPlan).filter(models.WorkoutPlan.date == dt).first()
        
        if plan:
            return {"muscle": plan.muscle_group, "exercises": plan.exercises}

        # Dynamic Plan Generation (Cyclic)
        # Cycle: Petto -> Schiena -> Gambe -> Riposo
        # Use a fixed reference date to ensure consistency
        ref_date = date(2024, 1, 1)
        delta_days = (dt - ref_date).days
        cycle_index = delta_days % 4
        
        if cycle_index == 0:
            return {
                "muscle": "Petto",
                "exercises": [
                    {"name": "Panca Piana", "sets": "4x8", "rest": "120s", "notes": "Controllo"},
                    {"name": "Croci Manubri", "sets": "3x12", "rest": "60s", "notes": "Stretch"},
                    {"name": "Spinte Inclinata", "sets": "3x10", "rest": "90s", "notes": "Focus alto"}
                ]
            }
        elif cycle_index == 1:
            return {
                "muscle": "Schiena",
                "exercises": [
                    {"name": "Lat Machine", "sets": "4x10", "rest": "90s", "notes": "Gomiti bassi"},
                    {"name": "Pulley", "sets": "3x12", "rest": "60s", "notes": "Allunga bene"},
                    {"name": "Rematore", "sets": "4x8", "rest": "120s", "notes": "Schiena dritta"}
                ]
            }
        elif cycle_index == 2:
            return {
                "muscle": "Gambe",
                "exercises": [
                    {"name": "Squat", "sets": "4x8", "rest": "120s", "notes": "Deep"},
                    {"name": "Leg Press", "sets": "3x12", "rest": "90s", "notes": "Push"},
                    {"name": "Leg Extension", "sets": "3x15", "rest": "60s", "notes": "Burn"}
                ]
            }
        else:
            return {"muscle": "Riposo", "exercises": []}
            
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/nutrition/{date_str}")
def get_nutrition(date_str: str, db: Session = Depends(get_db)):
    try:
        dt = datetime.strptime(date_str, "%Y-%m-%d").date()
        plan = db.query(models.NutritionPlan).filter(models.NutritionPlan.date == dt).first()
        
        if plan:
            return {"meals": plan.meals}

        # Dynamic Nutrition Plan Generation (Cyclic)
        # Cycle: High Carb -> Low Carb -> Balanced -> Detox
        ref_date = date(2024, 1, 1)
        delta_days = (dt - ref_date).days
        cycle_index = delta_days % 4
        
        if cycle_index == 0: # High Carb (Training Day)
            return {
                "meals": [
                    {"name": "Colazione", "items": ["Porridge d'avena (80g)", "Banana", "Proteine in polvere"]},
                    {"name": "Pranzo", "items": ["Riso Basmati (100g)", "Petto di pollo (150g)", "Zucchine"]},
                    {"name": "Cena", "items": ["Patate dolci (200g)", "Merluzzo (200g)", "Olio EVO"]}
                ]
            }
        elif cycle_index == 1: # Low Carb (Rest Day)
            return {
                "meals": [
                    {"name": "Colazione", "items": ["Uova strapazzate (3)", "Avocado toast", "Caffè nero"]},
                    {"name": "Pranzo", "items": ["Insalatona mista", "Tonno al naturale (150g)", "Noci"]},
                    {"name": "Cena", "items": ["Salmone alla piastra (200g)", "Asparagi", "Olio EVO"]}
                ]
            }
        elif cycle_index == 2: # Balanced
            return {
                "meals": [
                    {"name": "Colazione", "items": ["Yogurt Greco (200g)", "Miele", "Frutti di bosco"]},
                    {"name": "Pranzo", "items": ["Pasta integrale (80g)", "Macinato magro (150g)", "Sugo"]},
                    {"name": "Cena", "items": ["Tacchino (150g)", "Verdure grigliate", "Pane integrale (50g)"]}
                ]
            }
        else: # Detox / Light
            return {
                "meals": [
                    {"name": "Colazione", "items": ["Smoothie verde", "Mela", "Mandorle"]},
                    {"name": "Pranzo", "items": ["Quinoa (80g)", "Ceci (100g)", "Pomodorini"]},
                    {"name": "Cena", "items": ["Vellutata di zucca", "Ricotta light (100g)", "Crostini"]}
                ]
            }
    except Exception as e:
        return {"error": str(e)}

class LogRequest(BaseModel):
    type: str
    content: str

@app.post("/api/log")
def log_activity(request: LogRequest):
    return {"status": "success", "analysis": f"Ho registrato il tuo {request.type}: '{request.content}'."}


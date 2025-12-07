from sqlalchemy import Column, Integer, String, JSON, Date, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    goal = Column(String)
    restrictions = Column(String)
    frequency = Column(Integer)

class WorkoutPlan(Base):
    __tablename__ = "workout_plans"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, index=True)
    muscle_group = Column(String)
    exercises = Column(JSON) # List of exercises

class NutritionPlan(Base):
    __tablename__ = "nutrition_plans"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, index=True)
    meals = Column(JSON) # List of meals

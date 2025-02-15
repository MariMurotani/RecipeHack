from fastapi import FastAPI
import xgboost as xgb
import numpy as np
from pydantic import BaseModel
from sklearn.preprocessing import MinMaxScaler
import pickle


# start server
# uvicorn jupyter.app:app --host 0.0.0.0 --port 8000 --reload

# Initialize FastAPI app
app = FastAPI()

# Load the saved XGBoost model
model = xgb.XGBClassifier()
model.load_model("../data/unusual_paring_model.json")

# Load the saved scaler
with open("../data/scaler.pkl", "rb") as f:
    scaler = pickle.load(f)

# Define request schema
class FoodPairRequest(BaseModel):
    frequency: float
    shared_aromas: float
    food1_pagerank: float
    food2_pagerank: float
    pagerank_diff: float

# Define Neo4j queries
# TODO: implement the logic
def find_score(tx, id1, id2):
    query4 = f"""
        MATCH (f1:Food {{id: '{id1}'}})-[:SCENTED]->(a:Aroma)<-[:SCENTED]-(f2:Food {{id: '{id2}'}})
        WHERE id(f1) <> id(f2)
        RETURN f1.name AS food1, f2.name AS food2, 
            f1.popularity AS popularity,
            f1.frequency AS frequency, f1.shared_aromas AS shared_aromas, 
            f1.pagerank AS food1_pagerank, 
            f2.pagerank AS food2_pagerank, 
            f1.pagerank_diff AS pagerank_diff
        ORDER BY frequency, shared_aromas DESC
    """
    tx.run(query4)

# API route for prediction
@app.post("/predict/")
def predict(food_pair: FoodPairRequest):
    # Convert input to a NumPy array and scale
    input_data = np.array([[food_pair.frequency, food_pair.shared_aromas, 
                            food_pair.food1_pagerank, food_pair.food2_pagerank, 
                            food_pair.pagerank_diff]])
    
    input_scaled = scaler.transform(input_data)

    # Predict
    prediction = model.predict(input_scaled)[0]
    
    return {"unusual_pairing": bool(prediction)}

# API root
@app.get("/")
def root():
    return {"message": "Food Pairing Prediction API is running!"}

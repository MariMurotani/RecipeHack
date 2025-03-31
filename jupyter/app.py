from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import xgboost as xgb
import numpy as np
from pydantic import BaseModel
from sklearn.preprocessing import MinMaxScaler
import pickle
from neo4j import GraphDatabase
import pandas as pd


# start server
# poetry run uvicorn app:app --host 0.0.0.0 --port 8000 --reload
# DB接続処理
# Neo4jに接続
uri = "bolt://localhost:7687"
user = "neo4j"
password = "abcd7890"


# curl -X 'POST' \
#   'http://127.0.0.1:8000/predict/' \
#   -H 'Content-Type: application/json' \
#   -d '{
#     "food1_id": "garlic",
#     "food2_id": "garden_tomato"
#   }'

# ドライバを作成
driver = GraphDatabase.driver(uri, auth=(user, password))
# Initialize FastAPI app
app = FastAPI()
# CORSの設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # すべてのオリジンを許可（本番では特定のドメインのみを指定）
    allow_credentials=True,
    allow_methods=["*"],  # すべてのHTTPメソッドを許可
    allow_headers=["*"],  # すべてのヘッダーを許可
)

# Load the saved XGBoost model
model = xgb.XGBClassifier()
model.load_model("../data/unusual_paring_model.json")

# Load the saved scaler
with open("../data/scaler_X.pkl", "rb") as f:
    scalerX = pickle.load(f)

with open("../data/scaler_y.pkl", "rb") as f:
    scalerY = pickle.load(f)

# Define request schema
class FoodPairRequest(BaseModel):
    food1_id: str
    food2_id: str

# Define request schema
class FoodPairResponse(BaseModel):
    usual_pairing: bool
    potentially_new_pairing: bool

    
# Define Neo4j queries
def find_score(tx, id1, id2):
    query4 = """
        MATCH (f1:Food {id: $id1})
        MATCH (f2:Food {id: $id2})
        OPTIONAL MATCH (f1)-[r:USED_TOGETHER]->(f2)
        OPTIONAL MATCH (f1)-[:SCENTED]->(a:Aroma)<-[:SCENTED]-(f2)
        RETURN f1.id AS food1_id, 
               f2.id AS food2_id, 
               SUM(COALESCE(r.frequency, 0)) AS frequency,
               COUNT(a) AS shared_aromas,
               f1.popularity AS food1_popularity,
               f2.popularity AS food2_popularity,
               f1.aroma_page_rank AS food1_aroma_page_rank, 
               f2.aroma_page_rank AS food2_aroma_page_rank,
               f1.recipe_page_rank AS food1_recipe_page_rank, 
               f2.recipe_page_rank AS food2_recipe_page_rank,
               gds.similarity.cosine(f1.word_vector, f2.word_vector) as word_similarity, 
               gds.similarity.overlap(f1.flavor_vector, f2.flavor_vector) as flavor_similarity

    """
    result = tx.run(query4, id1=id1, id2=id2)
    data = result.data()
    
    if data:
        return data[0]  # 1つのデータのみ取得
    return None

# API route for prediction
@app.post("/predict/")
def predict(food_pair: FoodPairRequest) -> FoodPairResponse:
    Xcolumns = ["shared_aromas","food1_popularity","food2_popularity","food1_aroma_page_rank","food2_aroma_page_rank", "food1_recipe_page_rank", "food2_recipe_page_rank", "word_similarity", "flavor_similarity"]

    # Neo4j からデータ取得
    with driver.session() as session:
        result = session.execute_read(find_score, food_pair.food1_id, food_pair.food2_id)
        print(result)
    
    # データがない場合の処理
    if not result:
        return {"error": "Food pair not found in the database"}
    
    # データフレーム化してスケーリング
    column_names=["food1_id","food2_id","frequency","shared_aromas","food1_popularity","food2_popularity","food1_aroma_page_rank","food2_aroma_page_rank","food1_recipe_page_rank","food2_recipe_page_rank","word_similarity","flavor_similarity"]
    result_df = pd.DataFrame([result], columns=column_names)
    input_scaled = scalerX.transform(result_df[Xcolumns])
    frequently_used = (result_df["frequency"].values[0] > 5)
    
    # 予測実行
    prediction = model.predict(input_scaled)[0]
    
    prediction_probabiliry = model.predict_proba(input_scaled)[0][1]

    # 本当は使われてないのに「使われる」と判断された
    potentially_new_pairing =  bool(prediction) == True and frequently_used == False

    return {
        "usual_pairing": bool(prediction),
        "potentially_new_pairing": bool(potentially_new_pairing)
    }

# API root
@app.get("/")
def root():
    return {"message": "Food Pairing Prediction API is running!"}

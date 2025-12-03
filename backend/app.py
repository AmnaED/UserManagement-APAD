'''from flask import Flask

app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello, World!'

if __name__ == '__main__':
    #app.run(debug=True)
    app.run(host="0.0.0.0", port=5001, debug=True)
'''

# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import os
from dotenv import load_dotenv
from urllib.parse import quote_plus
from bson.objectid import ObjectId

load_dotenv()  # Loads variables from .env into os.environ


app = Flask(__name__)
CORS(app)   # allow React frontend to call Flask API

# MongoDB connection
mongo_pass = os.getenv("MONGO_PASSWORD")
link = f"mongodb+srv://ranyae:{mongo_pass}@apad-project.qvgsgr3.mongodb.net/?retryWrites=true&w=majority"
client = MongoClient(link)
db = client["user-management-db"]

users_collection = db["user-management"]

@app.route("/")
def home():
    return "User Management Service is running!"

# API endpoint to get all users
@app.route("/api/users", methods=["GET"])
def get_users():
    users = list(users_collection.find({}, {"_id": 0, "password": 0}))  # hide passwords
    return jsonify(users)

# API endpoint to create a new user
@app.route("/api/users", methods=["POST"])
def create_user():
    data = request.json
    # Basic validation
    if not data.get("user_id") or not data.get("password"):
        return jsonify({"error": "Missing user_id or password"}), 400
    # Insert into MongoDB
    result = users_collection.insert_one(data)
    # Convert the MongoDB ObjectId to string for JSON
    data["_id"] = str(result.inserted_id)
    return jsonify(data), 201


# API endpoint for login
@app.route("/api/login", methods=["POST"])
def login_user():
    data = request.json
    user = users_collection.find_one(
        {"user_id": data["user_id"], "password": data["password"]}
    )
    if user:
        # Convert ObjectId to string before returning
        user["_id"] = str(user["_id"])
        return jsonify(user), 200
    else:
        return jsonify({"error": "Invalid credentials"}), 401


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)

from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib

app = Flask(__name__)
CORS(app) 

model = joblib.load('model.pkl') #Logistic / Decision

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    df = pd.DataFrame([data])

    df = pd.get_dummies(df, drop_first=True)

    expected_cols = [
        'A1_Score', 'A2_Score', 'A3_Score', 'A4_Score', 'A5_Score',
        'A6_Score', 'A7_Score', 'A8_Score', 'A9_Score', 'A10_Score',
        'gender_m', 'jaundice_yes', 'used_app_before_yes'
    ]
    for col in expected_cols:
        if col not in df.columns:
            df[col] = 0

    df = df[expected_cols]
    pred = model.predict(df)[0]
    return jsonify({'prediction': int(pred)})

if __name__ == '__main__':
    app.run(debug=True)


import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix, ConfusionMatrixDisplay
from collections import Counter
import matplotlib.pyplot as plt
import joblib
   
data = pd.read_csv('train.csv')

features = data[['A1_Score', 'A2_Score', 'A3_Score', 'A4_Score', 'A5_Score',
                 'A6_Score', 'A7_Score', 'A8_Score', 'A9_Score', 'A10_Score',
                 'gender', 'jaundice', 'used_app_before']]
target = data['Class/ASD']

features_encoded = pd.get_dummies(features, columns=['gender', 'jaundice', 'used_app_before'], drop_first=True)
X_train, X_test, y_train, y_test = train_test_split(features_encoded, target, test_size=0.2, random_state=42)

model_logistic = LogisticRegression(class_weight='balanced', max_iter=1000)
model_logistic.fit(X_train, y_train)
predictions_logistic = model_logistic.predict(X_test)

accuracy_logistic = accuracy_score(y_test, predictions_logistic)
print(f'Accuracy Logistic Regression: {accuracy_logistic}')
print(classification_report(y_test, predictions_logistic))

print("Distribusi prediksi:", Counter(predictions_logistic))
print("Confusion Matrix:\n", confusion_matrix(y_test, predictions_logistic))

ConfusionMatrixDisplay.from_estimator(model_logistic, X_test, y_test)
plt.title("Confusion Matrix - Logistic Regression")
plt.show()

# Save the trained model
joblib.dump(model_logistic, 'model.pkl')

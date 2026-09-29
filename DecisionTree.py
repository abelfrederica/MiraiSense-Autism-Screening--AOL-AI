import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
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

model_tree = DecisionTreeClassifier(
    class_weight='balanced',
    max_depth=5,            #Hindari overfitting
    min_samples_leaf=5,     #Hindari cabang kecil
    random_state=42
)
model_tree.fit(X_train, y_train)

predictions_tree = model_tree.predict(X_test)

accuracy_tree = accuracy_score(y_test, predictions_tree)
print(f'Accuracy Decision Tree: {accuracy_tree:.4f}')
print("\nClassification Report:")
print(classification_report(y_test, predictions_tree))

print("Distribusi Prediksi:", Counter(predictions_tree))
print("\nConfusion Matrix:")
print(confusion_matrix(y_test, predictions_tree))

ConfusionMatrixDisplay.from_estimator(model_tree, X_test, y_test)
plt.title("Confusion Matrix - Decision Tree")
plt.show()

# Save the trained model
joblib.dump(model_tree, 'model2.pkl')
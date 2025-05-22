from flask import Flask, render_template, jsonify, request
import requests
import html
from deep_translator import GoogleTranslator  # 📌 Librairie pour traduire les textes

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")  # ✅ Affiche la page principale

@app.route("/get_questions")
def fetch_questions():
    try:
        # ✅ Récupérer la difficulté depuis le front-end
        difficulty = request.args.get("difficulty", "medium")

        # ✅ API Open Trivia Database (questions en anglais)
        url = f"https://opentdb.com/api.php?amount=10&difficulty={difficulty}&type=multiple"
        response = requests.get(url)

        if response.status_code != 200:
            return jsonify({"error": "Impossible de récupérer les questions"})

        questions = response.json()["results"]

        # ✅ Traduction rapide en français
        def translate_text(text):
            return GoogleTranslator(source="auto", target="fr").translate(html.unescape(text))

        for q in questions:
            q["question"] = translate_text(q["question"])
            q["correct_answer"] = translate_text(q["correct_answer"])
            q["incorrect_answers"] = [translate_text(ans) for ans in q["incorrect_answers"]]

        return jsonify(questions)  # ✅ Retourne les questions traduites en français

    except Exception as e:
        return jsonify({"error": f"Erreur interne : {str(e)}"})

if __name__ == "__main__":
    app.run(debug=True)  # ✅ Lancement du serveur

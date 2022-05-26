# -- Modules -- #
from flask import Flask, redirect, render_template, request

from os import chdir, path
from re import subn

import tensorflow as tf
from tensorflow import keras

chdir(path.dirname(__file__))
# ===================================================== #
data = keras.datasets.imdb
word_index = data.get_word_index()
word_index = {k: v+3 for (k, v) in word_index.items()}
word_index["<PAD>"] = 0
word_index["<START>"] = 1
word_index["<UNK>"] = 2
word_index["<UNUSED>"] = 3
# ===================================================== #
def encode_review(text):
  rep = "[,.:/\\|()+-=*!@#$%^&]"
  text = subn(rep, "", text)[0].lower().strip().split(' ')
  review = [1]
  for word in text:
    review.append(word_index.get(word, 2))
  
  review = keras.preprocessing.sequence.pad_sequences([review], padding="post", value=0, maxlen=250)
  return review
# ===================================================== #
model = keras.models.load_model("reviews_classifier.h5")
# ===================================================== #

app = Flask(__name__)

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/process_review', methods=["POST", "GET"])
def process_review():
    if (request.method == "GET"):
        return redirect('/')

    if (request.method == "POST"):
        review = request.form.get("review")
        review = encode_review(review)
        result = model.predict(review)
        return str(result[0][0])

if __name__ == "__main__":
    app.run(debug=True)
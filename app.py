import os
from flask import (
    Flask, flash, render_template, json,
    redirect, request, session, url_for)
from flask_pymongo import PyMongo
import datetime
from bson import json_util
from bson.objectid import ObjectId
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash
if os.path.exists("env.py"):
    import env

app = Flask(__name__)

app.config["MONGO_DBNAME"] = os.environ.get("MONGO_DBNAME")
app.config["MONGO_URI"] = os.environ.get("MONGO_URI")
app.secret_key = os.environ.get("SECRET_KEY")

UPLOAD_FOLDER = 'static/images'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif'])

mongo = PyMongo(app)


# allowed file
def allowed_file(filename):
    return '.' in filename and filename.rsplit(
        '.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route("/")
def index():
    categories = mongo.db.Categories.find()
    return render_template("index.html", categories=categories)
# to be completed!


@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        # check if username already exists in db
        existing_user = mongo.db.Users.find_one(
            {"username": request.form.get("username").lower()})

        if existing_user:
            flash("Username already exists")
            return redirect(url_for("register"))

        register = {
            "username": request.form.get("username").lower(),
            "password": generate_password_hash(request.form.get("password"))
        }
        mongo.db.Users.insert_one(register)

        # put the new user into 'session' cookie
        session["user"] = request.form.get("username").lower()
        flash("Registration Successful!")
        return redirect(url_for("profile", username=session["user"]))

    return render_template("register.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        # check if username exists in db
        existing_user = mongo.db.Users.find_one(
            {"username": request.form.get("username").lower()})

        if existing_user:
            # ensure hashed password matches user input
            if check_password_hash(existing_user["password"],
                request.form.get("password")):
                session["user"] = request.form.get("username").lower()
                flash("Welcome, {}".format(
                    request.form.get("username")))
                return redirect(url_for(
                    "profile", username=session["user"]))
            else:
                # invalid password match
                flash("Incorrect Username and/or Password")
                return redirect(url_for('login'))
        else:
            # username doesn't exist
            flash("Incorrect Username and/or Password")
            return redirect(url_for('login'))
    return render_template("login.html")


@app.route("/profile/<username>", methods=["GET", "POST"])
def profile(username):
    # grab the session user's username from db
    username = mongo.db.Users.find_one(
        {"username": session["user"]})["username"]

    if session["user"]:
        return render_template("profile.html", username=username)

    return redirect(url_for("index"))


@app.route("/suggest_recipe", methods=["GET", "POST"])
def suggest_recipe():
    if request.method == "POST":
        file = request.files['inputFile']
        filename = secure_filename(file.filename)
        if file and allowed_file(file.filename):
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            username = mongo.db.Users.find_one(
                {"username": session["user"]})["username"]

            time = {
                "prep_time": request.form.get("prep_time"),
                "cooking_time": request.form.get("cooking_time")
            }
            amounts = {
                "quantity": request.form.get("quantity"),
                "unit": request.form.get("unit")
            }
            ingredient = {
                request.form.get("ingredients"): {"amounts": [amounts]}
            }
            '''
            lenght = len(request.form.getlist("quantity"))
            '''
            today = datetime.datetime.now()
            recipe = {
                "recipe_name": request.form.get("recipe_name"),
                "serving": request.form.get("serving"),
                "inputFile": file.filename,
                "time": time,
                "category_name": request.form.get("category_name"),
                "cuisine_name": request.form.get("cuisine_name"),
                "ingredients": ingredient,
                "steps": request.form.getlist("steps"),
                "notes": request.form.getlist("notes"),
                "submission_date": today,
                "created_by": session["user"]
            }
        mongo.db.Recipes.insert(recipe)
        flash("Recipe Successfully Added")
        return redirect(url_for("profile", username=username))

    categories = mongo.db.Categories.find().sort("category_name", 1)
    cuisines = mongo.db.Cuisines.find().sort("cuisine_name", 1)
    units = list(mongo.db.Units.find().sort("unit", 1))
    return render_template(
        "suggest-recipe.html", categories=categories,
        cuisines=cuisines, units=units)


if __name__ == "__main__":
    app.run(host=os.environ.get("IP"),
            port=int(os.environ.get("PORT")),
            debug=True)

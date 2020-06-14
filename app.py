# -------------------------------------------- #
# Imports.
# -------------------------------------------- #

# Built-Ins
import sys
import os

# Flask
from flask import Flask, render_template, request, redirect, url_for, jsonify, abort
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

# Data
from models import setup_db

# Blueprints
from routes import main

# -------------------------------------------- #
# Application factory.
# -------------------------------------------- #

def create_app(test_config=None):

  # Configuration and Database
  app = Flask(__name__)
  setup_db(app)

  # Blueprints
  app.register_blueprint(main)

  return app


APP = create_app()

if __name__ == '__main__':
    APP.run(host='0.0.0.0', port=8080, debug=True)

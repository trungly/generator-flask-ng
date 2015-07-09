import os
import sys
import logging

dirname = os.path.dirname(os.path.dirname(__file__))
sys.path.insert(0, dirname)

from src import create_app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)

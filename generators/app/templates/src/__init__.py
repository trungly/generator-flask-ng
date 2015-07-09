def create_app(name=None, **flask_kws):

    from flask import Flask
    app = Flask(name or __name__, **flask_kws)

    app.config.from_object('src.config.production')
    if app.debug:
        app.config.from_object('src.config.local')

    from src.routes import routes
    for route in routes:
        rule, view_func = route
        app.add_url_rule(rule, view_func=view_func)

    return app

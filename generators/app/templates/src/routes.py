from views import *

routes = [
    ('/', HomePageView.as_view('home_page')),
    # ('/api', api),
]

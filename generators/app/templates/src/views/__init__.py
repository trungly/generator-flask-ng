from flask import render_template
from flask.views import View


class RenderTemplateMixin(object):
    template_name = None
    def dispatch_request(self):
        assert self.template_name
        return render_template(self.template_name)


class GetContextMixin(object):
    def get_context(self, **kwargs):
        return {}


class BaseView(RenderTemplateMixin, GetContextMixin, View):
    def dispatch_request(self):
        return render_template(self.template_name, **self.get_context())


class HomePageView(BaseView):
    template_name = 'home_page.html'

    def get_context(self, **kwargs):
        context = super(HomePageView, self).get_context(**kwargs)
        context['name'] = 'World'
        return context

# This file is part of Buildbot.  Buildbot is free software: you can
# redistribute it and/or modify it under the terms of the GNU General Public
# License as published by the Free Software Foundation, version 2.
#
# This program is distributed in the hope that it will be useful, but WITHOUT
# ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
# FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more
# details.
#
# You should have received a copy of the GNU General Public License along with
# this program; if not, write to the Free Software Foundation, Inc., 51
# Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
#
# Copyright Buildbot Team Members


from zope.interface import implements
from twisted.python import components
from twisted.spread import pb
from twisted.web import server
from twisted.web.resource import Resource, NoResource

from buildbot import interfaces, version
from buildbot.status import logfile
from buildbot.status.logfile import HTMLLogFile
from buildbot.status.web.base import IHTMLLog, HtmlResource, getCodebasesArg, ContextMixin, \
    path_to_codebases, path_to_build, path_to_builder, path_to_builders
from buildbot.status.web.xmltestresults import XMLTestResource
from buildbot.status.web.jsontestresults import JSONTestResource


class ChunkConsumer:
    implements(interfaces.IStatusLogConsumer)

    def __init__(self, original, textlog):
        self.original = original
        self.textlog = textlog
    def registerProducer(self, producer, streaming):
        self.producer = producer
        self.original.registerProducer(producer, streaming)
    def unregisterProducer(self):
        self.original.unregisterProducer()
    def writeChunk(self, chunk):
        formatted = self.textlog.content([chunk])
        try:
            if isinstance(formatted, unicode):
                formatted = formatted.encode('utf-8')
            self.original.write(formatted)
        except pb.DeadReferenceError:
            self.producing.stopProducing()
    def finish(self):
        self.textlog.finished()


# /builders/$builder/builds/$buildnum/steps/$stepname/logs/$logname
class TextLog(Resource, ContextMixin):
    # a new instance of this Resource is created for each client who views
    # it, so we can afford to track the request in the Resource.
    implements(IHTMLLog)

    asText = False
    withHeaders = False
    subscribed = False
    iFrame = False

    def __init__(self, original):
        Resource.__init__(self)
        self.original = original
        self.pageTitle = "Log"

    def getChild(self, path, req):
        if path == "text":
            self.asText = True
            return self
        if path == "text_with_headers":
            self.asText = True
            self.withHeaders = True
            return self
        if path == "iframe":
            self.iFrame = True
            return self
        return Resource.getChild(self, path, req)

    def content(self, entries):
        html_entries = []
        text_data = ''
        for type, entry in entries:
            if type >= len(logfile.ChunkTypes) or type < 0:
                # non-std channel, don't display
                continue
            
            is_header = type == logfile.HEADER

            if not self.asText:
                # jinja only works with unicode, or pure ascii, so assume utf-8 in logs
                if not isinstance(entry, unicode):
                    entry = unicode(entry, 'utf-8', 'replace')
                html_entries.append(dict(type = logfile.ChunkTypes[type], 
                                         text = entry,
                                         is_header = is_header))
            elif not is_header:
                text_data += entry

        if self.asText:
            return text_data
        else:
            return self.chunk_template.module.chunks(html_entries)

    def render_HEAD(self, req):
        self._setContentType(req)

        # vague approximation, ignores markup
        req.setHeader("content-length", self.original.length)
        return ''

    def render_GET(self, req):
        self._setContentType(req)
        self.req = req

        if self.original.isFinished():
            req.setHeader("Cache-Control", "max-age=604800")
        else:
            req.setHeader("Cache-Control", "no-cache")

        # If plaintext is requested just return the content of the logfile
        if self.asText:
            return self.original.getTextWithHeaders() if self.withHeaders else self.original.getText()

        # Else render the logs template
        
        self.template = req.site.buildbot_service.templates.get_template("logs.html")
        self.chunk_template = req.site.buildbot_service.templates.get_template("log_chunk.html")
        builder = self.original.step.build.builder
        build_id = self.original.step.build.number
        url_dict = self.original.master.status.getURLForBuild(builder.getName(), build_id)

        if self.iFrame:
            data = self.chunk_template.module.page_header(version)
            data = data.encode('utf-8')
            req.write(data)
            self.original.subscribeConsumer(ChunkConsumer(req, self))
            return server.NOT_DONE_YET


        cxt = self.getContext(req)
        build = self.original.step.build
        builder_status = build.builder
        project = builder_status.getProject()
        cxt["pageTitle"] = "Log File Contents"
        cxt["iframe_url"] = req.path + "/iframe"
        cxt["plaintext_url"] = req.path + "/text"
        cxt["plaintext_with_headers_url"] = req.path + "/text_with_headers"
        cxt["builder_name"] = builder.getFriendlyName()
        cxt['path_to_builder'] = path_to_builder(req, builder_status)
        cxt['path_to_builders'] = path_to_builders(req, project)
        cxt["builder_url"] = url_dict['path'] + getCodebasesArg(request=req)
        cxt['path_to_codebases'] = path_to_codebases(req, project)
        cxt['path_to_build'] = path_to_build(req, build)
        cxt['build_number'] = build.getNumber()
        cxt['selectedproject'] = project

        data = self.template.render(**cxt)
        data = data.encode('utf-8')
        req.write(data)

        return ""

            

    def _setContentType(self, req):
        if self.asText:
            req.setHeader("content-type", "text/plain; charset=utf-8")
        else:
            req.setHeader("content-type", "text/html; charset=utf-8")
        
    def finished(self):
        if not self.req:
            return
        try:
            if not self.asText:
                data = self.chunk_template.module.page_footer()
                data = data.encode('utf-8')
                self.req.write(data)
            self.req.finish()
        except pb.DeadReferenceError:
            pass
        # break the cycle, the Request's .notifications list includes the
        # Deferred (from req.notifyFinish) that's pointing at us.
        self.req = None
        
        # release template
        self.template = None

components.registerAdapter(TextLog, interfaces.IStatusLog, IHTMLLog)


class HTMLLog(Resource):
    implements(IHTMLLog)

    def __init__(self, original):
        Resource.__init__(self)
        self.original = original

    def render(self, request):
        if 'xml-stylesheet' in self.original.getText():
            request.setHeader("content-type", "text/xml; charset=utf-8")
        else:
            request.setHeader("content-type", "text/html")

        return self.original.getText()

components.registerAdapter(HTMLLog, logfile.HTMLLogFile, IHTMLLog)


class LogsResource(HtmlResource):
    addSlash = True

    def __init__(self, step_status):
        HtmlResource.__init__(self)
        self.step_status = step_status

    def getChild(self, path, req):
        for log in self.step_status.getLogs():
            if path == log.getName():
                if log.hasContents():
                    content = log.getText()
                    is_html_log = isinstance(log, HTMLLogFile)
                    if is_html_log and log.content_type == 'json':
                        return JSONTestResource(log, self.step_status)
                    elif is_html_log and (log.content_type == 'xml' or ('xml-stylesheet' in content or 'nosetests' in content)):
                        return XMLTestResource(log, self.step_status)
                    else:
                        return IHTMLLog(interfaces.IStatusLog(log))
                return NoResource("Empty Log '%s'" % path)
        return HtmlResource.getChild(self, path, req)

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

import os
from twisted.trial import unittest
from buildbot.status import builder, master
from buildbot.test.fake import fakemaster

class TestBuildStepStatus(unittest.TestCase):

    # that buildstep.BuildStepStatus is never instantiated here should tell you
    # that these classes are not well isolated!

    def setupBuilder(self, buildername, category=None, description=None):
        self.master = fakemaster.make_master()
        self.master.basedir = '/basedir'

        b = builder.BuilderStatus(buildername, self.master, category, description)
        b.project = "Project"
        b.master = self.master
        # Ackwardly, Status sets this member variable.
        b.basedir = os.path.abspath(self.mktemp())
        os.mkdir(b.basedir)
        # Otherwise, builder.nextBuildNumber is not defined.
        b.determineNextBuildNumber()
        return b

    def setupStatus(self, b):
        s = master.Status(self.master)
        b.status = s
        return s

    def test_buildStepNumbers(self):
        b = self.setupBuilder('builder_1')
        bs = b.newBuild()
        self.assertEquals(0, bs.getNumber())
        bss1 = bs.addStepWithName('step_1', None)
        self.assertEquals('step_1', bss1.getName())
        bss2 = bs.addStepWithName('step_2', None)
        self.assertEquals(0, bss1.asDict()['step_number'])
        self.assertEquals('step_2', bss2.getName())
        self.assertEquals(1, bss2.asDict()['step_number'])
        self.assertEquals([bss1, bss2], bs.getSteps())

    def test_bogDict(self):
        b = self.setupBuilder('builder_1')
        self.setupStatus(b)
        bs = b.newBuild()
        bss1 = bs.addStepWithName('step_1', None)
        bss1.stepStarted()
        bss1.addLog('log_1')
        self.assertEquals(
            bss1.asDict()['logs'],
            [{'name': 'log_1', 'url': 'http://localhost:8080/projects/Project/builders/builder_1/'
                        'builds/0/steps/step_1/logs/log_1'}]
            )

    def test_addHtmlLog_with_no_content_type(self):
        b = self.setupBuilder('builder_1')
        self.setupStatus(b)
        bs = b.newBuild()
        bss1 = bs.addStepWithName('step_1', None)
        bss1.stepStarted()
        bss1.addHTMLLog('htmllog_1', "html")

        self.assertEquals(
            bss1.asDict()['logs'],
            [{'name':'htmllog_1', "url":'http://localhost:8080/projects/Project/builders/builder_1/'
                        'builds/0/steps/step_1/logs/htmllog_1'}]
            )
        self.assertEqual(len(bss1.logs), 1)
        self.assertEqual(bss1.logs[0].content_type, None)

    def test_addHtmlLog_with_content_type(self):
        b = self.setupBuilder('builder_1')
        self.setupStatus(b)
        bs = b.newBuild()
        bss1 = bs.addStepWithName('step_1', None)
        bss1.stepStarted()
        content_type = "test_content_type"
        bss1.addHTMLLog('htmllog_1', "html", content_type)

        self.assertEqual(len(bss1.logs), 1)
        self.assertEqual(bss1.logs[0].content_type, content_type)

    def test_addHtmlLog_with_content_type_multiple_logs(self):
        b = self.setupBuilder('builder_1')
        self.setupStatus(b)
        bs = b.newBuild()
        bss1 = bs.addStepWithName('step_1', None)
        bss1.stepStarted()
        content_type1 = "test_content_type"
        content_type2 = "json"
        bss1.addHTMLLog('htmllog_1', "html", content_type1)
        bss1.addHTMLLog('htmllog_2', "html 2")
        bss1.addHTMLLog('htmllog_3', "html 2", content_type2)

        self.assertEqual(len(bss1.logs), 3)
        self.assertEqual(bss1.logs[0].content_type, content_type1)
        self.assertEqual(bss1.logs[1].content_type, None)
        self.assertEqual(bss1.logs[2].content_type, content_type2)

    def test_addURLs(self):
        b = self.setupBuilder('builder_1')
        self.setupStatus(b)
        bs = b.newBuild()
        bss1 = bs.addStepWithName('step_1', None)
        bss1.stepStarted()

        urlList = []
        urlList.append(dict(name="URL", url="http://www.url"))
        urlList.append(dict(name="URL2", url="http://www.url2"))

        bss1.addURL("URL", "http://www.url")
        bss1.addURL("URL2", "http://www.url2")
        self.assertEquals(bss1.getURLs(), urlList)

    def test_addArtifacts(self):
        b = self.setupBuilder('builder_1')
        self.setupStatus(b)
        bs = b.newBuild()
        bss1 = bs.addStepWithName('step_1', None)
        bss1.stepStarted()

        artifactList = []
        artifactList.append(dict(name="Artifact1", url="http://www.artifact.url"))
        artifactList.append(dict(name="Artifact2", url="http://www.secondartifact.url"))
        urlList = []
        urlList.append(dict(name="URL", url="http://www.url"))

        bss1.addArtifacts("Artifact1", "http://www.artifact.url")
        bss1.addArtifacts("Artifact2", "http://www.secondartifact.url")
        #ensure that URLs are being separated properly
        bss1.addURL("URL", "http://www.url")
        self.assertEquals(bss1.getArtifacts(), artifactList)
        self.assertEquals(bss1.getURLs(), urlList)

    def test_addDependencyLinks(self):
        b = self.setupBuilder('builder_1')
        self.setupStatus(b)
        bs = b.newBuild()
        bss1 = bs.addStepWithName('step_1', None)
        bss1.stepStarted()

        depList = []
        depList.append(dict(name="Dependency", url="http://www.dep.link", results=0))
        depList.append(dict(name="Dependency2", url="http://www.dep.link2", results=1))

        bss1.addDependencies("Dependency", "http://www.dep.link", 0)
        bss1.addDependencies("Dependency2", "http://www.dep.link2", 1)
        self.assertEquals(bss1.getDependencies(), depList)
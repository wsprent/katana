/*global define, describe, it, expect, beforeEach, afterEach, spyOn*/
define(function (require) {
    "use strict";

    var $ = require("jquery"),
        rtBuildDetails = require("rtBuildDetail"),
        _ = require("lodash");

    $(document.body).append('<div id="artifacts-js"></div>')

    describe("Build details artifacts popup", function () {

        it("is empty if steps don't have any artifacts", function () {
            var data = {
                steps: [
                  {
                    name: 'step1',
                    urls: [{name: 'test1', url: 'url1'}, {name: 'test2', url: 'url2'}, {name: 'test3', url: 'url3'}],
                  },
                  {
                    name: 'step2',
                    urls: [{name: 'test1', url: 'url1'}, {name: 'test2', url: 'url2'}, {name: 'test3', url: 'url3'}]
                  }
                ],

                logs  :[ { name: "TestResults.xml", url: "link/TestResults.xml"}, { name: "TestReport.html", url: "link/TestReport.html" }]
            };

            var html = $(rtBuildDetails.processArtifacts(data));

            expect(html.html().indexOf('No artifacts') !== -1).toBe(true);
        });

        it("is not empty if steps have some artifacts", function () {
            var artifacts1 = [ { name: 'a11', url: 'url11' }, { name: 'a12', url: 'url12' } ]
            var artifacts2 = [ { name: 'a21', url: 'url21' }, { name: 'a22', url: 'url22' } ]
            var data = {
                steps: [
                  {
                    name : 'step1',
                    urls: [ { name: 'test1', url: 'url1' }, { name: 'test2', url: 'url2' }, { name: 'test3', url: 'url3' } ],
                    artifacts: artifacts1
                  },
                  {
                    name : 'step2',
                    urls: [ { name: 'test1', url: 'url1' }, { name: 'test2', url: 'url2' }, { name: 'test3', url: 'url3' } ],
                    artifacts: artifacts2
                  }
                ],
                logs  :[ { name: "TestResults.xml", url: "link/TestResults.xml"}, { name: "TestReport.html", url: "link/TestReport.html" }]
            };

            var html = $(rtBuildDetails.processArtifacts(data));
            var link = html.find('.artifact-popup.artifacts-js.more-info');
          
            $(link).click();

            var artifacts = _.concat(artifacts1, artifacts2)

            expect(link.html().indexOf('Artifacts ('+ artifacts.length +')') !== -1).toBe(true);

            var builderList =  $('.builders-list')

            _(artifacts).forEach(function(value) {
                var artifactLink = builderList.find('a[href="'+value.url+'"]:contains("'+value.name +'")')  ;
                expect(artifactLink.length).toEqual(1);
            });

            $('[data-ui-popup]').remove()
            $(document).off();
        });
    })


    describe("Build details test reports", function () {
        it("returns xml report if json report doesn't exist", function () {
            var data = {
                urls: [ { name: 'test1', url: 'url1' }, { name: 'test2', url: 'url2' }, { name: 'test3', url: 'url3' } ],
                steps : [],
                logs  :[ { name: "TestResults.xml", url: "link/TestResults.xml"}, { name: "TestReport.html", url: "link/TestReport.html" }]
            };

            var html = $(rtBuildDetails.processArtifacts(data));

            var xmlLink = html.find('a[href="'+data.logs[0].url+'"]:contains("'+data.logs[0].name +'")')  ;
            var htmlLink = html.find('a[href="'+data.logs[1].url+'"]:contains("'+data.logs[1].name +'")')  ;

            expect(xmlLink.length).toEqual(1);
            expect(htmlLink.length).toEqual(1);
        });


        it("returns json report if json report exists", function () {
            var data = {
                steps : [],
                urls: [ { name: 'test1', url: 'url1' }, { name: 'test2', url: 'url2' }, { name: 'test3', url: 'url3' } ],
                logs :[{ name: "ReportData.json", url: "link/ReportData.json" }, { name: "TestReport.html", url: "link/TestReport.html" }]
            };

            var html = $(rtBuildDetails.processArtifacts(data));

            var xmlLink = html.find('a[href="'+data.logs[0].url+'"]:contains("'+data.logs[0].name +'")')  ;
            var htmlLink = html.find('a[href="'+data.logs[1].url+'"]:contains("'+data.logs[1].name +'")')  ;

            expect(xmlLink.length).toEqual(1);
            expect(htmlLink.length).toEqual(1);
        });

        it("returns json report if json and xml report exists", function () {
            var data = {
                urls: [ { name: 'test1', url: 'url1' }, { name: 'test2', url: 'url2' }, { name: 'test3', url: 'url3' } ],
                steps :[],
                logs  :[{ name: "TestResults.xml", url: "link/TestResults.xml" },
                        { name: "TestReport.html", url: "link/TestReport.html" },
                        { name: "ReportData.json", url: "link/ReportData.json" },
                        { name: "TestReport.html", url: "link/TestReport.html" },
                        { name: "TestResults2.xml", url: "link/TestResults2.xml" }]
            };

            var html = $(rtBuildDetails.processArtifacts(data));

            var aElements = html.find('li a');
            var xmlLink = html.find('a[href="'+data.logs[2].url+'"]:contains("'+data.logs[2].name +'")')  ;
            var htmlLink = html.find('a[href="'+data.logs[3].url+'"]:contains("'+data.logs[3].name +'")')  ;

            expect(aElements.length).toEqual(2);
            expect(xmlLink.length).toEqual(1);
            expect(htmlLink.length).toEqual(1);
        });

         it("if logs list contains the same keys result will render the first one", function () {
            var data = {
                urls: [ { name: 'test1', url: 'url1' }, { name: 'test2', url: 'url2' }, { name: 'test3', url: 'url3' } ],
                steps : [],
                logs  :[{ name: "TestResults.xml", url: "the/first/link/TestResults.xml" },
                        { name: "TestReport.html", url: "link/TestReport.html" },
                        { name: "ReportData.json", url: "link/ReportData.json" },
                        { name: "TestReport.html", url: "the/second/link/TestReport.html" }]
            };

            var html = $(rtBuildDetails.processArtifacts(data));

            var aElements = html.find('li a');
            var xmlLink = html.find('a[href="'+data.logs[1].url+'"]:contains("'+data.logs[1].name +'")')  ;
            var htmlLink = html.find('a[href="'+data.logs[1].url+'"]:contains("'+data.logs[1].name +'")')  ;

            expect(aElements.length).toEqual(2);
            expect(xmlLink.length).toEqual(1);
            expect(htmlLink.length).toEqual(1);
        });
    });
});

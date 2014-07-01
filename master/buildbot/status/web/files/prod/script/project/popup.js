define(["jquery","helpers","libs/jquery.form","text!templates/popups.mustache","mustache","timeElements","toastr"],function(e,t,n,i,o,r,a){var u=e("body");!function(e){e.fn.popup=function(n){var i,o=e(this),r=e.extend({},e.fn.popup.defaults,n);o.settings=r;var a={init:function(){a.clear(),a.createHTML()&&(r.onCreate(o),r.autoShow&&o.ready(function(){a.showPopup()}))},createHTML:function(){return o.addClass("more-info-box more-info-box-js").append("<span class='close-btn'></span>").append(r.title).attr("data-ui-popup",!0).hide(),r.url?(e.ajax(r.url).done(function(e){return o.append(e),r.onCreate(o),a.showPopup(),!0}),!1):(o.append(e("<div/>").html(r.html)),!0)},clear:function(){"true"===o.attr("data-ui-popup")&&(r.destroyAfter?o.remove():o.empty())},showPopup:function(){r.center&&setTimeout(function(){t.jCenter(o),e(window).resize(function(){t.jCenter(o)})},50),r.animate?o.fadeIn(r.showAnimation,function(){a.initCloseButton(),r.onShow(o)}):o.show({complete:function(){r.onShow(o),a.initCloseButton()}})},hidePopup:function(){r.animate?o.fadeOut(r.hideAnimation,function(){o.hide(),a.clear(),r.onHide(o)}):(o.hide(),a.clear(),r.onHide(o)),void 0!==i&&(e(this).unbind(i),i=void 0)},initCloseButton:function(){void 0!==i&&(e(this).unbind(i),i=void 0),e(document).bind("click touchstart",function(t){(!o.is(t.target)&&0===o.has(t.target).length||o.find(".close-btn").is(t.target))&&o.is(":visible")&&(a.hidePopup(),e(this).unbind(t),i=t)})}};return o.showPopup=function(){a.showPopup()},o.hidePopup=function(){a.hidePopup()},o.options=function(t){r=e.extend({},e.fn.popup.defaults,r,t)},o.each(function(){a.init(),r.initalized=!0})},e.fn.popup.defaults={title:"<h3>Katana Popup</h3>",html:void 0,url:void 0,destroyAfter:!1,autoShow:!0,center:!0,animate:!0,showAnimation:"fast",hideAnimation:"fast",onCreate:function(){return void 0},onShow:function(){return void 0},onHide:function(){return void 0}}}(jQuery);var d;return d={init:function(){d.initCodebaseBranchesPopup(e("#codebasesBtn"))},validateForm:function(t){var n=e(".command_forcebuild",t),r=":button, :hidden, :checkbox, :submit";e(".grey-btn",n).click(function(t){var a=e("input",n).not(r),u=a.filter(function(){return this.name.indexOf("revision")>=0}),d=u.filter(function(){return""===this.value});if(d.length>0&&d.length<u.length){if(u.each(function(){""===e(this).val()?e(this).addClass("not-valid"):e(this).removeClass("not-valid")}),e(".form-message",n).hide(),!e(".error-input",n).length){var s=o.render(i,{errorinput:"true",text:"Fill out the empty revision fields or clear all before submitting"}),c=e(s);e(n).prepend(c)}t.preventDefault()}})},initJSONPopup:function(n,a){var d=e(n);d.click(function(n){n.preventDefault();var d=o.render(i,a);u.append(e("<div/>").popup({title:"",html:d,onShow:function(){void 0!==a.showRunningBuilds&&t.delegateToProgressBar(e("div.more-info-box-js div.percent-outer-js")),r.updateTimeObjects()}}))})},initCodebaseBranchesPopup:function(n){var r=e(n),a=r.attr("data-codebases-url");r.click(function(n){n.preventDefault();var r=o.render(i,{preloader:"true"}),d=e(r);e("body").append(d).show(),e.get(a).done(function(n){d.remove(),requirejs(["selectors"],function(i){var o=e(n).find("#formWrapper");o.children("#getForm").attr("action",window.location.href),o.find('.blue-btn[type="submit"]').val("Update"),u.append(e("<div/>").popup({title:e('<h3 class="codebases-head" />').html("Select Branches"),html:o,destroyAfter:!0,onCreate:function(e){e.css("max-width","80%")},onShow:function(n){i.init(),t.jCenter(n),e(window).resize(function(){t.jCenter(n)})}}))})})})},initPendingPopup:function(n){function a(){var t=o.render(i,{preloader:"true"}),n=e(t);e("body").append(n).show(),e.ajax({url:p,cache:!1,dataType:"json",success:function(t){n.remove();var a=t[0].builderURL,d="";if(a.indexOf("?")>-1){var s=a.split("?");d+=s[1]+"&",a=s[0]}d+="returnpage=builders_json",a="{0}/cancelbuild?{1}".format(a,d);var c=o.render(i,{pendingJobs:t,showPendingJobs:!0,cancelURL:a});u.append(e("<div/>").popup({html:c,destroyAfter:!0,onCreate:function(n){var i=n.find(".waiting-time-js");i.each(function(n){r.addElapsedElem(e(this),t[n].submittedAt),r.updateTimeObjects()}),n.find("form").ajaxForm({success:function(e,t,i,o){requirejs(["realtimePages"],function(t){setTimeout(function(){var n="builders";t.updateSingleRealTimeData(n,e)},300)});var r="cancelall"===o.attr("id");r||o.parent().remove(),(r||1===n.find("li").length)&&n.hidePopup()}})}}))}})}var d=e(n),s=encodeURIComponent(d.attr("data-builderName")),c=t.codebasesFromURL({}),l=t.urlParamsToString(c),p="/json/pending/{0}/?{1}".format(s,l);d.click(function(e){e.preventDefault(),a()})},initRunBuild:function(n,r){function s(n){function r(){a.error("There was an error when creating your build please try again later","Error",{iconClass:"failure"})}var s=c.attr("data-builder-url"),l=c.attr("data-return-page"),p=c.attr("data-builder-name"),f=c.attr("data-popup-title"),h=location.protocol+"//"+location.host+"/forms/forceBuild",m=t.codebasesFromURL({builder_url:s,builder_name:p,return_page:l}),v=o.render(i,{preloader:"true"}),b=e(v);u.append(b),b.show(),e.get(h,m).done(function(t){var i=e("<div/>").popup({title:e('<h2 class="small-head" />').html(f),html:t,destroyAfter:!0,autoShow:!1,onCreate:function(e){d.validateForm(e);var t=e.find("form"),i={beforeSubmit:function(){e.hidePopup(),b.show()},success:function(e){requirejs(["realtimePages"],function(t){var n=l.replace("_json","");t.updateSingleRealTimeData(n,e)}),b.remove(),a.info("Your build will start shortly","Info",{iconClass:"info"})},error:function(){b.remove(),r()}};t.ajaxForm(i),n&&t.ajaxSubmit(i)}});u.append(i),n||i.showPopup()}).fail(function(){r()}).always(function(){b.hide()})}var c=e(n),l=e(r);0!==c.length&&(c.click(function(e){e.preventDefault(),s(!1)}),l.click(function(e){e.preventDefault(),s(!0)}))},initArtifacts:function(t,n){var i=e(n);i.click(function(n){n.preventDefault();var i="";if(void 0!==t){e.each(t,function(e,t){i+='<li class="artifact-js"><a target="_blank" href="{1}">{0}</a></li>'.format(e,t)}),i=e("<ul/>").addClass("builders-list").html(i);var o=e("<div/>").popup({title:"<h3>Artifacts</h3>",html:i,destroyAfter:!0});u.append(o)}})}}});
//# sourceMappingURL=popup.js.map
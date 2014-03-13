/*!
 * jQuery Form Plugin
 * version: 3.50.0-2014.02.05
 * Requires jQuery v1.5 or later
 * Copyright (c) 2013 M. Alsup
 * Examples and documentation at: http://malsup.com/jquery/form/
 * Project repository: https://github.com/malsup/form
 * Dual licensed under the MIT and GPL licenses.
 * https://github.com/malsup/form#copyright-and-license
 */

(function(e){typeof define=="function"&&define.amd?define(["jquery"],e):e(typeof jQuery!="undefined"?jQuery:window.Zepto)})(function(e){function r(t){var n=t.data;t.isDefaultPrevented()||(t.preventDefault(),e(t.target).ajaxSubmit(n))}function i(t){var n=t.target,r=e(n);if(!r.is("[type=submit],[type=image]")){var i=r.closest("[type=submit]");if(i.length===0)return;n=i[0]}var s=this;s.clk=n;if(n.type=="image")if(t.offsetX!==undefined)s.clk_x=t.offsetX,s.clk_y=t.offsetY;else if(typeof e.fn.offset=="function"){var o=r.offset();s.clk_x=t.pageX-o.left,s.clk_y=t.pageY-o.top}else s.clk_x=t.pageX-n.offsetLeft,s.clk_y=t.pageY-n.offsetTop;setTimeout(function(){s.clk=s.clk_x=s.clk_y=null},100)}function s(){if(!e.fn.ajaxSubmit.debug)return;var t="[jquery.form] "+Array.prototype.join.call(arguments,"");window.console&&window.console.log?window.console.log(t):window.opera&&window.opera.postError&&window.opera.postError(t)}var t={};t.fileapi=e("<input type='file'/>").get(0).files!==undefined,t.formdata=window.FormData!==undefined;var n=!!e.fn.prop;e.fn.attr2=function(){if(!n)return this.attr.apply(this,arguments);var e=this.prop.apply(this,arguments);return e&&e.jquery||typeof e=="string"?e:this.attr.apply(this,arguments)},e.fn.ajaxSubmit=function(r){function k(t){var n=e.param(t,r.traditional).split("&"),i=n.length,s=[],o,u;for(o=0;o<i;o++)n[o]=n[o].replace(/\+/g," "),u=n[o].split("="),s.push([decodeURIComponent(u[0]),decodeURIComponent(u[1])]);return s}function L(t){var n=new FormData;for(var s=0;s<t.length;s++)n.append(t[s].name,t[s].value);if(r.extraData){var o=k(r.extraData);for(s=0;s<o.length;s++)o[s]&&n.append(o[s][0],o[s][1])}r.data=null;var u=e.extend(!0,{},e.ajaxSettings,r,{contentType:!1,processData:!1,cache:!1,type:i||"POST"});r.uploadProgress&&(u.xhr=function(){var t=e.ajaxSettings.xhr();return t.upload&&t.upload.addEventListener("progress",function(e){var t=0,n=e.loaded||e.position,i=e.total;e.lengthComputable&&(t=Math.ceil(n/i*100)),r.uploadProgress(e,n,i,t)},!1),t}),u.data=null;var a=u.beforeSend;return u.beforeSend=function(e,t){r.formData?t.data=r.formData:t.data=n,a&&a.call(this,e,t)},e.ajax(u)}function A(t){function T(e){var t=null;try{e.contentWindow&&(t=e.contentWindow.document)}catch(n){s("cannot get iframe.contentWindow document: "+n)}if(t)return t;try{t=e.contentDocument?e.contentDocument:e.document}catch(n){s("cannot get iframe.contentDocument: "+n),t=e.document}return t}function k(){function f(){try{var e=T(v).readyState;s("state = "+e),e&&e.toLowerCase()=="uninitialized"&&setTimeout(f,50)}catch(t){s("Server abort: ",t," (",t.name,")"),_(x),w&&clearTimeout(w),w=undefined}}var t=a.attr2("target"),n=a.attr2("action"),r="multipart/form-data",u=a.attr("enctype")||a.attr("encoding")||r;o.setAttribute("target",p),(!i||/post/i.test(i))&&o.setAttribute("method","POST"),n!=l.url&&o.setAttribute("action",l.url),!l.skipEncodingOverride&&(!i||/post/i.test(i))&&a.attr({encoding:"multipart/form-data",enctype:"multipart/form-data"}),l.timeout&&(w=setTimeout(function(){b=!0,_(S)},l.timeout));var c=[];try{if(l.extraData)for(var h in l.extraData)l.extraData.hasOwnProperty(h)&&(e.isPlainObject(l.extraData[h])&&l.extraData[h].hasOwnProperty("name")&&l.extraData[h].hasOwnProperty("value")?c.push(e('<input type="hidden" name="'+l.extraData[h].name+'">').val(l.extraData[h].value).appendTo(o)[0]):c.push(e('<input type="hidden" name="'+h+'">').val(l.extraData[h]).appendTo(o)[0]));l.iframeTarget||d.appendTo("body"),v.attachEvent?v.attachEvent("onload",_):v.addEventListener("load",_,!1),setTimeout(f,15);try{o.submit()}catch(m){var g=document.createElement("form").submit;g.apply(o)}}finally{o.setAttribute("action",n),o.setAttribute("enctype",u),t?o.setAttribute("target",t):a.removeAttr("target"),e(c).remove()}}function _(t){if(m.aborted||M)return;A=T(v),A||(s("cannot access response document"),t=x);if(t===S&&m){m.abort("timeout"),E.reject(m,"timeout");return}if(t==x&&m){m.abort("server abort"),E.reject(m,"error","server abort");return}if(!A||A.location.href==l.iframeSrc)if(!b)return;v.detachEvent?v.detachEvent("onload",_):v.removeEventListener("load",_,!1);var n="success",r;try{if(b)throw"timeout";var i=l.dataType=="xml"||A.XMLDocument||e.isXMLDoc(A);s("isXml="+i);if(!i&&window.opera&&(A.body===null||!A.body.innerHTML)&&--O){s("requeing onLoad callback, DOM not available"),setTimeout(_,250);return}var o=A.body?A.body:A.documentElement;m.responseText=o?o.innerHTML:null,m.responseXML=A.XMLDocument?A.XMLDocument:A,i&&(l.dataType="xml"),m.getResponseHeader=function(e){var t={"content-type":l.dataType};return t[e.toLowerCase()]},o&&(m.status=Number(o.getAttribute("status"))||m.status,m.statusText=o.getAttribute("statusText")||m.statusText);var u=(l.dataType||"").toLowerCase(),a=/(json|script|text)/.test(u);if(a||l.textarea){var f=A.getElementsByTagName("textarea")[0];if(f)m.responseText=f.value,m.status=Number(f.getAttribute("status"))||m.status,m.statusText=f.getAttribute("statusText")||m.statusText;else if(a){var c=A.getElementsByTagName("pre")[0],p=A.getElementsByTagName("body")[0];c?m.responseText=c.textContent?c.textContent:c.innerText:p&&(m.responseText=p.textContent?p.textContent:p.innerText)}}else u=="xml"&&!m.responseXML&&m.responseText&&(m.responseXML=D(m.responseText));try{L=H(m,u,l)}catch(g){n="parsererror",m.error=r=g||n}}catch(g){s("error caught: ",g),n="error",m.error=r=g||n}m.aborted&&(s("upload aborted"),n=null),m.status&&(n=m.status>=200&&m.status<300||m.status===304?"success":"error"),n==="success"?(l.success&&l.success.call(l.context,L,"success",m),E.resolve(m.responseText,"success",m),h&&e.event.trigger("ajaxSuccess",[m,l])):n&&(r===undefined&&(r=m.statusText),l.error&&l.error.call(l.context,m,n,r),E.reject(m,"error",r),h&&e.event.trigger("ajaxError",[m,l,r])),h&&e.event.trigger("ajaxComplete",[m,l]),h&&!--e.active&&e.event.trigger("ajaxStop"),l.complete&&l.complete.call(l.context,m,n),M=!0,l.timeout&&clearTimeout(w),setTimeout(function(){l.iframeTarget?d.attr("src",l.iframeSrc):d.remove(),m.responseXML=null},100)}var o=a[0],u,f,l,h,p,d,v,m,g,y,b,w,E=e.Deferred();E.abort=function(e){m.abort(e)};if(t)for(f=0;f<c.length;f++)u=e(c[f]),n?u.prop("disabled",!1):u.removeAttr("disabled");l=e.extend(!0,{},e.ajaxSettings,r),l.context=l.context||l,p="jqFormIO"+(new Date).getTime(),l.iframeTarget?(d=e(l.iframeTarget),y=d.attr2("name"),y?p=y:d.attr2("name",p)):(d=e('<iframe name="'+p+'" src="'+l.iframeSrc+'" />'),d.css({position:"absolute",top:"-1000px",left:"-1000px"})),v=d[0],m={aborted:0,responseText:null,responseXML:null,status:0,statusText:"n/a",getAllResponseHeaders:function(){},getResponseHeader:function(){},setRequestHeader:function(){},abort:function(t){var n=t==="timeout"?"timeout":"aborted";s("aborting upload... "+n),this.aborted=1;try{v.contentWindow.document.execCommand&&v.contentWindow.document.execCommand("Stop")}catch(r){}d.attr("src",l.iframeSrc),m.error=n,l.error&&l.error.call(l.context,m,n,t),h&&e.event.trigger("ajaxError",[m,l,n]),l.complete&&l.complete.call(l.context,m,n)}},h=l.global,h&&0===e.active++&&e.event.trigger("ajaxStart"),h&&e.event.trigger("ajaxSend",[m,l]);if(l.beforeSend&&l.beforeSend.call(l.context,m,l)===!1)return l.global&&e.active--,E.reject(),E;if(m.aborted)return E.reject(),E;g=o.clk,g&&(y=g.name,y&&!g.disabled&&(l.extraData=l.extraData||{},l.extraData[y]=g.value,g.type=="image"&&(l.extraData[y+".x"]=o.clk_x,l.extraData[y+".y"]=o.clk_y)));var S=1,x=2,N=e("meta[name=csrf-token]").attr("content"),C=e("meta[name=csrf-param]").attr("content");C&&N&&(l.extraData=l.extraData||{},l.extraData[C]=N),l.forceSync?k():setTimeout(k,10);var L,A,O=50,M,D=e.parseXML||function(e,t){return window.ActiveXObject?(t=new ActiveXObject("Microsoft.XMLDOM"),t.async="false",t.loadXML(e)):t=(new DOMParser).parseFromString(e,"text/xml"),t&&t.documentElement&&t.documentElement.nodeName!="parsererror"?t:null},P=e.parseJSON||function(e){return window.eval("("+e+")")},H=function(t,n,r){var i=t.getResponseHeader("content-type")||"",s=n==="xml"||!n&&i.indexOf("xml")>=0,o=s?t.responseXML:t.responseText;return s&&o.documentElement.nodeName==="parsererror"&&e.error&&e.error("parsererror"),r&&r.dataFilter&&(o=r.dataFilter(o,n)),typeof o=="string"&&(n==="json"||!n&&i.indexOf("json")>=0?o=P(o):(n==="script"||!n&&i.indexOf("javascript")>=0)&&e.globalEval(o)),o};return E}if(!this.length)return s("ajaxSubmit: skipping submit process - no element selected"),this;var i,o,u,a=this;typeof r=="function"?r={success:r}:r===undefined&&(r={}),i=r.type||this.attr2("method"),o=r.url||this.attr2("action"),u=typeof o=="string"?e.trim(o):"",u=u||window.location.href||"",u&&(u=(u.match(/^([^#]+)/)||[])[1]),r=e.extend(!0,{url:u,success:e.ajaxSettings.success,type:i||e.ajaxSettings.type,iframeSrc:/^https/i.test(window.location.href||"")?"javascript:false":"about:blank"},r);var f={};this.trigger("form-pre-serialize",[this,r,f]);if(f.veto)return s("ajaxSubmit: submit vetoed via form-pre-serialize trigger"),this;if(r.beforeSerialize&&r.beforeSerialize(this,r)===!1)return s("ajaxSubmit: submit aborted via beforeSerialize callback"),this;var l=r.traditional;l===undefined&&(l=e.ajaxSettings.traditional);var c=[],h,p=this.formToArray(r.semantic,c);r.data&&(r.extraData=r.data,h=e.param(r.data,l));if(r.beforeSubmit&&r.beforeSubmit(p,this,r)===!1)return s("ajaxSubmit: submit aborted via beforeSubmit callback"),this;this.trigger("form-submit-validate",[p,this,r,f]);if(f.veto)return s("ajaxSubmit: submit vetoed via form-submit-validate trigger"),this;var d=e.param(p,l);h&&(d=d?d+"&"+h:h),r.type.toUpperCase()=="GET"?(r.url+=(r.url.indexOf("?")>=0?"&":"?")+d,r.data=null):r.data=d;var v=[];r.resetForm&&v.push(function(){a.resetForm()}),r.clearForm&&v.push(function(){a.clearForm(r.includeHidden)});if(!r.dataType&&r.target){var m=r.success||function(){};v.push(function(t){var n=r.replaceTarget?"replaceWith":"html";e(r.target)[n](t).each(m,arguments)})}else r.success&&v.push(r.success);r.success=function(e,t,n){var i=r.context||this;for(var s=0,o=v.length;s<o;s++)v[s].apply(i,[e,t,n||a,a])};if(r.error){var g=r.error;r.error=function(e,t,n){var i=r.context||this;g.apply(i,[e,t,n,a])}}if(r.complete){var y=r.complete;r.complete=function(e,t){var n=r.context||this;y.apply(n,[e,t,a])}}var b=e("input[type=file]:enabled",this).filter(function(){return e(this).val()!==""}),w=b.length>0,E="multipart/form-data",S=a.attr("enctype")==E||a.attr("encoding")==E,x=t.fileapi&&t.formdata;s("fileAPI :"+x);var T=(w||S)&&!x,N;r.iframe!==!1&&(r.iframe||T)?r.closeKeepAlive?e.get(r.closeKeepAlive,function(){N=A(p)}):N=A(p):(w||S)&&x?N=L(p):N=e.ajax(r),a.removeData("jqxhr").data("jqxhr",N);for(var C=0;C<c.length;C++)c[C]=null;return this.trigger("form-submit-notify",[this,r]),this},e.fn.ajaxForm=function(t){t=t||{},t.delegation=t.delegation&&e.isFunction(e.fn.on);if(!t.delegation&&this.length===0){var n={s:this.selector,c:this.context};return!e.isReady&&n.s?(s("DOM not ready, queuing ajaxForm"),e(function(){e(n.s,n.c).ajaxForm(t)}),this):(s("terminating; zero elements found by selector"+(e.isReady?"":" (DOM not ready)")),this)}return t.delegation?(e(document).off("submit.form-plugin",this.selector,r).off("click.form-plugin",this.selector,i).on("submit.form-plugin",this.selector,t,r).on("click.form-plugin",this.selector,t,i),this):this.ajaxFormUnbind().bind("submit.form-plugin",t,r).bind("click.form-plugin",t,i)},e.fn.ajaxFormUnbind=function(){return this.unbind("submit.form-plugin click.form-plugin")},e.fn.formToArray=function(n,r){var i=[];if(this.length===0)return i;var s=this[0],o=this.attr("id"),u=n?s.getElementsByTagName("*"):s.elements,a;u&&!/MSIE [678]/.test(navigator.userAgent)&&(u=e(u).get()),o&&(a=e(":input[form="+o+"]").get(),a.length&&(u=(u||[]).concat(a)));if(!u||!u.length)return i;var f,l,c,h,p,d,v;for(f=0,d=u.length;f<d;f++){p=u[f],c=p.name;if(!c||p.disabled)continue;if(n&&s.clk&&p.type=="image"){s.clk==p&&(i.push({name:c,value:e(p).val(),type:p.type}),i.push({name:c+".x",value:s.clk_x},{name:c+".y",value:s.clk_y}));continue}h=e.fieldValue(p,!0);if(h&&h.constructor==Array){r&&r.push(p);for(l=0,v=h.length;l<v;l++)i.push({name:c,value:h[l]})}else if(t.fileapi&&p.type=="file"){r&&r.push(p);var m=p.files;if(m.length)for(l=0;l<m.length;l++)i.push({name:c,value:m[l],type:p.type});else i.push({name:c,value:"",type:p.type})}else h!==null&&typeof h!="undefined"&&(r&&r.push(p),i.push({name:c,value:h,type:p.type,required:p.required}))}if(!n&&s.clk){var g=e(s.clk),y=g[0];c=y.name,c&&!y.disabled&&y.type=="image"&&(i.push({name:c,value:g.val()}),i.push({name:c+".x",value:s.clk_x},{name:c+".y",value:s.clk_y}))}return i},e.fn.formSerialize=function(t){return e.param(this.formToArray(t))},e.fn.fieldSerialize=function(t){var n=[];return this.each(function(){var r=this.name;if(!r)return;var i=e.fieldValue(this,t);if(i&&i.constructor==Array)for(var s=0,o=i.length;s<o;s++)n.push({name:r,value:i[s]});else i!==null&&typeof i!="undefined"&&n.push({name:this.name,value:i})}),e.param(n)},e.fn.fieldValue=function(t){for(var n=[],r=0,i=this.length;r<i;r++){var s=this[r],o=e.fieldValue(s,t);if(o===null||typeof o=="undefined"||o.constructor==Array&&!o.length)continue;o.constructor==Array?e.merge(n,o):n.push(o)}return n},e.fieldValue=function(t,n){var r=t.name,i=t.type,s=t.tagName.toLowerCase();n===undefined&&(n=!0);if(n&&(!r||t.disabled||i=="reset"||i=="button"||(i=="checkbox"||i=="radio")&&!t.checked||(i=="submit"||i=="image")&&t.form&&t.form.clk!=t||s=="select"&&t.selectedIndex==-1))return null;if(s=="select"){var o=t.selectedIndex;if(o<0)return null;var u=[],a=t.options,f=i=="select-one",l=f?o+1:a.length;for(var c=f?o:0;c<l;c++){var h=a[c];if(h.selected){var p=h.value;p||(p=h.attributes&&h.attributes.value&&!h.attributes.value.specified?h.text:h.value);if(f)return p;u.push(p)}}return u}return e(t).val()},e.fn.clearForm=function(t){return this.each(function(){e("input,select,textarea",this).clearFields(t)})},e.fn.clearFields=e.fn.clearInputs=function(t){var n=/^(?:color|date|datetime|email|month|number|password|range|search|tel|text|time|url|week)$/i;return this.each(function(){var r=this.type,i=this.tagName.toLowerCase();n.test(r)||i=="textarea"?this.value="":r=="checkbox"||r=="radio"?this.checked=!1:i=="select"?this.selectedIndex=-1:r=="file"?/MSIE/.test(navigator.userAgent)?e(this).replaceWith(e(this).clone(!0)):e(this).val(""):t&&(t===!0&&/hidden/.test(r)||typeof t=="string"&&e(this).is(t))&&(this.value="")})},e.fn.resetForm=function(){return this.each(function(){(typeof this.reset=="function"||typeof this.reset=="object"&&!this.reset.nodeType)&&this.reset()})},e.fn.enable=function(e){return e===undefined&&(e=!0),this.each(function(){this.disabled=!e})},e.fn.selected=function(t){return t===undefined&&(t=!0),this.each(function(){var n=this.type;if(n=="checkbox"||n=="radio")this.checked=t;else if(this.tagName.toLowerCase()=="option"){var r=e(this).parent("select");t&&r[0]&&r[0].type=="select-one"&&r.find("option").selected(!1),this.selected=t}})},e.fn.ajaxSubmit.debug=!1});
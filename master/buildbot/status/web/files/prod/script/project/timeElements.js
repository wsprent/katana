define(["moment","extend-moment"],function(e,t){var n=5e3,r=80,i,s={timeAgo:[],elapsed:[],progressBars:[]},o,u=e.lang(),a=0,f=0,l={init:function(){o===undefined&&l._heartbeatInterval(),setInterval(l._spinIconAnimation,r)},_heartbeatInterval:function(){clearTimeout(o),o=setTimeout(l._heartbeat,n)},_heartbeat:function(e){var t=new Date;if(e===!0||t-i>=n){var r=0;$.each(s.timeAgo,function(e,t){l.processTimeAgo(t.el,t.time),r++}),$.each(s.elapsed,function(e,t){l.processElapsed(t.el,t.time),r++}),$.each(s.progressBars,function(e,n){if(i!==undefined&&n.eta!=0){var s=t-i;n.eta-=s/1e3}l.processProgressBars(n.el,n.time,n.eta),r++}),i=t}a=r,o!==undefined&&l._heartbeatInterval()},_addElem:function(e,t,n){e.length&&$(e).attr("data-timeElem")===undefined&&($(e).attr("data-timeElem","true"),n.push(t))},_spinIconAnimation:function(){var e=10,t=13;$.each($(".animate-spin"),function(n,r){var i=$(r);f>=e&&(f=0);var s=f*-t;i.css("background-position",s+"px 0px")}),f++},addTimeAgoElem:function(e,t){var n=$(e),r={el:n,time:parseInt(t)};l._addElem(n,r,s.timeAgo)},addElapsedElem:function(e,t){var n=$(e),r={el:n,time:parseInt(t)};l._addElem(n,r,s.elapsed)},addProgressBarElem:function(e,t,n){var r=$(e),i={el:r,time:parseInt(t),eta:n};l._addElem(r,i,s.progressBars)},updateTimeObjects:function(){l._heartbeat(!0)},clearTimeObjects:function(e){if(e!==undefined){var t=$(e).find("[data-timeElem]");$.each(s,function(e,n){s[e]=$.grep(n,function(e){var n=!1;return $.contains(document.documentElement,e.el[0])?($.each(t,function(t,r){return $(r).is(e.el)?(n=!0,!1):!0}),n):!0},!0)})}else $.each(s,function(e){s[e]=[]})},processTimeAgo:function(t,n){t.html(e.unix(n).fromServerNow())},processElapsed:function(n,r){var i=t.getServerTime().unix(),s=i-r;e.lang("waiting-en"),n.html(e.duration(s,"seconds").humanize(!0)),e.lang(u)},processProgressBars:function(n,r,i){var s=t.getServerOffset(),o=e.unix(r),a=n.children(".percent-inner-js"),f=n.children(".time-txt-js"),l=i!=0,c=100;if(l){var h=e()+s,p=h+i*1e3,d=i<0,v=e().add("s",i)+s;c=100-(v-h)/(v-o)*100,c=c.clamp(0,100),e.lang("progress-bar-en"),f.html(e(p).fromServerNow()),d&&n.addClass("overtime")}else e.lang("progress-bar-no-eta-en"),f.html(e(parseInt(r*1e3)).fromServerNow());e.lang(u),a.css("width",c+"%")},setHeartbeat:function(e){n=e,l._heartbeatInterval()}};return l});
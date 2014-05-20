define(["jquery","realtimePages","helpers","dataTables","mustache","text!templates/buildslaves.mustache","timeElements","rtGenericTable","moment"],function(e,t,n,r,i,s,o,u,a){var f,l;return f={init:function(){l=f.dataTableInit(e(".buildslaves-table"));var n=t.defaultRealtimeFunctions();n.slaves=f.processBuildSlaves,t.initRealtime(n)},processBuildSlaves:function(e){e=n.objectPropertiesToArray(e),u.table.rtfGenericTableProcess(l,e)},dataTableInit:function(t){var n={};return n.aoColumns=[{mData:null,bSortable:!0},{mData:null,bSortable:!1},{mData:null,bSortable:!0},{mData:null},{mData:null}],n.aoColumnDefs=[u.cell.slaveName(0,"friendly_name","url"),{aTargets:[1],sClass:"txt-align-left",mRender:function(){return i.render(s,{buildersPopup:!0})},fnCreatedCell:function(t,n,r){e(t).find("a.popup-btn-json-js").data({showBuilders:r})}},{aTargets:[2],sClass:"txt-align-left",mRender:function(e,t,n){return n.name!==undefined?n.name:"Not Available"}},u.cell.slaveStatus(3),{aTargets:[4],mRender:function(e,t,n){var r=n.lastMessage!==undefined?!0:null,o=r?" ("+a.unix(n.lastMessage).format("MMM Do YYYY, H:mm:ss")+")":"";return i.render(s,{showTimeago:r,showLastMessageDate:o})},fnCreatedCell:function(t,n,r){o.addTimeAgoElem(e(t).find(".last-message-timemago"),r.lastMessage)}}],r.initTable(t,n)}},f});
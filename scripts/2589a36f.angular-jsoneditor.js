"use strict";angular.module("je.filters",[]).filter("jeCollection",function(){return function(a){return angular.isArray(a)||angular.isObject(a)?a:[]}}).filter("jeType",function(){return function(a){var b="atomic";switch(!0){case angular.isArray(a):b="array";break;case angular.isObject(a):b="object"}return b}}).filter("jeTreeNodeValue",function(){return function(a){return angular.isArray(a)||angular.isObject(a)?"":null===a?"null":a}}),angular.module("je.services",[]).factory("jeConverter",function(){var a=function(a,b){switch(b){case"auto":var c=!("string"!=typeof a&&"boolean"!=typeof a||"true"!==a&&"false"!==a&&a!==!0&&a!==!1),d=!("string"!=typeof a&&null!==typeof a||"null"!==a&&null!==a);if("string"==typeof a&&""===a)return"";if(d)return null;try{return JSON.parse(a)}catch(e){}return c?Boolean(a):isNaN(Number(a))?String(a):Number(a);case"number":var f=Number(a);return isNaN(f)&&(f=0),f;case"string":return String(a);case"boolean":return Boolean(a);default:return a}},b=function(b){return a(b,"number")},c=function(b){return a(b,"string")},d=function(b){return a(b,"boolean")},e=function g(a,b){var c=[],d=b||!1;return angular.forEach(a,function(a,b){switch(!0){case null===a:c.push({key:b,type:"null",auto:d,value:"null"});break;case angular.isArray(a):c.push({key:b,type:"array",auto:!1,children:g(a,d)});break;case angular.isObject(a):c.push({key:b,type:"object",auto:!1,children:g(a,d)});break;default:c.push({key:b,type:typeof a,auto:d,value:a})}}),c},f=function h(b){var c={};return angular.forEach(b,function(b){switch(!0){case"null"===b.type:c[b.key]=b.auto?a(b.value,"auto"):null;break;case"array"===b.type:var d=[];b.hasOwnProperty("children")&&angular.isArray(b.children)&&(angular.forEach(h(b.children),function(a){d.push(a)}),c[b.key]=d);break;case"object"===b.type:b.hasOwnProperty("children")&&angular.isObject(b.children)&&(c[b.key]=h(b.children));break;default:c[b.key]=b.auto?a(b.value,"auto"):a(b.value,b.type)}}),c};return{object2ast:e,ast2object:f,toBoolean:d,toNumber:b,toString:c}}),angular.module("je.ace",["ui.ace"]).directive("jeAce",function(){return{restrict:"EA",template:'<div ng-mouseenter="sync(false)" ng-mouseleave="sync(true)" class="je-ace" ui-ace="$parent.jsoneditor.ace.options" ng-model="$parent.jsoneditor.json"></div>',replace:!0,transclude:!0,link:function(a){a.sync=function(b){a.jsoneditor.sync.json=b}}}}),angular.module("je.text",[]).directive("jeText",function(){return{restrict:"EA",template:'<div class="je-text"><textarea ng-model="$parent.jsoneditor.json"></textarea></div>',replace:!0,link:function(){}}}),angular.module("je.tree.node",["je.filters","sj.input"]).directive("jeTreeNode",["$compile",function(a){return{restrict:"EA",template:'<li class="je-tree-node-type-{{item.type}} je-tree-node-type-{{$parent.item.type}}-parent">  <div class="je-tree-menu">    <i ng-click="menu.copy(index)" class="je-tree-node-menu-copy fa fa-copy je-transparent-{{isRootNode()}}"></i>     <i ng-click="menu.remove(index)" class="je-tree-node-menu-remove fa fa-minus-circle je-transparent-{{isRootNode()}}"></i>     <i ng-show="allowedChildItems.length > 0" ng-mouseover="addSelectHidden = false" ng-mouseleave="addSelectHidden = true" class="je-tree-node-menu-add fa fa-plus-circle je-transparent-{{valAtomic(item)}}">      <select class="je-transparent-{{addSelectHidden}}" ng-model="addSelectValue" ng-change="menu.add(addSelectValue)" ng-options="allowedChildItem.key for allowedChildItem in allowedChildItems">         <option value="" selected>New …</option>       </select>     </i>   </div>   <div class="je-tree-body">     <i ng-style="treeOpenerStyle" class="je-tree-opener fa fa-caret-down je-transparent-{{valAtomic(item)}}" ng-click="toggleChildren()" ></i>     <span class="je-tree-node-key" ng-show="$parent.item.type == \'array\' || isRootNode()" ng-bind="item.key"></span>    <input sj-input class="je-tree-node-key {{emptyKeyClass()}}" ng-show="$parent.item.type == \'object\' && ! isRootNode()" type="text" ng-model="item.key" placeholder="Field">    <span class="je-tree-node-key-value-seperator" ng-show="valAtomic(item)"></span>    <input sj-input class="je-tree-node-value {{emptyValueClass()}}" type="text" ng-model="item.value" ng-show="valAtomic(item)" placeholder="Value">    <span class="je-tree-node-amount">{{amount(item.children)}}</span>  </div> </li>',replace:!0,scope:{index:"=",item:"=",amount:"=",level:"=",schema:"="},link:function(b,c){b.addSelectHidden=!0,b.addSelectValue="New …",b.allowedChildItems=[],b.$watch("schema",function(a){angular.isDefined(a)&&null!==a&&("object"===a.type&&a.hasOwnProperty("properties")&&"object"==typeof a.properties&&angular.forEach(a.properties,function(a,c){b.allowedChildItems.push({key:c,type:a.type})}),"array"===b.schema.type)}),b.menu={add:function(a){if(null!==a){if(angular.isUndefined(a.key)||angular.isUndefined(a.type))throw new Error("Cannot insert new item to the tree");var c=angular.copy(a);switch(c.auto=!1,c.type){case"object":c.value={},c.children=[];break;case"array":c.value=[],c.children=[];break;case"boolean":c.value=!0;break;case"null":c.value=null;break;default:c.value=""}b.item.children.splice(0,0,c)}},copy:function(a){var c=angular.copy(b.$parent.item.children[a]);if("array"===b.$parent.item.type){c.key=a+1;for(var d=a+2;d<b.$parent.item.children.length;d++)b.$parent.item.children[d].key=d}if("object"===b.$parent.item.type){var e=[],f=c.key,g=/_copy[0-9]*$/.test(f);g?f=f.replace(/[0-9]+$/,""):f+="_copy";var h=new RegExp(f+"[0-9]*$");if(angular.forEach(b.$parent.item.children,function(a){if(h.test(a.key)){var b=parseInt(a.key.replace(f,""));isNaN(b)||e.push(b)}}),0===e.length)c.key=f+"0";else{e.sort(function(a,b){return a-b});var i=e[e.length-1]+1;c.key=f+i}}b.$parent.item.children.splice(a+1,0,c)},remove:function(a){b.$parent.item.children.splice(a,1)}},b.children=null,b.treeOpenerStyle={marginLeft:20*b.level+"px"},b.collapsed=!1,b.isRootNode=function(){return c.hasClass("je-tree-root")},b.emptyKeyClass=function(){return""===String(b.item.key)?"empty-key":""},b.emptyValueClass=function(){return""===String(b.item.value)?"empty-value":""},b.toggleChildren=function(){if(!b.valAtomic(b.item)){var a=c.find("i").eq(3);b.collapsed=!b.collapsed,b.collapsed?a.removeClass("fa-caret-down").addClass("fa-caret-right"):a.removeClass("fa-caret-right").addClass("fa-caret-down")}},b.valAtomic=function(a){return!a.hasOwnProperty("children")},b.subSchema=function(a){var c=angular.isDefined(b.schema)&&null!==b.schema;switch(!0){case angular.isUndefined(a):case angular.isUndefined(a.type):case!c:return null}var d="object"===a.type||"array"===a.type;if(!d)return null;var e=angular.isDefined(b.schema.recursive)&&b.schema.recursive===!0;if(e)return b.schema;var f=null;switch(b.schema.properties[a.key].type){case"object":return f=b.schema.properties[a.key];case"array":f=b.schema.properties[a.key].items;var g=angular.copy(f),h={fakeItem:!0,type:"object",properties:{"New instance":g}};return b.schema.properties[a.key]=h,f=b.schema.properties[a.key]}return f};var d='<ul ng-hide="collapsed">  <je-tree-node     ng-repeat="childitem in item.children | jeCollection track by $id(childitem)"     index="$index"     item="childitem"     amount="amount"     schema="subSchema(childitem)"    menu="menu"     level="level+1" /></ul>';angular.isElement(b.children)&&b.children.remove(),b.children=a(d)(b),c.append(b.children)}}}]),angular.module("je.tree",["je.tree.node"]).directive("jeTree",["$compile","$http",function(a,b){return{restrict:"EA",template:'<div ng-focus="focus" ng-mouseenter="sync(false)" ng-mouseleave="sync(true)" class="je-tree">  <ul class="je-tree-node je-tree-root">    <je-tree-node schema="schema" ng-repeat="item in _ast" amount="amount" item="item" index="$index" class="je-tree-root" level="0" />  </ul></div>',replace:!0,link:function(a,c){angular.isDefined(c.attr("schema"))?b.post(c.attr("schema")).success(function(b){a.schema=b}).error(function(){throw new Error("Could not load the schema!")}):a.schema={description:"Object",type:"object",recursive:!0,properties:{Array:{description:"An array",type:"array"},Object:{description:"An object",type:"object"},String:{description:"A string",type:"string"},Number:{description:"A number",type:"number"},Boolean:{description:"A boolean",type:"boolean"},Null:{description:"A null",type:"null"}}},a._ast=[{key:"Sample",type:"object",children:[]}],a.$watch("jsoneditor.ast",function(b){a._ast[0].children=b},!0),a.sync=function(b){a.jsoneditor.sync.ast=b},a.amount=function(a){if(!angular.isArray(a)&&!angular.isObject(a))return null;var b,c=0;for(b in a)a.hasOwnProperty(b)&&c++;return c}}}}]),angular.module("jsoneditor",["je.services","je.ace","je.text","je.tree"]).directive("jeSplitter",["$compile","$http","jeConverter",function(a,b,c){return{restrict:"EA",template:'<div ng-mousemove="move($event)" ng-mouseleave="jsoneditor.dragging = false" class="je-splitter" ng-transclude></div>',replace:!0,transclude:!0,controller:["$scope","$element","$attrs","$transclude",function(d,e){if(d.jsoneditor={json:"{}",object:{},ast:[],tree:[],sync:{ast:!0,json:!0},ace:{options:{mode:"json",showIndentGuides:!1,showInvisibles:!1,showPrintMargin:!1,useWrapMode:!0}},container:{width:{left:100,right:100},editor:{left:null,right:null}},dragElement:null,dragging:!1},angular.isDefined(e.attr("json"))){var f=e.attr("json");/^(https?:)?\/\//.test(f)?b.post(f).success(function(a){d.jsoneditor.object=a}).error(function(){throw new Error("Could not load the json!")}):d.jsoneditor.object=d.$eval(f)}else d.jsoneditor.object={array:[1,2,3],"boolean":!0,"null":null,number:123,object:{a:"b",c:"d",e:"f"},string:"Hello World"};d.$watch("jsoneditor.object",function(a){d.jsoneditor.sync.json&&(d.jsoneditor.json=JSON.stringify(a))},!0),d.$watch("jsoneditor.json",function(a){try{d.jsoneditor.object=JSON.parse(a)}catch(b){return void console.log("could not parse the json")}d.jsoneditor.sync.ast&&(d.jsoneditor.ast=c.object2ast(d.jsoneditor.object,!0))}),d.$watch("jsoneditor.ast",function(a){angular.isObject(a)&&(d.jsoneditor.object=c.ast2object(a))},!0),d.move=function(a){if(d.jsoneditor.dragging){var b=a.clientX-e[0].offsetLeft,c=e[0].offsetWidth,f=100*b/c;d.resizeEditors(f)}},d.$watch("jsoneditor.container.width",function(a){angular.isObject(d.jsoneditor.container.editor.left)&&angular.isObject(d.jsoneditor.container.editor.right)&&(d.jsoneditor.container.editor.left.style.width=a.left+"%",d.jsoneditor.container.editor.right.style.width=a.right+"%")},!0),d.resizeEditors=function(a){if(d.jsoneditor.dragging){var b=e[0].offsetWidth,c=0;if(angular.isObject(d.jsoneditor.dragElement)){var f=d.jsoneditor.dragElement[0],g=f.currentStyle||window.getComputedStyle(f),h=parseInt(g.marginLeft,10)+parseInt(g.marginRight,10),i=h+f.offsetWidth;c=100*(i/b)/2}d.jsoneditor.container.width.left=a-c,d.jsoneditor.container.width.right=100-a-c}},this.removeChildren=function(a){var b=a[0].children.length,c=0;angular.forEach(a[0].children,function(a){a.hasAttribute("je-container")||(a.remove(),c++)});var d=b-c;if(d>2)for(var e=2;d>e;e++)a[0].children[e].remove()},this.addAttribute=function(a,b,c){var d=document.createAttribute(b);d.nodeValue=c,a.setAttributeNode(d)},this.addDrag=function(b){var c=a("<div je-drag></div>")(d);return angular.element(b[0].children[0]).after(c),c}}],link:function(a,b,c,d){d.removeChildren(b),b[0].children.length>0&&(a.jsoneditor.container.editor.left=b[0].children[0],b[0].children.length>1&&(a.jsoneditor.container.editor.right=b[0].children[1],a.jsoneditor.dragElement=d.addDrag(b)))}}}]).directive("jeContainer",function(){return{restrict:"EA",template:'<div ng-style="" class="je-container" ng-transclude></div>',replace:!0,transclude:!0,link:function(){}}}).directive("jeDrag",function(){return{restrict:"EA",controller:["$scope","$element","$attrs","$transclude",function(){}],template:'<div class="je-drag je-unselectable" ng-mousedown="jsoneditor.dragging = true" ng-mouseup="jsoneditor.dragging = false">⋮</div>',replace:!0,link:function(){}}});
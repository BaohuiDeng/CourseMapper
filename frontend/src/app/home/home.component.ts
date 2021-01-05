import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TreeItemComponent } from '../templates/tree-item/tree-item.component';
import { CollapseService } from '../services/collapse.service';
declare var $: any;
declare var jsPlumb: any;

function Leave(jQEl, fromCenter) {
    var self = this;
    self.el = jQEl;
    self.fromCenter = fromCenter;
    self.w = 0;
    self.h = 0;
    self.init = function (w, h) {
        self.w = self.el.width();
        self.h = self.el.height();

        self.rePosition(w, h);
    };

    self.onWindowResize = function (w, h) {
        self.rePosition(w, h);
    };

    self.rePosition = function (w, h) {
        var left = w / 2 + ((self.fromCenter.x - self.w / 2)  );
        var top = h / 2 + ((self.fromCenter.y - self.h / 2)  );

        self.el.css({
            left: left + "px",
            top: top + "px"
        });
    };
}
var Tree = {
    center: null,
    leaves: {},

    init: function (w, h) {
        var self = this;
        self.center = new Leave($('.center-category'), {x: 0, y: 0});
        self.center.init(w, h);
        $('.w').each(function () {
            var xFromRoot = $(this).children(".xy").val().split(",")[0];
            var yFromRoot = $(this).children(".xy").val().split(",")[1];
            var leave = new Leave($(this), {x: parseInt(xFromRoot), y: parseInt(yFromRoot)});
            leave.init(w, h);
            self.leaves[$(this).attr('id')] = leave;
        });

    },

    onWindowResize: function (w, h) {
        var self = this;

        self.center.onWindowResize(w, h);
        for (var i in self.leaves) {
            var el = self.leaves[i];
            el.onWindowResize(w, h);
        }
    }
};

var Canvas = {
    el: null,
    draggable: null,
    w: 2000,
    h: 2000,
    centerCss: {},

    init: function (wWidth, wHeight) {
        var self = this;

        self.el = $('.category-map');
        self.draggable = self.el.draggable();

        // so it big enough
        self.el.css({
            width: self.w + 'px',
            height: self.h + 'px'
        });

        // put it on the center
        self.setCenter(wWidth, wHeight);
        self.putOnCenter();
    },

    setCenter: function (wWidth, wHeight) {
        var self = this;

        self.centerCss = {
            left: ( (wWidth - self.w) / 2) + 'px',
            top: ( (wHeight - self.h) / 2) + 'px'
        };
    },

    putOnCenter: function (animate) {
        var self = this;

        if (animate)
            self.el.animate(self.centerCss, {duration: 1000, easing: 'easeOutExpo'});
        else
        // put it on the center
            self.el.css(self.centerCss);
    },

    onWindowResize: function (w, h) {
        var self = this;

        // put it on the center
        self.setCenter(w, h);
        self.putOnCenter();
    }

};
var Container = {
    el: null,

    init: function () {
        this.el = $('.tree-container');

        var w = window.innerWidth;
        var h = window.innerHeight;

        this.el.css({
            'width': w,
            'height': h
        });
    },

    onWindowResize: function (w, h) {
        // resize it to follow the window size
        this.el.css({
            'width': w,
            'height': h
        });
    }
};
var found = false;

var i = 0;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
    
    @ViewChild(TreeItemComponent) viewChild: TreeItemComponent;
    baseUrl:string = "http://localhost:3000/api";
    categories = [];
    isTreeInitiated:boolean = false;
    treeNodes = [];
    isRequesting:boolean = false;
    widgets = [];
    jsPlumbConnections = [];
    firstloaded:boolean = true;
    nodeChildrens = {};
    collapseStatus = {};
    donotInit = false;

    constructor(private http: HttpClient, private collapseService:CollapseService) { }
    ngOnInit(): void {
        this.http.get(this.baseUrl + "/categories").subscribe((data:any)=> {
            this.categories = data.categories;
        })
        Container.init();
        Canvas.init(window.innerWidth, window.innerHeight);
        $(window).resize(function () {
            var w = window.innerWidth;
            var h = window.innerHeight;
            Container.onWindowResize(w, h);
            Canvas.onWindowResize(w, h);
        });
    }
    ngAfterViewChecked(){
        i++;
        if(i == 2){
            this.jsTreeInit();
        }
    }
    initDraggable(jsPlumbInstance){
        var w = window.innerWidth;
        var h = window.innerHeight;
        var that = this;
        // let us drag and drop the cats
        var mapEl = jsPlumb.getSelector(".category-map .w");
        jsPlumbInstance.draggable(mapEl, {
            // update position on drag stop
            stop: function (params) {
                var el = $(params.el);
                var pos = el.position();
                var distanceFromCenter = {
                    x: pos.left - Canvas.w / 2,
                    y: pos.top - Canvas.h / 2
                };
                that.http.put(that.baseUrl + '/category/' + el.attr('id') + '/positionFromRoot', distanceFromCenter)
                    .subscribe({
                        next:data => {                            
                            console.log(data);

                        },
                        error: error => {
                            console.log('err');
                            console.log(error);
                        }
                    });
            }
        });
    }
    initJSPlumb(){
        Tree.init(Canvas.w, Canvas.h);
        var instance = jsPlumb.getInstance({
            Endpoint: ["Blank", {radius: 2}],
            HoverPaintStyle: {strokeStyle: "#3C8DBC", lineWidth: 2},
            PaintStyle: {strokeStyle: "#3C8DBC", lineWidth: 2},
            ConnectionOverlays: [],
            Container: "category-map"
        });
        // // so the ejs can access this instance
        this.initDraggable(instance);
        var that = this;
        // initialise all '.w' elements as connection targets.
        instance.batch(function () {
            /* connect center to first level cats recursively*/
            that.interConnect('center', that.categories, instance);
            /*blanket on click to close dropdown menu*/
            that.initDropDownMenuHybrid();
        });

        setTimeout(function () {
            that.firstCollapse(that.categories);
            that.getCollapseDataFromLStorage();
            that.initiateCollapse();
            $('.tree-container').css('visibility', 'visible');
        });
    }
    jsTreeInit(){
        this.initJSPlumb();
    }
    findNode(obj, col, searchKey, searchValue) {
        if (found)
            return found;

        for (var i in obj) {
            var tn = obj[i];

            if (tn[searchKey] && tn[searchKey] == searchValue) {
                found = tn;
                return tn;
            }
            else if (tn[col] && tn[col].length > 0) {
                // search again
                this.findNode(tn[col], col, searchKey, searchValue);
            }
        }

        if (found)
            return found;
    }
    sendPosition(nId, distanceFromCenter, pNode) {
        this.http.put(this.baseUrl + '/treeNodes/' + nId + '/positionFromRoot', distanceFromCenter)
            .subscribe({
                next:data => {
                    if (pNode)
                    pNode.positionFromRoot = distanceFromCenter;
                },
                error: error => {
                    console.log('err');
                    console.log(error);
                }
            });
    }
    interConnect(parent, categories, instance) {
        for (var i in categories) {
            var child = categories[i];
            this.initDropDown(child.slug);

            var conn = instance.connect({
                source: parent, target: child.slug,
                anchors: [
                    ["Perimeter", {shape: jsPlumb.getSelector('#' + parent)[0].getAttribute("data-shape")}],
                    ["Perimeter", {shape: jsPlumb.getSelector('#' + child.slug)[0].getAttribute("data-shape")}]
                ],
                connector: ["Bezier", {curviness: 5}]
            });
            $(conn.connector.canvas).attr('data-source', parent);
            $(conn.connector.canvas).attr('data-target', child.slug);

            if (child.subCategories) {
                this.interConnect(child.slug, child.subCategories, instance);
            }
        }
    }
    initDropDown(slug) {
        var that = this;
        $('#' + slug)
            .on('click mousedown mouseup touchstart', function (event) {
                if ($(this).find('ul').hasClass('open')) {
                    if ($(this).find('li').hasClass('goto-button')) {
                        return true;
                    }

                    $('.open').removeClass('open');
                    return false;
                }

                $('.open').not($(this).parents('ul')).removeClass('open');
                $(this).find('ul').addClass('open');

                if (event.type == 'touchstart') {
                    that.http.get(that.baseUrl + '/server-widgets/category-homepage/?slug=' + slug).subscribe((data:any) => {
                        if (data.result) {
                            // this.widgets[slug] = $sce.trustAsHtml(res.widgets);
                            $(this).find('ul').find("li#analytics-" + slug).html(data.widgets);
                        }
                    });
                }
                return false;
            })
            .on('mouseenter', function () {
                that.http.get(that.baseUrl + '/server-widgets/category-homepage/?slug=' + slug).subscribe((data:any) =>{
                    if (data.result) {
                        // this.widgets[slug] = $sce.trustAsHtml(res.widgets);
                        $(this).find('ul').find("li#analytics-" + slug).html(data.widgets);
                    }
                });
            });
    }
    requestIconAnalyitics(nodeId) {
        nodeId = nodeId.substring(1);
        if (nodeId == 'enter')
            return;
        this.http.get<any>(this.baseUrl + '/server-widgets/topic-icon-analytics/?nodeId=' + nodeId).subscribe({
            next : res => {
                this.isRequesting = false;
                if (res.result) {
                    // this.widgets[nodeId] = $sce.trustAsHtml(res.widgets);
                }
            },
            error : error => {
                this.isRequesting = false;
            }
        })
    }
    initDropDownMenuHybrid() {
        $('#tree .course-map').on('click', function (event) {
            var target = $(event.target);
            var k = target.parents('div');
            if (k.hasClass('ui-draggable') && k.hasClass('w')) {
                return true;
            } else if (k.hasClass('center-course')) {
                return true;
            } else if (target.hasClass('w')) {
                return true;
            }

            if ($('.open').length > 0) {
                $('.open').removeClass('open');
                return false;
            }
        });
    }
    firstCollapse(categories) {
        if (!this.firstloaded)
            return;

        this.firstloaded = false;
        for (var i = 0; i < categories.length; i++) {
            var child = categories[i];

            this.getChildLength(child._id, 0, child);
        }

        // collapse on first level
        for (var j in this.nodeChildrens[1]) {
            var totalKids = this.nodeChildrens[1][j];
            if (totalKids > 0) {
                this.collapseService.setCollapseFirst(j);
                this.collapseStatus[j] = true;
            } else {
                this.collapseService.setExpandFirst(j);
                this.collapseStatus[j] = false;
            }
        }
    }
    getChildLength(nid, level, categories) {
        if (this.nodeChildrens[level] == undefined) {
            this.nodeChildrens[level] = {};
        }

        if (this.nodeChildrens[level][nid] == undefined) {
            this.nodeChildrens[level][nid] = 0;
        }

        var add = 0;
        if (categories.subCategories && categories.subCategories.length > 0)
            add = 1;

        this.nodeChildrens[level][nid] += add;

        if (level > 1) {
            if (this.nodeChildrens[level][nid] > 0) {
                this.collapseService.setCollapseFirst(nid);
                this.collapseStatus[nid] = true;
            }
        }

        if (categories.subCategories && categories.subCategories.length > 0) {
            level++;
            for (var e in categories.subCategories) {
                var ch = categories.subCategories[e];
                this.getChildLength(ch._id, level, ch);
            }
        }
    }
    initiateCollapse() {
        for (var i in this.collapseService.collapsed) {
            var colEl = 't' + this.collapseService.collapsed[i];
            this.collapse(colEl, true);
        }
    }
    collapse(el, isInit) {
        var nodeId = el.substring(1);

        found = false;
        var pNode = this.findNode(this.treeNodes, 'childrens', '_id', nodeId);
        if (pNode) {
            var hide;

            if (isInit === true)
                hide = this.collapseService.isCollapsed(nodeId);
            else
                hide = this.collapseService.toggle(nodeId);

            if (hide === false) {
                this.collapseStatus[nodeId] = false;
                $('#' + el).addClass('aborted');
                this.collapseService.affectVisual(false, pNode, nodeId);
            }
            // else if (hide >= 0 || hide == true) {
            else if (hide == true) {
                this.collapseStatus[nodeId] = true;
                this.collapseService.affectVisual(true, pNode, nodeId);
                $('#' + el).removeClass('aborted');
            }

        }
    }
    getCollapseDataFromLStorage() {
        if (typeof(localStorage) == "undefined")
            return;

        for (var i in localStorage) {
            var collData = localStorage[i];
            if (i.indexOf("collapse") > -1) {
                var _id = i.split('.');
                var id = _id[1];
                collData = parseInt(collData);
                if (collData) {
                    this.collapseService.setCollapse(id);
                    this.collapseStatus[id] = true;
                }
                else {
                    this.collapseService.setExpand(id);
                    this.collapseStatus[id] = false;
                }
            }
        }
    }
    collapseParent(e){
        var el = e.el;
        var nodeId = el.substring(1);

        found = false;
        var pNode = this.findNode(this.categories, 'subCategories', '_id', nodeId);
        if (pNode) {
            var hide = false;
            hide = this.collapseService.toggle(nodeId);

            if (hide === false) {
                this.collapseStatus[nodeId] = false;
                $('#' + el).addClass('aborted');
                this.collapseService.affectVisualCat(false, pNode, pNode.slug);
            }
            else if (hide == true) {
                this.collapseStatus[nodeId] = true;
                this.collapseService.affectVisualCat(true, pNode, pNode.slug);
                $('#' + el).removeClass('aborted');
            }

        }
    }
}

/* 
 * Copyright (C) 2012 B3Partners B.V.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
/**
 * FeatureInfo component
 * Shows feature info.
 * @author <a href="mailto:roybraam@b3partners.nl">Roy Braam</a>
 */
Ext.define ("viewer.components.FeatureInfo",{
    extend: "viewer.components.Maptip",   
    progressElement: null,
    /**
     * Overwrite constructor to set some other settings then maptip.
     */
    constructor: function (conf){    
        conf.isPopup=true;
        //don't call maptip constructor but that of super maptip.
        viewer.components.Maptip.superclass.constructor.call(this, conf);        
        this.initConfig(conf);   
        //make the balloon
        this.balloon = new Balloon(this.getDiv(),this.getViewerController().mapComponent,"balloonFeatureInfo",this.width,this.height);
        //set the offset of the map
        var mapTopOffset=this.viewerController.getLayoutHeight('top_menu');
        if (mapTopOffset<0){
            mapTopOffset=0;
        }
        this.balloon.offsetY+=Number(mapTopOffset);
        //show close button and dont close on mouse out.
        this.balloon.closeOnMouseOut=false;
        this.balloon.showCloseButton=true;
        var me = this;
        this.balloon.close = function(){            
            me.balloon.setContent("");
            me.balloon.hide();
            me.setMaptipEnabled(true);
        }
        //if topmenu height is in % then recalc on every resize.        
        var topMenuLayout=this.viewerController.getLayout('top_menu');
        if (topMenuLayout.heightmeasure && topMenuLayout.heightmeasure =="%"){
            Ext.EventManager.onWindowResize(function(){
                me.onResize();            
            }, this);
        }
        this.onResize();
        //listen to the on addlayer
        this.getViewerController().mapComponent.getMap().addListener(viewer.viewercontroller.controller.Event.ON_LAYER_ADDED,this.onAddLayer,this);
        this.getViewerController().mapComponent.getMap().addListener(viewer.viewercontroller.controller.Event.ON_LAYER_REMOVED,this.onLayerRemoved,this);
         //Add event when started the identify (clicked on the map)
        this.getViewerController().mapComponent.getMap().addListener(viewer.viewercontroller.controller.Event.ON_GET_FEATURE_INFO,this.onFeatureInfoStart,this);
        //listen to a extent change
        this.getViewerController().mapComponent.getMap().addListener(viewer.viewercontroller.controller.Event.ON_CHANGE_EXTENT,
        function(map,options){
            me.onChangeExtent(map,options);
        },this);
        return this;        
    },    
    /**
     * Event handler for when a layer is added to the map
     * @see event ON_LAYER_ADDED
     */
    onAddLayer: function(map,options){
        var mapLayer=options.layer;
        if (mapLayer==null)
            return;
        if (!this.isLayerConfigured(mapLayer)){
            return;
        }
        if(this.isSummaryLayer(mapLayer)){            
            var appLayer=this.viewerController.app.appLayers[mapLayer.appLayerId];
            var layer = this.viewerController.app.services[appLayer.serviceId].layers[appLayer.layerName];
            //Store the current map extent for every maptip request.            
            this.viewerController.mapComponent.getMap().addListener(viewer.viewercontroller.controller.Event.ON_GET_FEATURE_INFO,function(map,options){
                this.setRequestExtent(map.getExtent());
            },this); 
            //do server side getFeature.
            if (layer.hasFeatureType){
                this.addLayerInServerRequest(appLayer);
            }else{
                //TODO: add query layers to the map
                //listen to the onMaptipData
                mapLayer.addListener(viewer.viewercontroller.controller.Event.ON_GET_FEATURE_INFO_DATA,this.onMapData,this);       
            }            
        }
    },
    
    onLayerRemoved: function(map,options) {
        var mapLayer = options.layer;
        if (mapLayer==null)
            return;        
        if(this.isSummaryLayer(mapLayer)){            
            var appLayer=this.viewerController.app.appLayers[mapLayer.appLayerId];
            var layer = this.viewerController.app.services[appLayer.serviceId].layers[appLayer.layerName];
            if (layer.hasFeatureType){
                Ext.Array.remove(this.serverRequestLayers, appLayer);
            }
        }

    },
        
    /**
     * Enable doing server requests.
     * @param appLayer the applayer
     */
    addLayerInServerRequest: function (appLayer){ 
        //first time register for event and make featureinfo ajax request handler.
        if (!this.serverRequestEnabled){
            this.viewerController.mapComponent.getMap().addListener(viewer.viewercontroller.controller.Event.ON_GET_FEATURE_INFO,this.doServerRequest,this);
            this.featureInfo=Ext.create("viewer.FeatureInfo", {viewerController: this.viewerController});
            this.serverRequestEnabled = true;
        }
        if (this.serverRequestLayers ==null){
            this.serverRequestLayers=new Array();
        }
        Ext.Array.include(this.serverRequestLayers, appLayer);
    },    
    /**
     * When a feature info starts.
     */
    onFeatureInfoStart: function(){
        this.balloon.setContent("");
        this.balloon.hide();
        this.setMaptipEnabled(false);
    },
    /**
     * 
     */
    onDataReturned: function(options){
        var found=false;
        var data = options.data;
        for (var layerIndex in data){            
            var layer=data[layerIndex];
            for (var index in layer.features){
                found=true;
                break;
            }
            if(found){
                break;
            }
        }
        if (!found){
            this.setMaptipEnabled(true);
        }
        this.callParent(arguments);        
        
    },
    /**
     *Called when extent is changed, recalculate the position
     */
    onChangeExtent : function(map,options){        
        if (this.worldPosition && options.extent){
            if (options.extent.isIn(this.worldPosition.x,this.worldPosition.y)){
                this.balloon.setPositionWorldCoords(this.worldPosition.x,this.worldPosition.y,false,this.getBrowserZoomRatio());
            }else{
                this.balloon.hide();
            }
        }
    },
    /**
     * 
     */
     setMaptipEnabled: function (enable){        
        var maptips= this.viewerController.getComponentsByClassName("viewer.components.Maptip");
        for (var i =0; i < maptips.length;i++){
            if (typeof maptips[i].setEnabled == 'function'){
                maptips[i].setEnabled(enable);
            }
        } 
     }
            
});

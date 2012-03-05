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

Ext.define("viewer.AppInfo", {
    config: {
        actionbeanUrl: null
    },
    url: null,
    constructor: function(config) {        
        this.initConfig(config);     
        if(this.config.actionbeanUrl == null) {
            this.config.actionbeanUrl = actionBeans["app"];
        }        
    },
    getAppLayerInfo: function(appLayerId, successFunction, failureFunction) {
        
        Ext.Ajax.request({
            url: this.config.actionbeanUrl,
            params: {appLayerInfo: true, appLayer: appLayerId},
            success: function(result) {
                var response = Ext.JSON.decode(result.responseText);
                
                if(response.success) {
                    successFunction(response.info);
                } else {
                    if(failureFunction != undefined) {
                        failureFunction(response.error);
                    }
                }
            },
            failure: function(result) {
                if(failureFunction != undefined) {
                    failureFunction("Ajax request failed with status " + result.status + " " + result.statusText + ": " + result.responseText);
                }
            }
        });
    }
});

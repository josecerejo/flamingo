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
  *Openlayers implementation of Component.
  *@see viewer.viewercontroller.controller.Component
  *@author <a href="mailto:roybraam@b3partners.nl">Roy Braam</a>
  **/
Ext.define("viewer.viewercontroller.openlayers.OpenLayersComponent",{
    extend: "viewer.viewercontroller.controller.Component",
    frameworkComponent:null,
    /**
     * @see viewer.viewercontroller.controller.Component#constructor
     */
    constructor : function (conf){
        viewer.viewercontroller.openlayers.OpenLayersComponent.superclass.constructor.call(this,conf);
    }
});
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
 * HTML component
 * Creates a html component
 * @author <a href="mailto:roybraam@b3partners.nl">Roy Braam</a>
 */
Ext.define ("viewer.components.HTML",{
    extend: "viewer.components.Component",
    container: null,
    config: {
        html: "",
        title: "",
        loadScripts: false
    },
    constructor: function (conf){        
        viewer.components.HTML.superclass.constructor.call(this, conf);
        this.initConfig(conf);
        this.loadHtml();
        return this;
    },
    loadHtml : function(){
        var parentDiv = Ext.get(this.div);
        //var height = parentDiv.getHeight();
        //var width = parentDiv.getWidth();
        this.container = Ext.create('Ext.container.Container', {
            width: '100%',
            height: '100%',
            renderTo: this.div,
            autoScroll: true
        });
        
        this.container.update(this.html, this.loadScripts);
    },
    getExtComponents: function() {
        return [ this.container.getId() ];
    }
});

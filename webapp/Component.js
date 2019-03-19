sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"br/com/idxtecCfop/model/models"
], function(UIComponent, Device, models) {
	"use strict";

	return UIComponent.extend("br.com.idxtecCfop.Component", {

		metadata: {
			manifest: "json"
		},

		init: function() {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);
			
			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			this.setModel(models.createViewModel(), "view");
		},
		
		getContentDensityClass: function(){
			if(!this._sContentDensityClass){
				if(!sap.ui.Device.support.touch){
					this._sContentDensityClass = "sapUiSizeCompact";
				} else {
					this._sContentDensityClass = "sapUiSizeCozy";
				}
			}
			return this._sContentDensityClass;
		}
	});
});
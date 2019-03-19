sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox"
], function(Controller, MessageBox) {
	"use strict";

	return Controller.extend("br.com.idxtecCfop.controller.Cfop", {
		onInit: function(){
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
		},
	
		onRefresh: function(){
			var oModel = this.getOwnerComponent().getModel();
			oModel.refresh(true);
		},
		
		onIncluir: function(){
			var oDialog = this._criarDialog();
			var oModel = this.getOwnerComponent().getModel();
			var oViewModel = this.getModel("view");
		
			oViewModel.setData({
				titulo: "Incluir novo CFOP",
				codigoEdit: true,
				msgSalvar: "CFOP inserido com sucesso!"
			});
			
			oDialog.unbindElement();
			oDialog.setEscapeHandler(function(oPromise){
				if(oModel.hasPendingChanges()){
					oModel.resetChanges();
				}
			});
			
			var oContext = oModel.createEntry("/Cfops", {
				properties: {
					"Codigo": "",
					"Descricao": ""
				}
			});
			
			oDialog.setBindingContext(oContext);
			oDialog.open();
		},
		
		onEditar: function(){
			var oDialog = this._criarDialog();
			var oTable = this.byId("tableCfop");
			var nIndex = oTable.getSelectedIndex();
			var oViewModel = this.getModel("view");
			
			oViewModel.setData({
				titulo: "Editar CFOP",
				codigoEdit: false,
				msgSalvar: "CFOP alterado com sucesso!"
			});
			
			if(nIndex === -1){
				MessageBox.information("Selecione um CFOP da tabela!");
				return;
			}
			
			var oContext = oTable.getContextByIndex(nIndex);
			
			oDialog.bindElement(oContext.sPath);
			oDialog.open();
		},
		
		onRemover: function(){
			var that = this;
			var oTable = this.byId("tableCfop");
			var nIndex = oTable.getSelectedIndex();
			
			if(nIndex === -1){
				MessageBox.information("Selecione um CFOP da tabela!");
				return;
			}
			
			MessageBox.confirm("Deseja remover esse CFOP?", {
				onClose: function(sResposta){
					if(sResposta === "OK"){
						that._remover(oTable, nIndex);
						MessageBox.success("CFOP removido com sucesso!");
					}
				} 
			});
		},
		
		onSaveDialog: function(){
			var oView = this.getView();
			var oModel = this.getOwnerComponent().getModel();
			var oViewModel = this.getOwnerComponent().getModel("view");
			
			if(this._checarCampos(this.getView()) === true){
				MessageBox.information("Preencha todos os campos obrigatórios!");
				return;
			} else{
				oModel.submitChanges({
					success: function(){
						oModel.refresh(true);
						MessageBox.success(oViewModel.getData().msgSalvar);
						oView.byId("CfopDialog").close();
						oView.byId("tableCfop").clearSelection();
					},
					error: function(oError){
						var sError = JSON.parse( oError.responseText).error.message.value; 
						MessageBox.error(sError);
					}
				});
			}
		},
		
		onCloseDialog: function(){
			var oModel = this.getOwnerComponent().getModel();
			
			if(oModel.hasPendingChanges()){
				oModel.resetChanges();
			}
			
			this.byId("CfopDialog").close();
		},
		
		_remover: function(oTable, nIndex){
			var oModel = this.getOwnerComponent().getModel();
			var oContext = oTable.getContextByIndex(nIndex);
			
			oModel.remove(oContext.sPath, {
				success: function(){
					oModel.refresh(true);
					oTable.clearSelection();
				},
				error: function(oError){
					MessageBox.error(oError.responseText);
				}
			});
		},
		
		_criarDialog: function(){
			var oView = this.getView();
			var oDialog = this.byId("CfopDialog");
			
			if(!oDialog){
				oDialog = sap.ui.xmlfragment(oView.getId(), "br.com.idxtecCfop.view.CfopDialog", this);
				oView.addDependent(oDialog); 
			}
			return oDialog;
		},
		
		_checarCampos: function(oView){
			if(oView.byId("codigo").getValue() === "" || oView.byId("descricao").getValue() === ""){
				return true;
			} else{
				return false; 
			}
		},
		
		getModel: function(sModel) {
			return this.getOwnerComponent().getModel(sModel);
		}
	});
});
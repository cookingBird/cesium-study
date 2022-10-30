function CreateDynamicEntity (viewer,data,isConstant = false) {
	this.viewer = viewer;
	this.data = data;
}

CreateDynamicEntity.prototype.update = function (data) {
	this.data = data;
}

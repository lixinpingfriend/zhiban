lastPageGen=${fld:pagecount};
currentPageGen=${fld:currentpage};
recordsFoundGen=${fld:recordcount};
uniqueGen=${fld:uniquegen}

viewPageGen();

if(typeof(searchBackSetting) == "function"){
	searchBackSetting();
}
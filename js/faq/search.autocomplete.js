function searchAutoComplete(name,url,callback){
	var autoOpt = {
		minChars: 0,
		max: 20,
		width: '160px',
		selectFirst: false,
		matchSubset: false,
		matchContains: true,
		dataType: 'json',
		highlight: function(value, term) {
			return value.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + term.replace(/([\^\$\(\)\[\]\{\}\*\.\+\?\|\\])/gi, "\\$1") + ")(?![^<>]*>)(?![^&;]+;)", "gi"), 
					"<font color='red'><u><strong>$1</strong></u></font>");
		},
		parse: function(data){
			var rows = [];
			for(var i = 0; i < data.result.length; i++){      
				rows[rows.length] = {
					data: data.result[i],
					value: data.result[i].name,
					result: data.result[i].name
				};
			}      
			return rows;
		},
		formatItem: function(data){
			return data.name;
		}
	};
	$(name).autocomplete(url, autoOpt).result(function(event, data, formatted) {
		if(data && callback && jQuery.isFunction(callback))
			callback(data);
	});
	$(name).focus().autocomplete(url,autoOpt);
	$(name).click().autocomplete(url,autoOpt); 
	return true;
}
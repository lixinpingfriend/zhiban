(function() {
	var $Tree={
			initTree:function() {
			    $('.tree li:has(ul)').addClass('parent_li').find(' > span').attr('title', '收起');
			    $('.tree li.parent_li > span').on('click', function (e) {
			        var children = $(this).parent('li.parent_li').find(' > ul > li');
			       
			        if (children.is(":visible")) {
			            children.hide('fast');
			            $(this).attr('title', '展开').find(' > i').addClass('glyphicon-plus-sign1').removeClass('glyphicon-minus-sign1');
			        } else {
			            children.show('fast');
			            $(this).attr('title', '收起').find(' > i').addClass('glyphicon-minus-sign1').removeClass('glyphicon-plus-sign1');
			        }
			        e.stopPropagation();
			    });
			},
			// Node object
			Node:function(id, pid, name, url) {
				this.id = id;
				this.pid = pid;
				this.name = name;
				this.url = url;
			},

			// Tree object
			myTree:function() {
				this.aNodes = [];
				this.root = new zhiban.tree.Node("0");
				this.add = function(id, pid, name, url) {
					this.aNodes[this.aNodes.length] = new zhiban.tree.Node(id, pid, name, url);
				};
				this.addNode = function(pNode) {
					var str = '';
					var n=0;
					for (n; n<this.aNodes.length; n++) {
						if (this.aNodes[n].pid == pNode.id) {
							var cn = this.aNodes[n];
							str += this.node(cn, this.aNodes[n].id);
						}
					}
					if(str != ''){
						str = "<ul>" + str + "</ul>";
					}
					return str;
				};
				this.node = function(node, nodeId) {
					var str = "<li><span><i class='glyphicon'>&nbsp;</i>" + node.name + "</span>" + node.url + this.addNode(node);
					return str;
				};
				this.toString = function() {
					var str = '<div class="tree">\n';
					str += this.addNode(this.root);
					str += '</div>';
					return str;
				};
			},close:function(){//收缩
				$('.tree li.parent_li > span').each(function () {
			        var children = $(this).parent('li.parent_li').find(' > ul > li');
			        children.hide();
		            $(this).attr('title', '展开').find(' > i').addClass('glyphicon-plus-sign').removeClass('glyphicon-minus-sign');
			    });
			}

			
			
	};
	window["zhiban"]["tree"] = $Tree;
})();


"use strict";
const htmlMinifier = require('html-minifier');

module.exports = function({ types: t }, options) {
	options = Object.assign({
		separator: '###babel-polymer-minify-html###',
		htmlMinifier: {
			removeComments: true,
			collapseWhitespace: true,
			minifyCSS: true,
		},
	}, options);
	return {
		visitor: {
			TaggedTemplateExpression: function(path, state){
				if (path.node.tag.name == 'html') {
					const oldValue = path.node.quasi.quasis.map(x=>x.value.cooked).join(options.separator);
					const newValue = htmlMinifier.minify(oldValue, options.htmlMinifier);
					path.node.quasi.quasis = newValue.split(options.separator).map(x=>({
						value: {
							cooked: x,
							raw: x,
						},
					}))
				}
			},
		}
	}
}

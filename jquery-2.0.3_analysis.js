/*!
 * jQuery JavaScript Library v2.0.3
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-07-03T13:30Z
 */
(function( window, undefined ) {

// Can't do this because several apps including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
// Support: Firefox 18+
//"use strict";
var
	// A central reference to the root jQuery(document)
    // ���ڵ�jQ���� rootjQuery = jQuery(document);
	rootjQuery,

	// The deferred used on DOM ready
	readyList,

	// Support: IE9
	// For `typeof xmlNode.method` instead of `xmlNode.method !== undefined`
	core_strundefined = typeof undefined,

	// Use the correct document accordingly with window argument (sandbox)
	location = window.location,
	document = window.document,
	docElem = document.documentElement,

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// [[Class]] -> type pairs
	class2type = {},

	// List of deleted data cache ids, so we can reuse them
    // ��֮ǰ�İ汾�У��������������ݻ���id�йأ�
    // ����汾�н�������һ�����������������������������ȡ����ķ���
	core_deletedIds = [],

	core_version = "2.0.3",

	// Save a reference to some core methods
	core_concat = core_deletedIds.concat,
	core_push = core_deletedIds.push,
	core_slice = core_deletedIds.slice,
	core_indexOf = core_deletedIds.indexOf,
	core_toString = class2type.toString,
	core_hasOwn = class2type.hasOwnProperty,
    // �߼�������ᶨ��������������ͼ���������� undefined
	core_trim = core_version.trim,

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Used for matching numbers
    // source ������ȡ������ʽԴ�ı������ﷵ�� "[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)" ������Ϊ "string"
    // ƥ�����飬���������š���ѧ��������.��ͷ�ȶ������������
	core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,


    // jQuery �б��������и�����
    // �����������ǰ����'r'����������ǰ����'f'

	// Used for splitting on whitespace
    // ƥ�����ⲻ�ǿհ׵��ַ�
	core_rnotwhite = /\S+/g,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)

    // �������� 
    // (?:\s*(<[\w\W]+>)[^>]* ��ͷ���磺' <div id=top></div>'
    // #([\w-]*)) ��β���磺'#btn'
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	// Match a standalone tag
    // \1�����һ��()���������
    // �ձ�ǩû�����ݿ���ͨ�����磺
    // '<div ></div>' �õ�  ["<div ></div>", "div", index: 0, input: "<div ></div>"]
    // '<div/>' �õ�  ["<div/>", "div", index: 0, input: "<div/>"]
    // �������Ի������ӽڵ���ַ���������ͨ������ƥ�䣬����null
    // �� '<div id="d"></div>'��'<div>text</div>'��ƥ�䲻�ɹ�
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

	// Matches dashed string for camelizing
    // css ��������js����Ҫת�շ壬���õ�����������
    // �� border-left ת�� borderLeft
    // ����ǰ׺ -ms- -o- -webkit �ȣ�ֻ�� -ms-�Ƚ�����
    // -o-border-radius ת�� oBorderRadius
    // ���� -ms- ת��������ĸ M ��д��MsBorderRadius
    // ���⣬�������֣�css3 �� -2d ת�� 2d����Ҫ�л��ߣ�-3d -> 3d��
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	},

	// The ready event handler and self cleanup method
    // ҳ�������ϣ�ִ�� ready �������У���ȡ�����ؼ���
	completed = function() {
		document.removeEventListener( "DOMContentLoaded", completed, false );
		window.removeEventListener( "load", completed, false );
		jQuery.ready();
	};

jQuery.fn = jQuery.prototype = {
	// The current version of jQuery being used
	jquery: core_version,

    // ����ָ�� jQuery
	constructor: jQuery,



    /*
    selector��ѡ����
    context��ѡ��Χ
    rootjQuery��$(document)
    ��������Ϊ��
    $(null), $(""), $(undefined), $(false)
    $('#id'), $('div'), $('.cls'), $('div + p span > a[title="hi"]')
    $('<li>'), $('<li>1</li><li>2</li>')
    $(this), $(document),$(document.getElementsByTagName('div')[0]),$(document.getElementsByTagName('div'))
    $(function(){})
    $([]), $({})

    */
	init: function( selector, context, rootjQuery ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Handle HTML strings��ѡ������ַ���
        /*
        $('#id'), $('div'), $('.cls'), $('div + p span > a[title="hi"]')
        $('<li>'), $('<li>1</li><li>2</li>')
        */
		if ( typeof selector === "string" ) {
            // $('<li>'), $('<li>1</li><li>2</li>')
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				// �� match = [null,'<p>',null]
                match = [ null, selector, null ];
			} else {
				match = rquickExpr.exec( selector );
                // ʣ�� $('#id'), $('div'), $('.cls'), $('div + p span > a[title="hi"]')
                // ��ͨ��ƥ���ֻ�� $('#id')
                // match = ["#id", undefined, "id", index: 0, input: "#id"]
			}

            // ���� rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/
            // (<[\w\W]+>) ��Ӧ match[1]
            // ([\w-]*) ��Ӧ match[2]
    
            // �����dom�ַ���match[1]��ȡ��������dom��ǩ�����磺
            // selector = ' <div id=top></div>'; �õ� match[1] === "<div id=top></div>"
            // selector = ' <div id=top></div>dffdfd'; �õ� match[1] === "<div id=top></div>"
            
            // �����#id�ַ�������match[2]��ȡ��id�����磺
            // selector = '#test';�õ� match[2] === "test"


			// Match html or make sure no context is specified for #id
            // $('<li>'), $('<li>1</li><li>2</li>') �� $('#id')
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
                // html Ƭ��ת������
                // $('<li>'), $('<li>1</li><li>2</li>')
                // ������ǩ���ڶ���������context�������� document������ʡ�Բ�д����Ҳ������ contentDocument��iframe �ĵ���
				if ( match[1] ) {
                    // $('<a>',document),$('<a>',$(document))
                    // $(document) -> [document, context: document] -> $(document)[0] === document
					// �� context ����ԭ���ڵ㣬ȡ�����е�ԭ���ڵ� 
                    context = context instanceof jQuery ? context[0] : context;

					// scripts is true for back-compat
                    // ����HTML��˵��documentElement��<html>��ǩ��Ӧ��Element����
                    // ownerDocument��document����
                    // jQuery.merge(first, second) �ϲ��ڶ����������ݵ���һ������
                    // ������Ժϲ����飬�����һ������������Ķ��󣨾���length���ԣ��������������֣���Ҳ�ǿ��Ե�
                    // �����һ�����������飬�ϲ���������飻�����һ�������Ƕ��󣬺ϲ�����Ƕ���
					// $.merge(['a','b'],['c','d']) -> ["a", "b", "c", "d"]
                    // $.merge({0:'a',length:1},['c','d']) -> {0: "a", 1: "c", 2: "d", length: 3}

                    
                    // jQuery.parseHTML(data, context, keepScripts) ��data�ַ���
                    // ת��Ϊһ�� dom Ԫ����ɵ����飬���Բ����ĵ��У����磺
                    // $.parseHTML("hello, <b>my name is</b> jQuery.") �õ� [text, b, text]
                    // $.parseHTML("<a>link</a><b>my name is</b> jQuery.") �õ� [a, b, text]
                    jQuery.merge( this, jQuery.parseHTML(
						match[1],
                        // Ĭ������� ownerDocument ���� document��Ҳ������ iframe �� contentDocument �� xml �ȵ�
						context && context.nodeType ? context.ownerDocument || context : document,
                        // true ��ʾ�����ű���ǩ
						true
					) );

					// HANDLE: $(html, props)

                    // \1�����һ��()���������
                    // �ձ�ǩû�����ݿ���ͨ�����磺
                    // '<div ></div>' �õ�  ["<div ></div>", "div", index: 0, input: "<div ></div>"]
                    // '<div/>' �õ�  ["<div/>", "div", index: 0, input: "<div/>"]
                    // �������Ի������ӽڵ���ַ���������ͨ������ƥ�䣬����null
                    // �� '<div id="d"></div>'��'<div>text</div>'��ƥ�䲻�ɹ�
                    // rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/
                    
                    // ����ǵ����ձ�ǩ�����ҵڶ��������Ƕ��󣬲��ⴴ����ǩ��������ǩ�������
                    // �� $('<li>',{title:'hello',html:'world'})
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {
							// Properties of context are called as methods if possible
                            // �������� html ����һ������
							if ( jQuery.isFunction( this[ match ] ) ) {
                                // this[html]('world')
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
                            // ��ͨ���ԣ����������
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
                // $(#id)
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
                    // ��ݮ 4.6 �¿�¡�ڵ㣬����ֽڵ㲻����ȴ���ǿ���ͨ��document.getElementById�ҵ�
                    // ˫���жϿ��Ա����������
					if ( elem && elem.parentNode ) {
						// Inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
            // $('div'), $('.cls'), $('div + p span > a[title="hi"]') ��û�� context ���
            // ���� context �� jQ ���� $('ul',$(document)) -> $(document).find('ul')
			} else if ( !context || context.jquery ) {
                // document.find( selector )
                // $(document).find( selector )
                // find ����� sizzle �������ѡ����
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
            // $('ul',document) -> $(document).find('ul')
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
        // $(document) ���֣�������ԭ���ڵ�
        // �ڵ�϶��� nodeType ����
		} else if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
        // $(function(){}) ��ͬ�ڣ�
        // $(document).ready(function(){})
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

        // $({selector:'div'}) -> [Object, selector: "div", context: undefined]
        // Object �� ������������� this ��jQuery.makeArray( selector, this )
		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}
        
        // jQuery.makeArray(['a','b'],{length:0})  -> {0: "a", 1: "b", length: 2}
        // jQuery.makeArray({length:0},['a','b']) -> ["a", "b"]
        // jQuery.makeArray( {selector:'div'}, $()) -> [Object]
        // ǰ�߶����� return �ˣ�������ʣ�µ����
        // jQuery.makeArray ��ʱ�᷵�����飬��ʱ�᷵�ض����Ӳ�������
		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
    // �洢ѡ���ַ���
	selector: "",

	// The default length of a jQuery object is 0
    // this ����ĳ���
	length: 0,

    // ת���飬ԭ��Ԫ����ɵ�����
    // $('div') -> { 0: div, 1:div, 2:div, length:3}
    // $('div').toArray() -> [div, div, div]
	toArray: function() {
		return core_slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
    // תԭ������
    // $('div').get(0).innerHTML = 'txt';
    // û�в��������൱�� toArray������в������ͷ���һ��ԭ��Ԫ��
    // û�в������� undefined == null������ null == null
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
    // JQ �������ջ 
    // $('div').pushStack($('span')).css('background','red') -> span�������
    // $('div').pushStack($('span')).css('background','red').end().css('background','green') -> span������� div��������
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
        // jQuery.merge( $(), elems )
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
    // �������� 
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

    // DOM ���صĽӿ�
    /*
    $(document).ready(function($){
        // �ص�,����$ΪjQuery����
    });
    $(function($){
        // �����ϱ�������ʽ�Ŀ�ݷ�ʽ����
    });
    $("#id").ready(function($){
        // ���ַ�ʽ����һ�ֱ�����һ���ģ�
        // �����Ǵ��� #id ����ڵ� ready ��ʱ�򴥷�
    })

    $(document).ready(fn)��$("#id").ready(fn) �ȶ����ã�
    jQuery.ready.promise().done( fn );

    */
	ready: function( fn ) {
		// Add the callback
		jQuery.ready.promise().done( fn );

		return this;
	},

    // ���ϵĽ�ȡ
    // $('div').slice(1,3).css('background','green') -> ����2��3��div��������
	slice: function() {
		return this.pushStack( core_slice.apply( this, arguments ) );
	},


    // ���ϵĵ�һ��
    // $('div').first().css('background','red')
	first: function() {
		return this.eq( 0 );
	},

    // ���������һ��
    // $('div').last().css('background','red')
	last: function() {
		return this.eq( -1 );
	},

    // ���ϵ�ָ����
    // $('div').eq(2).css('background','red')
	eq: function( i ) {
		var len = this.length,
        // i < 0  -> j = len + i;
        // i >= 0 -> j = i;
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
	},

    /*
    var arr = ['a','b','c'];
    arr = $.map(arr, function(elem,i){
        return elem + i;
    })
    arr -> ['a1','b2','c3']
    */

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

    // ��ջ
	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
    // �����������ڲ�ʹ�ã������鷽����������JQ����
	push: core_push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;




// ��չ����
// ��ֻдһ������������������ʱ����JQ����չ�������ʽ 
/*
 $.extend({
    f1:function(){},
    f2:function(){}
 })
 */

// ��д�������������������ʱ�򣬺���Ķ�������չ����һ��������
/*
 var a = {};
 $.extend(a, { name : 'hello'}, { age : 30});

 a -> { name : 'hello', age : 30}
 */

// ��һ������Ϊ true ��ʾ�����Ĭ����ǳ����
/*
 var a = {};
 var b = { name : { age : 30 }};
 $.extend(a, b);
 a.name.age = 20; �ᵼ�� b.name.age Ҳ���20

 ��������  $.extend(true, a, b); a �� b ֮��Ͳ������໥Ӱ����
 */
jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
    // ��һ�������ǲ���ֵ�������Ƿ������
    // ��һ�������ǲ���ֵ����Ŀ����Ȼ���ǵڶ���������
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
    // ���Ŀ�겻�Ƕ���Ҳ���Ǻ�������ô����ǿ�Ƹĳɶ��� 
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
    // ��չ������ ��ֻ��һ��������������
    // �����һ�������ǲ���ֵ����ô���⻹��һ����������������
    // �����һ���������Ƕ�������������ô��ֻ����һ������
	if ( length === i ) {
		target = this;
		--i;
	}

    // ������������������������Ĳ�������չ����һ��������������
	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
        // typeof null === "object" ,�����ܵ�������ǣ����ﻹ�ǻ���˵�
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
                // ��ֹѭ������
                /*
                eg: var a = {};
                    $.extend(a, {name : a});
                 */
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
                // ��������� copy ��ֵ����Ϊnull��,���� copy �Ƕ��������
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
                    // copy ������
					if ( copyIsArray ) {
						copyIsArray = false;
                        /*
                        var a = { name : { job : 'it'}};
                        var b = { name : { age : 30 }};
                        $.extend(true, a ,b);
                        a -> { name : { job : 'it', age : 30}}
                         */
                        // a �� b ��ͬ������ʱ����Ӧ��ʱ���ǣ���Ӧ�������
                        // ���ԣ������ src ��ֵ������£���Ӧ�ñ�����Ϊ []
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
                    // �ݹ�
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
                // undefined ֵ�ᶪ��
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

// jQ ���õ��ǿ����̳У�������ʽ�̳У�ԭ�ͼ̳е�

// ��չ���߷���
jQuery.extend({
	// Unique for each copy of jQuery on the page
    // ����Ψһ��JQ�ַ������ڲ��� 
    // jQuery20334787237964723 (�������滻Ϊ��)
	expando: "jQuery" + ( core_version + Math.random() ).replace( /\D/g, "" ),

    // ��ֹ��ͻ
    /*
    �� �ȼ��� jq ���룬Ȼ���ض��� $ ����
    var jQ = $.noConflict();
    var $ = 123;

    jQ(function(){
        // doSomething
    });

    �� �ȶ��� $ ������jQuery ������Ȼ����� jq ����
    var $ = 123;
    var jQuery = 456;
    <script src="jquery-2.0.3.js"></script>

    var jQ = $.noConflict();
    jQ(function(){
        // doSomething
    });

    �� ��ʵ��� �� Ҳ���Կ����� �ڣ�ֻ���������� jQuery ֮ǰ�� $ �� jQuery ���� undefined
     */
    

    // deep Ϊtrue �Ż�� jQuery ��������֮ǰ����� 456�����򲻸�
	noConflict: function( deep ) {
        // �� script ��ǩ���� jquery ��󣬾ͻ�� jQuery ���󸳸���window.$
        // ���ԣ����� jQuery ���������� true
		if ( window.$ === jQuery ) {
            // �ó� $ ����window.$ = 123
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
    // DOM�����Ƿ���ɣ��ڲ��� 
    /*
    �� $(function(){}); �൱�� $(document).ready(function(){});
    DOM ������ִ�������������
    ��DOM ������ᴥ�� DOMContentLoaded �¼���

    $(fn); 
    �൱�ڵ��ã�
    $(document).ready(fn);
    �൱�ڵ��ã�
    $().ready(fn);
    �൱�ڣ�
    jQuery.ready.promise().done(fn);


    jQuery.ready.promise() ������һ���ӳٶ���

    ������� $.ready()

    Ȼ���������� readyList.resolveWith(document,[jQuery]) (����ɣ����Դ��� fn ��)



    �� window.onload = function(){};
    ҳ��������Դ������ִ�������������

    ���� <img src="">
    dom ����ֻ�ǲ��� img ��ǩ�����ڱ�ǩ�����Բ��ܣ��� onload Ҫ�� src ����ָ���ͼƬ����Դ�������ꡣ
     */
    
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
    // �ȴ������ļ��ļ��������ڲ��� 
	readyWait: 1,

	// Hold (or release) the ready event
    // �Ƴ�DOM���� 
    /*
    $(fn) ������ dom �����꣬��� fn �����ͻ�ִ��
    ���ǣ�$.holdReady(true) �᲻�� fn ִ��

    ������
    $.getScript('a.js',function(){
    
    });
    $(function(){
        alert(1)
    });

    �����ܿ�����ִ������� alert(1)���������첽���ص� a.js

    ��������� a.js ��ִ�У��Ǿ���ôд��

    $.holdReady(true) //��ס

    $.getScript('a.js',function(){
        $.holdReady(false) // �ͷ�
    });
    $(function(){
        alert(1)
    });

    �������ܱ�֤��ִ�� a.js����ִ�� alert(1)

    �������ļ����ǾͶ�ε��� $.holdReady(true) ��ס��Ȼ���ε���$.holdReady(false) �ͷ�
     */
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
    // ׼��DOM���� 
    // ��� ready �ǹ��߷�����$.ready������ʵ������ $().ready
    /*
    ready ��ʵ��һ��Ϊ�գ��� undefined��
    ֻ�� holdReady �����е���ʱΪ true��jQuery.ready( true );
    */
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
        // wait Ϊ true ʱ���� jQuery.readyWait ��Ϊ 0��˵����ס��û���ͷţ�����������ִ�У�
        // wait Ϊ false ʱ���� jQuery.isReady Ϊ�棬˵�� dom �Ѿ��������ˣ�Ҳ����������ִ��
        // jQuery.isReady Ĭ��Ϊ false
        /*
        ��  wait === true ˵����ready ������ holdReady ��ס�ˣ������������һ����ס��
            ��������󣬷��ֻ�����ס״̬���Ͳ��ܼ�����������
        ��  wait !== true��һ������¶������������ isReady �� true�����أ�
        ��  wait !== true��isReady �� false��������
        */
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
        //  ��� dom �Ѿ�������
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
        // ��  wait !== true��isReady �� false�������ߣ��ߵ��ⷢ�� jQuery.readyWait ���� 0�����ǵ÷���
        // �����ף�һ��Ҫ�ȵ� jQuery.readyWait Ϊ 0 ���ܼ��������ߣ������ص���������
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
        /* 
        ���ʹ�ô�ִ�еĻص������� this ָ�� document����һ��ʵ��ָ�� jQuery 
        ���磺
        $(function(arg){
            console.log(this);  // document
            console.log(arg);   // jQuery
        });
        */
        // �����ص�����
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
        /*
        �������д����
        $(document).on('ready',function(){
            // code
        })

        ����Ҳ���Կ������ְ󶨷�ʽ��ִ��˳��
        
        �� $(document).on('ready',fn2);
        �� $(document).ready(fn1);

        fn1 ��� fn2 �ȴ���
         */
		if ( jQuery.fn.trigger ) {
			jQuery( document ).trigger("ready").off("ready");
		}
	},


    /*
    �ܽ�һ�£�
    jQuery �е� dom �����괥�����������ַ�����
    �� $(fn);
    �� $(document).ready(fn)
    �� $(document).on('ready',fn)
     */

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
    /*
    ie �£���Щ������һ���᷵�� true���� alert
    typeof alert  
    // �� ie �·��� 'object'�������� 'function'
     */ 
    // �Ƿ�Ϊ������������������ж����еĺ��������� alert��Ҫ��׼���ж����к��������Ը�������ע��(#2968)ȥ jQuery ��������
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

    // �Ƿ�Ϊ���飬jQuery 2.0.3 ֧�� ie8 �����������ԭ���� Array.isArray ����
    // ԭ������Ч�ʸߣ�����ԭ��������ԭ���ķ���
	isArray: Array.isArray,

    // �Ƿ�Ϊ window
    /*
    ����д���Ǻ��Ͻ���
    ������
    var a = {};
    a.window = a;
    console.log(a === a.window); // true

    ��Ȼ�ˣ�Ҳ����˵ jQuery ����д�����ԣ��Ͼ� jQuery û��˵�������ж��ϸ������ϵ� window�������ճ���Ҫ������
     */
	isWindow: function( obj ) {
        // obj ���� undefined ��Ҳ���� null
		return obj != null && obj === obj.window;
	},

    // �Ƿ�Ϊ����
	isNumeric: function( obj ) {
        // typeof 123 -> "number"
        // typeof NaN -> "number"
        // parseFloat(null) -> NaN
        // parseFloat(NaN) -> NaN
        // ��Ϊ NaN����������
        /*
        isFinite(123)  // true
        isFinite(Number.MAX_VALUE)  // true
        isFinite(Number.MAX_VALUE + Number.MAX_VALUE)  // �������Χ�ˣ�false
         
        Number.MAX_VALUE -> 1.7976931348623157e+308
        Number.MAX_VALUE +1 -> 1.7976931348623157e+308

        Number.MAX_VALUE + Number.MAX_VALUE -> Infinity
         */
        
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},

    // �ж���������
	type: function( obj ) {
        // $.type(undefined) -> 'undefined'
        // $.type(null) -> 'null'
		if ( obj == null ) {
			return String( obj );
		}
        // core_toString = {}.toString
        // {}.toString === Object.prototype.toString
		// Support: Safari <= 5.1 (functionish RegExp)
        // Safari <= 5.1 typeof ��������᷵�� "function"������������Ϊ "object"
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ core_toString.call(obj) ] || "object" :
			typeof obj;

        /*
        jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
            class2type[ "[object " + name + "]" ] = name.toLowerCase();
        });

        $.type([]) -> class2type[ core_toString.call(obj) ] -> class2type['object Array'] -> 'array'
        $.type(Date) -> 'date'
         */
	},

    // �Ƿ�Ϊ����������
    /*
    var obj = {};
    $.isPlainObject(obj) // true

    var obj = {name : 'hello'};
    $.isPlainObject(obj) // true

    var obj = new Object();
    $.isPlainObject(obj) // true
     */
    }
	isPlainObject: function( obj ) {
		// Not plain objects:
		// - Any object or value whose internal [[Class]] property is not "[object Object]"
		// - DOM nodes
		// - window
        // �� "object" ,DOM �ڵ�, window �ų�
		if ( jQuery.type( obj ) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		// Support: Firefox <20
		// The try/catch suppresses exceptions thrown when attempting to access
		// the "constructor" property of certain host objects, ie. |window.location|
		// https://bugzilla.mozilla.org/show_bug.cgi?id=814622
        /*
        core_hasOwn = {}.hasOwnProperty
         */ 
        // try catch Ϊ�˼��� Firefox <20 ��bug���ᱨ������ false
		try {
			if ( obj.constructor &&
					!core_hasOwn.call( obj.constructor.prototype, "isPrototypeOf" ) ) {
                // !{}.hasOwnProperty.call(obj.constructor.prototype, "isPrototypeOf")
                // Object.prototype �������� "isPrototypeOf"
                // �����Ķ����Ǽ̳���
				return false;
			}
		} catch ( e ) {
			return false;
		}

		// If the function hasn't returned already, we're confident that
		// |obj| is a plain object, created by {} or constructed with new Object
		return true;
	},

    // �Ƿ�Ϊ�ն���
    /*
    isEmptyObject({name:'hello'})  // �п�ö������ false

    isEmptyObject({})  // û��ö������ true
    isEmptyObject([])  // û��ö������ true
     */
	isEmptyObject: function( obj ) {
		var name;
        // for in ֻ���ҵ���ö�ٵ�����(����������Ļ��Ǽ̳е�)
		for ( name in obj ) {
			return false;
		}
		return true;
	},

    // �׳��쳣
	error: function( msg ) {
		throw new Error( msg );
	},

	// data: string of html
	// context (optional): If specified, the fragment will be created in this context, defaults to document
	// keepScripts (optional): If true, will include scripts passed in the html string
	// data��html �ַ���
    // context����ѡ��fragment ���� context �ﴴ�������û��ָ�� context��Ĭ���� document
    // keepScripts����ѡ�����Ϊ true���ͻ���� data �еĽű�
    // �����ڵ�
    /*
    var str = '<li></li><li></li>';
    $.parseHTML(str) -> [li, li]

    var str = '<li></li><li></li><script></script>';
    $.parseHTML(str, document, false) -> [li, li] ����������Ϊ false ,����� script ��ǩ

    var str = '<li></li><li></li><script></script>';
    $.parseHTML(str, document, true) -> [li, li, script] ����������Ϊ true ,��� script ��ǩ
    

    �������ǩ $('<li>') ���� $('<li></li>') -> $.parseHTML() -> context.createElement( parsed[1] )
    ������ǩ $('<li></li><li></li>') -> $.parseHTML() -> jQuery.buildFragment( [ data ], context, scripts )
     */
    parseHTML: function( data, context, keepScripts ) {
        // ���ǡ��ַ��������ߡ����ַ������ͷ���
		if ( !data || typeof data !== "string" ) {
			return null;
		}
        // ����ڶ�������Ϊ����ֵ��û��ִ��������
		if ( typeof context === "boolean" ) {
			keepScripts = context;
			context = false;
		}
		context = context || document;
        
        // rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/
        // eg��rsingleTag.exec('<div></div>')
        // �����["<div></div>", "div", index: 0, input: "<div></div>"]
        // rsingleTag ƥ�䲻���κ�������û���κ��ӽڵ��html�ṹ
        // ������ǩ
		var parsed = rsingleTag.exec( data ),
			scripts = !keepScripts && [];

		// Single tag
        // ���ƥ�䵽�˿յ�Ԫ�ر�ǩ������div���򴴽�һ��divԪ�أ���������
		if ( parsed ) {
			return [ context.createElement( parsed[1] ) ];
		}

        // û��ƥ�䵽�յ�Ԫ�ر�ǩ���Ƚϸ��ӵ�htmlƬ�Σ����Ѵ����dataתΪ�ĵ���Ƭ���洢��jQuery.fragments���������
		// ͨ�� buildFragment ��������һ���µ�divԪ�أ������data����Ϊ���div��innerHTML
        // ���������ﲻ����ȫ����data�������һЩ��Ҫ�Ĺ���
        //���磬���˵� html/title/head �ȱ�ǩ���ͱպ�û�бպϵı�ǩ�Ȳ������� <span /> ��� <span ></span>��
        parsed = jQuery.buildFragment( [ data ], context, scripts );

        /*
        ��� keepScripts Ϊ true���� scripts ���� false���� scripts �Ͳ��ᱻɾ��
        ��� keepScripts Ϊ false���� scripts ���� []��scripts �ᱻɾ��
         */
		if ( scripts ) {
			jQuery( scripts ).remove();
		}

        // ת������
		return jQuery.merge( [], parsed.childNodes );
	},

    // ����JSON���ַ���ת�������� json
    /*
    eg:
    var str = '{"name":"hello"}'; // �ϸ�ģʽ��json�ַ���
    var obj = $.parseJSON(str);  // ת��json�ṹ
     */
	parseJSON: JSON.parse,  // ie8 ���ϰ汾֧��

    // JSON.stringify() �� json ת���ַ��� 

	// Cross-browser xml parsing
    // ����XML 
    /*
    <p id="someElement"></p>
    <p id="anotherElement"></p>
     
    <script>
    var xml = "<rss version='2.0'><channel><title>RSS Title</title></channel></rss>",
      xmlDoc = $.parseXML( xml ),
      $xml = $( xmlDoc ),
      $title = $xml.find( "title" );
     
    // Append "RSS Title" to #someElement
    $( "#someElement" ).append( $title.text() );
     
    // Change the title to "XML Title"
    $title.text( "XML Title" );
     
    // Append "XML Title" to #anotherElement
    $( "#anotherElement" ).append( $title.text() );
    </script>
     */
	parseXML: function( data ) {
		var xml, tmp;
        // �������ַ���������������
		if ( !data || typeof data !== "string" ) {
			return null;
		}

		// Support: IE9
		try {
			tmp = new DOMParser(); // ie8 ����֧��
			xml = tmp.parseFromString( data , "text/xml" ); // �õ�XML�ĵ�����
		} catch ( e ) {
			xml = undefined;
		}
        // ����ַ�������������XML�������ǩû�պϣ����� xml ��ʽ��ie9 �»ᱨ��������������������ǻ��� parsererror �ڵ㣩

		if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

    // �պ���
	noop: function() {},

	// Evaluates a script in a global context
    // ȫ�ֽ���js 
    /*
    function test() {
      jQuery.globalEval( "var newVar = true;" )
    }
    test();
    // newVar === true  ȫ�ֱ���
     */
    // ���� code ���ַ���
	globalEval: function( code ) {
		var script,
				indirect = eval;

		code = jQuery.trim( code );

		if ( code ) {
			// If the code includes a valid, prologue position
			// strict mode pragma, execute code by injecting a
			// script tag into the document.
            // �ϸ�ģʽ�²�֧�� eval
			if ( code.indexOf("use strict") === 1 ) {
				script = document.createElement("script");
				script.text = code;
				document.head.appendChild( script ).parentNode.removeChild( script );
            // һ��������� eval
            /*
            �� �ں������ӡ a
            function test(){
                eval('var a = 1');
                cosnsole.log(a)
            }
            test(); // 1

            �� �ں������ӡ a
            function test(){
                eval('var a = 1');
            }
            test(); 
            cosnsole.log(a) // �����Ҳ��� a
            
            �� eval ���� window.eval �Ϳ����ҵ���
            function test(){
                window.eval('var a = 1');
            }
            test(); 
            cosnsole.log(a) // 1���ҵ��� a

            �� �� eval ��ֵ��һ��������Ҳ�����ҵ� a
            function test(){
                var val = eval;    
                // �൱�� val = window.eval;
                val('var a = 1');
            }
            test(); 
            cosnsole.log(a) // 1���ҵ��� a

            Ϊʲô��������
            ��1��eval() �ں�����ִ�д����ֻ�����������ã���ȫ��ִ�оͿ���ȫ�ַ�Χ�����ã�
            ��2�������������� window ���������������ۺ����ﻹ��ȫ�ֻ���ִ�У����붼��ȫ�ַ�Χ�������á�
             */
			} else {
			// Otherwise, avoid the DOM node creation, insertion
			// and removal by using an indirect global eval
            // ���ﲻ��ֱ��д eval(code)������ code ֻ���ھֲ�������
				indirect( code );
			}
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
    // ת�շ� 
    /*
    һ�㶼��������
    margin-top -> marginTop
    -moz-transform -> MozTransform
    -webkit-transform -> WebkitTransform

    ie ��ǰ׺ -ms- �Ǹ�����(��һ����ĸҪСд)���õ�������
    -ms-transform -> msTransform

    rmsPrefix = /^-ms-/,
    rdashAlpha = /-([\da-z])/gi

    // �ѵ�һ��С����ƥ�������ת���ɴ�д�����л���-��ĵ�һ����ĸת�ɴ�д
    fcamelCase = function( all, letter ) {
        return letter.toUpperCase();
    },
     */
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

    /*
    $.nodeName(document.documentElement, 'html') // true
     */
    // �Ƿ�Ϊָ���ڵ������ڲ���
	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	
    // �������� 
    /*
    var arr = ['a','b','c','d'];
    $.each(arr, function(i, value){
        // i ������ 0��1��2 ...
        // value ��Ԫ�� 'a','b','c' ...
    });

    var json = ['name','hello','age',20];
    $.each(arr, function(i, value){
        // i �� key 'name', 'age' ...
        // value ��Ԫ�� 'hello', 20 ...
    });
     */
    // args is for internal usage only 
    // ���������������ڲ�ʹ��
	each: function( obj, callback, args ) {
		var value,
			i = 0,
			length = obj.length,
			isArray = isArraylike( obj ); // �Ƿ��������飬�������飨jq����Ҳ�������飬��length�����������±꣩

        // �ڲ�ʹ��
		if ( args ) {
            // ���顢�������� for ѭ��
			if ( isArray ) {
				for ( ; i < length; i++ ) {
                    // callback ��� this ָ�� obj[ i ]�������̶�Ϊ args
					value = callback.apply( obj[ i ], args );
                    /*
                    �ٸ����ӣ�
                    var bd = $('body');
                    
                    console.log(bd) 
                    // [body, prevObject: init(1), context: document, selector: "body"]

                    console.log(bd.length)
                    // 1

                    ���ԣ������ value = callback.apply( obj[ i ], args )
                    ��ʵ���� value = callback.apply( body, args )

                    ���ѡȡ���Ԫ�أ����� $('p') �������֣�
                    var ps = $('p');

                    console.log(ps) 
                    // [p, p, prevObject: init(1), context: document, selector: "p"]
                    
                    console.log(ps.length)
                    // 2
                    
                    �ǾͶ�ÿ�� p Ԫ��ִ�� callback ����

                    */

					if ( value === false ) {
						break;
					}
				}
            // json ������ for in ѭ��
			} else {
				for ( i in obj ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
        // һ��ʹ��
		} else {
            // ���飬�������� for ѭ��
			if ( isArray ) {
				for ( ; i < length; i++ ) {
                    // callback ��� this ָ�� obj[ i ]����һ���������ֱ�Ϊ i, obj[ i ]
					value = callback.call( obj[ i ], i, obj[ i ] );

                    // ����ص�����ִ�й����з����� false���Ͳ���������ѭ����
                    /*
                    eg:
                    $.each(arr, function(i, value){
                        // i �� key 'name', 'age' ...
                        // value ��Ԫ�� 'hello', 20 ...
                        // code
                        return false;
                    });
                    ��Ϊ���ﷵ��ֵ�� false�����Բ���ѭ�� length ��ô��Σ�ִ�� 1 �ξ���ֹѭ����
                     */
					if ( value === false ) {
						break;
					}
				}
            // json ������ for in ѭ��
			} else {
				for ( i in obj ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},

    // ȥ��ǰ��ո�
    /*
    var str = '  hello '
    str = $.trim(str);
    // 'hello'
     */
	trim: function( text ) {
        // undefined null -> ""
        // core_trim = core_version.trim
        // ��ԭ���� trim ����
		return text == null ? "" : core_trim.call( text );
	},

	
    // ������ת������ 
    /*
    �� ����Ϊ������
    var divs = document.getElementsByTagName('div');
    $.makeArray(divs);
    // [div, div, div]

    �� ����Ϊ�ַ��������ֵȻ�������Ҳ����ת
    var str = "hello";
    $.makeArray(str);
    // ["hello"]

    �� �������һ�������������ڲ�ʹ��
    var str = 123;
    $.makeArray(str, {length:0});
    // { 0:123, length:1 }
     */
    
    // results is for internal usage only
    // �ڶ������������ڲ�ʹ�ã�Ϊ�� length ���Ե��������
	makeArray: function( arr, results ) {
		var ret = results || [];

        // ��Ϊ null����Ϊ undefined
		if ( arr != null ) {
            // isArraylike ����ֻ���Ƕ����� Object(123) ת�ɰ�װ���󣬲��������飬Ȼ���ߵ� else
            // �ַ��� "hi" ���� length ���ԣ�Object('hi') {0: "h", 1: "i", length: 2, [[PrimitiveValue]]: "hi"}
			if ( isArraylike( Object(arr) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
            // Object(123) {[[PrimitiveValue]]: 123} ������
			} else {
                // core_push = [].push
				core_push.call( ret, arr );
			}
		}

		return ret;
	},

    // ����� indexOf
    /*
    var arr = ['a','b','c','d'];
    $.inArray('b', arr);
    // 1

    $.inArray('z', arr);
    // -1
     */
	inArray: function( elem, arr, i ) {
        // core_indexOf = [].indexOf ԭ�������鷽��, i ��ʾ������ʼλ�ã���ѡ
		return arr == null ? -1 : core_indexOf.call( arr, elem, i );
	},

    // �ڶ����������Ԫ�غϲ�����һ��������
	merge: function( first, second ) {
		var l = second.length,
			i = first.length,
			j = 0;

        // l ������ʱ�����Ը��� l ���������� second
		if ( typeof l === "number" ) {
			for ( ; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}
        // l ��������ʱ���Ǿ͸��������� j++ ������ second
		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

        // ѭ������������ length ����
		first.length = i;

		return first;
	},

    // ���˵õ�������
    /*
    �� �� 2 ��������
    var arr = [1, 2, 3, 4];
    arr = $.grep( arr, function(value, i){
        // value ΪԪ��
        // i Ϊ������key
        return value > 2;
    });

    arr // [3, 4]

    �� �� 3 ��������
    var arr = [1, 2, 3, 4];
    arr = $.grep( arr, function(value, i){
        // value ΪԪ��
        // i Ϊ������key
        return value > 2;
    }, true);

    arr // [1, 2] ������õ��෴�Ľ��
     */
	grep: function( elems, callback, inv ) {
		var retVal,
			ret = [],
			i = 0,
			length = elems.length;
        // ǿ�ưѵ���������ת�ɲ���ֵ
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
            // ����ִ�н��ǿ��ת�ɲ���ֵ
            // ��� inv Ϊ�棬retVal ��ҪΪ�٣��Ż����ӦԪ�ش��ȥ
            // ��� inv Ϊ�٣�retVal ��ҪΪ�棬�Ż����ӦԪ�ش��ȥ
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

    // ӳ��������
    /*
    var arr = [1,2,3,4];
    arr = $.map(arr , function(n){
        return n + 1;
    });
    arr // [2,3,4,5]
     */ 
    
    // arg is for internal usage only
    // ƽʱ����ֻ��2��������������������������ʹ��
	map: function( elems, callback, arg ) {
		var value,
			i = 0,
			length = elems.length,
			isArray = isArraylike( elems ),
			ret = [];

		// Go through the array, translating each of the items to their
        // �������� for ѭ��
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
        // ������ for in ѭ��
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
        /*
        ֮���Բ�ֱ�ӷ��� ret����Ϊ�˱����ά��������
        eg:
        var arr = [1,2,3,4];
        arr = $.map(arr , function(n){
            return [n + 1];
        });
        arr // ���� [2,3,4,5]����ô������

        [1].concat([[2]])
        // [1,[2]]

		[].concat.apply([],[[2]])
		// [2]

        apply �����ĵڶ�������Ϊ���飬ʵ���õ�ʱ��ز𿪳ɵ�����Ԫ�أ����Ծͱ����˶�ά��������
         */
		return core_concat.apply( [], ret );
	},

	// A global GUID counter for objects
    // Ψһ��ʶ�����ڲ��� 
    /*
    <input type="buttom" value="���">
    <input type="buttom" value="ȡ����">

    function show(){
        console.log(this)
    }
    $('input:eq(0)').click(show); // ��ӡ"���"��ť

    // �ڶ�����ť�����ȡ����һ����ť�󶨵��¼�
    $('input:eq(0)').click(function(){
        $('input:eq(0)').off();
    });
     */
    }
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
    // �� this ָ�� 
    /*
    �� ������������
    function show(){
        return this;
    }

    shwo(); // window

    $.proxy(show,document)();  // document

    �� ����������
    function show(n1,n2){
        console.log(n1,n2);
        return this;
    }

    $.proxy(show,document,3,4)();
    $.proxy(show,document)(3,4);
    $.proxy(show,document,3)(4);
    // �����ַ�ʽ�����ӡ 3��4�������� document
     */
	proxy: function( fn, context ) {
		var tmp, args, proxy;

        /*
        var obj = {
            show : function(){
                console.log(this);
            }
        };
        $(document).click( obj.show ); // document
        $(document).click( $.proxy(obj.show, obj) ); // obj
        $(document).click( $.proxy(obj, 'show') );   // obj
         */
        
        /*
        $.proxy(obj, 'show') ������ʽ��

        context = obj;   // �� this ����ָ���һ������
        fn = obj['show'] // ��ִ�к���

        �൱�ڣ� $.proxy(obj['show'], obj)
         */
		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		// ȷ�� fn �Ǻ���
        if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
        // ����д�������� bind����ȥǰ���������������Ķ���Ĳ����ͷ��ص��º��� f ��ʵ�κϲ���һ����Ϊ f ��ʵ��
		args = core_slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( core_slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		// ��� fn.guid ���ڣ���ô fn.guid ��ֵ�� proxy.guid��
        // ��� fn.guid �����ڣ���ô jQuery.guid++������ֵ�� fn.guid �� proxy.guid
        proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
    /*
	access �������ã�set/get ����ֵ���� css��attr��text �ȷ���������ɲ�ͬ�ľ��幦��

	�� attr ����Ϊ����
	attr: function( name, value ) {
		return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
	}
	�� elems ָ jquery ʵ�������� this
	�� fn ָ�������� jQuery.attr
	�� key ָ���������� title
	�� value ָ����ֵ���� 'str'
	�� chainable �Ƿ���ʽִ�С�
	   a. true ��ʾ set ���ԣ����ص�ǰ������Ҫ��ʽִ��
	   b. false ��ʾ get ���ԣ�һ�㷵���ַ��������ֵȻ������ͣ�������ʽִ��
	�� emptyGet, raw ��û���Ĳ������� undefined
     */
    access: function( elems, fn, key, value, chainable, emptyGet, raw ) {
		var i = 0,
			length = elems.length,
			bulk = key == null;
            /*
             key Ϊ undefined �� null ,bulk Ϊ true;
             ���������bulk Ϊ false;
            */
            

		// Sets many values
        // $('#div1').css({'background':'green',width:'300px'}) ����
		if ( jQuery.type( key ) === "object" ) {
            // ����ֵ���ض�������
			chainable = true;
            // �ݹ�
			for ( i in key ) {
				jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
			}

		// Sets one value
        // �� value��Ҳ������
		} else if ( value !== undefined ) {
            // �ֶ���ʶ����
			chainable = true;

            // value ���Ǻ�����ʱ�򣬱����ַ��� 'green'��raw Ϊ true;
			if ( !jQuery.isFunction( value ) ) {
				raw = true;
			}

            // û��ָ�� key ��ʱ��
			if ( bulk ) {
				// Bulk operations run against the entire set
				/*
				�� value ���Ǻ�����ʱ��raw ǿ��Ϊ true
				�� value �Ǻ�����ʱ����� raw �������ǡ��桿��Ҳ������
				*/
				if ( raw ) {
					fn.call( elems, value );
					fn = null;

				// ...except when executing function values
                // value �Ǻ��������� raw ԭ����Ϊ�� ������ fn
				} else {
					bulk = fn;
					fn = function( elem, key, value ) {
						return bulk.call( jQuery( elem ), value );
					};
				}
			}

            /*
			fn Ϊ�棬˵����
			�� ָ���� key ֵ��fn ���Ǵ���� fn
			�� fn ��������ģ���Ϊԭ���� fn = null
			*/
			if ( fn ) {
				for ( ; i < length; i++ ) {
                    /*
					�� raw Ϊ���桿������ fn ��Ϊ���١���˵�� bulk Ϊ���١���Ҳ������ key ֵ
					�� raw Ϊ���١���˵�� value һ���Ǻ�����Ҫ��Ȼ�ᱻǿ�Ƹĳɡ��桿��
					�� fn( elems[i], key, value.call( elems[i], i, fn( elems[i], key ) ) );
					   value ��������� fn ������fn �����ֻ���� value �������������������ѭ������ʵ������
					   a. ����ִ�� fn( elems[i], key )
					      -> tmp = bulk.call( jQuery( elems[i] ), undefined )
					   b. Ȼ�� tmp = value.call( elems[i], i, tmp )
					   c. ��� fn( elems[i], key, tmp )
					      -> bulk.call( jQuery( elems[i] ), tmp ) 
                    */
					fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
				}
			}
		}

        // chainable Ϊ�棬˵�������ã������޸ĺõ�Ԫ��
        // ��ȡ��ʱ��
        // ���û��keyֵ��fn.call( elems )
        // �����keyֵ��������Ԫ�أ��ڵ�һ��Ԫ���ϻ�ȡ�����򷵻� emptyGet��undefined��
		/*
		�� chainable Ϊ���桿��˵�������ã�ǰ���Ѿ��� fn ������� elems������ֱ�ӷ��� elems �ͺ���
		�� chainable Ϊ���١�
		   a. bulk Ϊ���桿��˵����û�� key ֵ��ִ�� fn.call( elems )
		   b. bulk Ϊ���١���˵���� key ֵ
		      �����ǰ jQuery �����г��ȣ���һ��Ԫ����ִ�� fn( elems[0], key )
			  �����ǰ jQuery ����û�г��ȣ����� emptyGet
		*/
		return chainable ?
			elems :

			// Gets
			bulk ?
				fn.call( elems ) :
				length ? fn( elems[0], key ) : emptyGet;
	},

    // ��ǰʱ��
    // 1499526895632
    // +new Date() === Date.now()  // true
    // (new Date()).getTime() === Date.now()  // true
	now: Date.now,

	// A method for quickly swapping in/out CSS properties to get correct calculations.
	// Note: this method belongs to the css module but it's needed here for the support module.
	// If support gets modularized, this method should be moved back to the css module.
    // css ���� 
    /*
    <div id="div1" style="width:100px;height:100px;background:red">aaa</div>
    
    �� $('#div1').width() // 100

    ������������ȡ��
    �� $('#div1').get(0).offsetWidth  // 100

    ������������� div ���أ�display:none���󣬢� ���ǿ��Եõ� 100���� �� ֻ�ܵõ� 0
    
    ˼·��
    �� display:none �ĳ� display:block�������������Ϳ��Կ���Ԫ���ˣ�
    �Ǿ��ټ��� visibility:hidden������������Ȼ��������������ռ�����׿ռ䣬
    �Ǿ��ټ��� position:absolute

    ��ȡ��ֵ���ٰ���ʽ�Ļ�ȥ
     */
	swap: function( elem, options, callback, args ) {
		var ret, name,
			old = {};

		// Remember the old values, and insert the new ones
		for ( name in options ) {
            // ԭ���������ȴ�����
			old[ name ] = elem.style[ name ];
            // ���µ�����
			elem.style[ name ] = options[ name ];
		}

        // ���л�ȡ���ԵȲ���
		ret = callback.apply( elem, args || [] );

		// Revert the old values
        // �ָ�ԭ��������
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}

		return ret;
	}
});

jQuery.ready.promise = function( obj ) {
    // ��һ��ִ�����������ʱ�� readyList ���ȫ�ֱ����� undefined�����Կ��Լ���������
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called after the browser event has already occurred.
		// we once tried to use readyState "interactive" here, but it caused issues like the one
		// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
        // dom �Ѿ����غ���
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
            // ����ӳ��Ǽ��� ie ��
			setTimeout( jQuery.ready );
        // dom û�м�����
		} else {

			// Use the handy event callback
            /*
            completed = function() {
                document.removeEventListener( "DOMContentLoaded", completed, false );
                window.removeEventListener( "load", completed, false );
                jQuery.ready();
            };
             */
            
      
            // ���������¼���һ���ȴ�������
            
            // ��������£�ֻҪ���� DOMContentLoaded �¼��ͺ���
			document.addEventListener( "DOMContentLoaded", completed, false );

			// A fallback to window.onload, that will always work
            // �е�������Ỻ���¼������ܻ��ȴ��� load
			window.addEventListener( "load", completed, false );
		}
	}
	return readyList.promise( obj );
};

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

// ���飬�����鶼���� true
function isArraylike( obj ) {
	var length = obj.length,
		type = jQuery.type( obj );

    // window ���ܻ�Ӱ��������жϣ������ȹ���֮
	if ( jQuery.isWindow( obj ) ) {
		return false;
	}

    // ʲô������ nodeType ���ԣ����� length ���Բ�Ϊ����?
	if ( obj.nodeType === 1 && length ) {
		return true;
	}

    // �����鷵�� true
    // �� length ���Եĺ�������
	return type === "array" || type !== "function" &&
		( length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj );

        // ( length === 0 || typeof length === "number" && length > 0 && ( length - 1 ) in obj );
        // �������дΪ��typeof length === "number" && length >= 0 && ( length - 1 ) in obj )
        // ֻ������0 - 1��-1 in obj �����㣬���ԣ�����õ����� length === 0 �ó���
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);
/*!
 * Sizzle CSS Selector Engine v1.9.4-pre
 * http://sizzlejs.com/
 *
 * Copyright 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-06-03
 */
(function( window, undefined ) {

var i,
	support,
	cachedruns,
	Expr,
	getText,
	isXML,
	compile,
	outermostContext,
	sortInput,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + -(new Date()),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
    // �ʷ�������Ҫ�Ļ�����
    // ���� tokenCache(key,value) ��ʽ�洢��ֵ��
	tokenCache = createCache(),
	compilerCache = createCache(),
	hasDuplicate = false,
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}
		return 0;
	},

	// General-purpose constants
	strundefined = typeof undefined,
	MAX_NEGATIVE = 1 << 31,

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf if we can't use a native one
	indexOf = arr.indexOf || function( elem ) {
		var i = 0,
			len = this.length;
		for ( ; i < len; i++ ) {
			if ( this[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
	// \x20 �ո� \t �Ʊ��  \r �س�  \n ���� \f ��ҳ
    // �ѵ���Ӧ���� "[\x20\t\r\n\f]" ��
    // ȷʵ��"[\\x20\\t\\r\\n\\f]" ����ָ�ַ��� "[\x20\t\r\n\f]"
    // ���ǣ����ֱ��д "[\x20\t\r\n\f]"���ͻ��Կո񣬻س������еȷ�����ʾ�ˣ��ⲻ��������Ҫ��
    // '\\' ��ʾ���� '\'
    // ���´����հ׷���
    whitespace = "[\\x20\\t\\r\\n\\f]",
	// http://www.w3.org/TR/css3-syntax/#characters
	characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Loosely modeled on CSS identifier characters
	// An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
	// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = characterEncoding.replace( "w", "w#" ),

	// Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
		"*(?:([*^$|!~]?=)" + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

	// Prefer arguments quoted,
	//   then not containing pseudos/brackets,
	//   then attribute selectors/non-parenthetical expressions,
	//   then anything else
	// These preferences are here to reduce the number of selectors
	//   needing tokenize in the PSEUDO preFilter
	pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace( 3, 8 ) + ")*)|.*)\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

    // /^[\x20\t\r\n\f]*,[\x20\t\r\n\f]*/
	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rsibling = new RegExp( whitespace + "*[+~]" ),
	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + characterEncoding + ")" ),
		"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
		"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rescape = /'|\\/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			// BMP codepoint
			high < 0 ?
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	};

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}


// sizzle �������ǣ�����һ��ѡ�����ַ���������һ�����Ϲ���� DOM �ڵ��б�
// ��ʵ�ڸ߼�����������ӿ��Ǵ��ڵģ�����document.querySelectorAll��
// ֻ�����ͼ��������û����ӿڣ����ԲŻ���Ҫ sizzle���css ѡ��������

//* 1�����ڵ�һѡ����������ID��Tag��Class��������֮һ����ֱ�ӻ�ȡ�����ؽ�� 
//* 2������֧��querySelectorAll�������������ͨ��ִ��querySelectorAll������ȡ������ƥ���DOMԪ�� 
//* 3������֮�������select������ȡ������ƥ���DOMԪ�� 

// context Ϊѡ��ķ�Χ
function Sizzle( selector, context, results, seed ) {
	var match, elem, m, nodeType,
		// QSA vars
		i, groups, old, nid, newContext, newSelector;

	if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
		setDocument( context );
	}

	context = context || document;
	results = results || [];

    // ���û�д���ѡ�������򣬻��߹������ַ������ͣ��򷵻�results
	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

    // Ԫ�ص� nodeType �� 1���ĵ���dom���ĸ��ڵ㣩nodeType �� 9
    // �� div,a,span,ul nodeType ���� 1��document �� nodeType �� 9
    // ���� nodeType �� 2���ı� nodeType �� 3
    // ��context�Ȳ���document��nodeType=9����Ҳ����element(nodeType=1)����ô�ͷ��ؿռ��� 
	if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
		return [];
	}

    // html �ĵ�������û�е�һƥ������� seed
	if ( documentIsHTML && !seed ) {

		// Shortcuts
        // �������и�ͬ���� rquickExpr ��������ҪŪ������
        // rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/
        // �������� 
        // #([\w-]+) ƥ�� #id   match[1]
        // (\w+) ƥ�� tag  match[2]
        // \.([\w-]+) ƥ�� .class  match[3]
     
        // �����#id�ַ�������match[1]��ȡ��id�����磺
        // selector = '#test';�õ� match��
        //  ["#test", "test", undefined, undefined, index: 0, input: "#test"]
		if ( (match = rquickExpr.exec( selector )) ) {
			// Speed-up: Sizzle("#ID")
            // ���� id ����ѡ�������� #id
			if ( (m = match[1]) ) {
                // context Ϊ document
				if ( nodeType === 9 ) {
                    // getElementById ����ֻ���� document �����ϵ��ã���ͨ��Ԫ������
					elem = context.getElementById( m );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
                    // ���� Blackberry 4.6 bug
					if ( elem && elem.parentNode ) {
						// Handle the case where IE, Opera, and Webkit return items
						// by name instead of ID
                        // �е����������� name ���أ�������id,����������ȷ��һ��
						if ( elem.id === m ) {
							results.push( elem );
							return results;
						}
                    // Ԫ��ûȡ������û�и�Ԫ�أ������
					} else {
						return results;
					}
                // Context ���� document
				} else {
					// Context is not a document
                    // Ԫ��elem���������context������Ԫ��idȷʵ����m
                    // contains ����ȷ�� elem �Ƿ��� contex ����Ԫ��
					if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
						contains( context, elem ) && elem.id === m ) {
						results.push( elem );
						return results;
					}
				}

			// Speed-up: Sizzle("TAG")
            // ���� tag ����ѡ�������� div
			} else if ( match[2] ) {
                // �磺[].push.apply(this.cnxhData,data)
				push.apply( results, context.getElementsByTagName( selector ) );
				return results;

			// Speed-up: Sizzle(".CLASS")
            // ���� class ����ѡ�������� .cls
            // ǰ��������֧�� getElementsByClassName ����
            // ��div1��ѡȡclassΪcls��Ԫ�أ�div1.getElementsByClassName('cls')
			} else if ( (m = match[3]) && support.getElementsByClassName && context.getElementsByClassName ) {
				push.apply( results, context.getElementsByClassName( m ) );
				return results;
			}
		}

		// QSA path
        // qSA ��ָ querySelectorAll
        // support.qsa ��ָ�����֧�� querySelectorAll
        // rbuggyQSA ��ָ qsa ��ص�bug
        // rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
        // qsa ���ã����Ҳ��ᴥ��bug����ִ������if���
        // �����֧�������IE 8+, Firefox 3.5+, Safari 3+, Chrome 4+, and Opera 10+��
        // querySelector ������ƥ�䵽�ĵ�һ��Ԫ�أ����û��ƥ���Ԫ���򷵻� Null
        // querySelectorAll ����һ������ƥ�䵽��Ԫ�ص����飬���û��ƥ���Ԫ���򷵻ص�����Ϊ��
		if ( support.qsa && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
			// expando = "sizzle" + -(new Date())
            // "sizzle-1499319258080"
            nid = old = expando;
			newContext = context;
            // context Ϊ document��newSelector ֵ��Ϊ selector������Ϊ false
			newSelector = nodeType === 9 && selector;

			// qSA works strangely on Element-rooted queries
			// We can work around this by specifying an extra ID on the root
			// and working up from there (Thanks to Andrew Dupont for the technique)
			// IE 8 doesn't work on object elements
             /* ���ﵱǰcontext�����id�ĸ�ֵ��ָ�������������querySelectorAll��һ��BUG 
             * ��BUG����ĳЩ����°ѵ�ǰ�ڵ㣨context��Ҳ��Ϊ������ػ����� 
             * ���巽���ǣ������е�ѡ����ǰ����һ������ѡ������[id=XXX]�� 
             * XXX Ϊcontext��id����context����û������id�������Ĭ��ֵexpando�� 
             */
            // context ΪԪ�أ�����Ԫ�ر�ǩ�������� object
			if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
				// [{value: matched,type: type,matches: match}...]
                groups = tokenize( selector );
                
                // �����ǰ context �� id ����
                // ���û��id,��ôoldֵ���ǿ���
				if ( (old = context.getAttribute("id")) ) {
                    // replace �ڶ�������Ϊ $& ��ʾ������ regexp ƥ��Ĵ�
                    // rescape = /'|\\/g
                    // �����Ż�б��ǰ����һ����б��
                    // nid Ϊ������� id ֵ
					nid = old.replace( rescape, "\\$&" );
                // �����ǰ context û�� id ���ԣ�
                // ��ô������һ��Ĭ�ϵ����� "sizzle-1499319258080"
                // û��id��oldΪ�գ����Ļ��������ϵ����Ը�ɾ����
				} else {
					context.setAttribute( "id", nid );
				}
				nid = "[id='" + nid + "'] ";

				i = groups.length;
				while ( i-- ) {
                    // ԭѡ������div > p + div.aaron
                    // ��� groups[5]: [id="id5"].aaron
                    // ��� groups[4]: [id="id4"]div
                    // ��� groups[3]: [id="id3"]p
                    // ���������
					groups[i] = nid + toSelector( groups[i] );
				}
                // rsibling = new RegExp( whitespace + "*[+~]" )
                // rsibling�����ж�ѡ�����Ƿ�����ֵܹ�ϵ�� 
                // ������ + ~ ���ţ���ȡcontext�ĸ��ڵ�ȡ����ǰ�ڵ� 
				newContext = rsibling.test( selector ) && context.parentNode || context;
				// �����������ʽ��
                //  [id="id0"]div,[id="id1"]p,[id="id2"]div,[id="id3"].aaron
                newSelector = groups.join(",");
			}

			if ( newSelector ) {
                 /* 
                 * ����֮������Ҫ��try...catch�� 
                 * ����Ϊjquery��֧�ֵ�һЩѡ������querySelectorAll����֧�ֵģ� 
                 * ��ʹ����Щѡ����ʱ��querySelectorAll�ᱨ�Ƿ�ѡ������ 
                 * ����Ҫjquery����ȥʵ�֡� 
                 */ 
				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch(qsaError) {
				} finally {
                    // ����û��id��Ԫ�ؼ�����id������Ҫɾ��
					if ( !old ) {
						context.removeAttribute("id");
					}
				}
			}
		}
	}

	// All others
    // �ͼ��������������ԭ����getElementById��querySelectorAll�ȷ���ѡȡԪ��
    // ֻ�� select ��������ȡ���
     // ��������ݷ�ʽ�͵���querySelectorAll��ʽֱ�ӻ�ȡ����⣬���඼�����select����ȡ���  
    /* 
     * rtrim = new RegExp("^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" 
     *          + whitespace + "+$", "g"), 
     * whitespace = "[\\x20\\t\\r\\n\\f]"; 
     ����rtrim /^[\x20\t\r\n\f]+|((?:^|[^\\])(?:\\.)*)[\x20\t\r\n\f]+$/g
     * ����rtrim������ʽ��������ȥ��selector���ߵĿհף��հ��ַ���whitespace�������� 
     * rtrim��Ч����new RegExp("^" + whitespace + "+|" + whitespace + "+$", "g")���� 
     */  
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		// push���������ĩβ���һ�������Ԫ�أ��������µĳ���
        // Expr.cacheLength���̶�ֵ 50
        // key += " "���� key ǿ��ת��Ϊ�ַ��� 
        if ( keys.push( key += " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
            // shift��ɾ������������ĵ�һ��Ԫ��
			delete cache[ keys.shift() ];
		}
		return (cache[ key ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
// ���������һ�����ԣ��𵽱�Ǻ���������
function markFunction( fn ) {
    // expando = "sizzle" + -(new Date())
    // "sizzle-1499323096360"
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return !!fn( div );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( div.parentNode ) {
			div.parentNode.removeChild( div );
		}
		// release memory in IE
		div = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = attrs.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			( ~b.sourceIndex || MAX_NEGATIVE ) -
			( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Detect xml
 * @param {Element|Object} elem An element or a document
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var doc = node ? node.ownerDocument || node : preferredDoc,
		parent = doc.defaultView;

	// If no document and documentElement is available, return
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Set our document
	document = doc;
	docElem = doc.documentElement;

	// Support tests
	documentIsHTML = !isXML( doc );

	// Support: IE>8
	// If iframe document is assigned to "document" variable and if iframe has been reloaded,
	// IE will throw "permission denied" error when accessing "document" variable, see jQuery #13936
	// IE6-8 do not support the defaultView property so parent will be undefined
	if ( parent && parent.attachEvent && parent !== parent.top ) {
		parent.attachEvent( "onbeforeunload", function() {
			setDocument();
		});
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties (excepting IE8 booleans)
	support.attributes = assert(function( div ) {
		div.className = "i";
		return !div.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( div ) {
		div.appendChild( doc.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Check if getElementsByClassName can be trusted
	support.getElementsByClassName = assert(function( div ) {
		div.innerHTML = "<div class='a'></div><div class='a i'></div>";

		// Support: Safari<4
		// Catch class over-caching
		div.firstChild.className = "i";
		// Support: Opera<10
		// Catch gEBCN failure to find non-leading classes
		return div.getElementsByClassName("i").length === 2;
	});

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( div ) {
		docElem.appendChild( div ).id = expando;
		return !doc.getElementsByName || !doc.getElementsByName( expando ).length;
	});

	// ID find and filter
	if ( support.getById ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== strundefined && documentIsHTML ) {
				var m = context.getElementById( id );
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		// Support: IE6/7
		// getElementById is not reliable as a find shortcut
		delete Expr.find["ID"];

		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== strundefined ) {
				return context.getElementsByTagName( tag );
			}
		} :
		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== strundefined && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See http://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( doc.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			div.innerHTML = "<select><option selected=''></option></select>";

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}
		});

		assert(function( div ) {

			// Support: Opera 10-12/IE8
			// ^= $= *= and empty values
			// Should not select anything
			// Support: Windows 8 Native Apps
			// The type attribute is restricted during .innerHTML assignment
			var input = doc.createElement("input");
			input.setAttribute( "type", "hidden" );
			div.appendChild( input ).setAttribute( "t", "" );

			if ( div.querySelectorAll("[t^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */

	// Element contains another
	// Purposefully does not implement inclusive descendent
	// As in, an element does not contain itself
	contains = rnative.test( docElem.contains ) || docElem.compareDocumentPosition ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = docElem.compareDocumentPosition ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var compare = b.compareDocumentPosition && a.compareDocumentPosition && a.compareDocumentPosition( b );

		if ( compare ) {
			// Disconnected nodes
			if ( compare & 1 ||
				(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

				// Choose the first element that is related to our preferred document
				if ( a === doc || contains(preferredDoc, a) ) {
					return -1;
				}
				if ( b === doc || contains(preferredDoc, b) ) {
					return 1;
				}

				// Maintain original order
				return sortInput ?
					( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
					0;
			}

			return compare & 4 ? -1 : 1;
		}

		// Not directly comparable, sort on existence of method
		return a.compareDocumentPosition ? -1 : 1;
	} :
	function( a, b ) {
		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Parentless nodes are either documents or disconnected
		} else if ( !aup || !bup ) {
			return a === doc ? -1 :
				b === doc ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return doc;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch(e) {}
	}

	return Sizzle( expr, document, null, [elem] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val === undefined ?
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null :
		val;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		for ( ; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (see #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

    // һ���ڵ����һ���ڵ�Ĺ�ϵ�޷����¼��֣�
    // ���׺Ͷ��ӡ����ںͺ�����ٽ��ֵܡ���ͨ�ֵ�
    // �ֱ��Ӧ��ѡ����ǣ�> �ո� + ~
    // ��ʵ����һ�ֹ�ϵ��div.clr ��ʾclassΪclr��div�ڵ�
    // first ��ʾ���̶ܳ�
	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[5] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] && match[4] !== undefined ) {
				match[2] = match[4];

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, outerCache, node, diff, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {
							// Seek `elem` from a previously-cached index
							outerCache = parent[ expando ] || (parent[ expando ] = {});
							cache = outerCache[ type ] || [];
							nodeIndex = cache[0] === dirruns && cache[1];
							diff = cache[0] === dirruns && cache[2];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									outerCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						// Use previously-cached element index if available
						} else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
							diff = cache[1];

						// xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
						} else {
							// Use the same loop as above to seek `elem` from the start
							while ( (node = ++nodeIndex && node && node[ dir ] ||
								(diff = nodeIndex = 0) || start.pop()) ) {

								if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
									// Cache the index of each encountered element
									if ( useCache ) {
										(node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
									}

									if ( node === elem ) {
										break;
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf.call( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
			//   not comment, processing instructions, or others
			// Thanks to Diego Perini for the nodeName shortcut
			//   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeName > "@" || elem.nodeType === 3 || elem.nodeType === 4 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === elem.type );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

// �ʷ�����
//���贫�������ѡ�����ǣ�div > p + .clr [type="checkbox"], #id:first-child
//������Է�Ϊ��������div > p + .clr [type="checkbox"] �Լ� #id:first-child
//���ص���Ҫ��һ��Token����
//Sizzle��Token��ʽ���� ��{value:'ƥ�䵽���ַ���', type:'��Ӧ��Token����', matches:'����ƥ�䵽��һ���ṹ'}
// parseOnly �Ƿ�ֻ�Ǽ�� selector �ĺϷ���
function tokenize( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

    // ��� cached �����ݣ�ֱ�ӷ���
	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
    //groups��ʾĿǰ�Ѿ�ƥ�䵽�Ĺ����飬�����������ߣ�groups�ĳ��������2����ŵ���ÿ�������Ӧ��Token����
	groups = [];
	preFilters = Expr.preFilter;

    // soFar ��ʾ��û��������ַ���
	while ( soFar ) {

		// Comma and first run
        // rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" )
        // rcomma = /^[\x20\t\r\n\f]*,[\x20\t\r\n\f]*/
        // ���Ż��߿հ׷���տ�ͷ�����ź�����հ׷����
        // eg��rcomma.exec(',a') ���� [",", index: 0, input: ",a"]
        // rcomma.exec('div > p + .clr [type="checkbox"], #id:first-child') ,���� null
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( tokens = [] );
		}

		matched = false;

		// Combinators
        // rcombinators = /^[\x20\t\r\n\f]*([>+~]|[\x20\t\r\n\f])[\x20\t\r\n\f]*/
		// > + ~ �ո� �ȿհ׷�
        // eg��rcombinators.exec(' > p + ')
        // match Ϊ [" > ", ">", index: 0, input: " > p + "]
        // ���ﴦ��Ƚϼ򵥵�Token �� >, +, �ո�, ~
        if ( (match = rcombinators.exec( soFar )) ) {
            // ƥ�䵽���ַ���Ƭ�� " > "
			matched = match.shift();
			tokens.push({
                // ƥ�䵽���ַ���Ƭ�� " > "
				value: matched,
				// Cast descendant combinators to space
                // ƥ�䵽��token���ͣ��������ո�
                // token�����У�TAG, ID, CLASS, ATTR, CHILD, PSEUDO, NAME, >, +, �ո�, ~
				// ������ >
                type: match[0].replace( rtrim, " " )
			});
            // �Ѿ����������ַ�������
			soFar = soFar.slice( matched.length );
		}

		// Filters
         // ���ﴦ�����⼸��Token �� TAG, ID, CLASS, ATTR, CHILD, PSEUDO, NAME
         /*
            Expr.filter : {
                "TAG": function(){...},
                "CLASS":function(){...},
                "ATTR":function(){...},
                "CHILD":function(){...},
                "PSEUDO":function(){...},
            }

            matchExpr = {
                "ID": new RegExp( "^#(" + characterEncoding + ")" ),
                "CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
                "TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
                "ATTR": new RegExp( "^" + attributes ),
                "PSEUDO": new RegExp( "^" + pseudos ),
                "CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
                    "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
                    "*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
                "bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
                // For use in libraries implementing .is()
                // We use this for POS matching in `select`
                "needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
                    whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
            }

            preFilters : {
                "ATTR": function( match ) {},
                "CHILD": function( match ) {},
                "PSEUDO": function( match ) {}
            }
         */
		for ( type in Expr.filter ) {
            // ���ͨ������ƥ�䵽��Token��ʽ��match = matchExpr[ type ].exec( soFar )
            // Ȼ�󿴿��費��ҪԤ����!preFilters[ type ]
            // �����Ҫ ����ôͨ��Ԥ��������ƥ�䵽�Ĵ���һ�� �� match = preFilters[ type ]( match )
            // ATTR��CHILD��PSEUDO ������ token ��ҪԤ����һ��
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {

                // ƥ�䵽��token
				matched = match.shift();
				tokens.push({
					value: matched,  // ƥ�䵽���ַ���Ƭ��
					type: type,      // token ����
					matches: match   // ����ƥ��������
				});
                // ��ԭ�ַ����ж�����ƥ�䲿��
				soFar = soFar.slice( matched.length );
			}
		}

        // ���û���ҵ�Ƭ�Σ�˵��ѡ����д�������ǾͲ��ټ�����
        // �쳣����
		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
    // ���ֻ�ǲ���ѡ�����ĺϷ��ԣ��Ǿͷ���soFarʣ�೤�ȣ����Ȳ�Ϊ0 ��˵��ѡ�������Ϸ���
    // �������soFarʣ�೤�Ȳ�Ϊ0���׳��쳣��Ϊ 0 �����ѡ�����Ͷ�Ӧ��groups���棬������
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
            // selector �Ͷ�Ӧ�� groups ���� cache ��
			tokenCache( selector, groups ).slice( 0 );
}

// �� token �е� value ������������һ���ַ���
// �� div + p > span.cls
function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var data, cache, outerCache,
				dirkey = dirruns + " " + doneName;

			// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});
						if ( (cache = outerCache[ dir ]) && cache[0] === dirkey ) {
							if ( (data = cache[1]) === true || data === cachedruns ) {
								return data === true;
							}
						} else {
							cache = outerCache[ dir ] = [ dirkey ];
							cache[1] = matcher( elem, context, xml ) || cachedruns;
							if ( cache[1] === true ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf.call( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	// A counter to specify which element is currently being matched
	var matcherCachedRuns = 0,
		bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, expandContext ) {
			var elem, j, matcher,
				setMatched = [],
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				outermost = expandContext != null,
				contextBackup = outermostContext,
				// We must always have either seed elements or context
				elems = seed || byElement && Expr.find["TAG"]( "*", expandContext && context.parentNode || context ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1);

			if ( outermost ) {
				outermostContext = context !== document && context;
				cachedruns = matcherCachedRuns;
			}

			// Add elements passing elementMatchers directly to results
			// Keep `i` a string if there are no elements so `matchedCount` will be "00" below
			for ( ; (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
						cachedruns = ++matcherCachedRuns;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// Apply set filters to unmatched elements
			matchedCount += i;
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !group ) {
			group = tokenize( selector );
		}
		i = group.length;
		while ( i-- ) {
			cached = matcherFromTokens( group[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
	}
	return cached;
};

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

/* 
 * select������Sizzleѡ�������ĺ��ķ���֮һ������Ҫ����������� 
 * 1������tokenize������ɶ�ѡ�����Ľ��� 
 * 2������û�г�ʼ���ϣ���seedû�и�ֵ�����ǵ�һ��ѡ��������ѡ�����ַ�����û�ж��ţ��� 
 *    ���������� 
 *    1) ������ѡ������ID������context��document�ģ���ֱ�ӻ�ȡ������������context���� 
 *    2) ��ѡ�����ǵ�һѡ����������id��class��tag���͵ģ���ֱ�ӻ�ȡ������ƥ���DOMԪ�� 
 *    3) ��ȡ���һ��id��class��tag����ѡ������ƥ��DOMԪ�ظ�ֵ����ʼ���ϣ���seed������ 
 * 3��ͨ������compile������ȡ��Ԥ���롱���벢ִ�У���ȡ������ƥ���DOMԪ�� 
 *  
 * @param selector ��ȥ��ͷβ�հ׵�ѡ�����ַ��� 
 * @param context ִ��ƥ�������������ģ���DOMԪ�ؼ��ϣ�����contextû�и�ֵ����ȡdocument�� 
 * @param results ��ƥ����Ĳ������ս������resultsû�и�ֵ����������顣 
 * @param seed ��ʼ���� 
 */


 /*

CSS�������ʵ�ֵĻ����ӿ�

��ȥquerySelector,querySelectorAll

HTML�ĵ�һ������ô�ĸ�API��

getElementById��������ֻ����HTML�ĵ���
getElementsByName��������ֻ����HTML�ĵ���
getElementsByTagName�������Ŀ�����HTML�ĵ���XML�ĵ���Ԫ�ؽڵ㡣
getElementsByClassName�������Ŀ�����HTML�ĵ���Ԫ�ؽڵ㡣IE8��û��֧�֡�
����Ҫ���ݵĻ�sizzle����ֻ����������ȫ���׵Ŀ���

Expr.find = {
      'ID'    : context.getElementById,
      'CLASS' : context.getElementsByClassName,
      'TAG'   : context.getElementsByTagName
}


selector��"div > p + div.aaron input[type="checkbox"]"

��������
1 ���մ��ҵ���
2 ȡ�����һ��token  ����[type="checkbox"]
                            {
                                matches : [
                                   0: "type"
                                   1: "="
                                   2: "checkbox"
                                ],
                                type    : "ATTR",
                                value   : "[type="checkbox"]"
                            }
3 �������� ���type�� > + ~ �� ���ֹ�ϵѡ�����е�һ�֣����������ڼ�������
4 ֱ��ƥ�䵽Ϊ ID,CLASS,TAG  ��һ�� , ��Ϊ��������ͨ��������Ľӿ���ȡ
  ����������ƥ�䣬�����ұߵ�һ����"[type="checkbox"]"��Expr.find����ʶ����ѡ��������������������
5 ��ʱseed���Ӻϼ��о���ֵ��,������ˢѡ�����������ĺ�С��
6 ���ƥ���seed�ĺϼ��ж������Ҫ��һ���Ĺ�����,����ѡ���� selector: "div > p + div.aaron [type="checkbox"]"
7 OK,����һ�½׶εı��뺯��
 */
function select( selector, context, results, seed ) {
	var i, tokens, token, type, find,
        // �� selector token ��
        // �� [[{value: matched,type: type,matches: match}...]...]
		match = tokenize( selector );

    // ���һ��ѡ�������� id��class��tag �ȣ�û��ƥ������յ�����Ԫ��
	if ( !seed ) {
		// Try to minimize operations if there is only one group
        // ���ѡ������û�ж��ţ���ֻ��һ��
		if ( match.length === 1 ) {

			// Take a shortcut and set the context if the root selector is an ID
            // ΪʲôҪ��ô����ֱ�Ӹ�ֵ tokens = match[0] �����𣿣�
            tokens = match[0] = match[0].slice( 0 );
            // �������¼���������
            // 1.tokens���������ϵ�ѡ����
            // 2.��һ��ѡ������ id ѡ����
            // 3.֧�� getElementById ����
            // 4.context Ϊ document
            // 5.��ǰ�ĵ��� html ����
            // 6.�ڶ���ѡ�����������ǣ��ո� + > ~������֮һ
			if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
					support.getById && context.nodeType === 9 && documentIsHTML &&
					Expr.relative[ tokens[1].type ] ) {
                
                // �� context ��ѡȡ�ض� id ��Ԫ��
                /* Expr.find["ID"] = function( id, context ) {
                    if ( typeof context.getElementById !== strundefined && documentIsHTML ) {
                        var m = context.getElementById( id );
                        // Check parentNode to catch when Blackberry 4.6 returns
                        // nodes that are no longer in the document #6963
                        return m && m.parentNode ? [m] : [];
                    }
                };
                */
                // runescape = /\\([\da-f]{1,6}[\x20\t\r\n\f]?|([\x20\t\r\n\f])|.)/gi
                // funescape ��һ������
                // ����ǰ context ָ���һ�� id ѡ����ָ���Ľڵ�
                context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
				// ���� []��[][0] ��context��ֵΪ undefined
                if ( !context ) {
					return results;
				}
                // ��ԭѡ�����ַ����ж����ʼ��idѡ����
				selector = selector.slice( tokens.shift().value.length );
			}

			// Fetch a seed set for right-to-left matching
            // (?=exp)	ƥ��expǰ���λ��
            // matchExpr["needsContext"] = new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
            // 1. > + ~ ���ֹ�ϵ��
            // 2. :even��:odd��:eq��:gt��:lt��:nth��:first��:last����α�� 
            
            // test ���� true �� false
            // ���û��α����ϵ���������һ������ʼ�����ҳ�seed����
            i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
			// �Ӻ�ߵĹ���ʼ
            while ( i-- ) {
                // ���һ��token
				token = tokens[i];

				// Abort if we hit a combinator
                // �������ո� + > ~����������ѭ��
                // ������û�ҵ����ʵ�seed������ֻ������dom��ȥɨ����
				if ( Expr.relative[ (type = token.type) ] ) {
					break;
				}
                // Expr.find["TAG"] ͨ��ԭ���� getElementsByTagName ����ѡȡԪ�أ�
                // Expr.find["CLASS"] ���֧�� getElementsByClassName �����ø÷���ѡȡԪ��
				// �����find��һ���������������ͷ�����Ӧ�ķ���
                if ( (find = Expr.find[ type ]) ) {
					// Search, expanding context for leading sibling combinators
					if ( (seed = find(
						token.matches[0].replace( runescape, funescape ),
                        // rsibling = new RegExp(whitespace + "*[+~]") 
                        // ������ֵܽڵ㣬�� context �滻Ϊ context.parentNode
						rsibling.test( tokens[0].type ) && context.parentNode || context
					)) ) {

                         // ����ҵ��˽ڵ㣬��ֵ�� seed

						// If seed is empty or no tokens remain, we can return early
						// ɾ����ǰtoken
                        // ֮���Բ���ɾ�����token������Ϊ������������token�ȣ����ǻ�������
                        tokens.splice( i, 1 );
                        // ʣ���ѡ���
						selector = seed.length && toSelector( tokens );
                         // ��� seed Ϊ�ջ���û��ʣ��ѡ��������ټ�����
						if ( !selector ) {
							push.apply( results, seed );
							return results;
						}
                        
                        // ֻҪ�ҵ��� seed���Ͳ�����ѭ����
						break;
					}
				}
			}
		}
	}

	// Compile and execute a filtering function
	// Provide `match` to avoid retokenization if we modified the selector above
	// ����compile������һ����Ϊ�ռ�ƥ����
    // ͨ�����ƥ��������seed���ѷ��������Ľ���ŵ�results���
    /* ��ִ��compile(selector, match)�����᷵��һ����Ԥ���롱������ 
     * Ȼ����øú�����ȡ���ƥ���� 
     */  
    // compile()()
    // ���ɱ��뺯����
    // var superMatcher = compile( selector, match );
    /* superMatcher(
		seed,
		context,
		!documentIsHTML,
		results,
		rsibling.test( selector )
	);
    */
    compile( selector, match )(
		seed,
		context,
		!documentIsHTML,
		results,
		rsibling.test( selector )
	);
	return results;
}

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome<14
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( div1 ) {
	// Should return 1, but returns 4 (following)
	return div1.compareDocumentPosition( document.createElement("div") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( div ) {
	div.innerHTML = "<a href='#'></a>";
	return div.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( div ) {
	div.innerHTML = "<input/>";
	div.firstChild.setAttribute( "value", "" );
	return div.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( div ) {
	return div.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return (val = elem.getAttributeNode( name )) && val.specified ?
				val.value :
				elem[ name ] === true ? name.toLowerCase() : null;
		}
	});
}

jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})( window );
// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
/*
// ƥ�����ⲻ�ǿհ׵��ַ�
core_rnotwhite = /\S+/g

'once memory'.match(/\S+/g) -> ["once", "memory"]  match ��������������ȫ��ƥ�䣬���ص�������������ܼ򵥵�

$.each(arr, function(i, value){
    // i �� key 'name', 'age' ...
    // value ��Ԫ�� 'hello', 20 ...
    // code
    return false;
});
 */
function createOptions( options ) {
    // ���� options Ϊ 'once memory'
    // ע������д����object = optionsCache[ options ] = {}
    // object �� optionsCache[ options ] ָ��ͬһ�����󣬵� object �������������޸ģ�Ҳ�ᷴӦ�� optionsCache[ options ] ��
	var object = optionsCache[ options ] = {};
	jQuery.each( options.match( core_rnotwhite ) || [], function( _, flag ) {
        // �޸� object �൱��Ҳ�޸��� optionsCache[ options ]
		object[ flag ] = true;
	});
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
/*
�� �۲���ģʽ��

function aaa(){
    console.log(1);
}
function bbb(){
    console.log(2);
}

var cb = $.callbacks();
cb.add(aaa);
cb.add(bbb);

cb.fire() // ���δ��� aaa��bbb ����

���¼������ƣ�
document.addEventListener('click',function(){console.log(1),false});
document.addEventListener('click',function(){console.log(1),false});
document.addEventListener('click',function(){console.log(1),false});

���ҳ��󣬻����ε��� 1��2��3

�� ����ͬ�������¶���ĺ���

var cb = $.Callbacks();

function aaa(){
    console.log(1);
}
cb.add(aaa);

(function(){
    function bbb(){
        console.log(2);
    }
    cb.add(bbb);
})();

cb.fire(); // ���δ��� aaa, bbb ����

�� ����ѡ�

a��once:  

���û���������
cb.fire();
cb.fire();
�������������δ����ص�����

$.Callbacks('once') ���� fire() ֻ��һ�δ����ص�

b) memory 

���û�����������
var cb = $.Callbacks();
cb.add(aaa);
cb.fire();
cb.add(bbb);
����ֻ��ֻ�ᴥ�� aaa ����

������ϲ�����var cb = $.callbacks('memory');
���������δ��� aaa, bbb ����

c) unique ��֤�ص�������Ψһ��

���û�����������
var cb = $.Callbacks();
cb.add(aaa);
cb.add(aaa);
cb.fire();

�������������� 2 �� aaa ����

������ϲ�����var cb = $.callbacks('unique');
��ͬ�ĺ���ֻ�ᴥ��һ��

d) stopOnFalse

���д�����������var cb = $.Callbacks('stopOnFalse');

function aaa(){
    console.log(1);
    return false;
}

���� aaa �������� false����ô������� bbb �Ȼص������Ͳ��ᴥ��

e) ��� var cb = $.Callbacks('once memory');


�� ������add��remove��has��empty��disable��disabled��lock��locked��fireWith��fire��fired

�� �������������У������������ stack �����洢��� value ������ context��
var f1 = function(value){
    console.log('f1:' + value);
}

var f2 = function(value){
    console.log('f2:' + value);
}

var cb = $.Callbacks();
cb.add( f1 );
cb.add( f2 );
cb.fire('hello')

���δ�ӡ��f1:hello ��f2:hello
 */

// ����ص���������
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
    /*
    �� ������� options �����ַ�����Ҳ���ǲ�д���� undefined���� options = jQuery.extend( {}, options )���� {}

    �� ������� options ���ַ������� 'once memory'

    var optionsCache = {};

    // Convert String-formatted options into Object-formatted ones and store in cache
    function createOptions( options ) {
        var object = optionsCache[ options ] = {};
        jQuery.each( options.match( core_rnotwhite ) || [], function( _, flag ) {
            object[ flag ] = true;
        });
        return object;
    }

    ûִ�� createOptions( options ) ʱ��optionsCache[ options ] Ϊ undefined
    ִ���� createOptions( options ) ʱ��optionsCache[ options ] ��Ϊ {once : true, memory : true}
    ���ԣ���һ�ν������᷵�� createOptions( options )���� {once : true, memory : true}
     */

	options = typeof options === "string" ?
		( optionsCache[ options ] || createOptions( options ) ) :
		jQuery.extend( {}, options );

	var // Last fire value (for non-forgettable lists)
        // �ϴδ��� fire �����Ĳ������� memory �����Ż���ֵ��
		memory,
		// Flag to know if list was already fired
        // �ص���������ִ�й�һ��
		fired,
		// Flag to know if list is currently firing
        // ��־�ص���������ִ��
		firing,
		// First callback to fire (used internally by add and fireWith)
        // �ص�����ִ�е���λ��
		firingStart,
		// End of the loop when firing
        // ����ִ�еĻص����г���
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		// ����ִ�еĻص���������
        firingIndex,
		// Actual callback list
        // �ص������б�
		list = [],
		// Stack of fire calls for repeatable lists
        // ��������� once ������stack Ϊ false
        // ���û������ once ������stack Ϊ []
		stack = !options.once && [],
		// Fire callbacks
        // self.fire -> self.fireWith -> fire
		fire = function( data ) {
            // ����� memory ���������¼ data
			memory = options.memory && data;
            // ��Ǵ������ص�����
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
            // �������ִ�лص�����
			firing = true;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
                // ��������� stopOnFalse ����������һ���ص��������� false������ֹѭ��
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					// ��ֹ������ add ������ӵĻص�
                    memory = false; // To prevent further calls using add
					break;
				}
			}
            // ��ǻص�������ִ�����
			firing = false;
			if ( list ) {
                // ���û������ once ������stack Ϊ []
                
                // ǰ��� firing �����У��ٵ��� fire(value) ���������� firing�����ǽ� value ѹջ��
                // ��firing ��������ִ����һ�� fire(value)
                
                // �ص�����ִ�й����У����� self.fire(arg) �������µĲ�������� stack ��
                // ������ stack �е�ֵ����Ϊ������ִ�лص�����
                // �� stack = [[context,arg1],[context,arg2],...]
				if ( stack ) {
					if ( stack.length ) {
						fire( stack.shift() );
					}
                // ���� stack Ϊ false��˵�������� once ����
                // ��ô���м���ģʽ��memory ����������ն��У�����֮���� cb.add(fn) ���ǿ���ִ�� fn ��
				} else if ( memory ) {
					list = [];
                // ������ once ��������û���� memory ������ʹ����ʧЧ��֮������������ִ��
				} else {
					self.disable();
				}
			}
		},
		// Actual Callbacks object
        // $.Callbacks() ���صľ������ self ����
		self = {
			// Add a callback or a collection of callbacks to the list
            // �ص����������һ���ص���ص��ļ���
            /*
            cb.add(fn1,fn2)
            cb.add(fn1,[fn2,fn3])
             */
			add: function() {
				if ( list ) {
					// First, we save the current length
					var start = list.length;
					(function add( args ) {
						jQuery.each( args, function( _, arg ) {
							var type = jQuery.type( arg );
                            // ����Ϊ function
							if ( type === "function" ) {
                                /*
                                ���û�� options.unique ������ֱ�Ӵ�
                                ����� options.unique ����������û���ظ������Ҳ��
                                */
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
                            // ����Ϊ������ cb.add([f1,f2,f3])
							} else if ( arg && arg.length && type !== "string" ) {
								// Inspect recursively
                                // �ݹ���
								add( arg );
							}
						});
					})( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away
                    /*
                     �� memory = options.memory && data;
                     memory Ϊ���һ�ε��� callbacks.fireWith(...) ʱ��ʹ�õĲ��� [context, arguments]
                     ����� memory ˵�� options.memory Ϊ�棬���� memory ����
                     �� memory Ĭ��ֵ�� undefined������� memory ��˵��ִ�й� fire ����
                     �� �� memory�����ڻ�ûִ�еĺ���������Ҫ����ִ������

                     ������������ options.once ��ֻҪִ�й� fire ������ʹ�� memory ��ֵ���ͻᴥ�� cb.add(fn) ������ fn ����
                     var cb = $.Callbacks('once memory');
                     cb.add(fn1);
                     cb.fire();
                     cb.add(fn2);

                     cb.fire()

                     ��Ȼ���� fn2 �� fire ��������ӣ������ǻ�ִ�� 1 �Σ������ memory �����á�
                     ֮���� fire �Ͳ��������ˣ���Ϊ�� once

                     ��һ�����������в��� stopOnFalse ʱ������к������� false
                     �� memory = false;
                    */
					} else if ( memory ) {
                        // ���ϴ�ִ�����λ�ÿ�ʼ
						firingStart = start;
						fire( memory );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					jQuery.each( arguments, function( _, arg ) {
						var index;
                        // inArray ����Ԫ���������е����������������� index ��ʾ������ʼλ��
                        // ����ÿ�δ����ϴβ��ҵ���λ�ã���Ϊ�´β��ҵ���ʼλ�ã����Ч��
						while( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
							// Handle firing indexes
                            // �������ִ�лص����У��������г��ȣ���Ȼȡ�����������һ��Ԫ�ػᱨ���
							if ( firing ) {
								if ( index <= firingLength ) {
									firingLength--;
								}
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
            // ����в��� fn ���� fn �Ѿ����ڻص���������� true
            // ���û�в��� fn��ֻҪ�ص����в�Ϊ�գ��ͷ��� true
			has: function( fn ) {
				return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
			},
			// Remove all callbacks from the list
            // ��ջص�����
			empty: function() {
				list = [];
				firingLength = 0;
				return this;
			},
			// Have the list do nothing anymore
            // ���ûص�
			disable: function() {
                // ���������к�����������ִ���� list ��Ϊ�棬���еĺ�������������
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
            // ��� disable ���ˣ����� true
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
                // ��ִ�й�һ�� cb.fire() -> fired������ٰ� stack ��Ϊ undefined���Ǿ���Ҳ�������� cb.fire() ������
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
            // ��� lock ���ˣ����� true
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
                // �ص�����û�б��������������� stack Ϊ���飨���û������ once ������stack Ϊ []��
                /*
                ��һ�ε��� cb.fire('hello') -> fired = true
                Ҫ��ڶ��ε��� cb.fire('hello') ��ִ�У����� stack Ϊ���飬Ҳ����˵û������ once ����
                 */
				if ( list && ( !fired || stack ) ) {
					args = args || [];
                    // [1,2,3].slice() -> [1, 2, 3]
					args = [ context, args.slice ? args.slice() : args ];
                    /*
                    var cb = $.Callbacks();
                    function fn1(value){
                        console.log('fn1'+value);
                        cb.fire()
                    }
                    function fn2(value){
                        console.log('fn2'+value);
                    }

                    cb.add(fn1,fn2);
                    cb.fire('hello');

                    firing ���̲�����ϻ��Ǻ��б�Ҫ�ģ���Ȼ������γ���ͻ���ѭ����һֱִ�� fn1...
                     */
					if ( firing ) {
                        // ����ִ�лص����У��������� fire �������� stack ����
						stack.push( args );
					} else {
                        // args = [ context, args.slice ? args.slice() : args ]
						fire( args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
            /*
            cb.fire(value) �ص��������е�ÿһ������������ value Ϊʵ��ִ��
             */
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
            // �ص���������ִ�й�һ�Σ��ͷ��� true
			fired: function() {
				return !!fired;
			}
		};

	return self;
};

/*
jQuery.extend({
    Deferred : function(){},
    when : function(){}
});

�õ��������߷�����

$.Deferred();
$.when();

����1��
setTimeout(function(){
    alert(111);
},1000);

alert(222);

�ȵ� 222��1 ��� 111

����2��
var cb = $.Callbacks();

setTimeout(function(){
    alert(111);
    cb.fire();
},1000);

cb.add(function(){
    alert(222);
});

1 ����ȵ� 111���ٵ� 222

����3��
var dfd = $.Deferred();

setTimeout(function(){
    alert(111);
    // ������ɻص�����
    dfd.resolve();
},1000);

// ע����ɻص�
dfd.done(function(){
    alert(222);
});

1 ����ȵ� 111���ٵ� 222��������������н��һ����

����4��
var dfd = $.Deferred();

setTimeout(function(){
    alert(111);
    // ����ʧ�ܻص�����
    dfd.reject();
},1000);

// ע��ʧ�ܻص�
dfd.fail(function(){
    alert(222);
});

1 ����ȵ� 111���ٵ� 222��������������н��һ����

����5��
var dfd = $.Deferred();

setTimeout(function(){
    alert(111);
    // ���������лص�����
    dfd.notify();
},1000);

// ע������лص�
dfd.progress(function(){
    alert(222);
});

1 ����ȵ� 111���ٵ� 222��������������н��һ����

����6��
$.ajax({
    url : 'xxx.php',
    success : function(){
        alert('�ɹ�');
    },
    error : function(){
        alert('ʧ��');
    }
});

�൱�ڣ�
$.ajax('xxx.php').done(function(){alert('�ɹ�')}).fail(function(){alert('ʧ��')});

����7�����ɹ��� �� ��ʧ�ܡ� ��״ֻ̬�ܸı�һ��
var dfd = $.Deferred();

setInterval(function(){
    dfd.resolve();
},1000);

dfd.done(function(){
    alert('�ɹ�');
}).fail(function(){
    alert('ʧ��');
});

��Ȼѭ������ resolve()����ֻ��һ�ε��� ���ɹ���

����8���������С����Զ�δ���
var dfd = $.Deferred();

setInterval(function(){
    dfd.notify();
},1000);

dfd.done(function(){
    alert('�ɹ�');
}).fail(function(){
    alert('ʧ��');
}).progress(function(){
    alert('������');
});

ѭ������ notify()��ѭ������ �������С�

����9��
var cb = $.Callbacks('memory');

cb.add(function(){
    alert(1);
});

cb.fire();

cb.add(function(){
    alert(2);
});

�����书�ܡ������ε��� 1��2

����10��
var cb = $.Callbacks('memory');

cb.add(function(){
    alert(1);
});

cb.fire();

$('input').click(function(){
    cb.add(function(){
        alert(2);
    });
});

�ȵ��� 1����� input ��ťʱ���Żᵯ�� 2��ÿ��һ�ξͻᵯ��һ�� 2

����11��
var dfd = $.Deferred();

serTimeout(function(){
    dfd.resolve();
},1000);

dfd.done(function(){
    alert('aaa');
});

$('input').click(function(){
    dfd.done(function(){
        alert('bbb');
    });
});

1 ��󵯳� aaa������ÿ���һ�ΰ�ť����һ�� bbb

����12��
function aaa(){
    var dfd = $.Deferred();
    setTimeout(function(){
        dfd.resolve();
    },1000);
    return dfd;
}

aaa().done(function(){
    alert('�ɹ�');
}).fail(function(){
    alert('ʧ��')
});

1 ��� ���ɹ���

����13��deferred ��������޸�״̬
function aaa(){
    var dfd = $.Deferred();
    setTimeout(function(){
        dfd.resolve();
    });
    return dfd;  // ���Ⱪ¶�ӿ� resolve|notify|reject ���Ըı�״̬
}

var newDfd = aaa();

newDfd.done(function(){
    alert('�ɹ�');
}).fail(function(){
    alert('ʧ��')
});

newDfd.reject();

�������� ��ʧ�ܡ���

������ aaa ��������� reject �ı����ӳٶ���ġ�״̬����

����14��promise ����Ͳ������޸�״̬��
function aaa(){
    var dfd = $.Deferred();
    setTimeout(function(){
        dfd.resolve();
    });
    return dfd.promise(); 
    // promise ����û�в��������Ƿ��� promise ����
    // promise ������ done|fail|progress �Ƚӿڣ�û�� resolve|notify|reject
}

var newDfd = aaa();

newDfd.done(function(){
    alert('�ɹ�');
}).fail(function(){
    alert('ʧ��')
});

newDfd.reject();

1 ��󵯳� ���ɹ�������������� reject �������ᱨ��newDfd.reject ����һ��������undefined��

����15��
function read(){
  var dfd = this;
  setTimeout(function(){
    dfd.resolve('hello');
  }, 3000);
}
 
$.Deferred(read)
����.done(function(content){ console.log(content);})
����.fail(function(){ console.log("����"); } )
����.progress(function(){ console.log("�����У�"); });

3 ����ӡ hello

��ʵ��$.Deferred(read) �ķ���ֵ���� read ������� dfd����֤һ�£�

var d = null;

function read(){
  var dfd = this;
  setTimeout(function(){
    dfd.resolve('hello');
  }, 3000);
  d = dfd;
}
 
$.Deferred(read) === d  // true

 */

/*
deferred ���� api��

* �¼����ģ�done | fail | progress
* �¼�������resolve | reject | notify

(1) $.Deferred(func)
����һ�� function ������function ��߿���ʹ�� this �����õ�ǰ�� deferred ����

(2) deferred.done(fn)
��ӡ��ɹ���ʱ���õĻص�����

(3) deferred.fail(fn)
��ӡ�ʧ�ܡ�ʱ���õĻص�����

(4) deferred.progress(fn)
��ӡ������С����õĻص�����

(5) deferred.resolve/resolveWith([context], args)
���������ɹ���֮��ʹ�ô˷����������ɹ����¼���֮ǰ����done���еĻص��ᱻ����

(6) deferred.reject/rejectWith([context], args)
��������ʧ�ܡ�֮��ʹ�ô˷���������ʧ�ܡ��¼���֮ǰ����fail���еĻص��ᱻ����

(7) deferred.notify/notifyWith([context], args)
�����񡾴����С�����ʹ�ô˷��������������С��¼���֮ǰ����progress���еĻص��ᱻ����

(8) deferred.promise()
������������һ����deferredһ���Ķ��󣬵����޷����ⲿ��resolve��ȥ�޸ĵ�ǰ����״̬

(9) deferred.then(fnDone, fnFail, fnProgress)
����ֱ�Ӵ��������ص��������ֱ��Ӧdone|fail|progress����״̬�Ļص�

����ָ�� 3 �ֻص��������൱������д���Ŀ�ݷ�ʽ��
deferred.done(fnDone).fail(fnFail).progress(fnProgress)

(10) deferred.always(fn)
��ӻص����� fn�����ܡ��ɹ������ǡ�ʧ�ܡ������ᴥ�� fn ����
*/
jQuery.extend({
    /*
    �� �ӳٶ��� deferred �� 3 ��״̬���ɹ� | ʧ�� | ������
    �� 3 �� $.Callbacks ���������ֱ�������� 3 ��״̬�Ļص�����
    */
	Deferred: function( func ) {
		var tuples = [
				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
			],
            // ��ʼ״̬
			state = "pending",
			promise = {
                // ���ص�ǰ״̬
				state: function() {
					return state;
				},
                // ������ done ���� fail ����ִ�е�����
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
                // deferred.done(fnDone).fail(fnFail).progress(fnProgress)�Ŀ�ݷ�ʽ
                // then ���Ǻܵ�����һ��������֮����д�ñȽϸ��ӣ�����Ϊ pipe �����Ƚϸ���
                /*
                ���� pipe ������ô�ã�
                �� pipe ����ֵ���� Deferred ʵ���������ַ���
                var dfd = $.Deferred();

                setTimeout(function(){
                    dfd.resolve('hi');
                },3000);

                var newDfd = dfd.pipe(function(){
                    return arguments[0] + '��ζ';
                });

                newDfd.done(function(){
                    alert(arguments[0])
                });

                // 3 ��󵯳� ��hi��ζ����

                ���� pipe �� then һ������һ�������������ǡ��ɹ����Ļص�������
                ���⣬����ֵ arguments[0] + '��ζ' ��Ϊ newDfd ���ɹ����Ļص�������ʵ�Ρ�

                Ҳ����˵ ��dfd.resolve('hi')�� ���� ��function(){return arguments[0] + '��ζ';}��
                ��arguments[0] + '��ζ'�� ��Ϊ ��function(){alert(arguments[0])}�� ��ʵ��

                �� pipe ����ֵ�� Deferred ʵ��
                var dfd = $.Deferred();

                setTimeout(function(){
                    dfd.resolve('hi');
                },3000);

                var newDfd = dfd.pipe(function(){
                    return dfd;
                });

                newDfd.done(function(){
                    alert(arguments[0])
                });

                3 ��󵯳� ��hi��
                */
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
                    /*
                    return jQuery.Deferred(function(newDefer){}).promise();
                    
                    $.Deferred(func) ������ʽ��
                    ִ�к��� func��this ��ʵ�ζ�Ϊ deferred�����ҷ��� Deferred ʵ������

                    then/pipe ��󷵻ص���һ�� promise ����

                    ���ؼ��� �������Է�����jQuery.Deferred(function(newDefer){}) ���صľ��� newDefer
                    jQuery.Deferred(function(newDefer){}).promise() �� newDefer.newDefer

                    ��һ�� jQuery.Deferred ������
                    jQuery.extend({
	                    Deferred: function( func ) {
                            deferred = {};
                            promise.promise( deferred ); // �̳�
                            if ( func ) {
                                func.call( deferred, deferred );
                            }
                            return deferred;
                        }
                    });

                    ���￴�������ԣ�func ��ʵ�� deferred������ jQuery.Deferred ���շ��ص� deferred

                    */
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
                            // action = "resolve" | "reject" | "notify"
							var action = tuple[ 0 ],
                                // ��������Ǻ������ͷ��ظú��������򷵻� false
                                // ������ done��fail��progress �Ļص�����
								fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];

							// deferred[ done | fail | progress ] for forwarding actions to newDefer
                            // ���ΰѺ�������ص�����
                            // ��һ��֮����д����ô��������Ϊ then ���� �� pipe �������ô���
                            // ��������д����Ҫ��Ϊ pipe д��
							deferred[ tuple[1] ](function() {
                                // fn �Ǻ�����returned ���Ǻ�������ֵ�������� undefined��Ҳ������������
                                // fn ���Ǻ��������� false
								var returned = fn && fn.apply( this, arguments );
                                // ����ص����ص���һ��Deferredʵ��
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									// �������¼�
                                    returned.promise()
										.done( newDefer.resolve )
										.fail( newDefer.reject )
										.progress( newDefer.notify );
								} else {
                                    // ����ص����ص��ǲ���һ��Deferredʵ�����򱻵���args��XXXWith�ɷ���ȥ
									newDefer[ action + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
								}
							});
                            /*
                            ������δ����е㸴�ӣ����������ʵ�� then ������ֻ��Ҫ��ôд��
                            deferred[ tuple[1] ](function() {
								fn.apply( this, arguments );
							});

                            ����� if - else ��Ϊ��ʵ�� pipe �����ģ����μ�������
                            �� ��� returned �Ǹ� Deferred ʵ��
                            var dfd = $.Deferred();

                            var newDfd = dfd.pipe(function(){
                                return dfd;
                            });

                            newDfd === dfd  // false
                            newDfd ��һ�� promise ���󣬶� dfd ��һ�� deferred ����

                            ����ĳ� 
                            var newDfd = dfd.pipe(function(){
                                return $.Deferred();
                            });

                            ��������������һ�����Ͳ��ᵯ�� ��hi�� �ˡ�

                            �������飬newDfd === newDefer.promise() // true 
                            ��ܹؼ�

                            �� ��� returned ���� Deferred ʵ���������ַ���
                               ����� newDefer[ "xxxWith" ](context,['hi��ζ'])
                               �� fire �����ص�����
                            */

						});
                        // �˳�ǰ�ֹ�����null����հ���ɵ��ڴ�ռ��
						fns = null;
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
                // �в����������ͼ̳� promise
                // û�в������ͷ��� promise
                // ���ʣ�������� promise ������ָ������������� promise ���󣬻��ǵ�ǰ�� promise ���ԣ���
                /*
                �������飺
                var promise = {
                        promise : function(){
                            console.log(typeof promise);
                        }
                    };
                promise.promise()
                // object 
                Ҳ����˵��������� promise ָ�������Ķ��󣬶���������� promise ���ԡ�ȷʵӦ���������Ͼ������ԣ��ֲ��Ǻ�������
                
                var promise = {
                        promise : function promise(){
                            console.log(typeof promise);
                        }
                    };
                promise.promise()
                // function
                ����д��������� promise ����ָ��ǰ�����ˡ�
                 */
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

        /*
        ��һ��promise ����������Щ������
        state��always ��then��promise��pipe��done��fail��progress

        deferred ����������Щ������
        resolve��reject��notify

        promise.promise( deferred ); 
        ���ʹ�� deferred �̳� promise���� promise �ķ���ȫ���Ƹ� deferred

        ���ԣ�deferred �� promise �� resolve��reject��notify ����������
        �� resolve��reject �ȷ����ǿ����޸�״̬�ģ�
        ���� promise �����ⲿ�������޸�״̬���� deferred �ⲿ�����޸�״̬
        �ο�����ġ�����13����������14��
         */

		// Keep pipe for back-compat
        // ������������һ�δ���
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
            // list = $.callbacks("once memory");
			var list = tuple[ 2 ],          // jQuery.Callbacks("once memory")
				stateString = tuple[ 3 ];   // "resolved" | "rejected" | undefined

			// promise[ done | fail | progress ] = list.add
            /* 
            promise[ "done" ] = $.Callbacks("once memory").add
            promise[ "fail" ] = $.Callbacks("once memory").add
            promise[ "progress" ] = $.Callbacks("memory").add
            */
			promise[ tuple[1] ] = list.add;

			// Handle state
            // i ֻ��Ϊ 0 �� 1
            // Ĭ���� doneList��failList ��� 3 ���ص�����
			if ( stateString ) {
				list.add(function() {
					// state = [ resolved | rejected ]
					state = stateString;

				/*
                ��� ^ : ����������λ��ͬ���� 1����ͬ���� 0
                �磺 0 ^ 3 -> (00) ^ (11) -> (00) -> 0
                     0 ^ 1 -> (00) ^ (01) -> 1
                     1 ^ 1 -> 0
                     2 ^ 1 -> (10) ^ (01) -> (11) -> 3
                */
                // [ reject_list | resolve_list ].disable; progress_list.lock
                }, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

            /*
            �൱�ڣ�
            doneList : [changeState, failList.disable, processList.lock]
            failList : [changeState, doneList.disable, processList.lock]

            �� changeState �ı�״̬������������deferred��״̬����Ϊ���֣�pending(��ʼ״̬), resolved(���״̬), rejected(�ܾ�״̬)
            �� ����deferred����������resolve������reject���������ȸı����״̬֮�󣬶���disable��һ�������б�failList(����doneList)
            �� Ȼ��lock processList������״̬�����ִ��ʣ�µ�֮ǰdone������fail�������Ļص�����
            */

			// deferred[ resolve | reject | notify ]
            /*
            deferred[ "resolve" ] = function(){
                deferred[ "resolveWith" ](this === deferred ? promise : this, arguments );
                return this;
            }
            */
			deferred[ tuple[0] ] = function() {
				deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
        /*
        $.Deferred(func) ������ʽ��
        ִ�к��� func��this �� ������Ϊ deferred

        ���仰����$.Deferred() ����һ�� function ������function ����
        ������ this ����ȡ deferred ����
        */
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

    /*
    �� �ӳٶ������ʹ��
    function aaa(){
        var dfd = $.Deferred();
        dfd.resolve();
        return dfd;
    }

    aaa().done(function(){
        alert('�ɹ�');
    });

    ���� ���ɹ���

    �� �����ӳٶ�����ɲŴ�����ɻص�
    function aaa(){
        var dfd = $.Deferred();
        dfd.resolve();
        return dfd;
    }
    function bbb(){
        var dfd = $.Deferred();
        dfd.resolve();
        return dfd;
    }
    $.when(aaa(),bbb()).done(function(){
        alert('�ɹ�');
    });

    �����ӳٶ��󶼡��ɹ����ˣ����� ���ɹ���

    ���붼�ɹ����Żᴥ���ɹ��Ļص�������
    

    �� ֻҪ��һ��ʧ�ܣ��ͻᴥ��ʧ�ܵĻص�
    function aaa(){
        var dfd = $.Deferred();
        dfd.resolve();
        return dfd;
    }
    function bbb(){
        var dfd = $.Deferred();
        dfd.reject();
        return dfd;
    }
    $.when(aaa(),bbb()).done(function(){
        alert('�ɹ�');
    }).fail(function(){
        alert('ʧ��');
    });

    ��һ���ӳٶ��� bbb() ʧ����,���Ե��� ��ʧ�ܡ�

    �� $.when() �Ĳ�����������ӳٶ����Ǿ��൱�������ò���
    function aaa(){
        var dfd = $.Deferred();
        dfd.resolve();
        return dfd;
    }
    function bbb(){
        var dfd = $.Deferred();
        dfd.reject();
    }
    $.when(aaa(),bbb()).done(function(){
        alert('�ɹ�');
    }).fail(function(){
        alert('ʧ��');
    });

    bbb() û�з����ӳٶ�������ֻ�� aaa() �ӳٶ��󣬵��� ���ɹ���
    
    �� ��������������ӳٶ����Ƕ�����
    $.when(123��456).done(function(){
        alert('�ɹ�');
    }).fail(function(){
        alert('ʧ��');
    });

    $.when().done(function(){
        alert('�ɹ�');
    }).fail(function(){
        alert('ʧ��');
    });

    ���϶��ǵ��� ���ɹ���

    �� ������������ӳٶ��󣬻�Ѳ������ݸ��ɹ��ص�����
    $.when(123,456).done(function(){
        console.log(arguments[0]);
        console.log(arguments[1]);
        alert('�ɹ�');
    }).fail(function(){
        alert('ʧ��');
    });

    ���ϴ�ӡ�� arguments[0]��arguments[1] �ֱ��� 123 ��456

     */

	// Deferred helper
    // �ӳٶ���ĸ�������
    // $.when() ���� deferred.promise();
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = core_slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
            // �� length Ϊ 0��Ҳ����û�в���ʱ��remaining Ϊ 0
            // �� length Ϊ 1��Ҳ���Ǵ� 1 �����������������ӳٶ���remaining Ϊ 1������Ϊ 0
            // �� length ���� 1�����������ӳٶ���ͷ��ӳٶ���remaining Ϊ length
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
            // �� length Ϊ 0��remaining Ϊ 0��deferred Ϊ jQuery.Deferred()
            // �� length Ϊ 1����һ�����������������ӳٶ���deferred Ϊ subordinate������ deferred Ϊ jQuery.Deferred()
            // �� length ���� 1��remaining Ϊ length ���� 1��deferred Ϊ jQuery.Deferred()
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? core_slice.call( arguments ) : value;
					if( values === progressValues ) {
						deferred.notifyWith( contexts, values );
                    // remaining Ϊ 0�������е��ӳٶ��󶼡��ɹ����ˣ����� master Deferred �� resolveWith
					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
                // ��ǰ�������ӳٶ��󣬡��ɹ������ߡ������С������ú��� updateFunc
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
                        // done��fail��progress �ȷ����Ĳ���Ӧ���Ǻ����Ķ��壬����ȴ�Ǻ�����ִ��
                        // ��Ϊ updateFunc ��������ֵ����һ���µĺ���
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject ) // ֻҪ��һ���ӳٶ���ʧ�ܣ�master Deferred ��ʧ����
						.progress( updateFunc( i, progressContexts, progressValues ) );
                // ��ǰ���������ӳٶ���ʣ���ӳٶ������ֱ�Ӽ� 1
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
        // �� length Ϊ 0��remaining Ϊ 0��deferred Ϊ jQuery.Deferred()������ resolveWith�������� resolve
        // �� length Ϊ 1��������Ϊ�ӳٶ���remaining Ҳ��Ϊ 0��deferred Ϊ jQuery.Deferred()
        // resolveValues = core_slice.call( arguments )
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
});


// ���ܼ�⣬�����޸�������
// ����� hooks ���޸���������
/*
jQuery.support ֵ��ʵ����һ������ {...}
��chrome������ for-in ѭ��������ֵ��ӡ����
for(var attr in jQuery.support){
    console.log(attr +' : '+jQuery.support[attr]);
}
checkOn : true
optSelected : true
reliableMarginRight : true
boxSizingReliable : true
pixelPosition : true
noCloneChecked : true
optDisabled : true
radioValue : true
checkClone : true
focusinBubbles : false
clearCloneStyle : true
cors : true
ajax : true
boxSizing : true
 */
jQuery.support = (function( support ) {
	var input = document.createElement("input"),
		fragment = document.createDocumentFragment(),
		div = document.createElement("div"),
		select = document.createElement("select"),
		opt = select.appendChild( document.createElement("option") );

    /*
    appendChild �������ر���ӵ��Ǹ��ڵ㣺eg:

    var select = document.createElement("select");
    var option =  document.createElement("option");
    var node = select.appendChild(option);
    option === node 
    // true
    */

	// Finish early in limited environments
    // ��������������� input.type ֵ��Ĭ��Ϊ "text"�����Զ�����������ͷ���
	if ( !input.type ) {
		return support;
	}

	input.type = "checkbox";

	// Support: Safari 5.1, iOS 5.1, Android 4.x, Android 2.3
	// Check the default checkbox/radio value ("" on old WebKit; "on" elsewhere)
    // checkbox ��ֵ�Ƿ��� on
	support.checkOn = input.value !== "";

	// Must access the parent to make an option select properly
	// Support: IE9, IE10
    // �����˵��ĵ�һ�������Ƿ�ѡ��
	support.optSelected = opt.selected;

	// Will be defined later
    // ��д�������������� 
	support.reliableMarginRight = true;
	support.boxSizingReliable = true;
	support.pixelPosition = false;

	// Make sure checked status is properly cloned
	// Support: IE9, IE10
    // ��ѡ��ѡ�У���¡�����ѡ�򣬿�¡�ڵ��Ƿ�Ҳ��ѡ��
    /*
    cloneNode(deep) ���������ڵ�Ŀ����������ظø�����
    cloneNode(deep) ������¡���������Լ����ǵ�ֵ��
    �������Ҫ��¡���к������� deep �������� true����������Ϊ false��
    ����ֵ�Ǳ���¡�Ľڵ�
    */
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Check if an input maintains its value after becoming a radio
	// Support: IE9, IE10
    // input ��� radio ���Ƿ񱣳�ԭ���� value
	input = document.createElement("input");
	input.value = "t";
	input.type = "radio";
	support.radioValue = input.value === "t";

	// #11217 - WebKit loses check when the name is after the checked attribute
	input.setAttribute( "checked", "t" );
	input.setAttribute( "name", "t" );

	fragment.appendChild( input );

	// Support: Safari 5.1, Android 4.x, Android 2.3
	// old WebKit doesn't clone checked state correctly in fragments
    // �ɵ� WebKit����¡ fragment �ڵ㣬����ýڵ����� input����ô input �� checkd ״̬���ᱻ����
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: Firefox, Chrome, Safari
	// Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP)
	support.focusinBubbles = "onfocusin" in window;

    /*
    background-clip: border-box|padding-box|content-box;
    background-clip ���Թ涨�����Ļ�������
    
    ������������ԣ������ı������ԣ��� background-color �ȶ����������
    eg:
    var div = document.createElement('div');
    div.style.backgroundColor = 'red';
    div.cloneNode(true).style.backgroundColor = '';
    console.log(div.style.backgroundColor);

    ie ��������ؿգ�Ҳ����˵����¡һ���ڵ�󣬸��½ڵ㱳�����Ը�ֵ��Դ�ڵ�ı�������Ҳ���޸���

    jquery ͳһ���������
    eg:
    var div = $('<div>');
    div.css('backgroundColor','red');
    div.clone().css('backgroundColor','');
    console.log('div.css('backgroundColor',''));
    
    ������������������� red
    */
	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	// Run tests that need a body at doc ready
    // ʣ�µļ����Ҫ�� dom ������ɺ���ִ��
	jQuery(function() {
		var container, marginDiv,
			// Support: Firefox, Android 2.3 (Prefixed box-sizing versions).
			divReset = "padding:0;margin:0;border:0;display:block;-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box",
			body = document.getElementsByTagName("body")[ 0 ];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		container = document.createElement("div");
		container.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";
        // left ���ó� -9999px ��Ϊ�˲������Ԫ���ڿɼ���Χ�Ӱ��ҳ�湦��
        // margin-top:1px �� jQuery �ϰ汾�м�����������õ��ģ�����汾�ò���

		// Check box-sizing and margin behavior.
		body.appendChild( container ).appendChild( div );
		div.innerHTML = "";
		// Support: Firefox, Android 2.3 (Prefixed box-sizing versions).
        // ����ģʽ
		div.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%";

		// Workaround failing boxSizing test due to offsetWidth returning wrong value
		// with some non-1 values of body zoom, ticket #13543
        // zoom�ǷŴ�ҳ������ԣ�����1��ʱ�򣬲��Ŵ�Ҳ����С
		jQuery.swap( body, body.style.zoom != null ? { zoom: 1 } : {}, function() {
			support.boxSizing = div.offsetWidth === 4;
            // offsetWidth ���� width + padding + border������ģʽ�¾��� width
            // ����ģʽ�£�����4��֧��boxSizing�������������֧��
		});

		// Use window.getComputedStyle because jsdom on node.js will break without it.
		if ( window.getComputedStyle ) {
            // ��Ԫ�������ǰٷ���ʱ��ֻ�� Safari ���ذٷ�����������������᷵������ֵ
			support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
			support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";
            // IE�£�����ǹ���ģʽ��width������4px����Ҫ��ȥpadding��border
            // �����������width ���� 4px

			// Support: Android 2.3
			// Check if div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container. (#3333)
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			marginDiv = div.appendChild( document.createElement("div") );
			marginDiv.style.cssText = div.style.cssText = divReset;
			marginDiv.style.marginRight = marginDiv.style.width = "0";
			div.style.width = "1px";

			support.reliableMarginRight =
				!parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
		}

		body.removeChild( container );
	});

	return support;
})( {} );

/*
�� attr ���������ô�������
$('#div1').attr('name','hello');
$('#div1').attr('name')  // hello

�൱�ڣ�

document.getElemntById('div1').setAttribute('name','hello');
document.getElemntById('div1').getAttribute('name'); // hello

�� prop ���ʺ����ô�������
$('#div1').prop('name','hello');
$('#div1').prop('name')  // hello

�൱�ڣ�

document.getElemntById('div1').name = 'hello';
document.getElemntById('div1').name;  // hello

�� data �������ô�������
$('#div1').data('name','hello');
$('#div1').data('name')  // hello

�� �ڴ�й©
���õ��ڴ�Ӧ�û��գ�������õı��������գ��ͻᵼ���ڴ�й©��

js �е����ڴ�й©��

��dom Ԫ�ء��͡�����֮�以�����ã��󲿷������������ڴ�й©

var oDiv = document.getElemntById('div1');
var obj = {};

oDiv.name = obj;
obj.age = oDiv;

$.('#div1').attr('name',obj);
��� obj ��ĳ�������������� #div���ͻ�����ڴ�й©��

������ data �������Ż���һ�㣬��������ڴ�й©��


 */

/*
	Implementation Summary

	1. Enforce API surface and semantic compatibility with 1.9.x branch
	2. Improve the module's maintainability by reducing the storage
		paths to a single mechanism.
	3. Use the same single mechanism to support "private" and "user" data.
	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
	5. Avoid exposing implementation details on user objects (eg. expando properties)
	6. Provide a clear path for implementation upgrade to WeakMap in 2014
*/
var data_user, data_priv,
    /*
    ƥ�� [xxx] �� {xxx} ��β
    eg:
    rbrace.exec('{123}')  ->  ["{123}", index: 0, input: "{123}"]
    rbrace.exec('sas{123}') -> ["{123}", index: 3, input: "sas{123}"]
    rbrace.exec('sas[123]') -> ["[123]", index: 3, input: "sas[123]"]
    */
	rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
	rmultiDash = /([A-Z])/g;

/*
�� һ������£�����������ǿ��������޸ĵ�
var obj = {name:'hello'};
obj.name = 'hi';

console.log(obj.name);  // hi

�� Object.preventExtensions/freeze ʹ�ö�������Բ����޸�
var obj = {name:'hello'};
Object.freeze(obj);
obj.name = 'hi';

console.log(obj.name);  // hello

�� Object.defineProperty
var obj = {name: 'hello'};

Object.defineProperty( obj, 0, {
    get: function() {
        return {};
    }
});

console.log(obj[0]);  // {}
obj[0] = 123;         
console.log(obj[0]);  // {}

������Ϊ obj ������������� 0���������ֻ�ܻ�ȡ����Ϊû�� set ���������Բ����޸�

get �� set ���Ǳ���ɶԳ��֣���д��һ�Ϳ��ԡ���������÷�������get��set��Ĭ��ֵΪundefined
��ʹ���� get �� set ������������ʹ��writable��value����������

 */

function Data() {
	// Support: Android < 4,
	// Old WebKit does not have Object.preventExtensions/freeze method,
	// return new empty object instead with no [[set]] accessor
    /*
    Object.defineProperty(obj, prop, descriptor) 
    ֱ����һ�������϶���һ�������ԣ������޸�һ��������������ԣ��������������
    ���У�
    obj��Ҫ�����϶������ԵĶ���
    prop��Ҫ������޸ĵ����Ե�����
    descriptor������������޸ĵ�����������


    eg��
    �� ����
    var obj = {};
    Object.defineProperty(obj, "key", {
      enumerable: false,
      configurable: false,
      writable: false, // ����д
      value: "static"
    });
    obj.key
    // "static"

    obj.key = 'hello';
    obj.key
    // ���� "static"�������޸�

    �� ����
    function Archiver() {
      var temperature = null;
      var archive = [];

      Object.defineProperty(this, 'temperature', {
        get: function() {
          console.log('get!');
          return temperature;
        },
        set: function(value) {
          temperature = value;
          archive.push({ val: temperature });
        }
      });

      this.getArchive = function() { return archive; };
    }

    var arc = new Archiver();

    arc.temperature; // ��ӡ 'get!'������ null
    arc.temperature === null // true

    arc.temperature = 11;
    arc.temperature = 13;
    arc.getArchive(); // [{ val: 11 }, { val: 13 }]
    */
	Object.defineProperty( this.cache = {}, 0, {
		get: function() {
			return {};
		}
	});
    /*
    var data = new Data();
    data.cache[0] // {}   �������ֻ�� get ���������Բ�������
    data.expando  // "jQuery2030182001339212814580.7107637158134246"
    */

    // �ظ��ĸ��ʺ�С�����Բ��ƣ�����Ψһ��
	this.expando = jQuery.expando + Math.random();
}

Data.uid = 1;

Data.accepts = function( owner ) {
	// Accepts only:
	//  - Node
	//    - Node.ELEMENT_NODE 1
	//    - Node.DOCUMENT_NODE 9
	//  - Object
	//    - Any
	return owner.nodeType ?
		owner.nodeType === 1 || owner.nodeType === 9 : true;
	/*
	 �� ����� nodeType ���ԣ�nodeType �� 1 �� 9���ͷ��� true�����򷵻� false��
     �� ���û�� nodeType ���ԣ�ֱ�ӷ��� true��
	*/
};

Data.prototype = {
	/*
	���ã����� owner �ڵ��� cache �ж��ڵ�������
    �� ����ڵ� node1 ��Ӧ cache ������ 1���� cache[1]
    �� ��� cache[1] �Ѿ����ڣ���ô�ٴθ� node1 ������ݣ��Ͳ����ٴ����µ� cache �����ˣ�ֱ���� cache[1] ����Ӽ���
	*/
	key: function( owner ) {
		// We can accept data for non-element nodes in modern browsers,
		// but we should not, see #8335.
		// Always return the key for a frozen object.
        // �ڵ����Ͳ��� 1 Ҳ���� 9����ֱ�ӷ��� 0
        /*
        cache �Ľṹ�������£�
        cache = {
            "0": { },
            "1": { // DOM�ڵ�1�������ݣ�
                "name1": value1,
                "name2": value2
            },
            "2": { // DOM�ڵ�2�������ݣ�
                "name1": value1,
                "name2": value2
            }
            // ......
        };
        cache[0] �ǲ������޸ĵģ�ʣ�µ� cache[1]��cache[2]... �ǿ����޸ĵ�

        ���ﷵ�ص� key ֵ 0 ,���� cache ������

        Ҳ�������в����� owner.nodeType === 1 || owner.nodeType === 9 �Ľڵ㶼���� cache[0] ���ֻ���ն���
         */

		if ( !Data.accepts( owner ) ) {
			return 0;
		}

		var descriptor = {},
			// Check if the owner object already has a cache key
            // �� owner �ڵ����� owner["jQuery2030182001339212814580.7107637158134246"] ���ԣ����Ƿ����
			unlock = owner[ this.expando ];

		// If not, create one
        // ���������û���������
		if ( !unlock ) {
			unlock = Data.uid++;

			// Secure it in a non-enumerable, non-writable property
			try {
                // Ϊ owner �ڵ����ֻ���� jQuery2030182001339212814580.7107637158134246 ����
				descriptor[ this.expando ] = { value: unlock };
				Object.defineProperties( owner, descriptor );
                /*
                
                ע�������õ��� Object.defineProperties ������ Object.defineProperty
                Object.defineProperties( owner, descriptors )������ͬʱ�����������������
                Object.defineProperty(obj, prop, descriptor)����һ�������������

                Object.defineProperties �ĵڶ�������ʾ����
                descriptors = {
                    jQuery2030182001339212814580.7107637158134246 : {value : 1},
                    jQuery2030182001339212814580.3427632463276477 : {value : 2},
                    jQuery2030182001339212814580.5498736534657347 : {value : 3}
                };

                jQuery2030182001339212814580.7107637158134246 �൱�� prop��
                {value : 1} �൱�� descriptor

                ���У�
                value: �������Ե�ֵ
                writable: ֵ�Ƿ������д��Ĭ���� false����������д
                enumerable: Ŀ�������Ƿ���Ա�ö�١�Ĭ���� false��������ö��
                configurable: Ŀ�������Ƿ���Ա�ɾ�����Ƿ�����ٴ��޸����ԡ�Ĭ���� false�������������޸�

                ����ֻд�� value �ֶΣ�����ûд���ֶ�Ĭ�϶��� false��
                ����˵��� jQuery2030182001339212814580.7107637158134246 �����ǲ����Ըĵġ�

                 */

			// Support: Android < 4
			// Fallback to a less secure definition
			} catch ( e ) {
				descriptor[ this.expando ] = unlock;
				jQuery.extend( owner, descriptor );
                /*
                ����д�� jQuery2030182001339212814580.7107637158134246 �����ǿ��Ըĵġ�
                ֻ��ĳЩ�汾�������֧������д�������ԲŲ�ȡ���ַ����˶������
                 */
			}
		}

		// Ensure the cache object
        // �� cache �п���һ��ռ������ unlock
		if ( !this.cache[ unlock ] ) {
			this.cache[ unlock ] = {};
		}

		return unlock;
	},
	set: function( owner, data, value ) {
		var prop,
			// There may be an unlock assigned to this node,
			// if there is no entry for this "owner", create one inline
			// and set the unlock as though an owner entry had always existed
			unlock = this.key( owner ),
			cache = this.cache[ unlock ];

		// Handle: [ owner, key, value ] args
        /*
        ��Ӧ������ʽ��
        $.data(document.body,'age','27');
         */
		if ( typeof data === "string" ) {
			cache[ data ] = value;

		// Handle: [ owner, { properties } ] args
        /*
        ��Ӧ������ʽ��
        $.data(document.body,{'age':'27','job':it});
         */
		} else {
			// Fresh assignments by object are shallow copied
			if ( jQuery.isEmptyObject( cache ) ) {
				jQuery.extend( this.cache[ unlock ], data );
			// Otherwise, copy the properties one-by-one to the cache object
			} else {
				for ( prop in data ) {
					cache[ prop ] = data[ prop ];
				}
			}
		}
		return cache;
	},
	get: function( owner, key ) {
		// Either a valid cache is found, or will be created.
		// New caches will be created and the unlock returned,
		// allowing direct access to the newly created
		// empty data object. A valid owner object must be provided.
		var cache = this.cache[ this.key( owner ) ];

		return key === undefined ?
			cache : cache[ key ];
	},
	access: function( owner, key, value ) {
		var stored;
		// In cases where either:
		//
		//   1. No key was specified
		//   2. A string key was specified, but no value provided
		//
		// Take the "read" path and allow the get method to determine
		// which value to return, respectively either:
		//
		//   1. The entire cache object
		//   2. The data stored at the key
		//
		if ( key === undefined ||
				((key && typeof key === "string") && value === undefined) ) {

			stored = this.get( owner, key );

			return stored !== undefined ?
				stored : this.get( owner, jQuery.camelCase(key) );
		}

		// [*]When the key is not a string, or both a key and value
		// are specified, set or extend (existing objects) with either:
		//
		//   1. An object of properties
		//   2. A key and value
		//
		this.set( owner, key, value );

		// Since the "set" path can have two possible entry points
		// return the expected data based on which path was taken[*]
		return value !== undefined ? value : key;
	},
	remove: function( owner, key ) {
		var i, name, camel,
			unlock = this.key( owner ),
			cache = this.cache[ unlock ];

        // û��ָ����keyֵ���� owner ��Ӧ�����е����ݶ����
        // // ��Ӧ������ʽ�� $.removeData(document.body)
		if ( key === undefined ) {
			this.cache[ unlock ] = {};

		} else {
			// Support array or space separated string of keys
            // key ������
            // ��Ӧ������ʽ�� $.removeData(document.body,['age','job'])
			if ( jQuery.isArray( key ) ) {
				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = key.concat( key.map( jQuery.camelCase ) );
			} else {
                // ת�շ壬�� all-name -> allName
				camel = jQuery.camelCase( key );
				// Try the string as a key before any manipulation
				if ( key in cache ) {
                    // all-name��allName ���ֶ�Ҫɾ��
					name = [ key, camel ];
				} else {
					// If a key with the spaces exists, use it.
					// Otherwise, create an array by matching non-whitespace
                    // ��ת�շ壬ת���շ廹�Ҳ�������ȥ���ո�����
					name = camel;
					name = name in cache ?
						[ name ] : ( name.match( core_rnotwhite ) || [] );
				}
			}

			i = name.length;
			while ( i-- ) {
				delete cache[ name[ i ] ];
			}
		}
	},
	hasData: function( owner ) {
		return !jQuery.isEmptyObject(
			this.cache[ owner[ this.expando ] ] || {}
		);
	},
	discard: function( owner ) {
		if ( owner[ this.expando ] ) {
			delete this.cache[ owner[ this.expando ] ];
		}
	}
};

// These may be used throughout the jQuery core codebase
data_user = new Data();
data_priv = new Data();

/*
ÿ���ڵ�� dom[expando] ��ֵ����Ϊһ�������ı��� id������ȫ��Ψһ�ԡ� 
��� id ��ֵ����Ϊ cache �� key �������� DOM �ڵ�����ݡ�
Ҳ����˵ cache[id] ��ȡ��������ڵ��ϵ����л��棬
��id�ͺñ��Ǵ�һ������( DOM �ڵ�)��Կ�ס�

���磺BodyԪ�� expando��uid

jQuery203054840829130262140.37963378243148327: 3

���� dom Ԫ�����ҵ� expando ��Ӧֵ��Ҳ�� uid��Ȼ��ͨ����� uid �ҵ����� cache �����е�����

����cache����ṹӦ������������:

cache = {
    "uid1": { // DOM�ڵ�1�������ݣ�
        "name1": value1,
        "name2": value2
    },
    "uid2": { // DOM�ڵ�2�������ݣ�
        "name1": value1,
        "name2": value2
    }
    // ......
};


��1���洢���� $("body").data('zx',520);

 �� Ϊ�˲������ݺ� dom ֱ�ӹ��������Ի�����ݴ洢��һ�� cache �����ϣ�
 �� ����һ�� unlock = Data.uid++ �ı�Ǻţ�
 �� �� unlock ��Ǻţ���Ϊ���Ը��� $("body") ��Ӧ�Ľڵ㣻
 �� �� cache �������� unlock Ϊ���Կ����µĿռ����ڴ洢 'zx' ����

��2����ȡ���� $("body").data('zx');

 �� �� $("body") �ڵ��ϻ�ȡ�� unlock ���ԣ�
 �� ͨ�� unlock �� cache �л�ȡ����Ӧ������ 

*/

/*
�� data ��Ϊ jQuery ʵ������
var div1 = $("#div");
var div2 = $("#div");

div1.data('a',1111);
div2.data('a',2222);

div1.data('a'); // 2222
div2.data('a'); // 2222

�� data ��Ϊ jQuery ��̬����
var div1 = $("#div");
var div2 = $("#div");

$.data(div1,'b',1111);
$.data(div2,'b',2222);

$.data(div1,'b'); // 1111
$.data(div2,'b'); // 2222

�� Ϊ���󸽼�����
var obj = {};

$.data(obj, {
    name1: 'zx',
    name2: 'zc'
});

$.data(obj);
// {name1: "zx", name2: "zc"}

�� Ϊ dom �ڵ㸽������
var bd = $('body');

bd.data('foo',52);

bd.data('foo')
// 52


*/
jQuery.extend({
	acceptData: Data.accepts,

	hasData: function( elem ) {
		return data_user.hasData( elem ) || data_priv.hasData( elem );
	},

	data: function( elem, name, data ) {
		return data_user.access( elem, name, data );
	},

	removeData: function( elem, name ) {
		data_user.remove( elem, name );
	},

	// TODO: Now that all calls to _data and _removeData have been replaced
	// with direct calls to data_priv methods, these can be deprecated.
	_data: function( elem, name, data ) {
		return data_priv.access( elem, name, data );
	},

	_removeData: function( elem, name ) {
		data_priv.remove( elem, name );
	}
});

/*
jQuery ���и�������ԭ���ǣ�

���� $() ѡ�񵽵�һ�� jQuery ʵ��Ԫ�أ�
���������ķ��������ò������������һ��Ԫ�أ���ÿһ�����������ã�
���������ķ����ǻ�ȡ������ֻ���ȡ��һ��Ԫ�صĽ��

eg:
<div id="div1">aaa</div>
<div>bbb</div>
<div>ccc</div>

a) $.('div').html('hello');
// 3 �� div �����ݶ����  hello ��

b) $.('div').html();
// ֻ���ص�һ�� div ������ aaa
 */
jQuery.fn.extend({
	data: function( key, value ) {
		var attrs, name,
			elem = this[ 0 ], // һ��Ԫ����ĵ�һ��Ԫ��
			i = 0,
			data = null;

		// Gets all values
        /*
        eg : 
        $('#div1').data('name','hello');
        $('#div1').data('age',30);

        console.log($('#div1').data('name');  // hello
        console.log($('#div1').data();  // {name : "hello", age : 30}
         */
		if ( key === undefined ) {
			if ( this.length ) {
				data = data_user.get( elem );  // ��һ��Ԫ�ض��ڵ���������

                /*
                html5 ������ data-
                eg:
                <div id="div1" data-miaov="��ζ">aaa</div>
                <div id="div2" data-miaov-all="ȫ����ζ">bbb</div>

                $('#div1').get(0).dataset.miaov     // ��ζ
                $('#div2').get(0).dataset.miaovAll  // ȫ����ζ

                ���������Ҳ�ܱ� data() �����ҵ���

                $('#div1').data('name','hello');
                $('#div1').data('age',30);

                console.log($('div1').data());
                // { name:'hello', age:30, miaov:'��ζ'}

                ���ͨ�� data ���������� p �ǾͲ�����ȡ data-p ���ͬ���� h5 ������(�� data ������ӵ�Ϊ׼)��
                $('#div1').data('name','hello');
                $('#div1').data('age',30);
                $('#div1').data('miaov','cool');

                console.log($('div1').data());
                // { name:'hello', age:30, miaov:'cool'}
                 */
                
                // �ʼû���� hasDataAttrs������ if ���
				if ( elem.nodeType === 1 && !data_priv.get( elem, "hasDataAttrs" ) ) {
					attrs = elem.attributes; 
                    /*
                    ����Ԫ�ص�����������ɵĴ� length ���ԵıȽϸ��ӵĶ��󣬼��������֣�
                    attrs : {0: {name:id}, 1: {name:data-miaov-all}, length: 2}

                    eg: 
                    var pg = document.getElementById('page');
                    var attrs = pg.attributes;;
                    console.table(attrs)
                    ��ӡ�� attrs ���ǿ���ͦ���ӵĶ���
                     */ 
                    
                    // �� data- ���������������뵽 cache ��
					for ( ; i < attrs.length; i++ ) {
						name = attrs[ i ].name;

						if ( name.indexOf( "data-" ) === 0 ) {
                            // data-miaov-allm -> miaovAll
							name = jQuery.camelCase( name.slice(5) );
                            // �� data- ���Լ��뵽 cache ��
                            // data[name] �������п��ܵģ�data[name] �����ھ��� undefined
							dataAttr( elem, name, data[ name ] );
						}
					}
					data_priv.set( elem, "hasDataAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
        /*
        $('div').data({name:'hello',age:30})  ������ʽ
         */
		if ( typeof key === "object" ) {
            // �� $('div') ��ȡ����ÿһ�� div ���������ò���
			return this.each(function() {
				data_user.set( this, key );
			});
		}

		return jQuery.access( this, function( value ) {
			var data,
				camelKey = jQuery.camelCase( key );

			// The calling jQuery object (element matches) is not empty
			// (and therefore has an element appears at this[ 0 ]) and the
			// `value` parameter was not undefined. An empty jQuery object
			// will result in `undefined` for elem = this[ 0 ] which will
			// throw an exception if an attempt to read a data cache is made.
            // ��ȡ
			if ( elem && value === undefined ) {
				// Attempt to get data from the cache
				// with the key as-is
                // �ҵ���ֱ�ӷ���
				data = data_user.get( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to get data from the cache
				// with the key camelized
                // ת�շ壬�ҵ���ֱ�ӷ���
				data = data_user.get( elem, camelKey );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to "discover" the data in
				// HTML5 custom data-* attrs
                // �� data- ���ԣ��ҵ��˾ͷ���
				data = dataAttr( elem, camelKey, undefined );
				if ( data !== undefined ) {
					return data;
				}

				// We tried really hard, but the data doesn't exist.
				return;
			}

			// Set the data...
			this.each(function() {
                /*
                $('#div1').data('name-age','hello');
                �� cache ����Ϊ�� nameAge:'hello'
                cache = {
                    1: {
                        'nameAge':'hello'
                    }
                }

                �������֮ǰ��һ�� nameAge ���ԣ��������ۣ�
                $('#div1').data('nameAge','hi');
                $('#div1').data('name-age','hello');
                �Ǿͻ��Ϊ��
                cache = {
                    1: {
                        'nameAge':'hello',
                        'name-age':'hello'
                    }
                }
                ����Ϊ hello
                 */
                
				// First, attempt to store a copy or reference of any
				// data that might've been store with a camelCased key.
				var data = data_user.get( this, camelKey );

				// For HTML5 data-* attribute interop, we have to
				// store property names with dashes in a camelCase form.
				// This might not apply to all properties...*
				data_user.set( this, camelKey, value );

				// *... In the case of properties that might _actually_
				// have dashes, we need to also store a copy of that
				// unchanged property.
				if ( key.indexOf("-") !== -1 && data !== undefined ) {
					data_user.set( this, key, value );
				}
			});
		}, null, value, arguments.length > 1, null, true );
        // arguments.length > 1 ���ò���
        // arguments.length <= 1 ��ȡ����
	},

	removeData: function( key ) {
		return this.each(function() {
			data_user.remove( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	var name;

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
    /*
    rmultiDash = /([A-Z])/g; �Ҵ�д��ĸ

    �磺
    dataAttr( elem, 'miaovAll', undefined )

    name = "data-" + 'miaovAll'.replace( rmultiDash, "-$1" ).toLowerCase()
    // "data-miaov-all"
     */ 
	if ( data === undefined && elem.nodeType === 1 ) {
		name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();
		data = elem.getAttribute( name );

        // �������ֵһ�����ַ��������� cache ���������͵�ֵ
		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :
					// Only convert to a number if it doesn't change the string
                    // �ַ������� -> ���֣��� '100' -> 100
					+data + "" === data ? +data :
                    // �ַ�������ת�������Ķ���
					rbrace.test( data ) ? JSON.parse( data ) :
					data;

                    /*
                    rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/
                    ƥ�� [xxx] �� {xxx} ��β
                    eg:
                    rbrace.exec('{123}')  ->  ["{123}", index: 0, input: "{123}"]
                    rbrace.exec('sas{123}') -> ["{123}", index: 3, input: "sas{123}"]
                    rbrace.exec('sas[123]') -> ["[123]", index: 3, input: "sas[123]"]
                    
                    
                     */
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			data_user.set( elem, key, data );
		} else {
			data = undefined;
		}
	}
	return data;
}

/*
�� ��ӣ����������������Ǻ�����
function aaa(){
    console.log(1);
}
function bbb(){
    console.log(2);
}
$.queue(document, 'q1', aaa);
$.queue(document, 'q1', bbb);

�� document Ԫ���Ͻ�����Ϊ q1 �Ķ��У�Ȼ��� aaa,bbb �����ֱ���뵽������

queue ����ֻ��2����������ʾ��ȡ���У�

console.log($.queue(document, 'q1'));
// [aaa,bbb]

�� ��ӣ���������������Ϊ������ɵ�����
$.queue(document, 'q1', [aaa,bbb]);

�� ����
$.queue(document, 'q1', [aaa,bbb]);
$.dequeue(document, 'q1');
// ��ӡ 1��ȡ������ aaa������ִ�� aaa()��

$.dequeue(document, 'q1');
// ��ӡ 2��ִ�� bbb()��

�� ʵ����������� ����
$(document).queue('q1',aaa);
$(document).queue('q1',bbb);

console.log($(document).queue('q1'));
// [aaa,bbb]

// ����
$(document).dequeue('q1');  // aaa() -> ��ӡ 1
$(document).dequeue('q1');  // bbb() -> ��ӡ 2

�� ����
#div1 { width:100px; height:100px; background:red; position:absolute;}

$('#div1').ckick(function(){
    $(this).animate({width:300},2000);  ��ʵ�ǵ��� setInterval
    $(this).animate({height:300},2000); ��ʵ�ǵ��� setInterval
    $(this).animate({left:300},2000);   ��ʵ�ǵ��� setInterval
}); 

�Ȼ� 2 ���ȱ�� 300px��Ȼ�� 2 ��߶ȱ�� 300px����� 2 �������ƶ� 300px

һ����������������� 3 ����ʱ�������ᰴ��˳������ִ�У��϶��ᴮ�ģ�
������Ķ���ȷʵ������ǰһ������ִ���꣬�ſ�ʼ��һ������������˳���Ծ��Ƕ��л�������֤��

�� ��ӣ����ӣ�animate
$('#div1').ckick(function(){
    $(this).animate({width:300},2000).queue('fx',function(){
        $(this).dequeue(); // dequeue ����ûдʵ�Σ�Ĭ���� 'fx'
    }).animate({left:300},2000);
}); 

������������ڲ�ʹ�õ����־��� fx���м����Ӻ����ı���Ҫ���� dequeue ���ӣ��������Ķ�������ִ�С�

����д���൱�ڣ�

$('#div1').ckick(function(){
    $(this).animate({width:300},2000).queue('fx',function(next){
        next();
    }).animate({left:300},2000);
}); 

 */

jQuery.extend({
    // ��ӣ��൱������� push ����
    /*
    ����������� setter ���� getter
    ��һ�������� dom Ԫ�أ�
    �ڶ��������Ƕ������ƣ�
    ������������ function �� ����

    ��������������������ӣ������������������ǻ�ȡ����
    */
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
            // Ĭ�ϵĶ��������� fx
			type = ( type || "fx" ) + "queue";
			queue = data_priv.get( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray( data ) ) {
                    /*
                    һ������£���һ��ȡ�����������ԣ��� !queue Ϊ true��,���ʼ��һ������ queue
                    
                    ���ǣ�Ϊʲô data ������Ҳ�������ʼ�������أ�

                    $.queue(document, 'q1', aaa);
                    $.queue(document, 'q1', [bbb]);

                    console.log($.queue(document, 'q1'))
                    // [bbb]

                    ��˵�����������������������ʱ�����ܶ�����ǰ�����ʲô�������³�ʼ��
                     */
					queue = data_priv.access( elem, type, jQuery.makeArray(data) );
				} else {
					queue.push( data );
                    /*
                    queue Ϊʲô�������أ�

                    access ���������һ���ǣ�
                    return value !== undefined ? value : key;

                    ���ǿ�������� access ������󷵻صľ��� value����������� jQuery.makeArray(data)����Ȼ��������
                     */
				}
			}
            // �����д 2 ����������û������� push �Ȳ����ˣ�ֱ�ӷ��� queue
			return queue || [];
		}
	},
    // ���ӣ��൱������� shift ����
    // �ϱߵ������У����ǳ���ʱ���ǵ��� dequeue ������ÿ����Ҫ���ӣ�����������һ�� dequeue
    // Ҳ����˵���ϱ߳��Ӷ��ٴΣ����Ǿ͵����˶��ٴ� dequeue ����
    // ���������Ҫ����һ�� dequeue��Ȼ��ִ�ж�γ��Ӳ������͵ÿ������ next ����
    // Ҳ����˵����һ����������ʱ����������һ�� next �������Ϳ��Դ�����һ�γ�����
    // ���ÿ����������ʱ������������ next �������ǾͰ��������д������ˣ���������ִ��һ�� dequeue �Ϳ��Գ�������
	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
            // queue ֻ�� 2 �����������ض��� queue
			startLength = queue.length,
            // ��ͷ�ĺ���
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
                // ����Ƕ������� fx,�� inprogress ���뵽��ͷ
				queue.unshift( "inprogress" );
			}

			// clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
            /*
            ����
            var body = $('body');
            function cb1(next,hoost) {
                console.log(11111)
                next()  
            }

            function cb2() {
                console.log(22222)
            }

            //set
            $.queue(body, 'aa', cb1); // ����������Ϊfunction
            $.queue(body, 'aa', cb2);

            $.dequeue(body, 'aa');
            // ���δ�ӡ 11111��22222
            */
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
            // ����������
		}
	},

	// not intended for public consumption - generates a queueHooks object, or returns the current one
    // ���ӽ�����������л�������
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return data_priv.get( elem, key ) || data_priv.access( elem, key, {
			empty: jQuery.Callbacks("once memory").add(function() {
				data_priv.remove( elem, [ type + "queue", key ] );
			})
		});
        /*
        access �����������õ�ʱ�򣬷��ص��ǵ��������������ԣ�
        ��һ�ν�����_queueHooks �����ķ���ֵ�ǣ�
         {
			empty: jQuery.Callbacks("once memory").add(function() {
				data_priv.remove( elem, [ type + "queue", key ] );
		  }
          empty ��һ���ص����󣬲��������һ���ص�����
          �ص����� fire ��ʱ��� type + "queue"��type + "queueHooks" �������Զ�ɾ��
        */
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
            // ��ȡ��ʱ��jQuery ��ͨ�������ǻ�ȡ��һ���Ӧ��ֵ
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
            // ��ȡ��ʱ��jQuery ��ͨ�������Ƕ�ÿһ��ֱ��������
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				// ensure a hooks for this queue
				jQuery._queueHooks( this, type );

                /*
                
                $(this).animate({width:300},2000);
                $(this).animate({height:300},2000);
                $(this).animate({left:300},2000);

                ����Ķ���������ִ�У���ʵ����һ������ fx

                Ϊʲô������Ӷ�����Ϳ�������ִ�ж����أ�
                ��ʵ�����ǡ���ӡ������Ͻ��С����ӡ�

                Ҳ��������ģ�������Ϊ fx�����Ҷ�ͷԪ�ز��� inprogress���ͳ���

                Ȼ��ÿ�� animate �������� next �������Ϳ���ʹ�����ж�����������
                 */

				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
    /*
    �� ��1��
    $('#div1').click(function(){
        $(this).animate({width:300},2000).animate({left:300},2000);
    });

    ��� ID Ϊ div1 ��Ԫ�غ������Ȼ� 2 ���� 300px����� 2 �������ƶ� 300px

    �� ��2��
    $('#div1').click(function(){
        $(this).animate({width:300},2000).delay(2000).animate({left:300},2000);
    });

    ��� ID Ϊ div1 ��Ԫ�غ������Ȼ� 2 ���� 300px��ͣ�� 2 �룬Ȼ���ٻ� 2 �������ƶ� 300px


    jQuery.fx.speeds = {
        slow : 600,
        fast : 200,
        _default : 400
    };

    delay(slow) ��ָ�� fx �����ӳ� 600 ����
     */
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

        // ����֮ǰ�����һ��������ʱ�� time �������һ������
		return this.queue( type, function( next, hooks ) {
			var timeout = setTimeout( next, time );
			hooks.stop = function() {
				clearTimeout( timeout );
			};
            // ����� animate �����л���� hooks.stop ����
		});
	},
    // ��ն��У����Ѷ��б�ɿ�����
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
    /*
    �� ��1��
    $('#div1').click(function(){
        $(this).animate({width:300},2000).animate({left:300},2000);
        $(this).promise().done(function(){
            alert(123);
        });
    });

    ��� ID Ϊ div1 ��Ԫ�غ������Ȼ� 2 ���� 300px����� 2 �������ƶ� 300px;
    ��󣬵��� 123
     */ 
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while( i-- ) {
            /*
            tmp = {
                empty: jQuery.Callbacks("once memory").add(function() {
                    data_priv.remove( elem, [ type + "queue", key ] );
                })
            }

            ǰ��д dequeue ��������ִ�� hooks.empty.fire();
            Ҳ����ÿ�γ��ӻ��������� resolve ����
            �ȵ� count ���� 0 ʱ�ͻ���� defer.resolveWith( elements, [ elements ] )
             */
			tmp = data_priv.get( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
});

/*
�� attr()   ��ȡƥ���Ԫ�ؼ����еĵ�һ��Ԫ�ص����Ե�ֵ �� ����ÿһ��ƥ��Ԫ�ص�һ���������ԡ�
�� prop() ��ȡƥ���Ԫ�ؼ��е�һ��Ԫ�ص����ԣ�property��ֵ �� ����ÿһ��ƥ��Ԫ�ص�һ���������ԡ�
�� removeAttr() Ϊƥ���Ԫ�ؼ����е�ÿ��Ԫ�����Ƴ�һ�����ԣ�attribute����
�� removeProp() Ϊ������ƥ���Ԫ��ɾ��һ�����ԣ�property����
�� val() ��ȡƥ���Ԫ�ؼ����е�һ��Ԫ�صĵ�ǰֵ �� ����ƥ���Ԫ�ؼ�����ÿ��Ԫ�ص�ֵ

��ô attribute �� property ��ʲô�����أ�

����
<input id="cbox" type="checkbox" checked="checked" />

$('input').attr('checked')   // checked
$('input').prop('checked')   // true

attr() ������ȡֱ��д�ڱ�ǩ�ϵ����ԣ�attribute��������ͨ�� setAttribute��getAttribute �������á���ȡ
prop() ������ͨ�� . �����������á���ȡ�����ԣ�property��

�����Ƕȿ���
var cbox = document.getElementById('cbox');

�� ��Ӧ attr ����
cbox.getAttribute('checked')  // checked

�� ��Ӧ prop ����
cbox['checked'] // true
cbox.checked    // true

�� ��ȡ id
$('input').attr('id')   // cbox
$('input').prop('id')   // cbox

cbox.getAttribute('id') // cbox
cbox.id                 // cbox
cbox['id']              // cbox

id ���ֳ������ԣ����ַ�������ֵһ��

�� �����Զ�������

$('input').attr('miaov','��ζ')
input ���Ϊ��
<input id="cbox" miaov="��ζ" type="checkbox" checked="checked" />

$('input').prop('miaov','��ζ')
input ���ǣ�
<input id="cbox" type="checkbox" checked="checked" /> û��ʾ���� miaov ����

�����ַ�����������ģ�������� id �ȳ�������������һ���ġ�

�� ��ȡ�Զ�������
������ input ��ǩ���£�
<input id="cbox" miaov="��ζ" type="checkbox" checked="checked" />

$('input').attr('miaov')   // ��ζ
$('input').prop('miaov'��  // ����ȡ����ֵ�����������������ؿգ�

�� ɾ������
<input id="cbox" miaov="��ζ" type="checkbox" checked="checked" />

$('input').removeAttr('id')   ����ɾ�� id ����
$('input').removeProp('id')   ɾ������ id ����


�ܵ���˵��
���������ܽ�Ϊ attribute �ڵ㶼���� HTML �����пɼ��ģ�
�� property ֻ��һ����ͨ����ֵ������
*/
var nodeHook, boolHook,
    /*
    \t ˮƽ�Ʊ�������һ�� Tab λ�ã�
    \r �س�������ǰλ���Ƶ����п�ͷ
    \n ���У�����ǰλ���Ƶ���һ�п�ͷ
    \f ��ҳ������ǰλ���Ƶ���ҳ��ͷ
    */
	rclass = /[\t\r\n\f]/g,
	rreturn = /\r/g,
	rfocusable = /^(?:input|select|textarea|button)$/i;

jQuery.fn.extend({
	attr: function( name, value ) {
        /*
        �� jQuery.access: function( elems, fn, key, value, chainable, emptyGet, raw ) {}

        ���У�
        elems �ǲ����Ķ���
        fn ���õķ���
        key ����/��ȡ��������
        value ���õ�����ֵ
        chainable Ϊ true ��ʾ���ò�����false ��ʾ��ȡ����
        
        emptyGet, raw ��Щû���Ĳ������� undefined

        �� ���Ļᶨ�� jQuery.attr ����
        */
		return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},

	prop: function( name, value ) {
		return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		return this.each(function() {
            // prop �Ƕ�������ԣ�����ֱ��ͨ�� [] �� . �����ȡ��
			delete this[ jQuery.propFix[ name ] || name ];
		});
	},

    /*
    �� ����Ϊһ�� class ��
    $( "p" ).last().addClass( "selected" );
    ���һ�� p ��ǩ��һ����Ϊ selected �� class

    �� ����Ϊ��� class ��
    $( "p:last" ).addClass( "selected highlight" );
    ���һ�� p ��ǩ���� selected��highlight ������ class

    �� ����Ϊ���� function
    $( "div" ).addClass(function( index, currentClass ) {
      var addedClass;
     
      if ( currentClass === "red" ) {
        addedClass = "green";
        $( "p" ).text( "There is one green div" );
      }
     
      return addedClass;
    });
    ���ĳ�� div ����Ϊ red �� class���Ǿ͸����ټ�һ����Ϊ green �� class  
    */
	addClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = typeof value === "string" && value;
            /*
            �� ������� value ���ַ�������ô proceed ��������ַ���
            �� ������� value �����ַ�������ô proceed ���� false
            */
    
        // ���� value �Ǻ���
        // value.call( this, j, this.className ) �᷵��һ�� class ������ undefined
		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call( this, j, this.className ) );
			});
        }
        /*
        �� ����� this.each �е� this ָ���ǵ�ǰ jQuery ʵ������
        ���ǣ�jQuery( this ) �е���� this ����ָʲô�أ�

        �Ǿ��ȴ� each ������������� each �� jQuery ʵ��������
        each: function( callback, args ) {
            return jQuery.each( this, callback, args );
        }
        
        ������� jQuery �ľ�̬���� jQuery.each( this, callback, args );
        
        ��̬���� jQuery.each��
        jQuery.each: function( obj, callback, args ){}
        �ڶ������� callback �ڲ��� this ���Ϊ��һ������������ obj[i]��һ��������� obj[0]���Ǹ�ԭ�� dom Ԫ�أ�
        callback.apply( obj[ i ], args )

        ���Բ���д�ɣ�
        this.addClass( value.call( this, j, this.className ) );

        ��Ϊ����� this ��ԭ�� dom Ԫ��

        �� value.call( this, j, this.className ) �е� this.className ��ָ�ڵ㵱ǰ�� class

        �� ������� j ����ָʲô��
        ����� callback.apply( obj[ i ], args )��ʵ��Ϊ args���� this.each �ĵڶ���ʵ�� undefined
        ���ԣ�����ʱ��j ���� undefined
        */
		
        // ���� value ���ַ���
		if ( proceed ) {
			// The disjunction here is for better compressibility (see removeClass)
            /*
            ƥ�����ⲻ�ǿհ׵��ַ���
            core_rnotwhite = /\S+/g
            
            eg:
            "selected highlight".match(/\S+/g)
            // ["selected", "highlight"]
            */
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
                /*
                \t ˮƽ�Ʊ�������һ�� Tab λ�ã�
                \r �س�������ǰλ���Ƶ����п�ͷ
                \n ���У�����ǰλ���Ƶ���һ�п�ͷ
                \f ��ҳ������ǰλ���Ƶ���ҳ��ͷ

                rclass = /[\t\r\n\f]/g

                �ѽڵ�ԭ���� class ��ǰ����Ͽո񣬷�������µ� class 
                ( " " + 'cls' + " " ).replace( /[\t\r\n\f]/g, " " )
                // " cls "

                ���⣬���ԭ����û�� class 
                ( " " + '' + " " ).replace( /[\t\r\n\f]/g, " " )
                // "  "
                */
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					" "
				);

                /*
                ԭ��û�� class ���� cur ��Ϊ true �𣿻ᣡ��
                !! "  "
                // true

                ����˵��elem.nodeType === 1 ���Ҳ��� value ���ַ����ͻ�������
                */
                // ����Ҫ�� cur Ϊ�棬��ʵ��Ҫ�� elem.nodeType === 1��Ԫ������Ϊ��ǩ�ڵ�
				if ( cur ) {
					j = 0;
                    // ���� classes ���飺["selected", "highlight"]
					while ( (clazz = classes[j++]) ) {
                        // < 0 ����ԭ��û��� class���ǾͰ����ӽ���
                        // ǰ���пո񣬺ܺõı������µ� class ��ԭ class �ַ������Ӵ������
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}
                    // ���ȥ��ǰ��ո�
					elem.className = jQuery.trim( cur );
				}
			}
		}

		return this;
	},

    /*
    �� ����Ϊһ�� class ��
    $( "p:even" ).removeClass( "blue" );
    ����Ϊż����0,2,4...���� p ��ǩɾ����Ϊ blue �� class

    �� ����Ϊ��� class ��
    $( "p:odd" ).removeClass( "blue under" );
    ����Ϊ������1,3,5...���� p ��ǩɾ����Ϊ blue �� under �� class

    �� ����Ϊ��
    $( "p:eq(1)" ).removeClass();
    ɾȥ�� 2 �� p ��ǩ������ class

    �� ����Ϊ����
    $( "li:last" ).removeClass(function() {
      return $( this ).prev().attr( "class" );
    });
    ɾ�������������ص� class
    */
	removeClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = arguments.length === 0 || typeof value === "string" && value;
            /*
            ע�⣺����� && ��������ȼ����� || ���������ϴ����൱�ڣ�
            proceed = arguments.length === 0 || (typeof value === "string" && value);

            �� ���������������ô proceed ���� true������ͻ�ɾ�����е� class
            �� ������� value ���ǿ��ַ�������ô��ô proceed ���� true�������ɾ����Ӧ�� class
               �������и����ࣺ��� value �� ' '��typeof ' ' === "string" && ' ' -> ' '��
                ����� ( value || "" ).match( core_rnotwhite ) ����˵��ģ�
            �� ����в��������Ҳ��� value �����ַ�������ô proceed ���� false
            */

        // ����Ϊ����
        // value.call( this, j, this.className ) �᷵��һ�� class ������ undefined
		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call( this, j, this.className ) );
			});
		}

        // proceed Ϊ�棬˵��
		if ( proceed ) {
            /*
            ƥ�����ⲻ�ǿհ׵��ַ���
            core_rnotwhite = /\S+/g
            
            eg:
            "selected highlight".match(/\S+/g)
            // ["selected", "highlight"]
            */
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				// This expression is here for better compressibility (see addClass)
                /*
                \t ˮƽ�Ʊ�������һ�� Tab λ�ã�
                \r �س�������ǰλ���Ƶ����п�ͷ
                \n ���У�����ǰλ���Ƶ���һ�п�ͷ
                \f ��ҳ������ǰλ���Ƶ���ҳ��ͷ

                rclass = /[\t\r\n\f]/g

                �ѽڵ�ԭ���� class ��ǰ����Ͽո񣬷�������µ� class 
                ( " " + 'cls' + " " ).replace( /[\t\r\n\f]/g, " " )
                // " cls "

                ���⣬���ԭ����û�� class 
                ( " " + '' + " " ).replace( /[\t\r\n\f]/g, " " )
                // "  "
                */
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					""
				);
                
                // ��� cur ��Ϊ�棬˵�� elem.nodeType !== 1 ����˵ԭ����û�� class���Ǿ�û��Ҫ������
				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						// Remove *all* instances
                        // class ���ڣ���ɾ��֮
						while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}
                    // ����������� value��Ҳ���� undefined���Ǿ���� class 
					elem.className = value ? jQuery.trim( cur ) : "";
				}
			}
		}

		return this;
	},

    /*
    �� ����Ϊ�ַ��������/ɾ��ָ�� class
    .toggleClass( className )
    className ָ 1 ���������ո�ָ��� class ��

    �� ��һ������Ϊ�ַ������ڶ�������Ϊ����ֵ
    .toggleClass( className, state )
    state ��������ӻ���ɾ�� class

    �� ��һ������Ϊ�������ڶ�����������ֵ��ѡ
    .toggleClass( function [, state ] )
    function �����룺(Ԫ������,�ɵ� class ֵ,����״̬)
    function �������class ��
    */
	toggleClass: function( value, stateVal ) {
		var type = typeof value;

        // �����һ���������ַ��������ҵڶ��������ǲ���ֵ
		if ( typeof stateVal === "boolean" && type === "string" ) {
            // �ڶ�������Ϊ stateVal Ϊ true ��� class��stateVal Ϊ false ɾ�� class
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

        /*
        �����һ�������Ǻ������ݹ����
        value.call(this, i, this.className, stateVal) �᷵��һ�� class ֵ
        */
		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
            // ��һ������Ϊ�ַ������ڶ����������ǲ���ֵ�����߸���û�еڶ�������
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					classNames = value.match( core_rnotwhite ) || [];
                /*
                    "selected highlight".match(/\S+/g)
                    // ["selected", "highlight"]
                */

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space separated list
                    // ���� ["selected", "highlight"] ����
                    // ����� class ��ɾ��֮��û����� class �ͼ���
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
            // ����Ϊ���ա�����undefined���򡾲���ֵ��
			} else if ( type === core_strundefined || type === "boolean" ) {
                // ��ԭ���� class ������
				if ( this.className ) {
					// store className if set
					data_priv.set( this, "__className__", this.className );
				}

				// If the element has a class name or if we're passed "false",
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
                /*
                    �� ԭ���� class ����ֵΪ false����� class
                    �� ����ͻָ�ԭ���� class����ԭ�����ȡ������
                    �� ��������û�� class���Ǿ�û�д� class ����������Ǵӻ���Ҳȡ���������ͷ��� ""��
                */
				this.className = this.className || value === false ? "" : data_priv.get( this, "__className__" ) || "";
			}
		});
	},

    // �ж��Ƿ�����Ϊ selector �� class
    // ������ö�����һ��Ԫ�أ�ֻҪ��һ��Ԫ�ذ������ class �ͷ��� true
    /*
    Ϊʲô������ ��������ö�����һ��Ԫ�أ�ֻҪ��һ��Ԫ�ذ������ class �ͷ��� true����
    ��һ�� togglClass Ƭ�ξͶ��ˣ�
    if ( self.hasClass( className ) ) {
        self.removeClass( className );
    } else {
        self.addClass( className );
    }
    ��� self ��һ��Ԫ�أ�ֻҪ��һ��Ԫ������һ��Ԫ�ذ��� className ��� class��
    �ǾͶ� self ��һ��Ԫ�أ���ɾȥ className ��� class

    ���ԣ���ô���� hasClass �������е����
    */
	hasClass: function( selector ) {
        // selector ǰ��ӿո���Ϊ�˱��� selector ��ԭ�� className �Ӵ������
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
            /*
                rclass = /[\t\r\n\f]/g

                �ѽڵ�ԭ���� class ��ǰ����Ͽո񣬷�������µ� class 
                ( " " + 'cls' + " " ).replace( /[\t\r\n\f]/g, " " )
                // " cls "

                ���⣬���ԭ����û�� class 
                ( " " + '' + " " ).replace( /[\t\r\n\f]/g, " " )
                // "  "
            */
            // ����һ��Ԫ�أ�ֻҪ��һ��Ԫ���ҵ��ˣ��ͷ��� true
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
				return true;
			}
		}

		return false;
	},

    /*
    �� ����Ϊ��
    ��ȡѡ����ƥ�䵽�ĵ�һ��Ԫ�ص� value ֵ
    
    �� һ���������ַ��� | ���� | ���飩
    Ϊѡ����ƥ�䵽��ÿһ��Ԫ������ value ֵ
    
    �� һ��������������
    ���룺��Ԫ������ֵ���ɵ� value��
    ����������õ��µ� value
    */
	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[0];

        // ����Ϊ�գ���ȡ value
		if ( !arguments.length ) {
			if ( elem ) {
                /*
                valHooks: {
                    option: {
                        get: function( elem ) {}
                    },
                    select: {
                        get: function( elem ) {},
                        set: function( elem, value ) {}
                    }
                }
                ����ʵ����������涨�壬���滹�ж�̬��� radio��chechbox �ȱ�ǩ��

                �� elem.type
                һ��Ԫ�ص� type �� undefined���� 
                $('div')[0].type    // undefined
                Ҳ��Ԫ���� type ���ԣ�
                $('button')[0].type // button
                
                �� elem.nodeName.toLowerCase()
                <select id="multiple" multiple="multiple">
                    <option selected="selected">Multiple</option>
                    <option>Multiple2</option>
                    <option selected="selected">Multiple3</option>
                </select>
                
                ����� select��option ��ǩ����Ҫ����������
                */
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

                // ������Ҫ���� select��option ��Ԫ��������ȡ��ͷ�����
				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;
                
                /*
                rreturn = /\r/g;
                */
				return typeof ret === "string" ?
					// handle most common string cases
                    // ȥ���ַ����еĻس���Ȼ�󷵻��ַ���
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
                    // null | undefined ���� ""�����ֵ��������ͣ�ֱ�ӷ���
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var val;

            // ����Ԫ�����ͣ�ֱ�ӷ���
			if ( this.nodeType !== 1 ) {
				return;
			}

            // �����Ǻ���
			if ( isFunction ) {
                // �õ�һ���µ� value ֵ������ jQuery( this ).val()  ��ԭ���� value ֵ
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
            // undefined | null -> ""
			if ( val == null ) {
				val = "";
            // ����ת��Ϊ�ַ���
			} else if ( typeof val === "number" ) {
				val += "";
            // �������ÿһ��ת���ַ���
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
                    // ���� jQuery.map �����Ķ��壬����� value �������Ԫ�أ�������Ԫ������
					return value == null ? "" : value + "";
				});
                /*
                val = [null,23,'232','abc']
                -> var = ["", "23", "232", "abc"]
                */
			}
            // ���ˣ��Ѿ�����Ҫ���õ� val �������
            
            // select��radio��checkbox �ȱ�ǩ��Ҫ����������
			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
                /*
                �൱�ڣ�

                if (hooks){
                    if ("set" in hooks){
                        if (hooks.set( this, val, "value" ) === undefined){
                            this.value = val;
                        }
                    } else {
                        this.value = val;
                    }
                } else {
                    this.value = val;
                }

                û���ù��Ӽ����������������ֱ�Ӹ�ֵ
                 */
				this.value = val;
			}
		});
	}
});

/*
����˵��һ�¹��ӻ��ƣ�

�� ���ù��ӻ��ƣ�Ҫд�ܶ� if-else

// ���������Լ�������
function examinee(name, score, fatherName) {
    return {
        name: name,
        score: score,
        fatherName: fatherName
    };
}
  
// ���Ŀ�����
function judge(examinees) {
    var result = {};
    for (var i in examinees) {
        var curExaminee = examinees[i];
        var ret = curExaminee.score;
        // �ж��Ƿ��к��Ź�ϵ
        if (curExaminee.fatherName === 'xijingping') {
            ret += 1000;
        } else if (curExaminee.fatherName === 'ligang') {
            ret += 100;
        } else if (curExaminee.fatherName === 'pengdehuai') {
            ret += 50;
        }
        result[curExaminee.name] = ret;
    }
    return result;
}
  
  
var lihao = examinee("lihao", 10, 'ligang');
var xida = examinee('xida', 8, 'xijinping');
var peng = examinee('peng', 60, 'pengdehuai');
var liaoxiaofeng = examinee('liaoxiaofeng', 100, 'liaodaniu');
  
var result = judge([lihao, xida, peng, liaoxiaofeng]);
  
// ���ݷ���ѡȡǰ����
for (var name in result) {
    console.log("name:" + name);
    console.log("score:" + score);
}

�� ���ù���

// relationHook �Ǹ����Ӻ��������ڵõ���ϵ�÷�
var relationHook = {
    "xijinping": 1000,   
    "ligang": 100,
    "pengdehuai": 50,
���� // �µĿ���ֻ��Ҫ�ڹ�������ӹ�ϵ��
}
 
// ���������Լ�������
function examinee(name, score, fatherName) {
    return {
        name: name,
        score: score,
        fatherName: fatherName
    };
}
  
// ���Ŀ�����
function judge(examinees) {
    var result = {};
    for (var i in examinees) {
        var curExaminee = examinees[i];
        var ret = curExaminee.score;
        if (relationHook[curExaminee.fatherName] ) {
            ret += relationHook[curExaminee.fatherName] ;
        }
        result[curExaminee.name] = ret;
    }
    return result;
}
  
  
var lihao = examinee("lihao", 10, 'ligang');
var xida = examinee('xida', 8, 'xijinping');
var peng = examinee('peng', 60, 'pengdehuai');
var liaoxiaofeng = examinee('liaoxiaofeng', 100, 'liaodaniu');
  
var result = judge([lihao, xida, peng, liaoxiaofeng]);
  
// ���ݷ���ѡȡǰ����
for (var name in result) {
    console.log("name:" + name);
    console.log("score:" + score);
}

ʹ�ù���ȥ������������������ô�����߼�����������ʡȥ�����������жϣ�
����Ĺ��ӻ��Ƶ�ʵ�ַ�ʽ�����õľ��Ǳ�������ʽ��
������������Ԥ����һ�ű��׳ƴ���������ű�ȥ�������������
 */

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// attributes.value is undefined in Blackberry 4.7 but
				// uses .value. See #6932
				var val = elem.attributes.value;
				return !val || val.specified ? elem.value : elem.text;
                /*
                ����һ��ʼ�����뵱Ȼ����Ϊ��������ȼ��ڣ�
                !val || (val.specified ? elem.value : elem.text);

                һ�� val Ϊ undefined���������ͻ�ִ�в�ͨ������

                ��ʵ����һ����������ȼ���
                ���ȼ�5	�߼���	������	|| 
                ���ȼ�4	���������	���ҵ���	? : 

                �������Ӧ�õȼ��ڣ�
                (!val || val.specified) ? elem.value : elem.text;
                �� �� val Ϊ undefined ��ʱ�򣬾ͷ��� elem.value��
                �� ���� val.specified Ϊ�棬���� elem.text

                eg: 
                �� ����ȷ�� value ���ԣ�������� value ���ԣ�
                <option id="opt" value="hello">111</option>
                opt.value // hello
                �� û����ȷ�� value ���ԣ������ı�����
                <option id="opt">111</option>
                opt.value // 111
                */
			}
		},
        /*
        <select id="multiple" multiple="multiple">
            <option selected="selected">Multiple</option>
            <option>Multiple2</option>
            <option selected="selected">Multiple3</option>
        </select>
        */
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,     //  [option, option, option, selectedIndex: 1]
					index = elem.selectedIndex, // 1
					one = elem.type === "select-one" || index < 0, // false ��ѡ���Ƕ�ѡ
					values = one ? null : [],  // [] ��ѡ������ʱ��ֵֻ��һ������ѡ����ֵ��һ��
					max = one ? index + 1 : options.length, // 3
					i = index < 0 ?
						max :
						one ? index : 0; // 0

				// Loop through all the selected options
                // ��������ѡ�е� option
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// IE6-9 doesn't update selected after form reset (#2551)
                    // ȷ����ǰ option ��ѡ����
					if ( ( option.selected || i === index ) &&
							// Don't return options that are disabled or in a disabled optgroup
                            // ȷ�� option û�� disabled�����Ҹ��ڵ�Ҳ���� disabled�����ڵ�Ҳ������ optgroup
							( jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null ) &&
							( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
                        // ��ȡÿһ�� option �� value
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
                        // Multi-Selects ����һ������
						values.push( value );
					}
				}

				return values;
			},

            // value ��ĳ��option ƥ�����ˣ���ѡ�����Ǹ� option
			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];
                    /*
                    option.selected ��ֵ����Ϊ true �� false
                    ���ĳ�� option ��ֵ jQuery(option).val() ��������Ҫ���õ� values ���������
                    ��ô����� option.selected ���� true
                    */
					if ( (option.selected = jQuery.inArray( jQuery(option).val(), values ) >= 0) ) {
						optionSet = true;
					}
				}

				// force browsers to behave consistently when non-matching value is set
                // ���һ����û��ƥ�䵽���� selectedIndex ǿ�Ƹĳ� -1
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	attr: function( elem, name, value ) {
		var hooks, ret,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
        // �ڵ㲻���ڣ����߽ڵ������ǡ��ı�������ע�͡��������ԡ����Ǿͷ��أ���ʵ�൱�ڷ��� undefined
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
        /*
        typeof elem.getAttribute === "undefined"
        ����ڵ㲻֧�� getAttribute �������Ǿ��� jQuery.prop ����

        �ٸ����ӣ�
        $(document).attr('title','hello');
        ������û�õģ�document û�� getAttribute��setAttribute �ȷ���

        document.getAttribute // undefined
        document.setAttribute // undefined
         */
		if ( typeof elem.getAttribute === core_strundefined ) {
			return jQuery.prop( elem, name, value );
		}

		// All attributes are lowercase
		// Grab necessary hook if one is defined
        /*
        ˵һ˵ jQuery �е� hooks ���ƣ�

        ���� support ���й��ܼ�⣬Ȼ����һϵ�� hooks �������м������޸������������ attrHooks ��������һ��
        һ�� attrHooks ���෽�����ж�����ԣ������Ǽ��������м��������⣬������������ get ������˵���л�ȡ����������
        ������������ set ������˵�������ü��������⡣attrHooks ��û�е�����˵���������ģ��ǾͲ��ù��ˡ�

        attrHooks: {
            type: {
                set: function( elem, value ) {}
            }
        }

        ����ֻ�� type ���Ժ� set �����ԣ�˵�� type ���Ե����ã�set����Ҫ����

         */ 
        // ��ȡ���ӷ�����������ĳ�����Եġ�����/��ȡ����������
        // ���Ͳ�ΪԪ�ؽڵ㣬���߲��� xml �ڵ�
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : nodeHook );
                // nodeHook �� undefined
		}
        /*
        booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped";
        jQuery.expr.match.bool : new RegExp( "^(?:" + booleans + ")$", "i" );
        �൱�ڣ�
        jQuery.expr.match.bool : /^(?:checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped)$/i
         
        boolHook = {
            set: function( elem, value, name ) {
                if ( value === false ) {
                    // Remove boolean attributes when set to false
                    jQuery.removeAttr( elem, name );
                } else {
                    elem.setAttribute( name, name );
                }
                return name;
            }
        };

        �����ӣ�
        ���� <input type="checkbox" checked="checked">
        $('input').attr('checked') // checked
        $('input').prop('checked') // true

        $('input').attr('checked','checked') ����д����Ȼ�Ǻõģ�
        ���� $('input').attr('checked',true) �������أ�

        ���ϵ� boolHook �Ǽ�������д���ģ�
        $('input').attr('checked',true) 
        -> elem.setAttribute( name, name ) 
        -> input.setAttribute( 'checked', 'checked' )
        
         */

        // �е������������������ò���
		if ( value !== undefined ) {

            // ����Ϊ null����ɾ���������
			if ( value === null ) {
				jQuery.removeAttr( elem, name );

            // hooks ��� set �м�������������ԣ��� type ������ set ��������
			} else if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;
            // û�м������⣬�͵��� setAttribute �ͺ��ˣ����ﻹ�Ѵ����õ�ֵǿ��ת�����ַ���
			} else {
				elem.setAttribute( name, value + "" );
				return value;
			}
        // û�е��������������ж�ȡ�������ȿ���û����Ҫ�м�������
		} else if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
			return ret;
        // û�м�������
		} else {
            // jQuery.find = Sizzle
            // Sizzle.attr() �Ѿ�ʵ���˻�ȡ�����������������ֱ����
			ret = jQuery.find.attr( elem, name );

			// Non-existent attributes return null, we normalize to undefined
			return ret == null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( core_rnotwhite );
        /*  
            var core_rnotwhite = /\S+/g;

            "selected highlight".match(/\S+/g)
            // ["selected", "highlight"]

            �������� value �����ַ��������ϱ���
        */

        // ��ȡ���� attribute ����������Ԫ��
		if ( attrNames && elem.nodeType === 1 ) {
			while ( (name = attrNames[i++]) ) {
                /*
                propFix: {
                    "for": "htmlFor",
                    "class": "className"
                }
                ����������������ȡһ��Ԫ�ص� class Ӧ���ǣ�
                elem['className'] �� elem.className

                ���ԣ�������д��������ɾ�� class
                �� $('#div1').removeAttr('class');
                �� $('#div1').removeAttr('className');
                */
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
                /*
                jQuery.expr.match.bool : 
                /^(?:checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped)$/i
                
                ����ֵΪ����ֵ����������Դ�
                */
				if ( jQuery.expr.match.bool.test( name ) ) {
					// Set corresponding property to false
					elem[ propName ] = false;
				}
                
                // һ������£�ֱ�ӵ���ԭ���� removeAttribute ����
				elem.removeAttribute( name );
			}
		}
	},

    /*
    ˵�� type ���Ե� set �м�������
    ֮ǰ support ���м�⵽������ support.radioValue

    // Check if an input maintains its value after becoming a radio
    // Support: IE9, IE10
    // input ��� radio ���Ƿ񱣳�ԭ���� value
    input = document.createElement("input");
    input.value = "t";
    input.type = "radio";
    support.radioValue = input.value === "t";

     */
	attrHooks: {
		type: {
			set: function( elem, value ) {
                // �� support.radioValue ���������⣬����Ҫ���� input Ԫ�ص� type Ϊ radio
				if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to default in case type is set after value during creation
					
                    // �ȴ���ԭ���� input.value ֵ
                    var val = elem.value;
                    // ���� input.type = "radio";
					elem.setAttribute( "type", value );

                    // ���ԭ������ input.value ֵ�����¸�ֵ��ȥ�������ϱߵĲ����޸��� value ����ֵ
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

    // �����������������ȡ class��Ӧ���� elem.className
    
	propFix: {
		"for": "htmlFor",
		"class": "className"
	},
    /*
    ���滹�м����������Ե�Сд��ʽ��
    jQuery.each([
        "tabIndex",
        "readOnly",
        "maxLength",
        "cellSpacing",
        "cellPadding",
        "rowSpan",
        "colSpan",
        "useMap",
        "frameBorder",
        "contentEditable"
    ], function() {
        jQuery.propFix[ this.toLowerCase() ] = this;
    });
     */

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
        // �ı���ע�ͣ����ԵȽڵ�����ֱ�ӷ��أ�undefined��
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

        // ���� xml
		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
            /* 
            ��������������Ȼ��ȥ hooks ��ƥ��
            propHooks: {
                tabIndex: {
                    get: function( elem ) {}
                }
            }
            */
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}
        
        // ���� prop��һ������£�elem[ name ] = value
		if ( value !== undefined ) {
			return hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ?
				ret :
				( elem[ name ] = value );
        // ��ȡ prop��һ������£�elem[ name ]
		} else {
			return hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ?
				ret :
				elem[ name ];
		}
	},

    /*
    ����д����
    if ( !jQuery.support.optSelected ) {
        jQuery.propHooks.selected = {
            get: function( elem ) {
                var parent = elem.parentNode;
                if ( parent && parent.parentNode ) {
                    parent.parentNode.selectedIndex;
                }
                return null;
            }
        };
    }
    ֻҪ�ڻ�ȡoption��selected��ֵʱ���ȷ���select.selectedIndex���ԣ��Ϳ�������option.selected = true�ˡ�
    ��˼�����ڷ���option��selected����ʱ���ȷ����丸��selectԪ�ص�selectedIndex���ԣ�
    ǿ�����������option��selected���ԣ��Եõ���ȷ��ֵ��
    ��Ҫע�����optionԪ�صĸ�Ԫ�ز�һ����select��Ҳ�п�����optgroup��
    ������֧��IE9+,����option��parentNode��optgroup��optgroup��parentNode��select��
     */  
	propHooks: {
        // tab ����ȡ����˳��
		tabIndex: {
			get: function( elem ) {
                /*
                rfocusable = /^(?:input|select|textarea|button)$/i;

                rfocusable.test('input') // true

                ��input|select|textarea|button �ȱ�ǩ����� tabindex��href �����Ե�Ԫ�ء���ȡ�� tabIndex ����

                �����Ƕ��룺�ܻ�ȡ����ģ�һ�������������Ч���Ľ���Ԫ��
                */
				return elem.hasAttribute( "tabindex" ) || rfocusable.test( elem.nodeName ) || elem.href ?
					elem.tabIndex :
					-1;
			}
		}
	}
});

// Hooks for boolean attributes
// ������á�ֵΪ����ֵ�����ԡ���ʱ��ļ�������
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			elem.setAttribute( name, name );
		}
		return name;
	}
};

/*
jQuery.expr.match.bool : /^(?:checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped)$/i
jQuery.expr.match.bool.source : "^(?:checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped)$"

typeof jQuery.expr.match.bool.source // "string"

jQuery.expr.match.bool.source.match( /\w+/g ) 
-> ["checked", "selected", "async", "autofocus", "autoplay", "controls", "defer", "disabled", "hidden", "ismap", "loop", "multiple", "open", "readonly", "required", "scoped"]
*/
jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = jQuery.expr.attrHandle[ name ] || jQuery.find.attr;

    // ���¶��� jQuery.expr.attrHandle[ name ] ����
	jQuery.expr.attrHandle[ name ] = function( elem, name, isXML ) {
		    // �ݴ� jQuery.expr.attrHandle[ name ]
        var fn = jQuery.expr.attrHandle[ name ],
			ret = isXML ?
				undefined :
				/* jshint eqeqeq: false */
				// Temporarily disable this handler to check existence
                /*
                ������Ҫ���ݵİ� jQuery.expr.attrHandle[ name ] ������Ϊ undefined��
                ����Ϊ jQuery.find.attr ����� jQuery.expr.attrHandle[ name ]
                */
				(jQuery.expr.attrHandle[ name ] = undefined) !=
					getter( elem, name, isXML ) ?

					name.toLowerCase() :
					null;

		// Restore handler
        // �ָ� jQuery.expr.attrHandle[ name ]
		jQuery.expr.attrHandle[ name ] = fn;

		return ret;
	};
});

// Support: IE9+
// Selectedness for an option in an optgroup can be inaccurate
/*
ie �´���һ�� select �����˵���ʱ��Ĭ��û�� option ����ѡ�е�
���������Ĭ�ϵ�һ�� option ��ѡ��״̬�����ԣ�������һ������

������һ�� propHooks.tabIndex ������Բ���������� jQuery.propHooks.selected

ֻҪ�ڻ�ȡoption��selected��ֵʱ���ȷ���select.selectedIndex���ԣ��Ϳ�������option.selected = true�ˡ�
��˼�����ڷ���option��selected����ʱ���ȷ����丸��selectԪ�ص�selectedIndex���ԣ�
ǿ�����������option��selected���ԣ��Եõ���ȷ��ֵ��
��Ҫע�����optionԪ�صĸ�Ԫ�ز�һ����select��Ҳ�п�����optgroup��
������֧��IE9+,����option��parentNode��optgroup��optgroup��parentNode��select��
 */
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {
			var parent = elem.parentNode;
			if ( parent && parent.parentNode ) {
				parent.parentNode.selectedIndex;
			}
			return null;
		}
	};
}

// ������Щ���Ե�Сд��ʽ
jQuery.each([
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
});

// Radios and checkboxes getter/setter
// ���� radio��checkbox �����úͻ�ȡ
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
            // ��� value ֵ�͡���ѡ��|��ѡ�򡿵�ֵƥ�����ˣ���ѡ�иá���ѡ��|��ѡ��
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	};
	if ( !jQuery.support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			// Support: Webkit
			// "" is returned instead of "on" if a value isn't specified
            // ���� radio �� checkbox �������Ĭ��ֵ�� on���ϰ汾�� webkit ��Ĭ��ֵȴΪ null
			return elem.getAttribute("value") === null ? "on" : elem.value;
		};
	}
});



var rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
/*
�¼����ж��ַ�ʽ���� click �¼�Ϊ����

�� $('#foo').click(function(){ })
�� $('#foo').bind('click',function(){ })
�� $("foo").delegate("td", "click", function() { });
�� $("foo").on("click", "td", function() { });

���� 4 �ַ�ʽ��������һ��������ǽ��� on ���������


on �����������£�
elem.on('click','p',function(){});
-> jQuery.fn.on
-> jQuery.event.add         ��ѡ��Ԫ��ע���¼��������
-> jQuery.event.dispatch    ���ɣ�ִ�У��¼�������
-> jQuery.event.fix         ���� Event ����
-> jQuery.event.handlers    ��װ�¼�����������
-> ִ���¼�������

jQuery ���������¹�����
��1���������⴦��
    �� �¼�����Ļ�ȡ���ݣ�IE��event������ȫ�ֵ�window����׼����event���¼�Դ�������뵽�ص�������
    �� Ŀ�����Ļ�ȡ���ݣ�IE�в���srcElement����׼��target
    �� relatedTargetֻ�Ƕ���mouseout��mouseover���á���IE�зֳ���to��from����Target��������mozilla��û�зֿ���Ϊ�˱�֤���ݣ�����relatedTargetͳһ����
    �� event������λ�ü���
    ...

��2���¼��Ĵ洢�Ż�
    jQuery��û�н��¼�������ֱ�Ӱ󶨵�DOMԪ���ϣ�
    ����ͨ��.data�洢�ڻ���.data�洢�ڻ���.cahce�ϣ�
    �������֮ǰ�����Ĺᴩ������ϵ�Ļ���ϵͳ��
    
    �� �����󶨵�ʱ��
    ����ΪDOMԪ�ط���һ��ΨһID���󶨵��¼��洢��
    .cahce[ΨһID][.expand ][ 'events' ]�ϣ�
    ��events�Ǹ���-ֵӳ����󣬼������¼����ͣ���Ӧ��ֵ�������¼���������ɵ����飬
    �����DOMԪ���ϰ󶨣�addEventListener/ attachEvent��һ���¼�������eventHandle��
    ��������� jQuery.event.add ʵ�֡�
    
    �� ִ�а󶨵�ʱ��
    ���¼�����ʱeventHandle��ִ�У�
    eventHandle��ȥ$.cache��Ѱ�������󶨵��¼���������ִ�У�
    ��������� jQuery.event. trigger �� jQuery.event.handleʵ�֡�

    �� �¼�����
    �¼�����������jQuery.event.remove ʵ�֣�
    remove�Ի���$.cahce�д洢���¼�����������٣�
    �������е��¼�ȫ������ʱ��
    ����removeEventListener/detachEvent���ٰ���DOMԪ���ϵ��¼�������eventHandle��

��3���¼������� jQuery.event.handlers
    ��ԡ��¼������͡�ԭ���¼���������"click"���󶨣�����Դ���
    �¼�ί�дӶ���ͷ�����룬����ͨ�¼��󶨴�β�����룬
    ͨ����¼delegateCount�����֣�ί��(delegate)�󶨺���ͨ�󶨡�

    ����ġ��¼������͡�ԭ���¼���������⣺

    �����һ�������100��trԪ�أ�ÿ����Ҫ��mouseover/mouseout�¼���
    �ĳ��¼�����ķ�ʽ�����Խ�ʡ99�ΰ󶨣����ο������ܼ���������ӵ�trԪ�ء�

    ���ֻ���ʹ�õ����¼�ð�ݻ���ʵ�ֵģ����ǰ��¼�����������tr�ĸ�Ԫ���ϣ�
    Ȼ����tr���津�����¼���ð�ݵ�tr�ĸ�Ԫ�أ���˸�Ԫ�ؾͿ��Դ�������¼���������
    ���¼��������оͿ���ͨ�����event��ȡ���¼�Դ��Ȼ����¼�Դtr���д���

    ʹ���¼�����ʱ������ǰ�Ŀ��Ԫ�صĸ�Ԫ�أ�
    ��Ϊ��document�Ļ�����IE����ʱ���ǻ�ʧ�顣

    ������������Ҫ��һЩ��ð�ݵ��¼���һЩ����
    ����һЩ���¼����е�ֻð�ݵ�form���е�ð�ݵ�document���е�ѹ����ð�ݡ�

    ����focus��blur��change��submit��reset��select��
    ����ð�ݵ��¼�����Щ�����֧�֣���Щ��֧�֣���
    �ڱ�׼������£����ǿ�������addEventListener�����һ������Ϊtrue�����񣩾����ˣ�
    ��Ϊ��������Ļ����¼����document���¼�Դ����ʱ����ʹ���¼���������ˡ�
    IE�ͱȽ��鷳�ˣ�Ҫ��focusin����focus��focusout����blur��selectstart����select��
    change��submit��reset�͸����ˣ������������¼���ģ�⣬��Ҫ�ж��¼�Դ�����ͣ�
    selectedIndex��keyCode��������ԡ�
    
    ������ⱻһ����reglib�Ŀ�㶨�ˡ�
    jQuery������ȡ��reglib�ľ��飬�����˸����¼���
*/

/*
����
dom �ṹ��
<div id="div1">
    <div id="div2">
        <p id="p1">
            <a href="#" id="a1">a��ǩ</a>
        </p>
    </div>
</div>

�������룺
$('#div1').on('click',function(){
    console.log('div1')
});
$('#div2').on('click',function(){
    console.log('div2')
});
$('#div2').on('click','p,a',function(e){
    console.log(e.currentTarget.nodeName)
});
$('#p1').on('click',function(){
    console.log('p1')
});

��� a ��ǩ�󣬴�ӡ�����Լ�˳�����£�
p1 -> A -> P -> div2 -> div1

��� p ��ǩ�󣬴�ӡ�����Լ�˳�����£�
p1 -> P -> div2 -> div1

��� div2 ��ǩ�󣬴�ӡ�����Լ�˳�����£�
div2 -> div1

��� div1 ��ǩ�󣬴�ӡ�����Լ�˳�����£�
div1

�����¼�˳����Կ�����
p ��������¼�����ί�ɸ��� div2 
�� �� div2 ���¼�����ʱ���ȴ���ί�� p �ķ�����Ȼ���ٴ��� div2 ����Ļص�������
�� p ����Ļص�������ִ�У���ִ��ί���� div2 �ϵĻص�������

����˳����ʵ�����¼�ð��˳�򣬴��¼�ԴĿ��Ԫ��Ҳ���� event.target ָ����Ԫ�أ�
һֱ����ð�ݵ� document ���� body��;����Ԫ��������ж�Ӧ���¼����ᱻ���δ�����

����ܽ�ܹؼ����������� jQuery.event.handlers �����Ĺؼ���
*/
jQuery.event = {

	global: {},

    /*
    .on ����������ã�
    jQuery.event.add( this, types, fn, data, selector )
    */
	add: function( elem, types, handler, data, selector ) {

		var handleObjIn, eventHandle, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = data_priv.get( elem );
        /*
        ���� get ����û�еڶ������� key���ǾͰ���� elem ��Ӧ�����е����ݶ�ȡ����
        cache = {
            "0": { },
            "1": { // DOM�ڵ�1�������ݣ�
                "name1": value1,
                "name2": value2
            },
            "2": { // DOM�ڵ�2�������ݣ�
                "name1": value1,
                "name2": value2
            }
            // ......
        };

        ����� elemData �� cache ��һ�����ԣ����󣩡�
        data_priv.get( elem ) ��������������ǣ�
        �� ���֮ǰ�Ѿ������ elem ��������ݣ��ͷ��ض�Ӧ�Ļ������
        �� ���֮ǰû��������ݣ��Ǿ��´���һ��������󣬲���Ϊ����ֵ��

        ͨ������ Data.prototype.get Դ�룬֮���������Ч������ʵ����Ϊ��
        Data.prototype.key �������������ִ��ʱ����� elem û�л�������ݣ����¿���һ�� {}
        ��������� {} �� cache �ж�Ӧ������

        �� Data.prototype.get �����У� cache = this.cache[ this.key( owner ) ]
        this.key( owner ) ����һ���µ� {}������������ n��
        ���ǣ�this.cache[n] �Ϳ����ҵ���� {} �ˡ�

        ���ԣ�elemData ���Ƕ���� {} �������ˣ������ elemData �Ĳ������Ƕ���� {} �Ĳ�������
        ���ԣ�����ѹ���������� elemData �Ĵ洢��������Ҫ������֣���Ϊ�����ļ����á��
        */

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
        // elemData �ض���һ����������Ǽ٣��ǿ϶��������ˣ��Ͻ����أ�
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		/*
        �� һ������� handler ����һ���ص����� fn
        �� handler ��������һ��json����
        {
            handler:function(){������},
            selector:ִ��������
         }
        */
        if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		// �� handler �¼����������һ��Ψһ�� id
        if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		// ��� elemData û�� events ���ԣ���ʼ��һ���ն���
        if ( !(events = elemData.events) ) {
			events = elemData.events = {};
		}

        /*
        ��� elemData û�� handle ���ԣ���һ��������ֵ����
        ��� handle ����ָ��һ��������
        �����������ʵ���ϰ��� dom �ڵ��ϵ�Ψһ�������������Ҫ��
        ÿ�δ����¼���ʵ��ִֻ����һ��������
        �����������װ�� dispatch ���������շַ���ÿһ��ʵ�ʴ�������
        */
		if ( !(eventHandle = elemData.handle) ) {
			eventHandle = elemData.handle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
                /*
                core_strundefined : "undefined"

                jQuery.event.triggered !== e.type �Ƚ�����

                �� trigger ����ִ��Ԫ�ص�Ĭ�Ϸ���ʱ�������䣺
                jQuery.event.triggered = type;
                elem[ type ](); // ����� type ����ָ submit��click ��Ԫ��Ĭ���¼�����
                jQuery.event.triggered = undefined;

                ����һЩ����Ԫ�����Լ���Ĭ�Ϸ���������:
                form.submit()��button.click() ��
                
                ���� jQuery �¼��������̣����� click() ����
                �в���ʱ�ᴥ�� on ����
                û�в���ʱ�ᴥ�� trigger ����

                ��  trigger �����ֻ��������Ԫ�ؼ�������Ԫ�ء���
                Ȼ�������ڡ���Ԫ�ؼ�������Ԫ�ء��ϵ��� handle.apply( cur, data ) 
                �� handle ����� dispatch ��Ȼ��ִ�лص�����

                ��ô��������ˣ��ղ�ִ��Ĭ���¼�֮ǰ�Ѿ������ϵ�ð�ݹ���ִ����һ��

                ���ԣ���ξͲ�Ӧ����ִ����
                Ҳ���ǵ� jQuery.event.triggered === e.type ʱ���Ͳ�����ִ�� dispatch ��

                �� click() ִ�����ˣ��ֻ����¸�ֵ jQuery.event.triggered = undefined 
                �����ֿ����� handle ������ dispatch ��
                */
				return typeof jQuery !== core_strundefined && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
        /*
        core_rnotwhite = /\S+/g

        ����¼�����һ���ַ�����𿪣�
        "click mouseover".match(/\S+/g) ->  ["click", "mouseover"]
        */
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
            /*
            namespace �����ռ���ơ��ÿ��Զ��¼����и�Ϊ��ϸ�Ŀ��ƣ�
            ������Ա����ָ���ض��ռ���¼���ɾ���ض������ռ���¼���
            �Լ������ض������ռ���¼���

            rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;
            ƥ�������ռ䣬���¼������������ռ����ֿ�

            �� rtypenamespace.exec("keydown.myPlugin.plugin")
            -> ["keydown.myPlugin.plugin", "keydown", "myPlugin.plugin", index: 0, input: "keydown.myPlugin.plugin"]
            */
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
            /*
            (1) type �¼���
            "keydown"

            (2) namespaces �����ռ��飺
            "myPlugin.plugin".split( "." ).sort() -> ["myPlugin", "plugin"]
            */
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
            // type Ϊ undefined����������ѭ������ע��û�¼������¼�
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};
            /*
            special: {
                load: {
                    noBubble: true
                },
                click: {
                    trigger: function() {...},
                    _default: function( event ) {...}
                },
                focus: {
                    trigger: function() {},
                    delegateType: "focusin"
                }
                ...
            }
            �������е��¼�������ֱ��ʹ�õģ���Щ�¼�����Ҫ���������� focus��blur
            */
			// If selector defined, determine special event api type, otherwise given type
			/*
            �� selector ��ʾ���¼�ί�У����磺
            �����ԭ����focus�¼���ð�ݣ�������special����typeת��Ϊ'focusin'��ģ��ð�ݡ�
            */
            type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
            /*
            �����µ� type ���� special�������� focus Ϊ����
            �� special = jQuery.event.special[ 'focus' ]
                special = {
                    trigger: function() {},
                    delegateType: "focusin"
                }
            �� ���� selector ʱ��type = special.delegateType
            ����type = "focusin"
            �� special = jQuery.event.special["focusin"]
                special =  {
                    setup: function, 
                    teardown: function
                }
            */
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
            /*
            �������ģ�handleObjIn �����Ƕ���Ҳ������ undefined
            jQuery.extend ����� 2 ���������Ǿ͵ڶ������������Ը��Ƹ���һ������
            ����ȷ���� 2 ��������ֻ�������ڶ��������� undefined ʱ������� undefined ���ƹ�ȥ
            */
			handleObj = jQuery.extend({
				type: type, // ��������¼�����
				origType: origType, // �������¼�����
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );
            /*
            jQuery.expr.match.needsContext = /^[\x20\t\r\n\f]*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\([\x20\t\r\n\f]*((?:-\d)?\d*)[\x20\t\r\n\f]*\)|)(?=[^-]|$)/i
            handleObj.needsContext ��ʾ��
            selector ���ڲ����й�ϵѡ��������α��ʱֵΪ true

            ��� handleObj.needsContext ������� jQuery.event.handlers ������
            ���� jQuery() ���� jQuery.find() ���������� selector �ҵ�ǰԪ�أ�this������Ԫ��
            */

			// Init the event handler queue if we're the first
            /*
            ����д��
            events = elemData.events
            */
            /*
            �� ��ǰ�����¼��������鲻���ڵ�ʱ�򣬾ʹ���������飬���¼���
            elem.addEventListener( type, eventHandle, false );
            �� ÿ���µ����͹��������һ�Σ����� click ��mouseover �¼�����ֱ��
            �� ͬ���͵��¼������Ͳ��������ˣ�ֱ�Ӽӵ� handlers ��
            */
			if ( !(handlers = events[ type ]) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;
                /*
                 handlers -> [delegateCount: 0]
                 handlers["delegateCount"] -> 0

                 handlers.delegateCount Ϊ���¼���������
                */
                

				// Only use addEventListener if the special events handler returns false
                /*
                �� ���û��special.setup��������special.setup����ִ�к󷵻�false����ֱ����addEventListener���¼���
                
                special.setup �л����
                document.addEventListener( orig, handler, true )
                ע������������� true����ʾ�����¼�����Ҫ��� focus/blur �Ȳ�֧��ð�ݵ��¼�
                
                �� addEventListenerע�����ʲô��
                ��eventHandle��eventHandle = elemData.handle����
                ����Ψһע����Ԫ���ϵ��¼���������
                �������þ���ִ��dispatch���Ӷ�ִ���������¼������������У���
                */
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					if ( elem.addEventListener ) {
                        /*
                        �� ���¼���ע������� useCapture �� false����ð�ݽ׶δ���
                        �� Ĭ�ϵĴ���ѭ���Ǵ��¼�ԴĿ��Ԫ��Ҳ���� event.target ָ����Ԫ�أ�
                           һֱ����ð�ݵ� document ���� body��;����Ԫ��������ж�Ӧ���¼����ᱻ���δ�����
                        */
						elem.addEventListener( type, eventHandle, false );
					}
				}
			}

            // ò�����е� special ��û�� add ���� 
			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
            /*
            arrayObject.splice(index,howmany,item1,.....,itemX)
            ���У�
            index: �涨���/ɾ����Ŀ��λ�ã�ʹ�ø����ɴ������β���涨λ��
            howmany: Ҫɾ������Ŀ�������������Ϊ 0���򲻻�ɾ����Ŀ
            item1,.....,itemX: ��������ӵ�����Ŀ��

            �����selector����ô����ί�У�ί�����ȴ���ġ�
            ί������handlers����ǰ�棬���뵽ԭ��ί�е�����棬�����з�ί��ǰ�棨ͨ��delegateCount����λ��
            ����ί�о�ֱ�����뵽�����������

            �������¼���������ô����ģ�
            ��������handler�����Դ洢��handleObj�����ϣ�
            ��ȻhandleObj�����ϻ������������Ա�ִ�н׶ο����õ���

            ǰ���У�
            elemData = data_priv.get( elem );
            events = elemData.events;
            handlers = events[ type ];
            */
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}
            /*
            �ܽ�һ�£�
            ��� type ����¼���û���ֹ�ʱ����eventHandle����ͨ��addEventListenerע�ᵽԪ���ϡ�
            ����Ѿ���handlers����ô˵��eventHandle�Ѿ�ע����������ٴ�ע�ᣬ
            �Ѻ����¼��������Ķ���handleObj���뵽���鼴�ɡ�
            
            ÿ�ΰ󶨵ĺ��ľ��ǰ�handleObj������ӵ��¼�����type��Ӧ��events[type]�ϡ�
            */

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
        // elem ��Ϊ null����ֹ ie ���ڴ�й©
		elem = null;
	},
    /*
    add �����������ǣ������в����ϲ���һ�� handleObj ���󣬲����������ŵ�����ϵͳ�С�
    ÿ����ͬ���¼����Ͷ���һ������������ handlers������ click �¼����Լ��� handlers��
    mouseover �¼�Ҳ���Լ��� handlers��

    ����ͬһ��Ԫ��ֻ���һ���¼������� eventHandle �����е��¼������������
    ���ַ�����������¼���������������Ӧ���¼������������� click �¼������ˣ� 
    eventHandle ��ִ�� click ��Ӧ�� handlers ����������з�����
    
    �� elemData.handle
    eventHandle = elemData.handle = function( e ) {}
    ������ jQuery.event.dispatch �����������¼����ͷַ��¼�

    �� elemData.events
    elemData = data_priv.get( elem );
    events = elemData.events;
    handlers = events[ type ];

    elemData : {
        handle : function( e ) {},
        events : {
            click : [handleObj,handleObj,handleObj,...]
            mouseover : [handleObj,handleObj,handleObj,...]
            mousedown : [handleObj,handleObj,handleObj,...]
        }
    }

    elem �ڻ���ϵͳ�еĶ�Ӧֵ�� elemData������ handle��events ���������ԡ�

    handle ��һ���ص���������������һ�� elem ����ָ�� elem Ԫ�ء����磬
    click �¼�����ʱ���ᴥ�� handle ������handle ����ִ�� click �¼�
    ��Ӧ�� eventHandle ��ִ�� handlers ����������з�����

    events ��һ�� json ������ click��mouseover ��������¼���Ӧ�����ԡ�
    ����ÿ�������зֱ��Ӧһ�� handlers ���顣handlers.delegateCount ��ʾ
    �����¼�������

    �ܽ�һ�� jQuery.event.add ������
    �� ���û��Ϊί��Ԫ�� elem �������棬�ڵ��� get ʱ�������棻
    �� ���� elemData.handle һ���������������� jQuery.event.dispatch ������
    �� �� elemData.events ������Ӳ�ͬ�¼����͵��¼��������� [handleObj,handleObj..]��
    �� �� elem ��һ�� type ���͵��¼�������ʱ���� elemData.handle��

    */

	// Detach an event or set of events from an element
    // ɾ������Ԫ�� elem �ϵ�һ����һ���¼�
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var j, origCount, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = data_priv.hasData( elem ) && data_priv.get( elem );

        // elemData û���ݻ���û�¼����ݣ�ֱ�ӷ���
		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
        /*
        core_rnotwhite = /\S+/g

        "click mouseover".match(/\S+/g) ->  ["click", "mouseover"]
        */
        /*
        types = ( types || "" ).match( core_rnotwhite ) || [""]
        ����ע��һ�£�
        
        �� �ȿ� ( types || "" ).match( core_rnotwhite )
        ��� types Ϊ undefined��false��null�ȣ��ͻ��ǣ�
        "".match( core_rnotwhite ) -> null
        
        ���⣬��� types ֻ�ǿո񣬻��У��س�����ҳ�ȿհ׷���Ҳ���� null 

        �� �� �� ���� null���� types = [""]
        �����ע�ͺ���ϸ���� types = [""] ����ζ��ʲô
        */
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
            /*
            rtypenamespace.exec("keydown.myPlugin.plugin")
            -> ["keydown.myPlugin.plugin", "keydown", "myPlugin.plugin", index: 0, input: "keydown.myPlugin.plugin"]
            -> type = "keydown"
            -> namespaces = ["myPlugin", "plugin"]
            */
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			// û�д����ض� type���Ǿ��Ƴ����� type
            if ( !type ) {
				for ( type in events ) {
                    // mappedTypes Ϊ true ��ʾ�������Ͷ�����ɾ
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}
            /*
            ����ݹ���� jQuery.event.remove ������
            Ϊʲô�ڶ����������� type + types[ t ] �أ�

            �� Ҫ��ִ������ص����͵� type Ϊ��
            �� type = rtypenamespace.exec( types[t] )[1]
            �� ����֤������ types[t] ��ʲôֵ��type ʼ��Ϊ�ַ���
               rtypenamespace.exec(undefined)
               -> ["undefined", "undefined", undefined, index: 0, input: "undefined"]
               rtypenamespace.exec({})
               -> ["[object Object]", "[object Object]", undefined, index: 0, input: "[object Object]"]
               rtypenamespace.exec([1,23])
               -> ["1,23", "1,23", undefined, index: 0, input: "1,23"]
               rtypenamespace.exec('..h.d,lf...s@#$%ie')
               -> ["..h.d,lf...s@#$%ie", "", ".h.d,lf...s@#$%ie", index: 0, input: "..h.d,lf...s@#$%ie"]
            �� Ҫ�� type Ϊ�٣���ôֻ�� types[t] Ϊ���ַ��� ''
               rtypenamespace.exec('')
               -> ["", "", undefined, index: 0, input: ""]
            �� eg:
            var events = {
                'click' : { a:1},
                'mouseover' : { b:2}, 
                'scroll' : { c:3}
            };

            var types = [""]
            var t = types.length,
                tmp,
                rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

            while(t--){
                tmp = rtypenamespace.exec( types[t] ) || [];  
                type = tmp[1]; 

                if ( !type ) {
                    for ( type in events ) {
                        console.log('type:',type);
                        console.log('types[ t ]:',types[ t ]);
                    }
                    continue;  
                }
            }

            ��ӡ������£�
            type: click
            types[ t ]: 
            type: mouseover
            types[ t ]: 
            type: scroll
            types[ t ]: 

            �� type + types[ t ] �൱�� type + ''
            ���ԣ������ǽ� type תΪ�ַ���ô
            */

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
            /*
            �� tmp[2] = "bb.cc" Ϊ����
            namespaces = ( tmp[2] || "" ).split( "." ).sort()
            -> ["bb","cc"]
            
            namespaces.join("\\.(?:.*\\.|)")
            -> "bb\.(?:.*\.|)cc"

            ���ǣ�
            tmp = new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" )
            -> /(^|\.)bb\.(?:.*\.|)cc(\.|$)/
            */
			tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];
                
                // ǰ�ߵݹ���� remove ����ʱ mappedTypes Ϊ true
                // Ҳ�����������Ͷ�����ɾ������Ҫ�ٵ������������Ƿ�ƥ����
				if ( ( mappedTypes || origType === handleObj.origType ) &&
                    // û�д���ص����������߻ص������� guid Ҫƥ����
					( !handler || handler.guid === handleObj.guid ) &&
                    // û�������ռ䣨Ҳ��û��tmp[2]���������ռ�ƥ����
					( !tmp || tmp.test( handleObj.namespace ) ) &&
                    // && ���ȼ����� ||��û��ѡ����������ѡ����ƥ���ϣ�����ͨ��
					( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					// �� handlers ������ɾ����Ӧ�� handleObj
                    handlers.splice( j, 1 );
                    
                    // �����ί���¼���ɾ���ˣ����а�ί���¼��������� 1
					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
                    // �����¼�ɾ��
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			/*
            �� ���ԭ��ȷʵ���¼��󶨣�Ȼ�����ȫ����ˣ��Ǿͽ���������¼�����
            Ҳ����˵�����ԭ��û��ʱ��� origCount === 0���Ǿ͸���û�󶨣���̸���Ͻ������
            �� ɾ�� events �� type ����
            */
            if ( origCount && !handlers.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
        /*
        ��� events ����ˣ�Ҳ���Ǹ��������¼�������û���ˣ��Ǿʹӻ���ɾ��
        */
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;
			data_priv.remove( elem, "events" );
		}
	},
    /*
    �� 1 ���¼�������
    $('input').trigger('click');

    �� 2 ���������� 2 ������������ event.data ���ԣ���Ϊ�ص������Ĳ���
    $('input').click(function (e, data) {
        alert(data);
    }).trigger('click', 123);

    �� 2 ���������� 2 ������Ϊ����
    $('input').click(function (e, data1, data2) {
        alert(data1 + ',' + data2);
    }).trigger('click', ['abc', '123']);
    */
    /*
    jQuery.event.trigger ������
    �� jQuery.fn.trigger 
       jQuery.event.trigger( type, data, this )
    �� jQuery.fn.triggerHandler
       jQuery.event.trigger( type, data, elem, true )
       ���Կ�����onlyHandlers ������ triggerHandler ����ʱΪ true
   
   �ܽ᣺
   trigger ִ���¼�hanlder/ִ��ð��/ִ��Ĭ����Ϊ
   triggerHandler ִ���¼�handler/��ð��/��ִ��Ĭ����Ϊ

   ��onlyHandlers Ϊ true �ͱ�ʾ��ִ���¼�handler��
    */
	trigger: function( event, data, elem, onlyHandlers ) {

		var i, cur, tmp, bubbleType, ontype, handle, special,
			eventPath = [ elem || document ],
            /*
            event ���˿����� "click" ���֣��������¼���
            core_hasOwn = {}.hasOwnProperty
            */
			type = core_hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = core_hasOwn.call( event, "namespace" ) ? event.namespace.split(".") : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
        // �ı���ע�ͽڵ㣬������
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		/*
        rfocusMorph = /^(?:focusinfocus|focusoutblur)$/
        focusinfocus/focusoutblur ���־ͷ���

        focus/blur �¼����ֳ� focusin/out ���д���
        ��������ԭ��֧�� focusin/out����ȷ����ǰ����������
        */
        if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

        // �������ռ���¼�����
		if ( type.indexOf(".") >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}

        // 'click' -> 'onclick'
		ontype = type.indexOf(":") < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		/*
        �� ������� event �Ƕ��󣬰�������Ϊ jQuery.Event ��ʵ������
        �� ����� 'click' �����ַ������ǾͲ�����
        */
        event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		// jQuery.fn.trigger ��Ӧ 3 ��jQuery.fn.triggerHandler ��Ӧ 2
        event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join(".");
		event.namespace_re = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
			null;

        /*
        �� û�������ռ� event.namespace Ϊ�٣�event.namespace_re Ϊ null
        �� �������ռ�:
           ���� event.namespace = "aa.bb"
           event.namespace_re = /(^|\.)aa\.(?:.*\.|)bb(\.|$)/
        */

		// Clean up the event in case it is being reused
		event.result = undefined;
        /*
        ��� event ��������ַ��� 'click'
        'click'.target -> undefined
        
        Ŀ����� elem
        */
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		/*
        jQuery.makeArray( ['abc', '123'], [ 'event' ] )
        -> ["event", "abc", "123"]
        
        ��Ӧ���ֵ�����ʽ��
        $('input').click(function (e, data1, data2) {
            alert(data1 + ',' + data2);
        }).trigger('click', ['abc', '123']);
        */
        data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {
            /*
            eg:
            type = 'focus';
            bubbleType = 'focusin';
            
            bubbleType + type -> 'focusinfocus'
            rfocusMorph.test('focusinfocus') -> true
            */
			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
            // �����������Ƚڵ�
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			/*
            document.defaultView === window
            ������������� document �ڵ㣬�ǾͰ� window Ҳ�ӽ�ȥ
            */
            if ( tmp === (elem.ownerDocument || document) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
        // ���� eventPath ���飬�����¼�
		while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {
            /*
            �� i Ϊ 1 (0++) ʱ���������ڵ㣬�����¼�
            �� i > 1����������Ԫ���ˣ�ð���¼�
            */
			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
            /*
            �� ��� type ��Ӧ�� handlers ������ڣ����ط��� handle ����ַ��¼�����
            �� ���򣬷��� undefined
            */
			handle = ( data_priv.get( cur, "events" ) || {} )[ event.type ] && data_priv.get( cur, "handle" );
			if ( handle ) {
                // ���� dispatch 
				handle.apply( cur, data );
			}

			// Native handler
            // handle = elem.onclick������ handle
			handle = ontype && cur[ ontype ];
            /*
            handle.apply( cur, data ) === false 
            ��ζ�ţ����ܷ���ֵ�ǲ��� false������ִ���������
            */
			if ( handle && jQuery.acceptData( cur ) && handle.apply && handle.apply( cur, data ) === false ) {
				event.preventDefault();
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
        /*
        ��һ�α�ʾ�����Ĭ����Ϊ�Ĵ���������:
        form.submit()��button.click() ��
        eg:
        document Ԫ��û�� click ���������� button Ԫ���� click ����

        var btn = document.getElementsByTagName('button')[0]
        btn.click
        // function click() { [native code] }
        */
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( eventPath.pop(), data ) === false) &&
				jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && jQuery.isFunction( elem[ type ] ) && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
                    /*
                    ���� FOO() ����ʱ����Ҫ�ظ����� onFOO �¼����ϱ��Ѿ��������ˣ�
                    */
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					/*
                    click() �������ᴥ�� on ���������������ᴥ�� trigger ����
                    ��ֹ click() -> trigger() -> handle (jQuery.event.triggered !== e.type) -> dispatch
                    */
                    jQuery.event.triggered = type;
					elem[ type ](); // �¼�ִ��
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

    /*
    jQuery.event.dispatch VS jQuery.event.trigger
    �� dispatch ���� elem ������ļ����¼��Լ���Щί�и� elem ����Ԫ�ص��¼�
       ��ֻ��������͸�������Ԫ���ϴ����ص��¼��������� elem �ϲ������Ԫ��ð��
    �� trigger ���⴦�� elem ���Ԫ���ϵ�ί���¼��������¼�������������Ԫ�أ�
       ���δ�����������Ԫ���ϵ�ί���¼��������¼�
    
    ��һ������£����ͨ�� on ���������Ԫ�ذ� type �����¼�������ôð�ݴ������أ�
    ������Ϊ���� add �����У�ÿ��Ԫ�ض������ elem.addEventListener( type, eventHandle, false )
    �¼�ð�ݹ����У�����ÿ��Ԫ���ϴ��� eventHandle��Ҳ������ÿ��Ԫ���ϵ��� dispatch ������
    ����jQuery.event.dispatch.apply( eventHandle.elem, arguments )
    */
	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
        // ��Ԫ���¼����󣬵õ�һ����д����������¼�����
		event = jQuery.event.fix( event );

		var i, j, ret, matched, handleObj,
			handlerQueue = [],
			args = core_slice.call( arguments ),
            /*
            jQuery.event.add ����������ô���õģ�
            jQuery.event.dispatch.apply( eventHandle.elem, arguments )
           
            ���ԣ������ this ���� eventHandle.elem

            handlers ���Ƕ�Ӧ type ���͵Ļص���������
            */
			handlers = ( data_priv.get( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		// �� args[0] ��ԭ���� event �����滻Ϊ������ event ����
        args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
        /*
        handlerQueue ��һ�����飬����Ԫ���ǣ�
        { 
            elem: �ڵ�, 
            handlers: [handleObj,handleObj...]
         }
        */
        // ͨ�� jQuery.event.handlers �����õ�һ��ʵ�ʻᴦ��Ļص�����
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
        // ��ͬ�㼶��Ԫ�أ��� isPropagationStopped Ӱ��
		while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
            // ͬһ��Ԫ�أ���ͬ���¼����� isImmediatePropagationStopped Ӱ��
			while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
                /*
                �� û�������ռ� event.namespace Ϊ�٣�event.namespace_re Ϊ null
                �� �������ռ�:
                   ���� event.namespace = "aa.bb"
                   event.namespace_re = /(^|\.)aa\.(?:.*\.|)bb(\.|$)/
                */
				if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
                    /*
                    $('.button').on('click',{user:'nanc'},function(e){
                        alert(e.data.user);
                     });
                     ����������� event.data ��ֵ��
                    */
					event.data = handleObj.data;
                    
                    /* 
                    ��������ִ�лص�����
                    �� ���Ȼ��ǳ��� jQuery.event.special[ handleObj.origType ].handle ��ִ�У�
                    �� ������ handleObj.handler ��ִ��
                    */
					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
                        // ���ĳ���ص������е�ĳ������ִ�з��� false���Ǿ���ֹĬ����Ϊ������ֹð��
						if ( (event.result = ret) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
        /*
        ֻ�� jQuery.event.speical.beforeunload �� postDispatch ���ԣ�
        �����޸� Firefox �� event.originalEvent.returnValue û������ʱ�� alert
        */
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

        // ��������ִ�н��
		return event.result;
	},

    /*
    ������
    event���������� event ����
    handlers����ȡ���� handleObj ����
    */
	handlers: function( event, handlers ) {
		var i, matches, sel, handleObj,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		// Avoid non-left-click bubbling in Firefox (#3861)
        /*
        ��1�����û��ί�У��� delegateCount = 0������������� if ��
        ��2�������ί�У�ȡ�����¼��ڵ��ϵ�handlers�����Կ�����ʱԪ�ر������¼���Ԫ�ػ�Ҫ����ί���¼���
             jQuery�涨�¼�ִ��˳��
             �� ����ί�нڵ���DOM������Ȱ������ȼ���ί�е�DOM�ڵ���Խ���ִ�����ȼ�Խ�ߡ�
             �� ί�е��¼�������������ֱ�Ӱ󶨵��¼���������ڶ��еĸ�ǰ�档
        */
		if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {
            /*
            eg:
            document.onclick = function(event){
                console.log(event.button);
                console.log('���ͣ�',typeof event.button);
            }
            ����ĵ�����ӡ event.button�������������������£�
            // 0
            // ���ͣ� number

            !event.button || event.type !== "click"
            -> !(event.button && event.type === "click")
            -> !(��������)
            -> �ų���������
            -> Ҫô event.button Ϊ 0�������������Ҫô���ǵ���¼�
            */
            /*
            cur = event.target ���¼�Դ������Ľڵ㿪ʼ�����Ҹ��׽ڵ㣬ֱ�� this ���ӽڵ������
            Խ��Ľڵ㣬���ȼ�Խ�ߣ�

            jQuery.event.dispatch ���������ø÷����ģ�
            jQuery.event.handlers.call( this, event, handlers )

            ���ԣ������ this ���� jQuery.event.add �е� eventHandle.elem

            ע�⣡����
            �� �����Ǵ�����Ľڵ㿪ʼ�ҵģ��������
            �� ��� cur ���� this�������Ͳ����������� for ѭ����ֱ�ӰѰ�������¼�������оͺ���
            */
			for ( ; cur !== this; cur = cur.parentNode || this ) {

				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
                /*
                ������ disabled Ԫ�صĵ���¼�
                �൱�ڣ�
                if (!(cur.disabled === true && event.type === "click")) {
                    // process
                }
                */
				if ( cur.disabled !== true || event.type !== "click" ) {
					matches = [];
                    /*
                    ����ȡ������ί�У�i��0��delegateCount-1����ÿ�� handleObj��
                    ������ȷһ�㣬���ǲ���ִ�����е� handleObj��Ҳ����˵�ᶪ��һЩ
                    �Ƕ�����һЩ�أ�����˵������һЩ�أ�

                    ���ǿ���������ӣ�
                    ��� p ��ǩ�󣬴�ӡ�����Լ�˳�����£�
                    p1 -> P -> div2 -> div1
                    
                    p ��ǩ�� a ��ǩ��ί���� div2 �ϣ����ǣ�
                    ��� p ��ǩ�������ᴥ�� a ��ǩ�Ļص�

                    ������ div2 �� handlers �ֻȡ���� p ��ǩ��Ӧ�� handleObj

                    �����ǶȽ���
                    div2 �Ǹ�Ԫ�أ�p ���� a �ĸ�Ԫ�ء���Ԫ�� p,a ����¼�ί�и� div2
                    $('#div2').on('click','p,a',fn);
                    
                    div2 �ĵ���¼���һ�� handlers ���飬ǰһ���ֵ� handleObj ��ί�еġ�
                    ���� 'p,a' ��� selector ��Ӧ handleObj[n]��
                    ����� fn ���� p ��ǩ��Ӧ��Ҳ�� a ��ǩ��Ӧ��
                    ��ô����� p ��ǩ��ð�ݵ� #div2 �󣬾�ֻ�ó��� p ��ǩ�Ļص� fn�������ô��� a ��ǩ�� fn��
                    �� #div2 ���� 'p,a'���ҵ���һ��Ԫ�أ������������ʾ�� [p,a]��
                    �����ǵ������ p��event.target������ p ��ʼ���ݣ�p ������ [p,a] �У����ԣ�p �Ļص�����Ӧ��ִ�еġ�
                    �� a �� p ����Ԫ�أ������¼�ð�����ԣ��ǲ���� a �Ļص�ȡ�����ġ�
                    */
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
                            /*
                            A: ����ڽڵ� this (eventHandle.elem) ���ҵ���ѡ���� sel �����һ��Ԫ�أ�
                            B: cur ����һ��Ԫ����
                            A && B -> matches[ sel ] ��Ϊ�棬����ͻ����� handleObj ���봦���б�
                            
                            ���� for ѭ����������� this ָ���� on ������Ԫ�أ�
                            ��һ�㣺cur �� event.target -> this ��cur �ĸ��ڵ㣬�� this ������
                                    ��˼�ǣ����ܶ��Ԫ�ض�ί�и��� this Ԫ��
                                    ��Ԫ�� A ί�и�������Ԫ�أ�Ԫ�� B Ҳί�и��� this Ԫ��...
                                    Ҫ����Щ A��B ... ���ҳ���
                                    
                            �ڶ��㣺���� handlers ��ί�е� handleObj 
                                    ��˼�ǣ����ܶ���¼��󶨣�handleObj������Ԫ�� cur �й�
                                    ����θ�Ԫ�� A ��ĳ�������¼���ÿ�ε� selector ������ͬ��Ҳ���Բ�ͬ����
                                    ��һ�� 'div' ��ʽ�� A Ԫ�ص��¼�ί�и� this Ԫ�أ�
                                    �ڶ��� '.clsA' ��ʽ�� A Ԫ�ص��¼�ί�и� this Ԫ�أ�
                                    ������ '#a' ��ʽ�� A Ԫ�ص��¼�ί�и� this Ԫ�أ�
                                    ���Ĵλ��� 'div' ��ʽ�� A Ԫ�ص��¼�ί�и� this Ԫ�أ�
                                    ...

                            �ܽ�һ�£�
                            $('#div1').on('click','p,a',fn1);
                            $('#div1').on('click','.clsA',fn1);
                            $('#div1').on('click','div',fn1);
                            ...
                            �����  $('#div1') ��������˵�� this��
                            ����Ҫ���ľ��ǰѡ�ί���� this �ϵ� 'p,a'��'.clsA'��'div' ��ЩԪ�ء��ҳ�����
                            ���� handleObj ����ЩԪ�ض�Ӧ������

                            ��Ȼ�ˣ�ǰ���ǣ������ҵ��ı����� event.target ��ʼ���ϲ��ҡ�
                            Ҳ����˵�����ҵġ�ί���� this �ϵ� 'p,a'��'.clsA'��'div' ��ЩԪ�ء������� event.target ������Ԫ��
                            */
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) >= 0 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, handlers: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
        // ʣ��ķ�ί�е�Ҳ���뵽 handlerQueue ����
		if ( delegateCount < handlers.length ) {
			handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
		}
        
        /*
        jQuery.event.handlers ���ã�
        ������ȡһ�����飬����Ԫ����ʽ�ǣ�
        { 
            elem: �ڵ�, 
            handlers: [handleObj,handleObj...]
         }
        */
		return handlerQueue;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
    // �����¼�������¼����������
    // Ϊʲô��ֱ�Ӷ�������飬����Ҫ�� split ������
	props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},
    /*
    �� chrome ����̨��ӡ jQuery.event.fixHooks��
    fixHooks: {
        click : {
            filter : function(event,original){},
            props : ["button", "buttons", "clientX", "clientY", "offsetX", "offsetY", "pageX", "pageY", "screenX", "screenY", "toElement"]
        }
    }

    fixHooks ����һ������ fixHook ��ɵļ��ϣ�
    һ�� fixHook ����һ�����ĳ���¼����͵��������ݶ���
    */

	keyHooks: {
        // ���˺�����¼��Ĺ������ԣ������¼�������Щ����
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}
            /*
            e.keyCode �� e.charCode ����
            �� e.keyCode �Ǽ��룬�� a ��Ӧ 65
               keydown()��keyup() ���ص��Ǽ���
            �� e.charCode ���ַ����룬�� a ��Ӧ 97
               keypress() ���ص����ַ�����
            */

			return event;
		}
	},

	mouseHooks: {
        // ���˺ͼ����¼��Ĺ������ԣ�����¼�������Щ����
		props: "button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var eventDoc, doc, body,
				button = original.button;

            /*
            �� pageX/pageY
               ��ȡ�����ҳ�棨body��ԭ���ˮƽ/��ֱ����
               ����� body �б߿򣬻��ðѱ߿��ų����⣩
            �� screenX/screenY (�� jQuery ��װ)
               ��ȡ��ʾ����Ļλ�õ�ˮƽ/��ֱ����
            �� clientX/clientY (�� jQuery ��װ)
               ��ȡ�����ҳ���ӿڵ�ˮƽ/��ֱ����
            �� clientLeft/clientTop
               ��/�ϱ߿��ȣ���Ӧ css �� borderLeft/borderTop
            */

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
            /*
            event.which
            �� ����¼��������Ҽ��ֱ𷵻� 1,2,3
            �� �����¼������ض�Ӧ�ļ�����ַ�����

            һ�㣬�¼����� event û�� button ���԰�
            */
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

    /*
    jQuery.event.fix��ԭ�����¼����� event ����Ϊһ���µĿ�д event ����
    ���Ը� event �������Լ�����ͳһ�ӿڣ�
    ���ڲ������� jQuery.Event(event) ���캯����
    */
	fix: function( event ) {
        // �Ѿ��������ˣ��Ǿͷ��ذ�
		if ( event[ jQuery.expando ] ) {
			return event;
		}

        /*
        dispatch ��������ô���õģ�
        event = jQuery.event.fix( event );

        ���ԣ������ this ����ָ jQuery.event
        */

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
            // ����һ�� event ���������淶��һЩ����
			originalEvent = event,
			fixHook = this.fixHooks[ type ];
        /*
        fixHooks: {}
        �ʼ fixHook �϶��� undefined

        �� mouseHooks: {
            props: "button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
            filter: function( event, original ) {}
        }

        �� keyHooks: {
            props: "char charCode key keyCode".split(" "),
            filter: function( event, original ) {}
        }

        �� ����/����¼�
        rkeyEvent = /^key/;
        rmouseEvent = /^(?:mouse|contextmenu)|click/
        */
		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
                // ����¼�
				rmouseEvent.test( type ) ? this.mouseHooks :
                // �����¼�
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
        // fixHook Ϊ keyHooks ��mouseHooks ��{} ����֮һ

        /*
        jQuery.event.props : ��������¼��ġ��������ԡ�
        jQuery.event.keyHooks.props : �����¼��ġ��������ԡ�
        jQuery.event.mouseHooks.props : ����¼��ġ��������ԡ�

        �����ǰѡ��������ԡ��͡��������ԡ�ƴ����һ��
        */
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

        /*
        ����ԭ�� event ���󣬴��� jQuery.Event ʵ������
        jQuery.Event ���캯������һ�䣺event.originalEvent = originalEvent;
        ���ԣ��µ� event ���󣬿���ͨ�� originalEvent ���Ի�ȡԭ�� event �¼������һЩ����
        */
		event = new jQuery.Event( originalEvent );

		i = copy.length;
        // �������е� props ����
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: Cordova 2.5 (WebKit) (#13255)
		// All events should have a target; Cordova deviceready doesn't
        // ���û�� event.target������Ϊ document
		if ( !event.target ) {
			event.target = document;
		}

		// Support: Safari 6.0+, Chrome < 28
		// Target should not be a text node (#504, #13143)
        // ��� event.target ���ı��ڵ㣬����Ϊ�丸�ڵ�
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

        // ����ù��������¼�����
		return fixHook.filter? fixHook.filter( event, originalEvent ) : event;
	},
    
    /*
    special ���������Ϣ�е��ɢ���� chrome �´�ӡ $.event.special ���õ���
    special : {
        beforeunload : {
            postDispatch : function ( event ){}
        },
        blur : {
            delegateType : "focusout",
            trigger : function (){}
        },
        click : {
            trigger : function(){},
            _default : function(event){}
        },
        focus : {
            delegateType : "focusin",
            trigger : function(){}
        },
        focusin : {
            setup : fucntion(){},
            teardown : function(){}
        },
        focusout : {
            setup : fucntion(){},
            teardown : function(){}
        },
        load : {
            noBubble : true
        },
        mouseenter : {
            bindType : "mouseover",           
            delegateType : "mouseover",
            handle : function(){}
        },
        mouseleave : {
            bindType : "mouseout",           
            delegateType : "mouseout",
            handle : function(){}
        }
    }

    */

	special: {
		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {
			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					this.focus();
					return false;
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {
			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( this.type === "checkbox" && this.click && jQuery.nodeName( this, "input" ) ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return jQuery.nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	},

    // ģ���¼�
    /*
    ���ڲ�֧�� focusin/focusout �¼���������������� focus/blur �¼���ģ�⣺
    jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true )
    */
	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		/*
        eg:
        var e = jQuery.extend({},
        {
            a: 1,
            b: 2,
            c: 3
        },
        {
            a: 11,
            d: 4
        });
        -> e: {a: 11, b: 2, c: 3, d: 4}
        ���ڶ����������������������θ��Ƹ���һ�����������Ƶĸ����ȸ��Ƶ�
        */
        var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
        // ð��
		if ( bubble ) {
            /*
            ������ focus/blur �¼�ģ�� focusin/focusout �¼���
            ��Ȼ focus/blur �¼�����ð�ݣ�Ҳ���ǲ���������Ԫ���Ϸ�����
            ���� trigger �����������ҵ���������Ԫ�أ��ֶ������¼�
            */
			jQuery.event.trigger( e, null, elem );
		} else {
            /*
            dispatch ���� elem ������ļ����¼��Լ���Щί�и� elem ����Ԫ�ص��¼�
            ���仰������ֻ��������͸�������Ԫ���ϴ����ص��¼��������� elem �ϲ������Ԫ��ð��
            */
			jQuery.event.dispatch.call( elem, e );
		}
        // ��ֹĬ���¼��ص�
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

jQuery.removeEvent = function( elem, type, handle ) {
	if ( elem.removeEventListener ) {
		elem.removeEventListener( type, handle, false );
	}
};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
    // ���Բ��� new �ؼ������½� jQuery.Event ʵ������
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
    // src ��ԭ�����¼�����
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
        // Ĭ����Ϊ�Ƿ�����ֹ
		this.isDefaultPrevented = ( src.defaultPrevented ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

	// Event type
    // src ���¼�����
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
    // ���� props �е���������
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
    // ʱ���
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
    // ������޸�
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
    /*
    function returnFalse() {
        return false;
    }
    */
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,

	preventDefault: function() {
        // ��ȡ��Ӧ��ԭ���¼�
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;

		if ( e && e.preventDefault ) {
            // ԭ�������ԭ��������ֹĬ����Ϊ
			e.preventDefault();
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( e && e.stopPropagation ) {
            // ԭ�������ԭ��������ֹ�¼�ð��
			e.stopPropagation();
		}
	},
    /*
    ȡ���¼�ð�ݣ���ȡ�����¼��ĺ����¼�������
    eg:
    <div>
       <span></span>
    </div>
    ���� div �� 1 ������ص������� f1
    span �� 2 ������ص������� f2��f3

    ��ô���������� span��һ������£�������ִ�� f2->f3->f1

    ����� f2 �����е����� stopImmediatePropagation ������
    ��ô������Ԫ���ϵ�ͬ��ص� f3���͡�����Ԫ��Ԫ���ϵ� f1��������ִ��

    ����ʾ����
    $('input').click(function (e) {
        alert('input');
        e.stopImmediatePropagation();
    });
    $('input').click(function () {
        alert('input2');
    });
    $(document).click(function () {
        alert('document');
    });
    */
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
// Support: Chrome 15+
/*
����
�� mouseenter() �� mouseleave() ������Ԫ�ز��ᴥ����
�� mouseover() �� mouseout() ��ᴥ����

jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
    console.log('orig:',orig,'fix:',fix)
});
��ӡ�����
orig: mouseenter fix: mouseover
orig: mouseleave fix: mouseout

���ԣ������½�����������
jQuery.event.special[ "mouseenter" ] ��
jQuery.event.special[ "mouseleave" ]
*/
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,
        
        /*
        dispatch �����У�

        args[0] = event; 
        // event �����滻Ϊ������� event ����
        
        ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args )
                       
        ���ԣ�handle ��ʵ����������� event ����
        */
		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// Create "bubbling" focus and blur events
// Support: Firefox, Chrome, Safari
/*
�� �Ƿ�ð��
focus() �� blur() �ֱ��ʾ��꼤��Ͷ�ʧ���¼�����Ԫ���ǵ�ǰԪ�ء�
focusin() �� focusout() Ҳ��ʾ��꼤��Ͷ�ʧ�����¼�����Ԫ�ؿ�������Ԫ�أ�Ȼ���¼�ð��������

�� ����˳���û��ѽ���� A ת�Ƶ� B��
   focusout���� A ʧȥ����ǰ���͡�
   blur���� A ʧȥ������͡�
   focusin����B��ý���ǰ���͡�
   focus����B��ý�����͡�
*/
/*
���ڲ�֧�� focusin/focusout �¼���������������� focus/blur �¼���ģ�⣺
jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true )

����  focus/blur �¼���֧��ð�ݣ����ԣ����¼�����
�������¼����� setup �������󶨲����¼�������
document.addEventListener( orig, handler, true )
���������� useCapture Ϊ true

���� jQuery.event.add �е�ð�ݼ����Ͳ��ټ���ð���¼���
if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
    if ( elem.addEventListener ) {
        elem.addEventListener( type, eventHandle, false );
    }
}
*/
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
                    /*
                    a. ��Ϊ��֧�� focusin/focusout �¼������Լ��� focus/blur �¼�
                    b. ��Ϊ focus/blur ��֧��ð�ݣ����Բ���׶μ���
                    c. �¼�����ʱ������ handler ����
                    d. handler ����ģ�� focusin/focusout �¼�

                    Ϊʲô�����¼����� document �ϣ�
                    �����¼��������Ԫ���������Ԫ�ش�����
                    �����Ǹ�Ԫ�ط����� focus/blur �¼�
                    ���� document �ϵĲ����¼������ȴ���
                    ���� handler �ص�����������һЩ�¼���������ع���
                    */
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

/*
��1�� .on( events [, selector ] [, data ], handler )
events���ַ�����һ�������ո�������¼�����"click"����ѡ�������ռ�"keydown.myPlugin"
selector��һ��ѡ�����ַ��������ڹ��˳���ѡ�е�Ԫ�����ܴ����¼��ĺ��Ԫ�ء����ѡ������ null ���ߺ����˸�ѡ��������ô��ѡ�е�Ԫ�������ܴ����¼���
data���������ͣ��¼�����ʱ����һ���¼�������ʱ��Ҫ���� handler ��event.data
handler���������¼��Ļص������������һ������ false �ĺ��������Լ�дΪ false��

��2�� .on( events [, selector ] [, data ] )
events��json �����ַ����� key ��ʾһ�������ո�������¼�����"click"����ѡ�������ռ�"keydown.myPlugin"��value ��ʾ�¼��ص�����
selector��һ��ѡ�����ַ��������ڹ��˳���ѡ�е�Ԫ�����ܴ����¼��ĺ��Ԫ�ء����ѡ������ null ���ߺ����˸�ѡ��������ô��ѡ�е�Ԫ�������ܴ����¼���
data���������ͣ��¼�����ʱ����һ���¼�������ʱ��Ҫ���� handler ��event.data
*/
jQuery.fn.extend({
    /*
    �������� on ������ʹ�÷�ʽ��
    ��1��2 ���������ֱ����¼����ͺͻص�����
         $('.button').on('click',funtion(){
             alert(1);
         })

    ��2��2 ����������һ�������Ƕ���¼�
         $('.button').on('mouseover mouseout',funtion(){
            alert(1);
         });
      
    ��3����һ���������¼������ռ�
         $('.button').on('click.abc',function(){
            alert(1);
         });

    ��4��3 ��������ʹ�ö������ݺ��¼�����
         $('.button').on('click',{user:'nanc'},function(e){
            alert(e.data.user);
         });
    ��5���Զ���ʽ�󶨶���¼�
         $('.button').on({
            mouseover : function(){
                alert(1);
            },
            mouseout : function(){
                alert(2);
            }
         });

    ��6����ֹĬ����Ϊ����ȡ��ð��
         $('.button').on('submit',false);

    */
	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var origFn, type;

		// Types can be a map of types/handlers
        /*
        �� types ��һ�� json ����selector, data ���ǿ�ѡ
        types = {
            type1 : handler1,
            type2 : handler2,
            ...
        }
        */
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
            /*
            ��� selector �����ַ���
            �� data û��ֵ�Ͱ� selector ��ֵ������
            �� selector ��Ϊ undefined
            */
			if ( typeof selector !== "string" ) {
				// �൱�� ( types-Object, data ) ������ʽ����
				data = data || selector;
				selector = undefined;
			}
            // �ݹ�
            // ��ת��������ʽ .on( events [, selector ] [, data ], handler )
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
            // ��ʽ���ã����ص�ǰ����
			return this;
		}
        
        // ���ݸ��ֲ�����ʽ����Ҫ�Ĳ�������Ϊ undefined
        // 2 ����������� .on("click", fn)
		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
            // 3 ����������� .on("click", "tr", fn)
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
            // 3 ����������� .on("click", { foo: "bar" }, fn)
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
        // ��� fn �� false���� fn ����һ������ false �ĺ���
		if ( fn === false ) {
			fn = returnFalse;
        // ��������£���� fn Ϊ�٣��Ǿ�ֱ�ӷ���
		} else if ( !fn ) {
			return this;
		}

        /*
        ��� one ����ר��Ϊ����� .one ���������
        ���������������ʾ����ĳ��Ԫ�ص�ĳһ���¼����ص��������ִ��һ��
        */
		if ( one === 1 ) {
			origFn = fn;
            // ִ��һ�ξ��Ƴ���
			fn = function( event ) {
				// Can use an empty set, since event contains the info
                /*
                ��㽨��һ�� jQuery ʵ�������� off ����������¼���
                ����� event �� jQuery.Event ʵ������Я������Ϣ��ȷ�����׽���ĸ��¼���
                */
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
            // ��Ӽ���
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
        /*
        off(event) ������ʽ
        event �� jQuery.Event ʵ��
        */
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
            /*
            ���ݹ���á�
             �������ռ����Ҫ�������ռ����
             �磺��ԭ�¼���"keydown.myPlugin.plugin"��
             handleObj : {
                ...
                origType : "keydown"
                namespace : "myPlugin.plugin"
                ...
             }
             handleObj.origType + "." + handleObj.namespace
             -> "keydown.myPlugin.plugin"
            */
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
        /*
        ������ʽ��
        off({
            mouseover : function(){
                alert(1);
            },
            mouseout : function(){
                alert(2);
            }
         }[,selector]); 

         ͬ���ǵݹ���ã�ת������ͨ��ʽ
        */
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
        // ( types [, fn] )
		if ( selector === false || typeof selector === "function" ) {
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},
    /*
    trigger �� triggerHandler �������£�
    �� trigger �ᴥ���¼���Ĭ����Ϊ��ð����Ϊ���� triggerHandler ���᣻
    �� trigger �ᴥ��ѡ������ȡ������Ԫ���¼����� triggerHandler ������һ��Ԫ���¼�
    �� trigger �������ش����÷����� jquery ʵ����������ʽ���ã�
       �� triggerHandler û�з���ֵ��Ҳ���Ƿ��� undefined��
    */
	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		var elem = this[0];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
});

/*
�����У�
jQuery.fn.extend({
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
	}
});
*/






var isSimple = /^.[^:#\[\.,]*$/,
	rparentsprev = /^(?:parents|prev(?:Until|All))/,
	rneedsContext = jQuery.expr.match.needsContext,
	// methods guaranteed to produce a unique set when starting from a unique set
	// ��֤Ψһ
    guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
    /*
	������String/Element/jQuery ������ָ���ı��ʽ
	���ã��Ե�ǰ JQ ����Ϊ�����ģ�Ѱ������ѡ���� selector �ĺ��Ԫ����ɵ� JQ ����
    */
	find: function( selector ) {
		var i,
			ret = [],
			self = this,
			len = self.length;

		// ���������ַ��������ﷵ�� JQ ����
		if ( typeof selector !== "string" ) {
			/*
			�� �ҳ�Ԫ�� jQuery( selector )
			�� ����Ԫ��
			�� ���˹���ѡ������Ԫ��һ��Ҫ�ǵ�ǰ JQ ����ĺ��Ԫ��

			���￴һ�� :
			$.fn.filter = function ( selector ) {
				return this.pushStack( winnow(this, selector || [], false) );
			}
			���ã����� this �������Ȼ����ʽ���õ���������ָΪ���˺�Ķ���
			*/
			return this.pushStack( jQuery( selector ).filter(function() {
				/*
				���� jQuery.contains( self[ i ], this ) 
				self[ i ] �ǵ��� find ������һ��Ԫ���е�һ����
				this �� jQuery( selector ) ��һ��Ԫ���е�һ��
				*/
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			}) );
		}

		// ����Ϊ�ַ��������þ�̬���� jQuery.find
		for ( i = 0; i < len; i++ ) {
			/*
			 jQuery.find �������ڵ�ǰ self[ i ] ��
			 ���к��Ԫ����ɸѡ����ָ�����ʽ selector ��Ԫ����ɵ� JQ ����
			 ret ��Ž��
			*/
			jQuery.find( selector, self[ i ], ret );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		// ����ʽ���õ����� JQ ���󽻸� ret
		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
		ret.selector = this.selector ? this.selector + " " + selector : selector;
		return ret;
	},

	/*
	������String/Element/jQuery ������ָ���ı��ʽ
	���ã�ɸѡ�������ض������Ԫ�أ�����jQuery�������ʽ����
	*/
	has: function( target ) {
		var targets = jQuery( target, this ),
			l = targets.length;

		/*
		���� targets = jQuery( target, this ) �Ѿ����˳����Ԫ���ˣ�Ϊʲô����Ҫ����Ĳ����أ�
		ԭ��
		����ȷʵ�� this Ϊ�����ģ��õ��˺��Ԫ���� targets�����ǣ���Ҫ���ˣ�this ������һ��Ԫ��
		�Դ�������У����滹��Ҫ�ҳ������� this �е���ЩԪ������İ��� targets[i] ��

		���ڷ��� $.fn.filter���ĸ�ʵ��������������͹����ĸ�ʵ������
		�����ǹ��˵��� has ������ JQ ����
		*/
		return this.filter(function() {
			var i = 0;
			for ( ; i < l; i++ ) {
				/*
				����� this ���ܵ�ͬ������ this
				���� this ���Կ���һ��Ԫ��
				����� this ֻ����һ��Ԫ���е�һ��
				*/
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	// ����� filter �������˺�ʣ�µĲ���
	not: function( selector ) {
		return this.pushStack( winnow(this, selector || [], true) );
	},

	// ���˵��ø� filter ������ JQ ����Ȼ�����ʽ���õ��������󽻸����˺�� JQ ����
	filter: function( selector ) {
		return this.pushStack( winnow(this, selector || [], false) );
	},

    // �жϵ�ǰ JQ �����Ƿ��������� jQuery( selector ) ������ selector �У�����ֵΪ����ֵ
	is: function( selector ) {
        /*
        �� . ��������ȼ����� ��
        �� �� selector ���ַ�����ʱ�򣬿� this �Ƿ��������� jQuery( selector ) ��
        �� �����ս��תΪ����ֵ
         */
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	},

    /*
    ���ã��ӵ�ǰƥ��Ԫ�ؿ�ʼ�������ϼ�ѡȡ����ָ�����ʽ�ĵ�һ��������ģ�Ԫ�أ����� jQuery �������ʽ���ء�
    expr    String/Element/jQuery ������ָ���ı��ʽ��
    context ��ѡ/Element/jQuery ������ָ����ʾ���ҷ�Χ���ĵ��ڵ㡣
     */
    // �ڸ����ķ�Χ��ҳ�����ĵķ��ϱ��ʽ selectors ��Ԫ��
	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
            // һ��ڵ�
			pos = ( rneedsContext.test( selectors ) || typeof selectors !== "string" ) ?
				jQuery( selectors, context || this.context ) :
				0;

        // �� this ��һ��Ԫ�أ�ÿ�� this[i] �ҵ�һ������� cur �������ڲ�ѭ��
		for ( ; i < l; i++ ) {
			for ( cur = this[i]; cur && cur !== context; cur = cur.parentNode ) {
				// Always skip document fragments
				if ( cur.nodeType < 11 && (pos ?
                    // cur �� pos ��һ��ڵ㵱��
					pos.index(cur) > -1 :

					// Don't pass non-elements to Sizzle
					cur.nodeType === 1 &&
						jQuery.find.matchesSelector(cur, selectors)) ) {

					cur = matched.push( cur );
					break;
                    // ������ѭ��
				}
			}
		}
        // ����������ȥ�ش���
		return this.pushStack( matched.length > 1 ? jQuery.unique( matched ) : matched );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
        /*
        �� û�в��������ص�ǰԪ�����丸�ڵ��е�����
        �� jQuery.fn.first() ���ڻ�ȡ��ǰ jQuery ������ƥ���Ԫ���еĵ� 1 ��Ԫ�أ������ط�װ��Ԫ�ص� jQuery ����

        ע��һ�� this[ 0 ] �� this.first() �Ĳ��죺
        this[ 0 ] ��ָ this ����ĵ�һ��ԭ���ڵ�
        this.first() ��ָ this ����ĵ�һ��ԭ���ڵ��װ��� jQuery ����
         */
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		// index in selector
        /*
        jQuery( elem ) �Ǹ������飬���� 0��1��2... �ֱ��Ӧԭ������
        ���ﷵ��ԭ������ this[ 0 ] �������� Query( elem ) �е�����
         */
		if ( typeof elem === "string" ) {
			return core_indexOf.call( jQuery( elem ), this[ 0 ] );
		}

		// Locate the position of the desired element
        /*
        �� ��� elem �Ǹ� jQuery ���󣬷��� elem[ 0 ] �� this ��� jQuery �����е�����
        �� elem ��ԭ�����󣬷��� elem �� this ��� jQuery �����е�����\

        ���У�ÿ�� jQuery ������ jquery ����
         */
		return core_indexOf.call( this,

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[ 0 ] : elem
		);
	},

    /*
    ���ã�������ǰƥ��Ԫ������ӷ���ָ�����ʽ��Ԫ�أ����� jQuery �������ʽ����
    expr    String/Element/jQuery ������ָ���ı��ʽ��
    context ��ѡ/Element/jQuery ������ָ����ʾ���ҷ�Χ���ĵ��ڵ㣬�ò���ֻ���� expr ������ʾѡ�����ַ���ʱ�ſ��á�
     */
	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
                // jQuery.makeArray ����ԭ��Ԫ����ɵ�����
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
                // this.get() Ҳ�Ƿ���ԭ��Ԫ����ɵ�����
			all = jQuery.merge( this.get(), set );

        // ����֮ǰȥ��
		return this.pushStack( jQuery.unique(all) );
	},

    /*
    ���ã����ڽ�֮ǰƥ���Ԫ�ؼ��뵽��ǰƥ���Ԫ���У������µ�jQuery�������ʽ���ء�
    selector  ��ѡ/String ����ָ����ѡ�����ַ���
    ���ʡ��selector�����������֮ǰѹջ֮ǰ�� jQuery ����

    �� this.prevObject ��ʾѹջ֮ǰ�� jQuery ����
    �� this.prevObject.filter(selector) ��ʾ����ѡ��� selector ���� this.prevObject
     */
	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter(selector)
		);
	}
});

// ��һ��Ԫ�س�������������ĳ�������ϵ�����Ԫ�أ��ҵ��˾ͷ���
function sibling( cur, dir ) {
	while ( (cur = cur[dir]) && cur.nodeType !== 1 ) {}

	return cur;
}

jQuery.each({
	// ���ظ�Ԫ��
	parent: function( elem ) {
		var parent = elem.parentNode;
		// 11 �ĵ���Ƭ�ڵ�
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	// ��������Ԫ��
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	// ��������Ԫ�أ���ĳ������Ԫ����ֹ��
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	// ���غ����һ���ֵܽڵ�
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	// ����ǰ���һ���ֵܽڵ�
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	// ���غ���������ֵܽڵ�
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	// ����ǰ��������ֵܽڵ�
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	// ���غ������ֵܽڵ㣨��ĳ���ֵ���ֹ��
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	// ����ǰ����ֵܽڵ㣨��ĳ���ֵ���ֹ��
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	// �������е��ֵܽڵ�
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	// ���������ӽڵ�
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	// ���ص�ǰ����ĵ�������Ԫ����ɵ�����
	contents: function( elem ) {
		// contentDocument ������ HTML ���󷵻ؿ�����ɵ��ĵ�
		return elem.contentDocument || jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		// ����õ���һ�� matched ���飬���������������й��ˡ�ȥ�ء����õȲ���
		var matched = jQuery.map( this, fn, until );
		/*
		�� this �����ÿһ��Ԫ�أ�ִ�У�
		value = fn( this[ i ], i, until )

		�� fn = function( elem ) {
			return jQuery.dir( elem, "nextSibling" );
		} Ϊ����

		����һ�����飬��������Ϊ this[ i ] ����������ֵ�Ԫ��

		��ô matched ��ֵ����һ����ά������
		�����ǣ���Ϊ match ��������и�����

		return core_concat.apply( [], ret );

		����ζ�Ŷ�ά���� ret������ת��Ϊһά�����ٷ��أ�������
		[].concat.apply([],[[1],[2,3],[4,5]])
		-> [1, 2, 3, 4, 5]
		*/

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		/*
		֮ǰ�� matched �л����Ѿ�ѡ�õ����ݣ�
		����ѡ���� selector���ٹ���һ�� matched �е�Ԫ��
		*/
		if ( selector && typeof selector === "string" ) {
			matched = jQuery.filter( selector, matched );
		}

		// this Ϊ $('div') �ȶ��Ԫ�ؼ��ϣ��� matched ������һЩ����
		if ( this.length > 1 ) {
			// Remove duplicates
			/*
			guaranteedUnique = {
				children: true,
				contents: true,
				next: true,
				prev: true
			};

			jQuery.unique() �������ڸ���Ԫ�����ĵ��г��ֵ��Ⱥ�˳��� DOM Ԫ������������򣬲��Ƴ��ظ���Ԫ�ء�
			*/
			if ( !guaranteedUnique[ name ] ) {
				jQuery.unique( matched );
			}

			// Reverse order for parents* and prev-derivatives
			/*
			rparentsprev = /^(?:parents|prev(?:Until|All))/

			parents��prevAll��prevUntil �ȷ���������һ�� matched ����
			*/
			if ( rparentsprev.test( name ) ) {
				matched.reverse();
			}
		}

		/*
		�� matched ��Ϊ������ʽ���õ���������
		eg: $('div').pushStack($('span')).css('background','red') -> span�������
		*/
		return this.pushStack( matched );
	};
});

jQuery.extend({
    // ����ѡ���� expr�����˳�����Ҫ���Ԫ�ؽڵ�
	filter: function( expr, elems, not ) {
		var elem = elems[ 0 ];

		if ( not ) {
            // "div" -> ":not(div)"
			expr = ":not(" + expr + ")";
		}

        /*
            �� elems ����Ϊ 1���������ĵ�Ԫ�أ�
               ���� matchesSelector ����������һ������
            �� ���򣬵��� matches ������jQuery.find.matches( expr��[ elems ���ĵ��ڵ�])

            ��֮�����ﷵ��ֵ����һ�����顣Ҫô��һ�������� []��Ҫô��һ�������ڵ�Ԫ�ص�����
            ���ԣ�jQuery.filter �������Ǹ���ѡ���������˳�����Ҫ���Ԫ�ؽڵ�
        */
		return elems.length === 1 && elem.nodeType === 1 ?
			jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
			jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
				return elem.nodeType === 1;
			}));
	},
	
	/**
	 * ��һ��Ԫ�س�������������ĳ�������ϵ�����Ԫ�ز���¼��ֱ��������document���������untilƥ���Ԫ��
	 * �����������򻯣���cur.nodeType !== 9 && !jQuery( cur ).is( until )
	 * elem	��ʼԪ��
	 * dir	�������򣬿�ѡֵ��parentNode nextSibling previousSibling
	 * until ѡ�������ʽ���������untilƥ���Ԫ�أ�������ֹ
	 * ����ֵ��һ��ԭ��Ԫ����ɵ�����
	 */
	dir: function( elem, dir, until ) {
		var matched = [],
			truncate = until !== undefined;
			/*
			�� until Ϊ undefined ʱ��truncate Ϊ false;
			�� until ��Ϊ undefined ʱ��truncate Ϊ true;
			*/

		while ( (elem = elem[ dir ]) && elem.nodeType !== 9 ) {
			if ( elem.nodeType === 1 ) {
				//��until Ϊ undefined�����ҵ���Ŀ��Ԫ�ء�������ֹ����
				if ( truncate && jQuery( elem ).is( until ) ) {
					break;
				}
				matched.push( elem );
			}
		}
		return matched;
	},

	// ����Ԫ�� n �����к����ֵ�Ԫ����ɵ����飬���� n �������� elem
	sibling: function( n, elem ) {
		var matched = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				matched.push( n );
			}
		}

		return matched;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
    /*
    ��˵һ�� jQuery.grep ������
    grep: function( elems, callback, inv )
    �� ����
    elems��������ߴ� length ���ԵĶ���
    callback������
    inv������ֵ�������ǲ���ֵǿ��ת��Ϊ����ֵ
    �� ����ֵ
    һ�����飬�� elems �в���Ԫ����ɵ����飬Ҳ����˵���˵���һ����
    �� ���˹���
       !!callback( elems[ i ], i ) �� !!not �Ƚϣ���Ⱦ͹��˵����Ԫ�� elems[ i ]
    �� �ܽ᣺�ҳ� elems �о��� callback ���������Ϊ inv ��һ��Ԫ��
       
    ������δ��빦�ܺ� jQuery.grep ͦ��ģ�
    ֻ�������˷���ִ�е�ʱ���ڲ� this �󶨵� elem�����Ҳ���˳����һ�£�i �� elem��
    */
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			/* jshint -W018 */
			return !!qualifier.call( elem, i, elem ) !== not;
		});
        // ���� elements �в���Ԫ����ɵġ����顿���ж������� qualifier ��������ֵ�� not �Ƿ����
	}

    // qualifier ���ĵ��ڵ�
	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		});
        // ���� elements �в���Ԫ����ɵġ����顿���ж�������Ԫ�� elem �� qualifier �ǲ���ͬһ���ڵ�
	}

    /*
    isSimple = /^.[^:#\[\.,]*$/ �����ַ��������з�����ͷ�����治���� : # [ . , �ȷ��ž���
    ���ã�ƥ��ѡ����

    isSimple.test('div')  // true
    isSimple.test('.cls') // true
    isSimple.test('#id')  // true

    isSimple.test('div:') // false
    isSimple.test('div#') // false
    */
    // qualifier ���ַ���
	if ( typeof qualifier === "string" ) {
        // �����ѡ�����ַ������ͽ��� jQuery.filter ����������ͷ���
		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter( qualifier, elements, not );
		}
        // ������ jQuery.filter �� qualifier �ַ�������Ϊ�����顿
		qualifier = jQuery.filter( qualifier, elements );
	}

    /*
    core_indexOf = [].indexOf  ����Ԫ���������е�����
    [1,2,3].indexOf(1)    // 0
    [1,2,3].indexOf('1')  // -1
    [1,2,3].indexOf(4)    // -1

    ����� qualifier ��һ������
    */
	return jQuery.grep( elements, function( elem ) {
		return ( core_indexOf.call( qualifier, elem ) >= 0 ) !== not;
	});
    // ���� elements �в���Ԫ����ɵġ����顿���ж�������Ԫ�� elem �Ƿ������� qualifier ֮��
}



var rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	rtagName = /<([\w:]+)/,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style|link)/i,
	manipulation_rcheckableType = /^(?:checkbox|radio)$/i,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /^$|\/(?:java|ecma)script/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

	// We have to close these tags to support XHTML (#13200)
	wrapMap = {

		// Support: IE 9
		option: [ 1, "<select multiple='multiple'>", "</select>" ],

		thead: [ 1, "<table>", "</table>" ],
		col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

		_default: [ 0, "", "" ]
	};

// Support: IE 9
wrapMap.optgroup = wrapMap.option;

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

/*
�൱�ڣ�
rapMap = {
	optgroup:Array(3)
	option:Array(3)

	tbody:Array(3)
	tfoot:Array(3)
	colgroup:Array(3)
	caption:Array(3)
	thead:Array(3)

	col:Array(3)

	tr:Array(3)

	th:Array(3)
	td:Array(3)

	_default:Array(3)
};
*/

jQuery.fn.extend({
	/*
	���� jQuery.access ����������һ�¸÷����ڲ�ִ�����̣�:
	(1) value == undefined
	�� key == null -> bulk = true;
	�� value == undefined��û���Σ� -> arguments.length = 0���٣����� chainable Ϊ��
	   -> fn.call(elems)
	   -> jQuery.text( this )
	 Ҳ����˵��$('p').text() �൱�� jQuery.text($('p'))

	(2) value !== undefined
	�� key == null -> bulk = true;
	�� value !== undefined��һ�����Σ� -> chainable = true
	   a. value ���� function -> raw = true 
	      -> fn.call( elems, value )
		  -> this.empty().append( ( this[ 0 ] && this[ 0 ].ownerDocument || document ).createTextNode( value ) )
		  Ҳ����˵��$('p').text('���µ�����') -> ���е� p ��ǩ���ݱ�Ϊ �����µ����ݡ�
	   b. value �� function -> raw = undefined��û���Σ�-> bulk = fn
	      -> fn = function( elem, key, value ) {
				  return bulk.call( jQuery( elem ), value );
			  };
		  -> for ѭ����fn( elems[i], key, value.call( elems[i], i, fn( elems[i], key ) ) )
		  -> for ѭ����bulk.call( jQuery( elems[i] ), value.call( elems[i], i, fn( elems[i], key ) ) )
		  -> ���� val = value.call( elems[i], i, fn( elems[i], key ) )�������൱�ڣ�
		     bulk.call( jQuery( elems[i] ), val)
		  -> for ѭ����this[i].empty().append( ( this[i][ 0 ] && this[i][ 0 ].ownerDocument || document ).createTextNode( value ) );
		     -> �������θ� this ��ÿ��Ԫ�ظ����ı�����
		  -> chainable = true��ֱ�ӷ������������� this ����
	*/
	text: function( value ) {
		return jQuery.access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().append( ( this[ 0 ] && this[ 0 ].ownerDocument || document ).createTextNode( value ) );
		}, null, value, arguments.length );
	},

	// ��Ԫ���ڲ�ĩβ�����ӽڵ�
	append: function() {
		return this.domManip( arguments, function( elem ) {
			// 	Element || document || DocumentFragment
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				/*
				�� ��� this ���� table���ǾͲ���������target ���� this��
				�� ��� this �� table��elem �� tr���Ǿ����� target Ϊ this �µĵ�һ�� tbody

				domManip ��ִ�У�callback.call( this[ i ], node, i );
				Ҳ����˵������� elem �����ĵ���Ƭ node
				*/
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		});
	},

	// ��Ԫ���ڲ���ǰ������ӽڵ�
	prepend: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		});
	},

	// ��Ԫ��ǰ������ֵܽڵ�
	before: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		});
	},

	// ��Ԫ�غ�������ֵܽڵ�
	after: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		});
	},

	// keepData is for internal use only--do not document
	/*
	���ã����ĵ����Ƴ�ƥ���Ԫ�أ�ͬʱ�Ƴ���Ԫ�ع����󶨵ĸ������ݣ�data() ���������¼���������
	selector ��ѡ����
	keepData ���Ƿ�ɾ���������ݣ�Ĭ��ɾ��
	*/
	remove: function( selector, keepData ) {
		var elem,
			/*
			�� ��ѡ�������д�������������ɾ�� this ��ѡ��ƥ��Ԫ��
			�� û��ѡ������û�д��Σ���ɾ�� this
			*/
			elems = selector ? jQuery.filter( selector, this ) : this,
			i = 0;

		for ( ; (elem = elems[i]) != null; i++ ) {
			// keepData Ϊ�٣���ʾɾ����������
			if ( !keepData && elem.nodeType === 1 ) {
				/*
				�� getAll( elem ) ��ȡ elem ����������Ԫ����ɵ�����
				�� jQuery.cleanData ɾ��Ԫ���ϵĻ������ݣ��󶨵��¼����û���ӵ����ݵȵȣ�
				*/
				jQuery.cleanData( getAll( elem ) );
			}

			if ( elem.parentNode ) {
				// jQuery.contains( elem.ownerDocument, elem ) Ϊ true ��ʾԪ�� elem ���ĵ� elem.ownerDocument ��
				if ( keepData && jQuery.contains( elem.ownerDocument, elem ) ) {
					// ��� elem �е� script ��ִ�й�
					setGlobalEval( getAll( elem, "script" ) );
				}
				// ���ĵ����Ƴ� elem Ԫ��
				elem.parentNode.removeChild( elem );
			}
		}

		return this;
	},

	// ���Ԫ������
	empty: function() {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			if ( elem.nodeType === 1 ) {

				// Prevent memory leaks
				jQuery.cleanData( getAll( elem, false ) );

				// Remove any remaining nodes
				/*
				���Ԫ������

				eg:
				dom Ԫ�����£�
				console.log(ad)
				-> <li id="ad" class="item"><div class="pic"><a href="http://fang.anjuke.com/loupan/?pi=2345-cnxh-feeds-xf-qita-shenghuo-cy1" data-li="item_a_18" onclick="T.dxwChannel.ajaxDsp(this,73,event)"><img width="100%" src="//img3.2345.com/eimg/201704/e06987a23463d5368ecc2b16626ab76d.jpg" alt=""></a></div><table class="cont"><tbody><tr><td><div class="title"><a href="http://fang.anjuke.com/loupan/?pi=2345-cnxh-feeds-xf-qita-shenghuo-cy1" data-li="item_a_18" onclick="T.dxwChannel.ajaxDsp(this,73,event)">[dsp]5���¿�¥�̣����ͺ� ��ͨ���� �׸��ͣ�</a></div><div class="extra"><span class="cate">���</span><span class="from">[dsp]���ӿ��·�</span></div></td></tr></tbody></table></li>
				
				ad.textContent = ""
				console.log(ad)
				-> <li id="ad" class="item"></li>
				*/
				elem.textContent = "";
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		return jQuery.access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined && elem.nodeType === 1 ) {
				return elem.innerHTML;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

				value = value.replace( rxhtmlTag, "<$1></$2>" );

				try {
					for ( ; i < l; i++ ) {
						elem = this[ i ] || {};

						// Remove element nodes and prevent memory leaks
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch( e ) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var
			// Snapshot the DOM in case .domManip sweeps something relevant into its fragment
			args = jQuery.map( this, function( elem ) {
				return [ elem.nextSibling, elem.parentNode ];
			}),
			i = 0;

		// Make the changes, replacing each context element with the new content
		this.domManip( arguments, function( elem ) {
			var next = args[ i++ ],
				parent = args[ i++ ];

			if ( parent ) {
				// Don't use the snapshot next if it has moved (#13810)
				if ( next && next.parentNode !== parent ) {
					next = this.nextSibling;
				}
				jQuery( this ).remove();
				parent.insertBefore( elem, next );
			}
		// Allow new content to include elements from the context set
		}, true );

		// Force removal if there was no new content (e.g., from empty arguments)
		return i ? this : this.remove();
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	/*
	�� domManip �� dom-Manipulate��Ҳ���� dom ��������˼
	�� ���� args ����Ϊ HTML�ַ�����DOM Ԫ�أ�Ԫ�����飬���� jQuery ����
	�� domManip ����������ܣ�
	   a. �ĵ���Ƭ dom ���
	   b. ��� dom �ڵ����� script ��ǩ�����⴦��һ��
	�� domManip ����Ҫ������Ϊ��ʵ�� DOM �Ĳ�����滻�����干Ϊ���� 5 ����������
	�ڲ�����루append��
	�ڲ�ǰ���루prepend��
	�ⲿǰ���루before��
	�ⲿ����루after��
	�滻Ԫ�� ��replaceWith��

	jQuery.each ���������������� 5 ��������
	appendTo��prependTo��insertBefore��insertAfter��replaceAll
	*/
	domManip: function( args, callback, allowIntersection ) {

		// Flatten any nested arrays
		/*
		�� ������תΪ������
		�� �������������Ͳ������ջ���ת��һά����
		function f(){
			return [].concat.apply([],arguments);
		}
		f(1,2,3) -> [1, 2, 3]
		f(1,[2,3]) -> [1, 2, 3]
		*/
		args = core_concat.apply( [], args );

		var fragment, first, scripts, hasScripts, node, doc,
			i = 0,
			l = this.length,
			set = this,
			iNoClone = l - 1,
			value = args[ 0 ],
			isFunction = jQuery.isFunction( value );

		// We can't cloneNode fragments that contain checked, in WebKit
		/*
		!( l <= 1 || typeof value !== "string" || jQuery.support.checkClone || !rchecked.test( value ) ) 
		-> l > 1 && typeof value === "string" && !jQuery.support.checkClone && rchecked.test( value )

		rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i
		rchecked.test('checked="checked"') -> true

		�ɵ� WebKit����¡ fragment �ڵ㣬����ýڵ����� input����ô input �� checkd ״̬���ᱻ����
		*/
		if ( isFunction || !( l <= 1 || typeof value !== "string" || jQuery.support.checkClone || !rchecked.test( value ) ) ) {
			return this.each(function( index ) {
				var self = set.eq( index );
				if ( isFunction ) {
					/*
					ʵ��������
					jQuery.fn.each: function( callback, args ) {
						return jQuery.each( this, callback, args );
					}
					��̬������
					jQuery.each : function( obj, callback, args ) {
						...
						value = callback.call( obj[ i ], i, obj[ i ] );
						...
					}

					���ԣ������ this Ϊ set[index]
					*/
					args[ 0 ] = value.call( this, index, self.html() );
				}
				// �����һ�������Ǻ�������������Ϊ�ַ����󣬵ݹ���� domManip ����
				self.domManip( args, callback, allowIntersection );
			});
		}

		if ( l ) {
			fragment = jQuery.buildFragment( args, this[ 0 ].ownerDocument, false, !allowIntersection && this );
			first = fragment.firstChild;
			/*
			var args = $('p');
			fragment = jQuery.buildFragment( args, document, false, false );

			fragment.firstChild
			-> <p>This is a paragraph.</p>
			*/
			
			// ֻ��һ���ӽڵ�
			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}

			// ����������һ���ӽڵ㣬Ҫ��Ȼ����Ͳ������������
			if ( first ) {
				/*
				�� getAll ����ָ��Ԫ�أ����� 1���б�ǩ��Ϊ���� 2 ����Ԫ����ɵ�����
				�� disableScript �������� script ��ǩ
				�� ����һ���ʾ��ֹ fragment �е����� script ��ǩ
				*/
				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
				hasScripts = scripts.length;

				// Use the original fragment for the last item instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for ( ; i < l; i++ ) {
					node = fragment;
					
					// �������һ��
					if ( i !== iNoClone ) {
						/*
						�� һ�� jQuery ������ܰ�������ڵ㣬Ϊ�˱�֤ÿ���ڵ㶼����Ƭ���ݿ��ã�������Ҫ��¡�� this.length ����Ƭ
						�� ���ﲻ���¡��Ƭ�ڵ㣬����Ƭ�ڵ���¼����������ݵȶ�����
						�� ��Ƭ�ڵ��β����ĵ���script �ű�Ҳ�ǽڵ�Ԫ�أ����ִ��Ҳ��Ӧ�õģ����������ж�� script Ԫ��
						*/
						node = jQuery.clone( node, true, true );

						// Keep references to cloned scripts for later restoration
						if ( hasScripts ) {
							// Support: QtWebKit
							// jQuery.merge because core_push.apply(_, arraylike) throws
							jQuery.merge( scripts, getAll( node, "script" ) );
						}
					}
					// �õڶ������������������ȡ���ĵ���Ƭ node
					callback.call( this[ i ], node, i );
				}

				if ( hasScripts ) {
					doc = scripts[ scripts.length - 1 ].ownerDocument;

					// Reenable scripts������ű�����
					jQuery.map( scripts, restoreScript );

					// Evaluate executable scripts on first document insertion
					for ( i = 0; i < hasScripts; i++ ) {
						node = scripts[ i ];
						/*
						�� rscriptType = /^$|\/(?:java|ecma)script/i
						   type="text/javascript" �� type="text/ecmascript" ��û�� type �� script ��ǩ��ִ��
						�� data_priv.access( node, "globalEval" ) Ϊ true ��ʾ�ű�ִ�й���
						�� jQuery.contains( doc, node ) Ϊ true ��ʾ node �������� doc �ĵ���
						*/
						if ( rscriptType.test( node.type || "" ) &&
							!data_priv.access( node, "globalEval" ) && jQuery.contains( doc, node ) ) {

							if ( node.src ) {
								// Hope ajax is available...
								// ͨ�� jQuery.ajax �������� get ���͵� http ����
								jQuery._evalUrl( node.src );
							} else {
								/*
								�� globalEval ��ʾȫ�ֽ��� script �ű���Ĵ���
								�� rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g
								   �޳��� html ע��

								   rcleanScript.exec('<!--  -->')
								   -> rcleanScript.exec('<!--  -->')
								*/
								jQuery.globalEval( node.textContent.replace( rcleanScript, "" ) );
							}
						}
					}
				}
			}
		}

		return this;
	}
});

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1,
			i = 0;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone( true );
			jQuery( insert[ i ] )[ original ]( elems );

			// Support: QtWebKit
			// .get() because core_push.apply(_, arraylike) throws
			core_push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
});

jQuery.extend({
	/*
	���ã���¡��ǰƥ��Ԫ�ؼ��ϵ�һ������������ jQuery �������ʽ����
	dataAndEvents���Ƿ�ͬʱ����Ԫ�صĸ������ݺͰ��¼���Ĭ��Ϊ false
	deepDataAndEvents���Ƿ�ͬʱ����Ԫ�ص�������Ԫ�صĸ������ݺͰ��¼���Ĭ��ֵ��Ϊ���� withDataAndEvents��ֵ��
	*/
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var i, l, srcElements, destElements,
			// �÷��������Ʋ����ص������Ľڵ�ĸ�����������ݸ����Ĳ����� true���������ݹ鸴�Ƶ�ǰ�ڵ����������ڵ㡣������ֻ���Ƶ�ǰ�ڵ㡣
			clone = elem.cloneNode( true ),
			// elem �Ƿ��Ѿ����ĵ���
			inPage = jQuery.contains( elem.ownerDocument, elem );

		// Support: IE >= 9
		// Fix Cloning issues
		/*
		�� ��֧�ֵ�ѡ��ѡ��״̬���ƣ�!jQuery.support.noCloneChecked���������ֹ�����
		�� ֧��ѡ��״̬���Ƶľ�û��Ҫ����һ���ˣ�clone ��ʱ����Ѿ���ѡ��״̬���ƹ�ȥ��
		*/
		if ( !jQuery.support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) && !jQuery.isXMLDoc( elem ) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			// getAll �������Ԫ����������е���Ԫ��
			destElements = getAll( clone );
			srcElements = getAll( elem );

			for ( i = 0, l = srcElements.length; i < l; i++ ) {
				// ��Ԫ���ǵ�ѡ��/��ѡ���ʱ�򣬽�Դ�ڵ��ѡ��״̬��ֵ��Ŀ��ڵ�
				fixInput( srcElements[ i ], destElements[ i ] );
			}
		}

		// Copy the events from the original to the clone
		// ����Ԫ�صĸ������ݺͰ��¼�
		if ( dataAndEvents ) {
			// ͬʱ����Ԫ�ص�������Ԫ�صĸ������ݺͰ��¼�
			if ( deepDataAndEvents ) {
				/*
				�� ����������֧�ֵ�ѡ��ѡ��״̬���ƣ���������� if �飬srcElements��destElements �������ʼ��
				�� ʣ������������������ȡ���� if ���������� srcElements��destElements
				*/
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					// ���θ��Ƹ������ݺͰ��¼�
					cloneCopyEvent( srcElements[ i ], destElements[ i ] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		// ����ű���ʷִ�м�¼
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			/*
			�� inPage Ϊ true����ʾ elem �Ѿ����ĵ��У��� destElements ��ÿ�� script ���Ϊ false
			   data_priv.set(destElements[ i ], "globalEval", false) ��ʾ�ű���ִ�й�
			�� inPage Ϊ false��elem �����ĵ��У�������Ľű��е�ִ�й����е�ûִ�й�
			   setGlobalEval( destElements, getAll( elem, "script" ) )
			   �� elem ��ÿ���ű��Ƿ�ִ�й��ı�Ǹ��ƹ�ȥ
			*/
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		// Return the cloned set
		return clone;
	},

	/*
	�������ط����� buildFragment ������
	�� parseHTML �У�
	   parsed = jQuery.buildFragment( [ data ], context, scripts );
	�� domManip �У�
	   fragment = jQuery.buildFragment( args, this[ 0 ].ownerDocument, false, !allowIntersection && this );

	���У�
	elems Ϊ�����������
	context Ϊ������
	scripts Ϊ����ֵ������
	selection ҪôΪ false��ҪôΪ jQuery ����this��

	�򵥵Ŀ�һ��������������Ǵ���һ���ĵ���Ƭ��
	buildFragment: function( elems, context, scripts, selection ) {
		var fragment = context.createDocumentFragment();
		// ��һ���� �ֽ����ͣ�jQuery���󣬽ڵ�����ı�����Ҫ��װ��Ԫ�صȣ��ֱ���� nodes ����
		if ( jQuery.type( elem ) === "object" ) {
            jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );
        } else if ( !rhtml.test( elem ) ) {
            nodes.push( context.createTextNode( elem ) );
        } else {
            jQuery.merge( nodes, tmp.childNodes )
        }
		// �ڶ������ֱ�� nodes �е�Ԫ�ؼ��� fragment
		while ( (elem = nodes[ i++ ]) ) {
			fragment.appendChild( elem );
		}
		return fragment;
	};
	*/
	buildFragment: function( elems, context, scripts, selection ) {
		var elem, tmp, tag, wrap, contains, j,
			i = 0,
			l = elems.length,
			fragment = context.createDocumentFragment(),
			nodes = [];
		/*
		DocumentFragment �ڵ��������������
		�� nodeType ��ֵΪ 11
		�� nodeName ��ֵΪ #document-fragment
		�� nodeValue ��ֵΪ null
		�� parentNode ��ֵΪ null
		�� �ӽڵ������ Element��ProcessingInstruction��Comment��Text��CDATASection �� EntityReference
		�� DocumentFragment �ڵ㲻�����ĵ������̳е� parentNode �������� null
		�� ��һ�� DocumentFragment �ڵ�����ĵ���ʱ������Ĳ��� DocumentFragment ��������������������ڵ�
		*/
		for ( ; i < l; i++ ) {
			elem = elems[ i ];

			if ( elem || elem === 0 ) {

				// Add nodes directly
				if ( jQuery.type( elem ) === "object" ) {
					// Support: QtWebKit
					// jQuery.merge because core_push.apply(_, arraylike) throws
					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

				// Convert non-html into a text node
				/*
				rhtml = /<|&#?\w+;/ ƥ�� < �� &#?\w+;
				��ƥ����� < �� ʵ�� ���ַ���
				rhtml.test( '<abc' )		// true
				rhtml.test( 'abc&lt;aba' )  // true

				������ html ʵ����ţ�
				��ʾ    ����	  ʵ������  ʵ����
				<		С�ں�		&lt;	 &#60;
				>		���ں�		&gt;	 &#62;
				*/
				// �������� html ��ǩ���ַ���ת��Ϊ�ı��ڵ�
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );

				// Convert html into DOM nodes
				} else {
					/*
					�� ѭ����һ�� tmp Ϊ��
					�� appendChild �����ķ���ֵ�Ǳ���ӵĽڵ�
					�� �����ѭ����tmp ���ǵ�һ�δ����� div �ڵ�
					*/
					tmp = tmp || fragment.appendChild( context.createElement("div") );

					// Deserialize a standard representation
					/*
					rtagName = /<([\w:]+)/ 
					�� \w ��ĸ���ֻ��»��߻��֣������� < �� > ���ַ���
					�� [\w:] ��ʾ \w �� : 
					   Ҳ����˵����ĸ���ֻ��»��߻��ֻ�:
					
					eg��
					rtagName.exec('<div') -> ["<div", "div", index: 0, input: "<div"]
					rtagName.exec('<div>') ->  ["<div", "div", index: 0, input: "<div>"]
					rtagName.exec('<div><span') -> ["<div", "div", index: 0, input: "<div><span"]

					ע�����������û��ȫ�� g ƥ�䣬����ֻ��ȡ��һ����ǩ

					����� tag ����ƥ�������Ԫ�ر�ǩ��
					*/
					tag = ( rtagName.exec( elem ) || ["", ""] )[ 1 ].toLowerCase();
					/*
					wrap �Ǵ� wrapMap ��ƥ�����������
					eg: 
					tag Ϊ thead��wrap Ϊ [ 1, "<table>", "</table>" ] 
                    tag ���� wrapMap �����б��wrap ΪĬ�ϵ� [ 0, "", "" ]
					*/
                    wrap = wrapMap[ tag ] || wrapMap._default;
					/*
					(1) rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi
						ƥ��û�бպϵı�ǩ

					�� (?!exp) ƥ�������Ĳ���exp��λ��
					�� br��img��input �ȱ����Ͳ��պϵı�ǩ����
					�� rxhtmlTag.exec('<span />') -> ["<span />", "span ", "span", index: 0, input: "<span />"]
					�� <span></span> �ȱպϱ�ǩ����ͨ��ƥ�� rxhtmlTag.exec('<span></span>') -> null

					(2) elem.replace( rxhtmlTag, "<$1></$2>" )
						�õڶ��������滻��һ������

					�� ����ڶ����������ַ��������е� $1��$2 �ֱ��ʾ rxhtmlTag �е� 1��2 ���ӱ��ʽ����
					�� ����滻�𵽱պϱ�ǩ������ <span /> -> <span ></span>

					(3) ���� option��tr��td ��һ����Ԫ�أ���Ҫ�����Ǽ�һ�����Ĭ�ϵ�����Ԫ��
					eg:
					<td></td> -> <table><tbody><tr><td></td></tr></tbody></table>
					*/
                    tmp.innerHTML = wrap[ 1 ] + elem.replace( rxhtmlTag, "<$1></$2>" ) + wrap[ 2 ];

					// Descend through wrappers to the right content
					/*
					���磺tmp.innerHTML = <table><tbody><tr><td></td></tr></tbody></table>
					j = 3
					ִ���������ѭ�� tmp = <tr><td></td></tr>
					*/
					j = wrap[ 0 ];
					while ( j-- ) {
						tmp = tmp.lastChild;
					}

					// Support: QtWebKit
					// jQuery.merge because core_push.apply(_, arraylike) throws
					jQuery.merge( nodes, tmp.childNodes );

					// Remember the top-level container
					tmp = fragment.firstChild;

					// Fixes #12346
					// Support: Webkit, IE
					tmp.textContent = "";
				}
			}
		}

		// Remove wrapper from fragment
		fragment.textContent = "";

		i = 0;
		while ( (elem = nodes[ i++ ]) ) {

			// #4087 - If origin and destination elements are the same, and this is
			// that element, do not do anything
			/*
			jQuery.inArray : function ( elem, arr, i ) {
				return arr == null ? -1 : core_indexOf.call( arr, elem, i );
			}

			��� elem ������ selection ����������ѭ��
			*/
			if ( selection && jQuery.inArray( elem, selection ) !== -1 ) {
				continue;
			}

			// �ж� elem �Ƿ��Ѿ��� document �ĵ�����
			contains = jQuery.contains( elem.ownerDocument, elem );

			// Append to fragment
			/*
			�� appendChild �������ر���ӵĽڵ�
			�� getAll ����ָ��Ԫ�أ����� 1���б�ǩ��Ϊ���� 2 ����Ԫ����ɵ�����
			�� ��ȡ elem �е� script Ԫ��
			*/
			tmp = getAll( fragment.appendChild( elem ), "script" );

			// Preserve script evaluation history
			/*
			�� setGlobalEval �����θ� tmp ��ÿһ��Ԫ�ؼ�һ�� "globalEval" ���ԣ�
			   for ѭ��: data_priv.set(elems[ i ], "globalEval",true)
			�� contains Ϊ true����ʾ elem �Ƿ��Ѿ��� document �ĵ����У���ô�ͱ�ʾ�ű�ִ�й���
			*/
			if ( contains ) {
				setGlobalEval( tmp );
			}

			// Capture executables
			// domManip �������� buildFragment ����ʱ��scripts Ϊ false�����¾�ûʲô����
			if ( scripts ) {
				j = 0;
				/*
				rscriptType = /^$|\/(?:java|ecma)script/i
				script ��ǩ��
				��ʽд����<script type="text/javascript"></script> 
				h5 д����<script></script>
				
				eg:
				rscriptType.test("") -> true
				rscriptType.test("text/javascript") -> true
				*/
				while ( (elem = tmp[ j++ ]) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}

		return fragment;
	},

	// ɾ��Ԫ���ϵĻ������ݣ��󶨵��¼����û���ӵ����ݵȵȣ�
	cleanData: function( elems ) {
		var data, elem, events, type, key, j,
			special = jQuery.event.special,
			i = 0;

		for ( ; (elem = elems[ i ]) !== undefined; i++ ) {
			/*
			�� ������ĵ��ڵ㣬ֻ�� nodeType �� 1 �� 9������ true
			�� �������ͨ���󣬶����� true
			*/
			if ( Data.accepts( elem ) ) {
				/*
				�� ÿ�� Data() ���캯������һ�䣺this.expando = jQuery.expando + Math.random();
				   ���ԣ�ÿһ�� Data ʵ������һ���̶��� expando ����
				�� data_priv = new Data(); ���� data_priv Ҳ�� expando ����
				�� elem[ data_priv.expando ] �� 1,2,3...������Ȼ��
				�� data_priv.cache[ elem[ data_priv.expando ] ] ���� elem ��˽�л�������
				*/
				key = elem[ data_priv.expando ];

				if ( key && (data = data_priv.cache[ key ]) ) {
					/*
					�� Object.keys() �����᷵��һ����һ����������������ö��������ɵ����飬
					������������������˳���ʹ�� for...in ѭ�������ö���ʱ���ص�˳��һ�� 
					�����ߵ���Ҫ������ һ�� for-in ѭ������ö����ԭ�����ϵ����ԣ���
					�� data.events : {
							click : [handleObj,handleObj,handleObj,...]
							mouseover : [handleObj,handleObj,handleObj,...]
							mousedown : [handleObj,handleObj,handleObj,...]
					   }
					*/
					events = Object.keys( data.events || {} );
					if ( events.length ) {
						for ( j = 0; (type = events[j]) !== undefined; j++ ) {
							// �����¼����� jQuery.event.remove �����Ƴ��������ϴ�
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							// һ��ģ��� jQuery.removeEvent ����ԭ���� removeEventListener �����Ƴ��¼�
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}
					// Ԫ�� elem ��Ӧ�ġ�˽�����ݡ���ɾ��
					if ( data_priv.cache[ key ] ) {
						// Discard any remaining `private` data
						delete data_priv.cache[ key ];
					}
				}
			}
			// Discard any remaining `user` data
			// Ԫ�� elem ��Ӧ�ġ��û���ӵ����ݡ���ɾ��
			delete data_user.cache[ elem[ data_user.expando ] ];
		}
	},

	_evalUrl: function( url ) {
		return jQuery.ajax({
			url: url,
			type: "GET",
			dataType: "script",
			async: false,
			global: false,
			"throws": true
		});
	}
});

// Support: 1.x compatibility
// Manipulating tables requires a tbody
/*
���ã�����Ŀ��Ԫ��
�� һ������²���������ֱ�ӷ��� elem
�� ���Ԫ�� elem �� table������ content �� tr������ tbody
*/
function manipulationTarget( elem, content ) {
	/*
	ע����������ȼ���
	&& ���� || ���� ? :
	
	�� ���Ԫ�� elem �� nodeName Ϊ table������ content Ԫ��Ϊ tr������ elem �µ�һ�� tbody Ԫ�أ�û�оʹ���һ����
	�� ����ֱ�ӷ��� elem
	*/
	return jQuery.nodeName( elem, "table" ) &&
		jQuery.nodeName( content.nodeType === 1 ? content : content.firstChild, "tr" ) ?

		elem.getElementsByTagName("tbody")[0] ||
			elem.appendChild( elem.ownerDocument.createElement("tbody") ) :
		elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
/*
�����������ű���ǩ��
<script type="text/javascript" src="js/jquery-2.0.3.js"></script>
<script></script>

s1 = document.getElementsByTagName('script')[0];
s2 = document.getElementsByTagName('script')[1]

disableScript(s1)
-> <script type="true/text/javascript" src="js/jquery-2.0.3.js"></script>
disableScript(s2)
-> <script type="false/"></script>

�����ű��Ͳ���ִ���ˡ��ٸ����ӣ�
�ű��٣�<script>alert(1)</script>
�ű��ڣ�<script type="false/">alert(1)</script>

�ű��ٻᵯ�� 1���ű��ڲ��ᡣ

�ű��ۣ�<script type="text/javascript" src="js/jquery-2.0.3.js"></script>
�ű��ܣ�<script type="true/text/javascript" src="js/jquery-2.0.3.js"></script>

�ű��ۻ���� js/jquery-2.0.3.js���ű��ܲ���
*/
function disableScript( elem ) {
	elem.type = (elem.getAttribute("type") !== null) + "/" + elem.type;
	return elem;
}
/*
rscriptTypeMasked = /^true\/(.*)/

rscriptTypeMasked.exec("text/javascript") 
-> null
rscriptTypeMasked.exec("true/text/javascript")  
->  ["true/text/javascript", "text/javascript", index: 0, input: "true/text/javascript"]

restoreScript ��������ű��Ľ���״̬
*/
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );

	if ( match ) {
		elem.type = match[ 1 ];
	} else {
		elem.removeAttribute("type");
	}

	return elem;
}

// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var l = elems.length,
		i = 0;

	for ( ; i < l; i++ ) {
		/*
		ע�������������
		!refElements || data_priv.get( refElements[ i ], "globalEval" )
		�� ���û�в��� refElements�����ϱ��ʽΪ true
		�� ��� refElements[ i ] �������� "globalEval"�����ϱ��ʽҲΪ true
		
		������������£��൱�ڣ�
		data_priv.set(elems[ i ], "globalEval",true)

		�� ����вο�Ԫ�� refElements�����ν� refElements[ i ] ��ִ��״̬��ֵ�� elems[ i ]
		*/
		data_priv.set(
			elems[ i ], "globalEval", !refElements || data_priv.get( refElements[ i ], "globalEval" )
		);
	}
}

// ���Ƹ������ݺͰ��¼�
function cloneCopyEvent( src, dest ) {
	var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;

	// ���Ŀ�겻�� Element��ֱ�ӷ���
	if ( dest.nodeType !== 1 ) {
		return;
	}

	// 1. Copy private data: events, handlers, etc.
	// �����˽�еĻ������ݣ�events, handlers �ȣ�
	if ( data_priv.hasData( src ) ) {
		// ��ȡ src ��˽������
		pdataOld = data_priv.access( src );
		// �� src ��˽���������θ��Ƹ� dest
		pdataCur = data_priv.set( dest, pdataOld );
		// �¼��ǱȽ������˽�����ݣ�ֱ�Ӹ��ƹ�ȥ�����У�����Ҫ���°��¼�
		events = pdataOld.events;

		if ( events ) {
			delete pdataCur.handle;
			pdataCur.events = {};

			for ( type in events ) {
				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
					// ���ΰ��¼��󶨵�Ŀ��Ԫ����
					jQuery.event.add( dest, type, events[ type ][ i ] );
				}
			}
		}
	}

	// 2. Copy user data
	// ������Լ���ӵĻ�������
	if ( data_user.hasData( src ) ) {
		udataOld = data_user.access( src );
		// ΪʲôҪ�Ȱѻ������ݸ�һ���м�����أ��ѵ�����Ϊ��������ݿ��Ա��û����ģ����������
		udataCur = jQuery.extend( {}, udataOld );
		// ��Դ�ڵ�����ݸ�ֵ��Ŀ��ڵ�
		data_user.set( dest, udataCur );
	}
}



// ���ݱ�ǩ��ѡ��Ԫ��
function getAll( context, tag ) {
	var ret = context.getElementsByTagName ? context.getElementsByTagName( tag || "*" ) :
			context.querySelectorAll ? context.querySelectorAll( tag || "*" ) :
			[];

	/*
	&&�����ȼ����ڡ�||
	�� û�� tag ������ context �� nodeName ���� tag����ʱ ret Ϊ [context �����ӽڵ���ɵ�����]�����Է��ص������� [ context, �����ӽڵ� ]
	�� �� tag ���������ص��� context �б�ǩ��Ϊ tag ����Ԫ����ɵ����� [node1,node2,...]
	*/
	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], ret ) :
		ret;
}

// Support: IE >= 9
// ����ѡ���ѡ���ֵ��ֵ��ȥ����¡ clone �ڵ��ʱ������������
function fixInput( src, dest ) {
	var nodeName = dest.nodeName.toLowerCase();

	// Fails to persist the checked state of a cloned checkbox or radio button.
	/*
	�� manipulation_rcheckableType = /^(?:checkbox|radio)$/i ƥ�䵥ѡ���ѡ��
	�� ǿ�ƽ�Դ�ڵ��ѡ��״̬��ֵ��Ŀ��ڵ�
	*/
	if ( nodeName === "input" && manipulation_rcheckableType.test( src.type ) ) {
		dest.checked = src.checked;

	// Fails to return the selected option to the default selected state when cloning options
	/*
	���Ḵ��ĳЩ��Ԫ�صĶ�̬�������û��� <textarea> ��������ݡ��û���<select>��ѡ���ѡ�
	*/
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}


jQuery.fn.extend({
	wrapAll: function( html ) {
		var wrap;

		if ( jQuery.isFunction( html ) ) {
			return this.each(function( i ) {
				jQuery( this ).wrapAll( html.call(this, i) );
			});
		}

		if ( this[ 0 ] ) {

			// The elements to wrap the target around
			wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {
				wrap.insertBefore( this[ 0 ] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstElementChild ) {
					elem = elem.firstElementChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function( i ) {
				jQuery( this ).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

    /*
    �� $('div').wrap('<strong class="b"></strong>');
    �� $('div').wrap('<strong />');
    �� $('div').wrap('<strong>123</strong>');
    �� $('div').wrap('<strong><em></em></strong>');
    �� $('div').wrap(document.getElementById('wrapper'));
    �� $('div').wrap(function(){});
     */
	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function( i ) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	}
});








var curCSS, iframe,
	// swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
	// see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rmargin = /^margin/,
	rnumsplit = new RegExp( "^(" + core_pnum + ")(.*)$", "i" ),
	rnumnonpx = new RegExp( "^(" + core_pnum + ")(?!px)[a-z%]+$", "i" ),
	rrelNum = new RegExp( "^([+-])=(" + core_pnum + ")", "i" ),
	elemdisplay = { BODY: "block" },

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: 0,
		fontWeight: 400
	},

	cssExpand = [ "Top", "Right", "Bottom", "Left" ],
	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];

// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( style, name ) {

	// shortcut for names that are not vendor prefixed
	if ( name in style ) {
		return name;
	}

	// check for vendor prefixed names
	var capName = name.charAt(0).toUpperCase() + name.slice(1),
		origName = name,
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in style ) {
			return name;
		}
	}

	return origName;
}

function isHidden( elem, el ) {
	// isHidden might be called from jQuery#filter function;
	// in that case, element will be second argument
	elem = el || elem;
	return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
}

// NOTE: we've included the "window" in window.getComputedStyle
// because jsdom on node.js will break without it.
function getStyles( elem ) {
	return window.getComputedStyle( elem, null );
}

function showHide( elements, show ) {
	var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		values[ index ] = data_priv.get( elem, "olddisplay" );
		display = elem.style.display;
		if ( show ) {
			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] = data_priv.access( elem, "olddisplay", css_defaultDisplay(elem.nodeName) );
			}
		} else {

			if ( !values[ index ] ) {
				hidden = isHidden( elem );

				if ( display && display !== "none" || !hidden ) {
					data_priv.set( elem, "olddisplay", hidden ? display : jQuery.css(elem, "display") );
				}
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

jQuery.fn.extend({
	css: function( name, value ) {
		return jQuery.access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each(function() {
			if ( isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		});
	}
});

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"columnCount": true,
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": "cssFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that NaN and null values aren't set. See: #7116
			if ( value == null || type === "number" && isNaN( value ) ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// Fixes #8908, it can be done more correctly by specifying setters in cssHooks,
			// but it would mean to define eight (for every problematic property) identical functions
			if ( !jQuery.support.clearCloneStyle && value === "" && name.indexOf("background") === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {
				style[ name ] = value;
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var val, num, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		//convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Return, converting to number if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || jQuery.isNumeric( num ) ? num || 0 : val;
		}
		return val;
	}
});

curCSS = function( elem, name, _computed ) {
	var width, minWidth, maxWidth,
		computed = _computed || getStyles( elem ),

		// Support: IE9
		// getPropertyValue is only needed for .css('filter') in IE9, see #12537
		ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined,
		style = elem.style;

	if ( computed ) {

		if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
			ret = jQuery.style( elem, name );
		}

		// Support: Safari 5.1
		// A tribute to the "awesome hack by Dean Edwards"
		// Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
		// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
		if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {

			// Remember the original values
			width = style.width;
			minWidth = style.minWidth;
			maxWidth = style.maxWidth;

			// Put in the new values to get a computed value out
			style.minWidth = style.maxWidth = style.width = ret;
			ret = computed.width;

			// Revert the changed values
			style.width = width;
			style.minWidth = minWidth;
			style.maxWidth = maxWidth;
		}
	}

	return ret;
};


function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?
		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?
		// If we already have the right measurement, avoid augmentation
		4 :
		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {
		// both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {
			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// at this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {
			// at this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// at this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {
		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test(val) ) {
			return val;
		}

		// we need the check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox && ( jQuery.support.boxSizingReliable || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

// Try to determine the default display value of an element
function css_defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {
			// Use the already-created iframe if possible
			iframe = ( iframe ||
				jQuery("<iframe frameborder='0' width='0' height='0'/>")
				.css( "cssText", "display:block !important" )
			).appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = ( iframe[0].contentWindow || iframe[0].contentDocument ).document;
			doc.write("<!doctype html><html><body>");
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}

// Called ONLY from within css_defaultDisplay
function actualDisplay( name, doc ) {
	var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),
		display = jQuery.css( elem[0], "display" );
	elem.remove();
	return display;
}

jQuery.each([ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {
				// certain elements can have dimension info if we invisibly show them
				// however, it must have a current display style that would benefit from this
				return elem.offsetWidth === 0 && rdisplayswap.test( jQuery.css( elem, "display" ) ) ?
					jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					}) :
					getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var styles = extra && getStyles( elem );
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				) : 0
			);
		}
	};
});

// These hooks cannot be added until DOM ready because the support test
// for it is not run until after DOM ready
jQuery(function() {
	// Support: Android 2.3
	if ( !jQuery.support.reliableMarginRight ) {
		jQuery.cssHooks.marginRight = {
			get: function( elem, computed ) {
				if ( computed ) {
					// Support: Android 2.3
					// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
					// Work around by temporarily setting element display to inline-block
					return jQuery.swap( elem, { "display": "inline-block" },
						curCSS, [ elem, "marginRight" ] );
				}
			}
		};
	}

	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	// getComputedStyle returns percent when specified for top/left/bottom/right
	// rather than make the css module depend on the offset module, we just check for it here
	if ( !jQuery.support.pixelPosition && jQuery.fn.position ) {
		jQuery.each( [ "top", "left" ], function( i, prop ) {
			jQuery.cssHooks[ prop ] = {
				get: function( elem, computed ) {
					if ( computed ) {
						computed = curCSS( elem, prop );
						// if curCSS returns percentage, fallback to offset
						return rnumnonpx.test( computed ) ?
							jQuery( elem ).position()[ prop ] + "px" :
							computed;
					}
				}
			};
		});
	}

});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		// Support: Opera <= 12.12
		// Opera reports offsetWidths and offsetHeights less than zero on some elements
		return elem.offsetWidth <= 0 && elem.offsetHeight <= 0;
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}

// These hooks are used by animate to expand properties
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
});
var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

jQuery.fn.extend({
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map(function(){
			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		})
		.filter(function(){
			var type = this.type;
			// Use .is(":disabled") so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !manipulation_rcheckableType.test( type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

//Serialize an array of form elements or a set of
//key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {
			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		});

	} else {
		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// Item is non-scalar (array or object), encode its numeric index.
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}
jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
    /*
    �� ����������� 0�����¼�
    $('.button').click(fn);
    -> $('.button').on( 'click', null, data, fn );
    �� �������Ϊ�գ������¼�
    $('.button').click()
    -> $('.button').trigger( 'click' );

    Ҳ����˵��
    $("#btn").trigger("click");
    ���Լ�дΪ��
    $("#btn").click();
    */
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
});

jQuery.fn.extend({
    /*
    �� 2 �������������� 1 ����������������ʱ�򴥷����� 2 ������������Ƴ�ʱ����
    �� ���ֻ�� 1 �������������������Ƴ���ִ���������
    */
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
	}
});
var
	// Document location
	ajaxLocParts,
	ajaxLocation,

	ajax_nonce = jQuery.now(),

	ajax_rquery = /\?/,
	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat("*");

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( core_rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {
			// For each dataType in the dataTypeExpression
			while ( (dataType = dataTypes[i++]) ) {
				// Prepend if requested
				if ( dataType[0] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					(structure[ dataType ] = structure[ dataType ] || []).unshift( func );

				// Otherwise append
				} else {
					(structure[ dataType ] = structure[ dataType ] || []).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if( typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[ dataTypeOrTransport ] ) {
				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		});
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || (deep = {}) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, type, response,
		self = this,
		off = url.indexOf(" ");

	if ( off >= 0 ) {
		selector = url.slice( off );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax({
			url: url,

			// if "type" variable is undefined, then "GET" method will be used
			type: type,
			dataType: "html",
			data: params
		}).done(function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery("<div>").append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		}).complete( callback && function( jqXHR, status ) {
			self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
		});
	}

	return this;
};

// Attach a bunch of functions for handling common AJAX events
jQuery.each( [ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function( i, type ){
	jQuery.fn[ type ] = function( fn ){
		return this.on( type, fn );
	};
});

jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: ajaxLocation,
		type: "GET",
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var transport,
			// URL without anti-cache param
			cacheURL,
			// Response headers
			responseHeadersString,
			responseHeaders,
			// timeout handle
			timeoutTimer,
			// Cross-domain detection vars
			parts,
			// To know if global events are to be dispatched
			fireGlobals,
			// Loop variable
			i,
			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context && ( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks("once memory"),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// The jqXHR state
			state = 0,
			// Default abort message
			strAbort = "canceled",
			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( (match = rheaders.exec( responseHeadersString )) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {
								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {
							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (prefilters might expect it)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || ajaxLocation ) + "" ).replace( rhash, "" )
			.replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( core_rnotwhite ) || [""];

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? "80" : "443" ) ) !==
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? "80" : "443" ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger("ajaxStart");
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL = ( s.url += ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + ajax_nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ajax_nonce++;
			}
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
			// Abort if not done already and return
			return jqXHR.abort();
		}

		// aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout(function() {
					jqXHR.abort("timeout");
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader("Last-Modified");
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader("etag");
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger("ajaxStop");
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		});
	};
});

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var ct, type, finalDataType, firstDataType,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},
		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

		// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {
								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s[ "throws" ] ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}
// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /(?:java|ecma)script/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and crossDomain
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function( s ) {
	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {
		var script, callback;
		return {
			send: function( _, complete ) {
				script = jQuery("<script>").prop({
					async: true,
					charset: s.scriptCharset,
					src: s.url
				}).on(
					"load error",
					callback = function( evt ) {
						script.remove();
						callback = null;
						if ( evt ) {
							complete( evt.type === "error" ? 404 : 200, evt.type );
						}
					}
				);
				document.head.appendChild( script[ 0 ] );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
});
var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( ajax_nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" && !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") && rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( ajax_rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always(function() {
			// Restore preexisting value
			window[ callbackName ] = overwritten;

			// Save back as free
			if ( s[ callbackName ] ) {
				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		});

		// Delegate to script
		return "script";
	}
});
jQuery.ajaxSettings.xhr = function() {
	try {
		return new XMLHttpRequest();
	} catch( e ) {}
};

var xhrSupported = jQuery.ajaxSettings.xhr(),
	xhrSuccessStatus = {
		// file protocol always yields status code 0, assume 200
		0: 200,
		// Support: IE9
		// #1450: sometimes IE returns 1223 when it should be 204
		1223: 204
	},
	// Support: IE9
	// We need to keep track of outbound xhr and abort them manually
	// because IE is not smart enough to do it all by itself
	xhrId = 0,
	xhrCallbacks = {};

if ( window.ActiveXObject ) {
	jQuery( window ).on( "unload", function() {
		for( var key in xhrCallbacks ) {
			xhrCallbacks[ key ]();
		}
		xhrCallbacks = undefined;
	});
}

jQuery.support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
jQuery.support.ajax = xhrSupported = !!xhrSupported;

jQuery.ajaxTransport(function( options ) {
	var callback;
	// Cross domain only allowed if supported through XMLHttpRequest
	if ( jQuery.support.cors || xhrSupported && !options.crossDomain ) {
		return {
			send: function( headers, complete ) {
				var i, id,
					xhr = options.xhr();
				xhr.open( options.type, options.url, options.async, options.username, options.password );
				// Apply custom fields if provided
				if ( options.xhrFields ) {
					for ( i in options.xhrFields ) {
						xhr[ i ] = options.xhrFields[ i ];
					}
				}
				// Override mime type if needed
				if ( options.mimeType && xhr.overrideMimeType ) {
					xhr.overrideMimeType( options.mimeType );
				}
				// X-Requested-With header
				// For cross-domain requests, seeing as conditions for a preflight are
				// akin to a jigsaw puzzle, we simply never set it to be sure.
				// (it can always be set on a per-request basis or even using ajaxSetup)
				// For same-domain requests, won't change header if already provided.
				if ( !options.crossDomain && !headers["X-Requested-With"] ) {
					headers["X-Requested-With"] = "XMLHttpRequest";
				}
				// Set headers
				for ( i in headers ) {
					xhr.setRequestHeader( i, headers[ i ] );
				}
				// Callback
				callback = function( type ) {
					return function() {
						if ( callback ) {
							delete xhrCallbacks[ id ];
							callback = xhr.onload = xhr.onerror = null;
							if ( type === "abort" ) {
								xhr.abort();
							} else if ( type === "error" ) {
								complete(
									// file protocol always yields status 0, assume 404
									xhr.status || 404,
									xhr.statusText
								);
							} else {
								complete(
									xhrSuccessStatus[ xhr.status ] || xhr.status,
									xhr.statusText,
									// Support: IE9
									// #11426: When requesting binary data, IE9 will throw an exception
									// on any attempt to access responseText
									typeof xhr.responseText === "string" ? {
										text: xhr.responseText
									} : undefined,
									xhr.getAllResponseHeaders()
								);
							}
						}
					};
				};
				// Listen to events
				xhr.onload = callback();
				xhr.onerror = callback("error");
				// Create the abort callback
				callback = xhrCallbacks[( id = xhrId++ )] = callback("abort");
				// Do send the request
				// This may raise an exception which is actually
				// handled in jQuery.ajax (so no try/catch here)
				xhr.send( options.hasContent && options.data || null );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
});
var fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = new RegExp( "^(?:([+-])=|)(" + core_pnum + ")([a-z%]*)$", "i" ),
	rrun = /queueHooks$/,
	animationPrefilters = [ defaultPrefilter ],
	tweeners = {
		"*": [function( prop, value ) {
			var tween = this.createTween( prop, value ),
				target = tween.cur(),
				parts = rfxnum.exec( value ),
				unit = parts && parts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

				// Starting value computation is required for potential unit mismatches
				start = ( jQuery.cssNumber[ prop ] || unit !== "px" && +target ) &&
					rfxnum.exec( jQuery.css( tween.elem, prop ) ),
				scale = 1,
				maxIterations = 20;

			if ( start && start[ 3 ] !== unit ) {
				// Trust units reported by jQuery.css
				unit = unit || start[ 3 ];

				// Make sure we update the tween properties later on
				parts = parts || [];

				// Iteratively approximate from a nonzero starting point
				start = +target || 1;

				do {
					// If previous iteration zeroed out, double until we get *something*
					// Use a string for doubling factor so we don't accidentally see scale as unchanged below
					scale = scale || ".5";

					// Adjust and apply
					start = start / scale;
					jQuery.style( tween.elem, prop, start + unit );

				// Update scale, tolerating zero or NaN from tween.cur()
				// And breaking the loop if scale is unchanged or perfect, or if we've just had enough
				} while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
			}

			// Update tween properties
			if ( parts ) {
				start = tween.start = +start || +target || 0;
				tween.unit = unit;
				// If a +=/-= token was provided, we're doing a relative animation
				tween.end = parts[ 1 ] ?
					start + ( parts[ 1 ] + 1 ) * parts[ 2 ] :
					+parts[ 2 ];
			}

			return tween;
		}]
	};

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout(function() {
		fxNow = undefined;
	});
	return ( fxNow = jQuery.now() );
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( (tween = collection[ index ].call( animation, prop, value )) ) {

			// we're done with this property
			return tween;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = animationPrefilters.length,
		deferred = jQuery.Deferred().always( function() {
			// don't match elem in the :animated selector
			delete tick.elem;
		}),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
				// archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ]);

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise({
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, { specialEasing: {} }, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,
					// if we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// resolve when we played the last frame
				// otherwise, reject
				if ( gotoEnd ) {
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		}),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		})
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// not quite $.extend, this wont overwrite keys already present.
			// also - reusing 'index' from above because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

jQuery.Animation = jQuery.extend( Animation, {

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.split(" ");
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			tweeners[ prop ] = tweeners[ prop ] || [];
			tweeners[ prop ].unshift( callback );
		}
	},

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			animationPrefilters.unshift( callback );
		} else {
			animationPrefilters.push( callback );
		}
	}
});

function defaultPrefilter( elem, props, opts ) {
	/* jshint validthis: true */
	var prop, value, toggle, tween, hooks, oldfire,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHidden( elem ),
		dataShow = data_priv.get( elem, "fxshow" );

	// handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always(function() {
			// doing this makes sure that the complete handler will be called
			// before this completes
			anim.always(function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			});
		});
	}

	// height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE9-10 do not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		if ( jQuery.css( elem, "display" ) === "inline" &&
				jQuery.css( elem, "float" ) === "none" ) {

			style.display = "inline-block";
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		anim.always(function() {
			style.overflow = opts.overflow[ 0 ];
			style.overflowX = opts.overflow[ 1 ];
			style.overflowY = opts.overflow[ 2 ];
		});
	}


	// show/hide pass
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// If there is dataShow left over from a stopped hide or show and we are going to proceed with show, we should pretend to be hidden
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	if ( !jQuery.isEmptyObject( orig ) ) {
		if ( dataShow ) {
			if ( "hidden" in dataShow ) {
				hidden = dataShow.hidden;
			}
		} else {
			dataShow = data_priv.access( elem, "fxshow", {} );
		}

		// store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done(function() {
				jQuery( elem ).hide();
			});
		}
		anim.done(function() {
			var prop;

			data_priv.remove( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		});
		for ( prop in orig ) {
			tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}
	}
}

function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || "swing";
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			if ( tween.elem[ tween.prop ] != null &&
				(!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
				return tween.elem[ tween.prop ];
			}

			// passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails
			// so, simple values such as "10px" are parsed to Float.
			// complex values such as "rotate(1rad)" are returned as is.
			result = jQuery.css( tween.elem, tween.prop, "" );
			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {
			// use step hook for back compat - use cssHook if its there - use .style if its
			// available and use plain properties where available
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE9
// Panic based approach to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
});

jQuery.fn.extend({
	fadeTo: function( speed, to, easing, callback ) {

		// show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// animate to the value specified
			.end().animate({ opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {
				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || data_priv.get( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = data_priv.get( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each(function() {
			var index,
				data = data_priv.get( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// enable finishing flag on private data
			data.finish = true;

			// empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// turn off finishing flag
			delete data.finish;
		});
	}
});

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		attrs = { height: type },
		i = 0;

	// if we include width, step value is 1 to do all cssExpand values,
	// if we don't include width, step value is 2 to skip over Left and Right
	includeWidth = includeWidth? 1 : 0;
	for( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show"),
	slideUp: genFx("hide"),
	slideToggle: genFx("toggle"),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p*Math.PI ) / 2;
	}
};

jQuery.timers = [];
jQuery.fx = Tween.prototype.init;
jQuery.fx.tick = function() {
	var timer,
		timers = jQuery.timers,
		i = 0;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];
		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	if ( timer() && jQuery.timers.push( timer ) ) {
		jQuery.fx.start();
	}
};

jQuery.fx.interval = 13;

jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,
	// Default speed
	_default: 400
};

// Back Compat <1.8 extension point
jQuery.fx.step = {};

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}
jQuery.fn.offset = function( options ) {
	if ( arguments.length ) {
		return options === undefined ?
			this :
			this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
	}

	var docElem, win,
		elem = this[ 0 ],
		box = { top: 0, left: 0 },
		doc = elem && elem.ownerDocument;

	if ( !doc ) {
		return;
	}

	docElem = doc.documentElement;

	// Make sure it's not a disconnected DOM node
	if ( !jQuery.contains( docElem, elem ) ) {
		return box;
	}

	// If we don't have gBCR, just use 0,0 rather than error
	// BlackBerry 5, iOS 3 (original iPhone)
	if ( typeof elem.getBoundingClientRect !== core_strundefined ) {
		box = elem.getBoundingClientRect();
	}
	win = getWindow( doc );
	return {
		top: box.top + win.pageYOffset - docElem.clientTop,
		left: box.left + win.pageXOffset - docElem.clientLeft
	};
};

jQuery.offset = {

	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// Set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) && ( curCSSTop + curCSSLeft ).indexOf("auto") > -1;

		// Need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;

		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );

		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			elem = this[ 0 ],
			parentOffset = { top: 0, left: 0 };

		// Fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is it's only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {
			// We assume that getBoundingClientRect is available when computed position is fixed
			offset = elem.getBoundingClientRect();

		} else {
			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset.top += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}

		// Subtract parent offsets and element margins
		return {
			top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || docElem;

			while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) && jQuery.css( offsetParent, "position") === "static" ) ) {
				offsetParent = offsetParent.offsetParent;
			}

			return offsetParent || docElem;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
	var top = "pageYOffset" === prop;

	jQuery.fn[ method ] = function( val ) {
		return jQuery.access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? win[ prop ] : elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : window.pageXOffset,
					top ? val : window.pageYOffset
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ? elem : elem.nodeType === 9 && elem.defaultView;
}
// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
		// margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return jQuery.access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {
					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
					// whichever is greatest
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?
					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	});
});
// Limit scope pollution from any deprecated API
// (function() {

// The number of elements contained in the matched element set
jQuery.fn.size = function() {
	return this.length;
};

jQuery.fn.andSelf = jQuery.fn.addBack;

// })();
if ( typeof module === "object" && module && typeof module.exports === "object" ) {
	// Expose jQuery as module.exports in loaders that implement the Node
	// module pattern (including browserify). Do not create the global, since
	// the user will be storing it themselves locally, and globals are frowned
	// upon in the Node module world.
	module.exports = jQuery;
} else {
	// Register as a named AMD module, since jQuery can be concatenated with other
	// files that may use define, but not via a proper concatenation script that
	// understands anonymous AMD modules. A named AMD is safest and most robust
	// way to register. Lowercase jquery is used because AMD module names are
	// derived from file names, and jQuery is normally delivered in a lowercase
	// file name. Do this after creating the global so that if an AMD module wants
	// to call noConflict to hide this version of jQuery, it will work.
	if ( typeof define === "function" && define.amd ) {
		define( "jquery", [], function () { return jQuery; } );
	}
}

// If there is a window object, that at least has a document property,
// define jQuery and $ identifiers
if ( typeof window === "object" && typeof window.document === "object" ) {
	window.jQuery = window.$ = jQuery;
}

})( window );
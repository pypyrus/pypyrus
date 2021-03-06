// Allow Python-code in markdown cells
// Encapsulate using {{...}}
// - You can also return html or markdown from your Python code
// - You can embed images, however they will be sanitized on reload.

// TODO: Markdown cells will only be reevaluated when a notebook is dirty
//       (i.e. you have made changes). If you save it before reevaluating MD cells,
//       they will show the old value.

define([
    'base/js/namespace',
    'jquery',
    'notebook/js/cell',
    'base/js/security',
    'components/marked/lib/marked',
    'base/js/events',
    'notebook/js/textcell'
], function(IPython, $, cell, security, marked, events,textcell) {
    "use strict";

    /*
     * Find Python expression enclosed in {{ }}, execute and add to text as
     * <span> tags. The actual content gets filled in later by a callback.
     * Already executed expressions are cached in cell metadata.
     *
     * @method execute_python
     * @param cell {Cell} notebook cell
     * @param text {String} text in cell
     */
    var execute_python = function(cell,text) {
        /* never execute code in untrusted notebooks */
        if (IPython.notebook.trusted === false ) {
            return undefined
        }
        /* always clear stored variables if notebook is dirty */
        if (IPython.notebook.dirty === true ) delete cell.metadata.variables;
        // search for code in double curly braces: {{}}
        var found = false;
        var newtext = text.replace(/{{(.*?)}}/g, function(match,tag,cha) {
            found = true;
            if (tag === "") return undefined;
            var code = tag;
            var id = 'python_'+cell.cell_id+'_'+cha; /* create an individual ID */
            var thiscell = cell;
            var thismatch = tag;

            /* there a two possible options:
               a) notebook dirty or variable not stored in metadata: evaluate variable
               b) notebook clean and variable stored in metadata: display stored value
            */
            if (typeof cell.metadata.variables === "undefined") {
                cell.metadata.variables = {}
            }
            var val = cell.metadata.variables[thismatch];
            if (IPython.notebook.dirty === true || val === undefined || jQuery.isEmptyObject(val)) {
                cell.metadata.variables[thismatch] = {};
                cell.callback = function (out_data)
                        {
                        var ul = out_data.content.data;
                        var html;
                        if (ul != undefined) {
                            if ( ul['text/latex'] != undefined) {
                                html = ul['text/latex'];
                            } else if ( ul['image/svg+xml'] != undefined) {
                                var svg =  ul['image/svg+xml'];
                                /* embed SVG in an <img> tag, still get eaten by sanitizer... */
                                svg = btoa(svg); 
                                html = '<img src="data:image/svg+xml;base64,'+ svg + '"/>';
                            } else if ( ul['image/jpeg'] != undefined) {
                                var jpeg =  ul['image/jpeg'];
                                html = '<img src="data:image/jpeg;base64,'+ jpeg + '"/>';
                            } else if ( ul['image/png'] != undefined) {
                                var png =  ul['image/png'];
                                html = '<img src="data:image/png;base64,'+ png + '"/>';
                            } else if ( ul['text/markdown'] != undefined) {
                                html = marked(ul['text/markdown']);
                            } else if ( ul['text/html'] != undefined) {
                                html = ul['text/html'];
                            } else {
                                html = marked(ul['text/plain']);
                                var t = html.match(/<p>(.*?)<\/p>/)[1]; //strip <p> and </p> that marked adds and we don't want
                                html = t ? t : html;
								var q = html.match(/&#39;(.*?)&#39;/); // strip quotes of strings
								if (q !== null) html = q[1]
                            }
                            thiscell.metadata.variables[thismatch] = html;
                            var el = document.getElementById(id);
                            el.innerHTML = el.innerHTML + html; // output result 
                        }
                    };
                var callbacks = { iopub : { output: cell.callback } };
                if (cell.notebook.kernel != null) {
                    cell.notebook.kernel.execute(code, callbacks, {silent: false});
                    return "<span id='"+id+"'></span>"; // add HTML tag with ID where output will be placed
                    }
                return undefined;
            } else {
                /* Notebook not dirty: replace tags with metadata */
                val = cell.metadata.variables[tag];
                return "<span id='"+id+"'>"+val+"</span>"
            }
        });
        if (found == true) return newtext;
        return undefined
    };

    /*
     * Render markdown cell and replace {{...}} with python code
     *
     */
    var render_cell = function(cell) {
        var element = cell.element.find('div.text_cell_render');
        var text = execute_python(cell, element[0].innerHTML);
        if (text !== undefined) {
            element[0].innerHTML = text;
            MathJax.Hub.Queue(["Typeset",MathJax.Hub,element[0]]);
        }
    };

	/* force rendering of markdown cell if notebook is dirty */
	var original_render = textcell.MarkdownCell.prototype.render;
	textcell.MarkdownCell.prototype.render = function() {
		if (IPython.notebook.dirty === true) {
			this.rendered = false
		}
		return original_render.apply(this)
	};

    var load_ipython_extension = function() {
        events.on("rendered.MarkdownCell", function (event, data) {
            render_cell(data.cell)
        });

        /* show values stored in metadata on reload */
        events.on("kernel_ready.Kernel", function () {
            var ncells = IPython.notebook.ncells();
            var cells = IPython.notebook.get_cells();
            for (var i = 0; i < ncells; i++) {
                var cell = cells[i];
                if (cell.metadata.hasOwnProperty('variables')) {
                    render_cell(cell)
                }
            }
        });
    };

    return {
        load_ipython_extension : load_ipython_extension
    };
});

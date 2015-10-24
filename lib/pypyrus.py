import os
import io
import re
from IPython.display import Markdown, display

def printmd(string):
    display(Markdown(string))

def list_files(startpath):
    """
        print markdown formatted list of files
        ignoring empty directories and several ignored pattern
    """
    out = io.StringIO()
    print 
    for root, dirs, files in os.walk(startpath):
        # ignored directories
        dirs[:] = [d for d in dirs if not re.search('^(\..*|__pycache__)$', d)]
        level = root.replace(startpath, '').count(os.sep)
        indent = ' ' * 2 * (level) + '* '
        print('%s%s/\n'%(indent, os.path.basename(root)), file=out)
        subindent = ' ' * 2 * (level + 1) + '* '
        for fn in files:
            # ignored file patterns
            ignored = re.search('^\..*$', fn)
            if not ignored:
                # accepted extensions
                found = re.search('^(.*)\.(ipynb|md|txt|json)$', fn)
                if found:
                    print('%s[%s](%s)\n'%(subindent, found.group(1), os.path.join(root, fn)), file=out)

    return out.getvalue()



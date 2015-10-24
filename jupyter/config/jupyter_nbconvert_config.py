#--- nbextensions configuration ---
from jupyter_core.paths import jupyter_config_dir, jupyter_data_dir
import os
import sys


#data_dir = jupyter_data_dir()
data_dir = os.path.join(os.getcwd(), 'jupyter', 'data')

sys.path.append(os.path.join(data_dir, 'extensions'))

c = get_config()
c.Exporter.template_path = [os.path.join(data_dir, 'templates') ]


#--- nbextensions configuration ---

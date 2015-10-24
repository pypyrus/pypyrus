# pypyrus

## The Programmer's Notebook

Using Jupyter (and Electron - in the future) to make a smart & scriptable notebooks
to replace other 'dumb' notebooks.

## Features

* it is Jupyter for your notebooks, need to say anything more ?
* git auto snapshot
* jupyter extensions:
  * auto hide code cells

## Dependencies & Installation instructions:

### python

* install virtualenv and virtualenvwrapper
* install python 3
* mkvirtualenv --python=python3 pypyrus
* pip install -r config/requirements.txt

### ruby kernel

* use version 2.2.3
* gem install iruby

### git (OPTIONAL)

* create git repository for your notebook
* git clone your_repo notebooks


### node (TBD)

* install nvm from https://github.com/creationix/nvm
* use version v4.2.1  # Long Term Support
  * nvm install v4.2.1
  * nvm alias pypyrus v4.2.1
  * npm install

### forego

* install forego (or foreman) from: https://github.com/ddollar/forego

## start

* NOTEBOOKS_DIR=/path_to_your_notebooks && GIT_SNAPSHOT=1 && ./pypyrus


## TODO
* [ ] Write Documentations, Sample Notebooks
* [ ] Make Desktop App
* [ ] Notebook Sidebar
* [ ] Search & Indexing
  * [ ] Tag support
* [ ] Docker Application
* [ ] Take on the world !


## CREDITS

Standing on the shoulder of the Giants:

* [Jupyter Notebooks](https://jupyter.org/)
* [iPython Notebook Extensions](https://github.com/ipython-contrib/IPython-notebook-extensions)
* [SciRuby Notebook](https://github.com/SciRuby/sciruby-notebooks)
* [Electron](https://github.com/atom/electron)
* Git
* Python
* Ruby



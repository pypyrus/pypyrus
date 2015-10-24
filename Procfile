#
# run this file with forego start / foreman start
#

# the original jupyter notebook
# jupyter: iruby notebook --config=$JUPYTER_CONFIG_DIR/jupyter_notebook_config.py --notebook-dir=$NOTEBOOKS_DIR --no-browser
# use iruby so we can use ruby kernel as well
jupyter: iruby notebook --config=$JUPYTER_CONFIG_DIR/jupyter_notebook_config.py --notebook-dir=$NOTEBOOKS_DIR --no-browser

# run watchdog for folder changes, etc
watchdog: watchmedo shell-command -i '*/.*' -W -R -D --command='lib/git_snapshot.sh $NOTEBOOKS_DIR' $NOTEBOOKS_DIR


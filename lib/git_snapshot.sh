# check the existence of .gitpaused file,
# if exists, no git operation for now
# useful if you want to pause snapshotting all modification
if [ ! -e "$NOTEBOOKS_DIR/.gitpaused" ]
then
  if [[ "$GIT_SNAPSHOT" ]]
  then
    cd $1
    git add -A
    git commit -avm "snapshot at `date +"%Y-%m-%dT%H:%M:%S%z"`"
    if [[ "$GIT_SNAPSHOT_PUSH" ]]
    then
      git push origin
    fi
  fi
fi


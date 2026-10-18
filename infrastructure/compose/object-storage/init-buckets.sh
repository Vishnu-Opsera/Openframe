#!/bin/sh
set -eu
for bucket in file-versions thumbnails import-sources export-artifacts; do
  echo "$bucket" || exit 1
done

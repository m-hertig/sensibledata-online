for X in *.jpg; do convert "$X" -resize 480x480 -strip -interlace Plane -quality 85%  "$X"; done

for img in *png; do
	convert $img -resize 800x-1 web-$img;
done


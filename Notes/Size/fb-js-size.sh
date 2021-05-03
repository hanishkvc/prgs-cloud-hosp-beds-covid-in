#!/bin/bash

wget -c https://www.gstatic.com/firebasejs/8.4.3/firebase-app.js
wget -c https://www.gstatic.com/firebasejs/8.4.3/firebase-auth.js
wget -c https://www.gstatic.com/firebasejs/8.4.3/firebase-firestore.js
wget -c https://www.gstatic.com/firebasejs/8.4.3/firebase-analytics.js
wget -c https://www.gstatic.com/firebasejs/8.4.3/firebase-performance.js
wget -c https://www.gstatic.com/firebasejs/ui/4.8.0/firebase-ui-auth.js
wget -c https://www.gstatic.com/firebasejs/ui/4.8.0/firebase-ui-auth.css
echo "JS library size impact"
ls -l | tr -s ' ' | cut -d ' ' -f 5,9
echo "Total size"
du -h
exit

echo "***NO ME NOT*** JS library size impact"
35755 firebase-analytics.js
21200 firebase-app.js
177065 firebase-auth.js
327501 firebase-firestore.js
38344 firebase-performance.js
42047 firebase-ui-auth.css
250998 firebase-ui-auth.js


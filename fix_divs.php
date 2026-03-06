<?php

$file = 'c:\\wamp64\\www\\smart percare\\smartpetcare\\resources\\js\\Pages\\NewCase\\Index.jsx';
$content = file_get_contents($file);

// Find the position of `{/* Footer Navigation Sticky */}`
$pos = strpos($content, '{/* Footer Navigation Sticky */}');
if ($pos !== false) {
    // Insert `</div></div>` right before the footer navigation sticky
    $content = substr_replace($content, "                    </div>\n                </div>\n", $pos, 0);
    file_put_contents($file, $content);
    echo "Added closing divs.\n";
} else {
    echo "Could not find Footer Navigation Sticky.\n";
}

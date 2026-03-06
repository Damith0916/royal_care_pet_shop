<?php
$file = 'c:\\wamp64\\www\\smart percare\\smartpetcare\\resources\\js\\Pages\\NewCase\\Index.jsx';
$lines = file($file);

// Line 1525 (0-indexed: 1524) is currently an empty newline before {/* Footer */}
// We insert two closing divs there

$insert = "                    </div>\n                </div>\n";

// Insert after line 1524 (0-indexed), which is the blank line between the panel end and footer comment
array_splice($lines, 1524, 0, [$insert]);

file_put_contents($file, implode('', $lines));
echo "Inserted closing divs at line 1525.\n";

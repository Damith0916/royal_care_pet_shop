<?php

$file = 'c:\\wamp64\\www\\smart percare\\smartpetcare\\resources\\js\\Pages\\NewCase\\Index.jsx';
$lines = file($file);

$start = 1279; // 0-indexed line 1280
$end = 2422; // 0-indexed line 2423

// Keep lines before $start and after $end
$newLines = array_merge(
    array_slice($lines, 0, $start),
    array_slice($lines, $end)
);

file_put_contents($file, implode("", $newLines));
echo "Deleted lines " . ($start + 1) . " to " . ($end) . "\n";

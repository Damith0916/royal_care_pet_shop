<?php
$file = 'c:\\wamp64\\www\\smart percare\\smartpetcare\\resources\\js\\Pages\\NewCase\\Index.jsx';
$content = file_get_contents($file);

// Inject new state after pendingQty line
$old = "    const [pendingItem, setPendingItem] = useState(null);\r\n    const [pendingQty, setPendingQty] = useState('1');";
$new = "    const [pendingItem, setPendingItem] = useState(null);\r\n    const [pendingQty, setPendingQty] = useState('1');\r\n    const [ddHighlight, setDdHighlight] = useState(-1);\r\n    const [injSearch, setInjSearch] = useState('');\r\n    const [injHighlight, setInjHighlight] = useState(-1);\r\n    const [rxSearch, setRxSearch] = useState('');\r\n    const [rxHighlight, setRxHighlight] = useState(-1);\r\n    const [rxPendingItem, setRxPendingItem] = useState(null);\r\n    const [rxQty, setRxQty] = useState('');\r\n    const [rxFreq, setRxFreq] = useState('');\r\n    const [rxDuration, setRxDuration] = useState('');\r\n    const [rxStage, setRxStage] = useState('name');\r\n    const [serviceChargeInput, setServiceChargeInput] = useState('1000');\r\n    const [editingListItem, setEditingListItem] = useState(null);\r\n    const [editingListValue, setEditingListValue] = useState('');";

if (strpos($content, $old) !== false) {
    $content = str_replace($old, $new, $content);
    echo "State variables injected.\n";
} else {
    // try unix line endings
    $old2 = "    const [pendingItem, setPendingItem] = useState(null);\n    const [pendingQty, setPendingQty] = useState('1');";
    $new2 = "    const [pendingItem, setPendingItem] = useState(null);\n    const [pendingQty, setPendingQty] = useState('1');\n    const [ddHighlight, setDdHighlight] = useState(-1);\n    const [injSearch, setInjSearch] = useState('');\n    const [injHighlight, setInjHighlight] = useState(-1);\n    const [rxSearch, setRxSearch] = useState('');\n    const [rxHighlight, setRxHighlight] = useState(-1);\n    const [rxPendingItem, setRxPendingItem] = useState(null);\n    const [rxQty, setRxQty] = useState('');\n    const [rxFreq, setRxFreq] = useState('');\n    const [rxDuration, setRxDuration] = useState('');\n    const [rxStage, setRxStage] = useState('name');\n    const [serviceChargeInput, setServiceChargeInput] = useState('1000');\n    const [editingListItem, setEditingListItem] = useState(null);\n    const [editingListValue, setEditingListValue] = useState('');";
    if (strpos($content, $old2) !== false) {
        $content = str_replace($old2, $new2, $content);
        echo "State variables injected (unix).\n";
    } else {
        echo "Could not find pendingQty state line.\n";
    }
}

// Also update steps array
$oldSteps = "    const steps = [\r\n        { id: 'weight', label: 'Weight', icon: Weight },\r\n        { id: 'complane', label: 'Complaint', icon: AlertCircle },\r\n        { id: 'history', label: 'Patient History', icon: History },\r\n        { id: 'signs', label: 'Clinical Signs', icon: Activity },\r\n        { id: 'lab', label: 'LAB Findings', icon: FileText },\r\n        { id: 'dd', label: 'Differential Diagnosis', icon: Dna },\r\n        { id: 'diagnosis', label: 'Diagnosis', icon: ClipboardList },\r\n        { id: 'treatment', label: 'Treatment Plan', icon: ShoppingCart },\r\n    ];";
$newSteps = "    const steps = [\r\n        { id: 'weight',       label: 'Weight',                icon: Weight },\r\n        { id: 'complane',     label: 'Complaints',            icon: AlertCircle },\r\n        { id: 'history',      label: 'Patient History',       icon: History },\r\n        { id: 'signs',        label: 'Clinical Signs',        icon: Activity },\r\n        { id: 'lab',          label: 'Lab Findings',          icon: FileText },\r\n        { id: 'dd',           label: 'Differential Diagnosis',icon: Dna },\r\n        { id: 'diagnosis',    label: 'Final Diagnosis',       icon: ClipboardList },\r\n        { id: 'injection',    label: 'Injections / Clinical', icon: Syringe },\r\n        { id: 'prescription', label: 'Prescription',          icon: Pill },\r\n        { id: 'service',      label: 'Service Charge',        icon: DollarSign },\r\n    ];";

if (strpos($content, $oldSteps) !== false) {
    $content = str_replace($oldSteps, $newSteps, $content);
    echo "Steps updated.\n";
} else {
    echo "Steps not found, may already be updated.\n";
}

file_put_contents($file, $content);
echo "Done.\n";

import sys

filename = 'resources/js/Pages/NewCase/Index.jsx'
with open(filename, 'r', encoding='utf-8') as f:
    content = f.read()

# I will replace everything between "<div className=\"flex flex-col lg:flex-row gap-0 items-start overflow-hidden\">"
# and "{/* Footer Navigation Sticky */}"

start_marker = '<div className="flex flex-col lg:flex-row gap-0 items-start overflow-hidden">'
end_marker = '{/* Footer Navigation Sticky */}'

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx == -1 or end_idx == -1:
    print("Could not find markers")
    sys.exit(1)

# I will provide a new layout block here.
# But first, let's extract it to see exactly how much I am replacing.
print(f"Start index: {start_idx}, End index: {end_idx}")

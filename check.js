const fs = require('fs');
const jsx = fs.readFileSync('./resources/js/Pages/NewCase/Index.jsx', 'utf8');
try {
    require('@babel/core').parseSync(jsx, {
        presets: ['@babel/preset-react'],
        filename: 'Index.jsx'
    });
    console.log('No syntax errors');
} catch (e) {
    console.error(e.message);
}

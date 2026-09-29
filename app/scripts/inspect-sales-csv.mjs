import fs from 'fs';
import readline from 'readline';

const filePath = 'C:\\Users\\phabr\\OneDrive\\Desktop\\Vendas-Realizadas-Por-Caixa (2).csv';
const fileStream = fs.createReadStream(filePath, { encoding: 'latin1' }); // Teknisa / Brazilian CSVs are often latin1 or utf8
const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

let lineCount = 0;
rl.on('line', (line) => {
  if (lineCount < 20) {
    console.log(`[Line ${lineCount + 1}] ${line}`);
  }
  lineCount++;
  if (lineCount >= 20) {
    rl.close();
  }
});

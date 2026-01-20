function drawLogo() {
  const reset = '\x1b[0m';
  const bright = '\x1b[1m';
  const fgGreen = '\x1b[32m';
  const fgCyan = '\x1b[36m';
  const fgYellow = '\x1b[33m';
  const fgMagenta = '\x1b[35m';
  const fgWhite = '\x1b[37m';

  const lines = [
    bright + fgGreen + 'WELCOME TO TO-DUE" + reset',
    fgYellow + 'An application for household management' + reset,
    fgWhite + 'Made during the web applications course at FH Hagenberg 2025/26' + reset,
    fgMagenta + 'Team members: Fabian Kopetzky & Michaela Holzmann' + reset,
  ];

  const stripAnsi = str => str.replace(/\x1b\[[0-9;]*m/g, '');
  const maxLength = Math.max(...lines.map(line => stripAnsi(line).length));

  console.log(fgCyan + '╔' + '═'.repeat(maxLength + 2) + '╗' + reset);

  lines.forEach(line => {
    const padding = maxLength - stripAnsi(line).length;
    console.log(fgCyan + '║ ' + reset + line + ' '.repeat(padding) + fgCyan + ' ║' + reset);
  });

  console.log(fgCyan + '╚' + '═'.repeat(maxLength + 2) + '╝' + reset);

}
module.exports = drawLogo;
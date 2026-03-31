'use strict';
const fs = require('fs');

// Cursor beforeSubmitPrompt hook: require @-mentions for mart/dbt prompts (workshop demo).
let data = '';
try {
  data = fs.readFileSync(0, 'utf8');
} catch {
  process.stdout.write(JSON.stringify({ continue: true }));
  process.exit(0);
}
if (!data || !data.trim()) {
  process.stdout.write(JSON.stringify({ continue: true }));
  process.exit(0);
}
let input;
try {
  input = JSON.parse(data);
} catch {
  process.stdout.write(JSON.stringify({ continue: true }));
  process.exit(0);
}
const p = String(input.prompt || '');
const hasAttachment = Array.isArray(input.attachments) && input.attachments.length > 0;
const needsContext = /fct_|dim_|marts\/|schema\.yml|stg_|dbt\s/i.test(p);
const hasAt = p.includes('@');
if (needsContext && !hasAt && !hasAttachment) {
  process.stdout.write(
    JSON.stringify({
      continue: false,
        user_message:
        'Hook do workshop: use @ em pelo menos um arquivo (ex.: @seeds/raw_orders.csv ou @models/marts/schema.yml) antes de pedir alterações em mart ou dbt.',
    })
  );
} else {
  process.stdout.write(JSON.stringify({ continue: true }));
}

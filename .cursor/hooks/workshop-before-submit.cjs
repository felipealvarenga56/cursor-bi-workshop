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
        'Workshop hook: @-mention at least one file (e.g. @seeds/raw_orders.csv or @models/marts/schema.yml) before asking for mart or dbt changes.',
    })
  );
} else {
  process.stdout.write(JSON.stringify({ continue: true }));
}

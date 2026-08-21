#!/usr/bin/env node
/**
 * check-domain.js — Check whether a domain is registered (taken) or available.
 * Uses RDAP (structured, reliable, no API key needed).
 * Routes .com/.net to Verisign RDAP directly to avoid bootstrap 403s.
 *
 * Usage:
 *   node check-domain.js example.com
 *   node check-domain.js example.com test.io myapp.dev
 *   node check-domain.js example.com -t 8000
 *   node check-domain.js example.com --verbose
 */

const https = require('https');

// Direct RDAP endpoints per TLD to avoid rdap.org bootstrap 403s
const RDAP_ENDPOINTS = {
  com: 'https://rdap.verisign.com/com/v1/domain/',
  net: 'https://rdap.verisign.com/net/v1/domain/',
  org: 'https://rdap.org/domain/',
  io:  'https://rdap.org/domain/',
  dev: 'https://rdap.org/domain/',
  app: 'https://rdap.org/domain/',
  co:  'https://rdap.org/domain/',
};

function getRdapUrl(domain) {
  const tld = domain.split('.').pop().toLowerCase();
  const base = RDAP_ENDPOINTS[tld] || 'https://rdap.org/domain/';
  return `${base}${domain}`;
}

function checkDomain(domain, timeoutMs = 5000) {
  return new Promise((resolve, reject) => {
    const url = getRdapUrl(domain);
    const req = https.get(url, { headers: { 'Accept': 'application/rdap+json' } }, (res) => {
      // Follow redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const redirectReq = https.get(res.headers.location, { headers: { 'Accept': 'application/rdap+json' } }, (res2) => {
          handleResponse(res2, domain, resolve, reject);
        });
        redirectReq.on('error', reject);
        redirectReq.setTimeout(timeoutMs, () => {
          redirectReq.destroy();
          reject(new Error('Request timed out (redirect)'));
        });
        return;
      }
      handleResponse(res, domain, resolve, reject);
    });

    req.on('error', reject);
    req.setTimeout(timeoutMs, () => {
      req.destroy();
      reject(new Error('Request timed out'));
    });
  });
}

function handleResponse(res, domain, resolve, reject) {
  if (res.statusCode === 404) {
    return resolve({ domain, available: true });
  }
  if (res.statusCode !== 200) {
    return reject(new Error(`Unexpected status: ${res.statusCode}`));
  }

  let data = '';
  res.on('data', chunk => (data += chunk));
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      resolve({ domain, available: false, info: json });
    } catch (e) {
      reject(e);
    }
  });
}

function parseArgs(argv) {
  const args = { domains: [], timeout: 5000, verbose: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    switch (arg) {
      case '-t':
      case '--timeout':
        args.timeout = parseInt(argv[++i], 10);
        break;
      case '-v':
      case '--verbose':
        args.verbose = true;
        break;
      case '-h':
      case '--help':
        args.help = true;
        break;
      default:
        args.domains.push(arg);
    }
  }
  return args;
}

function printHelp() {
  console.log(`
Usage: node check-domain.js <domain> [domain2 domain3 ...] [options]

Options:
  -t, --timeout <ms>   Request timeout in milliseconds (default: 5000)
  -v, --verbose         Print full RDAP response info for taken domains
  -h, --help            Show this help message

Examples:
  node check-domain.js example.com
  node check-domain.js example.com test.io -t 8000
  node check-domain.js example.com --verbose
`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help || args.domains.length === 0) {
    printHelp();
    process.exit(args.help ? 0 : 1);
  }

  for (const domain of args.domains) {
    try {
      const result = await checkDomain(domain, args.timeout);
      const status = result.available ? 'AVAILABLE ✓' : 'TAKEN ✗';
      console.log(`${domain}: ${status}`);
      if (args.verbose && !result.available) {
        console.log(JSON.stringify(result.info, null, 2));
      }
    } catch (err) {
      console.log(`${domain}: ERROR - ${err.message}`);
    }
  }
}

main();

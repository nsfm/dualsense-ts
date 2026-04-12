# Security Policy

## Supported Versions

Only the latest published version of `dualsense-ts` receives security updates.

## Reporting a Vulnerability

If you discover a security vulnerability, please report it privately via [GitHub Security Advisories](https://github.com/nsfm/dualsense-ts/security/advisories/new).

Do not open a public issue for security vulnerabilities.

## Dependencies

`dualsense-ts` is committed to remaining a zero-dependency package, minimizing risk surface area. The peer dependency on `node-hid` is the only exception - please review their security standards before implementing `dualsense-ts` in node.js.

## Scope

`dualsense-ts` communicates with HID devices via WebHID (browser) and `node-hid` (Node.js). It does not make network requests, store credentials, or process untrusted input beyond raw HID reports from physically connected controllers.

Security concerns most likely to be relevant:

- Malformed HID report parsing leading to unexpected behavior
- Dependency vulnerabilities in `node-hid` or dev tooling

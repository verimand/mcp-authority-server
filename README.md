# Verimand MCP Authority Server

[![M8ven Verified Publisher](https://m8ven.ai/badge/mcp/verimand/mcp-authority-server?variant=verified)](https://m8ven.ai/mcp/verimand/mcp-authority-server)

MCP exposes capability. VAGP governs authority.

The Verimand MCP Authority Server gives MCP-compatible clients agent-native access to verifiable VAGP authority. It exposes a small stdio tool surface for asking whether a trusted registered agent currently has authority, inspecting trusted authority state, and verifying VAGP execution permits.

Tool availability does not itself grant authority. This server is not yet the enforcement gateway for protected tool execution.

## Package identity

- npm package: `@verimand/mcp-authority-server`
- MCP Registry server name: `dev.verimand/mcp-authority-server`
- Current version: `0.1.0`
- Runtime: Node.js 22 or newer
- MCP SDK/runtime: `@modelcontextprotocol/server` 2.0.0, implementing the MCP 2026-07-28 spec with stdio legacy compatibility

## Tools

- `verimand.resolve` resolves whether a trusted registered agent is authorized for an action and returns a VAGP execution permit only when authority is confirmed.
- `verimand.explain` explains deterministic authority decision or permit-derived data. It is informational only.
- `verimand.get_authority` returns bounded authority relevant to an agent/action.
- `verimand.get_mandate` retrieves server-side trusted mandate metadata.
- `verimand.get_agent_dna` returns server-side trusted Agent DNA state and fingerprint information.
- `verimand.verify_permit` verifies a VAGP execution permit against current authority evidence.

## Install and start

A local MCP client can start the published server with:

```sh
npx -y @verimand/mcp-authority-server@0.1.0
```

When running from this public repository:

```sh
npm ci
node dist/stdio.js
```

The process speaks MCP over stdio. stdout is reserved for MCP protocol messages; diagnostics go to stderr.

## MCP client configuration example

```json
{
  "mcpServers": {
    "verimand-authority": {
      "command": "npx",
      "args": ["-y", "@verimand/mcp-authority-server@0.1.0"]
    }
  }
}
```

Do not place secrets, mandates, Agent DNA, revocation state or trusted context in agent-controlled MCP tool arguments. Production Verimand connection material must be supplied by the operator-controlled server environment, not by the agent using the MCP client.

## First resolve example

```json
{
  "name": "verimand.resolve",
  "arguments": {
    "agentId": "agent:demo-support",
    "action": "ticket.read",
    "resourceId": "ticket:123",
    "requestId": "req-demo-1"
  }
}
```

Expected structured content contains a deterministic authority `decision`, reason codes, selected mandate/path data and a permit only when VAGP resolves `AUTHORITY_CONFIRMED`.

## Security and trust boundary

All MCP input is untrusted. The server accepts only small closed tool arguments and maps them to server-side trusted VAGP state. An MCP caller cannot self-declare trusted identity, Agent DNA, mandates, attestations, revocation state or trusted context.

The MCP server delegates authority semantics to VAGP 0.3 authority services. It does not execute protected business actions and does not replace an enforcement gateway. Protected tool execution remains outside this package.

## VAGP relationship

VAGP 0.3 is the public authority protocol: <https://github.com/verimand/vagp>. This MCP server is a Verimand interface for authority inspection and permit verification over MCP.

## Distribution status

Version 0.1.0 is publicly available on npm and in the MCP Registry. The Verimand VAGP authority runtime required by this MCP server is bundled into `dist/stdio.js`; the installed package has no runtime dependency on unpublished `@verimand/*` workspace packages. The initial npm release was bootstrap-published without provenance. Future releases are configured for GitHub OIDC trusted staged publishing; this does not retroactively add provenance to 0.1.0.

## Development validation

From a clean clone, with Node.js 22 or newer:

```sh
npm ci
npm run build
npm test
npm run smoke:stdio
```

The public repository contains the audited bundled distribution, not the private TypeScript build source. Here `npm run build` checks the committed bundle's syntax and presence; it does not rebuild the bundle from source. The `node:test` suite starts the bundle over stdio, exercises all six public tools, checks a bounded permit and fail-closed cases, and verifies restart. The npm tarball remains restricted to the six published distribution files.

## Support and security reporting

Report security issues to <verimand.dev@gmail.com>.

import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import test from 'node:test';

import { Client } from '@modelcontextprotocol/client';
import { StdioClientTransport } from '@modelcontextprotocol/client/stdio';

const bundle = resolve('dist/stdio.js');
const expectedTools = [
  'verimand.explain',
  'verimand.get_agent_dna',
  'verimand.get_authority',
  'verimand.get_mandate',
  'verimand.resolve',
  'verimand.verify_permit',
];

async function withClient(run) {
  const client = new Client({ name: 'public-mcp-verification', version: '0.1.0' });
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [bundle],
    stderr: 'pipe',
  });
  await client.connect(transport);
  try {
    return await run(client);
  } finally {
    await client.close();
  }
}

async function call(client, name, args) {
  const result = await client.callTool(
    { name, arguments: args },
    { timeout: 10_000 },
  );
  assert.equal(result.isError, undefined, `${name} returned an MCP tool error`);
  assert.ok(result.structuredContent, `${name} has no structured content`);
  return result.structuredContent;
}

test('stdio initializes and declares exactly the six public tools', async () => {
  await withClient(async (client) => {
    const listed = await client.listTools(undefined, { timeout: 10_000 });
    assert.deepEqual(listed.tools.map((tool) => tool.name).sort(), expectedTools);
    for (const tool of listed.tools) {
      assert.ok(tool.description);
      assert.equal(tool.inputSchema.additionalProperties, false);
    }
  });
});

test('each public tool responds through MCP and authority remains bounded', async () => {
  await withClient(async (client) => {
    const permitted = await call(client, 'verimand.resolve', {
      agentId: 'agent:demo-support',
      action: 'ticket.read',
      resourceId: 'ticket:123',
      requestId: 'req-public-verification',
    });
    assert.equal(permitted.decision.decision, 'PERMIT');
    assert.equal(permitted.permit?.action, 'ticket.read');

    const explanation = await call(client, 'verimand.explain', {
      decision: permitted.decision,
    });
    assert.equal(explanation.source, 'DETERMINISTIC_VAGP_DECISION_DATA');
    assert.match(explanation.explanation, /^PERMIT:/);

    const authority = await call(client, 'verimand.get_authority', {
      agentId: 'agent:demo-support',
    });
    assert.equal(authority.agentId, 'agent:demo-support');
    assert.equal(authority.decision.decision, 'PERMIT');
    assert.ok(authority.boundedAuthority.length > 0);

    const mandate = await call(client, 'verimand.get_mandate', {
      agentId: 'agent:demo-support',
    });
    assert.ok(mandate.mandates.some((item) => item.id === permitted.mandateRef));

    const dna = await call(client, 'verimand.get_agent_dna', {
      agentId: 'agent:demo-support',
    });
    assert.equal(dna.found, true);
    assert.equal(dna.agentId, 'agent:demo-support');
    assert.equal(typeof dna.fingerprint?.value, 'string');

    const verification = await call(client, 'verimand.verify_permit', {
      permit: permitted.permit,
      idempotencyKey: 'verify-public-verification',
    });
    assert.equal(verification.valid, false);
    assert.ok(verification.reasonCodes.includes('VAGP_VERIFY_GRANT_NOT_AUTHENTIC'));

    const denied = await call(client, 'verimand.resolve', {
      agentId: 'agent:unknown',
      action: 'ticket.read',
      resourceId: 'ticket:123',
    });
    assert.notEqual(denied.decision.decision, 'PERMIT');
    assert.ok(denied.decision.reasonCodes.includes('VAGP_RESOLVE_AGENT_NOT_FOUND'));
    assert.equal(denied.permit, null);
  });
});

test('agent-supplied authority fields are rejected and stdio restarts', async () => {
  await withClient(async (client) => {
    const malformed = await client.callTool({
      name: 'verimand.resolve',
      arguments: {
        agentId: 'agent:demo-support',
        action: 'ticket.read',
        resourceId: 'ticket:123',
        agentDna: { fingerprint: 'agent-supplied' },
      },
    });
    assert.equal(malformed.isError, true);
  });

  await withClient(async (client) => {
    const listed = await client.listTools(undefined, { timeout: 10_000 });
    assert.equal(listed.tools.length, 6);
  });
});

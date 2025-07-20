import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionType, NodeOperationError } from 'n8n-workflow';
import { query, type SDKMessage } from '@anthropic-ai/claude-code';

export class ClaudeCode implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Claude Code',
		name: 'claudeCode',
		icon: 'file:claudecode.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["prompt"]}}',
		description:
			'Use Claude Code SDK to execute AI-powered coding tasks with tool support and MCP integration',
		defaults: {
			name: 'Claude Code',
		},
		inputs: [{ type: NodeConnectionType.Main }],
		outputs: [{ type: NodeConnectionType.Main }],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Query',
						value: 'query',
						description: 'Start a new conversation with Claude Code',
						action: 'Start a new conversation with claude code',
					},
					{
						name: 'Continue',
						value: 'continue',
						description: 'Continue a previous conversation (requires prior query)',
						action: 'Continue a previous conversation requires prior query',
					},
				],
				default: 'query',
			},
			{
				displayName: 'Prompt',
				name: 'prompt',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				description: 'The prompt or instruction to send to Claude Code',
				required: true,
				placeholder: 'e.g., "Create a Python function to parse CSV files"',
				hint: 'Use expressions like {{$json.prompt}} to use data from previous nodes',
			},
			{
				displayName: 'Model',
				name: 'model',
				type: 'options',
				options: [
					{
						name: 'Sonnet',
						value: 'sonnet',
						description: 'Fast and efficient model for most tasks',
					},
					{
						name: 'Opus',
						value: 'opus',
						description: 'Most capable model for complex tasks',
					},
				],
				default: 'sonnet',
				description: 'Claude model to use',
			},
			{
				displayName: 'Max Turns',
				name: 'maxTurns',
				type: 'number',
				default: 10,
				description: 'Maximum number of conversation turns (back-and-forth exchanges) allowed',
			},
			{
				displayName: 'Timeout',
				name: 'timeout',
				type: 'number',
				default: 300,
				description: 'Maximum time to wait for completion (in seconds) before aborting',
			},
			{
				displayName: 'Output Format',
				name: 'outputFormat',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Structured',
						value: 'structured',
						description: 'Returns a structured object with messages, summary, result, and metrics',
					},
					{
						name: 'Messages',
						value: 'messages',
						description: 'Returns the raw array of all messages exchanged',
					},
					{
						name: 'Text',
						value: 'text',
						description: 'Returns only the final result text',
					},
				],
				default: 'structured',
				description: 'Choose how to format the output data',
			},
			{
				displayName: 'Allowed Tools',
				name: 'allowedTools',
				type: 'multiOptions',
				options: [
					// Built-in Claude Code tools
					{ name: 'Bash', value: 'Bash', description: 'Execute bash commands' },
					{ name: 'Edit', value: 'Edit', description: 'Edit files' },
					{ name: 'Exit Plan Mode', value: 'exit_plan_mode', description: 'Exit planning mode' },
					{ name: 'Glob', value: 'Glob', description: 'Find files by pattern' },
					{ name: 'Grep', value: 'Grep', description: 'Search file contents' },
					{ name: 'LS', value: 'LS', description: 'List directory contents' },
					{ name: 'MultiEdit', value: 'MultiEdit', description: 'Make multiple edits' },
					{ name: 'Notebook Edit', value: 'NotebookEdit', description: 'Edit Jupyter notebooks' },
					{ name: 'Notebook Read', value: 'NotebookRead', description: 'Read Jupyter notebooks' },
					{ name: 'Read', value: 'Read', description: 'Read file contents' },
					{ name: 'Task', value: 'Task', description: 'Launch agents for complex searches' },
					{ name: 'Todo Write', value: 'TodoWrite', description: 'Manage todo lists' },
					{ name: 'Web Fetch', value: 'WebFetch', description: 'Fetch web content' },
					{ name: 'Web Search', value: 'WebSearch', description: 'Search the web' },
					{ name: 'Write', value: 'Write', description: 'Write files' },
				],
				default: ['WebFetch', 'TodoWrite', 'WebSearch', 'exit_plan_mode', 'Task'],
				description: 'Select which built-in tools Claude Code is allowed to use during execution',
			},
			{
				displayName: 'MCP Servers',
				name: 'mcpServers',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				default: {},
				placeholder: 'Add MCP Server',
				options: [
					{
						name: 'server',
						displayName: 'MCP Server',
						// eslint-disable-next-line n8n-nodes-base/node-param-fixed-collection-type-unsorted-items
						values: [
							{
								displayName: 'Server Name',
								name: 'name',
								type: 'string',
								default: '',
								description: 'Unique identifier for this MCP server',
								required: true,
								placeholder: 'e.g., filesystem, github, slack',
							},
							{
								displayName: 'Command',
								name: 'command',
								type: 'string',
								default: 'npx',
								description: 'Command to run the MCP server',
								required: true,
							},
							{
								displayName: 'Arguments',
								name: 'args',
								type: 'string',
								default: '',
								description: 'Arguments for the command (space or comma-separated)',
								placeholder: '-y @modelcontextprotocol/server-slack or -y,@modelcontextprotocol/server-filesystem,/path',
							},
							{
								displayName: 'Environment Variables',
								name: 'env',
								type: 'string',
								typeOptions: {
									rows: 4,
								},
								default: '',
								description: 'Environment variables (KEY=value format, one per line)',
								placeholder: 'GITHUB_TOKEN=${GITHUB_TOKEN}\nAPI_KEY=your-key',
								hint: 'Use ${VAR_NAME} to reference environment variables from your system',
							},
							{
								displayName: 'Allowed MCP Tools',
								name: 'allowedMcpTools',
								type: 'string',
								default: '*',
								description: 'Comma-separated list of allowed tools from this server (* for all)',
								placeholder: 'read_file,write_file or * for all',
							},
						],
					},
				],
			},
			{
				displayName: 'Additional Options',
				name: 'additionalOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				options: [
					{
						displayName: 'System Prompt',
						name: 'systemPrompt',
						type: 'string',
						typeOptions: {
							rows: 4,
						},
						default: '',
						description: 'Additional context or instructions for Claude Code',
						placeholder:
							'You are helping with a Python project. Focus on clean, readable code with proper error handling.',
					},
					{
						displayName: 'Require Permissions',
						name: 'requirePermissions',
						type: 'boolean',
						default: false,
						description: 'Whether to require permission for tool use',
					},
					{
						displayName: 'Debug Mode',
						name: 'debug',
						type: 'boolean',
						default: false,
						description: 'Whether to enable debug logging',
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			let timeout = 300; // Default timeout
			try {
				const operation = this.getNodeParameter('operation', itemIndex) as string;
				const prompt = this.getNodeParameter('prompt', itemIndex) as string;
				const model = this.getNodeParameter('model', itemIndex) as string;
				const maxTurns = this.getNodeParameter('maxTurns', itemIndex) as number;
				timeout = this.getNodeParameter('timeout', itemIndex) as number;
				const outputFormat = this.getNodeParameter('outputFormat', itemIndex) as string;
				const allowedTools = this.getNodeParameter('allowedTools', itemIndex, []) as string[];
				const mcpServers = this.getNodeParameter('mcpServers', itemIndex, {}) as {
					server?: Array<{
						name: string;
						command: string;
						args?: string;
						env?: string;
						allowedMcpTools?: string;
					}>;
				};
				const additionalOptions = this.getNodeParameter('additionalOptions', itemIndex) as {
					systemPrompt?: string;
					requirePermissions?: boolean;
					debug?: boolean;
				};

				// Create abort controller for timeout
				const abortController = new AbortController();
				const timeoutMs = timeout * 1000;
				const timeoutId = setTimeout(() => abortController.abort(), timeoutMs);

				// Validate required parameters
				if (!prompt || prompt.trim() === '') {
					throw new NodeOperationError(this.getNode(), 'Prompt is required and cannot be empty', {
						itemIndex,
					});
				}

				// Log start
				if (additionalOptions.debug) {
					console.log(`[ClaudeCode] Starting execution for item ${itemIndex}`);
					console.log(`[ClaudeCode] Prompt: ${prompt.substring(0, 100)}...`);
					console.log(`[ClaudeCode] Model: ${model}`);
					console.log(`[ClaudeCode] Max turns: ${maxTurns}`);
					console.log(`[ClaudeCode] Timeout: ${timeout}s`);
					console.log(`[ClaudeCode] Allowed built-in tools: ${allowedTools.join(', ')}`);
				}

				// Build query options
				interface QueryOptions {
					prompt: string;
					abortController: AbortController;
					options: {
						maxTurns: number;
						permissionMode: 'default' | 'bypassPermissions';
						model: string;
						systemPrompt?: string;
						mcpServers?: Record<string, any>;
						allowedTools?: string[];
						continue?: boolean;
					};
				}

				const queryOptions: QueryOptions = {
					prompt,
					abortController,
					options: {
						maxTurns,
						permissionMode: additionalOptions.requirePermissions ? 'default' : 'bypassPermissions',
						model,
					},
				};

				// Add optional parameters
				if (additionalOptions.systemPrompt) {
					queryOptions.options.systemPrompt = additionalOptions.systemPrompt;
				}

				// Process allowed tools - start with built-in tools
				const finalAllowedTools = [...allowedTools];

				// Process MCP servers
				if (mcpServers.server && mcpServers.server.length > 0) {
					const mcpConfig: Record<
						string,
						{
							command: string;
							args: string[];
							env?: Record<string, string>;
						}
					> = {};

					for (const serverConfig of mcpServers.server) {
						if (!serverConfig.name || !serverConfig.command) {
							if (additionalOptions.debug) {
								console.log(
									`[ClaudeCode] Skipping MCP server with missing name or command:`,
									serverConfig,
								);
							}
							continue;
						}

						// Build server configuration
						const server: {
							command: string;
							args: string[];
							env?: Record<string, string>;
						} = {
							command: serverConfig.command,
							args: [],
						};

						// Parse arguments - handle both space and comma separation
						if (serverConfig.args) {
							const argString = serverConfig.args.trim();

							// If contains comma, split by comma
							if (argString.includes(',')) {
								server.args = argString
									.split(',')
									.map((arg: string) => arg.trim())
									.filter((arg: string) => arg.length > 0);
							} else {
								// Otherwise split by spaces, but respect quoted strings
								const args: string[] = [];
								let current = '';
								let inQuotes = false;
								let quoteChar = '';

								for (let i = 0; i < argString.length; i++) {
									const char = argString[i];

									if ((char === '"' || char === "'") && !inQuotes) {
										inQuotes = true;
										quoteChar = char;
									} else if (char === quoteChar && inQuotes) {
										inQuotes = false;
										quoteChar = '';
									} else if (char === ' ' && !inQuotes) {
										if (current.trim()) {
											args.push(current.trim());
											current = '';
										}
									} else {
										current += char;
									}
								}

								// Add last argument
								if (current.trim()) {
									args.push(current.trim());
								}

								server.args = args;
							}
						}

						if (additionalOptions.debug) {
							console.log(`[ClaudeCode] Configuring MCP server "${serverConfig.name}":`, {
								command: server.command,
								args: server.args,
								hasEnv: !!serverConfig.env,
							});
						}

						// Add environment variables if specified
						if (serverConfig.env) {
							const envVars: Record<string, string> = {};
							const envLines = serverConfig.env
								.split('\n')
								.filter((line: string) => line.trim().length > 0);

							for (const line of envLines) {
								const equalIndex = line.indexOf('=');
								if (equalIndex > 0) {
									const key = line.substring(0, equalIndex).trim();
									let value = line.substring(equalIndex + 1).trim();

									// Replace environment variable tokens like ${GITHUB_TOKEN} with actual values
									value = value.replace(/\$\{([^}]+)\}/g, (match: string, envVar: string) => {
										const replacement = process.env[envVar];
										if (additionalOptions.debug && !replacement) {
											console.log(`[ClaudeCode] Warning: Environment variable ${envVar} not found`);
										}
										return replacement || match;
									});

									// Also support $VARNAME format
									value = value.replace(
										/\$([A-Z_][A-Z0-9_]*)/g,
										(match: string, envVar: string) => {
											const replacement = process.env[envVar];
											if (additionalOptions.debug && !replacement) {
												console.log(
													`[ClaudeCode] Warning: Environment variable ${envVar} not found`,
												);
											}
											return replacement || match;
										},
									);

									envVars[key] = value;

									if (additionalOptions.debug) {
										console.log(
											`[ClaudeCode] MCP server "${serverConfig.name}" env: ${key}=${value.substring(0, 10)}...`,
										);
									}
								}
							}

							if (Object.keys(envVars).length > 0) {
								server.env = envVars;
							}
						}

						mcpConfig[serverConfig.name] = server;

						// Add allowed MCP tools
						if (serverConfig.allowedMcpTools === '*') {
							// Allow all tools from this server
							finalAllowedTools.push(`mcp__${serverConfig.name}`);
						} else if (serverConfig.allowedMcpTools) {
							// Add specific tools
							const tools = serverConfig.allowedMcpTools.split(',').map((t: string) => t.trim());
							for (const tool of tools) {
								if (tool) {
									finalAllowedTools.push(`mcp__${serverConfig.name}__${tool}`);
								}
							}
						}
					}

					// Set MCP servers in options
					if (Object.keys(mcpConfig).length > 0) {
						queryOptions.options.mcpServers = mcpConfig;
						if (additionalOptions.debug) {
							console.log(
								`[ClaudeCode] MCP servers configured:`,
								JSON.stringify(mcpConfig, null, 2),
							);
						}
					}
				}

				// Set allowed tools if any are specified
				if (finalAllowedTools.length > 0) {
					queryOptions.options.allowedTools = finalAllowedTools;
					if (additionalOptions.debug) {
						console.log(`[ClaudeCode] Final allowed tools: ${finalAllowedTools.join(', ')}`);
					}
				}

				// Add continue flag if needed
				if (operation === 'continue') {
					queryOptions.options.continue = true;
				}

				// Execute query
				const messages: SDKMessage[] = [];
				const startTime = Date.now();

				try {
					for await (const message of query(queryOptions)) {
						messages.push(message);

						if (additionalOptions.debug) {
							console.log(`[ClaudeCode] Received message type: ${message.type}`);

							// Log MCP server initialization
							if (message.type === 'system' && message.subtype === 'init' && message.mcp_servers) {
								console.log(`[ClaudeCode] MCP servers initialized:`, message.mcp_servers);
							}
						}

						// Track progress
						if (message.type === 'assistant' && message.message?.content) {
							const content = message.message.content[0];
							if (additionalOptions.debug && content.type === 'text') {
								console.log(`[ClaudeCode] Assistant: ${content.text.substring(0, 100)}...`);
							} else if (additionalOptions.debug && content.type === 'tool_use') {
								console.log(`[ClaudeCode] Tool use: ${content.name}`);
							}
						}
					}

					clearTimeout(timeoutId);

					const duration = Date.now() - startTime;
					if (additionalOptions.debug) {
						console.log(
							`[ClaudeCode] Execution completed in ${duration}ms with ${messages.length} messages`,
						);
					}

					// Format output based on selected format
					if (outputFormat === 'text') {
						// Find the result message
						const resultMessage = messages.find((m) => m.type === 'result') as any;
						returnData.push({
							json: {
								result: resultMessage?.result || resultMessage?.error || '',
								success: resultMessage?.subtype === 'success',
								duration_ms: resultMessage?.duration_ms,
								total_cost_usd: resultMessage?.total_cost_usd,
							},
							pairedItem: itemIndex,
						});
					} else if (outputFormat === 'messages') {
						// Return raw messages
						returnData.push({
							json: {
								messages,
								messageCount: messages.length,
							},
							pairedItem: itemIndex,
						});
					} else if (outputFormat === 'structured') {
						// Parse into structured format
						const userMessages = messages.filter((m) => m.type === 'user');
						const assistantMessages = messages.filter((m) => m.type === 'assistant');
						const toolUses = messages.filter(
							(m) =>
								m.type === 'assistant' && (m as any).message?.content?.[0]?.type === 'tool_use',
						);
						const systemInit = messages.find(
							(m) => m.type === 'system' && (m as any).subtype === 'init',
						) as any;
						const resultMessage = messages.find((m) => m.type === 'result') as any;

						returnData.push({
							json: {
								messages,
								summary: {
									userMessageCount: userMessages.length,
									assistantMessageCount: assistantMessages.length,
									toolUseCount: toolUses.length,
									hasResult: !!resultMessage,
									mcpServersLoaded: systemInit?.mcp_servers || [],
									toolsAvailable: systemInit?.tools || [],
								},
								result: resultMessage?.result || resultMessage?.error || null,
								metrics: resultMessage
									? {
											duration_ms: resultMessage.duration_ms,
											num_turns: resultMessage.num_turns,
											total_cost_usd: resultMessage.total_cost_usd,
											usage: resultMessage.usage,
										}
									: null,
								success: resultMessage?.subtype === 'success',
							},
							pairedItem: itemIndex,
						});
					}
				} catch (queryError) {
					clearTimeout(timeoutId);
					throw queryError;
				}
			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
				const isTimeout = error instanceof Error && error.name === 'AbortError';

				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: errorMessage,
							errorType: isTimeout ? 'timeout' : 'execution_error',
							errorDetails: error instanceof Error ? error.stack : undefined,
							itemIndex,
						},
						pairedItem: itemIndex,
					});
					continue;
				}

				// Provide more specific error messages
				const userFriendlyMessage = isTimeout
					? `Operation timed out after ${timeout} seconds. Consider increasing the timeout in Additional Options.`
					: `Claude Code execution failed: ${errorMessage}`;

				throw new NodeOperationError(this.getNode(), userFriendlyMessage, {
					itemIndex,
					description: errorMessage,
				});
			}
		}

		return [returnData];
	}
}

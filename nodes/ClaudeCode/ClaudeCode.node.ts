import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionType, NodeOperationError } from 'n8n-workflow';

// Type definitions for the SDK (loaded dynamically)
type SDKMessage = any;

export class ClaudeCode implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Claude Code',
		name: 'claudeCode',
		icon: 'file:claudecode.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["prompt"]}}',
		description:
			'Use Claude Code SDK to execute AI-powered coding tasks with customizable tool support',
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
				default: 25,
				description:
					'Maximum number of conversation turns (back-and-forth exchanges) allowed. Complex tasks may require more turns.',
			},
			{
				displayName: 'Timeout',
				name: 'timeout',
				type: 'number',
				default: 300,
				description: 'Maximum time to wait for completion (in seconds) before aborting',
			},
			{
				displayName: 'Project Path',
				name: 'projectPath',
				type: 'string',
				default: '',
				description:
					'The directory path where Claude Code should run (e.g., /path/to/project). If empty, uses the current working directory.',
				placeholder: '/home/user/projects/my-app',
				hint: 'This sets the working directory for Claude Code, allowing it to access files and run commands in the specified project location',
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
				displayName: 'Disallowed Tools',
				name: 'disallowedTools',
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
				default: [],
				description:
					'Select which built-in tools Claude Code is explicitly blocked from using. Takes precedence over Allowed Tools.',
			},
			{
				displayName: 'Additional Options',
				name: 'additionalOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				options: [
					{
						displayName: 'Debug Mode',
						name: 'debug',
						type: 'boolean',
						default: false,
						description: 'Whether to enable debug logging',
					},
					{
						displayName: 'Fallback Model',
						name: 'fallbackModel',
						type: 'options',
						options: [
							{
								name: 'None',
								value: '',
								description: 'No fallback model',
							},
							{
								name: 'Sonnet',
								value: 'sonnet',
								description: 'Fallback to Sonnet when primary model is overloaded',
							},
							{
								name: 'Opus',
								value: 'opus',
								description: 'Fallback to Opus when primary model is overloaded',
							},
						],
						default: '',
						description: 'Automatically switch to fallback model when primary model is overloaded',
					},
					{
						displayName: 'Max Thinking Tokens',
						name: 'maxThinkingTokens',
						type: 'number',
						default: 0,
						description: 'Maximum number of thinking tokens (0 for unlimited)',
						hint: 'Controls how many tokens Claude can use for internal reasoning',
					},
					{
						displayName: 'Permission Mode',
						name: 'permissionMode',
						type: 'options',
						options: [
							{
								name: 'Default',
								value: 'default',
								description: 'Standard permission prompts',
							},
							{
								name: 'Accept Edits',
								value: 'acceptEdits',
								description: 'Automatically accept file edits',
							},
							{
								name: 'Bypass Permissions',
								value: 'bypassPermissions',
								description: 'Skip all permission checks',
							},
							{
								name: 'Plan',
								value: 'plan',
								description: 'Planning mode - Claude will plan before executing',
							},
						],
						default: 'bypassPermissions',
						description: 'How to handle permission requests for tool usage',
					},
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
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		// Dynamically import the Claude Code SDK (ES module)
		const { query } = await import('@anthropic-ai/claude-code');

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			let timeout = 300; // Default timeout
			try {
				const operation = this.getNodeParameter('operation', itemIndex) as string;
				const prompt = this.getNodeParameter('prompt', itemIndex) as string;
				const model = this.getNodeParameter('model', itemIndex) as string;
				const maxTurns = this.getNodeParameter('maxTurns', itemIndex) as number;
				timeout = this.getNodeParameter('timeout', itemIndex) as number;
				const projectPath = this.getNodeParameter('projectPath', itemIndex) as string;
				const outputFormat = this.getNodeParameter('outputFormat', itemIndex) as string;
				const allowedTools = this.getNodeParameter('allowedTools', itemIndex, []) as string[];
				const disallowedTools = this.getNodeParameter('disallowedTools', itemIndex, []) as string[];
				const additionalOptions = this.getNodeParameter('additionalOptions', itemIndex) as {
					systemPrompt?: string;
					permissionMode?: string;
					debug?: boolean;
					fallbackModel?: string;
					maxThinkingTokens?: number;
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
					this.logger.debug('Starting Claude Code execution', {
						itemIndex,
						prompt: prompt.substring(0, 100) + '...',
						model,
						maxTurns,
						timeout: `${timeout}s`,
						allowedTools,
						disallowedTools,
						fallbackModel: additionalOptions.fallbackModel || 'none',
					});
				}

				// Build query options
				interface QueryOptions {
					prompt: string;
					abortController: AbortController;
					options: {
						maxTurns: number;
						permissionMode: 'default' | 'acceptEdits' | 'bypassPermissions' | 'plan';
						model: string;
						systemPrompt?: string;
						mcpServers?: Record<string, any>;
						allowedTools?: string[];
						disallowedTools?: string[];
						fallbackModel?: string;
						maxThinkingTokens?: number;
						continue?: boolean;
						cwd?: string;
					};
				}

				const queryOptions: QueryOptions = {
					prompt,
					abortController,
					options: {
						maxTurns,
						permissionMode: (additionalOptions.permissionMode || 'bypassPermissions') as any,
						model,
					},
				};

				// Add optional parameters
				if (additionalOptions.systemPrompt) {
					queryOptions.options.systemPrompt = additionalOptions.systemPrompt;
				}

				// Add project path (cwd) if specified
				if (projectPath && projectPath.trim() !== '') {
					queryOptions.options.cwd = projectPath.trim();
					if (additionalOptions.debug) {
						this.logger.debug('Working directory set', { cwd: queryOptions.options.cwd });
					}
				}

				// Set allowed tools if any are specified
				if (allowedTools.length > 0) {
					queryOptions.options.allowedTools = allowedTools;
					if (additionalOptions.debug) {
						this.logger.debug('Allowed tools configured', { allowedTools });
					}
				}

				// Set disallowed tools if any are specified
				if (disallowedTools.length > 0) {
					queryOptions.options.disallowedTools = disallowedTools;
					if (additionalOptions.debug) {
						this.logger.debug('Disallowed tools configured', { disallowedTools });
					}
				}

				// Add fallback model if specified
				if (additionalOptions.fallbackModel) {
					queryOptions.options.fallbackModel = additionalOptions.fallbackModel;
				}

				// Add max thinking tokens if specified
				if (additionalOptions.maxThinkingTokens && additionalOptions.maxThinkingTokens > 0) {
					queryOptions.options.maxThinkingTokens = additionalOptions.maxThinkingTokens;
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
							// Log detailed message content based on type
							if (message.type === 'system' && (message as any).subtype === 'init') {
								this.logger.debug('System init message', {
									type: message.type,
									subtype: (message as any).subtype,
									model: (message as any).model,
									toolCount: (message as any).tools?.length || 0,
								});
							} else if (message.type === 'assistant') {
								const content = (message as any).message?.content;
								this.logger.debug('Assistant message', {
									type: message.type,
									contentTypes: content?.map((c: any) => c.type) || [],
									textLength: content?.find((c: any) => c.type === 'text')?.text?.length || 0,
									hasToolUse: content?.some((c: any) => c.type === 'tool_use') || false,
								});
							} else if (message.type === 'user') {
								this.logger.debug('User message', {
									type: message.type,
									hasToolResult: !!(message as any).message?.content?.some(
										(c: any) => c.type === 'tool_result',
									),
								});
							} else if (message.type === 'result') {
								const resultMsg = message as any;
								this.logger.debug('Result message', {
									type: message.type,
									subtype: resultMsg.subtype,
									hasResult: !!resultMsg.result,
									hasError: !!resultMsg.error,
									resultLength: resultMsg.result ? String(resultMsg.result).length : 0,
									error: resultMsg.error || 'none',
									duration_ms: resultMsg.duration_ms,
									total_cost: resultMsg.total_cost_usd,
								});

								// Log more details for error_during_execution
								if (resultMsg.subtype === 'error_during_execution') {
									this.logger.error('Claude Code execution error', {
										subtype: resultMsg.subtype,
										error: resultMsg.error,
										details: JSON.stringify(resultMsg).substring(0, 500),
									});
								}
							} else {
								this.logger.debug('Other message', {
									type: message.type,
									message: JSON.stringify(message).substring(0, 200),
								});
							}
						}

						// Track progress
						if (message.type === 'assistant' && message.message?.content) {
							const content = message.message.content[0];
							if (additionalOptions.debug) {
								if (content.type === 'text') {
									this.logger.debug('Assistant response', {
										text: content.text.substring(0, 100) + '...',
									});
								} else if (content.type === 'tool_use') {
									this.logger.debug('Tool use', { toolName: content.name });
								}
							}
						}
					}

					clearTimeout(timeoutId);

					const duration = Date.now() - startTime;
					if (additionalOptions.debug) {
						this.logger.debug('Execution completed', {
							durationMs: duration,
							messageCount: messages.length,
						});

						// Log final messages array summary
						const messageTypes = messages.map((m) => ({
							type: m.type,
							subtype: (m as any).subtype,
						}));
						this.logger.debug('All messages in order', { messageTypes });
					}

					// Format output based on selected format
					if (outputFormat === 'text') {
						// Find the result message
						const resultMessage = messages.find((m) => m.type === 'result') as any;

						if (additionalOptions.debug) {
							this.logger.debug('Processing text output format', {
								foundResultMessage: !!resultMessage,
								messageCount: messages.length,
							});
						}

						// Extract the final assistant message if no result message
						let finalText = '';
						let errorText = '';

						if (resultMessage) {
							if (resultMessage.result) {
								finalText = resultMessage.result;
							} else if (resultMessage.error) {
								errorText = resultMessage.error;
								finalText = `Error: ${resultMessage.error}`;
							} else if (resultMessage.subtype === 'error_max_turns') {
								errorText = 'Maximum turns reached';
								// Try to get the last assistant message before max turns
								const assistantMessages = messages.filter(
									(m) => m.type === 'assistant' && m.message?.content,
								);
								if (assistantMessages.length > 0) {
									const lastMessage = assistantMessages[assistantMessages.length - 1] as any;
									const textContent = lastMessage.message?.content?.find(
										(c: any) => c.type === 'text',
									);
									if (textContent?.text) {
										finalText = `[PARTIAL - Max turns reached]\n\n${textContent.text}\n\n[Note: Task incomplete. Increase maxTurns parameter to complete.]`;
									} else {
										finalText =
											'Error: Maximum conversation turns reached. Consider increasing maxTurns parameter.';
									}
								} else {
									finalText =
										'Error: Maximum conversation turns reached. Consider increasing maxTurns parameter.';
								}
							} else if (resultMessage.subtype === 'error_during_execution') {
								errorText = 'Error during execution';
								// Try to get the last assistant message before the error
								const assistantMessages = messages.filter(
									(m) => m.type === 'assistant' && m.message?.content,
								);
								if (assistantMessages.length > 0) {
									const lastMessage = assistantMessages[assistantMessages.length - 1] as any;
									const textContent = lastMessage.message?.content?.find(
										(c: any) => c.type === 'text',
									);
									if (textContent?.text) {
										finalText = `[ERROR - Execution failed]\n\n${textContent.text}\n\n[Note: An error occurred during execution. Check logs for details.]`;
									} else {
										finalText = 'Error: Execution failed. Check debug logs for details.';
									}
								} else {
									finalText = 'Error: Execution failed. No output available.';
								}
							}

							// Debug log the result message
							if (additionalOptions.debug) {
								this.logger.debug('Result message details', {
									type: resultMessage.type,
									subtype: resultMessage.subtype,
									hasResult: !!resultMessage.result,
									hasError: !!resultMessage.error,
									resultLength: resultMessage.result ? String(resultMessage.result).length : 0,
									errorMessage: resultMessage.error || 'none',
								});
							}
						} else {
							// Find the last assistant message with text content
							const assistantMessages = messages.filter(
								(m) => m.type === 'assistant' && m.message?.content,
							);
							if (assistantMessages.length > 0) {
								const lastMessage = assistantMessages[assistantMessages.length - 1] as any;
								const textContent = lastMessage.message?.content?.find(
									(c: any) => c.type === 'text',
								);
								finalText = textContent?.text || '';
							}

							if (!finalText) {
								finalText = 'No response generated - check debug logs for details';
							}
						}

						// Ensure all values are JSON-safe
						const outputData = {
							result: String(finalText || 'No response generated'),
							success: resultMessage?.subtype === 'success' ? true : false,
							duration_ms: Number(resultMessage?.duration_ms || 0),
							total_cost_usd: Number(resultMessage?.total_cost_usd || 0),
						};

						// Debug logging
						if (additionalOptions.debug) {
							this.logger.debug('Text output format data', {
								outputData,
								resultPreview:
									outputData.result.substring(0, 200) +
									(outputData.result.length > 200 ? '...' : ''),
								outputDataTypes: {
									result: typeof outputData.result,
									success: typeof outputData.success,
									duration_ms: typeof outputData.duration_ms,
									total_cost_usd: typeof outputData.total_cost_usd,
								},
							});

							// Log all message types for debugging
							const messageSummary = messages.reduce(
								(acc, msg) => {
									acc[msg.type] = (acc[msg.type] || 0) + 1;
									return acc;
								},
								{} as Record<string, number>,
							);

							this.logger.debug('Message summary', {
								messageSummary,
								totalMessages: messages.length,
								hasResultMessage: !!resultMessage,
								resultError: errorText || 'none',
							});

							try {
								JSON.stringify(outputData);
							} catch (e) {
								this.logger.error('Output data is not JSON-compatible', { error: e });
							}
						}

						returnData.push({
							json: outputData,
							pairedItem: { item: itemIndex },
						});
					} else if (outputFormat === 'messages') {
						// Return raw messages
						returnData.push({
							json: {
								messages,
								messageCount: messages.length,
							},
							pairedItem: { item: itemIndex },
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
							pairedItem: { item: itemIndex },
						});
					}
				} catch (queryError) {
					clearTimeout(timeoutId);

					// If we're in text output mode and error occurs during query, return error data
					if (outputFormat === 'text') {
						const errorMessage =
							queryError instanceof Error ? queryError.message : String(queryError);
						returnData.push({
							json: {
								result: `Error during execution: ${errorMessage}`,
								success: false,
								duration_ms: Date.now() - startTime,
								total_cost_usd: 0,
							},
							pairedItem: { item: itemIndex },
						});
					} else {
						throw queryError;
					}
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

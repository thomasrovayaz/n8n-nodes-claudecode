# n8n-nodes-claudecode

This is an n8n community node. It lets you use Claude Code in your n8n workflows.

Claude Code is an AI-powered coding assistant that can write, edit, and analyze code, execute commands, and work with files through the Claude Code SDK and Model Context Protocol (MCP) servers.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  
[Compatibility](#compatibility)  
[Usage](#usage)  
[Resources](#resources)  
[Version history](#version-history)

## Installation

### Prerequisites

**Important**: This node requires Claude Code to be installed and authenticated on the n8n server:

```bash
# Install Claude Code globally
npm install -g @anthropic-ai/claude-code

# Authenticate Claude Code (requires active subscription)
claude
```

The Claude Code CLI must be accessible to the n8n process. If using Docker, you'll need to ensure Claude Code is installed and authenticated within the container.

### Installing the n8n Community Node

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

**Using the n8n UI:**
1. Go to **Settings** > **Community Nodes**
2. Click **Install a community node**
3. Enter `@holtweb/n8n-nodes-claudecode`
4. Click **Install**

**Manual installation:**
```bash
cd ~/.n8n/nodes
npm install @holtweb/n8n-nodes-claudecode
# Restart n8n
```

**Docker installation:**
```bash
docker run -it --rm \
  -p 5678:5678 \
  -e N8N_COMMUNITY_NODE_PACKAGES=@holtweb/n8n-nodes-claudecode \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

## Operations

- **Query**: Start a new conversation with Claude Code
- **Continue**: Continue a previous conversation (requires prior query)

## Credentials

This node uses the Claude Code SDK authentication from your system. No credentials need to be configured within n8n itself.

**Prerequisites:**
1. Active Claude subscription (Pro or Team)
2. Claude Code CLI installed globally: `npm install -g @anthropic-ai/claude-code`
3. Authenticated via: `claude`

The authentication is handled by the Claude Code SDK using your system's credentials.

## Compatibility

- **n8n version**: 1.0.0 or later
- **Node.js**: 20.15 or later
- **Claude Code SDK**: Latest version

Tested with:
- n8n: 1.0.0+
- Node.js: 22.x

## Usage

### Basic Workflow

1. Add the **Claude Code** node to your workflow
2. Select **Query** operation
3. Enter your prompt (e.g., "Do some research on MCP servers")
4. Configure the model (Claude 4 Sonnet or Claude 4 Opus)
5. Select which tools Claude can use + configure MCP
6. Execute the node

### Configuration Options

**Main Parameters:**
- **Operation**: Query or Continue
- **Prompt**: Your instruction or question for Claude
- **Model**: Choose between Claude 4 Sonnet (faster & default) or Claude 4 Opus (more capable)
- **Max Turns**: Maximum conversation turns (default: 5)
- **Timeout**: Operation timeout in seconds (default: 300)
- **Output Format**: 
  - Structured: Complete response with messages, summary, metrics
  - Messages: Raw array of all messages
  - Text: Final result only

**Additional Options:**
- **System Prompt**: Additional context or instructions for Claude Code
- **Require Permissions**: Whether to require permission for tool use
- **Debug Mode**: Enable debug logging for troubleshooting
- **Project Path**: Directory path where Claude Code should run (e.g., /path/to/project). This allows Claude to access and work with files in a specific repository or project directory

**Available Tools:**
- **Bash**: Execute bash commands
- **Edit/MultiEdit**: Edit files
- **Read/Write**: File operations
- **Glob/Grep/LS**: File searching
- **Task**: Launch agents for complex searches
- **Web Fetch/Search**: Web operations
- **Notebook Read/Edit**: Jupyter notebook support
- **Todo Write**: Task management

### MCP Server Configuration

Model Context Protocol servers extend Claude's capabilities:

1. Click **Add MCP Server**
2. Configure:
   - **Server Name**: Unique identifier (e.g., "filesystem")
   - **Command**: Command to run (e.g., "npx")
   - **Arguments**: Server arguments (e.g., "-y @modelcontextprotocol/server-filesystem /path")
   - **Environment Variables**: Required env vars (KEY=value format)
   - **Allowed Tools**: Specific tools or "*" for all

Example MCP servers:
- `@modelcontextprotocol/server-filesystem` - File system access
- `@modelcontextprotocol/server-github` - GitHub integration
- `@modelcontextprotocol/server-slack` - Slack integration

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
* [Claude Code documentation](https://docs.anthropic.com/claude-code)
* [Model Context Protocol](https://modelcontextprotocol.io)
* [GitHub repository](https://github.com/holt-web-ai/n8n-nodes-claudecode)

## Version history

### 0.2.0 (Upcoming)
- Added Project Path option to set Claude Code's working directory
- This allows Claude to access and work with specific code repositories or project directories

### 0.1.0 (Initial Release)
- Basic Claude Code SDK integration
- Support for Query and Continue operations
- MCP server configuration
- Multiple output formats
- Tool selection and control
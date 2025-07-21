# 🚀 Claude Code for n8n

**Bring the power of Claude Code directly into your n8n automation workflows!**

Imagine having an AI coding assistant that can analyze your codebase, fix bugs, write new features, manage databases, interact with APIs, and automate your entire development workflow - all within n8n. That's exactly what this node enables.

[![n8n](https://img.shields.io/badge/n8n-community-node-orange.svg)](https://n8n.io/)
[![Claude Code](https://img.shields.io/badge/Claude%20Code-Powered-blue.svg)](https://claude.ai/code)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE.md)

## 🌟 What Can You Build?

### 🔧 **Automated Code Reviews**
Create workflows that automatically review pull requests, suggest improvements, and even fix issues before merging.

### 🐛 **Intelligent Bug Fixing**
Connect error monitoring tools to Claude Code - automatically diagnose and fix production issues in real-time.

### 📊 **Database Management**
Let Claude Code write complex SQL queries, optimize database schemas, and generate migration scripts based on your requirements.

### 🤖 **Self-Improving Workflows**
Build n8n workflows that can modify and improve themselves using Claude Code's capabilities.

### 📝 **Documentation Generation**
Automatically generate and update documentation for your entire codebase, APIs, or databases.

### 🔄 **Code Migration**
Automate the migration of legacy codebases to modern frameworks with intelligent refactoring.

## ⚡ Quick Start

```bash
# Install Claude Code CLI
npm install -g @anthropic-ai/claude-code

# Authenticate (requires Claude Pro/Team subscription)
claude

# Install the n8n node
# In n8n: Settings → Community Nodes → Install → @holtweb/n8n-nodes-claudecode
```

## 🎯 Real-World Use Cases

### 1. **GitHub Issue to Code**
```
Webhook (GitHub Issue) → Claude Code → Create PR → Notify Slack
```
Automatically implement features or fix bugs when issues are created.

### 2. **Database Query Builder**
```
Form Trigger → Claude Code → Execute Query → Send Results
```
Natural language to SQL - let non-technical users query databases safely.

### 3. **Code Quality Guardian**
```
Git Push → Claude Code → Analyze Code → Block/Approve → Notify
```
Enforce coding standards and catch issues before they reach production.

### 4. **API Integration Builder**
```
HTTP Request → Claude Code → Generate Integration → Test → Deploy
```
Automatically create integrations with third-party APIs.

### 5. **Intelligent Log Analysis**
```
Error Logs → Claude Code → Diagnose → Create Fix → Open PR
```
Turn error logs into actionable fixes automatically.

## 🛠️ Powerful Features

### **Project Context Awareness**
Set a project path and Claude Code understands your entire codebase context:
- Analyzes existing code patterns
- Follows your coding standards
- Understands your architecture
- Respects your dependencies

### **Tool Arsenal**
Claude Code comes equipped with powerful tools:
- 📁 **File Operations**: Read, write, edit multiple files
- 💻 **Bash Commands**: Execute any command
- 🔍 **Smart Search**: Find patterns across your codebase
- 🌐 **Web Access**: Fetch documentation and resources
- 📊 **Database Access**: Via MCP servers
- 🔗 **API Integration**: GitHub, Slack, and more via MCP

### **Model Context Protocol (MCP)**
Extend Claude Code with specialized capabilities:
- PostgreSQL/MySQL database access
- GitHub repository management
- Slack workspace integration
- Custom tool development

## 📋 Configuration Examples

### Simple Code Analysis
```javascript
{
  "operation": "query",
  "prompt": "Analyze this codebase and suggest performance improvements",
  "projectPath": "/path/to/your/project",
  "model": "sonnet"
}
```

### Advanced Database Operations
```javascript
{
  "operation": "query",
  "prompt": "Create an optimized query to find users who haven't logged in for 30 days",
  "projectPath": "/path/to/project",
  "model": "opus"
}
```

With MCP configuration (`.mcp.json`):
```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres", "${DATABASE_URL}"]
    }
  }
}
```

## 🔄 Workflow Patterns

### Pattern 1: Continuous Code Improvement
```
Schedule Trigger (Daily)
  ↓
Claude Code (Analyze codebase for improvements)
  ↓
Create GitHub Issues
  ↓
Assign to Team
```

### Pattern 2: Natural Language to Code
```
Slack Command
  ↓
Claude Code (Generate code from description)
  ↓
Create Pull Request
  ↓
Run Tests
  ↓
Notify Results
```

### Pattern 3: Intelligent Monitoring
```
Error Webhook
  ↓
Claude Code (Diagnose issue)
  ↓
If (Can fix automatically)
  ├─ Yes: Create Fix PR
  └─ No: Create Detailed Issue
```

## 🚦 Getting Started

1. **Install Prerequisites**
   ```bash
   npm install -g @anthropic-ai/claude-code
   claude  # Authenticate with your Claude account
   ```

2. **Install the Node**
   - In n8n: Settings → Community Nodes
   - Install: `@holtweb/n8n-nodes-claudecode`

3. **Create Your First Workflow**
   - Add Claude Code node
   - Set your project path
   - Enter a prompt
   - Watch the magic happen!

## 💡 Pro Tips

### 🎯 **Use Project Paths**
Always set a project path for better context and results:
```
/home/user/projects/my-app
```

### 🔒 **Configure Permissions**
Control what Claude Code can do in `.claude/settings.json`:
```json
{
  "permissions": {
    "allow": ["Read(*)", "Write(*)", "Bash(npm test)"],
    "deny": ["Bash(rm -rf *)"]
  }
}
```

### 🔗 **Chain Operations**
Use "Continue" operation to build complex multi-step workflows while maintaining context.

### 📊 **Output Formats**
- **Structured**: Full details with metrics
- **Messages**: For debugging
- **Text**: Simple results for chaining

## 🤝 Community & Support

- 📖 [Documentation](https://github.com/holt-web-ai/n8n-nodes-claudecode)
- 🐛 [Report Issues](https://github.com/holt-web-ai/n8n-nodes-claudecode/issues)
- 💬 [Discussions](https://github.com/holt-web-ai/n8n-nodes-claudecode/discussions)
- 🌟 [Star on GitHub](https://github.com/holt-web-ai/n8n-nodes-claudecode)

## 📈 What's Next?

We're constantly improving! Upcoming features:
- Visual workflow builder for Claude Code operations
- Pre-built workflow templates
- Enhanced debugging tools
- More MCP server integrations

## 📄 License

MIT - Build amazing things!

---

**Ready to revolutionize your development workflow?** Install Claude Code for n8n today and join the future of automated software development!

Made with ❤️ by [Adam Holt](https://github.com/holt-web-ai)
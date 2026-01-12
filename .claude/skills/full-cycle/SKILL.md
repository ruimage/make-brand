---
name: full-cycle
description: "Full-cycle development pipeline. Generates PRD from user prompt or uses existing PRD, creates TaskMaster task tree with dependencies and subtasks, converts to implementation plan format, and prepares for autonomous execution via TaskMaster autopilot. Supports flexible input (short description or ready PRD file) and provides dry-run mode for planning-only execution. Use when user mentions: full-cycle, /full-cycle, autosborka, auto-build, fullcycle, prd-generation, autonomous development, PRD generation, task planning."
license: Apache-2.0
metadata:
  author: claude-code-assistant
  version: "2.1"
  compatibility: claude-code-cli
---

```xml
<skill-definition>
  <metadata>
    <name>full-cycle</name>
    <command>/full-cycle</command>
    <version>2.1</version>
    <license>Apache-2.0</license>
    <author>claude-code-assistant</author>
    <compatibility>claude-code-cli</compatibility>
    <description>
      Full-cycle development pipeline: PRD generation → TaskMaster task tree → Implementation Plan → TaskMaster Autopilot Execution
    </description>
    <triggers>
      <trigger>full-cycle</trigger>
      <trigger>/full-cycle</trigger>
      <trigger>autosborka</trigger>
      <trigger>auto-build</trigger>
      <trigger>fullcycle</trigger>
      <trigger>prd-generation</trigger>
      <trigger>autonomous development</trigger>
      <trigger>PRD generation</trigger>
      <trigger>task planning</trigger>
    </triggers>
  </metadata>

  <overview-section>
    <title>Overview</title>
    <description>
      /full-cycle combines three powerful tools in a single pipeline:
      1. PRD Generation — Create Product Requirements Document via planning-prd-agent
      2. TaskMaster Tree — Build structured task tree with dependencies and subtasks
      3. Autopilot Execution — Execute via TaskMaster autopilot with TDD workflow
    </description>

    <key-features>
      <feature order="1">
        <name>Flexible input</name>
        <description>short description OR ready PRD file</description>
      </feature>
      <feature order="2">
        <name>TaskMaster TDD workflow</name>
        <description>RED → GREEN → COMMIT phases</description>
      </feature>
      <feature order="3">
        <name>Atomic tasks</name>
        <description>checkpoint verification</description>
      </feature>
      <feature order="4">
        <name>Automatic git branch management</name>
      </feature>
      <feature order="5">
        <name>Dry-run mode</name>
        <description>planning-only execution</description>
      </feature>
      <feature order="6">
        <name>Resume support</name>
        <description>interrupted sessions</description>
      </feature>
      <feature order="7" priority="critical">
        <name>Real-time progress reporting</name>
        <description>user sees exactly what's happening at each step</description>
      </feature>
    </key-features>
  </overview-section>

  <stop-guard-section mandatory="true" priority="CRITICAL">
    <title>STOP GUARD: MANDATORY ACKNOWLEDGEMENT</title>

    <required-checks type="before-proceeding">
      <check order="1" mandatory="true">
        <description>Read the ENTIRE MANDATORY PROTOCOL section below</description>
      </check>
      <check order="2" mandatory="true">
        <description>Understood the 4-Phase Contract flow</description>
      </check>
      <check order="3" mandatory="true">
        <description>Verified ALL required tools are available</description>
      </check>
      <check order="4" mandatory="true">
        <description>Committed to checkpoint verification at EACH phase</description>
      </check>
    </required-checks>

    <never-proceed-conditions>
      <condition order="1">Required MCP tools are unavailable</condition>
      <condition order="2">Checkpoint conditions are NOT met</condition>
      <condition order="3">User has not confirmed destructive operations</condition>
      <condition order="4">Previous phase verification FAILED</condition>
    </never-proceed-conditions>

    <always-execute>
      <rule order="1">Phases in STRICT SEQUENTIAL ORDER (1 → 2 → 3 → 4)</rule>
      <rule order="2">REQUIRED TOOLS ONLY (no substitutions)</rule>
      <rule order="3">CHECKPOINT verification after EACH phase</rule>
      <rule order="4">STOP on ANY verification failure</rule>
      <rule order="5" priority="critical">PROGRESS REPORTING — output current step, tool, and target at EVERY action</rule>
    </always-execute>

    <failure-protocol>
      <action>STOP IMMEDIATELY</action>
      <action>REPORT THE BLOCKING ISSUE</action>
      <action>DO NOT PROCEED WITH EXECUTION</action>
    </failure-protocol>
  </stop-guard-section>

  <progress-reporting-section mandatory="true" priority="CRITICAL">
    <title>MANDATORY: PROGRESS REPORTING</title>
    <requirement>CRITICAL: You MUST report progress at EVERY step. Do NOT work silently.</requirement>

    <phase-reporting-template>
      <format>
        <code-block language="text">
          <![CDATA[

═══════════════════════════════════════════════════════════════════
▶ [PHASE N]: [PHASE NAME]
═══════════════════════════════════════════════════════════════════

▶ Current Step: [Specific action being performed]
▶ Tool/Method: [Tool name or approach]
▶ Target: [File/Resource being operated on]

[Detailed description of what's happening...]

▶ Status: [IN PROGRESS | COMPLETE | FAILED]
▶ Next: [What happens next]
═══════════════════════════════════════════════════════════════════
          ]]>
        </code-block>
      </format>
    </phase-reporting-template>

    <phase-specific-reporting>
      <phase number="1" name="PRD Generation">
        <report action="before">Calling planning-prd-agent skill...</report>
        <report action="during">Generating PRD for: [user request]</report>
        <report action="after">PRD created at: .taskmaster/docs/prd.txt</report>
        <report action="error">PRD generation failed: [reason]</report>
      </phase>

      <phase number="2" name="TaskMaster">
        <report step="2.1">Initializing TaskMaster...</report>
        <report step="2.2">Parsing PRD into tasks... Expected: N tasks</report>
        <report step="2.3">Expanding tasks into subtasks...</report>
        <report action="final">Task tree created: X top-level tasks, Y subtasks</report>
      </phase>

      <phase number="3" name="Implementation Artifacts">
        <report action="each-file">Creating PROMPT_build.md...</report>
        <report action="during">Converting tasks to specs/...</report>
        <report action="final">Generated N spec files</report>
      </phase>

      <phase number="4" name="Autopilot Execution">
        <report action="branch">Creating git branch: [branch-name]</report>
        <report action="start">Starting TaskMaster autopilot for task ID...</report>
        <report action="running">Autopilot running with TDD workflow (RED/GREEN/COMMIT)</report>
        <report action="dry-run">DRY RUN: Skipping autopilot execution</report>
      </phase>
    </phase-specific-reporting>

    <general-reporting-rules>
      <rule priority="high">ALWAYS report before starting a new step</rule>
      <rule priority="high">ALWAYS report after completing a step</rule>
      <rule priority="high">ALWAYS report errors with context</rule>
      <rule priority="critical">NEVER work silently for more than 30 seconds without output</rule>
    </general-reporting-rules>
  </progress-reporting-section>

  <mandatory-protocol-section priority="CRITICAL">
    <title>MANDATORY PROTOCOL</title>
    <warning>CRITICAL: THIS SKILL MUST BE EXECUTED EXACTLY AS DESCRIBED BELOW. NO DEVIATIONS ALLOWED. NO SHORTCUTS. NO EXCEPTIONS.</warning>

    <four-phase-contract>
      <phase number="1" name="INPUT ANALYSIS">
        <flow>
          <step>User Input</step>
          <decision>
            <option>Short desc</option>
            <option>Ready PRD file</option>
          </decision>
          <action>planning-prd-agent</action>
          <output>PRD File</output>
        </flow>
        <checkpoint>
          <condition>PRD file exists at .taskmaster/docs/prd.txt</condition>
          <verification>file contains valid PRD content</verification>
        </checkpoint>
      </phase>

      <phase number="2" name="TASKMASTER TREE BUILD">
        <flow>
          <action>initialize_project</action>
          <action>parse_prd</action>
          <action>expand_all</action>
          <output>Task Tree</output>
        </flow>
        <checkpoint>
          <condition>tasks/tasks.json exists with dependencies &amp; subtasks</condition>
        </checkpoint>
      </phase>

      <phase number="3" name="IMPLEMENTATION ARTIFACTS GENERATION">
        <flow>
          <input>TaskMaster JSON</input>
          <action>Convert</action>
          <output>Implementation Structures (specs/, prompts)</output>
        </flow>
        <checkpoint>
          <condition>implementation-structures/ directory created with all required files</condition>
        </checkpoint>
      </phase>

      <phase number="4" name="AUTOPILOT EXECUTION">
        <flow>
          <action>Git Branch</action>
          <action>autopilot_start</action>
          <action>TDD Workflow</action>
          <output>Complete</output>
        </flow>
        <checkpoint>
          <condition>TaskMaster autopilot started on correct branch</condition>
        </checkpoint>
      </phase>
    </four-phase-contract>

    <required-tools-table>
      <columns>
        <column>PHASE</column>
        <column>TOOL (MCP/skill)</column>
        <column>PURPOSE</column>
        <column>REQUIRED</column>
      </columns>
      <tools>
        <tool phase="1">
          <name>planning-prd-agent (skill)</name>
          <purpose>Generate PRD from desc</purpose>
          <required>YES</required>
        </tool>
        <tool phase="2">
          <name>mcp__task-master-ai__initialize_project</name>
          <purpose>Initialize TaskMaster</purpose>
          <required>MANDATORY</required>
        </tool>
        <tool phase="2">
          <name>mcp__task-master-ai__parse_prd</name>
          <purpose>Convert PRD to tasks</purpose>
          <required>MANDATORY</required>
        </tool>
        <tool phase="2">
          <name>mcp__task-master-ai__expand_all</name>
          <purpose>Create subtasks</purpose>
          <required>MANDATORY</required>
        </tool>
        <tool phase="3">
          <name>(file generation)</name>
          <purpose>Convert to implementation plan</purpose>
          <required>MANDATORY</required>
          <note>NO MCP tool - Custom script</note>
        </tool>
        <tool phase="4">
          <name>mcp__task-master-ai__autopilot_start</name>
          <purpose>Start TDD autopilot workflow</purpose>
          <required>MANDATORY</required>
        </tool>
      </tools>
    </required-tools-table>

    <forbidden-alternatives>
      <prohibited>
        <action>Manual task creation instead of TaskMaster parse_prd</action>
        <action>Manual implementation instead of autopilot workflow</action>
        <action>Skipping TaskMaster dependency resolution</action>
        <action>Bypassing TDD checkpoint gates</action>
        <action>Alternative MCP tools for required operations</action>
      </prohibited>
      <must-not>
        <action>Skip checkpoint verification</action>
        <action>Proceed to next phase before current phase completes</action>
        <action>Ignore verification failures</action>
        <action>Modify tasks.json manually</action>
      </must-not>
    </forbidden-alternatives>

    <checkpoint-gates>
      <checkpoint phase="1">
        <condition>PRD file exists at: .taskmaster/docs/prd.txt</condition>
        <condition>File is not empty (contains valid PRD content)</condition>
        <failure-action>Re-run planning-prd-agent</failure-action>
      </checkpoint>
      <checkpoint phase="2">
        <condition>tasks/tasks.json exists</condition>
        <condition>Contains at least 1 top-level task</condition>
        <condition>Dependencies are resolved (no circular refs)</condition>
        <failure-action>Run validate_dependencies tool</failure-action>
      </checkpoint>
      <checkpoint phase="3">
        <condition>implementation-structures/ directory exists</condition>
        <condition>PROMPT_build.md exists</condition>
        <condition>PROMPT_plan.md exists</condition>
        <condition>IMPLEMENTATION_PLAN.md exists</condition>
        <condition>specs/ directory has at least 1 spec file</condition>
        <failure-action>Re-run artifact generation</failure-action>
      </checkpoint>
      <checkpoint phase="4">
        <condition>Git branch created/checked out</condition>
        <condition>autopilot_start MCP tool available</condition>
        <condition>.taskmaster/ directory exists with tasks.json</condition>
        <failure-action>Abort with error message</failure-action>
      </checkpoint>
    </checkpoint-gates>
  </mandatory-protocol-section>

  <usage-section>
    <title>Usage</title>
    <examples>
      <example id="short-description">
        <description>From short description (auto PRD generation)</description>
        <code-block language="bash">
          <![CDATA[
/full-cycle "Create a todo app with React and TypeScript"
          ]]>
        </code-block>
      </example>
      <example id="ready-prd">
        <description>From ready PRD file</description>
        <code-block language="bash">
          <![CDATA[
/full-cycle --prd=./path/to/prd.txt
          ]]>
        </code-block>
      </example>
      <example id="with-parameters">
        <description>With parameters</description>
        <code-block language="bash">
          <![CDATA[
/full-cycle "Project idea" --branch=feature/autopilot-build --dry-run
          ]]>
        </code-block>
      </example>
      <example id="resume">
        <description>Resume interrupted session</description>
        <code-block language="bash">
          <![CDATA[
/full-cycle --resume
          ]]>
        </code-block>
      </example>
    </examples>
  </usage-section>

  <parameters-section>
    <title>Parameters</title>
    <parameter-table>
      <parameter name="input" type="string" required="conditional">
        <description>Project description OR path to PRD file</description>
      </parameter>
      <parameter name="--prd" type="path" required="false" default="auto">
        <description>Path to existing PRD file (skips PRD generation)</description>
      </parameter>
      <parameter name="--max-attempts" type="number" required="false" default="3">
        <description>Maximum retries per subtask in autopilot</description>
      </parameter>
      <parameter name="--branch" type="string" required="false" default="feature/auto-{timestamp}">
        <description>Git branch for development</description>
      </parameter>
      <parameter name="--tag" type="string" required="false" default="full-cycle">
        <description>TaskMaster tag for task organization</description>
      </parameter>
      <parameter name="--output-dir" type="path" required="false" default=".">
        <description>Directory for artifacts (project root)</description>
      </parameter>
      <parameter name="--dry-run" type="flag" required="false" default="false">
        <description>Generate artifacts only, skip autopilot</description>
      </parameter>
      <parameter name="--resume" type="flag" required="false" default="false">
        <description>Resume previously interrupted session</description>
      </parameter>
      <parameter name="--num-tasks" type="number" required="false" default="auto">
        <description>Number of top-level tasks (auto by complexity)</description>
      </parameter>
    </parameter-table>
  </parameters-section>

  <workflow-section>
    <title>Workflow</title>

    <phase number="1" name="INPUT ANALYSIS">
      <state-initial>▶ INITIALIZING</state-initial>

      <step order="1">
        <name>Determine Input Type</name>
        <flow>
          <input>User Input</input>
          <branch-a>Short desc</branch-a>
          <branch-b>Ready PRD file</branch-b>
          <action>planning-prd-agent: Generate PRD (only if input is short description)</action>
          <output>.taskmaster/docs/prd.txt</output>
        </flow>
      </step>

      <required-tool>planning-prd-agent (skill)</required-tool>

      <checkpoint>
        <condition>PRD file exists at .taskmaster/docs/prd.txt</condition>
        <condition>File contains valid PRD content (not empty)</condition>
      </checkpoint>

      <failure-action>
        <action>Re-run planning-prd-agent</action>
        <action>Verify skill is available</action>
        <action>Check output directory permissions</action>
      </failure-action>

      <state-complete>▶ COMPLETE</state-complete>
    </phase>

    <phase number="2" name="TASKMASTER TREE BUILD">
      <state-initial>▶ INITIALIZING</state-initial>

      <step order="2.1">
        <name>Initialize TaskMaster</name>
        <required-tool>mcp__task-master-ai__initialize_project</required-tool>
        <parameters>
          <parameter name="projectRoot">{output-dir}</parameter>
          <parameter name="storeTasksInGit">true</parameter>
          <parameter name="initGit">true</parameter>
          <parameter name="yes">true (skip prompts)</parameter>
        </parameters>
        <warning>MUST use MCP tool ONLY — DO NOT use CLI command</warning>
      </step>

      <state-in-progress>▶ IN PROGRESS</state-in-progress>

      <step order="2.2">
        <name>Parse PRD into tasks</name>
        <required-tool>mcp__task-master-ai__parse_prd</required-tool>
        <parameters>
          <parameter name="input">.taskmaster/docs/prd.txt</parameter>
          <parameter name="output">.taskmaster/tasks/tasks.json</parameter>
          <parameter name="numTasks">auto (by PRD complexity)</parameter>
          <parameter name="research">true</parameter>
          <parameter name="force">true (overwrite existing)</parameter>
          <parameter name="projectRoot">{output-dir}</parameter>
        </parameters>
        <warning>MUST use MCP tool ONLY — DO NOT use CLI command</warning>
      </step>

      <state-in-progress>▶ IN PROGRESS</state-in-progress>

      <step order="2.3">
        <name>Expand tasks into subtasks</name>
        <required-tool>mcp__task-master-ai__expand_all</required-tool>
        <parameters>
          <parameter name="research">true</parameter>
          <parameter name="prompt">Format tasks for autopilot mode: each task must be atomic, completable in 1-2 iterations</parameter>
          <parameter name="projectRoot">{output-dir}</parameter>
          <parameter name="force">true (regenerate if exists)</parameter>
        </parameters>
        <output>tasks/tasks.json (task tree with subtasks &amp; deps)</output>
        <warning>MUST use MCP tool ONLY — DO NOT use CLI command</warning>
      </step>

      <checkpoint>
        <condition>tasks/tasks.json exists</condition>
        <condition>Contains at least 1 top-level task</condition>
        <condition>Dependencies are resolved (validate_dependencies passes)</condition>
      </checkpoint>

      <failure-action>
        <action>Run mcp__task-master-ai__validate_dependencies</action>
        <action>Check for circular references</action>
        <action>Verify parse_prd completed successfully</action>
      </failure-action>

      <state-complete>▶ COMPLETE</state-complete>
    </phase>

    <phase number="3" name="IMPLEMENTATION ARTIFACTS GENERATION">
      <state-initial>▶ INITIALIZING</state-initial>

      <step order="3">
        <name>Convert TaskMaster → Implementation format</name>
        <transformation>
          <input>tasks/tasks.json</input>
          <output>specs/*.md</output>
          <mapping>
            <field source="tasks">specs by topic</field>
            <field source="subtasks">JTBD aligned</field>
            <field source="dependencies">acceptance criteria</field>
            <field source="priorities">context requirements</field>
          </mapping>
        </transformation>

        <generated-files mandatory="true">
          <directory>implementation-structures/</directory>
          <file>PROMPT_build.md — BUILDING mode instructions</file>
          <file>PROMPT_plan.md — PLANNING mode instructions</file>
          <file>AGENTS.md — Project operational commands</file>
          <file>IMPLEMENTATION_PLAN.md — Prioritized task list</file>
          <file>loop.sh — Bash loop script</file>
          <directory>specs/ — Requirements specifications</directory>
        </generated-files>

        <output-state>Ready ▶</output-state>
        <note>NO MCP tool available — use custom script logic</note>
      </step>

      <checkpoint>
        <condition>implementation-structures/ directory exists</condition>
        <condition>PROMPT_build.md exists and is not empty</condition>
        <condition>PROMPT_plan.md exists and is not empty</condition>
        <condition>IMPLEMENTATION_PLAN.md exists and is not empty</condition>
        <condition>specs/ directory has at least 1 .md file</condition>
        <condition>loop.sh exists and is marked executable</condition>
      </checkpoint>

      <failure-action>
        <action>Re-run artifact generation</action>
        <action>Check file system permissions</action>
        <action>Verify tasks.json was read correctly</action>
      </failure-action>

      <state-complete>▶ COMPLETE</state-complete>
    </phase>

    <phase number="4" name="AUTOPILOT EXECUTION">
      <state-initial>▶ INITIALIZING</state-initial>

      <step order="4.1">
        <name>Create git branch</name>
        <action-primary>git checkout -b {branch}</action-primary>
        <action-resume>git checkout {branch} (if branch exists)</action-resume>
      </step>

      <state-in-progress>▶ IN PROGRESS</state-in-progress>

      <step order="4.2">
        <name>Start TaskMaster autopilot</name>
        <required-tool>mcp__task-master-ai__autopilot_start</required-tool>
        <parameters>
          <parameter name="taskId">"1" (or specific task ID from tasks.json)</parameter>
          <parameter name="projectRoot">{output-dir}</parameter>
          <parameter name="maxAttempts">3 (retries per subtask)</parameter>
          <parameter name="force">false (resume if exists)</parameter>
        </parameters>

        <autopilot-features>
          <feature>RED phase: Write failing tests</feature>
          <feature>GREEN phase: Implement to pass tests</feature>
          <feature>COMMIT phase: Auto-commit with generated message</feature>
        </autopilot-features>

        <monitoring>
          <tool>mcp__task-master-ai__autopilot_status — check progress</tool>
          <tool>mcp__task-master-ai__autopilot_next — see next action</tool>
          <feature>Auto git commits after each subtask</feature>
        </monitoring>
      </step>

      <checkpoint>
        <condition>Git branch is created/checked out</condition>
        <condition>TaskMaster MCP tools are available</condition>
        <condition>.taskmaster/ directory exists with valid tasks.json</condition>
        <condition>autopilot_start command completed</condition>
      </checkpoint>

      <dry-run-condition>
        <flag>--dry-run</flag>
        <action>SKIP Phase 4 execution</action>
        <report>Artifacts generated successfully (dry-run mode)</report>
      </dry-run-condition>

      <state-complete>▶ COMPLETE</state-complete>
    </phase>
  </workflow-section>

  <tdd-workflow-section>
    <title>TDD Workflow Protection (TaskMaster Autopilot)</title>

    <level-gate number="1" name="TDD Phase Gates">
      <phase>RED phase</phase>
      <description>Write failing tests first</description>
      <requirement>Tests MUST fail initially</requirement>
      <special-condition>If 0 failures: feature already implemented, skip to COMMIT</special-condition>
    </level-gate>

    <level-gate number="2" name="Green Phase Gate">
      <phase>GREEN phase</phase>
      <description>Implement to pass tests</description>
      <requirement>All tests MUST pass</requirement>
      <parameter>maxAttempts controls retry limit (default: 3)</parameter>
    </level-gate>

    <level-gate number="3" name="Auto-Commit">
      <phase>COMMIT phase</phase>
      <description>Auto-commit with generated message</description>
      <requirement>Validates clean working tree</requirement>
      <requirement>Embeds task metadata in commit</requirement>
    </level-gate>

    <level-gate number="4" name="Task Validation">
      <success-conditions>
        <condition>All subtasks completed → SUCCESS</condition>
        <condition>All tests passing → SUCCESS</condition>
        <condition>Working tree clean → SUCCESS</condition>
      </success-conditions>
    </level-gate>
  </tdd-workflow-section>

  <output-structure-section>
    <title>Output Structure</title>
    <directory-structure>
      <root>{output-dir}/</root>
      <directory name=".taskmaster/">
        <directory name="tasks/">
          <file name="tasks.json">TaskMaster task tree</file>
          <directory name="tasks/">Individual task files</directory>
        </directory>
        <directory name="docs/">
          <file name="prd.txt">Generated PRD</file>
        </directory>
      </directory>
      <directory name="implementation-structures/">
        <file name="PROMPT_build.md">Build mode prompt</file>
        <file name="PROMPT_plan.md">Plan mode prompt</file>
        <file name="AGENTS.md">Operational guide</file>
        <file name="IMPLEMENTATION_PLAN.md">Prioritized tasks</file>
        <directory name="specs/">
          <file name="topic-a.md"/>
          <file name="topic-b.md"/>
          <file name="..."/>
        </directory>
      </directory>
      <directory name="src/">Source code (generated by autopilot)</directory>
    </directory-structure>
  </output-structure-section>

  <file-templates-section>
    <title>File Templates</title>

    <template name="PROMPT_build.md">
      <content>
        <![CDATA[
# Autopilot Build Prompt — Full Cycle Generated

## Phase 0: Orientation

0a. Study `specs/*` to learn the application specifications.

0b. Study @IMPLEMENTATION_PLAN.md to understand current priorities.

0c. Source code is in `src/*`.

## Phase 1: Task Execution (TDD Workflow)

1. Your task is to implement functionality per specifications.

2. Follow @IMPLEMENTATION_PLAN.md and choose the **most important** item to address.

3. ▶ CRITICAL: Before making changes, search the codebase — don't assume not implemented.

4. RED phase: Write failing tests first.

5. GREEN phase: Implement to pass tests.

6. COMMIT phase: Auto-commit with generated message.

## Phase 999: Guardrails

99999. Single sources of truth — no duplicate implementations.

9999999. Complete implementation only — placeholders waste time.

999999999. Keep plan current — future iterations depend on accurate state.

99999999999. Clean completed items — remove done tasks from plan periodically.

9999999999999. No circular work — check plan for duplicates before starting.

99999999999999. TDD gates enforce quality — tests block progress by design.
        ]]>
      </content>
    </template>

    <template name="AGENTS.md">
      <content>
        <![CDATA[
# Project Operations Guide

## Build Commands

npm install
npm run build
npm run dev

## Validation

npm test              # Run tests
npm run typecheck     # Type check
npm run lint          # Lint
npm run validate      # All validation

## Project Patterns

<!-- Autopilot adds operational learnings here -->
        ]]>
      </content>
    </template>

    <template name="Autopilot MCP Tools">
      <tools-reference>
        <tool name="autopilot_start">
          <description>Start autopilot for a task</description>
          <syntax>mcp__task-master-ai__autopilot_start: {taskId, projectRoot, maxAttempts}</syntax>
        </tool>
        <tool name="autopilot_status">
          <description>Check autopilot status</description>
          <syntax>mcp__task-master-ai__autopilot_status: {projectRoot}</syntax>
        </tool>
        <tool name="autopilot_next">
          <description>Get next action from autopilot</description>
          <syntax>mcp__task-master-ai__autopilot_next: {projectRoot}</syntax>
        </tool>
        <tool name="autopilot_complete_phase">
          <description>Complete current phase</description>
          <syntax>mcp__task-master-ai__autopilot_complete_phase: {projectRoot, testResults}</syntax>
        </tool>
        <tool name="autopilot_commit">
          <description>Auto-commit</description>
          <syntax>mcp__task-master-ai__autopilot_commit: {projectRoot}</syntax>
        </tool>
      </tools-reference>
    </template>
  </file-templates-section>

  <examples-section>
    <title>Examples</title>

    <example id="short-description" type="usage">
      <title>Example 1: Short Description</title>
      <code-block language="bash">
        <![CDATA[
/full-cycle "Create a task management web application with:
- CRUD operations for tasks
- Drag-and-drop status changes
- Filtering and search
- React + TypeScript + Material-UI"
        ]]>
      </code-block>
    </example>

    <example id="ready-prd" type="usage">
      <title>Example 2: Ready PRD</title>
      <code-block language="bash">
        <![CDATA[
/full-cycle --prd=./my-project/prd.txt --max-attempts=5
        ]]>
      </code-block>
    </example>

    <example id="dry-run" type="usage">
      <title>Example 3: Dry Run</title>
      <code-block language="bash">
        <![CDATA[
/full-cycle "Project idea" --dry-run
        ]]>
      </code-block>
      <description>Generates all artifacts without launching autopilot.</description>
    </example>

    <example id="resume" type="usage">
      <title>Example 4: Resume</title>
      <code-block language="bash">
        <![CDATA[
/full-cycle --resume
        ]]>
      </code-block>
      <description>Continues previously interrupted session.</description>
    </example>
  </examples-section>

  <monitoring-section>
    <title>Monitoring</title>

    <monitoring-commands>
      <command>
        <description>Check autopilot status</description>
        <syntax>mcp__task-master-ai__autopilot_status {projectRoot}</syntax>
      </command>
      <command>
        <description>Get next action</description>
        <syntax>mcp__task-master-ai__autopilot_next {projectRoot}</syntax>
      </command>
      <command>
        <description>View task tree</description>
        <syntax>cat .taskmaster/tasks/tasks.json</syntax>
      </command>
      <command>
        <description>Current plan</description>
        <syntax>cat implementation-structures/IMPLEMENTATION_PLAN.md</syntax>
      </command>
      <command>
        <description>Cancel active autopilot</description>
        <syntax>mcp__task-master-ai__autopilot_abort {projectRoot}</syntax>
      </command>
    </monitoring-commands>
  </monitoring-section>

  <auto-stop-conditions-section>
    <title>Auto-Stop Conditions</title>

    <conditions-table>
      <condition>
        <trigger>--max-attempts reached per subtask</trigger>
        <action>▶ SKIP to next subtask</action>
      </condition>
      <condition>
        <trigger>All tasks completed</trigger>
        <action>▶ SUCCESS</action>
      </condition>
      <condition>
        <trigger>All tests passing</trigger>
        <action>▶ SUCCESS</action>
      </condition>
      <condition>
        <trigger>N consecutive failures</trigger>
        <action>▶ STOP with diagnosis</action>
      </condition>
      <condition>
        <trigger>Plan unchanged &gt; 10 iterations</trigger>
        <action>▶ WARNING + prompt</action>
      </condition>
    </conditions-table>
  </auto-stop-conditions-section>

  <implementation-notes-section priority="CRITICAL">
    <title>Implementation Notes for Agent</title>
    <warning>CRITICAL: Follow this workflow EXACTLY as written. NO SHORTCUTS.</warning>

    <execution-flow>
      <step order="1">▶ Parse arguments — extract input, parameters, flags</step>
      <step order="2">▶ Determine input type — short description vs PRD file</step>
      <step order="3">▶ Phase 1 (PRD): If short description → invoke `planning-prd-agent` skill</step>
      <step order="4">▶ Phase 2 (TaskMaster): Initialize, parse PRD, expand tasks — USE ONLY MCP TOOLS</step>
      <step order="5">▶ Phase 3 (Implementation artifacts): Generate all files from TaskMaster tree</step>
      <step order="6">▶ Phase 4 (Execute): If not --dry-run → launch autopilot_start</step>
      <step order="7">▶ Monitor: Track progress, report status</step>
    </execution-flow>

    <mandatory-tool-usage>
      <tool>mcp__task-master-ai__initialize_project — REQUIRED for TaskMaster init</tool>
      <tool>mcp__task-master-ai__parse_prd — REQUIRED for PRD→tasks conversion</tool>
      <tool>mcp__task-master-ai__expand_all — REQUIRED for subtask generation</tool>
      <tool>mcp__task-master-ai__autopilot_start — REQUIRED for TDD execution</tool>
    </mandatory-tool-usage>

    <user-interaction>
      <rule>Use AskUserQuestion for ambiguous inputs or confirmation before destructive operations.</rule>
    </user-interaction>
  </implementation-notes-section>

  <closing-section>
    <title>END OF SKILL</title>

    <reminders>
      <reminder priority="high">Checkpoints are MANDATORY</reminder>
      <reminder priority="high">Phase order is NON-NEGOTIABLE</reminder>
      <reminder priority="high">Required tools have NO substitutes</reminder>
      <reminder priority="high">Verification failures MUST be addressed</reminder>
    </reminders>

    <failure-protocol>
      <when>IF IN DOUBT:</when>
      <actions>
        <action>▶ STOP</action>
        <action>▶ READ the protocol again</action>
        <action>▶ ASK for clarification</action>
        <action>▶ DO NOT GUESS</action>
      </actions>
    </failure-protocol>
  </closing-section>
</skill-definition>
```

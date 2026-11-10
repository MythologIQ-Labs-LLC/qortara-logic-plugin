# Remediation reporting
Used by Improve and Assure.
1. Require supplied failure events in the Qortara shadow-event format (and, optionally, a supplied plan) to call `qortara_remediation_report`.
2. Report the unresolved groups, recurring patterns, severity, proposed controls and severity spectrum as the tool returns them.
3. No events means not enough evidence. Proposals are not fixes, reviews, closed records, file changes or filed issues.
4. Investigating, fixing and keeping records are done by your own AI host and tools. Never say the hosted tool did them.

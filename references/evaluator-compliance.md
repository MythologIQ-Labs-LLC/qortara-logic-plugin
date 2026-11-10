# Compliance mappings and coverage
Used by Assure.
1. Call `qortara_compliance_controls` for the requested framework references (EU AI Act, NIST AI RMF, SSDF).
2. Only when the user supplies evidence facts, call `qortara_compliance_report` with those facts and the framework.
3. Report mappings, gaps, unsupported evidence and qualifications exactly as returned. The facts are caller-supplied and unverified. The mappings are an alignment aid, not a compliance determination: no certification, legal opinion or audit sign-off follows. You classify your own AI systems and own your compliance.
4. The tools read no repositories and make no regulatory attestation. If a tool refuses, report insufficient evidence, not compliant.

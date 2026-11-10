# Governance applicability and context selection
Used by Orient and Govern.
1. Require the intended operation and the supplied sources, with revisions, precedence and status.
2. Call `qortara_applicability_resolve` with that request. Report the sources it returns as required, advisory, optional, excluded, stale, superseded or ambiguous. Equal-precedence conflicts and missing facts are raised with the user.
3. With a supplied governance packet and the supplied plan files, prior artifacts and candidate paths, call `qortara_context_select` for a bounded read set. The tool reads no files.
4. Neither the selected sources nor a repository URL shows that anyone has access to private source or permission to act. If the tool refuses, report the check as not done.

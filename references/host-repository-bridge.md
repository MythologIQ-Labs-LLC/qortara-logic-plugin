# Working with your own AI host and tools

The five Qortara Logic skills call the same hosted, read-only tools. Those tools accept caller-supplied input only. Access to your files and repositories, and every change to them, belongs to your AI host and its tools, under your permissions.

- Before checking a change, have your host gather the current repository, branch and revision, the affected files, the governing manifest and any review rules, and pass the relevant parts to the tools.
- Tool results are deterministic readings of the supplied input. They are not a code review, proof of where the input came from, permission to write, or deployment approval.
- If you decide to make a change, your host's own tools make it. Work from the expected revision, check the result, and run tests on your own systems.
- Keep plans, review results and other records in your own repository. The tools do not store them and never create or promote records.
- After a restart, gather current inputs again. An earlier result or approval does not carry over.
- Typical order: Orient, then Govern, then Deliver, then Assure, then Improve.

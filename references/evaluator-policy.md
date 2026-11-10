# Deterministic policy evaluation
Used by Govern.
1. Obtain the literal `policies` and one `request` naming principal, action, resource and context. Do not ask for credentials, and do not infer policies from unconfirmed claims about a repository.
2. Call `qortara_policy_evaluate` with the supplied fields. If the tool is unavailable, report the check as not done; never simulate a decision.
3. Default deny; any matching forbid overrides a permit. Explain the returned reasons. Invalid inputs mean the request was not evaluated.
4. All inputs are caller-supplied. An `allow` is a statement about the supplied policy. It does not authorize reading or writing a repository, protected operations, merging or release; those depend on your own host's permissions.

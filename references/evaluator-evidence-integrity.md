# Evidence-chain and gate checks
Used by Assure.
1. Require a supplied event chain without secrets, a supplied gate artifact, or both. Only call `qortara_chain_verify` on events actually supplied, and pass `id_prefix` only when one was provided.
2. Call `qortara_gate_validate` with the actual phase and artifact. Report broken chain links, mismatched digests and schema errors.
3. A consistent chain shows only that the supplied events fit together. It is not proof that the work happened, of where the events came from, or of anyone's approval, and nothing is stored. If a tool returns an error, report the check as not done.

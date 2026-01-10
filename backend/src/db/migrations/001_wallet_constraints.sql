ALTER TABLE wallet_ledger_entries
ADD CONSTRAINT unique_wallet_reward
UNIQUE (wallet_id, source, reference_id);

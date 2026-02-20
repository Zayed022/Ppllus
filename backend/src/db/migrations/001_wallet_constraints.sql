-- Add reward_date column
ALTER TABLE wallet_ledger_entries
ADD COLUMN IF NOT EXISTS reward_date DATE DEFAULT CURRENT_DATE;

-- Drop old unique constraint if exists
DROP INDEX IF EXISTS unique_wallet_reward;

-- Create new daily uniqueness
CREATE UNIQUE INDEX IF NOT EXISTS unique_wallet_reward_daily
ON wallet_ledger_entries(wallet_id, source, reference_id, reward_date);

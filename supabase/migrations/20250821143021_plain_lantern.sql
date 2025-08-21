/*
  # Create transactions table for income and expense tracker

  1. New Tables
    - `transactions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `type` (text, 'income' or 'expense')
      - `amount` (numeric, transaction amount)
      - `category` (text, transaction category)
      - `description` (text, transaction description)
      - `date` (date, transaction date)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `transactions` table
    - Add policy for authenticated users to manage their own transactions
*/

CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN ('income', 'expense')),
  amount numeric NOT NULL CHECK (amount > 0),
  category text NOT NULL,
  description text,
  date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own transactions"
  ON transactions
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS transactions_user_id_idx ON transactions(user_id);
CREATE INDEX IF NOT EXISTS transactions_date_idx ON transactions(date);
CREATE INDEX IF NOT EXISTS transactions_type_idx ON transactions(type);
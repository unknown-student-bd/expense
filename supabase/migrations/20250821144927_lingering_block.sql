/*
  # Create donations and admin system

  1. New Tables
    - `donations`
      - `id` (uuid, primary key)
      - `donor_name` (text)
      - `amount` (numeric)
      - `payment_method` (text - bkash/nagad)
      - `phone_number` (text)
      - `created_at` (timestamp)
    - `admins`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for donations (public read, admin write)
    - Add policies for admins (admin only)
*/

CREATE TABLE IF NOT EXISTS donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_name text NOT NULL,
  amount numeric NOT NULL CHECK (amount > 0),
  payment_method text NOT NULL CHECK (payment_method IN ('bkash', 'nagad')),
  phone_number text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Donations policies
CREATE POLICY "Anyone can view donations"
  ON donations
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage donations"
  ON donations
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE user_id = auth.uid()
    )
  );

-- Admins policies
CREATE POLICY "Admins can view all admins"
  ON admins
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage other admins"
  ON admins
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE user_id = auth.uid()
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS donations_created_at_idx ON donations(created_at DESC);
CREATE INDEX IF NOT EXISTS donations_payment_method_idx ON donations(payment_method);
CREATE INDEX IF NOT EXISTS admins_user_id_idx ON admins(user_id);
/*
  # Create Store Management Tables

  1. New Tables
    - `store_addons`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `price` (integer) - price in cents
      - `category` (text) - 'saas' or 'standalone'
      - `features` (jsonb) - array of features
      - `is_active` (boolean)
      - `is_popular` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `created_by` (uuid, foreign key to auth.users)

    - `store_orders`
      - `id` (uuid, primary key)
      - `order_number` (text, unique)
      - `customer_name` (text)
      - `customer_email` (text)
      - `customer_phone` (text)
      - `institution` (text)
      - `billing_address` (jsonb)
      - `total_amount` (integer) - total in cents
      - `status` (text) - 'pending', 'processing', 'completed', 'cancelled'
      - `payment_method` (text)
      - `payment_status` (text)
      - `notes` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `store_order_items`
      - `id` (uuid, primary key)
      - `order_id` (uuid, foreign key to store_orders)
      - `addon_id` (uuid, foreign key to store_addons)
      - `addon_name` (text) - snapshot of addon name at time of order
      - `quantity` (integer)
      - `unit_price` (integer) - price in cents at time of order
      - `total_price` (integer) - quantity * unit_price
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for different user roles
    - Super admins can manage everything
    - Regular users can view their own orders

  3. Indexes
    - Add indexes for performance on commonly queried fields
*/

-- Create store_addons table
CREATE TABLE IF NOT EXISTS store_addons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  price integer NOT NULL DEFAULT 0, -- price in cents
  category text NOT NULL CHECK (category IN ('saas', 'standalone')),
  features jsonb DEFAULT '[]'::jsonb,
  is_active boolean DEFAULT true,
  is_popular boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Create store_orders table
CREATE TABLE IF NOT EXISTS store_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text,
  institution text NOT NULL,
  billing_address jsonb DEFAULT '{}'::jsonb,
  total_amount integer NOT NULL DEFAULT 0, -- total in cents
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
  payment_method text,
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create store_order_items table
CREATE TABLE IF NOT EXISTS store_order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES store_orders(id) ON DELETE CASCADE,
  addon_id uuid REFERENCES store_addons(id),
  addon_name text NOT NULL, -- snapshot of addon name at time of order
  quantity integer NOT NULL DEFAULT 1,
  unit_price integer NOT NULL DEFAULT 0, -- price in cents at time of order
  total_price integer NOT NULL DEFAULT 0, -- quantity * unit_price
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE store_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_order_items ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_store_addons_category ON store_addons(category);
CREATE INDEX IF NOT EXISTS idx_store_addons_active ON store_addons(is_active);
CREATE INDEX IF NOT EXISTS idx_store_addons_popular ON store_addons(is_popular);
CREATE INDEX IF NOT EXISTS idx_store_orders_status ON store_orders(status);
CREATE INDEX IF NOT EXISTS idx_store_orders_email ON store_orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_store_orders_created_at ON store_orders(created_at);
CREATE INDEX IF NOT EXISTS idx_store_order_items_order_id ON store_order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_store_order_items_addon_id ON store_order_items(addon_id);

-- RLS Policies for store_addons
CREATE POLICY "Anyone can view active addons"
  ON store_addons
  FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Super admins can manage all addons"
  ON store_addons
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM super_admins 
      WHERE super_admins.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM super_admins 
      WHERE super_admins.id = auth.uid()
    )
  );

CREATE POLICY "Authenticated users can view all addons"
  ON store_addons
  FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for store_orders
CREATE POLICY "Users can view their own orders"
  ON store_orders
  FOR SELECT
  TO authenticated
  USING (customer_email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Super admins can manage all orders"
  ON store_orders
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM super_admins 
      WHERE super_admins.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM super_admins 
      WHERE super_admins.id = auth.uid()
    )
  );

CREATE POLICY "Anyone can create orders"
  ON store_orders
  FOR INSERT
  TO public
  WITH CHECK (true);

-- RLS Policies for store_order_items
CREATE POLICY "Users can view their own order items"
  ON store_order_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM store_orders 
      WHERE store_orders.id = order_id 
      AND store_orders.customer_email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );

CREATE POLICY "Super admins can manage all order items"
  ON store_order_items
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM super_admins 
      WHERE super_admins.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM super_admins 
      WHERE super_admins.id = auth.uid()
    )
  );

CREATE POLICY "Anyone can create order items"
  ON store_order_items
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_store_addons_updated_at 
  BEFORE UPDATE ON store_addons 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_store_orders_updated_at 
  BEFORE UPDATE ON store_orders 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample add-ons data
INSERT INTO store_addons (name, description, price, category, features, is_active, is_popular, created_by) VALUES
-- SaaS Add-ons
('QR Code Attendance', 'Advanced attendance tracking using QR codes for quick and accurate recording. Students and staff can check in/out by scanning QR codes.', 399900, 'saas', '["QR code generation for each user", "Mobile app scanning capability", "Real-time attendance updates", "Attendance reports and analytics", "Integration with existing attendance system"]', true, true, (SELECT id FROM super_admins LIMIT 1)),

('Two-Factor Authentication', 'Enhanced security with two-factor authentication for user accounts. Protect sensitive data with an extra layer of security.', 299900, 'saas', '["SMS-based verification", "App-based authentication (Google Authenticator)", "Backup codes for account recovery", "Admin controls for 2FA enforcement", "Security audit logs"]', true, true, (SELECT id FROM super_admins LIMIT 1)),

-- Standalone Add-ons
('Android App', 'Mobile access through dedicated Android application. Native mobile experience for students, teachers, and parents.', 399900, 'standalone', '["Native Android application", "Offline data synchronization", "Push notifications", "Mobile-optimized interface", "App store deployment assistance"]', true, true, (SELECT id FROM super_admins LIMIT 1)),

('Behaviour Records', 'Track and manage student behavior and disciplinary records. Comprehensive behavior management system.', 199900, 'standalone', '["Incident reporting system", "Behavior tracking and analytics", "Parent notification system", "Disciplinary action workflows", "Behavior improvement plans"]', true, false, (SELECT id FROM super_admins LIMIT 1)),

('Biometrics Entry', 'Biometric authentication for secure access control. Fingerprint and facial recognition support.', 199900, 'standalone', '["Fingerprint recognition", "Facial recognition (optional)", "Access control integration", "Attendance via biometrics", "Security audit trails"]', true, false, (SELECT id FROM super_admins LIMIT 1)),

('CBSE Examination', 'Specialized module for CBSE examination management. Compliant with CBSE guidelines and requirements.', 199900, 'standalone', '["CBSE-compliant exam formats", "Grade calculation as per CBSE", "Report card generation", "Continuous assessment tracking", "Board exam preparation tools"]', true, true, (SELECT id FROM super_admins LIMIT 1)),

('Google Meet Live Classes', 'Google Meet integration for virtual learning. Seamless video conferencing for online classes.', 149900, 'standalone', '["Google Meet integration", "Automated meeting creation", "Class scheduling with Meet links", "Recording capabilities", "Attendance tracking for online classes"]', true, true, (SELECT id FROM super_admins LIMIT 1)),

('Multi Branch', 'Manage multiple branches or campuses from a single system. Centralized management with branch-specific controls.', 299900, 'standalone', '["Multiple campus management", "Branch-specific user roles", "Centralized reporting", "Inter-branch data sharing", "Branch performance analytics"]', true, true, (SELECT id FROM super_admins LIMIT 1)),

('Online Course', 'Complete online course management system. Create, manage, and deliver online courses effectively.', 249900, 'standalone', '["Course creation tools", "Video content management", "Student progress tracking", "Assignment and quiz system", "Certificate generation"]', true, false, (SELECT id FROM super_admins LIMIT 1)),

('QR Code Attendance', 'Quick and accurate attendance tracking using QR codes. Mobile-friendly attendance solution.', 199900, 'standalone', '["QR code generation", "Mobile scanning app", "Real-time attendance updates", "Attendance analytics", "Parent notifications"]', true, true, (SELECT id FROM super_admins LIMIT 1)),

('Quick Fees', 'Streamlined fee collection and management system. Simplified fee processing with multiple payment options.', 199900, 'standalone', '["Quick fee collection interface", "Multiple payment gateways", "Fee reminder system", "Receipt generation", "Fee analytics and reporting"]', true, false, (SELECT id FROM super_admins LIMIT 1)),

('Thermal Print', 'Support for thermal printing of receipts and documents. Efficient printing solution for schools.', 199900, 'standalone', '["Thermal printer integration", "Receipt printing", "ID card printing", "Report printing optimization", "Print queue management"]', true, false, (SELECT id FROM super_admins LIMIT 1)),

('Two-Factor Authenticator', 'Enhanced security with two-factor authentication. Protect your school data with advanced security.', 199900, 'standalone', '["SMS verification", "App-based authentication", "Backup codes", "Admin security controls", "Security audit logs"]', true, true, (SELECT id FROM super_admins LIMIT 1)),

('Zoom Live Classes', 'Integrate Zoom for seamless virtual classroom experiences. Professional video conferencing for education.', 199900, 'standalone', '["Zoom integration", "Automated meeting scheduling", "Recording capabilities", "Breakout room support", "Attendance tracking"]', true, true, (SELECT id FROM super_admins LIMIT 1));

-- Insert sample orders
INSERT INTO store_orders (order_number, customer_name, customer_email, customer_phone, institution, total_amount, status, payment_method, payment_status) VALUES
('ORD-2025-001', 'John Smith', 'john@westlakeacademy.com', '+254712345678', 'Westlake Academy', 399900, 'completed', 'M-Pesa', 'paid'),
('ORD-2025-002', 'Sarah Johnson', 'sarah@riverside.edu', '+254723456789', 'Riverside College', 699800, 'processing', 'Credit Card', 'paid'),
('ORD-2025-003', 'Michael Brown', 'michael@globalinstitute.com', '+254734567890', 'Global Institute', 299900, 'pending', 'Bank Transfer', 'pending');

-- Insert sample order items
INSERT INTO store_order_items (order_id, addon_id, addon_name, quantity, unit_price, total_price) VALUES
-- Order 1 items
((SELECT id FROM store_orders WHERE order_number = 'ORD-2025-001'), 
 (SELECT id FROM store_addons WHERE name = 'QR Code Attendance' AND category = 'saas'), 
 'QR Code Attendance', 1, 399900, 399900),

-- Order 2 items
((SELECT id FROM store_orders WHERE order_number = 'ORD-2025-002'), 
 (SELECT id FROM store_addons WHERE name = 'Android App'), 
 'Android App', 1, 399900, 399900),
((SELECT id FROM store_orders WHERE order_number = 'ORD-2025-002'), 
 (SELECT id FROM store_addons WHERE name = 'Multi Branch'), 
 'Multi Branch', 1, 299900, 299900),

-- Order 3 items
((SELECT id FROM store_orders WHERE order_number = 'ORD-2025-003'), 
 (SELECT id FROM store_addons WHERE name = 'Two-Factor Authentication'), 
 'Two-Factor Authentication', 1, 299900, 299900);
/*
  # Update CMS tables for website integration

  1. New Tables
    - Enhanced `cms_pages` table with website page mapping
    - Enhanced `cms_sections` table for page sections
    - Enhanced `cms_content` table for editable content
    - Enhanced `cms_media` table with categories
    - New `cms_pricing_plans` table for pricing management
    - New `cms_addons` table linked to store add-ons

  2. Security
    - Enable RLS on all CMS tables
    - Add policies for super admin access only

  3. Data Structure
    - Page mapping to website routes
    - Section identification for each page
    - Content management with types and keys
    - Media categorization system
    - Pricing plan management
    - Add-on integration with store
*/

-- Update cms_pages table to include website page mapping
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cms_pages' AND column_name = 'page_route'
  ) THEN
    ALTER TABLE cms_pages ADD COLUMN page_route text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cms_pages' AND column_name = 'page_type'
  ) THEN
    ALTER TABLE cms_pages ADD COLUMN page_type text DEFAULT 'static';
  END IF;
END $$;

-- Update cms_sections table for better section management
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cms_sections' AND column_name = 'section_data'
  ) THEN
    ALTER TABLE cms_sections ADD COLUMN section_data jsonb DEFAULT '{}';
  END IF;
END $$;

-- Update cms_content table for better content management
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cms_content' AND column_name = 'content_description'
  ) THEN
    ALTER TABLE cms_content ADD COLUMN content_description text;
  END IF;
END $$;

-- Update cms_media table to include categories
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cms_media' AND column_name = 'category'
  ) THEN
    ALTER TABLE cms_media ADD COLUMN category text DEFAULT 'general';
  END IF;
END $$;

-- Create cms_pricing_plans table
CREATE TABLE IF NOT EXISTS cms_pricing_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_name text NOT NULL,
  plan_description text NOT NULL,
  plan_type text NOT NULL CHECK (plan_type IN ('saas', 'standalone')),
  price_amount integer NOT NULL DEFAULT 0,
  price_period text NOT NULL DEFAULT 'term',
  features jsonb DEFAULT '[]',
  is_highlighted boolean DEFAULT false,
  badge_text text,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  updated_by uuid REFERENCES auth.users(id)
);

ALTER TABLE cms_pricing_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super admins can manage cms_pricing_plans"
  ON cms_pricing_plans
  FOR ALL
  TO authenticated
  USING (uid() IN (SELECT super_admins.id FROM super_admins))
  WITH CHECK (uid() IN (SELECT super_admins.id FROM super_admins));

-- Create cms_addons table linked to store addons
CREATE TABLE IF NOT EXISTS cms_addons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_addon_id uuid REFERENCES store_addons(id),
  addon_name text NOT NULL,
  addon_description text NOT NULL,
  addon_category text NOT NULL CHECK (addon_category IN ('saas', 'standalone')),
  price_amount integer NOT NULL DEFAULT 0,
  features jsonb DEFAULT '[]',
  is_popular boolean DEFAULT false,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id)
);

ALTER TABLE cms_addons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super admins can manage cms_addons"
  ON cms_addons
  FOR ALL
  TO authenticated
  USING (uid() IN (SELECT super_admins.id FROM super_admins))
  WITH CHECK (uid() IN (SELECT super_admins.id FROM super_admins));

-- Create cms_settings table for CMS configuration
CREATE TABLE IF NOT EXISTS cms_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key text UNIQUE NOT NULL,
  setting_value jsonb NOT NULL,
  setting_description text,
  setting_category text DEFAULT 'general',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id)
);

ALTER TABLE cms_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super admins can manage cms_settings"
  ON cms_settings
  FOR ALL
  TO authenticated
  USING (uid() IN (SELECT super_admins.id FROM super_admins))
  WITH CHECK (uid() IN (SELECT super_admins.id FROM super_admins));

-- Add triggers for updated_at
CREATE TRIGGER update_cms_pricing_plans_updated_at
  BEFORE UPDATE ON cms_pricing_plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cms_addons_updated_at
  BEFORE UPDATE ON cms_addons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cms_settings_updated_at
  BEFORE UPDATE ON cms_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert initial website pages
INSERT INTO cms_pages (slug, title, meta_title, meta_description, is_published, page_route, page_type) VALUES
  ('home', 'Home Page', 'Acadeemia - School Management System', 'The #1 Complete School Management Solution', true, '/', 'dynamic'),
  ('versions', 'Versions Page', 'Deployment Options - Acadeemia', 'Choose between SaaS and Standalone deployment options', true, '/versions', 'dynamic'),
  ('features', 'Features Page', 'Features - Acadeemia', 'Powerful features for school management', true, '/features', 'dynamic'),
  ('demo', 'Demo Page', 'Request Demo - Acadeemia', 'Try our interactive demos or request a personalized walkthrough', true, '/demo', 'dynamic'),
  ('pricing', 'Pricing Page', 'Pricing Plans - Acadeemia', 'Simple, transparent pricing for educational institutions', true, '/pricing', 'dynamic'),
  ('store', 'Store Page', 'Add-ons Store - Acadeemia', 'Enhance your system with powerful add-ons', true, '/store', 'dynamic'),
  ('about', 'About Page', 'About Us - Acadeemia', 'Learn about our mission and vision', true, '/about', 'static'),
  ('contact', 'Contact Page', 'Contact Us - Acadeemia', 'Get in touch with our team', true, '/contact', 'dynamic'),
  ('support', 'Support Page', 'Support Center - Acadeemia', 'Get help and support for Acadeemia', true, '/support', 'dynamic'),
  ('terms', 'Terms of Service', 'Terms of Service - Acadeemia', 'Terms and conditions for using Acadeemia', true, '/terms', 'static'),
  ('privacy', 'Privacy Policy', 'Privacy Policy - Acadeemia', 'How we protect your privacy', true, '/privacy', 'static'),
  ('faq', 'FAQ Page', 'Frequently Asked Questions - Acadeemia', 'Common questions about Acadeemia', true, '/faq', 'static')
ON CONFLICT (slug) DO NOTHING;

-- Insert initial sections for key pages
INSERT INTO cms_sections (page_id, name, slug, display_order, section_type, section_data) VALUES
  ((SELECT id FROM cms_pages WHERE slug = 'home'), 'Hero Section', 'hero', 1, 'hero', '{"title": "The #1 Complete School Management Solution", "subtitle": "Streamline administration, enhance learning experiences, and empower educational institutions with Acadeemia."}'),
  ((SELECT id FROM cms_pages WHERE slug = 'home'), 'Deployment Options', 'deployment-options', 2, 'features', '{"title": "Choose Your Ideal Deployment", "subtitle": "Whether you prefer a cloud-based solution or self-hosted system, we have got you covered."}'),
  ((SELECT id FROM cms_pages WHERE slug = 'home'), 'Key Features', 'key-features', 3, 'features', '{"title": "Empower Your Educational Institution", "subtitle": "Designed with educators in mind, our comprehensive features streamline administration."}'),
  ((SELECT id FROM cms_pages WHERE slug = 'home'), 'Testimonials', 'testimonials', 4, 'testimonials', '{"title": "Trusted by Educational Institutions", "subtitle": "Join hundreds of schools and colleges worldwide who trust Acadeemia."}'),
  ((SELECT id FROM cms_pages WHERE slug = 'home'), 'CTA Section', 'cta', 5, 'cta', '{"title": "Ready to Transform Your Institution?", "subtitle": "Start your journey with Acadeemia today and experience the difference."}'),
  ((SELECT id FROM cms_pages WHERE slug = 'pricing'), 'Pricing Hero', 'pricing-hero', 1, 'hero', '{"title": "Simple, Transparent Pricing", "subtitle": "Choose the plan that is right for your educational institution."}'),
  ((SELECT id FROM cms_pages WHERE slug = 'pricing'), 'SaaS Plans', 'saas-plans', 2, 'pricing', '{"title": "SaaS Version", "subtitle": "Cloud-based solution with subscription pricing"}'),
  ((SELECT id FROM cms_pages WHERE slug = 'pricing'), 'Standalone Plans', 'standalone-plans', 3, 'pricing', '{"title": "Standalone Version", "subtitle": "Self-hosted solution with yearly licensing"}')
ON CONFLICT (page_id, slug) DO NOTHING;

-- Insert initial content items
INSERT INTO cms_content (section_id, content_key, content_type, content_value, content_description) VALUES
  ((SELECT id FROM cms_sections WHERE slug = 'hero'), 'main_title', 'heading', '"The #1 Complete School Management Solution"', 'Main hero title'),
  ((SELECT id FROM cms_sections WHERE slug = 'hero'), 'subtitle', 'paragraph', '"Streamline administration, enhance learning experiences, and empower educational institutions with Acadeemia."', 'Hero subtitle text'),
  ((SELECT id FROM cms_sections WHERE slug = 'hero'), 'cta_primary', 'text', '"Request Demo"', 'Primary CTA button text'),
  ((SELECT id FROM cms_sections WHERE slug = 'hero'), 'cta_secondary', 'text', '"Explore Features"', 'Secondary CTA button text')
ON CONFLICT (section_id, content_key) DO NOTHING;

-- Insert initial media categories
UPDATE cms_media SET category = 'logos' WHERE filename LIKE '%logo%';
UPDATE cms_media SET category = 'frontend' WHERE filename LIKE '%hero%' OR filename LIKE '%banner%';
UPDATE cms_media SET category = 'icons' WHERE filename LIKE '%icon%' OR filename LIKE '%favicon%';

-- Insert initial pricing plans
INSERT INTO cms_pricing_plans (plan_name, plan_description, plan_type, price_amount, price_period, features, is_highlighted, badge_text, display_order) VALUES
  ('Starter', 'Perfect for small schools just getting started.', 'saas', 20000, 'term', '["1 - 200 students", "Unlimited users", "FrontDesk feature", "Student management", "Fees management", "Bulk SMS integration", "24/7 access", "Fulltime support"]', false, '', 1),
  ('Bronze', 'Ideal for growing schools with expanded needs.', 'saas', 30000, 'term', '["201 - 400 students", "Unlimited users", "FrontDesk feature", "Student management", "Fees management", "Bulk SMS integration", "24/7 access", "Fulltime support"]', false, '', 2),
  ('Silver', 'Complete solution for medium-sized institutions.', 'saas', 40000, 'term', '["401 - 700 students", "Unlimited users", "FrontDesk feature", "Student management", "Fees management", "Bulk SMS integration", "Up to 2 campuses", "24/7 access", "Fulltime support"]', true, 'Most Popular', 3),
  ('Gold', 'Premium solution for large educational institutions.', 'saas', 60000, 'term', '["701 - 1500 students", "Unlimited users", "FrontDesk feature", "Student management", "Fees management", "Bulk SMS integration", "24/7 access", "Fulltime support"]', false, '', 4),
  ('Basic', 'Entry-level self-hosted solution for smaller institutions.', 'standalone', 49999, 'yearly', '["Yearly license fee", "Up to 500 students", "Core modules", "Initial deployment", "Basic configuration", "Life-time of updates"]', false, '', 1),
  ('Advanced', 'Comprehensive self-hosted solution with extended support.', 'standalone', 79999, 'yearly', '["Yearly license fee", "Unlimited students", "All core modules", "Professional deployment", "Advanced configuration", "Life-time of updates", "Basic customization", "12 months of support"]', true, 'Recommended', 2),
  ('Premium', 'Complete enterprise solution with unlimited options.', 'standalone', 129999, 'yearly', '["Yearly license fee", "Unlimited students", "All core & premium modules", "White-glove deployment", "Custom configuration", "Life-time of updates", "Extensive customization", "24 months of premium support", "12 months hosting included"]', false, '', 3)
ON CONFLICT DO NOTHING;

-- Insert CMS add-ons from store add-ons
INSERT INTO cms_addons (addon_name, addon_description, addon_category, price_amount, features, is_popular, display_order) VALUES
  ('QR Code Attendance', 'Advanced attendance tracking using QR codes for quick and accurate recording.', 'saas', 3999, '["QR code generation for each user", "Mobile app scanning capability", "Real-time attendance updates", "Attendance reports and analytics", "Integration with existing attendance system"]', true, 1),
  ('Two-Factor Authentication', 'Enhanced security with two-factor authentication for user accounts.', 'saas', 2999, '["SMS-based verification", "App-based authentication (Google Authenticator)", "Backup codes for account recovery", "Admin controls for 2FA enforcement", "Security audit logs"]', true, 2),
  ('Android App', 'Mobile access through dedicated Android application.', 'standalone', 3999, '["Native Android application", "Offline data synchronization", "Push notifications", "Mobile-optimized interface", "App store deployment assistance"]', true, 1),
  ('Behaviour Records', 'Track and manage student behavior and disciplinary records.', 'standalone', 1999, '["Incident reporting system", "Behavior tracking and analytics", "Parent notification system", "Disciplinary action workflows", "Behavior improvement plans"]', false, 2),
  ('Biometrics Entry', 'Biometric authentication for secure access control.', 'standalone', 1999, '["Fingerprint recognition", "Facial recognition (optional)", "Access control integration", "Attendance via biometrics", "Security audit trails"]', false, 3),
  ('CBSE Examination', 'Specialized module for CBSE examination management.', 'standalone', 1999, '["CBSE-compliant exam formats", "Grade calculation as per CBSE", "Report card generation", "Continuous assessment tracking", "Board exam preparation tools"]', true, 4),
  ('Google Meet Live Classes', 'Google Meet integration for virtual learning.', 'standalone', 1499, '["Google Meet integration", "Automated meeting creation", "Class scheduling with Meet links", "Recording capabilities", "Attendance tracking for online classes"]', true, 5),
  ('Multi Branch', 'Manage multiple branches or campuses from a single system.', 'standalone', 2999, '["Multiple campus management", "Branch-specific user roles", "Centralized reporting", "Inter-branch data sharing", "Branch performance analytics"]', true, 6),
  ('Online Course', 'Complete online course management system.', 'standalone', 2499, '["Course creation tools", "Video content management", "Student progress tracking", "Assignment and quiz system", "Certificate generation"]', false, 7),
  ('QR Code Attendance', 'Quick and accurate attendance tracking using QR codes.', 'standalone', 1999, '["QR code generation", "Mobile scanning app", "Real-time attendance updates", "Attendance analytics", "Parent notifications"]', true, 8),
  ('Quick Fees', 'Streamlined fee collection and management system.', 'standalone', 1999, '["Quick fee collection interface", "Multiple payment gateways", "Fee reminder system", "Receipt generation", "Fee analytics and reporting"]', false, 9),
  ('Thermal Print', 'Support for thermal printing of receipts and documents.', 'standalone', 1999, '["Thermal printer integration", "Receipt printing", "ID card printing", "Report printing optimization", "Print queue management"]', false, 10),
  ('Two-Factor Authenticator', 'Enhanced security with two-factor authentication.', 'standalone', 1999, '["SMS verification", "App-based authentication", "Backup codes", "Admin security controls", "Security audit logs"]', true, 11),
  ('Zoom Live Classes', 'Integrate Zoom for seamless virtual classroom experiences.', 'standalone', 1999, '["Zoom integration", "Automated meeting scheduling", "Recording capabilities", "Breakout room support", "Attendance tracking"]', true, 12)
ON CONFLICT DO NOTHING;

-- Insert initial CMS settings
INSERT INTO cms_settings (setting_key, setting_value, setting_description, setting_category) VALUES
  ('site_title', '"Acadeemia School Management System"', 'Main website title', 'general'),
  ('site_description', '"The #1 Complete School Management Solution"', 'Website meta description', 'general'),
  ('contact_email', '"info@acadeemia.com"', 'Primary contact email', 'contact'),
  ('contact_phone', '"+254 111 313 818"', 'Primary contact phone', 'contact'),
  ('contact_address', '"90 JGO James Gichuru Road, Nairobi City, 00100, Kenya"', 'Business address', 'contact'),
  ('social_twitter', '"https://x.com/ACADEEMIA134163"', 'Twitter/X profile URL', 'social'),
  ('social_facebook', '"https://www.facebook.com/profile.php?id=61556455472009"', 'Facebook profile URL', 'social'),
  ('social_instagram', '"https://www.instagram.com/acadeemia_sms/"', 'Instagram profile URL', 'social'),
  ('social_linkedin', '"https://www.linkedin.com/company/acadeemia/"', 'LinkedIn profile URL', 'social'),
  ('social_youtube', '"https://www.youtube.com/channel/UCogUoc9Y4HgSdBVo24FrQWw"', 'YouTube channel URL', 'social'),
  ('theme_primary_color', '"#697BBC"', 'Primary brand color', 'theme'),
  ('theme_secondary_color', '"#14b8a6"', 'Secondary brand color', 'theme'),
  ('analytics_enabled', 'true', 'Enable website analytics', 'analytics'),
  ('chat_enabled', 'true', 'Enable live chat widget', 'features'),
  ('pwa_enabled', 'true', 'Enable PWA features', 'features')
ON CONFLICT (setting_key) DO NOTHING;
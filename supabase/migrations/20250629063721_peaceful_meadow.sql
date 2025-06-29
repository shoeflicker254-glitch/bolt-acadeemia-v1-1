/*
  # CMS System Migration

  1. New Tables
    - `cms_pages` - Manages website pages
    - `cms_sections` - Manages sections within pages  
    - `cms_content` - Individual content items within sections
    - `cms_media` - Media file management
    - `cms_versions` - Version history for content
    - `cms_drafts` - Draft content management

  2. Security
    - Enable RLS on all CMS tables
    - Add policies for super admin access only

  3. Storage
    - Create storage bucket for CMS media files
*/

-- Create storage bucket for CMS media
INSERT INTO storage.buckets (id, name, public) 
VALUES ('cms-media', 'cms-media', true)
ON CONFLICT (id) DO NOTHING;

-- Create CMS Pages table
CREATE TABLE IF NOT EXISTS cms_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  meta_title text,
  meta_description text,
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  updated_by uuid REFERENCES auth.users(id)
);

-- Create CMS Sections table
CREATE TABLE IF NOT EXISTS cms_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id uuid REFERENCES cms_pages(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text NOT NULL,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  section_type text DEFAULT 'content',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(page_id, slug)
);

-- Create CMS Content table
CREATE TABLE IF NOT EXISTS cms_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id uuid REFERENCES cms_sections(id) ON DELETE CASCADE,
  content_key text NOT NULL,
  content_type text NOT NULL CHECK (content_type IN ('text', 'heading', 'paragraph', 'image', 'list', 'json')),
  content_value jsonb,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(section_id, content_key)
);

-- Create CMS Media table
CREATE TABLE IF NOT EXISTS cms_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename text NOT NULL,
  original_filename text NOT NULL,
  file_path text NOT NULL,
  file_size bigint,
  mime_type text,
  alt_text text,
  caption text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  uploaded_by uuid REFERENCES auth.users(id)
);

-- Create CMS Versions table for history
CREATE TABLE IF NOT EXISTS cms_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid REFERENCES cms_content(id) ON DELETE CASCADE,
  version_number integer NOT NULL,
  content_value jsonb,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Create CMS Drafts table
CREATE TABLE IF NOT EXISTS cms_drafts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid REFERENCES cms_content(id) ON DELETE CASCADE,
  draft_content jsonb,
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Enable RLS on all CMS tables
ALTER TABLE cms_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_drafts ENABLE ROW LEVEL SECURITY;

-- Create policies for super admin access only
CREATE POLICY "Super admins can manage cms_pages"
  ON cms_pages
  FOR ALL
  TO authenticated
  USING (auth.uid() IN (SELECT id FROM super_admins))
  WITH CHECK (auth.uid() IN (SELECT id FROM super_admins));

CREATE POLICY "Super admins can manage cms_sections"
  ON cms_sections
  FOR ALL
  TO authenticated
  USING (auth.uid() IN (SELECT id FROM super_admins))
  WITH CHECK (auth.uid() IN (SELECT id FROM super_admins));

CREATE POLICY "Super admins can manage cms_content"
  ON cms_content
  FOR ALL
  TO authenticated
  USING (auth.uid() IN (SELECT id FROM super_admins))
  WITH CHECK (auth.uid() IN (SELECT id FROM super_admins));

CREATE POLICY "Super admins can manage cms_media"
  ON cms_media
  FOR ALL
  TO authenticated
  USING (auth.uid() IN (SELECT id FROM super_admins))
  WITH CHECK (auth.uid() IN (SELECT id FROM super_admins));

CREATE POLICY "Super admins can manage cms_versions"
  ON cms_versions
  FOR ALL
  TO authenticated
  USING (auth.uid() IN (SELECT id FROM super_admins))
  WITH CHECK (auth.uid() IN (SELECT id FROM super_admins));

CREATE POLICY "Super admins can manage cms_drafts"
  ON cms_drafts
  FOR ALL
  TO authenticated
  USING (auth.uid() IN (SELECT id FROM super_admins))
  WITH CHECK (auth.uid() IN (SELECT id FROM super_admins));

-- Create storage policy for CMS media
CREATE POLICY "Super admins can upload CMS media"
  ON storage.objects
  FOR ALL
  TO authenticated
  USING (bucket_id = 'cms-media' AND auth.uid() IN (SELECT id FROM super_admins))
  WITH CHECK (bucket_id = 'cms-media' AND auth.uid() IN (SELECT id FROM super_admins));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cms_sections_page_id ON cms_sections(page_id);
CREATE INDEX IF NOT EXISTS idx_cms_content_section_id ON cms_content(section_id);
CREATE INDEX IF NOT EXISTS idx_cms_versions_content_id ON cms_versions(content_id);
CREATE INDEX IF NOT EXISTS idx_cms_drafts_content_id ON cms_drafts(content_id);

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_cms_pages_updated_at BEFORE UPDATE ON cms_pages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cms_sections_updated_at BEFORE UPDATE ON cms_sections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cms_content_updated_at BEFORE UPDATE ON cms_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cms_drafts_updated_at BEFORE UPDATE ON cms_drafts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default pages
INSERT INTO cms_pages (slug, title, meta_title, meta_description, is_published) VALUES
('home', 'Home Page', 'Acadeemia - School Management System', 'The #1 Complete School Management Solution', true),
('about', 'About Page', 'About Acadeemia', 'Learn about Acadeemia and our mission', true),
('features', 'Features Page', 'Features - Acadeemia', 'Discover powerful features of Acadeemia', true),
('pricing', 'Pricing Page', 'Pricing - Acadeemia', 'Simple, transparent pricing for schools', true),
('versions', 'Versions Page', 'Deployment Options - Acadeemia', 'Choose between SaaS and Standalone versions', true),
('contact', 'Contact Page', 'Contact Us - Acadeemia', 'Get in touch with our team', true)
ON CONFLICT (slug) DO NOTHING;
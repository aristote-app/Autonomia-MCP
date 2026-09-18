export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      analyses: {
        Row: {
          analysis_type: string
          confidence: number | null
          created_at: string
          id: string
          input_hash: string | null
          model_name: string | null
          model_provider: string | null
          model_version: string | null
          opportunity_id: string | null
          organization_id: string | null
          payload: Json
        }
        Insert: {
          analysis_type: string
          confidence?: number | null
          created_at?: string
          id?: string
          input_hash?: string | null
          model_name?: string | null
          model_provider?: string | null
          model_version?: string | null
          opportunity_id?: string | null
          organization_id?: string | null
          payload: Json
        }
        Update: {
          analysis_type?: string
          confidence?: number | null
          created_at?: string
          id?: string
          input_hash?: string | null
          model_name?: string | null
          model_provider?: string | null
          model_version?: string | null
          opportunity_id?: string | null
          organization_id?: string | null
          payload?: Json
        }
        Relationships: [
          {
            foreignKeyName: "analyses_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analyses_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      autonomia_config: {
        Row: {
          config_key: string
          config_value: Json | null
          description: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          config_key: string
          config_value?: Json | null
          description?: string | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          config_key?: string
          config_value?: Json | null
          description?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      collector_runs: {
        Row: {
          completed_at: string | null
          error_message: string | null
          id: string
          query_payload: Json
          source_id: string | null
          started_at: string
          stats: Json
          status: string
          trigger_mode: string
        }
        Insert: {
          completed_at?: string | null
          error_message?: string | null
          id?: string
          query_payload?: Json
          source_id?: string | null
          started_at?: string
          stats?: Json
          status: string
          trigger_mode?: string
        }
        Update: {
          completed_at?: string | null
          error_message?: string | null
          id?: string
          query_payload?: Json
          source_id?: string | null
          started_at?: string
          stats?: Json
          status?: string
          trigger_mode?: string
        }
        Relationships: [
          {
            foreignKeyName: "collector_runs_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "sources"
            referencedColumns: ["id"]
          },
        ]
      }
      consultant_skills: {
        Row: {
          consultant_id: string
          evidence: string | null
          proficiency: number | null
          skill_id: string
          updated_at: string
          years_experience: number | null
        }
        Insert: {
          consultant_id: string
          evidence?: string | null
          proficiency?: number | null
          skill_id: string
          updated_at?: string
          years_experience?: number | null
        }
        Update: {
          consultant_id?: string
          evidence?: string | null
          proficiency?: number | null
          skill_id?: string
          updated_at?: string
          years_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "consultant_skills_consultant_id_fkey"
            columns: ["consultant_id"]
            isOneToOne: false
            referencedRelation: "consultants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consultant_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      consultants: {
        Row: {
          available_from: string | null
          created_at: string
          currency: string | null
          display_name: string
          external_ref: string | null
          id: string
          locations: string[]
          metadata: Json
          notes: string | null
          remote: boolean
          status: string
          tjm: number | null
          updated_at: string
          years_experience: number | null
        }
        Insert: {
          available_from?: string | null
          created_at?: string
          currency?: string | null
          display_name: string
          external_ref?: string | null
          id?: string
          locations?: string[]
          metadata?: Json
          notes?: string | null
          remote?: boolean
          status?: string
          tjm?: number | null
          updated_at?: string
          years_experience?: number | null
        }
        Update: {
          available_from?: string | null
          created_at?: string
          currency?: string | null
          display_name?: string
          external_ref?: string | null
          id?: string
          locations?: string[]
          metadata?: Json
          notes?: string | null
          remote?: boolean
          status?: string
          tjm?: number | null
          updated_at?: string
          years_experience?: number | null
        }
        Relationships: []
      }
      duplicate_tracking: {
        Row: {
          canonical_mission_id: string | null
          detected_at: string | null
          duplicate_mission_id: string | null
          id: string
          similarity_score: number | null
        }
        Insert: {
          canonical_mission_id?: string | null
          detected_at?: string | null
          duplicate_mission_id?: string | null
          id?: string
          similarity_score?: number | null
        }
        Update: {
          canonical_mission_id?: string | null
          detected_at?: string | null
          duplicate_mission_id?: string | null
          id?: string
          similarity_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "duplicate_tracking_canonical_mission_id_fkey"
            columns: ["canonical_mission_id"]
            isOneToOne: false
            referencedRelation: "missions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "duplicate_tracking_canonical_mission_id_fkey"
            columns: ["canonical_mission_id"]
            isOneToOne: false
            referencedRelation: "missions_qualified"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "duplicate_tracking_duplicate_mission_id_fkey"
            columns: ["duplicate_mission_id"]
            isOneToOne: false
            referencedRelation: "missions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "duplicate_tracking_duplicate_mission_id_fkey"
            columns: ["duplicate_mission_id"]
            isOneToOne: false
            referencedRelation: "missions_qualified"
            referencedColumns: ["id"]
          },
        ]
      }
      kaspr_syncs: {
        Row: {
          contacts_found: number | null
          created_at: string | null
          emails_extracted: number | null
          id: string
          is_active: boolean | null
          kaspr_query: string | null
          last_sync: string | null
          phones_extracted: number | null
          sync_frequency: string | null
        }
        Insert: {
          contacts_found?: number | null
          created_at?: string | null
          emails_extracted?: number | null
          id?: string
          is_active?: boolean | null
          kaspr_query?: string | null
          last_sync?: string | null
          phones_extracted?: number | null
          sync_frequency?: string | null
        }
        Update: {
          contacts_found?: number | null
          created_at?: string | null
          emails_extracted?: number | null
          id?: string
          is_active?: boolean | null
          kaspr_query?: string | null
          last_sync?: string | null
          phones_extracted?: number | null
          sync_frequency?: string | null
        }
        Relationships: []
      }
      market_analytics: {
        Row: {
          avg_budget: number | null
          avg_tender_budget: number | null
          avg_tjm: number | null
          avg_training_price: number | null
          budget_distribution: Json | null
          budget_growth_percent: number | null
          created_at: string | null
          emerging_skills: Json | null
          id: string
          missions_by_category: Json | null
          missions_by_source: Json | null
          missions_growth_percent: number | null
          missions_new: number | null
          missions_total: number | null
          period_date: string | null
          period_type: string | null
          tenders_by_buyer_type: Json | null
          tenders_total: number | null
          top_skills: Json | null
          trainings_by_platform: Json | null
          trainings_total: number | null
        }
        Insert: {
          avg_budget?: number | null
          avg_tender_budget?: number | null
          avg_tjm?: number | null
          avg_training_price?: number | null
          budget_distribution?: Json | null
          budget_growth_percent?: number | null
          created_at?: string | null
          emerging_skills?: Json | null
          id?: string
          missions_by_category?: Json | null
          missions_by_source?: Json | null
          missions_growth_percent?: number | null
          missions_new?: number | null
          missions_total?: number | null
          period_date?: string | null
          period_type?: string | null
          tenders_by_buyer_type?: Json | null
          tenders_total?: number | null
          top_skills?: Json | null
          trainings_by_platform?: Json | null
          trainings_total?: number | null
        }
        Update: {
          avg_budget?: number | null
          avg_tender_budget?: number | null
          avg_tjm?: number | null
          avg_training_price?: number | null
          budget_distribution?: Json | null
          budget_growth_percent?: number | null
          created_at?: string | null
          emerging_skills?: Json | null
          id?: string
          missions_by_category?: Json | null
          missions_by_source?: Json | null
          missions_growth_percent?: number | null
          missions_new?: number | null
          missions_total?: number | null
          period_date?: string | null
          period_type?: string | null
          tenders_by_buyer_type?: Json | null
          tenders_total?: number | null
          top_skills?: Json | null
          trainings_by_platform?: Json | null
          trainings_total?: number | null
        }
        Relationships: []
      }
      market_signals: {
        Row: {
          confidence: number | null
          created_at: string
          dedupe_key: string | null
          description: string | null
          evidence_kind: string
          id: string
          occurred_at: string | null
          organization_id: string | null
          signal_payload: Json
          signal_type: string
          source_raw_item_id: string | null
          source_record_id: string | null
          source_url: string | null
          title: string
        }
        Insert: {
          confidence?: number | null
          created_at?: string
          dedupe_key?: string | null
          description?: string | null
          evidence_kind?: string
          id?: string
          occurred_at?: string | null
          organization_id?: string | null
          signal_payload?: Json
          signal_type: string
          source_raw_item_id?: string | null
          source_record_id?: string | null
          source_url?: string | null
          title: string
        }
        Update: {
          confidence?: number | null
          created_at?: string
          dedupe_key?: string | null
          description?: string | null
          evidence_kind?: string
          id?: string
          occurred_at?: string | null
          organization_id?: string | null
          signal_payload?: Json
          signal_type?: string
          source_raw_item_id?: string | null
          source_record_id?: string | null
          source_url?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "market_signals_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "market_signals_source_raw_item_id_fkey"
            columns: ["source_raw_item_id"]
            isOneToOne: false
            referencedRelation: "raw_items"
            referencedColumns: ["id"]
          },
        ]
      }
      missions: {
        Row: {
          autonomia_score: number | null
          budget_max: number | null
          budget_min: number | null
          category: string | null
          client_industry: string | null
          client_name: string | null
          client_size: string | null
          currency: string | null
          deadline: string | null
          description: string | null
          duration_days: number | null
          experience_level: string | null
          external_id: string | null
          hourly_rate: number | null
          id: string
          internal_notes: string | null
          is_active: boolean | null
          is_qualified: boolean | null
          is_remote: boolean | null
          job_description_url: string | null
          last_scraped: string | null
          location: string | null
          match_percentage: number | null
          posted_date: string | null
          recruiter_company: string | null
          recruiter_email: string | null
          recruiter_linkedin_profile: string | null
          recruiter_name: string | null
          recruiter_phone: string | null
          skills: string[] | null
          source: string
          source_url: string | null
          start_date: string | null
          subcategory: string | null
          tags: string[] | null
          title: string
          tjm: number | null
          updated_date: string | null
        }
        Insert: {
          autonomia_score?: number | null
          budget_max?: number | null
          budget_min?: number | null
          category?: string | null
          client_industry?: string | null
          client_name?: string | null
          client_size?: string | null
          currency?: string | null
          deadline?: string | null
          description?: string | null
          duration_days?: number | null
          experience_level?: string | null
          external_id?: string | null
          hourly_rate?: number | null
          id?: string
          internal_notes?: string | null
          is_active?: boolean | null
          is_qualified?: boolean | null
          is_remote?: boolean | null
          job_description_url?: string | null
          last_scraped?: string | null
          location?: string | null
          match_percentage?: number | null
          posted_date?: string | null
          recruiter_company?: string | null
          recruiter_email?: string | null
          recruiter_linkedin_profile?: string | null
          recruiter_name?: string | null
          recruiter_phone?: string | null
          skills?: string[] | null
          source: string
          source_url?: string | null
          start_date?: string | null
          subcategory?: string | null
          tags?: string[] | null
          title: string
          tjm?: number | null
          updated_date?: string | null
        }
        Update: {
          autonomia_score?: number | null
          budget_max?: number | null
          budget_min?: number | null
          category?: string | null
          client_industry?: string | null
          client_name?: string | null
          client_size?: string | null
          currency?: string | null
          deadline?: string | null
          description?: string | null
          duration_days?: number | null
          experience_level?: string | null
          external_id?: string | null
          hourly_rate?: number | null
          id?: string
          internal_notes?: string | null
          is_active?: boolean | null
          is_qualified?: boolean | null
          is_remote?: boolean | null
          job_description_url?: string | null
          last_scraped?: string | null
          location?: string | null
          match_percentage?: number | null
          posted_date?: string | null
          recruiter_company?: string | null
          recruiter_email?: string | null
          recruiter_linkedin_profile?: string | null
          recruiter_name?: string | null
          recruiter_phone?: string | null
          skills?: string[] | null
          source?: string
          source_url?: string | null
          start_date?: string | null
          subcategory?: string | null
          tags?: string[] | null
          title?: string
          tjm?: number | null
          updated_date?: string | null
        }
        Relationships: []
      }
      notification_log: {
        Row: {
          content: string | null
          id: string
          mission_id: string | null
          notification_type: string | null
          read_at: string | null
          sent_at: string | null
          subject: string | null
          team_member_id: string | null
          tender_id: string | null
        }
        Insert: {
          content?: string | null
          id?: string
          mission_id?: string | null
          notification_type?: string | null
          read_at?: string | null
          sent_at?: string | null
          subject?: string | null
          team_member_id?: string | null
          tender_id?: string | null
        }
        Update: {
          content?: string | null
          id?: string
          mission_id?: string | null
          notification_type?: string | null
          read_at?: string | null
          sent_at?: string | null
          subject?: string | null
          team_member_id?: string | null
          tender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_log_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "missions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_log_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "missions_qualified"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_log_team_member_id_fkey"
            columns: ["team_member_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_log_tender_id_fkey"
            columns: ["tender_id"]
            isOneToOne: false
            referencedRelation: "public_tenders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_log_tender_id_fkey"
            columns: ["tender_id"]
            isOneToOne: false
            referencedRelation: "tenders_urgent"
            referencedColumns: ["id"]
          },
        ]
      }
      opportunities: {
        Row: {
          budget_max: number | null
          budget_min: number | null
          buyer_org_id: string | null
          company_org_id: string | null
          contract_type: string | null
          created_at: string
          currency: string | null
          deadline_at: string | null
          dedupe_key: string | null
          description: string | null
          first_seen_at: string
          id: string
          last_seen_at: string
          location: string | null
          opportunity_type: string
          procedure: string | null
          published_at: string | null
          remote_mode: string | null
          status: string
          title: string
          tjm_max: number | null
          tjm_min: number | null
          updated_at: string
        }
        Insert: {
          budget_max?: number | null
          budget_min?: number | null
          buyer_org_id?: string | null
          company_org_id?: string | null
          contract_type?: string | null
          created_at?: string
          currency?: string | null
          deadline_at?: string | null
          dedupe_key?: string | null
          description?: string | null
          first_seen_at?: string
          id?: string
          last_seen_at?: string
          location?: string | null
          opportunity_type: string
          procedure?: string | null
          published_at?: string | null
          remote_mode?: string | null
          status?: string
          title: string
          tjm_max?: number | null
          tjm_min?: number | null
          updated_at?: string
        }
        Update: {
          budget_max?: number | null
          budget_min?: number | null
          buyer_org_id?: string | null
          company_org_id?: string | null
          contract_type?: string | null
          created_at?: string
          currency?: string | null
          deadline_at?: string | null
          dedupe_key?: string | null
          description?: string | null
          first_seen_at?: string
          id?: string
          last_seen_at?: string
          location?: string | null
          opportunity_type?: string
          procedure?: string | null
          published_at?: string | null
          remote_mode?: string | null
          status?: string
          title?: string
          tjm_max?: number | null
          tjm_min?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "opportunities_buyer_org_id_fkey"
            columns: ["buyer_org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunities_company_org_id_fkey"
            columns: ["company_org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      opportunity_embeddings: {
        Row: {
          created_at: string
          dimensions: number | null
          embedding: string | null
          model: string
          opportunity_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          dimensions?: number | null
          embedding?: string | null
          model: string
          opportunity_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          dimensions?: number | null
          embedding?: string | null
          model?: string
          opportunity_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "opportunity_embeddings_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: true
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      opportunity_skills: {
        Row: {
          confidence: number | null
          evidence_type: string
          opportunity_id: string
          skill_id: string
          source_raw_item_id: string | null
        }
        Insert: {
          confidence?: number | null
          evidence_type: string
          opportunity_id: string
          skill_id: string
          source_raw_item_id?: string | null
        }
        Update: {
          confidence?: number | null
          evidence_type?: string
          opportunity_id?: string
          skill_id?: string
          source_raw_item_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "opportunity_skills_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunity_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunity_skills_source_raw_item_id_fkey"
            columns: ["source_raw_item_id"]
            isOneToOne: false
            referencedRelation: "raw_items"
            referencedColumns: ["id"]
          },
        ]
      }
      opportunity_sources: {
        Row: {
          created_at: string
          id: string
          match_confidence: number | null
          match_method: string
          opportunity_id: string
          raw_item_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          match_confidence?: number | null
          match_method?: string
          opportunity_id: string
          raw_item_id: string
        }
        Update: {
          created_at?: string
          id?: string
          match_confidence?: number | null
          match_method?: string
          opportunity_id?: string
          raw_item_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "opportunity_sources_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunity_sources_raw_item_id_fkey"
            columns: ["raw_item_id"]
            isOneToOne: false
            referencedRelation: "raw_items"
            referencedColumns: ["id"]
          },
        ]
      }
      opportunity_versions: {
        Row: {
          facts: Json
          facts_hash: string
          id: string
          observed_at: string
          opportunity_id: string
          raw_item_id: string | null
        }
        Insert: {
          facts: Json
          facts_hash: string
          id?: string
          observed_at?: string
          opportunity_id: string
          raw_item_id?: string | null
        }
        Update: {
          facts?: Json
          facts_hash?: string
          id?: string
          observed_at?: string
          opportunity_id?: string
          raw_item_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "opportunity_versions_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunity_versions_raw_item_id_fkey"
            columns: ["raw_item_id"]
            isOneToOne: false
            referencedRelation: "raw_items"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          canonical_name: string
          country_code: string | null
          created_at: string
          id: string
          metadata: Json
          organization_type: string | null
          siren: string | null
          siret: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          canonical_name: string
          country_code?: string | null
          created_at?: string
          id?: string
          metadata?: Json
          organization_type?: string | null
          siren?: string | null
          siret?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          canonical_name?: string
          country_code?: string | null
          created_at?: string
          id?: string
          metadata?: Json
          organization_type?: string | null
          siren?: string | null
          siret?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      public_awards: {
        Row: {
          amount: number | null
          award_date: string | null
          buyer_org_id: string | null
          contract_end_date: string | null
          contract_reference: string | null
          contract_start_date: string | null
          cpv_code: string | null
          created_at: string
          currency: string | null
          dedupe_key: string | null
          duration_months: number | null
          id: string
          lot_reference: string | null
          nature: string | null
          object: string | null
          opportunity_id: string | null
          procedure: string | null
          source_raw_item_id: string | null
          source_record_id: string | null
          supplier_org_id: string | null
        }
        Insert: {
          amount?: number | null
          award_date?: string | null
          buyer_org_id?: string | null
          contract_end_date?: string | null
          contract_reference?: string | null
          contract_start_date?: string | null
          cpv_code?: string | null
          created_at?: string
          currency?: string | null
          dedupe_key?: string | null
          duration_months?: number | null
          id?: string
          lot_reference?: string | null
          nature?: string | null
          object?: string | null
          opportunity_id?: string | null
          procedure?: string | null
          source_raw_item_id?: string | null
          source_record_id?: string | null
          supplier_org_id?: string | null
        }
        Update: {
          amount?: number | null
          award_date?: string | null
          buyer_org_id?: string | null
          contract_end_date?: string | null
          contract_reference?: string | null
          contract_start_date?: string | null
          cpv_code?: string | null
          created_at?: string
          currency?: string | null
          dedupe_key?: string | null
          duration_months?: number | null
          id?: string
          lot_reference?: string | null
          nature?: string | null
          object?: string | null
          opportunity_id?: string | null
          procedure?: string | null
          source_raw_item_id?: string | null
          source_record_id?: string | null
          supplier_org_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_awards_buyer_org_id_fkey"
            columns: ["buyer_org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_awards_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_awards_source_raw_item_id_fkey"
            columns: ["source_raw_item_id"]
            isOneToOne: false
            referencedRelation: "raw_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_awards_supplier_org_id_fkey"
            columns: ["supplier_org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      public_tenders: {
        Row: {
          application_status: string | null
          assigned_to: string | null
          autonomia_score: number | null
          budget_max: number | null
          budget_min: number | null
          buyer_contact_email: string | null
          buyer_name: string | null
          buyer_phone: string | null
          buyer_region: string | null
          buyer_type: string | null
          buyer_website: string | null
          cahier_des_charges_url: string | null
          category: string | null
          contract_end_date: string | null
          contract_start_date: string | null
          currency: string | null
          decision_date: string | null
          description: string | null
          duration_months: number | null
          estimated_budget: number | null
          external_id: string | null
          id: string
          internal_notes: string | null
          lot_count: number | null
          metadata_json: Json | null
          published_date: string | null
          recommendation: string | null
          required_certifications: string[] | null
          required_experience_years: number | null
          required_team_size: number | null
          source: string
          source_url: string | null
          strategic_importance: boolean | null
          subcategory: string | null
          submission_deadline: string | null
          title: string
        }
        Insert: {
          application_status?: string | null
          assigned_to?: string | null
          autonomia_score?: number | null
          budget_max?: number | null
          budget_min?: number | null
          buyer_contact_email?: string | null
          buyer_name?: string | null
          buyer_phone?: string | null
          buyer_region?: string | null
          buyer_type?: string | null
          buyer_website?: string | null
          cahier_des_charges_url?: string | null
          category?: string | null
          contract_end_date?: string | null
          contract_start_date?: string | null
          currency?: string | null
          decision_date?: string | null
          description?: string | null
          duration_months?: number | null
          estimated_budget?: number | null
          external_id?: string | null
          id?: string
          internal_notes?: string | null
          lot_count?: number | null
          metadata_json?: Json | null
          published_date?: string | null
          recommendation?: string | null
          required_certifications?: string[] | null
          required_experience_years?: number | null
          required_team_size?: number | null
          source: string
          source_url?: string | null
          strategic_importance?: boolean | null
          subcategory?: string | null
          submission_deadline?: string | null
          title: string
        }
        Update: {
          application_status?: string | null
          assigned_to?: string | null
          autonomia_score?: number | null
          budget_max?: number | null
          budget_min?: number | null
          buyer_contact_email?: string | null
          buyer_name?: string | null
          buyer_phone?: string | null
          buyer_region?: string | null
          buyer_type?: string | null
          buyer_website?: string | null
          cahier_des_charges_url?: string | null
          category?: string | null
          contract_end_date?: string | null
          contract_start_date?: string | null
          currency?: string | null
          decision_date?: string | null
          description?: string | null
          duration_months?: number | null
          estimated_budget?: number | null
          external_id?: string | null
          id?: string
          internal_notes?: string | null
          lot_count?: number | null
          metadata_json?: Json | null
          published_date?: string | null
          recommendation?: string | null
          required_certifications?: string[] | null
          required_experience_years?: number | null
          required_team_size?: number | null
          source?: string
          source_url?: string | null
          strategic_importance?: boolean | null
          subcategory?: string | null
          submission_deadline?: string | null
          title?: string
        }
        Relationships: []
      }
      raw_items: {
        Row: {
          collector_run_id: string | null
          content_hash: string
          fetched_at: string
          id: string
          media_type: string | null
          payload: Json
          published_at: string | null
          source_id: string
          source_record_id: string | null
          source_url: string | null
        }
        Insert: {
          collector_run_id?: string | null
          content_hash: string
          fetched_at?: string
          id?: string
          media_type?: string | null
          payload: Json
          published_at?: string | null
          source_id: string
          source_record_id?: string | null
          source_url?: string | null
        }
        Update: {
          collector_run_id?: string | null
          content_hash?: string
          fetched_at?: string
          id?: string
          media_type?: string | null
          payload?: Json
          published_at?: string | null
          source_id?: string
          source_record_id?: string | null
          source_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "raw_items_collector_run_id_fkey"
            columns: ["collector_run_id"]
            isOneToOne: false
            referencedRelation: "collector_runs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "raw_items_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "sources"
            referencedColumns: ["id"]
          },
        ]
      }
      scraping_runs: {
        Row: {
          completed_at: string | null
          error_message: string | null
          id: string
          items_duplicated: number | null
          items_found: number | null
          items_new: number | null
          items_updated: number | null
          keywords_used: string | null
          scrape_type: string | null
          source: string
          started_at: string | null
          success: boolean | null
        }
        Insert: {
          completed_at?: string | null
          error_message?: string | null
          id?: string
          items_duplicated?: number | null
          items_found?: number | null
          items_new?: number | null
          items_updated?: number | null
          keywords_used?: string | null
          scrape_type?: string | null
          source: string
          started_at?: string | null
          success?: boolean | null
        }
        Update: {
          completed_at?: string | null
          error_message?: string | null
          id?: string
          items_duplicated?: number | null
          items_found?: number | null
          items_new?: number | null
          items_updated?: number | null
          keywords_used?: string | null
          scrape_type?: string | null
          source?: string
          started_at?: string | null
          success?: boolean | null
        }
        Relationships: []
      }
      skills: {
        Row: {
          aliases: string[]
          category: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          aliases?: string[]
          category?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          aliases?: string[]
          category?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      sources: {
        Row: {
          access_mode: string
          base_url: string | null
          created_at: string
          id: string
          name: string
          notes: string | null
          priority: string
          robots_url: string | null
          source_group: string
          status: string
          terms_url: string | null
          updated_at: string
        }
        Insert: {
          access_mode: string
          base_url?: string | null
          created_at?: string
          id: string
          name: string
          notes?: string | null
          priority: string
          robots_url?: string | null
          source_group: string
          status?: string
          terms_url?: string | null
          updated_at?: string
        }
        Update: {
          access_mode?: string
          base_url?: string | null
          created_at?: string
          id?: string
          name?: string
          notes?: string | null
          priority?: string
          robots_url?: string | null
          source_group?: string
          status?: string
          terms_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      staffing_matches: {
        Row: {
          computed_at: string
          consultant_id: string
          coverage: number | null
          explanation: Json
          hard_skill_gap: boolean
          id: string
          opportunity_id: string
          score: number | null
        }
        Insert: {
          computed_at?: string
          consultant_id: string
          coverage?: number | null
          explanation?: Json
          hard_skill_gap?: boolean
          id?: string
          opportunity_id: string
          score?: number | null
        }
        Update: {
          computed_at?: string
          consultant_id?: string
          coverage?: number | null
          explanation?: Json
          hard_skill_gap?: boolean
          id?: string
          opportunity_id?: string
          score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "staffing_matches_consultant_id_fkey"
            columns: ["consultant_id"]
            isOneToOne: false
            referencedRelation: "consultants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staffing_matches_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          created_at: string | null
          email: string
          id: string
          is_active: boolean | null
          name: string | null
          phone: string | null
          role: string | null
          slack_user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          is_active?: boolean | null
          name?: string | null
          phone?: string | null
          role?: string | null
          slack_user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          is_active?: boolean | null
          name?: string | null
          phone?: string | null
          role?: string | null
          slack_user_id?: string | null
        }
        Relationships: []
      }
      trainings: {
        Row: {
          autonomia_relevance_score: number | null
          category: string | null
          certificate_included: boolean | null
          course_image_url: string | null
          course_url: string | null
          currency: string | null
          description: string | null
          difficulty_level: string | null
          discount_percentage: number | null
          duration_hours: number | null
          enrollment_trend: string | null
          external_id: string | null
          id: string
          instructor_name: string | null
          is_free: boolean | null
          language: string | null
          last_updated: string | null
          posted_date: string | null
          price: number | null
          provider_name: string | null
          rating_stars: number | null
          review_count: number | null
          skills_taught: string[] | null
          source: string
          title: string
          total_students: number | null
        }
        Insert: {
          autonomia_relevance_score?: number | null
          category?: string | null
          certificate_included?: boolean | null
          course_image_url?: string | null
          course_url?: string | null
          currency?: string | null
          description?: string | null
          difficulty_level?: string | null
          discount_percentage?: number | null
          duration_hours?: number | null
          enrollment_trend?: string | null
          external_id?: string | null
          id?: string
          instructor_name?: string | null
          is_free?: boolean | null
          language?: string | null
          last_updated?: string | null
          posted_date?: string | null
          price?: number | null
          provider_name?: string | null
          rating_stars?: number | null
          review_count?: number | null
          skills_taught?: string[] | null
          source: string
          title: string
          total_students?: number | null
        }
        Update: {
          autonomia_relevance_score?: number | null
          category?: string | null
          certificate_included?: boolean | null
          course_image_url?: string | null
          course_url?: string | null
          currency?: string | null
          description?: string | null
          difficulty_level?: string | null
          discount_percentage?: number | null
          duration_hours?: number | null
          enrollment_trend?: string | null
          external_id?: string | null
          id?: string
          instructor_name?: string | null
          is_free?: boolean | null
          language?: string | null
          last_updated?: string | null
          posted_date?: string | null
          price?: number | null
          provider_name?: string | null
          rating_stars?: number | null
          review_count?: number | null
          skills_taught?: string[] | null
          source?: string
          title?: string
          total_students?: number | null
        }
        Relationships: []
      }
      waalaxy_syncs: {
        Row: {
          created_at: string | null
          emails_extracted: number | null
          id: string
          is_active: boolean | null
          last_sync: string | null
          linkedin_profiles_found: number | null
          phones_extracted: number | null
          sync_frequency: string | null
          waalaxy_campaign_id: string | null
          waalaxy_url: string | null
        }
        Insert: {
          created_at?: string | null
          emails_extracted?: number | null
          id?: string
          is_active?: boolean | null
          last_sync?: string | null
          linkedin_profiles_found?: number | null
          phones_extracted?: number | null
          sync_frequency?: string | null
          waalaxy_campaign_id?: string | null
          waalaxy_url?: string | null
        }
        Update: {
          created_at?: string | null
          emails_extracted?: number | null
          id?: string
          is_active?: boolean | null
          last_sync?: string | null
          linkedin_profiles_found?: number | null
          phones_extracted?: number | null
          sync_frequency?: string | null
          waalaxy_campaign_id?: string | null
          waalaxy_url?: string | null
        }
        Relationships: []
      }
      watchlists: {
        Row: {
          created_at: string
          enabled: boolean
          id: string
          last_run_at: string | null
          name: string
          owner_id: string | null
          query: Json
        }
        Insert: {
          created_at?: string
          enabled?: boolean
          id?: string
          last_run_at?: string | null
          name: string
          owner_id?: string | null
          query: Json
        }
        Update: {
          created_at?: string
          enabled?: boolean
          id?: string
          last_run_at?: string | null
          name?: string
          owner_id?: string | null
          query?: Json
        }
        Relationships: []
      }
      webhook_logs: {
        Row: {
          created_at: string | null
          event_type: string | null
          http_status: number | null
          id: string
          payload: Json | null
          response: string | null
          webhook_url: string | null
        }
        Insert: {
          created_at?: string | null
          event_type?: string | null
          http_status?: number | null
          id?: string
          payload?: Json | null
          response?: string | null
          webhook_url?: string | null
        }
        Update: {
          created_at?: string | null
          event_type?: string | null
          http_status?: number | null
          id?: string
          payload?: Json | null
          response?: string | null
          webhook_url?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      missions_qualified: {
        Row: {
          autonomia_score: number | null
          budget_max: number | null
          budget_min: number | null
          category: string | null
          client_industry: string | null
          client_name: string | null
          client_size: string | null
          currency: string | null
          deadline: string | null
          description: string | null
          duration_days: number | null
          experience_level: string | null
          external_id: string | null
          hourly_rate: number | null
          id: string | null
          internal_notes: string | null
          is_active: boolean | null
          is_qualified: boolean | null
          is_remote: boolean | null
          job_description_url: string | null
          last_scraped: string | null
          location: string | null
          match_percentage: number | null
          posted_date: string | null
          recruiter_company: string | null
          recruiter_email: string | null
          recruiter_linkedin_profile: string | null
          recruiter_name: string | null
          recruiter_phone: string | null
          skills: string[] | null
          source: string | null
          source_url: string | null
          start_date: string | null
          subcategory: string | null
          tags: string[] | null
          title: string | null
          tjm: number | null
          updated_date: string | null
        }
        Insert: {
          autonomia_score?: number | null
          budget_max?: number | null
          budget_min?: number | null
          category?: string | null
          client_industry?: string | null
          client_name?: string | null
          client_size?: string | null
          currency?: string | null
          deadline?: string | null
          description?: string | null
          duration_days?: number | null
          experience_level?: string | null
          external_id?: string | null
          hourly_rate?: number | null
          id?: string | null
          internal_notes?: string | null
          is_active?: boolean | null
          is_qualified?: boolean | null
          is_remote?: boolean | null
          job_description_url?: string | null
          last_scraped?: string | null
          location?: string | null
          match_percentage?: number | null
          posted_date?: string | null
          recruiter_company?: string | null
          recruiter_email?: string | null
          recruiter_linkedin_profile?: string | null
          recruiter_name?: string | null
          recruiter_phone?: string | null
          skills?: string[] | null
          source?: string | null
          source_url?: string | null
          start_date?: string | null
          subcategory?: string | null
          tags?: string[] | null
          title?: string | null
          tjm?: number | null
          updated_date?: string | null
        }
        Update: {
          autonomia_score?: number | null
          budget_max?: number | null
          budget_min?: number | null
          category?: string | null
          client_industry?: string | null
          client_name?: string | null
          client_size?: string | null
          currency?: string | null
          deadline?: string | null
          description?: string | null
          duration_days?: number | null
          experience_level?: string | null
          external_id?: string | null
          hourly_rate?: number | null
          id?: string | null
          internal_notes?: string | null
          is_active?: boolean | null
          is_qualified?: boolean | null
          is_remote?: boolean | null
          job_description_url?: string | null
          last_scraped?: string | null
          location?: string | null
          match_percentage?: number | null
          posted_date?: string | null
          recruiter_company?: string | null
          recruiter_email?: string | null
          recruiter_linkedin_profile?: string | null
          recruiter_name?: string | null
          recruiter_phone?: string | null
          skills?: string[] | null
          source?: string | null
          source_url?: string | null
          start_date?: string | null
          subcategory?: string | null
          tags?: string[] | null
          title?: string | null
          tjm?: number | null
          updated_date?: string | null
        }
        Relationships: []
      }
      public_awards_enriched: {
        Row: {
          amount: number | null
          award_date: string | null
          buyer_org_id: string | null
          contract_end_date: string | null
          contract_reference: string | null
          contract_start_date: string | null
          cpv_code: string | null
          created_at: string | null
          currency: string | null
          dedupe_key: string | null
          duration_months: number | null
          effective_end_date: string | null
          end_date_kind: string | null
          id: string | null
          lot_reference: string | null
          nature: string | null
          object: string | null
          opportunity_id: string | null
          procedure: string | null
          source_raw_item_id: string | null
          source_record_id: string | null
          supplier_org_id: string | null
        }
        Insert: {
          amount?: number | null
          award_date?: string | null
          buyer_org_id?: string | null
          contract_end_date?: string | null
          contract_reference?: string | null
          contract_start_date?: string | null
          cpv_code?: string | null
          created_at?: string | null
          currency?: string | null
          dedupe_key?: string | null
          duration_months?: number | null
          effective_end_date?: never
          end_date_kind?: never
          id?: string | null
          lot_reference?: string | null
          nature?: string | null
          object?: string | null
          opportunity_id?: string | null
          procedure?: string | null
          source_raw_item_id?: string | null
          source_record_id?: string | null
          supplier_org_id?: string | null
        }
        Update: {
          amount?: number | null
          award_date?: string | null
          buyer_org_id?: string | null
          contract_end_date?: string | null
          contract_reference?: string | null
          contract_start_date?: string | null
          cpv_code?: string | null
          created_at?: string | null
          currency?: string | null
          dedupe_key?: string | null
          duration_months?: number | null
          effective_end_date?: never
          end_date_kind?: never
          id?: string | null
          lot_reference?: string | null
          nature?: string | null
          object?: string | null
          opportunity_id?: string | null
          procedure?: string | null
          source_raw_item_id?: string | null
          source_record_id?: string | null
          supplier_org_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_awards_buyer_org_id_fkey"
            columns: ["buyer_org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_awards_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_awards_source_raw_item_id_fkey"
            columns: ["source_raw_item_id"]
            isOneToOne: false
            referencedRelation: "raw_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_awards_supplier_org_id_fkey"
            columns: ["supplier_org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      tenders_urgent: {
        Row: {
          application_status: string | null
          assigned_to: string | null
          autonomia_score: number | null
          budget_max: number | null
          budget_min: number | null
          buyer_contact_email: string | null
          buyer_name: string | null
          buyer_phone: string | null
          buyer_region: string | null
          buyer_type: string | null
          buyer_website: string | null
          cahier_des_charges_url: string | null
          category: string | null
          contract_end_date: string | null
          contract_start_date: string | null
          currency: string | null
          decision_date: string | null
          description: string | null
          duration_months: number | null
          estimated_budget: number | null
          external_id: string | null
          id: string | null
          internal_notes: string | null
          lot_count: number | null
          metadata_json: Json | null
          published_date: string | null
          recommendation: string | null
          required_certifications: string[] | null
          required_experience_years: number | null
          required_team_size: number | null
          source: string | null
          source_url: string | null
          strategic_importance: boolean | null
          subcategory: string | null
          submission_deadline: string | null
          title: string | null
        }
        Insert: {
          application_status?: string | null
          assigned_to?: string | null
          autonomia_score?: number | null
          budget_max?: number | null
          budget_min?: number | null
          buyer_contact_email?: string | null
          buyer_name?: string | null
          buyer_phone?: string | null
          buyer_region?: string | null
          buyer_type?: string | null
          buyer_website?: string | null
          cahier_des_charges_url?: string | null
          category?: string | null
          contract_end_date?: string | null
          contract_start_date?: string | null
          currency?: string | null
          decision_date?: string | null
          description?: string | null
          duration_months?: number | null
          estimated_budget?: number | null
          external_id?: string | null
          id?: string | null
          internal_notes?: string | null
          lot_count?: number | null
          metadata_json?: Json | null
          published_date?: string | null
          recommendation?: string | null
          required_certifications?: string[] | null
          required_experience_years?: number | null
          required_team_size?: number | null
          source?: string | null
          source_url?: string | null
          strategic_importance?: boolean | null
          subcategory?: string | null
          submission_deadline?: string | null
          title?: string | null
        }
        Update: {
          application_status?: string | null
          assigned_to?: string | null
          autonomia_score?: number | null
          budget_max?: number | null
          budget_min?: number | null
          buyer_contact_email?: string | null
          buyer_name?: string | null
          buyer_phone?: string | null
          buyer_region?: string | null
          buyer_type?: string | null
          buyer_website?: string | null
          cahier_des_charges_url?: string | null
          category?: string | null
          contract_end_date?: string | null
          contract_start_date?: string | null
          currency?: string | null
          decision_date?: string | null
          description?: string | null
          duration_months?: number | null
          estimated_budget?: number | null
          external_id?: string | null
          id?: string | null
          internal_notes?: string | null
          lot_count?: number | null
          metadata_json?: Json | null
          published_date?: string | null
          recommendation?: string | null
          required_certifications?: string[] | null
          required_experience_years?: number | null
          required_team_size?: number | null
          source?: string | null
          source_url?: string | null
          strategic_importance?: boolean | null
          subcategory?: string | null
          submission_deadline?: string | null
          title?: string | null
        }
        Relationships: []
      }
      top_skills_by_volume: {
        Row: {
          count: number | null
          skill: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

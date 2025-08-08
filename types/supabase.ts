export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      Booking: {
        Row: {
          bookingid: number
          clientid: number | null
          cover_startdate: string | null
          cover_enddate: string | null
          unitcount2025: number | null
          primary_contact: string | null
          primary_email: string | null
          booking_notes: string
          full_request: Json | null
          created_at: string
          created_by: string | null
          edited_at: string | null
          edited_by: string | null
          bookingstatusid: number | null
          coverageid: number | null
        }
        Insert: {
          bookingid?: number
          clientid?: number | null
          cover_startdate?: string | null
          cover_enddate?: string | null
          unitcount2025?: number | null
          primary_contact?: string | null
          primary_email?: string | null
          booking_notes?: string
          full_request?: Json | null
          created_at?: string
          created_by?: string | null
          edited_at?: string | null
          edited_by?: string | null
          bookingstatusid?: number | null
          coverageid?: number | null
        }
        Update: {
          bookingid?: number
          clientid?: number | null
          cover_startdate?: string | null
          cover_enddate?: string | null
          unitcount2025?: number | null
          primary_contact?: string | null
          primary_email?: string | null
          booking_notes?: string
          full_request?: Json | null
          created_at?: string
          created_by?: string | null
          edited_at?: string | null
          edited_by?: string | null
          bookingstatusid?: number | null
          coverageid?: number | null
        }
      }
      BookingDays: {
        Row: {
          bookingdayid: number
          coverage_day: string | null
          start_time: string | null
          end_time: string | null
          bookingid: number | null
          created_at: string
          created_by: string | null
        }
        Insert: {
          bookingdayid?: number
          coverage_day?: string | null
          start_time?: string | null
          end_time?: string | null
          bookingid?: number | null
          created_at?: string
          created_by?: string | null
        }
        Update: {
          bookingdayid?: number
          coverage_day?: string | null
          start_time?: string | null
          end_time?: string | null
          bookingid?: number | null
          created_at?: string
          created_by?: string | null
        }
      }
      BookingExceptionLog: {
        Row: {
          exceptionlogid: number
          bookingid: number | null
          bookingexceptionstatusid: number | null
          resolved: boolean | null
          created_at: string
          created_by: string | null
        }
        Insert: {
          exceptionlogid?: number
          bookingid?: number | null
          bookingexceptionstatusid?: number | null
          resolved?: boolean | null
          created_at?: string
          created_by?: string | null
        }
        Update: {
          exceptionlogid?: number
          bookingid?: number | null
          bookingexceptionstatusid?: number | null
          resolved?: boolean | null
          created_at?: string
          created_by?: string | null
        }
      }
      BookingExceptionStatus: {
        Row: {
          bookingexceptionstatusid: number
          exception_shortdesc: string | null
          exception_longdesc: string | null
          created_at: string
          created_by: string | null
        }
        Insert: {
          bookingexceptionstatusid?: number
          exception_shortdesc?: string | null
          exception_longdesc?: string | null
          created_at?: string
          created_by?: string | null
        }
        Update: {
          bookingexceptionstatusid?: number
          exception_shortdesc?: string | null
          exception_longdesc?: string | null
          created_at?: string
          created_by?: string | null
        }
      }
      BookingStatus: {
        Row: {
          bookingstatusid: number
          bookingstatus_longdesc: string | null
          bookingstatus_shortdesc: string | null
          created_at: string
          created_by: string | null
        }
        Insert: {
          bookingstatusid?: number
          bookingstatus_longdesc?: string | null
          bookingstatus_shortdesc?: string | null
          created_at?: string
          created_by?: string | null
        }
        Update: {
          bookingstatusid?: number
          bookingstatus_longdesc?: string | null
          bookingstatus_shortdesc?: string | null
          created_at?: string
          created_by?: string | null
        }
      }
      Client: {
        Row: {
          clientid: number
          created_at: string
          companyname: string | null
          unitcount2024: number | null
          price2024: number | null
          rate2024: number | null
          increaseperc: number | null
          hasbooking: boolean | null
        }
        Insert: {
          clientid?: number
          created_at?: string
          companyname?: string | null
          unitcount2024?: number | null
          price2024?: number | null
          rate2024?: number | null
          increaseperc?: number | null
          hasbooking?: boolean | null
        }
        Update: {
          clientid?: number
          created_at?: string
          companyname?: string | null
          unitcount2024?: number | null
          price2024?: number | null
          rate2024?: number | null
          increaseperc?: number | null
          hasbooking?: boolean | null
        }
      }
      CoverageConfig: {
        Row: {
          coverageid: number
          coverage_name: string | null
          coverage_shortcode: string | null
          coverage_year: string | null
          coverage_startdate: string | null
          coverage_enddate: string | null
          coverage_notes: string | null
          created_at: string
          created_by: string | null
        }
        Insert: {
          coverageid?: number
          coverage_name?: string | null
          coverage_shortcode?: string | null
          coverage_year?: string | null
          coverage_startdate?: string | null
          coverage_enddate?: string | null
          coverage_notes?: string | null
          created_at?: string
          created_by?: string | null
        }
        Update: {
          coverageid?: number
          coverage_name?: string | null
          coverage_shortcode?: string | null
          coverage_year?: string | null
          coverage_startdate?: string | null
          coverage_enddate?: string | null
          coverage_notes?: string | null
          created_at?: string
          created_by?: string | null
        }
      }
      CoverageDetailConfig: {
        Row: {
          coveragedetailid: number
          coveragedetail_name: string | null
          coveragedetail_date: string | null
          coveragetypeid: number | null
          created_at: string
          created_by: string | null
          coverageid: number | null
        }
        Insert: {
          coveragedetailid?: number
          coveragedetail_name?: string | null
          coveragedetail_date?: string | null
          coveragetypeid?: number | null
          created_at?: string
          created_by?: string | null
          coverageid?: number | null
        }
        Update: {
          coveragedetailid?: number
          coveragedetail_name?: string | null
          coveragedetail_date?: string | null
          coveragetypeid?: number | null
          created_at?: string
          created_by?: string | null
          coverageid?: number | null
        }
      }
      CoverageType: {
        Row: {
          coveragetypeid: number
          coveragetype_shortdesc: string | null
          created_at: string
          created_by: string | null
        }
        Insert: {
          coveragetypeid?: number
          coveragetype_shortdesc?: string | null
          created_at?: string
          created_by?: string | null
        }
        Update: {
          coveragetypeid?: number
          coveragetype_shortdesc?: string | null
          created_at?: string
          created_by?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

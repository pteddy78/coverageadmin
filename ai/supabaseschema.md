| table_name             | column_name              | data_type                   | character_maximum_length | is_nullable | column_default        |
| ---------------------- | ------------------------ | --------------------------- | ------------------------ | ----------- | --------------------- |
| Booking                | bookingid                | bigint                      | null                     | NO          | null                  |
| Booking                | clientid                 | bigint                      | null                     | YES         | null                  |
| Booking                | cover_startdate          | date                        | null                     | YES         | null                  |
| Booking                | cover_enddate            | date                        | null                     | YES         | null                  |
| Booking                | unitcount2025            | numeric                     | null                     | YES         | null                  |
| Booking                | primary_contact          | character varying           | null                     | YES         | null                  |
| Booking                | primary_email            | character varying           | null                     | YES         | null                  |
| Booking                | booking_notes            | text                        | null                     | YES         | ''::text              |
| Booking                | full_request             | jsonb                       | null                     | YES         | null                  |
| Booking                | created_at               | timestamp with time zone    | null                     | NO          | now()                 |
| Booking                | created_by               | uuid                        | null                     | YES         | gen_random_uuid()     |
| Booking                | edited_at                | timestamp without time zone | null                     | YES         | now()                 |
| Booking                | edited_by                | uuid                        | null                     | YES         | gen_random_uuid()     |
| Booking                | bookingstatusid          | bigint                      | null                     | YES         | null                  |
| Booking                | coverageid               | bigint                      | null                     | YES         | null                  |
| BookingDays            | bookingdayid             | bigint                      | null                     | NO          | null                  |
| BookingDays            | coverage_day             | date                        | null                     | YES         | null                  |
| BookingDays            | start_time               | character varying           | null                     | YES         | null                  |
| BookingDays            | end_time                 | character varying           | null                     | YES         | null                  |
| BookingDays            | bookingid                | bigint                      | null                     | YES         | null                  |
| BookingDays            | created_at               | timestamp with time zone    | null                     | NO          | now()                 |
| BookingDays            | created_by               | uuid                        | null                     | YES         | auth.uid()            |
| BookingExceptionLog    | exceptionlogid           | bigint                      | null                     | NO          | null                  |
| BookingExceptionLog    | bookingid                | bigint                      | null                     | YES         | null                  |
| BookingExceptionLog    | bookingexceptionstatusid | bigint                      | null                     | YES         | null                  |
| BookingExceptionLog    | resolved                 | boolean                     | null                     | YES         | null                  |
| BookingExceptionLog    | created_at               | timestamp with time zone    | null                     | NO          | now()                 |
| BookingExceptionLog    | created_by               | uuid                        | null                     | YES         | auth.uid()            |
| BookingExceptionStatus | bookingexceptionstatusid | bigint                      | null                     | NO          | null                  |
| BookingExceptionStatus | exception_shortdesc      | character varying           | null                     | YES         | null                  |
| BookingExceptionStatus | exception_longdesc       | character varying           | null                     | YES         | null                  |
| BookingExceptionStatus | created_at               | timestamp with time zone    | null                     | NO          | now()                 |
| BookingExceptionStatus | created_by               | uuid                        | null                     | YES         | auth.uid()            |
| BookingStatus          | bookingstatusid          | bigint                      | null                     | NO          | null                  |
| BookingStatus          | bookingstatus_longdesc   | character varying           | null                     | YES         | ''::character varying |
| BookingStatus          | bookingstatus_shortdesc  | character varying           | null                     | YES         | ''::character varying |
| BookingStatus          | created_at               | timestamp with time zone    | null                     | NO          | now()                 |
| BookingStatus          | created_by               | uuid                        | null                     | YES         | gen_random_uuid()     |
| Client                 | clientid                 | bigint                      | null                     | NO          | null                  |
| Client                 | created_at               | timestamp with time zone    | null                     | NO          | now()                 |
| Client                 | companyname              | character varying           | null                     | YES         | null                  |
| Client                 | unitcount2024            | bigint                      | null                     | YES         | null                  |
| Client                 | price2024                | numeric                     | null                     | YES         | null                  |
| Client                 | rate2024                 | numeric                     | null                     | YES         | null                  |
| Client                 | increaseperc             | numeric                     | null                     | YES         | null                  |
| Client                 | hasbooking               | boolean                     | null                     | YES         | null                  |
| CoverageConfig         | coverageid               | bigint                      | null                     | NO          | null                  |
| CoverageConfig         | coverage_name            | character varying           | null                     | YES         | null                  |
| CoverageConfig         | coverage_shortcode       | character varying           | null                     | YES         | null                  |
| CoverageConfig         | coverage_year            | character varying           | null                     | YES         | null                  |
| CoverageConfig         | coverage_startdate       | date                        | null                     | YES         | null                  |
| CoverageConfig         | coverage_enddate         | date                        | null                     | YES         | null                  |
| CoverageConfig         | coverage_notes           | character varying           | null                     | YES         | null                  |
| CoverageConfig         | created_at               | timestamp with time zone    | null                     | NO          | now()                 |
| CoverageConfig         | created_by               | uuid                        | null                     | YES         | auth.uid()            |
| CoverageDetailConfig   | coveragedetailid         | bigint                      | null                     | NO          | null                  |
| CoverageDetailConfig   | coveragedetail_name      | character varying           | null                     | YES         | null                  |
| CoverageDetailConfig   | coveragedetail_date      | date                        | null                     | YES         | null                  |
| CoverageDetailConfig   | coveragetypeid           | bigint                      | null                     | YES         | null                  |
| CoverageDetailConfig   | created_at               | timestamp with time zone    | null                     | NO          | now()                 |
| CoverageDetailConfig   | created_by               | uuid                        | null                     | YES         | auth.uid()            |
| CoverageDetailConfig   | coverageid               | bigint                      | null                     | YES         | null                  |
| CoverageType           | coveragetypeid           | bigint                      | null                     | NO          | null                  |
| CoverageType           | coveragetype_shortdesc   | character varying           | null                     | YES         | null                  |
| CoverageType           | created_at               | timestamp with time zone    | null                     | NO          | now()                 |
| CoverageType           | created_by               | uuid                        | null                     | YES         | auth.uid()            |